// ==UserScript==
// @name         Google SEO Toolkit
// @name:zh-CN   Google SEO 工具箱
// @namespace    https://github.com/wweggplant/google-serp-preset-switch
// @version      1.0.1
// @description  All-in-one SEO toolkit for Google SERP: stat enhancement, keyword difficulty (Ahrefs), domain lookup (Namebeta), Trends, allintitle, intitle — plus preset switching.
// @description:zh-CN  Google SERP 一站式 SEO 工具箱：搜索结果统计增强、关键词难度查询、域名查询、Google Trends、allintitle、intitle，以及地区预设切换。
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

  // ═══════════════════════════════════════════
  //  Shared helpers
  // ═══════════════════════════════════════════

  function getKeyword() {
    const url = new URL(location.href);
    return url.searchParams.get('q') || url.searchParams.get('as_q') || '';
  }

  // ═══════════════════════════════════════════
  //  Feature 1 — SERP Stat Enhancement
  // ═══════════════════════════════════════════

  function enhanceSearchStats() {
    const resultStats = document.querySelector('#result-stats');
    if (!resultStats || resultStats.dataset.enhanced) return;
    resultStats.dataset.enhanced = '1';

    const statsText = resultStats.textContent.trim();
    if (!statsText) return;

    // Inject animation keyframes once
    if (!document.getElementById('gm-seo-toolkit-styles')) {
      const style = document.createElement('style');
      style.id = 'gm-seo-toolkit-styles';
      style.textContent = `
        @keyframes gmSlideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        #gm-enhanced-stats:hover {
          transform: scale(1.01);
          transition: transform 0.2s ease;
        }
      `;
      document.head.appendChild(style);
    }

    const container = document.createElement('div');
    container.id = 'gm-enhanced-stats';
    container.style.cssText = [
      'background: linear-gradient(135deg, #4285f4, #34a853)',
      'color: #fff',
      'padding: 10px 20px',
      'margin: 8px 0',
      'border-radius: 8px',
      'font-size: 15px',
      'font-weight: 600',
      'box-shadow: 0 2px 8px rgba(0,0,0,0.12)',
      'text-align: center',
      'animation: gmSlideIn 0.3s ease-out'
    ].join(';');

    container.innerHTML = `
      <div style="display:flex;justify-content:center;align-items:center;gap:12px">
        <span>\u{1F4CA}</span>
        <span>${statsText}</span>
        <span>\u26A1</span>
      </div>`;

    // Hide original
    resultStats.style.display = 'none';

    const target = document.querySelector('#search') || document.querySelector('#rso') || resultStats.parentElement;
    if (target) target.insertBefore(container, target.firstChild);
  }

  // ═══════════════════════════════════════════
  //  Feature 2-6 — SEO Quick Tools Toolbar
  // ═══════════════════════════════════════════

  const tools = [
    {
      label: 'KD',
      title: 'Keyword Difficulty (Ahrefs)',
      action() {
        const q = getKeyword();
        if (!q) { alert('No keyword found in search.'); return; }
        window.open('https://ahrefs.com/keyword-difficulty/?country=us&input=' + encodeURIComponent(q), '_blank');
      }
    },
    {
      label: 'Domain',
      title: 'Domain lookup (Namebeta)',
      action() {
        const q = getKeyword();
        if (!q) { alert('No keyword found in search.'); return; }
        const domain = q.replace(/\s+/g, '') + '.org';
        window.open('https://namebeta.com/search/' + encodeURIComponent(domain), '_blank');
      }
    },
    {
      label: 'Trends',
      title: 'Google Trends (7 days)',
      action() {
        const q = getKeyword() || 'ai';
        window.open('https://trends.google.com/trends/explore?date=now 7-d&q=' + encodeURIComponent(q), '_blank');
      }
    },
    {
      label: 'allintitle',
      title: 'Google allintitle search',
      action() {
        const q = getKeyword();
        if (!q) { alert('No keyword found in search.'); return; }
        window.open('https://www.google.com/search?q=allintitle:"' + encodeURIComponent(q) + '"', '_blank');
      }
    },
    {
      label: 'intitle',
      title: 'Google intitle search',
      action() {
        const q = getKeyword();
        if (!q) { alert('No keyword found in search.'); return; }
        window.open('https://www.google.com/search?q=intitle:"' + encodeURIComponent(q) + '"', '_blank');
      }
    }
  ];

  function buildToolbar() {
    const bar = document.createElement('div');
    bar.id = 'gm-seo-toolbar';
    bar.style.cssText = [
      'display: inline-flex',
      'align-items: center',
      'gap: 4px',
      'margin-left: 8px',
      'vertical-align: middle'
    ].join(';');

    // separator before tools
    const sep = document.createElement('span');
    sep.style.cssText = 'width:1px;height:20px;background:#dadce0;margin:0 4px';
    bar.appendChild(sep);

    const btnStyle = [
      'height:30px',
      'padding:0 10px',
      'border:1px solid #dadce0',
      'border-radius:15px',
      'background:#fff',
      'font-size:12px',
      'color:#3c4043',
      'cursor:pointer',
      'white-space:nowrap'
    ].join(';');

    tools.forEach(t => {
      const btn = document.createElement('button');
      btn.textContent = t.label;
      btn.title = t.title;
      btn.style.cssText = btnStyle;
      btn.addEventListener('click', t.action);
      bar.appendChild(btn);
    });

    return bar;
  }

  // ═══════════════════════════════════════════
  //  Feature 7 — SERP Preset Switcher
  // ═══════════════════════════════════════════

  const FIXED_HL = 'zh-CN';
  const FORCE_PWS = '0';

  const presets = [
    { label: 'US · English', params: { gl: 'us', cr: 'countryUS', lr: 'lang_en' } },
    { label: 'UK · English', params: { gl: 'uk', cr: 'countryUK', lr: 'lang_en' } },
    { label: 'JP · Japanese', params: { gl: 'jp', cr: 'countryJP', lr: 'lang_ja' } },
    { label: 'SG · English', params: { gl: 'sg', cr: 'countrySG', lr: 'lang_en' } },
    { label: 'CN · 中文简体', params: { gl: 'cn', cr: 'countryCN', lr: 'lang_zh-CN' } },
    { label: 'HK · 中文香港', params: { gl: 'hk', cr: 'countryHK', lr: 'lang_zh-TW' } },
    { label: 'TW · 中文繁體', params: { gl: 'tw', cr: 'countryTW', lr: 'lang_zh-TW' } },
    { label: 'DE · Deutsch', params: { gl: 'de', cr: 'countryDE', lr: 'lang_de' } },
    { label: 'FR · Français', params: { gl: 'fr', cr: 'countryFR', lr: 'lang_fr' } }
  ];

  function getCurrentState(url) {
    return {
      q: url.searchParams.get('q') || url.searchParams.get('as_q') || '',
      gl: url.searchParams.get('gl') || '',
      hl: url.searchParams.get('hl') || '',
      lr: url.searchParams.get('lr') || '',
      cr: url.searchParams.get('cr') || '',
      pws: url.searchParams.get('pws') || ''
    };
  }

  function findPresetIndex(state) {
    return presets.findIndex(p =>
      (p.params.gl || '') === state.gl &&
      (p.params.cr || '') === state.cr &&
      (p.params.lr || '') === state.lr
    );
  }

  function hasAnyMeaningfulParams(state) {
    return Boolean(state.gl || state.cr || state.lr || state.hl || state.pws);
  }

  function buildCustomLabel(state) {
    return 'Custom · ' + [
      'gl=' + (state.gl || '-'),
      'cr=' + (state.cr || '-'),
      'lr=' + (state.lr || '-'),
      'hl=' + (state.hl || '-'),
      'pws=' + (state.pws || '-')
    ].join(' · ');
  }

  function buildSwitcher() {
    const wrap = document.createElement('div');
    wrap.id = 'gm-toolkit-bar';
    wrap.style.cssText = [
      'display:inline-flex',
      'align-items:center',
      'gap:6px',
      'vertical-align:middle'
    ].join(';');

    const select = document.createElement('select');
    select.style.cssText = [
      'height:36px',
      'padding:0 10px',
      'border:1px solid #dadce0',
      'border-radius:18px',
      'background:#fff',
      'font-size:14px',
      'color:#3c4043',
      'outline:none',
      'cursor:pointer',
      'max-width:360px'
    ].join(';');

    const btn = document.createElement('button');
    btn.textContent = 'Apply';
    btn.style.cssText = [
      'height:36px',
      'padding:0 14px',
      'border:1px solid #dadce0',
      'border-radius:18px',
      'background:#fff',
      'font-size:14px',
      'color:#3c4043',
      'cursor:pointer'
    ].join(';');

    const currentUrl = new URL(location.href);
    const state = getCurrentState(currentUrl);
    const matchedIndex = findPresetIndex(state);
    const hasParams = hasAnyMeaningfulParams(state);

    if (!hasParams) {
      const ph = document.createElement('option');
      ph.value = '';
      ph.textContent = 'SERP Preset';
      ph.selected = true;
      ph.disabled = true;
      ph.hidden = true;
      select.appendChild(ph);
    }

    if (hasParams && matchedIndex === -1) {
      const co = document.createElement('option');
      co.value = 'custom';
      co.textContent = buildCustomLabel(state);
      co.selected = true;
      select.appendChild(co);
    }

    presets.forEach((preset, i) => {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = preset.label;
      if (i === matchedIndex) opt.selected = true;
      select.appendChild(opt);
    });

    btn.addEventListener('click', () => {
      if (!select.value || select.value === 'custom') return;
      const next = new URL(location.href);
      const keyword = next.searchParams.get('q') || next.searchParams.get('as_q') || '';
      if (keyword) next.searchParams.set('q', keyword);
      ['as_q', 'as_epq', 'as_oq', 'as_eq', 'as_nlo', 'as_nhi',
        'as_qdr', 'as_sitesearch', 'as_occt', 'as_filetype', 'tbs'
      ].forEach(k => next.searchParams.delete(k));
      const p = presets[Number(select.value)];
      next.searchParams.set('gl', p.params.gl);
      next.searchParams.set('cr', p.params.cr);
      next.searchParams.set('lr', p.params.lr);
      next.searchParams.set('hl', FIXED_HL);
      next.searchParams.set('pws', FORCE_PWS);
      location.href = next.toString();
    });

    wrap.appendChild(select);
    wrap.appendChild(btn);
    return wrap;
  }

  // ═══════════════════════════════════════════
  //  Mount everything
  // ═══════════════════════════════════════════

  let mounted = false;

  function mount() {
    if (document.getElementById('gm-toolkit-bar')) return;

    const toolsButton = document.querySelector('#hdtb-tls');
    const toolsWrapper = toolsButton?.parentElement;
    if (!toolsWrapper?.parentElement) return;

    const switcher = buildSwitcher();
    const toolbar = buildToolbar();
    switcher.appendChild(toolbar);

    toolsWrapper.insertAdjacentElement('afterend', switcher);

    // Only mount stat enhancement once per full page context
    if (!mounted) {
      enhanceSearchStats();
      mounted = true;
    }
  }

  function boot() {
    mount();
    const observer = new MutationObserver(() => {
      mount();
      enhanceSearchStats();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  boot();
})();
