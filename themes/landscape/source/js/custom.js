(function () {
  'use strict';

  var BackToTop = {
    init: function () {
      var btn = document.querySelector('.back-to-top');
      if (!btn) return;
      window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      });
      btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  var CodeCopy = {
    init: function () {
      var blocks = document.querySelectorAll('.highlight');
      blocks.forEach(function (block) {
        var btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.textContent = 'Copy';
        btn.addEventListener('click', function () {
          var code = block.querySelector('code');
          if (!code) return;
          var text = code.textContent;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function () {
              btn.textContent = 'Copied!';
              btn.classList.add('copied');
              setTimeout(function () {
                btn.textContent = 'Copy';
                btn.classList.remove('copied');
              }, 2000);
            });
          } else {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(function () {
              btn.textContent = 'Copy';
              btn.classList.remove('copied');
            }, 2000);
          }
        });
        block.style.position = 'relative';
        block.insertBefore(btn, block.firstChild);
      });
    }
  };

  var LazyLoad = {
    init: function () {
      var images = document.querySelectorAll('.article-entry img');
      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
              }
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        }, { rootMargin: '50px' });
        images.forEach(function (img) {
          if (!img.complete) {
            img.classList.add('loaded');
          } else {
            observer.observe(img);
          }
        });
      } else {
        images.forEach(function (img) {
          img.classList.add('loaded');
        });
      }
    }
  };

  var DarkMode = {
    init: function () {
      var toggle = document.querySelector('.theme-toggle');
      if (!toggle) return;
      var stored = localStorage.getItem('theme');
      if (stored) {
        document.documentElement.setAttribute('data-theme', stored);
      }
      toggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      });
    }
  };

  var CJKSpacing = {
    init: function () {
      var entries = document.querySelectorAll('.article-entry');
      entries.forEach(function (entry) {
        this.processNode(entry);
      }.bind(this));
    },
    processNode: function (node) {
      var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
      var textNodes = [];
      while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
      }
      textNodes.forEach(function (textNode) {
        var text = textNode.nodeValue;
        var changed = text
          .replace(/([\u4e00-\u9fff\u3400-\u4dbf])([a-zA-Z0-9])/g, '$1 $2')
          .replace(/([a-zA-Z0-9])([\u4e00-\u9fff\u3400-\u4dbf])/g, '$1 $2')
          .replace(/([\u4e00-\u9fff\u3400-\u4dbf])([0-9])/g, '$1 $2')
          .replace(/([0-9])([\u4e00-\u9fff\u3400-\u4dbf])/g, '$1 $2');
        if (changed !== text) {
          textNode.nodeValue = changed;
        }
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    BackToTop.init();
    CodeCopy.init();
    LazyLoad.init();
    DarkMode.init();
    CJKSpacing.init();
  });
})();
