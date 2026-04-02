// ==UserScript==
// @name         Google SERP Preset Switch for SEO
// @name:zh-CN   Google SERP 预设切换器（SEO）
// @namespace    https://github.com/wweggplant/google-serp-preset-switch
// @version      1.0.0
// @description  Quickly switch Google SERP presets for SEO checking with gl, cr, lr, hl and pws.
// @description:zh-CN  快速切换 Google SERP 预设，便于用 gl、cr、lr、hl、pws 检查不同地区和语言下的搜索结果。
// @author       wweggplant
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.co.jp/search*
// @match        *://www.google.co.uk/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @homepageURL  https://github.com/wweggplant/google-serp-preset-switch
// @supportURL   https://github.com/wweggplant/google-serp-preset-switch/issues
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const FORCE_PWS = '0';
  const PLACEHOLDER_LABEL = 'SERP Preset';

  const presets = [
    { label: 'US · English',  params: { gl: 'us', cr: 'countryUS', lr: 'lang_en',    hl: 'en' } },
    { label: 'UK · English',  params: { gl: 'uk', cr: 'countryUK', lr: 'lang_en',    hl: 'en' } },
    { label: 'JP · Japanese', params: { gl: 'jp', cr: 'countryJP', lr: 'lang_ja',    hl: 'ja' } },
    { label: 'SG · English',  params: { gl: 'sg', cr: 'countrySG', lr: 'lang_en',    hl: 'en' } },
    { label: 'CN · 中文简体', params: { gl: 'cn', cr: 'countryCN', lr: 'lang_zh-CN', hl: 'zh-CN' } },
    { label: 'HK · 中文香港', params: { gl: 'hk', cr: 'countryHK', lr: 'lang_zh-TW', hl: 'zh-TW' } },
    { label: 'TW · 中文繁體', params: { gl: 'tw', cr: 'countryTW', lr: 'lang_zh-TW', hl: 'zh-TW' } },
    { label: 'DE · Deutsch',  params: { gl: 'de', cr: 'countryDE', lr: 'lang_de',    hl: 'de' } },
    { label: 'FR · Français', params: { gl: 'fr', cr: 'countryFR', lr: 'lang_fr',    hl: 'fr' } }
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
      (p.params.cr || '') === state.cr &&
      (p.params.lr || '') === state.lr
    );
  }

  function hasAnyMeaningfulParams(state) {
    return Boolean(state.gl || state.cr || state.lr || state.hl || state.pws);
  }

  function buildCustomLabel(state) {
    const parts = [];
    parts.push(`gl=${state.gl || '-'}`);
    parts.push(`cr=${state.cr || '-'}`);
    parts.push(`lr=${state.lr || '-'}`);
    parts.push(`hl=${state.hl || '-'}`);
    parts.push(`pws=${state.pws || '-'}`);
    return `Custom · ${parts.join(' · ')}`;
  }

  function buildSwitcher() {
    const wrap = document.createElement('div');
    wrap.id = 'gm-region-switcher-inline';
    wrap.style.cssText = [
      'display:inline-flex',
      'align-items:center',
      'gap:6px',
      'margin-left:12px',
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

    // 1) 完全没参数：显示 placeholder
    if (!hasParams) {
      const placeholderOpt = document.createElement('option');
      placeholderOpt.value = '';
      placeholderOpt.textContent = PLACEHOLDER_LABEL;
      placeholderOpt.selected = true;
      placeholderOpt.disabled = true;
      placeholderOpt.hidden = true;
      select.appendChild(placeholderOpt);
    }

    // 2) 有参数但匹配不到 preset：显示 Custom
    if (hasParams && matchedIndex === -1) {
      const customOpt = document.createElement('option');
      customOpt.value = 'custom';
      customOpt.textContent = buildCustomLabel(state);
      customOpt.selected = true;
      select.appendChild(customOpt);
    }

    // 3) 正常 preset 选项
    presets.forEach((preset, index) => {
      const opt = document.createElement('option');
      opt.value = String(index);
      opt.textContent = preset.label;
      if (index === matchedIndex) opt.selected = true;
      select.appendChild(opt);
    });

    btn.addEventListener('click', () => {
      if (!select.value || select.value === 'custom') return;

      const next = new URL(location.href);
      const keyword = next.searchParams.get('q') || next.searchParams.get('as_q') || '';

      if (keyword) {
        next.searchParams.set('q', keyword);
      }

      [
        'as_q', 'as_epq', 'as_oq', 'as_eq', 'as_nlo', 'as_nhi',
        'as_qdr', 'as_sitesearch', 'as_occt', 'as_filetype',
        'tbs'
      ].forEach(key => next.searchParams.delete(key));

      const preset = presets[Number(select.value)];
      next.searchParams.set('gl', preset.params.gl);
      next.searchParams.set('cr', preset.params.cr);
      next.searchParams.set('lr', preset.params.lr);
      next.searchParams.set('hl', preset.params.hl);
      next.searchParams.set('pws', FORCE_PWS);

      location.href = next.toString();
    });

    wrap.appendChild(select);
    wrap.appendChild(btn);
    return wrap;
  }

  function mount() {
    if (document.getElementById('gm-region-switcher-inline')) return;

    const toolsButton = document.querySelector('#hdtb-tls');
    const toolsWrapper = toolsButton?.parentElement;
    if (!toolsWrapper?.parentElement) return;

    toolsWrapper.insertAdjacentElement('afterend', buildSwitcher());
  }

  function boot() {
    mount();

    const observer = new MutationObserver(() => {
      mount();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  boot();
})();
