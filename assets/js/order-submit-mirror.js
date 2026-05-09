/**
 * Hijack mirrored CF7 order form → JSON POST → NEW ORDER REST.
 */
(function () {
  function formToOrderedPayload(form, nonce) {
    var data = { _wpnonce: nonce };
    var fd = new FormData(form);
    fd.forEach(function (value, key) {
      if (data[key] === undefined) {
        data[key] = value;
        return;
      }
      if (Array.isArray(data[key])) {
        data[key].push(value);
        return;
      }
      data[key] = [data[key], value];
    });
    return data;
  }

  function setSending(formEl, submitting) {
    var btn = formEl.querySelector('[type="submit"]');
    if (btn) {
      btn.disabled = submitting;
      btn.setAttribute('aria-busy', submitting ? 'true' : 'false');
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
    if (!cfg || !cfg.endpoint || !cfg.nonce) {
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

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showMessage(out, '', false);

      try {
        var payload = formToOrderedPayload(form, cfg.nonce);

        /* Unchecked checkbox does not serialize; omit key for acceptance. */

        setSending(form, true);

        fetch(cfg.endpoint, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(function (resp) {
            return resp.json().then(function (body) {
              return { ok: resp.ok, status: resp.status, body: body };
            });
          })
          .then(function (pack) {
            setSending(form, false);

            var success = !!(pack.body && pack.body.success);
            var msg = (pack.body && pack.body.message) ||
              (success
                ? '送信しました。'
                : '送信に失敗しました。');

            if (
              pack.body &&
              success &&
              pack.body.customerMailSent === false
            ) {
              msg += ' （確認メールの送信のみ失敗しました。管理者には届いている可能性があります。）';
              showMessage(out, msg, true);
              return;
            }

            showMessage(out, msg, !success || pack.status >= 400);
          })
          .catch(function (_err) {
            setSending(form, false);
            showMessage(
              out,
              '通信エラーです。時間をおいてから再度お試しください。',
              true
            );
          });
      } catch (_e2) {
        setSending(form, false);
        showMessage(out, '送信中にエラーが発生しました。', true);
      }
    });
  });
})();
