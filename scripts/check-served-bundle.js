#!/usr/bin/env node
// Checks a hosted copy of the offline bundle: fetches catalog.json from the
// given address and then every file the catalog lists (the item files, the
// companions of skills and integrations, the version descriptors), and fails
// when one of them is not served or when an item still points away from the
// bundle. Run it against the container, a web server or a reverse proxy to
// know that iHub will find everything.
//
// Usage: node scripts/check-served-bundle.js <address of the bundle> [--concurrency <n>]
//   e.g. node scripts/check-served-bundle.js http://localhost:8080/
//
// Node.js 20+, no dependencies. Reaches the address directly or through the
// proxy named in HTTPS_PROXY when NODE_USE_ENV_PROXY=1 is set.
'use strict';

/** The files of one catalog item, relative to the bundle. */
function filesOf(item) {
  const source = item.source || {};
  if (source.type !== 'relative') return null;
  const folder = source.path.replace(/[^/]*$/, '');
  return [
    source.path,
    ...(source.companions || []).map(companion => folder + companion),
    ...(item.versions || []).map(listed => listed.ref).filter(Boolean)
  ];
}

/**
 * @param {string} address - where the bundle is served
 * @param {{ fetchFn?: typeof fetch, concurrency?: number }} [options]
 * @returns {Promise<{ items: number, files: number, problems: string[] }>}
 */
async function checkServedBundle(address, { fetchFn = fetch, concurrency = 8 } = {}) {
  const base = address.endsWith('/') ? address : `${address}/`;
  const problems = [];

  const catalogResponse = await fetchFn(new URL('catalog.json', base), { cache: 'no-store' });
  if (!catalogResponse.ok) {
    return { items: 0, files: 0, problems: [`catalog.json: HTTP ${catalogResponse.status}`] };
  }
  const catalog = await catalogResponse.json();
  if (!Array.isArray(catalog.items)) {
    return { items: 0, files: 0, problems: ['catalog.json has no items array'] };
  }

  const files = new Set(['index.html']);
  for (const item of catalog.items) {
    const itemFiles = filesOf(item);
    if (!itemFiles) {
      const where = item.source?.url || item.source?.type;
      problems.push(`${item.type}:${item.name}: source is not in the bundle (${where})`);
    } else {
      itemFiles.forEach(file => files.add(file));
    }
  }

  const queue = [...files];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) {
      const file = queue.shift();
      try {
        const response = await fetchFn(new URL(file, base));
        await response.arrayBuffer();
        if (!response.ok) problems.push(`${file}: HTTP ${response.status}`);
      } catch (error) {
        problems.push(`${file}: ${error.message}`);
      }
    }
  });
  await Promise.all(workers);

  return { items: catalog.items.length, files: files.size, problems: problems.sort() };
}

module.exports = { checkServedBundle };

if (require.main === module) {
  const args = process.argv.slice(2);
  const concurrencyAt = args.indexOf('--concurrency');
  const concurrency = concurrencyAt >= 0 ? Number(args[concurrencyAt + 1]) : 8;
  const address = args.find((arg, index) => !arg.startsWith('--') && args[index - 1] !== '--concurrency');
  if (!address || !/^https?:\/\//i.test(address) || !Number.isInteger(concurrency) || concurrency < 1) {
    console.error('Usage: node scripts/check-served-bundle.js <http(s) address of the bundle> [--concurrency <n>]');
    process.exit(2);
  }
  checkServedBundle(address, { concurrency })
    .then(({ items, files, problems }) => {
      if (problems.length) {
        console.error(`${problems.length} problem(s) in ${address}:\n  ${problems.join('\n  ')}`);
        process.exit(1);
      }
      console.log(`${address}: ${items} catalog items, ${files} files, all served`);
    })
    .catch(error => {
      console.error(`${address}: ${error.message}`);
      process.exit(1);
    });
}
