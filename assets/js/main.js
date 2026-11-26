/* =========================================================
   aiexcelh — 본문 스크립트
   1) 코드 블록: 언어 라벨 + 우측 상단 Copy 버튼
   2) 표: 가로 스크롤 래퍼
   ========================================================= */

(function () {
  'use strict';

  var LANG_LABELS = {
    text: 'TEXT',
    plaintext: 'TEXT',
    bash: 'BASH',
    shell: 'SHELL',
    sh: 'SHELL',
    zsh: 'SHELL',
    console: 'CONSOLE',
    yaml: 'YAML',
    yml: 'YAML',
    python: 'PYTHON',
    py: 'PYTHON',
    json: 'JSON',
    js: 'JS',
    javascript: 'JS',
    html: 'HTML',
    css: 'CSS',
    xml: 'XML',
    ini: 'INI',
    diff: 'DIFF'
  };

  function detectLang(pre) {
    var node = pre;
    while (node && node.classList && node !== document.body) {
      var names = Array.prototype.slice.call(node.classList);
      for (var i = 0; i < names.length; i++) {
        var m = /^language-([A-Za-z0-9_+#.-]+)$/.exec(names[i]);
        if (m) return m[1].toLowerCase();
      }
      node = node.parentElement;
    }
    return '';
  }

  function codeText(pre) {
    var code = pre.querySelector('code');
    var text = (code || pre).textContent || '';
    return text.replace(/\n+$/, '');
  }

  function copyLegacy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        if (copyLegacy(text)) return;
        throw new Error('copy failed');
      });
    }
    return copyLegacy(text)
      ? Promise.resolve()
      : Promise.reject(new Error('copy failed'));
  }

  function feedback(button, message, cls, delay) {
    button.textContent = message;
    button.classList.add(cls);
    window.setTimeout(function () {
      button.textContent = 'Copy';
      button.classList.remove(cls);
    }, delay);
  }

  function enhanceCodeBlock(pre) {
    if (pre.dataset.copyReady === 'true') return;
    pre.dataset.copyReady = 'true';

    /* Rouge는 div.highlighter-rouge > div.highlight > pre 로 감싼다.
       바깥 래퍼가 있으면 그것을 블록 루트로 삼는다. */
    var root = pre;
    var up = pre.parentElement;
    while (up && up !== document.body) {
      if (up.classList && (up.classList.contains('highlighter-rouge') || up.classList.contains('highlight'))) {
        root = up;
      }
      up = up.parentElement;
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'code-block';

    var head = document.createElement('div');
    head.className = 'code-head';

    var label = document.createElement('span');
    label.className = 'code-lang';
    var lang = detectLang(pre);
    label.textContent = LANG_LABELS[lang] || (lang ? lang.toUpperCase() : 'CODE');

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', '이 코드 블록 전체 복사');

    head.appendChild(label);
    head.appendChild(button);

    root.parentNode.insertBefore(wrapper, root);
    wrapper.appendChild(head);
    wrapper.appendChild(root);

    button.addEventListener('click', function () {
      copyText(codeText(pre)).then(function () {
        feedback(button, 'Copied!', 'is-copied', 1600);
      }).catch(function () {
        feedback(button, 'Ctrl+C', 'is-failed', 2200);
      });
    });
  }

  function wrapTables(scope) {
    var tables = scope.querySelectorAll('table');
    Array.prototype.forEach.call(tables, function (table) {
      if (table.parentElement && table.parentElement.classList.contains('table-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function init() {
    var body = document.querySelector('.post-body');
    if (!body) return;

    Array.prototype.forEach.call(body.querySelectorAll('pre'), enhanceCodeBlock);
    wrapTables(body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
