/**
 * Open-model finder (models.html).
 *
 * Loads data/open-models.json (the models, the machines and the quantization
 * steps) and narrows the list to what fits: the chosen machine, a minimum
 * speed and quality, capabilities, use case, context window, license and
 * origin. Memory and speed come from assets/model-finder.js.
 *
 * Everything the visitor chose lives in the URL (?hw=&n=&speed=&quant=&caps=
 * &use=&ctx=&license=&origin=&q=&sort=&all=&cmp=&model=), so a result, an
 * open model and a comparison can be bookmarked and shared.
 *
 * The page chrome (theme, language, menu, static translations) repeats the few
 * lines of assets/app.js on purpose: the two pages share no state.
 */
(function () {
  'use strict';

  const OFFLINE = Boolean(window.MARKETPLACE_CONFIG && window.MARKETPLACE_CONFIG.offline);
  const Finder = window.ModelFinder;
  const I18N = window.MARKETPLACE_I18N || { en: {} };
  const STORAGE = { theme: 'ihub-marketplace-theme', lang: 'ihub-marketplace-lang' };
  const HF = 'https://huggingface.co/';
  const MAX_COMPARE = 4;
  /** Rows shown at first, and added by each press of "Show more": a phone gets fewer, so nobody scrolls through 58 cards. */
  const PAGE_SIZE = { wide: 25, narrow: 12 };
  /** Below this width the finder is a stack of cards with folded filters (the same breakpoint as assets/styles.css). */
  const NARROW = window.matchMedia('(max-width: 820px)');
  const CAPABILITIES = ['vision', 'video', 'audio', 'tools', 'reasoning', 'german'];
  const HARDWARE_GROUPS = ['consumer', 'workstation', 'datacenter', 'apple', 'unified', 'cpu'];
  /** The direction a column sorts in when it is chosen first: text A–Z, numbers and dates the interesting end first. */
  const SORT_DEFAULT_DIR = { name: 'asc', released: 'desc', size: 'desc', context: 'desc', license: 'asc', memory: 'asc', speed: 'desc' };
  const LICENSE_RANK = { permissive: 0, conditional: 1, 'non-commercial': 2 };
  /** What a row is sorted by; a missing value (not stated, or no machine chosen) always sorts last. */
  const SORT_VALUE = {
    name: row => row.model.name,
    released: row => row.model.released,
    size: row => row.model.paramsB,
    context: row => row.model.contextWindow,
    license: row => `${LICENSE_RANK[row.model.license.category]} ${row.model.license.name}`,
    memory: row => row.run.memoryGB,
    speed: row => (row.run.fits ? row.run.tokensPerSecond : null)
  };
  const EUROPE = ['EU', 'AT', 'BE', 'CH', 'CZ', 'DE', 'DK', 'ES', 'FI', 'FR', 'GB', 'IE', 'IT', 'NL', 'NO', 'PL', 'PT', 'SE'];
  const RIGHTS = ['commercialUse', 'selfHosting', 'offerAsService', 'modifications'];

  const DEFAULTS = {
    hw: '',
    count: 1,
    mem: '',
    bw: '',
    speed: 0,
    quant: 4,
    caps: [],
    use: '',
    ctx: 0,
    license: '',
    origin: '',
    q: '',
    sort: '',
    dir: 'asc',
    all: false
  };

  const state = Object.assign({}, DEFAULTS, { lang: 'en', compare: [], modelId: '', limit: 0 });
  let data = { models: [], hardware: [], quantizations: [], updated: '' };
  let lastFocus = null;
  let searchTimer = null;
  let toastTimer = null;

  const $ = id => document.getElementById(id);

  // ---------- Storage, i18n, formatting ----------

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Preferences are a convenience; ignore storage failures
    }
  }

  function t(key, params) {
    let text = (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
    if (params) {
      Object.keys(params).forEach(name => {
        text = text.split(`{${name}}`).join(params[name]);
      });
    }
    return text;
  }

  function localized(map) {
    if (!map) return '';
    if (typeof map === 'string') return map;
    return map[state.lang] || map.en || '';
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatNumber(value, digits) {
    return new Intl.NumberFormat(state.lang, { maximumFractionDigits: digits ?? 0 }).format(value);
  }

  /** 27.8 → "27.8", 397 → "397", 2446 → "2,446": one decimal only where it says something. */
  function formatParams(billions) {
    return formatNumber(billions, billions < 100 ? 1 : 0);
  }

  /** 262144 → "262K", 1048576 → "1M" */
  function formatContext(tokens) {
    if (!tokens) return '';
    if (tokens >= 1000000) return `${formatNumber(tokens / 1000000, 1)}M`;
    return `${formatNumber(Math.round(tokens / 1000))}K`;
  }

  function formatGB(value) {
    return formatNumber(value, value < 10 ? 1 : 0);
  }

  function formatDate(iso) {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return iso;
    return new Intl.DateTimeFormat(state.lang, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(date);
  }

  function formatSpeed(speed) {
    if (speed === null || speed === undefined) return '';
    if (speed >= Finder.MAX_SPEED) return t('om.row.speedMax', { n: formatNumber(Finder.MAX_SPEED) });
    return t('om.row.speed', { n: formatNumber(speed < 10 ? Math.round(speed * 10) / 10 : Math.round(speed), 1) });
  }

  function quantName(quantization) {
    if (quantization.id === 'native') {
      return t('om.quant.name.native', { precision: String(quantization.precision || '').toUpperCase() });
    }
    return t(`om.quant.name.${quantization.id}`);
  }

  function applyStaticTranslations() {
    document.documentElement.lang = state.lang;
    if (OFFLINE) {
      document.querySelectorAll('[data-offline-href]').forEach(el => {
        el.setAttribute('href', el.dataset.offlineHref);
      });
    }
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    // Static, trusted strings from the i18n files that contain inline markup
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
    });
    $('lang-toggle').textContent = state.lang === 'de' ? 'EN' : 'DE';
    document.title = `${t('nav.models')} – iHub Marketplace`;
  }

  function showToast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2200);
  }

  // ---------- URL state ----------

  function readUrlState() {
    const params = new URLSearchParams(window.location.search);
    const number = (name, fallback) => {
      const value = Number(params.get(name));
      return Number.isFinite(value) && value > 0 ? value : fallback;
    };
    state.hw = params.get('hw') || '';
    state.count = [1, 2, 4, 8].includes(number('n', 1)) ? number('n', 1) : 1;
    state.mem = params.get('mem') || '';
    state.bw = params.get('bw') || '';
    state.speed = number('speed', 0);
    state.quant = [4, 6, 8, 16].includes(number('quant', 4)) ? number('quant', 4) : 4;
    state.caps = (params.get('caps') || '').split(',').filter(cap => CAPABILITIES.includes(cap));
    state.use = params.get('use') || '';
    state.ctx = number('ctx', 0);
    state.license = ['permissive', 'commercial'].includes(params.get('license')) ? params.get('license') : '';
    state.origin = ['eu', 'us', 'cn', 'other'].includes(params.get('origin')) ? params.get('origin') : '';
    state.q = params.get('q') || '';
    const sort = params.get('sort');
    state.sort = Object.hasOwn(SORT_DEFAULT_DIR, sort) ? sort : '';
    const dir = params.get('dir');
    state.dir = SORT_DEFAULT_DIR[state.sort] || 'asc';
    if (dir === 'asc' || dir === 'desc') state.dir = dir;
    state.all = params.get('all') === '1';
    state.compare = (params.get('cmp') || '').split(',').filter(Boolean).slice(0, MAX_COMPARE);
    state.modelId = params.get('model') || '';
    const lang = params.get('lang');
    if (lang === 'en' || lang === 'de') state.lang = lang;
  }

  function writeUrlState() {
    const params = new URLSearchParams();
    if (state.hw) params.set('hw', state.hw);
    if (state.hw && state.count > 1) params.set('n', String(state.count));
    if (state.hw === 'custom' && state.mem) params.set('mem', state.mem);
    if (state.hw === 'custom' && state.bw) params.set('bw', state.bw);
    if (state.speed) params.set('speed', String(state.speed));
    if (state.quant !== DEFAULTS.quant) params.set('quant', String(state.quant));
    if (state.caps.length) params.set('caps', state.caps.join(','));
    if (state.use) params.set('use', state.use);
    if (state.ctx) params.set('ctx', String(state.ctx));
    if (state.license) params.set('license', state.license);
    if (state.origin) params.set('origin', state.origin);
    if (state.q) params.set('q', state.q);
    if (state.sort) {
      params.set('sort', state.sort);
      if (state.dir !== SORT_DEFAULT_DIR[state.sort]) params.set('dir', state.dir);
    }
    if (state.all) params.set('all', '1');
    if (state.compare.length) params.set('cmp', state.compare.join(','));
    if (state.modelId) params.set('model', state.modelId);
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  }

  // ---------- Hardware ----------

  /** The chosen machine, or null: a listed one, or the visitor's own memory and bandwidth. */
  function selectedHardware() {
    if (state.hw === 'custom') {
      const memory = Number(state.mem);
      if (!(memory > 0)) return null;
      const bandwidth = Number(state.bw);
      return { id: 'custom', name: `${formatNumber(memory)} GB`, kind: 'gpu', memoryGB: memory, bandwidthGBs: bandwidth > 0 ? bandwidth : null };
    }
    return data.hardware.find(hardware => hardware.id === state.hw) || null;
  }

  function hardwareCount(hardware) {
    return hardware && hardware.kind === 'gpu' && hardware.id !== 'custom' ? state.count : 1;
  }

  function hardwareLabel(hardware, count) {
    return count > 1 ? `${count}× ${hardware.name}` : hardware.name;
  }

  function evaluate(model, hardware, count) {
    return Finder.evaluate(model, {
      hardware,
      count,
      quantizations: data.quantizations,
      minBits: state.quant
    });
  }

  // ---------- Filtering ----------

  function capabilitiesOf(model) {
    const caps = [];
    if (model.inputModalities.includes('image')) caps.push('vision');
    if (model.inputModalities.includes('video')) caps.push('video');
    if (model.inputModalities.includes('audio')) caps.push('audio');
    if (model.toolCalling === 'yes') caps.push('tools');
    if (model.reasoning === 'always' || model.reasoning === 'toggle') caps.push('reasoning');
    if (model.languages && model.languages.german === 'yes') caps.push('german');
    return caps;
  }

  function originOf(model) {
    if (EUROPE.includes(model.country)) return 'eu';
    if (model.country === 'US') return 'us';
    if (model.country === 'CN') return 'cn';
    return 'other';
  }

  function matchesFilters(model) {
    const caps = capabilitiesOf(model);
    if (!state.caps.every(cap => caps.includes(cap))) return false;
    if (state.use && !model.bestFor.includes(state.use)) return false;
    if (state.ctx && !(model.contextWindow >= state.ctx)) return false;
    if (state.license === 'permissive' && model.license.category !== 'permissive') return false;
    if (state.license === 'commercial' && model.license.commercialUse === 'no') return false;
    if (state.origin && originOf(model) !== state.origin) return false;
    const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length) {
      const haystack = [model.name, model.family, model.vendor, model.huggingface, model.license.name].join(' ').toLowerCase();
      if (!terms.every(term => haystack.includes(term))) return false;
    }
    return true;
  }

  const isMissing = value => value === null || value === undefined;

  /** Compares two rows by a column; a missing value comes last in either direction. */
  function compareBy(key, dir) {
    return (a, b) => {
      const x = SORT_VALUE[key](a);
      const y = SORT_VALUE[key](b);
      if (isMissing(x) || isMissing(y)) return Number(isMissing(x)) - Number(isMissing(y));
      const order = typeof x === 'string' ? x.localeCompare(y, state.lang, { numeric: true }) : x - y;
      return dir === 'asc' ? order : -order;
    };
  }

  /** The rows to show: every model that passes the filters, with how it runs on the chosen machine. */
  function results() {
    const hardware = selectedHardware();
    const count = hardwareCount(hardware);
    const all = data.models.filter(matchesFilters).map(model => ({ model, run: evaluate(model, hardware, count) }));
    const fitting = all.filter(({ run }) => {
      if (!hardware) return true;
      if (!run.fits) return false;
      return !state.speed || run.tokensPerSecond === null || run.tokensPerSecond >= state.speed;
    });
    const rows = (hardware && state.all ? all : fitting).map(row => ({ ...row, ok: fitting.includes(row) }));
    const newest = (a, b) => b.model.released.localeCompare(a.model.released);
    const largest = (a, b) => b.model.paramsB - a.model.paramsB;
    // Recommended: with a machine, the largest model that fits comes first (it
    // is usually the most capable one the machine can run); without, the newest
    let order = hardware ? largest : newest;
    if (state.sort) order = compareBy(state.sort, state.dir);
    // Models that do not fit stay below the ones that do, whatever the order
    rows.sort((a, b) => Number(b.ok) - Number(a.ok) || order(a, b) || newest(a, b));
    return { rows, fitting: fitting.length, total: data.models.length, hardware, count };
  }

  // ---------- Rendering: filters ----------

  function renderHardwareOptions() {
    const select = $('om-hw');
    const groups = HARDWARE_GROUPS.map(group => {
      const options = data.hardware
        .filter(hardware => hardware.group === group)
        .map(hardware => `<option value="${escapeHtml(hardware.id)}">${escapeHtml(hardware.name)}</option>`)
        .join('');
      return options ? `<optgroup label="${escapeHtml(t(`om.hw.group.${group}`))}">${options}</optgroup>` : '';
    }).join('');
    select.innerHTML =
      `<option value="">${escapeHtml(t('om.hw.any'))}</option>${groups}` +
      `<option value="custom">${escapeHtml(t('om.hw.custom'))}</option>`;
    if (state.hw && state.hw !== 'custom' && !data.hardware.some(hardware => hardware.id === state.hw)) state.hw = '';
    select.value = state.hw;
  }

  function renderUseOptions() {
    const counts = {};
    data.models.forEach(model => model.bestFor.forEach(use => (counts[use] = (counts[use] || 0) + 1)));
    const uses = Object.keys(counts).sort((a, b) => t(`om.use.${a}`).localeCompare(t(`om.use.${b}`), state.lang));
    if (state.use && !counts[state.use]) state.use = '';
    $('om-use').innerHTML =
      `<option value="">${escapeHtml(t('om.use.any'))}</option>` +
      uses.map(use => `<option value="${escapeHtml(use)}">${escapeHtml(t(`om.use.${use}`))}</option>`).join('');
    $('om-use').value = state.use;
  }

  function renderCapabilityChips() {
    $('om-caps').innerHTML = CAPABILITIES.map(
      cap =>
        `<button type="button" class="chip" data-cap="${cap}" aria-pressed="${state.caps.includes(cap)}">${escapeHtml(t(`om.cap.${cap}`))}</button>`
    ).join('');
  }

  function renderHardwareFields() {
    const hardware = selectedHardware();
    const custom = state.hw === 'custom';
    $('om-mem-field').hidden = !custom;
    $('om-bw-field').hidden = !custom;
    const listed = data.hardware.find(entry => entry.id === state.hw);
    $('om-count-field').hidden = !(listed && listed.kind === 'gpu');
    $('om-all-label').hidden = !hardware;
    let hint;
    if (!hardware) hint = t(state.speed ? 'om.hw.hint.speedNeedsHw' : 'om.hw.hint.none');
    else {
      const memory = formatGB(Finder.usableMemoryGB(hardware, hardwareCount(hardware)));
      hint = hardware.bandwidthGBs
        ? t('om.hw.hint.selected', { memory, bandwidth: formatNumber(hardware.bandwidthGBs) })
        : t('om.hw.hint.noSpeed', { memory });
    }
    $('om-hw-hint').textContent = hint;
  }

  /** Shows the sort in the dropdown, the direction button and the column headers. */
  function syncSort() {
    $('om-sort').value = state.sort;
    const button = $('om-sort-dir');
    button.disabled = !state.sort;
    button.textContent = state.dir === 'asc' ? '↑' : '↓';
    button.setAttribute('aria-label', t(state.dir === 'asc' ? 'om.sort.ascending' : 'om.sort.descending'));
    const aria = { asc: 'ascending', desc: 'descending' }[state.dir];
    document.querySelectorAll('#om-table th[data-sort-col]').forEach(th => {
      th.setAttribute('aria-sort', th.dataset.sortCol === state.sort ? aria : 'none');
    });
  }

  /** A column header was pressed: sort by it, or reverse the order when it already is the sort. */
  function sortBy(key) {
    if (state.sort === key) state.dir = state.dir === 'asc' ? 'desc' : 'asc';
    else {
      state.sort = key;
      state.dir = SORT_DEFAULT_DIR[key];
    }
    syncSort();
    update();
  }

  function syncInputs() {
    $('om-hw').value = state.hw;
    $('om-count').value = String(state.count);
    $('om-mem').value = state.mem;
    $('om-bw').value = state.bw;
    $('om-speed').value = String(state.speed);
    $('om-quant').value = String(state.quant);
    $('om-use').value = state.use;
    $('om-ctx').value = String(state.ctx);
    $('om-license').value = state.license;
    $('om-origin').value = state.origin;
    $('om-search').value = state.q;
    syncSort();
    $('om-all').checked = state.all;
  }

  // ---------- Rendering: table ----------

  function licenseBadge(model) {
    const category = model.license.category;
    return `<span class="badge badge-license-${escapeHtml(category)}" title="${escapeHtml(t(`om.license.cat.${category}`))}">${escapeHtml(model.license.name)}</span>`;
  }

  function capabilityTags(model) {
    return capabilitiesOf(model)
      .filter(cap => cap !== 'german')
      .map(cap => `<span class="tag">${escapeHtml(t(`om.cap.short.${cap}`))}</span>`)
      .join('');
  }

  function sizeHtml(model) {
    const active =
      model.architecture === 'moe' && model.activeParamsB
        ? `<span class="om-sub">${escapeHtml(t('om.row.active', { n: formatParams(model.activeParamsB) }))}</span>`
        : '';
    return `<span class="om-num">${escapeHtml(t('om.row.params', { n: formatParams(model.paramsB) }))}</span>${active}`;
  }

  function memoryHtml(run, hardware) {
    const amount = formatGB(run.memoryGB);
    if (hardware && !run.fits) {
      return `<span class="om-num om-bad">${escapeHtml(t('om.row.noFit'))}</span><span class="om-sub">${escapeHtml(t('om.row.missing', { n: amount }))}</span>`;
    }
    const text = hardware ? t('om.row.memory', { n: amount }) : t('om.row.memoryFrom', { n: amount });
    return `<span class="om-num">${escapeHtml(text)}</span><span class="om-sub">${escapeHtml(quantName(run.quantization))}</span>`;
  }

  function speedHtml(run, hardware) {
    if (!hardware || !run.fits || run.tokensPerSecond === null) return '<span class="om-sub">–</span>';
    const slow = state.speed && run.tokensPerSecond < state.speed;
    return `<span class="om-num${slow ? ' om-bad' : ''}">${escapeHtml(formatSpeed(run.tokensPerSecond))}</span>`;
  }

  function renderRow({ model, run, ok }, hardware) {
    const selected = state.compare.includes(model.id);
    return `
      <tr class="om-row${ok ? '' : ' om-row-off'}" data-model="${escapeHtml(model.id)}">
        <td class="om-col-check">
          <input type="checkbox" data-compare="${escapeHtml(model.id)}" ${selected ? 'checked' : ''}
            aria-label="${escapeHtml(t('om.row.compare', { name: model.name }))}" />
        </td>
        <th scope="row" class="om-col-model">
          <a href="?model=${encodeURIComponent(model.id)}" data-open="${escapeHtml(model.id)}">${escapeHtml(model.name)}</a>
          <span class="om-sub">${escapeHtml(model.vendor)} · ${escapeHtml(formatDate(model.released))}</span>
        </th>
        <td class="om-c-size" data-label="${escapeHtml(t('om.col.size'))}">${sizeHtml(model)}</td>
        <td class="om-c-context" data-label="${escapeHtml(t('om.col.context'))}"><span class="om-num">${escapeHtml(formatContext(model.contextWindow) || '–')}</span></td>
        <td class="om-c-caps" data-label="${escapeHtml(t('om.col.capabilities'))}"><span class="tags">${capabilityTags(model) || '–'}</span></td>
        <td class="om-c-license" data-label="${escapeHtml(t('om.col.license'))}">${licenseBadge(model)}</td>
        <td class="om-c-memory" data-label="${escapeHtml(t('om.col.memory'))}">${memoryHtml(run, hardware)}</td>
        <td class="om-c-speed" data-label="${escapeHtml(t('om.col.speed'))}">${speedHtml(run, hardware)}</td>
      </tr>`;
  }

  function pageSize() {
    return NARROW.matches ? PAGE_SIZE.narrow : PAGE_SIZE.wide;
  }

  /** How many of the filters in the folded "More filters" group are set. */
  function moreFilterCount() {
    return state.caps.length + [state.use, state.ctx, state.license, state.origin, state.q].filter(Boolean).length;
  }

  function renderMoreFilters() {
    const count = moreFilterCount();
    $('om-more-count').hidden = count === 0;
    $('om-more-count').textContent = String(count);
  }

  function renderResults() {
    const { rows, fitting, total, hardware, count } = results();
    if (!state.limit) state.limit = pageSize();
    const shown = rows.slice(0, state.limit);
    $('om-rows').innerHTML = shown.map(row => renderRow(row, hardware)).join('');
    $('om-table-wrap').hidden = rows.length === 0;
    $('om-empty').hidden = rows.length !== 0;
    const rest = rows.length - shown.length;
    $('om-more-wrap').hidden = rest <= 0;
    $('om-more-btn').textContent = t('om.results.more', { n: Math.min(rest, pageSize()), rest });
    $('om-count-text').textContent = hardware
      ? t('om.results.countFit', { shown: fitting, total, hardware: hardwareLabel(hardware, count) })
      : t('om.results.count', { shown: fitting, total });
    renderMoreFilters();
    renderHardwareFields();
    renderCompareBar();
  }

  function renderStats() {
    const vendors = new Set(data.models.map(model => model.vendor)).size;
    const permissive = data.models.filter(model => model.license.category === 'permissive').length;
    const stats = [
      [data.models.length, 'om.stats.models'],
      [vendors, 'om.stats.vendors'],
      [permissive, 'om.stats.permissive']
    ];
    $('om-stats').innerHTML = stats
      .map(
        ([value, key]) =>
          `<div class="stat stat-static"><span class="stat-value">${value}</span><span class="stat-label">${escapeHtml(t(key))}</span></div>`
      )
      .join('');
    const updated = data.updated ? t('om.updated', { date: formatDate(data.updated) }) : '';
    $('om-updated').textContent = updated;
    $('om-updated-foot').textContent = updated;
  }

  // ---------- Rendering: comparison ----------

  function compareModels() {
    return state.compare.map(id => data.models.find(model => model.id === id)).filter(Boolean);
  }

  function renderCompareBar() {
    const count = compareModels().length;
    $('om-compare-bar').hidden = count === 0;
    $('om-compare-text').textContent =
      count < 2 ? t('om.compare.hint', { max: MAX_COMPARE }) : t('om.compare.selected', { n: count });
    $('om-compare-open').disabled = count < 2;
  }

  function toggleCompare(id) {
    if (state.compare.includes(id)) state.compare = state.compare.filter(entry => entry !== id);
    else if (state.compare.length >= MAX_COMPARE) {
      showToast(t('om.compare.max', { max: MAX_COMPARE }));
      return false;
    } else state.compare = [...state.compare, id];
    writeUrlState();
    return true;
  }

  function valueLabel(value) {
    return t(`om.value.${['yes', 'no', 'conditions'].includes(value) ? value : 'unknown'}`);
  }

  function valueMark(value) {
    const kind = ['yes', 'no', 'conditions'].includes(value) ? value : 'unknown';
    return `<span class="mark mark-${kind}">${escapeHtml(valueLabel(value))}</span>`;
  }

  function modalities(list) {
    return list.map(entry => t(`om.modality.${entry}`)).join(', ');
  }

  function reasoningLabel(model) {
    return ['always', 'toggle', 'none'].includes(model.reasoning) ? t(`om.reasoning.${model.reasoning}`) : t('om.value.unknown');
  }

  function languagesLabel(model) {
    const languages = model.languages || {};
    const parts = [];
    if (languages.count) parts.push(t('om.detail.languageCount', { n: formatNumber(languages.count) }));
    if (languages.german === 'yes') parts.push(t('om.detail.german'));
    return parts.join(' · ') || t('om.value.unknown');
  }

  function parametersLabel(model) {
    const total = t('om.row.params', { n: formatParams(model.paramsB) });
    return model.architecture === 'moe' && model.activeParamsB
      ? `${total} · ${t('om.row.active', { n: formatParams(model.activeParamsB) })}`
      : total;
  }

  function renderCompare() {
    const models = compareModels();
    const hardware = selectedHardware();
    const count = hardwareCount(hardware);
    const runs = models.map(model => evaluate(model, hardware, count));
    const rows = [
      [t('om.detail.vendor'), model => escapeHtml(model.vendor)],
      [t('om.detail.released', { date: '' }).trim(), model => escapeHtml(formatDate(model.released))],
      [t('om.detail.parameters'), model => escapeHtml(parametersLabel(model))],
      [t('om.detail.architecture'), model => escapeHtml(t(`om.row.${model.architecture === 'moe' ? 'moe' : 'dense'}`))],
      [t('om.detail.context'), model => escapeHtml(model.contextWindow ? t('om.row.tokens', { n: formatNumber(model.contextWindow) }) : t('om.row.unknown'))],
      [t('om.detail.input'), model => escapeHtml(modalities(model.inputModalities))],
      [t('om.detail.reasoning'), model => escapeHtml(reasoningLabel(model))],
      [t('om.detail.tools'), model => valueMark(model.toolCalling)],
      [t('om.detail.languages'), model => escapeHtml(languagesLabel(model))],
      [t('om.detail.bestFor'), model => model.bestFor.map(use => `<span class="tag">${escapeHtml(t(`om.use.${use}`))}</span>`).join(' ')],
      [t('om.detail.strengths'), model => escapeHtml(localized(model.strengths))],
      [t('om.detail.license'), model => `${licenseBadge(model)}<span class="om-sub">${escapeHtml(t(`om.license.cat.${model.license.category}`))}</span>`],
      ...RIGHTS.map(right => [t(`om.right.${right}`), model => valueMark(model.license[right])]),
      [t('om.detail.conditions'), model => conditionsHtml(model) || '–'],
      [
        hardware ? `${t('om.col.memory')} (${hardwareLabel(hardware, count)})` : t('om.col.memory'),
        (model, index) => memoryHtml(runs[index], hardware)
      ],
      ...(hardware ? [[t('om.col.speed'), (model, index) => speedHtml(runs[index], hardware)]] : [])
    ];
    const head = models
      .map(
        model =>
          `<th scope="col"><a href="?model=${encodeURIComponent(model.id)}" data-open="${escapeHtml(model.id)}">${escapeHtml(model.name)}</a>
            <button type="button" class="link-btn" data-compare-remove="${escapeHtml(model.id)}">${escapeHtml(t('om.compare.remove'))}</button></th>`
      )
      .join('');
    const body = rows
      .map(
        ([label, cell]) =>
          `<tr><th scope="row">${escapeHtml(label)}</th>${models.map((model, index) => `<td>${cell(model, index)}</td>`).join('')}</tr>`
      )
      .join('');
    $('om-compare-body').innerHTML = `<table class="compare-table"><thead><tr><td></td>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }

  function openCompare() {
    if (compareModels().length < 2) return;
    renderCompare();
    const dialog = $('om-compare');
    if (!dialog.open) dialog.showModal();
    syncScrollLock();
  }

  // ---------- Rendering: detail panel ----------

  function metaRow(label, valueHtml, stacked) {
    return `<div class="meta-row${stacked ? ' stacked' : ''}"><dt>${escapeHtml(label)}</dt><dd>${valueHtml}</dd></div>`;
  }

  function conditionsHtml(model) {
    const conditions = (model.license.conditions && (model.license.conditions[state.lang] || model.license.conditions.en)) || [];
    if (!conditions.length) return '';
    return `<ul class="plain-list">${conditions.map(entry => `<li>${escapeHtml(entry)}</li>`).join('')}</ul>`;
  }

  /** A link that leaves the site; the offline bundle shows the plain text instead. */
  function externalLink(url, label) {
    if (OFFLINE || !/^https:\/\//i.test(url || '')) return escapeHtml(label);
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
  }

  function repoLink(repo) {
    return externalLink(HF + repo, repo);
  }

  /** Per group of machines, the smallest one that holds the model at the allowed quality. */
  function smallestMachines(model) {
    return HARDWARE_GROUPS.map(group => {
      const machines = data.hardware
        .filter(hardware => hardware.group === group)
        .sort((a, b) => Finder.usableMemoryGB(a, 1) - Finder.usableMemoryGB(b, 1));
      for (const hardware of machines) {
        const run = evaluate(model, hardware, 1);
        if (run.fits) return { hardware, run };
      }
      return null;
    }).filter(Boolean);
  }

  function hardwareSection(model) {
    const hardware = selectedHardware();
    const count = hardwareCount(hardware);
    const quantRows = Finder.quantizationsFor(model, data.quantizations)
      .map(quantization => {
        const memory = Finder.memoryGB(model, quantization);
        let onMachine = '';
        if (hardware) {
          const fits = memory <= Finder.usableMemoryGB(hardware, count);
          const speed = fits ? Finder.tokensPerSecond(model, quantization, hardware, count) : null;
          onMachine = `<td>${fits ? escapeHtml(speed === null ? t('om.value.yes') : formatSpeed(speed)) : `<span class="om-bad">${escapeHtml(t('om.row.noFit'))}</span>`}</td>`;
        }
        return `<tr><th scope="row">${escapeHtml(quantName(quantization))}</th><td>${escapeHtml(t('om.row.memory', { n: formatGB(memory) }))}</td>${onMachine}</tr>`;
      })
      .join('');
    const machineHead = hardware ? `<th scope="col">${escapeHtml(t('om.detail.onSelected', { hardware: hardwareLabel(hardware, count) }))}</th>` : '';
    const machines = smallestMachines(model);
    const machineRows = machines
      .map(
        ({ hardware: machine, run }) =>
          `<tr><th scope="row">${escapeHtml(machine.name)}</th><td>${escapeHtml(quantName(run.quantization))}</td><td>${escapeHtml(formatSpeed(run.tokensPerSecond) || '–')}</td></tr>`
      )
      .join('');
    const vendorNote = localized(model.vendorHardware);
    return `
      <section class="detail-section">
        <h3>${escapeHtml(t('om.detail.hardware'))}</h3>
        ${vendorNote ? `<div class="install-box"><p><strong>${escapeHtml(t('om.detail.vendorHardware'))}:</strong> ${escapeHtml(vendorNote)}</p></div>` : ''}
        <table class="mini-table">
          <thead><tr><th scope="col">${escapeHtml(t('om.detail.quant'))}</th><th scope="col">${escapeHtml(t('om.col.memory'))}</th>${machineHead}</tr></thead>
          <tbody>${quantRows}</tbody>
        </table>
        <h4>${escapeHtml(t('om.detail.fitsOn'))}</h4>
        ${
          machines.length
            ? `<table class="mini-table"><thead><tr><th scope="col">${escapeHtml(t('om.field.hardware'))}</th><th scope="col">${escapeHtml(t('om.detail.quant'))}</th><th scope="col">${escapeHtml(t('om.col.speed'))}</th></tr></thead><tbody>${machineRows}</tbody></table>`
            : `<p>${escapeHtml(t('om.detail.fitsNone'))}</p>`
        }
        <p class="muted small">${escapeHtml(t('om.detail.estimates'))}</p>
      </section>`;
  }

  function licenseSection(model) {
    const license = model.license;
    const rights = RIGHTS.map(right => metaRow(t(`om.right.${right}`), valueMark(license[right]))).join('');
    const conditions = conditionsHtml(model);
    return `
      <section class="detail-section">
        <h3>${escapeHtml(t('om.detail.license'))}</h3>
        <p><strong>${externalLink(license.url, license.name)}</strong> · ${escapeHtml(t(`om.license.cat.${license.category}`))}</p>
        <p>${escapeHtml(localized(license.summary))}</p>
        <dl class="meta-table">${rights}${conditions ? metaRow(t('om.detail.conditions'), conditions, true) : ''}</dl>
        ${license.gated ? `<p class="muted small">${escapeHtml(t('om.detail.gated'))}</p>` : ''}
        <p class="muted small">${escapeHtml(t('om.detail.licenseDisclaimer'))}</p>
      </section>`;
  }

  function capabilitySection(model) {
    const variants = [];
    if (model.quantized && model.quantized.gguf) variants.push(`${repoLink(model.quantized.gguf)} (GGUF)`);
    ((model.quantized && model.quantized.other) || []).forEach(entry => {
      variants.push(`${repoLink(entry.repo)} (${escapeHtml(entry.format)})`);
    });
    const rows = [
      metaRow(t('om.detail.vendor'), escapeHtml(model.vendor)),
      metaRow(t('om.detail.repo'), repoLink(model.huggingface)),
      metaRow(t('om.detail.parameters'), escapeHtml(parametersLabel(model))),
      metaRow(t('om.detail.architecture'), escapeHtml(t(`om.row.${model.architecture === 'moe' ? 'moe' : 'dense'}`))),
      metaRow(t('om.detail.precision'), escapeHtml(String(model.nativePrecision || '').toUpperCase() || t('om.row.unknown'))),
      metaRow(t('om.detail.context'), escapeHtml(model.contextWindow ? t('om.row.tokens', { n: formatNumber(model.contextWindow) }) : t('om.row.unknown'))),
      model.maxOutputTokens ? metaRow(t('om.detail.maxOutput'), escapeHtml(t('om.row.tokens', { n: formatNumber(model.maxOutputTokens) }))) : '',
      metaRow(t('om.detail.input'), escapeHtml(modalities(model.inputModalities))),
      metaRow(t('om.detail.output'), escapeHtml(modalities(model.outputModalities))),
      metaRow(t('om.detail.reasoning'), escapeHtml(reasoningLabel(model))),
      metaRow(t('om.detail.tools'), valueMark(model.toolCalling)),
      metaRow(t('om.detail.structured'), valueMark(model.structuredOutput)),
      metaRow(t('om.detail.languages'), escapeHtml(languagesLabel(model))),
      model.serving && model.serving.length ? metaRow(t('om.detail.serving'), escapeHtml(model.serving.join(', '))) : '',
      variants.length ? metaRow(t('om.detail.quantized'), variants.join('<br />'), true) : ''
    ];
    return `<section class="detail-section"><h3>${escapeHtml(t('om.detail.capabilities'))}</h3><dl class="meta-table">${rows.join('')}</dl><p class="muted small">${escapeHtml(t('om.detail.reported'))}</p></section>`;
  }

  function renderDrawer() {
    const model = data.models.find(entry => entry.id === state.modelId);
    if (!model) return;
    const badges = [
      `<span class="badge badge-license-${escapeHtml(model.license.category)}">${escapeHtml(t(`om.license.cat.${model.license.category}`))}</span>`,
      `<span class="badge">${escapeHtml(t(`om.row.${model.architecture === 'moe' ? 'moe' : 'dense'}`))}</span>`,
      model.license.gated ? `<span class="badge">${escapeHtml(t('om.row.gated'))}</span>` : ''
    ];
    $('om-drawer-badges').innerHTML = badges.join('');
    $('om-drawer-title').textContent = model.name;
    $('om-drawer-sub').textContent = `${model.vendor} · ${t('om.detail.released', { date: formatDate(model.released) })}`;
    const inCompare = state.compare.includes(model.id);
    $('om-drawer-actions').innerHTML = `
      ${OFFLINE ? '' : `<a class="btn btn-primary btn-sm" href="${escapeHtml(HF + model.huggingface)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('om.detail.huggingface'))}</a>`}
      ${!OFFLINE && model.quantized && model.quantized.gguf ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(HF + model.quantized.gguf)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('om.detail.gguf'))}</a>` : ''}
      <button type="button" class="btn btn-secondary btn-sm" data-action="compare">${escapeHtml(t(inCompare ? 'om.compare.remove' : 'om.compare.add'))}</button>
      <button type="button" class="btn btn-secondary btn-sm" data-action="copy-link">${escapeHtml(t('om.detail.copyLink'))}</button>`;
    $('om-drawer-body').innerHTML = `
      <section class="detail-section">
        <h3>${escapeHtml(t('om.detail.strengths'))}</h3>
        <p>${escapeHtml(localized(model.strengths))}</p>
        <div class="detail-tags tags">${model.bestFor.map(use => `<span class="tag">${escapeHtml(t(`om.use.${use}`))}</span>`).join('')}</div>
      </section>
      ${capabilitySection(model)}
      ${licenseSection(model)}
      ${hardwareSection(model)}`;
  }

  /** The page behind a modal dialog does not scroll. */
  function syncScrollLock() {
    document.body.classList.toggle('no-scroll', $('om-drawer').open || $('om-compare').open);
  }

  // The detail panel is a native modal <dialog>: the browser traps focus, closes it on
  // Escape and returns focus; "close" below only keeps the page state in step.
  function openModel(id) {
    if (!data.models.some(model => model.id === id)) return;
    if ($('om-compare').open) $('om-compare').close();
    const dialog = $('om-drawer');
    if (!dialog.open) {
      lastFocus = document.activeElement;
      dialog.showModal();
    }
    state.modelId = id;
    renderDrawer();
    $('om-drawer-body').scrollTop = 0;
    syncScrollLock();
    writeUrlState();
  }

  function closeModel() {
    if ($('om-drawer').open) $('om-drawer').close();
  }

  function onModelClosed() {
    state.modelId = '';
    syncScrollLock();
    writeUrlState();
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  }

  /**
   * Parts that are folded away on a phone and always open on a wide screen: the
   * "More filters" group and the explanation under the table. The summary is the
   * toggle on a phone; on a wide screen a toggle is undone, so the content never hides.
   */
  function bindCollapsibles() {
    const parts = document.querySelectorAll('details[data-collapse-mobile]');
    const fold = () => parts.forEach(part => (part.open = !NARROW.matches));
    parts.forEach(part =>
      part.addEventListener('toggle', () => {
        if (!NARROW.matches && !part.open) part.open = true;
      })
    );
    NARROW.addEventListener('change', fold);
    fold();
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  // ---------- Events ----------

  /** A filter changed: the list starts again at its first page. */
  function update() {
    state.limit = 0;
    writeUrlState();
    renderResults();
    if ($('om-drawer').open) renderDrawer();
  }

  function renderAll() {
    applyStaticTranslations();
    renderHardwareOptions();
    renderUseOptions();
    renderCapabilityChips();
    syncInputs();
    renderStats();
    renderResults();
    if ($('om-drawer').open) renderDrawer();
    if ($('om-compare').open) renderCompare();
  }

  function bindEvents() {
    const bind = (id, key, parse) => {
      $(id).addEventListener('change', event => {
        state[key] = parse ? parse(event.target.value) : event.target.value;
        update();
      });
    };
    bind('om-hw', 'hw');
    bind('om-count', 'count', Number);
    bind('om-speed', 'speed', Number);
    bind('om-quant', 'quant', Number);
    bind('om-use', 'use');
    bind('om-ctx', 'ctx', Number);
    bind('om-license', 'license');
    bind('om-origin', 'origin');
    $('om-sort').addEventListener('change', event => {
      state.sort = event.target.value;
      state.dir = SORT_DEFAULT_DIR[state.sort] || 'asc';
      syncSort();
      update();
    });
    $('om-sort-dir').addEventListener('click', () => {
      state.dir = state.dir === 'asc' ? 'desc' : 'asc';
      syncSort();
      update();
    });
    $('om-table').tHead.addEventListener('click', event => {
      const button = event.target.closest('[data-sort]');
      if (button) sortBy(button.dataset.sort);
    });
    $('om-all').addEventListener('change', event => {
      state.all = event.target.checked;
      update();
    });
    const typed = (id, key) => {
      $(id).addEventListener('input', event => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          state[key] = event.target.value.trim();
          update();
        }, 150);
      });
    };
    typed('om-search', 'q');
    typed('om-mem', 'mem');
    typed('om-bw', 'bw');
    $('om-form').addEventListener('submit', event => event.preventDefault());

    $('om-caps').addEventListener('click', event => {
      const chip = event.target.closest('[data-cap]');
      if (!chip) return;
      const cap = chip.dataset.cap;
      state.caps = state.caps.includes(cap) ? state.caps.filter(entry => entry !== cap) : [...state.caps, cap];
      chip.setAttribute('aria-pressed', String(state.caps.includes(cap)));
      update();
    });

    $('om-reset').addEventListener('click', () => {
      Object.assign(state, DEFAULTS, { caps: [] });
      syncInputs();
      renderCapabilityChips();
      update();
    });

    $('om-rows').addEventListener('click', event => {
      const box = event.target.closest('[data-compare]');
      if (box) {
        if (!toggleCompare(box.dataset.compare)) box.checked = false;
        renderCompareBar();
        return;
      }
      const link = event.target.closest('[data-open]');
      const row = event.target.closest('tr[data-model]');
      // The whole row opens the model, except where the visitor selects text or uses a control
      if (!link && (!row || event.target.closest('a, button, input, label') || String(window.getSelection()))) return;
      event.preventDefault();
      openModel(link ? link.dataset.open : row.dataset.model);
    });

    $('om-compare-open').addEventListener('click', openCompare);
    $('om-compare-clear').addEventListener('click', () => {
      state.compare = [];
      update();
    });
    $('om-compare-close').addEventListener('click', () => $('om-compare').close());
    $('om-compare').addEventListener('close', syncScrollLock);
    $('om-more-btn').addEventListener('click', () => {
      state.limit += pageSize();
      renderResults();
    });
    $('om-compare').addEventListener('click', event => {
      // A click on the backdrop (the dialog element itself) closes the dialog
      if (event.target === $('om-compare')) $('om-compare').close();
      const remove = event.target.closest('[data-compare-remove]');
      if (remove) {
        toggleCompare(remove.dataset.compareRemove);
        renderResults();
        if (compareModels().length < 2) $('om-compare').close();
        else renderCompare();
        return;
      }
      const link = event.target.closest('[data-open]');
      if (link) {
        event.preventDefault();
        openModel(link.dataset.open);
      }
    });

    document.querySelectorAll('#om-drawer [data-close-drawer]').forEach(el => el.addEventListener('click', closeModel));
    $('om-drawer').addEventListener('close', onModelClosed);
    $('om-drawer').addEventListener('click', event => {
      // A click beside the panel (on the dialog element itself) closes the dialog
      if (event.target === $('om-drawer')) closeModel();
    });
    $('om-drawer-actions').addEventListener('click', async event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      if (button.dataset.action === 'compare') {
        toggleCompare(state.modelId);
        renderResults();
        renderDrawer();
      } else if (button.dataset.action === 'copy-link') {
        const url = new URL(window.location.href);
        url.search = `?model=${encodeURIComponent(state.modelId)}`;
        url.hash = '';
        if (await copyText(url.href)) showToast(t('om.detail.linkCopied'));
      }
    });

    $('lang-toggle').addEventListener('click', () => {
      state.lang = state.lang === 'de' ? 'en' : 'de';
      writeStorage(STORAGE.lang, state.lang);
      renderAll();
    });
    $('theme-toggle').addEventListener('click', () => {
      const dark = !document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', dark);
      writeStorage(STORAGE.theme, dark ? 'dark' : 'light');
    });
    const menu = $('topnav');
    $('menu-toggle').addEventListener('click', () => {
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      $('menu-toggle').setAttribute('aria-expanded', String(open));
    });
  }

  async function init() {
    const storedLang = readStorage(STORAGE.lang);
    state.lang =
      storedLang === 'en' || storedLang === 'de'
        ? storedLang
        : (navigator.language || 'en').toLowerCase().startsWith('de')
          ? 'de'
          : 'en';
    readUrlState();
    $('year').textContent = String(new Date().getFullYear());
    applyStaticTranslations();
    bindEvents();
    bindCollapsibles();

    try {
      const response = await fetch(new URL('data/open-models.json', window.location.href).href, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
      if (!Array.isArray(data.models)) throw new Error('open-models.json has no models array');
    } catch (err) {
      console.error('Failed to load the model data:', err);
      $('om-loading').hidden = true;
      $('om-error').hidden = false;
      $('om-error').textContent = t('om.results.loadError');
      return;
    }

    state.compare = state.compare.filter(id => data.models.some(model => model.id === id));
    $('om-loading').hidden = true;
    renderAll();
    if (state.modelId) {
      const id = state.modelId;
      state.modelId = '';
      if (data.models.some(model => model.id === id)) openModel(id);
      else writeUrlState();
    }
  }

  init();
})();
