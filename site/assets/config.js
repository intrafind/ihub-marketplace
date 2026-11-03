/**
 * Site configuration. The published site (GitHub Pages) is online: it links to
 * GitHub and shows the registry URL on raw.githubusercontent.com.
 *
 * scripts/build-offline.js overwrites this file in the offline bundle with
 * `offline: true`: no GitHub links, the registry URL is the address the bundle
 * is served from, and nothing is loaded from outside the bundle.
 */
window.MARKETPLACE_CONFIG = { offline: false };
if (window.MARKETPLACE_CONFIG.offline) document.documentElement.classList.add('offline');
