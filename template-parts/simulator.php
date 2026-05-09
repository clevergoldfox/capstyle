<?php
/**
 * Simulator UI template.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}
?>
<main class="neworder-simulator-page">
  <section class="neworder-simulator-layout">
    <div class="neworder-preview-panel">
      <h1>NEW ORDER Cap Embroidery Simulator</h1>
      <p>フォント・色・位置・サイズを調整して刺繍イメージを確認できます。</p>
      <div class="neworder-canvas-wrap">
        <canvas id="neworder-simulator-canvas" width="920" height="520"></canvas>
      </div>
    </div>

    <aside class="neworder-controls" aria-label="Simulator controls">
      <label for="neworder-text-input">刺繍文字</label>
      <input id="neworder-text-input" type="text" value="NEW ORDER" maxlength="24">

      <label for="neworder-font-select">フォント</label>
      <select id="neworder-font-select"></select>

      <label for="neworder-color-list">糸カラー</label>
      <div id="neworder-color-list" class="neworder-color-grid"></div>

      <label for="neworder-product-select">モデル</label>
      <select id="neworder-product-select"></select>

      <label for="neworder-product-color-select">ボディカラー</label>
      <select id="neworder-product-color-select"></select>

      <label for="neworder-font-size">文字サイズ</label>
      <input id="neworder-font-size" type="range" min="24" max="120" value="56">

      <label for="neworder-letter-spacing">文字間</label>
      <input id="neworder-letter-spacing" type="range" min="-10" max="40" value="0">

      <label for="neworder-position-x">横位置 (X)</label>
      <input id="neworder-position-x" type="range" min="-300" max="300" value="0">

      <label for="neworder-position-y">縦位置 (Y)</label>
      <input id="neworder-position-y" type="range" min="-180" max="180" value="0">

      <button id="neworder-export-button" type="button">プレビュー画像を生成</button>
      <a id="neworder-export-download" href="#" download="neworder-preview.png" hidden>画像をダウンロード</a>
      <textarea id="neworder-settings-json" rows="7" readonly></textarea>
    </aside>
  </section>
</main>
