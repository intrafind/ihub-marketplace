/**
 * iHub Marketplace website.
 *
 * Loads catalog.json and renders it the way the iHub admin marketplace does:
 * type tabs with counts, a search/filter bar, a card grid with pagination,
 * and a slide-in detail panel with an Overview and a Content tab.
 *
 * Filter state lives in the URL (?type=&q=&category=&sort=&page=&item=), so
 * every view, including an open item, can be bookmarked and shared.
 */
(function () {
  'use strict';

  const REPO = 'intrafind/ihub-marketplace';
  const BRANCH = 'main';
  const GITHUB_BLOB = `https://github.com/${REPO}/blob/${BRANCH}/`;
  const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/`;
  const REGISTRY_NAME = 'iHub Official Marketplace';
  const TYPES = ['all', 'app', 'model', 'prompt', 'skill', 'workflow'];
  const PAGE_SIZE = 24;
  const STORAGE = {
    theme: 'ihub-marketplace-theme',
    lang: 'ihub-marketplace-lang',
    ihub: 'ihub-marketplace-instance'
  };

  const I18N = window.MARKETPLACE_I18N || { en: {} };

  const state = {
    items: [],
    // Base URL that catalog-relative source paths resolve against
    contentBase: '',
    lang: 'en',
    type: 'all',
    q: '',
    category: '',
    sort: '',
    page: 1,
    itemKey: '',
    tab: 'overview',
    ihubUrl: ''
  };

  const contentCache = new Map();
  let lastFocus = null;
  let searchTimer = null;
  let toastTimer = null;

  const $ = id => document.getElementById(id);

  // ---------- Storage (all access guarded: private mode can throw) ----------

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch {
      // Preferences are a convenience; ignore storage failures
    }
  }

  // ---------- i18n ----------

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
    return map[state.lang] || map.en || Object.values(map)[0] || '';
  }

  function typeLabel(type, plural) {
    return t(`types.${plural ? `${type}s` : type}`);
  }

  function categoryLabel(category) {
    const key = `categories.${category}`;
    const label = t(key);
    return label === key ? category : label;
  }

  function applyStaticTranslations() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    // Static, trusted strings from i18n.js that contain inline markup
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
  }

  // ---------- Helpers ----------

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function itemKey(item) {
    return `${item.type}/${item.name}`;
  }

  function findItem(key) {
    return state.items.find(item => itemKey(item) === key) || null;
  }

  function sourcePath(item) {
    return item.source && item.source.type === 'relative' ? item.source.path : '';
  }

  function contentUrl(item) {
    if (item.source?.type === 'url') return item.source.url;
    const path = sourcePath(item);
    return path ? new URL(path, state.contentBase).href : '';
  }

  function githubUrl(item) {
    const path = sourcePath(item);
    return path ? GITHUB_BLOB + path : `https://github.com/${REPO}`;
  }

  /** The license name, linked to its text when the catalog entry has an http(s) licenseUrl */
  function licenseHtml(item) {
    const name = escapeHtml(item.license);
    if (!/^https?:\/\//i.test(item.licenseUrl || '')) return name;
    return `<a href="${escapeHtml(item.licenseUrl)}" target="_blank" rel="noopener noreferrer">${name}</a>`;
  }

  function ihubLink(item) {
    if (!state.ihubUrl) return '';
    // iHub's admin marketplace keeps its filters in the URL; its search
    // matches the English display name.
    const params = new URLSearchParams({
      type: item.type,
      q: (item.displayName && item.displayName.en) || item.name
    });
    return `${state.ihubUrl}/admin/marketplace?${params}`;
  }

  function shareUrl(item) {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('item', itemKey(item));
    return url.href;
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

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for browsers without async clipboard access
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      area.remove();
      return ok;
    }
  }

  function flashCopied(button, ok) {
    const original = button.dataset.i18n ? t(button.dataset.i18n) : button.textContent;
    button.textContent = ok ? t('common.copied') : t('common.copyFailed');
    button.classList.toggle('copied', ok);
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove('copied');
    }, 1500);
  }

  // ---------- URL state ----------

  function readUrlState() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    state.type = TYPES.includes(type) ? type : 'all';
    state.q = params.get('q') || '';
    state.category = params.get('category') || '';
    state.sort = params.get('sort') === 'name' ? 'name' : '';
    state.page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);
    state.itemKey = params.get('item') || '';
    const lang = params.get('lang');
    if (lang === 'en' || lang === 'de') state.lang = lang;
  }

  function writeUrlState() {
    const params = new URLSearchParams();
    if (state.type !== 'all') params.set('type', state.type);
    if (state.q) params.set('q', state.q);
    if (state.category) params.set('category', state.category);
    if (state.sort) params.set('sort', state.sort);
    if (state.page > 1) params.set('page', String(state.page));
    if (state.itemKey) params.set('item', state.itemKey);
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  }

  // ---------- Filtering ----------

  function matchesSearch(item, terms) {
    if (!terms.length) return true;
    const haystack = [
      item.name,
      ...Object.values(item.displayName || {}),
      ...Object.values(item.description || {}),
      ...(item.tags || []),
      item.category || '',
      item.category ? categoryLabel(item.category) : '',
      item.author || ''
    ]
      .join(' ')
      .toLowerCase();
    return terms.every(term => haystack.includes(term));
  }

  function itemsOfType(type) {
    return type === 'all' ? state.items : state.items.filter(item => item.type === type);
  }

  function filteredItems() {
    const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    let result = itemsOfType(state.type).filter(
      item => (!state.category || item.category === state.category) && matchesSearch(item, terms)
    );
    if (state.sort === 'name') {
      result = result
        .slice()
        .sort((a, b) =>
          (localized(a.displayName) || a.name).localeCompare(
            localized(b.displayName) || b.name,
            state.lang
          )
        );
    }
    return result;
  }

  // ---------- Rendering ----------

  function renderStats() {
    const counts = countByType();
    $('stats').innerHTML = TYPES.filter(type => type !== 'all')
      .map(
        type => `
          <button type="button" class="stat" data-stat-type="${type}">
            <span class="stat-value">${counts[type] || 0}</span>
            <span class="stat-label">${escapeHtml(typeLabel(type, true))}</span>
          </button>`
      )
      .join('');
  }

  function countByType() {
    const counts = { all: state.items.length };
    state.items.forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }

  function renderTabs() {
    const counts = countByType();
    $('type-tabs').innerHTML = TYPES.map(type => {
      const label = type === 'all' ? t('types.all') : typeLabel(type, true);
      const count = counts[type] || 0;
      return `
        <button type="button" class="type-tab" data-type="${type}" aria-pressed="${state.type === type}">
          ${escapeHtml(label)}
          ${count > 0 ? `<span class="count-pill">${count}</span>` : ''}
        </button>`;
    }).join('');
  }

  function renderCategoryOptions() {
    const select = $('category');
    const counts = {};
    itemsOfType(state.type).forEach(item => {
      if (item.category) counts[item.category] = (counts[item.category] || 0) + 1;
    });
    if (state.category && !counts[state.category]) state.category = '';
    const options = Object.keys(counts).sort((a, b) =>
      categoryLabel(a).localeCompare(categoryLabel(b), state.lang)
    );
    select.innerHTML =
      `<option value="">${escapeHtml(t('browse.allCategories'))}</option>` +
      options
        .map(
          category =>
            `<option value="${escapeHtml(category)}">${escapeHtml(categoryLabel(category))} (${counts[category]})</option>`
        )
        .join('');
    select.value = state.category;
  }

  function renderCard(item) {
    const key = itemKey(item);
    const name = localized(item.displayName) || item.name;
    const description = localized(item.description);
    const tags = (item.tags || []).slice(0, 3);
    const action = state.ihubUrl
      ? `<a class="btn btn-primary btn-sm" href="${escapeHtml(ihubLink(item))}" target="_blank" rel="noopener noreferrer" data-stop>${escapeHtml(t('ihub.open'))}</a>`
      : `<button type="button" class="btn btn-primary btn-sm" data-open="${escapeHtml(key)}" tabindex="-1" aria-hidden="true">${escapeHtml(t('card.details'))}</button>`;

    return `
      <article class="card" data-open="${escapeHtml(key)}">
        <div class="card-top">
          <div class="badge-row">
            <span class="badge badge-${escapeHtml(item.type)}">${escapeHtml(typeLabel(item.type))}</span>
          </div>
          ${item.version ? `<span class="version">v${escapeHtml(item.version)}</span>` : ''}
        </div>
        <h3 class="card-title">
          <a href="?item=${encodeURIComponent(key)}" data-open="${escapeHtml(key)}">${escapeHtml(name)}</a>
        </h3>
        <p class="card-desc">${escapeHtml(description)}</p>
        ${
          tags.length
            ? `<div class="tags">${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>`
            : ''
        }
        <div class="card-footer">
          <span class="author">${escapeHtml(item.author ? t('card.by', { author: item.author }) : REGISTRY_NAME)}</span>
          ${action}
        </div>
      </article>`;
  }

  function renderGrid() {
    const items = filteredItems();
    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = items.slice(start, start + PAGE_SIZE);

    $('grid').innerHTML = pageItems.map(renderCard).join('');
    $('empty').hidden = items.length > 0;

    $('result-count').textContent =
      items.length === 0
        ? ''
        : items.length === 1
          ? t('browse.countOne')
          : t('browse.count', {
              from: start + 1,
              to: start + pageItems.length,
              total: items.length
            });

    $('pagination').hidden = totalPages <= 1;
    $('page-info').textContent = `${state.page} / ${totalPages}`;
    $('page-prev').disabled = state.page <= 1;
    $('page-next').disabled = state.page >= totalPages;
  }

  function renderConnectButton() {
    const button = $('ihub-connect');
    const label = $('ihub-connect-label');
    if (state.ihubUrl) {
      label.textContent = t('ihub.connected', { host: new URL(state.ihubUrl).host });
      button.classList.add('connected');
    } else {
      label.textContent = t('ihub.connect');
      button.classList.remove('connected');
    }
  }

  function renderBrowse() {
    renderTabs();
    renderCategoryOptions();
    renderGrid();
    writeUrlState();
  }

  function renderAll() {
    applyStaticTranslations();
    renderConnectButton();
    renderStats();
    renderBrowse();
    if (state.itemKey && findItem(state.itemKey)) renderDrawer();
  }

  // ---------- Detail drawer ----------

  function openItem(key) {
    if (!findItem(key)) return;
    lastFocus = document.activeElement;
    state.itemKey = key;
    state.tab = 'overview';
    writeUrlState();
    renderDrawer();
    $('drawer').hidden = false;
    document.body.classList.add('no-scroll');
    document.querySelector('.drawer-panel').focus();
  }

  function closeItem() {
    if ($('drawer').hidden) return;
    $('drawer').hidden = true;
    document.body.classList.remove('no-scroll');
    state.itemKey = '';
    writeUrlState();
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  }

  function metaRow(label, valueHtml, stacked) {
    return `<div class="meta-row${stacked ? ' stacked' : ''}"><dt>${escapeHtml(label)}</dt><dd>${valueHtml}</dd></div>`;
  }

  function renderDrawer() {
    const item = findItem(state.itemKey);
    if (!item) return;
    const name = localized(item.displayName) || item.name;

    $('drawer-badges').innerHTML = `
      <span class="badge badge-${escapeHtml(item.type)}">${escapeHtml(typeLabel(item.type))}</span>
      ${item.version ? `<span class="version">v${escapeHtml(item.version)}</span>` : ''}`;
    $('drawer-title').textContent = name;
    $('drawer-author').textContent = item.author ? t('card.by', { author: item.author }) : '';

    const actions = [];
    if (state.ihubUrl) {
      actions.push(
        `<a class="btn btn-primary" href="${escapeHtml(ihubLink(item))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('ihub.open'))}</a>`
      );
    } else {
      actions.push(
        `<button type="button" class="btn btn-primary" data-action="connect">${escapeHtml(t('ihub.connect'))}</button>`
      );
    }
    actions.push(
      `<a class="btn btn-secondary" href="${escapeHtml(githubUrl(item))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('detail.github'))}</a>`
    );
    const url = contentUrl(item);
    if (url) {
      const fileName = (sourcePath(item) || url).split('/').pop();
      actions.push(
        `<a class="btn btn-secondary" href="${escapeHtml(url)}" download="${escapeHtml(fileName)}">${escapeHtml(t('detail.download'))}</a>`
      );
    }
    actions.push(
      `<button type="button" class="btn btn-secondary" data-action="copy-link">${escapeHtml(t('detail.copyLink'))}</button>`
    );
    $('drawer-actions').innerHTML = actions.join('');

    document.querySelectorAll('.drawer-tab').forEach(tab => {
      const selected = tab.dataset.tab === state.tab;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    if (state.tab === 'overview') renderOverview(item);
    else renderContent(item);
  }

  function renderOverview(item) {
    const description = localized(item.description);
    const searchName = (item.displayName && item.displayName.en) || item.name;
    const sections = [];

    if (description) {
      sections.push(`
        <section class="detail-section">
          <h3>${escapeHtml(t('detail.description'))}</h3>
          <p>${escapeHtml(description)}</p>
        </section>`);
    }

    sections.push(`
      <section class="detail-section install-box">
        <h3>${escapeHtml(t('detail.howToInstall'))}</h3>
        <p>${t('detail.installStepsHtml', { name: escapeHtml(searchName) })}</p>
        ${item.type === 'model' ? `<p>${escapeHtml(t('detail.modelNote'))}</p>` : ''}
      </section>`);

    if (item.tags && item.tags.length) {
      sections.push(`
        <section class="detail-section">
          <h3>${escapeHtml(t('detail.tags'))}</h3>
          <div class="detail-tags">${item.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
        </section>`);
    }

    const rows = [
      metaRow(t('detail.id'), `<code>${escapeHtml(item.name)}</code>`),
      metaRow(t('detail.type'), escapeHtml(typeLabel(item.type)))
    ];
    if (item.category)
      rows.push(metaRow(t('detail.category'), escapeHtml(categoryLabel(item.category))));
    if (item.version) rows.push(metaRow(t('detail.version'), escapeHtml(item.version)));
    if (item.author) rows.push(metaRow(t('detail.author'), escapeHtml(item.author)));
    if (item.license) rows.push(metaRow(t('detail.license'), licenseHtml(item)));
    rows.push(
      metaRow(
        t('detail.source'),
        `<a href="${escapeHtml(githubUrl(item))}" target="_blank" rel="noopener noreferrer">GitHub</a>`
      )
    );
    rows.push(metaRow(t('detail.registry'), escapeHtml(REGISTRY_NAME)));

    sections.push(`
      <section class="detail-section">
        <h3>${escapeHtml(t('detail.details'))}</h3>
        <dl class="meta-table">${rows.join('')}</dl>
      </section>`);

    $('drawer-body').innerHTML = sections.join('');
  }

  async function renderContent(item) {
    const body = $('drawer-body');
    const key = itemKey(item);
    const url = contentUrl(item);
    if (!url) {
      body.innerHTML = `<p class="muted small">${escapeHtml(t('detail.noPreview'))}</p>`;
      return;
    }

    if (!contentCache.has(url)) {
      body.innerHTML = `<div class="loading"><div class="spinner" role="status"><span class="sr-only">${escapeHtml(t('common.loading'))}</span></div></div>`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        contentCache.set(url, await response.text());
      } catch (err) {
        console.error('Failed to load item content:', err);
        if (state.itemKey === key && state.tab === 'content') {
          body.innerHTML = `<p class="muted small">${escapeHtml(t('detail.previewError'))}</p>`;
        }
        return;
      }
    }

    // The user may have switched item or tab while the request was running
    if (state.itemKey !== key || state.tab !== 'content') return;

    const text = contentCache.get(url);
    if (item.type === 'skill' || /\.md$/i.test(url)) {
      body.innerHTML = renderMarkdownDocument(text, item);
    } else {
      body.innerHTML = renderJson(text);
    }
  }

  /** Splits YAML frontmatter from a SKILL.md body. Handles flat and one-level nested keys. */
  function parseFrontmatter(text) {
    const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
    if (!match) return { data: [], body: text };
    const data = [];
    let parent = '';
    match[1].split(/\r?\n/).forEach(line => {
      const entry = /^(\s*)([\w.-]+):\s*(.*)$/.exec(line);
      if (!entry) return;
      const [, indent, key, rawValue] = entry;
      if (!indent) parent = '';
      if (!rawValue) {
        parent = key;
        return;
      }
      let value = rawValue.trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1).replace(/\\"/g, '"');
      }
      data.push([indent && parent ? `${parent}.${key}` : key, value]);
    });
    return { data, body: text.slice(match[0].length) };
  }

  function renderMarkdownDocument(text, item) {
    const { data, body } = parseFrontmatter(text);
    const table = data.length
      ? `<dl class="meta-table">${data.map(([key, value]) => metaRow(key, escapeHtml(value), value.length > 60)).join('')}</dl>`
      : '';

    let html;
    if (window.marked && window.DOMPurify) {
      html = window.DOMPurify.sanitize(window.marked.parse(body, { gfm: true }));
    } else {
      html = `<pre class="json-preview">${escapeHtml(body)}</pre>`;
    }

    // Resolve relative links and images against the skill's folder
    const container = document.createElement('div');
    container.innerHTML = html;
    const folder = (sourcePath(item) || '').replace(/[^/]*$/, '');
    container.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!/^([a-z]+:|#|\/\/)/i.test(href)) link.setAttribute('href', GITHUB_BLOB + folder + href);
      if (!href.startsWith('#')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
    container.querySelectorAll('img[src]').forEach(img => {
      const src = img.getAttribute('src');
      if (!/^([a-z]+:|\/\/)/i.test(src)) img.setAttribute('src', RAW_BASE + folder + src);
    });

    return `${table}<div class="prose">${container.innerHTML}</div>`;
  }

  function renderJson(text) {
    let pretty;
    try {
      pretty = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return `<pre class="json-preview">${escapeHtml(text)}</pre>`;
    }
    // Light syntax highlighting on the escaped string
    const highlighted = escapeHtml(pretty).replace(
      /(&quot;(?:\\.|(?!&quot;).)*&quot;)(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
      (match, str, colon, literal, number) => {
        if (str)
          return colon
            ? `<span class="json-key">${str}</span>${colon}`
            : `<span class="json-string">${str}</span>`;
        if (literal) return `<span class="json-literal">${literal}</span>`;
        return `<span class="json-number">${number}</span>`;
      }
    );
    return `<pre class="json-preview">${highlighted}</pre>`;
  }

  function trapFocus(event) {
    if (event.key !== 'Tab' || $('drawer').hidden) return;
    const panel = document.querySelector('.drawer-panel');
    const focusable = Array.from(
      panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter(el => el.tabIndex >= 0 && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // ---------- Connect your iHub ----------

  function normalizeIhubUrl(value) {
    let url;
    try {
      url = new URL(value.trim());
    } catch {
      return '';
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    // Keep a sub path deployment (https://host/ihub), drop query, hash, and admin paths
    const path = url.pathname.replace(/\/admin(\/.*)?$/, '').replace(/\/+$/, '');
    return `${url.origin}${path}`;
  }

  function openConnectDialog() {
    const dialog = $('ihub-dialog');
    $('ihub-url').value = state.ihubUrl;
    $('ihub-error').hidden = true;
    $('ihub-clear').hidden = !state.ihubUrl;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    $('ihub-url').focus();
  }

  function closeConnectDialog() {
    const dialog = $('ihub-dialog');
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function setIhubUrl(url) {
    state.ihubUrl = url;
    writeStorage(STORAGE.ihub, url || null);
    renderConnectButton();
    renderGrid();
    if (!$('drawer').hidden) renderDrawer();
  }

  // ---------- Theme ----------

  function toggleTheme() {
    const dark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', dark);
    writeStorage(STORAGE.theme, dark ? 'dark' : 'light');
  }

  // ---------- Catalog loading ----------

  async function fetchCatalog(base) {
    const response = await fetch(new URL('catalog.json', base).href, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const catalog = await response.json();
    if (!Array.isArray(catalog.items)) throw new Error('catalog.json has no items array');
    return catalog;
  }

  async function loadCatalog() {
    // The published site ships catalog.json next to index.html. Opening site/
    // on its own (for example while editing the page) falls back to GitHub.
    const bases = [new URL('./', window.location.href).href, RAW_BASE];
    let lastError;
    for (const base of bases) {
      try {
        const catalog = await fetchCatalog(base);
        state.contentBase = base;
        return catalog;
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError;
  }

  // ---------- Events ----------

  function bindEvents() {
    $('type-tabs').addEventListener('click', event => {
      const tab = event.target.closest('[data-type]');
      if (!tab) return;
      state.type = tab.dataset.type;
      state.page = 1;
      renderBrowse();
    });

    $('stats').addEventListener('click', event => {
      const stat = event.target.closest('[data-stat-type]');
      if (!stat) return;
      state.type = stat.dataset.statType;
      state.category = '';
      state.page = 1;
      renderBrowse();
      $('browse').scrollIntoView();
    });

    $('search').addEventListener('input', event => {
      clearTimeout(searchTimer);
      const value = event.target.value;
      searchTimer = setTimeout(() => {
        state.q = value.trim();
        state.page = 1;
        renderGrid();
        writeUrlState();
      }, 150);
    });

    $('category').addEventListener('change', event => {
      state.category = event.target.value;
      state.page = 1;
      renderGrid();
      writeUrlState();
    });

    $('sort').addEventListener('change', event => {
      state.sort = event.target.value;
      state.page = 1;
      renderGrid();
      writeUrlState();
    });

    $('page-prev').addEventListener('click', () => changePage(-1));
    $('page-next').addEventListener('click', () => changePage(1));

    $('grid').addEventListener('click', event => {
      if (event.target.closest('[data-stop]')) return;
      const target = event.target.closest('[data-open]');
      if (!target) return;
      // Let modified clicks on the title link open a new tab
      if (target.tagName === 'A' && (event.metaKey || event.ctrlKey || event.shiftKey)) return;
      event.preventDefault();
      openItem(target.dataset.open);
    });

    document
      .querySelectorAll('[data-close-drawer]')
      .forEach(el => el.addEventListener('click', closeItem));

    document.querySelector('.drawer-tabs').addEventListener('click', event => {
      const tab = event.target.closest('[data-tab]');
      if (!tab || tab.dataset.tab === state.tab) return;
      state.tab = tab.dataset.tab;
      renderDrawer();
    });

    document.querySelector('.drawer-tabs').addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      state.tab = state.tab === 'overview' ? 'content' : 'overview';
      renderDrawer();
      document.querySelector(`.drawer-tab[data-tab="${state.tab}"]`).focus();
    });

    $('drawer-actions').addEventListener('click', async event => {
      const action = event.target.closest('[data-action]');
      if (!action) return;
      if (action.dataset.action === 'connect') openConnectDialog();
      if (action.dataset.action === 'copy-link') {
        const item = findItem(state.itemKey);
        if (item)
          showToast(
            (await copyText(shareUrl(item))) ? t('detail.linkCopied') : t('common.copyFailed')
          );
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !$('drawer').hidden && !$('ihub-dialog').open) closeItem();
      trapFocus(event);
    });

    document.querySelectorAll('[data-copy-target]').forEach(button =>
      button.addEventListener('click', async () => {
        const source = $(button.dataset.copyTarget);
        flashCopied(button, await copyText(source.textContent.trim()));
      })
    );

    $('ihub-connect').addEventListener('click', openConnectDialog);
    $('ihub-cancel').addEventListener('click', closeConnectDialog);
    $('ihub-clear').addEventListener('click', () => {
      setIhubUrl('');
      closeConnectDialog();
      showToast(t('ihub.removed'));
    });
    $('ihub-form').addEventListener('submit', event => {
      event.preventDefault();
      const url = normalizeIhubUrl($('ihub-url').value);
      if (!url) {
        $('ihub-error').hidden = false;
        $('ihub-url').focus();
        return;
      }
      setIhubUrl(url);
      closeConnectDialog();
      showToast(t('ihub.saved', { host: new URL(url).host }));
    });

    $('lang-toggle').addEventListener('click', () => {
      state.lang = state.lang === 'de' ? 'en' : 'de';
      writeStorage(STORAGE.lang, state.lang);
      renderAll();
    });

    $('theme-toggle').addEventListener('click', toggleTheme);

    const menu = $('topnav');
    $('menu-toggle').addEventListener('click', () => {
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      $('menu-toggle').setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) {
        menu.classList.remove('open');
        $('menu-toggle').setAttribute('aria-expanded', 'false');
      }
    });
  }

  function changePage(delta) {
    state.page += delta;
    renderGrid();
    writeUrlState();
    $('browse').scrollIntoView();
  }

  // ---------- Init ----------

  async function init() {
    const storedLang = readStorage(STORAGE.lang);
    state.lang =
      storedLang === 'en' || storedLang === 'de'
        ? storedLang
        : (navigator.language || 'en').toLowerCase().startsWith('de')
          ? 'de'
          : 'en';
    state.ihubUrl = normalizeIhubUrl(readStorage(STORAGE.ihub) || '');
    readUrlState();

    $('year').textContent = String(new Date().getFullYear());
    $('search').value = state.q;
    $('sort').value = state.sort;
    applyStaticTranslations();
    renderConnectButton();
    bindEvents();

    try {
      const catalog = await loadCatalog();
      state.items = catalog.items;
    } catch (err) {
      console.error('Failed to load catalog:', err);
      $('loading').hidden = true;
      $('error').hidden = false;
      $('error').textContent = t('browse.loadError');
      return;
    }

    $('loading').hidden = true;
    renderStats();
    renderBrowse();

    if (state.itemKey) {
      const key = state.itemKey;
      state.itemKey = '';
      if (findItem(key)) openItem(key);
      else writeUrlState();
    }
  }

  init();
})();
