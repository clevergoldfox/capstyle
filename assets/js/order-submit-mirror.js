/**
 * Order modal (mirror): POST FormData → admin-ajax.php → wp_mail (admin + customer via theme PHP).
 */
(function () {
  function parseResponseJson(resp, text) {
    try {
      return JSON.parse(text);
    } catch (_e) {
      return null;
    }
  }

  function ensureSubmitSpinner(btn) {
    if (!btn || !btn.parentElement) {
      return null;
    }
    var sp = btn.parentElement.querySelector('.neworder-submit-spinner');
    if (!sp) {
      sp = document.createElement('span');
      sp.className = 'neworder-submit-spinner';
      sp.setAttribute('role', 'status');
      /* Decorative: progress is also exposed via submit aria-busy */
      sp.setAttribute('aria-hidden', 'true');
      btn.insertAdjacentElement('afterend', sp);
    }
    return sp;
  }

  function setSending(formEl, submitting) {
    var btn = formEl.querySelector('[type="submit"]');
    if (btn) {
      btn.disabled = submitting;
      btn.setAttribute('aria-busy', submitting ? 'true' : 'false');
      var sp = ensureSubmitSpinner(btn);
      if (sp) {
        sp.classList.toggle('is-active', submitting);
      }
    }
  }

  function logMailProcessToConsole(cfg, body) {
    if (!cfg || !cfg.mailProcessLogClient || !body || !body.mailProcessLog) {
      return;
    }
    var rows = body.mailProcessLog;
    if (!Array.isArray(rows) || rows.length === 0) {
      return;
    }
    try {
      console.groupCollapsed('[NEW ORDER] mail process (server)');
      rows.forEach(function (row) {
        var ms = row && typeof row.elapsedMs !== 'undefined' ? row.elapsedMs : '';
        var ev = row && row.event ? row.event : '';
        var rest = {};
        if (row && typeof row === 'object') {
          Object.keys(row).forEach(function (k) {
            if (k !== 'event' && k !== 'elapsedMs') {
              rest[k] = row[k];
            }
          });
        }
        if (Object.keys(rest).length) {
          console.log('+' + ms + 'ms', ev, rest);
        } else {
          console.log('+' + ms + 'ms', ev);
        }
      });
      console.groupEnd();
    } catch (_e) {
      /* ignore */
    }
  }

  function showMessage(box, text, isError) {
    if (!box) {
      window.alert(text);
      return;
    }
    box.className = box.className.replace(/\bis-error\b/, '').trim();
    if (isError) {
      box.className += ' is-error';
    }
    box.style.display = 'block';
    box.textContent = text;
    box.focus();
    try {
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (_e) {
      /* ignore old browsers */
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var cfg = window.NEW_ORDER_ORDER_SUBMIT;
    if (!cfg || !cfg.ajaxUrl || !cfg.nonce) {
      return;
    }

    var wrap = document.getElementById('formWrap');
    if (!wrap) {
      return;
    }

    var form =
      wrap.querySelector('form.neworder-order-form') || wrap.querySelector('form');
    if (!form) {
      return;
    }

    var out =
      wrap.querySelector('.neworder-order-response') ||
      wrap.querySelector('.order-response');

    /*
     * Capture phase: legacy CF7 snippets (if still present after deploy) attach submit handlers later;
     * we must own submit for fetch-based delivery.
     */
    form.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        showMessage(out, '', false);

        try {
          var fd = new FormData(form);
          fd.set('action', 'neworder_submit_order');
          fd.set('_wpnonce', cfg.nonce);

          setSending(form, true);

          var controller =
            typeof AbortController !== 'undefined' ? new AbortController() : null;
          var fetchTimer = window.setTimeout(
            function () {
              if (controller) {
                controller.abort();
              }
            },
            120000
          );

          var capEl = document.querySelector('.capWrap');
          var previewPromise = Promise.resolve();
          if (typeof window.html2canvas === 'function' && capEl) {
            previewPromise = window
              .html2canvas(capEl, {
                scale: 1,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: null
              })
              .then(function (canvas) {
                try {
                  if (!canvas) {
                    return;
                  }
                  var dataUrl = canvas.toDataURL('image/jpeg', 0.72);
                  var comma = dataUrl.indexOf(',');
                  if (comma > 0) {
                    fd.set('order_preview_png', dataUrl.slice(comma + 1));
                  }
                } catch (_cap) {
                  /* ignore */
                }
              });
          }

          previewPromise
            .catch(function () {
              /* best-effort preview for order mail attachment */
            })
            .then(function () {
              return fetch(cfg.ajaxUrl, {
                method: 'POST',
                credentials: 'same-origin',
                body: fd,
                signal: controller ? controller.signal : undefined
              });
            })
            .then(function (resp) {
              return resp.text().then(function (text) {
                return {
                  ok: resp.ok,
                  status: resp.status,
                  body: parseResponseJson(resp, text),
                  rawLen: text.length
                };
              });
            })
            .then(function (pack) {
              window.clearTimeout(fetchTimer);
              setSending(form, false);

              if (!pack.body) {
                showMessage(
                  out,
                  'サーバー応答を解釈できませんでした（HTTP ' +
                    pack.status +
                    '）。セキュリティ設定で admin-ajax がブロックされていないか確認してください。',
                  true
                );
                return;
              }

              logMailProcessToConsole(cfg, pack.body);

              var success = !!pack.body.success;
              var msg =
                pack.body.message ||
                (success ? '送信しました。' : '送信に失敗しました。');

              if (success && cfg.thankYouUrl) {
                window.location.href = cfg.thankYouUrl;
                return;
              }

              showMessage(out, msg, !success || pack.status >= 400);
            })
            .catch(function (_err) {
              window.clearTimeout(fetchTimer);
              setSending(form, false);
              var aborted =
                typeof _err !== 'undefined' &&
                _err &&
                _err.name === 'AbortError';
              showMessage(
                out,
                aborted
                  ? 'サーバーからの応答が遅すぎます（メール送信に時間がかかっている可能性があります）。しばらくしてから送信結果やメール受信をご確認ください。'
                  : '通信エラーです。時間をおいてから再度お試しください。',
                true
              );
            });
        } catch (_e2) {
          setSending(form, false);
          showMessage(out, '送信中にエラーが発生しました。', true);
        }
      },
      true
    );
  });
})();
