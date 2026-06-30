(function() {
  'use strict';

  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > window.innerHeight) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });
    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initCodeCopy() {
    var codeBlocks = document.querySelectorAll('.highlight');
    codeBlocks.forEach(function(block) {
      var button = document.createElement('button');
      button.className = 'code-copy-btn';
      button.textContent = '\u590D\u5236';
      button.setAttribute('aria-label', '\u590D\u5236\u4EE3\u7801');
      block.style.position = 'relative';
      block.insertBefore(button, block.firstChild);
      button.addEventListener('click', function() {
        var code = block.querySelector('code') || block.querySelector('.code');
        if (!code) return;
        var text = code.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function() {
            button.textContent = '\u5DF2\u590D\u5236';
            button.classList.add('copied');
            setTimeout(function() {
              button.textContent = '\u590D\u5236';
              button.classList.remove('copied');
            }, 2000);
          });
        } else {
          var textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            button.textContent = '\u5DF2\u590D\u5236';
            button.classList.add('copied');
            setTimeout(function() {
              button.textContent = '\u590D\u5236';
              button.classList.remove('copied');
            }, 2000);
          } catch(e) {}
          document.body.removeChild(textarea);
        }
      });
    });
  }

  function initImageLazyLoad() {
    var images = document.querySelectorAll('.article-entry img');
    if (!images.length) return;
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.loading = 'lazy';
            img.addEventListener('load', function() {
              img.classList.add('loaded');
            });
            if (img.complete) img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });
      images.forEach(function(img) { observer.observe(img); });
    } else {
      images.forEach(function(img) { img.classList.add('loaded'); });
    }
  }

  function initThemeToggle() {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    var STORAGE_KEY = 'blog-color-scheme';
    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
    function getCurrentTheme() {
      var stored = null;
      try { stored = localStorage.getItem(STORAGE_KEY); } catch(e) {}
      return stored;
    }
    var current = getCurrentTheme();
    if (!current) {
      current = 'dark';
      applyTheme('dark');
    } else {
      applyTheme(current);
    }
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch(e2) {}
    });
    if (window.matchMedia) {
      var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', function(e) {
          var stored = null;
          try { stored = localStorage.getItem(STORAGE_KEY); } catch(e2) {}
          if (!stored) {
            applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
    }
  }

  function initCjkSpacing() {
    var entry = document.querySelector('.article-entry');
    if (!entry) return;
    var walker = document.createTreeWalker(entry, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        var parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        var tag = parent.tagName.toLowerCase();
        if (tag === 'code' || tag === 'pre' || tag === 'kbd' || tag === 'samp') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var cjk = /[\u2e80-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
    var alphaNum = /[a-zA-Z0-9]/;
    var nodes = [];
    var node;
    while (node = walker.nextNode()) {
      nodes.push(node);
    }
    nodes.forEach(function(textNode) {
      var text = textNode.nodeValue;
      var changed = false;
      var result = '';
      for (var i = 0; i < text.length; i++) {
        var current = text[i];
        var next = text[i + 1];
        result += current;
        if (next && (
          (cjk.test(current) && alphaNum.test(next)) ||
          (alphaNum.test(current) && cjk.test(next))
        )) {
          result += '\u2009';
          changed = true;
        }
      }
      if (changed) {
        textNode.nodeValue = result;
      }
    });
  }

  function initCardHoverShadow() {
    var cards = document.querySelectorAll('.article-inner');
    cards.forEach(function(card) {
      card.addEventListener('mouseenter', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var offsetX = Math.max(-4, Math.min(4, x / rect.width * 8));
        var offsetY = Math.max(-4, Math.min(4, y / rect.height * 8));
        card.style.boxShadow = offsetX + 'px ' + (8 + offsetY) + 'px 16px rgba(125, 211, 208, 0.15)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.boxShadow = '';
      });
    });
  }

  function init() {
    initBackToTop();
    initCodeCopy();
    initImageLazyLoad();
    initThemeToggle();
    initCjkSpacing();
    initCardHoverShadow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
