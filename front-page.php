<?php
/**
 * Front page template.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}

get_header();

$caps = array(
    array('name' => 'NEWERA NE400', 'price' => '¥4,800', 'lot' => '1個〜'),
    array('name' => 'NEWERA NE400 FLAG', 'price' => '¥5,800', 'lot' => '1個〜'),
    array('name' => 'NEWERA NE403', 'price' => '¥4,800', 'lot' => '1個〜'),
    array('name' => 'NEWERA NE403 FLAG', 'price' => '¥5,800', 'lot' => '1個〜'),
    array('name' => 'NEWERA NE404', 'price' => '¥4,800', 'lot' => '1個〜'),
    array('name' => 'NEWERA NE304', 'price' => '¥4,800', 'lot' => '1個〜'),
    array('name' => 'NEWERA NE205', 'price' => '¥4,800', 'lot' => '1個〜'),
    array('name' => 'NEWERA NE205 FLAG', 'price' => '¥5,800', 'lot' => '1個〜'),
    array('name' => 'NEWERA NE001', 'price' => '¥4,800', 'lot' => '1個〜'),
    array('name' => 'YUPOONG 6089', 'price' => '¥4,200', 'lot' => '1個〜'),
    array('name' => 'OTTO 0987', 'price' => '¥4,200', 'lot' => '1個〜'),
    array('name' => 'TOP OF THE WORLD', 'price' => '¥4,200', 'lot' => '1個〜'),
);

$faqs = array(
    array(
        'q' => '注文後、どれくらいで届きますか？',
        'a' => 'ご注文いただいてから2〜3週間程でお届けします。工場の受注状況・在庫状況により前後する場合があります。',
    ),
    array(
        'q' => 'どれくらいの大きさまで刺繍できますか？',
        'a' => '刺繍可能範囲は横12cm x 縦6cmです。',
    ),
    array(
        'q' => 'キャップのサイドやバックにも刺繍できますか？',
        'a' => '可能です。注文時の備考欄に希望内容をご記入ください。追加料金がかかる場合があります。',
    ),
    array(
        'q' => '送料はどれくらいかかりますか？',
        'a' => '全国一律800円です。30,000円以上の購入で送料無料です。',
    ),
);
?>

<main>
  <section class="hero" id="custom-order">
    <div class="container">
      <div class="eyebrow">Snapback Caps / Custom Order</div>
      <h1><?php esc_html_e('オリジナルキャップを作ろう。', 'capstylus-clone'); ?></h1>
      <p class="lead"><?php esc_html_e('キャップスタイラスは、オリジナルのスナップバックキャップが1個からオーダーできるカスタムオーダーサービスです。専用シミュレーターで簡単にデザインできます。', 'capstylus-clone'); ?></p>
      <p><?php esc_html_e('刺繍可能範囲: 12cm x 6cm', 'capstylus-clone'); ?></p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#capbody"><?php esc_html_e('今すぐカスタマイズ', 'capstylus-clone'); ?></a>
        <a class="btn btn-secondary" href="https://www.capstylus.com/contact"><?php esc_html_e('お問い合わせ', 'capstylus-clone'); ?></a>
      </div>
    </div>
  </section>

  <section class="section" id="capbody">
    <div class="container">
      <h2><?php esc_html_e('CAPBODY シミュレーターでオーダーできるキャップボディ', 'capstylus-clone'); ?></h2>
      <p class="lead"><?php esc_html_e('CapStylus掲載モデルから主要ラインナップを再現しています。価格は刺繍代込みの表示です。', 'capstylus-clone'); ?></p>
      <div class="caps-grid">
        <?php foreach ($caps as $cap) : ?>
          <article class="cap-card">
            <h3 class="cap-name"><?php echo esc_html($cap['name']); ?></h3>
            <div class="cap-meta"><?php echo esc_html('PRICE ' . $cap['price'] . ' / LOT ' . $cap['lot']); ?></div>
          </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="section" id="discount">
    <div class="container split">
      <div>
        <h2><?php esc_html_e('VOLUME DISCOUNT 注文数に応じた割引', 'capstylus-clone'); ?></h2>
        <p><?php esc_html_e('デザインが同じキャップの同時オーダーの場合のみ適用されます。', 'capstylus-clone'); ?></p>
        <table class="discount-table">
          <thead>
            <tr>
              <th><?php esc_html_e('注文数', 'capstylus-clone'); ?></th>
              <th><?php esc_html_e('割引率', 'capstylus-clone'); ?></th>
            </tr>
          </thead>
          <tbody>
            <tr><td>5個〜9個</td><td>5%割引</td></tr>
            <tr><td>10個〜19個</td><td>10%割引</td></tr>
            <tr><td>20個以上</td><td>15%割引</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <h2><?php esc_html_e('FLOW 商品到着までの流れ', 'capstylus-clone'); ?></h2>
        <ul class="flow-list">
          <li class="flow-item"><?php esc_html_e('1. キャップのデザイン、必須項目を入力して注文。', 'capstylus-clone'); ?></li>
          <li class="flow-item"><?php esc_html_e('2. 内容確認後、お支払いに関する連絡。', 'capstylus-clone'); ?></li>
          <li class="flow-item"><?php esc_html_e('3. 支払い確定後、制作開始。', 'capstylus-clone'); ?></li>
          <li class="flow-item"><?php esc_html_e('4. 制作完了後、2〜3週間を目安に発送。', 'capstylus-clone'); ?></li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section" id="faq">
    <div class="container">
      <h2><?php esc_html_e('FAQ よくある質問', 'capstylus-clone'); ?></h2>
      <ul class="faq-list">
        <?php foreach ($faqs as $item) : ?>
          <li class="faq-item">
            <p class="faq-q"><?php echo esc_html('Q. ' . $item['q']); ?></p>
            <p><?php echo esc_html('A. ' . $item['a']); ?></p>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>
</main>

<?php
get_footer();
