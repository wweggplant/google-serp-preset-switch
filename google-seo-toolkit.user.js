// ==UserScript==
// @name         Google SEO Toolkit
// @name:zh-CN   Google SEO 工具箱
// @namespace    https://github.com/wweggplant/google-serp-preset-switch
// @version      2.0.0
// @description  All-in-one SEO toolkit for Google SERP: stat display, keyword difficulty, domain lookup, Trends, allintitle, intitle, and region preset switching.
// @description:zh-CN  Google SERP 一站式 SEO 工具箱：搜索统计、关键词难度、域名查询、Trends、allintitle、intitle、地区预设切换。
// @author       wweggplant
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.co.jp/search*
// @match        *://www.google.co.uk/search*
// @match        *://www.google.de/search*
// @match        *://www.google.fr/search*
// @match        *://www.google.com.sg/search*
// @match        *://www.google.com.tw/search*
// @include      /^https?:\/\/[^\/]*\.?google\.[^\/]+\/search.*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @homepageURL  https://github.com/wweggplant/google-serp-preset-switch
// @supportURL   https://github.com/wweggplant/google-serp-preset-switch/issues
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  function getKeyword() {
    const url = new URL(location.href);
    return url.searchParams.get('q') || url.searchParams.get('as_q') || '';
  }

  // Strip allintitle:/intitle: prefix so buttons don't double-wrap
  function getRawKeyword() {
    return getKeyword().replace(/^(allintitle:|intitle:)"?/i, '').replace(/"$/, '');
  }

  // ── Presets ──────────────────────────────
  const FORCE_PWS = '0';

  const presets = [
    { label: 'US', sub: 'English',   params: { gl: 'us', cr: 'countryUS', lr: 'lang_en',    hl: 'en' } },
    { label: 'UK', sub: 'English',   params: { gl: 'uk', cr: 'countryUK', lr: 'lang_en',    hl: 'en' } },
    { label: 'JP', sub: '日本語',    params: { gl: 'jp', cr: 'countryJP', lr: 'lang_ja',    hl: 'ja' } },
    { label: 'SG', sub: 'English',   params: { gl: 'sg', cr: 'countrySG', lr: 'lang_en',    hl: 'en' } },
    { label: 'CN', sub: '简体中文',  params: { gl: 'cn', cr: 'countryCN', lr: 'lang_zh-CN', hl: 'zh-CN' } },
    { label: 'HK', sub: '繁體中文',  params: { gl: 'hk', cr: 'countryHK', lr: 'lang_zh-TW', hl: 'zh-TW' } },
    { label: 'TW', sub: '繁體中文',  params: { gl: 'tw', cr: 'countryTW', lr: 'lang_zh-TW', hl: 'zh-TW' } },
    { label: 'DE', sub: 'Deutsch',   params: { gl: 'de', cr: 'countryDE', lr: 'lang_de',    hl: 'de' } },
    { label: 'FR', sub: 'Français',  params: { gl: 'fr', cr: 'countryFR', lr: 'lang_fr',    hl: 'fr' } }
  ];

  // ── SEO Tools ────────────────────────────
  const tools = [
    {
      label: 'KD',
      title: 'Keyword Difficulty — Ahrefs',
      action() {
        const q = getKeyword();
        if (!q) return;
        window.open('https://ahrefs.com/keyword-difficulty/?country=us&input=' + encodeURIComponent(q), '_blank');
      }
    },
    {
      label: 'Domain',
      title: 'Domain lookup — Namebeta (.org)',
      action() {
        const q = getKeyword();
        if (!q) return;
        window.open('https://namebeta.com/search/' + encodeURIComponent(q.replace(/\s+/g, '') + '.org'), '_blank');
      }
    },
    {
      label: 'Trends',
      title: 'Google Trends — 7 days',
      action() {
        const q = getKeyword() || 'ai';
        window.open('https://trends.google.com/trends/explore?date=now 7-d&q=' + encodeURIComponent(q), '_blank');
      }
    },
    {
      label: 'allintitle',
      title: 'Google allintitle search',
      action() {
        const q = getRawKeyword();
        if (!q) return;
        window.open('https://www.google.com/search?q=allintitle:"' + encodeURIComponent(q) + '"', '_blank');
      }
    },
    {
      label: 'intitle',
      title: 'Google intitle search',
      action() {
        const q = getRawKeyword();
        if (!q) return;
        window.open('https://www.google.com/search?q=intitle:"' + encodeURIComponent(q) + '"', '_blank');
      }
    }
  ];

  // ── State helpers ────────────────────────
  function getCurrentState(url) {
    return {
      gl: url.searchParams.get('gl') || '',
      hl: url.searchParams.get('hl') || '',
      lr: url.searchParams.get('lr') || '',
      cr: url.searchParams.get('cr') || '',
      pws: url.searchParams.get('pws') || ''
    };
  }

  function findPresetIndex(state) {
    return presets.findIndex(p =>
      (p.params.cr || '') === state.cr &&
      (p.params.lr || '') === state.lr
    );
  }

  function hasAnyParams(state) {
    return Boolean(state.gl || state.cr || state.lr || state.hl || state.pws);
  }

  // ── Styles ───────────────────────────────
  function injectStyles() {
    if (document.getElementById('gm-seo-kit-styles')) return;
    const s = document.createElement('style');
    s.id = 'gm-seo-kit-styles';
    s.textContent = `
      @keyframes gmBarIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      #gm-seo-bar {
        animation: gmBarIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
      }

      /* pill segment control for region presets */
      .gm-pill-group {
        display: inline-flex;
        background: oklch(0.96 0.005 260);
        border-radius: 8px;
        padding: 2px;
        gap: 2px;
      }

      .gm-pill {
        padding: 5px 12px;
        font-size: 12px;
        font-weight: 500;
        color: oklch(0.42 0.01 260);
        border-radius: 6px;
        cursor: pointer;
        border: none;
        background: transparent;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        white-space: nowrap;
        letter-spacing: -0.01em;
      }

      .gm-pill:hover {
        color: oklch(0.22 0.01 260);
        background: oklch(0.93 0.005 260);
      }

      .gm-pill.active {
        color: oklch(0.15 0.02 260);
        background: #fff;
        box-shadow: 0 0.5px 2px oklch(0.0 0 0 / 0.08), 0 0 0 0.5px oklch(0.0 0 0 / 0.04);
        font-weight: 600;
      }

      /* tool buttons */
      .gm-tool-btn {
        padding: 5px 14px;
        font-size: 12px;
        font-weight: 500;
        color: oklch(0.35 0.02 260);
        background: oklch(0.98 0.002 260);
        border: 0.5px solid oklch(0.88 0.005 260);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s ease;
        white-space: nowrap;
        letter-spacing: -0.01em;
      }

      .gm-tool-btn:hover {
        color: oklch(0.18 0.02 260);
        background: #fff;
        border-color: oklch(0.82 0.01 260);
        box-shadow: 0 0.5px 3px oklch(0.0 0 0 / 0.06);
      }

      .gm-tool-btn:active {
        transform: scale(0.97);
      }

      /* stat badge */
      .gm-stat {
        font-size: 11px;
        font-weight: 400;
        color: oklch(0.52 0.01 260);
        letter-spacing: -0.01em;
        padding: 0 8px;
        border-left: 1px solid oklch(0.90 0.005 260);
      }

      /* keyword display */
      .gm-kw {
        font-size: 11px;
        color: oklch(0.48 0.01 260);
        letter-spacing: 0.02em;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(s);
  }

  // ── Build UI ─────────────────────────────
  function buildBar() {
    const state = getCurrentState(new URL(location.href));
    const activeIdx = findPresetIndex(state);
    const hasParams = hasAnyParams(state);

    const bar = document.createElement('div');
    bar.id = 'gm-seo-bar';

    // outer container — subtle backdrop
    bar.style.cssText = [
      'display: flex',
      'align-items: center',
      'gap: 8px',
      'padding: 6px 14px',
      'margin: 6px 0 4px',
      'background: oklch(0.985 0.002 260)',
      'border-bottom: 0.5px solid oklch(0.91 0.005 260)',
      'border-radius: 10px',
      'flex-wrap: wrap',
      'overflow: hidden'
    ].join(';');

    // 1) Region pills
    const pillGroup = document.createElement('div');
    pillGroup.className = 'gm-pill-group';

    presets.forEach((p, i) => {
      const pill = document.createElement('button');
      pill.className = 'gm-pill' + (i === activeIdx ? ' active' : '');
      pill.textContent = p.label;
      pill.title = p.sub;
      pill.addEventListener('click', () => applyPreset(i));
      pillGroup.appendChild(pill);
    });

    // custom pill if params exist but no match
    if (hasParams && activeIdx === -1) {
      const custom = document.createElement('button');
      custom.className = 'gm-pill active';
      custom.textContent = 'Custom';
      custom.title = 'gl=' + (state.gl || '-') + ' cr=' + (state.cr || '-');
      pillGroup.appendChild(custom);
    }

    bar.appendChild(pillGroup);

    // 2) Tool buttons
    const toolGroup = document.createElement('div');
    toolGroup.style.cssText = 'display:inline-flex;align-items:center;gap:5px';

    tools.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'gm-tool-btn';
      btn.textContent = t.label;
      btn.title = t.title;
      btn.addEventListener('click', t.action);
      toolGroup.appendChild(btn);
    });

    bar.appendChild(toolGroup);

    // 3) Stat badge
    const resultStats = document.querySelector('#result-stats');
    if (resultStats) {
      const text = resultStats.textContent.trim();
      if (text) {
        const stat = document.createElement('span');
        stat.className = 'gm-stat';
        stat.textContent = text;
        bar.appendChild(stat);
        resultStats.style.display = 'none';
      }
    }

    // 4) Current keyword (subtle)
    const kw = getKeyword();
    if (kw) {
      const kwSpan = document.createElement('span');
      kwSpan.className = 'gm-kw';
      kwSpan.textContent = kw;
      kwSpan.title = kw;
      bar.appendChild(kwSpan);
    }

    return bar;
  }

  function applyPreset(index) {
    const next = new URL(location.href);
    const keyword = next.searchParams.get('q') || next.searchParams.get('as_q') || '';
    if (keyword) next.searchParams.set('q', keyword);

    ['as_q', 'as_epq', 'as_oq', 'as_eq', 'as_nlo', 'as_nhi',
      'as_qdr', 'as_sitesearch', 'as_occt', 'as_filetype', 'tbs'
    ].forEach(k => next.searchParams.delete(k));

    const p = presets[index];
    next.searchParams.set('gl', p.params.gl);
    next.searchParams.set('cr', p.params.cr);
    next.searchParams.set('lr', p.params.lr);
    next.searchParams.set('hl', p.params.hl);
    next.searchParams.set('pws', FORCE_PWS);
    location.href = next.toString();
  }

  // ── Mount ────────────────────────────────
  function mount() {
    if (document.getElementById('gm-seo-bar')) return;

    // Insert before the search results area
    const main = document.querySelector('#search') ||
                 document.querySelector('#rso')?.parentElement ||
                 document.querySelector('#main');

    if (!main) return;

    injectStyles();
    const bar = buildBar();
    main.parentElement.insertBefore(bar, main);
  }

  function boot() {
    mount();
    const observer = new MutationObserver(mount);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  boot();
})();
