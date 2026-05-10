/**
 * Hijack mirrored CF7 order form → JSON POST → NEW ORDER REST.
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
      wrap.querySelector('form.wpcf7-form') || wrap.querySelector('form');
    if (!form) {
      return;
    }

    var out = wrap.querySelector('.wpcf7-response-output') || wrap.querySelector('.order-response');

    /**
     * Contact Form 7 wires ajaxForm on this form too. Without stopping it, CF7 toggles ajax-loader /
     * "送信中" while our fetch runs → stuck UI + 404 on ajax-loader.gif. Capture + stopImmediatePropagation
     * runs before CF7's bubble-phase submit handler on the same form.
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

          fetch(cfg.ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            body: fd,
            signal: controller ? controller.signal : undefined
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

              var success = !!pack.body.success;
              var msg =
                pack.body.message ||
                (success ? '送信しました。' : '送信に失敗しました。');

              /* Partial success: order saved server-side but customer confirmation mail failed */
              if (success && pack.body.customerMailSent === false) {
                showMessage(out, msg, true);
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
