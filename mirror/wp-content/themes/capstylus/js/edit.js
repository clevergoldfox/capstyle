/**
 * メール等のデザイン確認リンクでは注文フォームの自動表示を抑止する。
 *
 * @return {boolean} true = 自動でフォームを開かない
 */
function neworderSkipOrderFormAutoOpenFromUrl() {
	var search = window.location.search || '';
	if (/[?&]preview=1(?:&|$)/i.test(search)) {
		return true;
	}
	var path = window.location.pathname.replace(/\/+$/, '') || '/';
	var homePath = '/';
	if (typeof window.NEWORDER_HOME_PATH === 'string' && window.NEWORDER_HOME_PATH !== '') {
		homePath = window.NEWORDER_HOME_PATH.replace(/\/+$/, '') || '/';
	}
	return path === '/' || path === '' || path === homePath;
}

$(function(){

	// ウィンドウサイズセット
	var w = $(window).width();
	var x = 641;


	// キャップリスト
	var cap_newera_ne400_Black        = 'NEWERA NE400 / BLACK'; // Blackの大文字はツートンとの混合処理を回避
	var cap_newera_ne400_gray         = 'NEWERA NE400 / CHARCOAL';
	var cap_newera_ne400_navy         = 'NEWERA NE400 / NAVY';
	var cap_newera_ne400_royal        = 'NEWERA NE400 / ROYAL';
	var cap_newera_ne400_black_red    = 'NEWERA NE400 / BLACK-RED';
	var cap_newera_ne400_black_orande = 'NEWERA NE400 / BLACK-ORANGE';
	var cap_newera_ne400_black_blue   = 'NEWERA NE400 / BLACK-BLUE';
	var cap_newera_ne400_chacoal_navy = 'NEWERA NE400 / CHACOAL-NAVY';
	var cap_newera_ne400_camo         = 'NEWERA NE400 / CAMO';
	var cap_newera_ne400_white        = 'NEWERA NE400 / WHITE';

	var cap_newera_ne400_flag_black         = 'NEWERA NE400 FLAG / BLACK';
	var cap_newera_ne400_flag_charcoal      = 'NEWERA NE400 FLAG / CHARCOAL';
	var cap_newera_ne400_flag_navy          = 'NEWERA NE400 FLAG / NAVY';
	var cap_newera_ne400_flag_grey          = 'NEWERA NE400 FLAG / GREY';
	var cap_newera_ne400_flag_royal         = 'NEWERA NE400 FLAG / ROYAL';
	var cap_newera_ne400_flag_white         = 'NEWERA NE400 FLAG / WHITE';
	var cap_newera_ne400_flag_charcoal_navy = 'NEWERA NE400 FLAG / CHARCOAL-NAVY';
	var cap_newera_ne400_flag_black_orange  = 'NEWERA NE400 FLAG / BLACK-ORANGE';

	var cap_newera_ne403_black = 'NEWERA NE403 / BLACK';
	var cap_newera_ne403_camo  = 'NEWERA NE403 / CAMO';
	var cap_newera_ne403_grey  = 'NEWERA NE403 / GREY';
	var cap_newera_ne403_navy  = 'NEWERA NE403 / NAVY';
	var cap_newera_ne403_olive = 'NEWERA NE403 / OLIVE';

	var cap_newera_ne403_flag_black = 'NEWERA NE403 FLAG / BLACK';
	var cap_newera_ne403_flag_navy  = 'NEWERA NE403 FLAG / NAVY';

	var cap_newera_ne404_black = 'NEWERA NE404 / BLACK';
	var cap_newera_ne404_navy  = 'NEWERA NE404 / NAVY';
	var cap_newera_ne404_red   = 'NEWERA NE404 / RED';

	var cap_newera_ne304_black = 'NEWERA NE304 (KIDS) / BLACK';
	var cap_newera_ne304_navy  = 'NEWERA NE304 (KIDS) / NAVY';
	var cap_newera_ne304_royal = 'NEWERA NE304 (KIDS) / ROYAL';

	var cap_newera_ne205_black = 'NEWERA NE205 / BLACK';
	var cap_newera_ne205_navy  = 'NEWERA NE205 / NAVY';

	var cap_newera_ne205_flag_black = 'NEWERA NE205 FLAG / BLACK';
	var cap_newera_ne205_flag_navy  = 'NEWERA NE205 FLAG / NAVY';

	var cap_newera_ne201_flag_black = 'NEWERA NE201 FLAG / BLACK';
	var cap_newera_ne201_flag_navy  = 'NEWERA NE201 FLAG / NAVY';

	var cap_newera_ne001_black       = 'NEWERA NE001 / BLACK';
	var cap_newera_ne001_navy        = 'NEWERA NE001 / NAVY';
	var cap_newera_ne001_graphite    = 'NEWERA NE001 / GRAPHITE';
	var cap_newera_ne001_white       = 'NEWERA NE001 / WHITE';
	var cap_newera_ne001_pinkbeige   = 'NEWERA NE001 / PINK-BEIGE';

	var cap_newera_ne501_black     = 'NEWERA NE501 / BLACK';
	var cap_newera_ne501_deepnavy  = 'NEWERA NE501 / DEEP NAVY';
	var cap_newera_ne501_graphite  = 'NEWERA NE501 / GRAPHITE';
	var cap_newera_ne501_royal     = 'NEWERA NE501 / ROYAL';
	var cap_newera_ne501_skyblue   = 'NEWERA NE501 / SKY BLUE';
	var cap_newera_ne501_white     = 'NEWERA NE501 / WHITE';

	var cap_newera_ne215_black     = 'NEWERA NE215 / BLACK';
	var cap_newera_ne215_deepnavy  = 'NEWERA NE215 / DEEP NAVY';
	var cap_newera_ne215_graphite  = 'NEWERA NE215 / GRAPHITE';
	var cap_newera_ne215_royal     = 'NEWERA NE215 / ROYAL';
	var cap_newera_ne215_scarlet   = 'NEWERA NE215 / SCARLET';

	var cap_newera_ne900_grey  = 'NEWERA NE900 / GREY';
	var cap_newera_ne900_black = 'NEWERA NE900 / BLACK';
	var cap_newera_ne900_navy  = 'NEWERA NE900 / NAVY';

	var cap_newera_ne908_black = 'NEWERA NE908 / BLACK';
	var cap_newera_ne908_navy  = 'NEWERA NE908 / NAVY';
	var cap_newera_ne908_grey  = 'NEWERA NE908 / GREY';

	var cap_brimstar_brs001_black           = 'BRIMSTAR BRS01-001 / BLACK';
	var cap_brimstar_brs001_navy            = 'BRIMSTAR BRS01-001 / NAVY';
	var cap_brimstar_brs001_lightblue       = 'BRIMSTAR BRS01-001 / LIGHT BLUE';
	var cap_brimstar_brs001_lightblue_white = 'BRIMSTAR BRS01-001 / LIGHT BLUE - WHITE';
	var cap_brimstar_brs001_grey            = 'BRIMSTAR BRS01-001 / GREY';
	var cap_brimstar_brs001_olive_black     = 'BRIMSTAR BRS01-001 / OLIVE - BLACK';
	var cap_brimstar_brs001_red_black       = 'BRIMSTAR BRS01-001 / RED - BLACK';
	var cap_brimstar_brs001_pink_black      = 'BRIMSTAR BRS01-001 / PINK - BLACK';

	var cap_brimstar_brs01_002_black        = 'BRIMSTAR BRS01-002 / BLACK';
	var cap_brimstar_brs01_002_navy         = 'BRIMSTAR BRS01-002 / NAVY';

	var cap_brimstar_brs01_003_black        = 'BRIMSTAR BRS01-003 / BLACK';

	var cap_brimstar_brs01_006_khaki_black     = 'BRIMSTAR BRS01-006 / KHAKI - BLACK';
	var cap_brimstar_brs01_006_red_black       = 'BRIMSTAR BRS01-006 / RED - BLACK';
	var cap_brimstar_brs01_006_blue_black      = 'BRIMSTAR BRS01-006 / BLUE - BLACK';
	var cap_brimstar_brs01_006_lightblue_white = 'BRIMSTAR BRS01-006 / LIGHT BLUE - WHITE';

	var cap_otto_0987_black        = 'OTTO 0987 / BLACK';
	var cap_otto_0987_gray         = 'OTTO 0987 / GRAY';
	var cap_otto_0987_white_black  = 'OTTO 0987 / WHITE-BLACK';
	var cap_otto_0987_gray_black   = 'OTTO 0987 / GRAY-BLACK';
	var cap_otto_0987_navy_red     = 'OTTO 0987 / NAVY-RED';
	var cap_otto_0987_black_orange = 'OTTO 0987 / BLACK-ORANGE';
	var cap_otto_0987_black_purple = 'OTTO 0987 / BLACK-PURPLE';
	var cap_otto_0987_black_yellow = 'OTTO 0987 / BLACK-YELLOW';
	var cap_otto_0987_blue_orange  = 'OTTO 0987 / BLUE-ORANGE';

	var cap_otto_h1098_black       = 'OTTO H1098 / BLACK';
	var cap_otto_h1098_charcoal    = 'OTTO H1098 / CHARCOAL';
	var cap_otto_h1098_khaki       = 'OTTO H1098 / KHAKI';
	var cap_otto_h1098_navy        = 'OTTO H1098 / NAVY';

	var cap_otto_1070_white           = 'OTTO 141-1070 / WHITE';
	var cap_otto_1070_navy            = 'OTTO 141-1070 / NAVY';
	var cap_otto_1070_blue            = 'OTTO 141-1070 / BLUE';
	var cap_otto_1070_red             = 'OTTO 141-1070 / RED';
	var cap_otto_1070_black_white     = 'OTTO 141-1070 / BLACK-WHITE';
	var cap_otto_1070_red_black       = 'OTTO 141-1070 / RED-BLACK';
	var cap_otto_1070_camo            = 'OTTO 141-1070 / CAMO';
	var cap_otto_1070_black_grey      = 'OTTO 141-1070 / BLACK-GREY';
	var cap_otto_1070_black_red       = 'OTTO 141-1070 / BLACK-RED';
	var cap_otto_1070_charcoal_black  = 'OTTO 141-1070 / CHARCOAL-BLACK';

	var cap_maximum_mc6622_black       = 'MAXIMUM MC6622 / BLACK';
	var cap_maximum_mc6622_navy        = 'MAXIMUM MC6622 / NAVY';
	var cap_maximum_mc6622_black_white = 'MAXIMUM MC6622 / BLACK-WHITE';
	var cap_maximum_mc6622_gray_black  = 'MAXIMUM MC6622 / GRAY-BLACK';
	var cap_maximum_mc6622_black_red   = 'MAXIMUM MC6622 / BLACK-RED';

	var cap_maximum_mc6624_black = 'MAXIMUM MC6624 / BLACK';
	var cap_maximum_mc6624_navy  = 'MAXIMUM MC6624 / NAVY';
	var cap_maximum_mc6624_wine  = 'MAXIMUM MC6624 / WINE';
	var cap_maximum_mc6624_khaki = 'MAXIMUM MC6624 / KHAKI';
	var cap_maximum_mc6624_beige = 'MAXIMUM MC6624 / BEIGE';

	var cap_newhattan_1400_woodland  = 'NEWHATTAN 1400 / WOODLAND';
	var cap_newhattan_1400_black     = 'NEWHATTAN 1400 / BLACK';
	var cap_newhattan_1400_gray      = 'NEWHATTAN 1400 / GRAY';
	var cap_newhattan_1400_navy      = 'NEWHATTAN 1400 / NAVY';
	var cap_newhattan_1400_orange    = 'NEWHATTAN 1400 / ORANGE';
	var cap_newhattan_1400_white     = 'NEWHATTAN 1400 / WHITE';
	var cap_newhattan_1400_aqua      = 'NEWHATTAN 1400 / AQUA';
	var cap_newhattan_1400_lightpink = 'NEWHATTAN 1400 / LIGHT PINK';
	var cap_newhattan_1400_khaki     = 'NEWHATTAN 1400 / KHAKI';
	var cap_newhattan_1400_copper    = 'NEWHATTAN 1400 / COPPER';

	var cap_newhattan_1155_lightblue = 'NEWHATTAN 1155 / LIGHT-BLUE';
	var cap_newhattan_1155_darkblue  = 'NEWHATTAN 1155 / DARK-BLUE';
	var cap_newhattan_1155_charcoal  = 'NEWHATTAN 1155 / CHARCOAL';

	var cap_yupoong_6089_camo          = 'YUPOONG 6089 / CAMO';
	var cap_yupoong_6089_black         = 'YUPOONG 6089 / BLACK';
	var cap_yupoong_6089_navy          = 'YUPOONG 6089 / NAVY';
	var cap_yupoong_6089_purple        = 'YUPOONG 6089 / PURPLE';
	var cap_yupoong_6089_orange        = 'YUPOONG 6089 / ORANGE';
	var cap_yupoong_6089_white_black   = 'YUPOONG 6089 / WHITE-BLACK';
	var cap_yupoong_6089_purple_gold   = 'YUPOONG 6089 / PURPLE-GOLD';
	var cap_yupoong_6089_royal_orange  = 'YUPOONG 6089 / ROYAL-ORANGE';
	var cap_yupoong_6089_heather_black = 'YUPOONG 6089 / HEATHER-BLACK';
	var cap_yupoong_6089_heather_red   = 'YUPOONG 6089 / HEATHER-RED';
	var cap_yupoong_6089_heather_royal = 'YUPOONG 6089 / HEATHER-ROYAL';
	var cap_yupoong_6089_heather_navy  = 'YUPOONG 6089 / HEATHER-NAVY';

	var cap_hatco_black       = 'HATCO (KIDS SIZE) / BLACK';
	var cap_hatco_navy        = 'HATCO (KIDS SIZE) / NAVY';
	var cap_hatco_white_black = 'HATCO (KIDS SIZE) / WHITE-BLACK';

	var cap_totw_black       = 'TOP OF THE WORLD / BLACK';
	var cap_totw_grey_black  = 'TOP OF THE WORLD / GREY-BLACK';
	var cap_totw_navy        = 'TOP OF THE WORLD / NAVY';
	var cap_totw_red_navy    = 'TOP OF THE WORLD / RED-NAVY';
	var cap_totw_red         = 'TOP OF THE WORLD / RED';
	var cap_totw_white_black = 'TOP OF THE WORLD / WHITE-BLACK';
	var cap_totw_white_pink  = 'TOP OF THE WORLD / WHITE-PINK';

	// プライスリスト
	var price_1 = '¥ 4,800';
	var price_2 = '¥ 4,200';
	var price_3 = '¥ 5,800';


	// 選択状態
	if (w > x) {
		var selected = {
			body:  "cap_newera_ne400_Black",
			cap:   "NEWERA NE400 / BLACK",
			price: "¥ 4,800",
			font:  "font_colleges",
			text:  "New Order",
			color: "color_1",
			style: {
				size:     550,
				kerning:  0,
				vertical: 48,
				lateral:  0,
			}
		}
	} else {
		var selected = {
			body:  "cap_newera_ne400_Black",
			cap:   "NEWERA NE400 / BLACK",
			price: "¥ 4,800",
			font:  "font_colleges",
			text:  "New Order",
			color: "color_1",
			style: {
				size:     240,
				kerning:  0,
				vertical: 46,
				lateral:  0,
			}
		}
	}


	// urlを保存
	$('.btn-order').bind('click',function(){
		var url = 'https://www.capstylus.com/?body=' + selected.body + '&cap=' + selected.cap + '&price=' + selected.price + '&font=' + selected.font + '&text=' + selected.text + '&color=' + selected.color + '&size=' + selected.style.size + '&kerning=' + selected.style.kerning + '&vertical=' + selected.style.vertical + '&lateral=' + selected.style.lateral;

		// urlの短縮
		/*
 		function getShortUrl(url, callBack){
 			var key = "AIzaSyBlIkxwd_EVwWg5SzPPpd06twgZOufrbo0";
			if(!gapi) return callBack(false);
			gapi.client.setApiKey(key);
			gapi.client.load('urlshortener', 'v1', function(){
				var req = gapi.client.urlshortener.url.insert({
					resource: {
						'longUrl': url
					}
				});
				req.execute(function(data){
					if(data.error) return callBack(false);
					callBack(true, data.id);
				});
			});
		};
		getShortUrl(url, function(f, d){
			if(!f) return false;
			$('.url').val(d);
		});*/

		$('.url').val(encodeURI(url));

	});


	// パラメーターからデザインを再現
	var strSearch = location.search;
	if (strSearch.indexOf("body") >= 0 ) {
		function getUrlVars() {
			var vars = [], hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for(var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		}
		selected.body           = getUrlVars()["body"];
		selected.cap            = decodeURIComponent(getUrlVars()["cap"]);
		selected.price          = decodeURIComponent(getUrlVars()["price"]);
		selected.font           = getUrlVars()["font"];
		selected.text           = decodeURIComponent(getUrlVars()["text"]);
		selected.color          = getUrlVars()["color"];
		selected.style.size     = getUrlVars()["size"];
		selected.style.kerning  = getUrlVars()["kerning"];
		selected.style.vertical = getUrlVars()["vertical"];
		selected.style.lateral  = getUrlVars()["lateral"];
		$('.characterInput').val(selected.text);
		$('.characterSelect').html(selected.text);
		$('.capInput').val(selected.body);
		$('.nameInput').val(selected.cap);
		$('.priceInput').val(selected.price);
		$('.colorInput').val(selected.color);
		$('.fontSizeSlider').val(selected.style.size);
		$('.letterSpaceSlider').val(selected.style.kerning);
		$('.layoutLengthSlider').val(selected.style.vertical);
		$('.layoutSideSlider').val(selected.style.lateral);
		$('#character').css('font-size', selected.style.size + '%');
		$('#character').css('letter-spacing', selected.style.kerning + 'px');
		$('#character').css('top', selected.style.vertical + '%');
		$('#character').css('left', selected.style.lateral + '%');
		$('#name').html(selected.cap);
		$('#price').html(selected.price);
	}


	// URLにパラメータが有る場合はメインビジュアルをスキップ
	if (strSearch.indexOf("body") >= 0 ) {
		$('.coverWrap').css('display', 'none');
		$('.editWrap .inner').css('display', 'block');
		$('.containerSp').css({
			'cssText': 'padding-top: 30px !important;'
		});
	}
	// デザイン共有URL（メールのデザインURL等）ではフォームを自動表示しない（preview=1 またはトップのシミュレーター）
	if (
		strSearch.indexOf("body") >= 0 &&
		$('#formWrap').length &&
		$('#bg').length &&
		!neworderSkipOrderFormAutoOpenFromUrl()
	) {
		$('#bg, #formWrap').fadeIn(200);
	}


	// テキスト出力
	$('#character').html(selected.text).val();
	$('#defaulttext').val(selected.text);
	$('input[name="character"]').bind('click blur keydown keyup keypress change',function(){
		$('#character').html($('input[name="character"]').val());
		selected.text = $('input[name="character"]').val();
		$('.characterInput').val(selected.text);
		$('.characterSelect').html(selected.text);
	});


	// キャップ変更
	$('.capBox').addClass(selected.body);
	$('input[id*="' + selected.body + '"]').attr('checked', 'checked');
	$('#name').html(selected.cap);
	$('#price').html(selected.price);
	$('input[id*="cap_"]').click(function() {

		// cap_newera_ne400
		if ($("#cap_newera_ne400_Black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_Black');
			$('#name').html(cap_newera_ne400_Black);
			$('.nameInput').val(cap_newera_ne400_Black);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_Black');
		}
		if ($("#cap_newera_ne400_gray:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_gray');
			$('#name').html(cap_newera_ne400_gray);
			$('.nameInput').val(cap_newera_ne400_gray);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_gray');
		}
		if ($("#cap_newera_ne400_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_navy');
			$('#name').html(cap_newera_ne400_navy);
			$('.nameInput').val(cap_newera_ne400_navy);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_navy');
		}
		if ($("#cap_newera_ne400_stone:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_stone');
			$('#name').html(cap_newera_ne400_stone);
			$('.nameInput').val(cap_newera_ne400_stone);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_stone');
		}
		if ($("#cap_newera_ne400_royal:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_royal');
			$('#name').html(cap_newera_ne400_royal);
			$('.nameInput').val(cap_newera_ne400_royal);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_royal');
		}
		if ($("#cap_newera_ne400_black_red:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_black_red');
			$('#name').html(cap_newera_ne400_black_red);
			$('.nameInput').val(cap_newera_ne400_black_red);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_black_red');
		}
		if ($("#cap_newera_ne400_black_orande:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_black_orande');
			$('#name').html(cap_newera_ne400_black_orande);
			$('.nameInput').val(cap_newera_ne400_black_orande);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_black_orande');
		}
		if ($("#cap_newera_ne400_black_blue:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_black_blue');
			$('#name').html(cap_newera_ne400_black_blue);
			$('.nameInput').val(cap_newera_ne400_black_blue);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_black_blue');
		}
		if ($("#cap_newera_ne400_chacoal_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_chacoal_navy');
			$('#name').html(cap_newera_ne400_chacoal_navy);
			$('.nameInput').val(cap_newera_ne400_chacoal_navy);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_chacoal_navy');
		}
		if ($("#cap_newera_ne400_camo:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_camo');
			$('#name').html(cap_newera_ne400_camo);
			$('.nameInput').val(cap_newera_ne400_camo);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_camo');
		}
		if ($("#cap_newera_ne400_white:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_white');
			$('#name').html(cap_newera_ne400_white);
			$('.nameInput').val(cap_newera_ne400_white);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_white');
		}

		// cap_newera_ne400_flag
		if ($("#cap_newera_ne400_flag_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_flag_black');
			$('#name').html(cap_newera_ne400_flag_black);
			$('.nameInput').val(cap_newera_ne400_flag_black);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_flag_black');
		}
		if ($("#cap_newera_ne400_flag_charcoal:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_flag_charcoal');
			$('#name').html(cap_newera_ne400_flag_charcoal);
			$('.nameInput').val(cap_newera_ne400_flag_charcoal);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_flag_charcoal');
		}
		if ($("#cap_newera_ne400_flag_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_flag_navy');
			$('#name').html(cap_newera_ne400_flag_navy);
			$('.nameInput').val(cap_newera_ne400_flag_navy);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_flag_navy');
		}
		if ($("#cap_newera_ne400_flag_grey:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_flag_grey');
			$('#name').html(cap_newera_ne400_flag_grey);
			$('.nameInput').val(cap_newera_ne400_flag_grey);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_flag_grey');
		}
		if ($("#cap_newera_ne400_flag_royal:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_flag_royal');
			$('#name').html(cap_newera_ne400_flag_royal);
			$('.nameInput').val(cap_newera_ne400_flag_royal);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_flag_royal');
		}
		if ($("#cap_newera_ne400_flag_white:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_flag_white');
			$('#name').html(cap_newera_ne400_flag_white);
			$('.nameInput').val(cap_newera_ne400_flag_white);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_flag_white');
		}
		if ($("#cap_newera_ne400_flag_charcoal_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_flag_charcoal_navy');
			$('#name').html(cap_newera_ne400_flag_charcoal_navy);
			$('.nameInput').val(cap_newera_ne400_flag_charcoal_navy);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_flag_charcoal_navy');
		}
		if ($("#cap_newera_ne400_flag_black_orange:checked").val()) {
			$('.capBox').addClass('cap_newera_ne400_flag_black_orange');
			$('#name').html(cap_newera_ne400_flag_black_orange);
			$('.nameInput').val(cap_newera_ne400_flag_black_orange);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne400_flag_black_orange');
		}

		// cap_newera_ne403
		if ($("#cap_newera_ne403_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne403_black');
			$('#name').html(cap_newera_ne403_black);
			$('.nameInput').val(cap_newera_ne403_black);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne403_black');
		}
		if ($("#cap_newera_ne403_camo:checked").val()) {
			$('.capBox').addClass('cap_newera_ne403_camo');
			$('#name').html(cap_newera_ne403_camo);
			$('.nameInput').val(cap_newera_ne403_camo);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne403_camo');
		}
		if ($("#cap_newera_ne403_grey:checked").val()) {
			$('.capBox').addClass('cap_newera_ne403_grey');
			$('#name').html(cap_newera_ne403_grey);
			$('.nameInput').val(cap_newera_ne403_grey);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne403_grey');
		}
		if ($("#cap_newera_ne403_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne403_navy');
			$('#name').html(cap_newera_ne403_navy);
			$('.nameInput').val(cap_newera_ne403_navy);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne403_navy');
		}
		if ($("#cap_newera_ne403_olive:checked").val()) {
			$('.capBox').addClass('cap_newera_ne403_olive');
			$('#name').html(cap_newera_ne403_olive);
			$('.nameInput').val(cap_newera_ne403_olive);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne403_olive');
		}
		if ($("#cap_newera_ne403_royal:checked").val()) {
			$('.capBox').addClass('cap_newera_ne403_royal');
			$('#name').html(cap_newera_ne403_royal);
			$('.nameInput').val(cap_newera_ne403_royal);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne403_royal');
		}

		// cap_newera_ne403_flag
		if ($("#cap_newera_ne403_flag_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne403_flag_black');
			$('#name').html(cap_newera_ne403_flag_black);
			$('.nameInput').val(cap_newera_ne403_flag_black);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne403_flag_black');
		}
		if ($("#cap_newera_ne403_flag_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne403_flag_navy');
			$('#name').html(cap_newera_ne403_flag_navy);
			$('.nameInput').val(cap_newera_ne403_flag_navy);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne403_flag_navy');
		}

		// cap_newera_ne404
		if ($("#cap_newera_ne404_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne404_black');
			$('#name').html(cap_newera_ne404_black);
			$('.nameInput').val(cap_newera_ne404_black);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne404_black');
		}
		if ($("#cap_newera_ne404_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne404_navy');
			$('#name').html(cap_newera_ne404_navy);
			$('.nameInput').val(cap_newera_ne404_navy);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne404_navy');
		}
		if ($("#cap_newera_ne404_red:checked").val()) {
			$('.capBox').addClass('cap_newera_ne404_red');
			$('#name').html(cap_newera_ne404_red);
			$('.nameInput').val(cap_newera_ne404_red);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne404_red');
		}

		// cap_newera_ne304
		if ($("#cap_newera_ne304_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne304_black');
			$('#name').html(cap_newera_ne304_black);
			$('.nameInput').val(cap_newera_ne304_black);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne304_black');
		}
		if ($("#cap_newera_ne304_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne304_navy');
			$('#name').html(cap_newera_ne304_navy);
			$('.nameInput').val(cap_newera_ne304_navy);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne304_navy');
		}
		if ($("#cap_newera_ne304_royal:checked").val()) {
			$('.capBox').addClass('cap_newera_ne304_royal');
			$('#name').html(cap_newera_ne304_royal);
			$('.nameInput').val(cap_newera_ne304_royal);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne304_royal');
		}

		// cap_newera_ne205
		if ($("#cap_newera_ne205_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne205_black');
			$('#name').html(cap_newera_ne205_black);
			$('.nameInput').val(cap_newera_ne205_black);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne205_black');
		}
		if ($("#cap_newera_ne205_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne205_navy');
			$('#name').html(cap_newera_ne205_navy);
			$('.nameInput').val(cap_newera_ne205_navy);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne205_navy');
		}

		// cap_newera_ne205_flag
		if ($("#cap_newera_ne205_flag_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne205_flag_black');
			$('#name').html(cap_newera_ne205_flag_black);
			$('.nameInput').val(cap_newera_ne205_flag_black);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne205_flag_black');
		}
		if ($("#cap_newera_ne205_flag_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne205_flag_navy');
			$('#name').html(cap_newera_ne205_flag_navy);
			$('.nameInput').val(cap_newera_ne205_flag_navy);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne205_flag_navy');
		}

		// cap_newera_ne201_flag
		if ($("#cap_newera_ne201_flag_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne201_flag_black');
			$('#name').html(cap_newera_ne201_flag_black);
			$('.nameInput').val(cap_newera_ne201_flag_black);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne201_flag_black');
		}
		if ($("#cap_newera_ne201_flag_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne201_flag_navy');
			$('#name').html(cap_newera_ne201_flag_navy);
			$('.nameInput').val(cap_newera_ne201_flag_navy);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne201_flag_navy');
		}

		// cap_newera_ne001
		if ($("#cap_newera_ne001_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne001_black');
			$('#name').html(cap_newera_ne001_black);
			$('.nameInput').val(cap_newera_ne001_black);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne001_black');
		}
		if ($("#cap_newera_ne001_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne001_navy');
			$('#name').html(cap_newera_ne001_navy);
			$('.nameInput').val(cap_newera_ne001_navy);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne001_navy');
		}
		if ($("#cap_newera_ne001_graphite:checked").val()) {
			$('.capBox').addClass('cap_newera_ne001_graphite');
			$('#name').html(cap_newera_ne001_graphite);
			$('.nameInput').val(cap_newera_ne001_graphite);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne001_graphite');
		}
		if ($("#cap_newera_ne001_white:checked").val()) {
			$('.capBox').addClass('cap_newera_ne001_white');
			$('#name').html(cap_newera_ne001_white);
			$('.nameInput').val(cap_newera_ne001_white);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne001_white');
		}
		if ($("#cap_newera_ne001_pinkbeige:checked").val()) {
			$('.capBox').addClass('cap_newera_ne001_pinkbeige');
			$('#name').html(cap_newera_ne001_pinkbeige);
			$('.nameInput').val(cap_newera_ne001_pinkbeige);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne001_pinkbeige');
		}

		// cap_newera_ne501
		if ($("#cap_newera_ne501_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne501_black');
			$('#name').html(cap_newera_ne501_black);
			$('.nameInput').val(cap_newera_ne501_black);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne501_black');
		}
		if ($("#cap_newera_ne501_deepnavy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne501_deepnavy');
			$('#name').html(cap_newera_ne501_deepnavy);
			$('.nameInput').val(cap_newera_ne501_deepnavy);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne501_deepnavy');
		}
		if ($("#cap_newera_ne501_graphite:checked").val()) {
			$('.capBox').addClass('cap_newera_ne501_graphite');
			$('#name').html(cap_newera_ne501_graphite);
			$('.nameInput').val(cap_newera_ne501_graphite);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne501_graphite');
		}
		if ($("#cap_newera_ne501_royal:checked").val()) {
			$('.capBox').addClass('cap_newera_ne501_royal');
			$('#name').html(cap_newera_ne501_royal);
			$('.nameInput').val(cap_newera_ne501_royal);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne501_royal');
		}
		if ($("#cap_newera_ne501_skyblue:checked").val()) {
			$('.capBox').addClass('cap_newera_ne501_skyblue');
			$('#name').html(cap_newera_ne501_skyblue);
			$('.nameInput').val(cap_newera_ne501_skyblue);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne501_skyblue');
		}
		if ($("#cap_newera_ne501_white:checked").val()) {
			$('.capBox').addClass('cap_newera_ne501_white');
			$('#name').html(cap_newera_ne501_white);
			$('.nameInput').val(cap_newera_ne501_white);
			$('#price').html(price_3);
			$('.priceInput').val(price_3);
		} else {
			$('.capBox').removeClass('cap_newera_ne501_white');
		}

		// cap_newera_ne215
		if ($("#cap_newera_ne215_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne215_black');
			$('#name').html(cap_newera_ne215_black);
			$('.nameInput').val(cap_newera_ne215_black);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne215_black');
		}
		if ($("#cap_newera_ne215_deepnavy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne215_deepnavy');
			$('#name').html(cap_newera_ne215_deepnavy);
			$('.nameInput').val(cap_newera_ne215_deepnavy);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne215_deepnavy');
		}
		if ($("#cap_newera_ne215_graphite:checked").val()) {
			$('.capBox').addClass('cap_newera_ne215_graphite');
			$('#name').html(cap_newera_ne215_graphite);
			$('.nameInput').val(cap_newera_ne215_graphite);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne215_graphite');
		}
		if ($("#cap_newera_ne215_royal:checked").val()) {
			$('.capBox').addClass('cap_newera_ne215_royal');
			$('#name').html(cap_newera_ne215_royal);
			$('.nameInput').val(cap_newera_ne215_royal);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne215_royal');
		}
		if ($("#cap_newera_ne215_scarlet:checked").val()) {
			$('.capBox').addClass('cap_newera_ne215_scarlet');
			$('#name').html(cap_newera_ne215_scarlet);
			$('.nameInput').val(cap_newera_ne215_scarlet);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne215_scarlet');
		}

		// cap_newera_ne900
		if ($("#cap_newera_ne900_grey:checked").val()) {
			$('.capBox').addClass('cap_newera_ne900_grey');
			$('#name').html(cap_newera_ne900_grey);
			$('.nameInput').val(cap_newera_ne900_grey);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne900_grey');
		}
		if ($("#cap_newera_ne900_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne900_black');
			$('#name').html(cap_newera_ne900_black);
			$('.nameInput').val(cap_newera_ne900_black);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne900_black');
		}
		if ($("#cap_newera_ne900_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne900_navy');
			$('#name').html(cap_newera_ne900_navy);
			$('.nameInput').val(cap_newera_ne900_navy);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne900_navy');
		}

		// cap_newera_ne908
		if ($("#cap_newera_ne908_black:checked").val()) {
			$('.capBox').addClass('cap_newera_ne908_black');
			$('#name').html(cap_newera_ne908_black);
			$('.nameInput').val(cap_newera_ne908_black);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne908_black');
		}
		if ($("#cap_newera_ne908_navy:checked").val()) {
			$('.capBox').addClass('cap_newera_ne908_navy');
			$('#name').html(cap_newera_ne908_navy);
			$('.nameInput').val(cap_newera_ne908_navy);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne908_navy');
		}
		if ($("#cap_newera_ne908_grey:checked").val()) {
			$('.capBox').addClass('cap_newera_ne908_grey');
			$('#name').html(cap_newera_ne908_grey);
			$('.nameInput').val(cap_newera_ne908_grey);
			$('#price').html(price_1);
			$('.priceInput').val(price_1);
		} else {
			$('.capBox').removeClass('cap_newera_ne908_grey');
		}

		// cap_brimstar_brs01-001
		if ($("#cap_brimstar_brs001_black:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs001_black');
			$('#name').html(cap_brimstar_brs001_black);
			$('.nameInput').val(cap_brimstar_brs001_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs001_black');
		}
		if ($("#cap_brimstar_brs001_navy:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs001_navy');
			$('#name').html(cap_brimstar_brs001_navy);
			$('.nameInput').val(cap_brimstar_brs001_navy);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs001_navy');
		}
		if ($("#cap_brimstar_brs001_lightblue:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs001_lightblue');
			$('#name').html(cap_brimstar_brs001_lightblue);
			$('.nameInput').val(cap_brimstar_brs001_lightblue);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs001_lightblue');
		}
		if ($("#cap_brimstar_brs001_lightblue_white:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs001_lightblue_white');
			$('#name').html(cap_brimstar_brs001_lightblue_white);
			$('.nameInput').val(cap_brimstar_brs001_lightblue_white);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs001_lightblue_white');
		}
		if ($("#cap_brimstar_brs001_grey:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs001_grey');
			$('#name').html(cap_brimstar_brs001_grey);
			$('.nameInput').val(cap_brimstar_brs001_grey);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs001_grey');
		}
		if ($("#cap_brimstar_brs001_olive_black:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs001_olive_black');
			$('#name').html(cap_brimstar_brs001_olive_black);
			$('.nameInput').val(cap_brimstar_brs001_olive_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs001_olive_black');
		}
		if ($("#cap_brimstar_brs001_red_black:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs001_red_black');
			$('#name').html(cap_brimstar_brs001_red_black);
			$('.nameInput').val(cap_brimstar_brs001_red_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs001_red_black');
		}
		if ($("#cap_brimstar_brs001_pink_black:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs001_pink_black');
			$('#name').html(cap_brimstar_brs001_pink_black);
			$('.nameInput').val(cap_brimstar_brs001_pink_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs001_pink_black');
		}

		// cap_brimstar_brs01-002
		if ($("#cap_brimstar_brs01-002_black:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs01-002_black');
			$('#name').html(cap_brimstar_brs01_002_black);
			$('.nameInput').val(cap_brimstar_brs01_002_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs01-002_black');
		}
		if ($("#cap_brimstar_brs01-002_navy:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs01-002_navy');
			$('#name').html(cap_brimstar_brs01_002_navy);
			$('.nameInput').val(cap_brimstar_brs01_002_navy);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs01-002_navy');
		}

		// cap_brimstar_brs01-006
		if ($("#cap_brimstar_brs01-006_khaki_black:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs01-006_khaki_black');
			$('#name').html(cap_brimstar_brs01_006_khaki_black);
			$('.nameInput').val(cap_brimstar_brs01_006_khaki_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs01-006_khaki_black');
		}
		if ($("#cap_brimstar_brs01-006_red_black:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs01-006_red_black');
			$('#name').html(cap_brimstar_brs01_006_red_black);
			$('.nameInput').val(cap_brimstar_brs01_006_red_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs01-006_red_black');
		}
		if ($("#cap_brimstar_brs01-006_blue_black:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs01-006_blue_black');
			$('#name').html(cap_brimstar_brs01_006_blue_black);
			$('.nameInput').val(cap_brimstar_brs01_006_blue_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs01-006_blue_black');
		}
		if ($("#cap_brimstar_brs01-006_lightblue_white:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs01-006_lightblue_white');
			$('#name').html(cap_brimstar_brs01_006_lightblue_white);
			$('.nameInput').val(cap_brimstar_brs01_006_lightblue_white);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs01-006_lightblue_white');
		}

		// cap_brimstar_brs01-003
		if ($("#cap_brimstar_brs01-003_black:checked").val()) {
			$('.capBox').addClass('cap_brimstar_brs01-003_black');
			$('#name').html(cap_brimstar_brs01_003_black);
			$('.nameInput').val(cap_brimstar_brs01_003_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_brimstar_brs01-003_black');
		}

		// cap_otto_0987
		if ($("#cap_otto_0987_black:checked").val()) {
			$('.capBox').addClass('cap_otto_0987_black');
			$('#name').html(cap_otto_0987_black);
			$('.nameInput').val(cap_otto_0987_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_0987_black');
		}
		if ($("#cap_otto_0987_gray:checked").val()) {
			$('.capBox').addClass('cap_otto_0987_gray');
			$('#name').html(cap_otto_0987_gray);
			$('.nameInput').val(cap_otto_0987_gray);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_0987_gray');
		}
		if ($("#cap_otto_0987_white_black:checked").val()) {
			$('.capBox').addClass('cap_otto_0987_white_black');
			$('#name').html(cap_otto_0987_white_black);
			$('.nameInput').val(cap_otto_0987_white_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_0987_white_black');
		}
		if ($("#cap_otto_0987_gray_black:checked").val()) {
			$('.capBox').addClass('cap_otto_0987_gray_black');
			$('#name').html(cap_otto_0987_gray_black);
			$('.nameInput').val(cap_otto_0987_gray_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_0987_gray_black');
		}
		if ($("#cap_otto_0987_black_aqua:checked").val()) {
			$('.capBox').addClass('cap_otto_0987_black_aqua');
			$('#name').html(cap_otto_0987_black_aqua);
			$('.nameInput').val(cap_otto_0987_black_aqua);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_0987_black_aqua');
		}
		if ($("#cap_otto_0987_navy_red:checked").val()) {
			$('.capBox').addClass('cap_otto_0987_navy_red');
			$('#name').html(cap_otto_0987_navy_red);
			$('.nameInput').val(cap_otto_0987_navy_red);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_0987_navy_red');
		}
		if ($("#cap_otto_0987_black_orange:checked").val()) {
			$('.capBox').addClass('cap_otto_0987_black_orange');
			$('#name').html(cap_otto_0987_black_orange);
			$('.nameInput').val(cap_otto_0987_black_orange);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_0987_black_orange');
		}
		if ($("#cap_otto_0987_black_purple:checked").val()) {
			$('.capBox').addClass('cap_otto_0987_black_purple');
			$('#name').html(cap_otto_0987_black_purple);
			$('.nameInput').val(cap_otto_0987_black_purple);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_0987_black_purple');
		}
		if ($("#cap_otto_0987_black_yellow:checked").val()) {
			$('.capBox').addClass('cap_otto_0987_black_yellow');
			$('#name').html(cap_otto_0987_black_yellow);
			$('.nameInput').val(cap_otto_0987_black_yellow);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_0987_black_yellow');
		}
		if ($("#cap_otto_0987_blue_orange:checked").val()) {
			$('.capBox').addClass('cap_otto_0987_blue_orange');
			$('#name').html(cap_otto_0987_blue_orange);
			$('.nameInput').val(cap_otto_0987_blue_orange);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_0987_blue_orange');
		}

		// cap_otto_h1098
		if ($("#cap_otto_h1098_black:checked").val()) {
			$('.capBox').addClass('cap_otto_h1098_black');
			$('#name').html(cap_otto_h1098_black);
			$('.nameInput').val(cap_otto_h1098_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_h1098_black');
		}
		if ($("#cap_otto_h1098_charcoal:checked").val()) {
			$('.capBox').addClass('cap_otto_h1098_charcoal');
			$('#name').html(cap_otto_h1098_charcoal);
			$('.nameInput').val(cap_otto_h1098_charcoal);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_h1098_charcoal');
		}
		if ($("#cap_otto_h1098_khaki:checked").val()) {
			$('.capBox').addClass('cap_otto_h1098_khaki');
			$('#name').html(cap_otto_h1098_khaki);
			$('.nameInput').val(cap_otto_h1098_khaki);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_h1098_khaki');
		}
		if ($("#cap_otto_h1098_navy:checked").val()) {
			$('.capBox').addClass('cap_otto_h1098_navy');
			$('#name').html(cap_otto_h1098_navy);
			$('.nameInput').val(cap_otto_h1098_navy);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_h1098_navy');
		}

		// cap_otto_1070
		if ($("#cap_otto_1070_white:checked").val()) {
			$('.capBox').addClass('cap_otto_1070_white');
			$('#name').html(cap_otto_1070_white);
			$('.nameInput').val(cap_otto_1070_white);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_1070_white');
		}
		if ($("#cap_otto_1070_navy:checked").val()) {
			$('.capBox').addClass('cap_otto_1070_navy');
			$('#name').html(cap_otto_1070_navy);
			$('.nameInput').val(cap_otto_1070_navy);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_1070_navy');
		}
		if ($("#cap_otto_1070_blue:checked").val()) {
			$('.capBox').addClass('cap_otto_1070_blue');
			$('#name').html(cap_otto_1070_blue);
			$('.nameInput').val(cap_otto_1070_blue);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_1070_blue');
		}
		if ($("#cap_otto_1070_red:checked").val()) {
			$('.capBox').addClass('cap_otto_1070_red');
			$('#name').html(cap_otto_1070_red);
			$('.nameInput').val(cap_otto_1070_red);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_1070_red');
		}
		if ($("#cap_otto_1070_black_white:checked").val()) {
			$('.capBox').addClass('cap_otto_1070_black_white');
			$('#name').html(cap_otto_1070_black_white);
			$('.nameInput').val(cap_otto_1070_black_white);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_1070_black_white');
		}
		if ($("#cap_otto_1070_red_black:checked").val()) {
			$('.capBox').addClass('cap_otto_1070_red_black');
			$('#name').html(cap_otto_1070_red_black);
			$('.nameInput').val(cap_otto_1070_red_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_1070_red_black');
		}
		if ($("#cap_otto_1070_camo:checked").val()) {
			$('.capBox').addClass('cap_otto_1070_camo');
			$('#name').html(cap_otto_1070_camo);
			$('.nameInput').val(cap_otto_1070_camo);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_1070_camo');
		}
		if ($("#cap_otto_1070_black_grey:checked").val()) {
			$('.capBox').addClass('cap_otto_1070_black_grey');
			$('#name').html(cap_otto_1070_black_grey);
			$('.nameInput').val(cap_otto_1070_black_grey);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_1070_black_grey');
		}
		if ($("#cap_otto_1070_black_red:checked").val()) {
			$('.capBox').addClass('cap_otto_1070_black_red');
			$('#name').html(cap_otto_1070_black_red);
			$('.nameInput').val(cap_otto_1070_black_red);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_1070_black_red');
		}
		if ($("#cap_otto_1070_charcoal_black:checked").val()) {
			$('.capBox').addClass('cap_otto_1070_charcoal_black');
			$('#name').html(cap_otto_1070_charcoal_black);
			$('.nameInput').val(cap_otto_1070_charcoal_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_otto_1070_charcoal_black');
		}

		// cap_maximum_mc6624
		if ($("#cap_maximum_mc6624_black:checked").val()) {
			$('.capBox').addClass('cap_maximum_mc6624_black');
			$('#name').html(cap_maximum_mc6624_black);
			$('.nameInput').val(cap_maximum_mc6624_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_maximum_mc6624_black');
		}
		if ($("#cap_maximum_mc6624_navy:checked").val()) {
			$('.capBox').addClass('cap_maximum_mc6624_navy');
			$('#name').html(cap_maximum_mc6624_navy);
			$('.nameInput').val(cap_maximum_mc6624_navy);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_maximum_mc6624_navy');
		}
		if ($("#cap_maximum_mc6624_wine:checked").val()) {
			$('.capBox').addClass('cap_maximum_mc6624_wine');
			$('#name').html(cap_maximum_mc6624_wine);
			$('.nameInput').val(cap_maximum_mc6624_wine);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_maximum_mc6624_wine');
		}
		if ($("#cap_maximum_mc6624_khaki:checked").val()) {
			$('.capBox').addClass('cap_maximum_mc6624_khaki');
			$('#name').html(cap_maximum_mc6624_khaki);
			$('.nameInput').val(cap_maximum_mc6624_khaki);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
		} else {
			$('.capBox').removeClass('cap_maximum_mc6624_khaki');
		}
		if ($("#cap_maximum_mc6624_beige:checked").val()) {
			$('.capBox').addClass('cap_maximum_mc6624_beige');
			$('#name').html(cap_maximum_mc6624_beige);
			$('.nameInput').val(cap_maximum_mc6624_beige);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_maximum_mc6624_beige');
		}
		if ($("#cap_maximum_mc6624_beige:checked").val()) {
			$('.capBox').addClass('cap_maximum_mc6624_beige');
			$('#name').html(cap_maximum_mc6624_beige);
			$('.nameInput').val(cap_maximum_mc6624_beige);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_maximum_mc6624_beige');
		}

		// cap_newhattan_1400
		if ($("#cap_newhattan_1400_woodland:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1400_woodland');
			$('#name').html(cap_newhattan_1400_woodland);
			$('.nameInput').val(cap_newhattan_1400_woodland);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1400_woodland');
		}
		if ($("#cap_newhattan_1400_black:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1400_black');
			$('#name').html(cap_newhattan_1400_black);
			$('.nameInput').val(cap_newhattan_1400_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1400_black');
		}
		if ($("#cap_newhattan_1400_gray:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1400_gray');
			$('#name').html(cap_newhattan_1400_gray);
			$('.nameInput').val(cap_newhattan_1400_gray);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1400_gray');
		}
		if ($("#cap_newhattan_1400_navy:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1400_navy');
			$('#name').html(cap_newhattan_1400_navy);
			$('.nameInput').val(cap_newhattan_1400_navy);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1400_navy');
		}
		if ($("#cap_newhattan_1400_orange:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1400_orange');
			$('#name').html(cap_newhattan_1400_orange);
			$('.nameInput').val(cap_newhattan_1400_orange);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1400_orange');
		}
		if ($("#cap_newhattan_1400_white:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1400_white');
			$('#name').html(cap_newhattan_1400_white);
			$('.nameInput').val(cap_newhattan_1400_white);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1400_white');
		}
		if ($("#cap_newhattan_1400_aqua:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1400_aqua');
			$('#name').html(cap_newhattan_1400_aqua);
			$('.nameInput').val(cap_newhattan_1400_aqua);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1400_aqua');
		}
		if ($("#cap_newhattan_1400_lightpink:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1400_lightpink');
			$('#name').html(cap_newhattan_1400_lightpink);
			$('.nameInput').val(cap_newhattan_1400_lightpink);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1400_lightpink');
		}
		if ($("#cap_newhattan_1400_khaki:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1400_khaki');
			$('#name').html(cap_newhattan_1400_khaki);
			$('.nameInput').val(cap_newhattan_1400_khaki);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1400_khaki');
		}
		if ($("#cap_newhattan_1400_copper:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1400_copper');
			$('#name').html(cap_newhattan_1400_copper);
			$('.nameInput').val(cap_newhattan_1400_copper);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1400_copper');
		}

		// cap_newhattan_1155
		if ($("#cap_newhattan_1155_lightblue:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1155_lightblue');
			$('#name').html(cap_newhattan_1155_lightblue);
			$('.nameInput').val(cap_newhattan_1155_lightblue);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1155_lightblue');
		}
		if ($("#cap_newhattan_1155_darkblue:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1155_darkblue');
			$('#name').html(cap_newhattan_1155_darkblue);
			$('.nameInput').val(cap_newhattan_1155_darkblue);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1155_darkblue');
		}
		if ($("#cap_newhattan_1155_charcoal:checked").val()) {
			$('.capBox').addClass('cap_newhattan_1155_charcoal');
			$('#name').html(cap_newhattan_1155_charcoal);
			$('.nameInput').val(cap_newhattan_1155_charcoal);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_newhattan_1155_charcoal');
		}

		// cap_yupoong_6089
		if ($("#cap_yupoong_6089_camo:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_camo');
			$('#name').html(cap_yupoong_6089_camo);
			$('.nameInput').val(cap_yupoong_6089_camo);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_camo');
		}
		if ($("#cap_yupoong_6089_black:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_black');
			$('#name').html(cap_yupoong_6089_black);
			$('.nameInput').val(cap_yupoong_6089_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_black');
		}
		if ($("#cap_yupoong_6089_navy:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_navy');
			$('#name').html(cap_yupoong_6089_navy);
			$('.nameInput').val(cap_yupoong_6089_navy);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_navy');
		}
		if ($("#cap_yupoong_6089_purple:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_purple');
			$('#name').html(cap_yupoong_6089_purple);
			$('.nameInput').val(cap_yupoong_6089_purple);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_purple');
		}
		if ($("#cap_yupoong_6089_orange:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_orange');
			$('#name').html(cap_yupoong_6089_orange);
			$('.nameInput').val(cap_yupoong_6089_orange);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_orange');
		}
		if ($("#cap_yupoong_6089_white_black:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_white_black');
			$('#name').html(cap_yupoong_6089_white_black);
			$('.nameInput').val(cap_yupoong_6089_white_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_white_black');
		}
		if ($("#cap_yupoong_6089_purple_gold:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_purple_gold');
			$('#name').html(cap_yupoong_6089_purple_gold);
			$('.nameInput').val(cap_yupoong_6089_purple_gold);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_purple_gold');
		}
		if ($("#cap_yupoong_6089_royal_orange:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_royal_orange');
			$('#name').html(cap_yupoong_6089_royal_orange);
			$('.nameInput').val(cap_yupoong_6089_royal_orange);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_royal_orange');
		}
		if ($("#cap_yupoong_6089_heather_black:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_heather_black');
			$('#name').html(cap_yupoong_6089_heather_black);
			$('.nameInput').val(cap_yupoong_6089_heather_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_heather_black');
		}
		if ($("#cap_yupoong_6089_heather_red:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_heather_red');
			$('#name').html(cap_yupoong_6089_heather_red);
			$('.nameInput').val(cap_yupoong_6089_heather_red);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_heather_red');
		}
		if ($("#cap_yupoong_6089_heather_royal:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_heather_royal');
			$('#name').html(cap_yupoong_6089_heather_royal);
			$('.nameInput').val(cap_yupoong_6089_heather_royal);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_heather_royal');
		}
		if ($("#cap_yupoong_6089_heather_navy:checked").val()) {
			$('.capBox').addClass('cap_yupoong_6089_heather_navy');
			$('#name').html(cap_yupoong_6089_heather_navy);
			$('.nameInput').val(cap_yupoong_6089_heather_navy);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_yupoong_6089_heather_navy');
		}

		// cap_totw
		if ($("#cap_totw_black:checked").val()) {
			$('.capBox').addClass('cap_totw_black');
			$('#name').html(cap_totw_black);
			$('.nameInput').val(cap_totw_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_totw_grey_black');
		}
		if ($("#cap_totw_grey_black:checked").val()) {
			$('.capBox').addClass('cap_totw_grey_black');
			$('#name').html(cap_totw_grey_black);
			$('.nameInput').val(cap_totw_grey_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_totw_grey_black');
		}
		if ($("#cap_totw_navy:checked").val()) {
			$('.capBox').addClass('cap_totw_navy');
			$('#name').html(cap_totw_navy);
			$('.nameInput').val(cap_totw_navy);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_totw_navy');
		}
		if ($("#cap_totw_red_navy:checked").val()) {
			$('.capBox').addClass('cap_totw_red_navy');
			$('#name').html(cap_totw_red_navy);
			$('.nameInput').val(cap_totw_red_navy);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_totw_red_navy');
		}
		if ($("#cap_totw_red:checked").val()) {
			$('.capBox').addClass('cap_totw_red');
			$('#name').html(cap_totw_red);
			$('.nameInput').val(cap_totw_red);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_totw_red');
		}
		if ($("#cap_totw_white_black:checked").val()) {
			$('.capBox').addClass('cap_totw_white_black');
			$('#name').html(cap_totw_white_black);
			$('.nameInput').val(cap_totw_white_black);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_totw_white_black');
		}
		if ($("#cap_totw_white_pink:checked").val()) {
			$('.capBox').addClass('cap_totw_white_pink');
			$('#name').html(cap_totw_white_pink);
			$('.nameInput').val(cap_totw_white_pink);
			$('#price').html(price_2);
			$('.priceInput').val(price_2);
			var priceValue = price_2;
		} else {
			$('.capBox').removeClass('cap_totw_white_pink');
		}
		});
		$('input[name="cap"]').bind('click', function() {
			selected.body  = $('input[name="cap"]:checked').val();
			selected.cap   = $('.nameInput').val();
			selected.price = $('.priceInput').val();
			$('.capInput').val(selected.body);
			$('#name').html(selected.cap);
			$('#price').html(selected.price);
		});

	// フォント変更
	$('#character').addClass(selected.font);
	$('input[id*="' + selected.font + '"]').attr('checked', 'checked');
	$('input[id*="font"]').click(function() {
		if ($('#font_heisei_gothic:checked').val()) {
			$('#character').addClass('font_heisei_gothic');
		} else {
			$('#character').removeClass('font_heisei_gothic');
		}
		if ($('#font_heisei_maru:checked').val()) {
			$('#character').addClass('font_heisei_maru');
		} else {
			$('#character').removeClass('font_heisei_maru');
		}
		if ($('#font_heisei_mincho:checked').val()) {
			$('#character').addClass('font_heisei_mincho');
		} else {
			$('#character').removeClass('font_heisei_mincho');
		}
		if ($('#font_colleges:checked').val()) {
			$('#character').addClass('font_colleges');
		} else {
			$('#character').removeClass('font_colleges');
		}
		if ($('#font_allstar:checked').val()) {
			$('#character').addClass('font_allstar');
		} else {
			$('#character').removeClass('font_allstar');
		}
		if ($('#font_flottflott:checked').val()) {
			$('#character').addClass('font_flottflott');
		} else {
			$('#character').removeClass('font_flottflott');
		}
		if ($('#font_englishtowne:checked').val()) {
			$('#character').addClass('font_englishtowne');
		} else {
			$('#character').removeClass('font_englishtowne');
		}
		if ($('#font_mytupi:checked').val()) {
			$('#character').addClass('font_mytupi');
		} else {
			$('#character').removeClass('font_mytupi');
		}
		if ($('#font_libre:checked').val()) {
			$('#character').addClass('font_libre');
		} else {
			$('#character').removeClass('font_libre');
		}
		if ($('#font_rockoflf:checked').val()) {
			$('#character').addClass('font_rockoflf');
		} else {
			$('#character').removeClass('font_rockoflf');
		}
		if ($('#font_aspire:checked').val()) {
			$('#character').addClass('font_aspire');
		} else {
			$('#character').removeClass('font_aspire');
		}
		if ($('#font_columbo:checked').val()) {
			$('#character').addClass('font_columbo');
		} else {
			$('#character').removeClass('font_columbo');
		}
		if ($('#font_agatha:checked').val()) {
			$('#character').addClass('font_agatha');
		} else {
			$('#character').removeClass('font_agatha');
		}
		if ($('#font_arnold:checked').val()) {
			$('#character').addClass('font_arnold');
		} else {
			$('#character').removeClass('font_arnold');
		}
		if ($('#font_bauhaus:checked').val()) {
			$('#character').addClass('font_bauhaus');
		} else {
			$('#character').removeClass('font_bauhaus');
		}
		if ($('#font_playbill:checked').val()) {
			$('#character').addClass('font_playbill');
		} else {
			$('#character').removeClass('font_playbill');
		}
		if ($('#font_centercity:checked').val()) {
			$('#character').addClass('font_centercity');
		} else {
			$('#character').removeClass('font_centercity');
		}
		if ($('#font_croissantbold:checked').val()) {
			$('#character').addClass('font_croissantbold');
		} else {
			$('#character').removeClass('font_croissantbold');
		}
		if ($('#font_handelgothic:checked').val()) {
			$('#character').addClass('font_handelgothic');
		} else {
			$('#character').removeClass('font_handelgothic');
		}
		if ($('#font_handicraft:checked').val()) {
			$('#character').addClass('font_handicraft');
		} else {
			$('#character').removeClass('font_handicraft');
		}
		if ($('#font_brushscriptwide:checked').val()) {
			$('#character').addClass('font_brushscriptwide');
		} else {
			$('#character').removeClass('font_brushscriptwide');
		}
		if ($('#font_harrington:checked').val()) {
			$('#character').addClass('font_harrington');
		} else {
			$('#character').removeClass('font_harrington');
		}
		if ($('#font_hobo-wd:checked').val()) {
			$('#character').addClass('font_hobo-wd');
		} else {
			$('#character').removeClass('font_hobo-wd');
		}
		if ($('#font_hp-kids:checked').val()) {
			$('#character').addClass('font_hp-kids');
		} else {
			$('#character').removeClass('font_hp-kids');
		}
		if ($('#font_impress:checked').val()) {
			$('#character').addClass('font_impress');
		} else {
			$('#character').removeClass('font_impress');
		}
		if ($('#font_typewriter-medium:checked').val()) {
			$('#character').addClass('font_typewriter-medium');
		} else {
			$('#character').removeClass('font_typewriter-medium');
		}
		if ($('#font_bocuma:checked').val()) {
			$('#character').addClass('font_bocuma');
		} else {
			$('#character').removeClass('font_bocuma');
		}
		if ($('#font_celtic:checked').val()) {
			$('#character').addClass('font_celtic');
		} else {
			$('#character').removeClass('font_celtic');
		}
		if ($('#font_civiclight:checked').val()) {
			$('#character').addClass('font_civiclight');
		} else {
			$('#character').removeClass('font_civiclight');
		}


	});
	$('input[name="font"]').bind('click', function() {
		selected.font = $('input[name="font"]:checked').val();
		$('.fontInput').val(selected.font);
	});


	// カラー変更
	$('#character').addClass(selected.color);
	$('input[id$="' + selected.color + '"]').attr('checked', 'checked');
	$('input[id*="color"]').click(function() {
		if ($("#color_1:checked").val()) {
			$('#character').addClass('color_1');
		} else {
			$('#character').removeClass('color_1');
		}
		if ($("#color_2:checked").val()) {
			$('#character').addClass('color_2');
		} else {
			$('#character').removeClass('color_2');
		}
		if ($("#color_3:checked").val()) {
			$('#character').addClass('color_3');
		} else {
			$('#character').removeClass('color_3');
		}
		if ($("#color_4:checked").val()) {
			$('#character').addClass('color_4');
		} else {
			$('#character').removeClass('color_4');
		}
		if ($("#color_5:checked").val()) {
			$('#character').addClass('color_5');
		} else {
			$('#character').removeClass('color_5');
		}
		if ($("#color_6:checked").val()) {
			$('#character').addClass('color_6');
		} else {
			$('#character').removeClass('color_6');
		}
		if ($("#color_7:checked").val()) {
			$('#character').addClass('color_7');
		} else {
			$('#character').removeClass('color_7');
		}
		if ($("#color_8:checked").val()) {
			$('#character').addClass('color_8');
		} else {
			$('#character').removeClass('color_8');
		}
		if ($("#color_9:checked").val()) {
			$('#character').addClass('color_9');
		} else {
			$('#character').removeClass('color_9');
		}
		if ($("#color_10:checked").val()) {
			$('#character').addClass('color_10');
		} else {
			$('#character').removeClass('color_10');
		}
		if ($("#color_11:checked").val()) {
			$('#character').addClass('color_11');
		} else {
			$('#character').removeClass('color_11');
		}
		if ($("#color_12:checked").val()) {
			$('#character').addClass('color_12');
		} else {
			$('#character').removeClass('color_12');
		}
		if ($("#color_13:checked").val()) {
			$('#character').addClass('color_13');
		} else {
			$('#character').removeClass('color_13');
		}
		if ($("#color_14:checked").val()) {
			$('#character').addClass('color_14');
		} else {
			$('#character').removeClass('color_14');
		}
		if ($("#color_15:checked").val()) {
			$('#character').addClass('color_15');
		} else {
			$('#character').removeClass('color_15');
		}
		if ($("#color_16:checked").val()) {
			$('#character').addClass('color_16');
		} else {
			$('#character').removeClass('color_16');
		}
		if ($("#color_17:checked").val()) {
			$('#character').addClass('color_17');
		} else {
			$('#character').removeClass('color_17');
		}
		if ($("#color_18:checked").val()) {
			$('#character').addClass('color_18');
		} else {
			$('#character').removeClass('color_18');
		}
		if ($("#color_19:checked").val()) {
			$('#character').addClass('color_19');
		} else {
			$('#character').removeClass('color_19');
		}
		if ($("#color_20:checked").val()) {
			$('#character').addClass('color_20');
		} else {
			$('#character').removeClass('color_20');
		}
		if ($("#color_21:checked").val()) {
			$('#character').addClass('color_21');
		} else {
			$('#character').removeClass('color_21');
		}
		if ($("#color_22:checked").val()) {
			$('#character').addClass('color_22');
		} else {
			$('#character').removeClass('color_22');
		}
		if ($("#color_23:checked").val()) {
			$('#character').addClass('color_23');
		} else {
			$('#character').removeClass('color_23');
		}
		if ($("#color_24:checked").val()) {
			$('#character').addClass('color_24');
		} else {
			$('#character').removeClass('color_24');
		}
		if ($("#color_25:checked").val()) {
			$('#character').addClass('color_25');
		} else {
			$('#character').removeClass('color_25');
		}
		if ($("#color_26:checked").val()) {
			$('#character').addClass('color_26');
		} else {
			$('#character').removeClass('color_26');
		}
		if ($("#color_27:checked").val()) {
			$('#character').addClass('color_27');
		} else {
			$('#character').removeClass('color_27');
		}
		if ($("#color_28:checked").val()) {
			$('#character').addClass('color_28');
		} else {
			$('#character').removeClass('color_28');
		}
		if ($("#color_29:checked").val()) {
			$('#character').addClass('color_29');
		} else {
			$('#character').removeClass('color_29');
		}
		if ($("#color_30:checked").val()) {
			$('#character').addClass('color_30');
		} else {
			$('#character').removeClass('color_30');
		}
	});
	$('input[name="color"]').bind('click', function() {
		selected.color = $('input[name="color"]:checked').val();
		$('.colorInput').val(selected.color);
	});


	// フォントサイズ変更
	if (w > x) {
		$('#fontSize').slider({
			min: 200,
			max: 900,
			value: selected.style.size,
			slide: function (event, ui) {
				$('#character').css('font-size', ui.value + '%');
				selected.style.size = ui.value;
				$('.fontSizeSlider').val(selected.style.size);
			}
		});
	} else {
		$('#fontSize').slider({
			min: 100,
			max: 380,
			value: selected.style.size,
			slide: function (event, ui) {
				$('#character').css('font-size', ui.value + '%');
				selected.style.size = ui.value;
				$('.fontSizeSlider').val(selected.style.size);
			}
		});
	}


	// カーニング変更
	if (w > x) {
		$('#letterSpace').slider({
			min: -15,
			max: 15,
			value: selected.style.kerning,
			slide: function (event, ui) {
				$('#character').css('letter-spacing', ui.value + 'px');
				selected.style.kerning = ui.value;
				$('.letterSpaceSlider').val(selected.style.kerning);
			}
		});
	} else {
		$('#letterSpace').slider({
			min: -8,
			max: 8,
			value: selected.style.kerning,
			slide: function (event, ui) {
				$('#character').css('letter-spacing', ui.value + 'px');
				selected.style.kerning = ui.value;
				$('.letterSpaceSlider').val(selected.style.kerning);
			}
		});
	}


	// 縦位置変更
	if (w > x) {
		$('#layoutLength').slider({
			min: 30,
			max: 66,
			value: selected.style.vertical,
			slide: function (event, ui) {
				$('#character').css('top', ui.value + '%');
				selected.style.vertical = ui.value;
				$('.layoutLengthSlider').val(selected.style.vertical);
			}
		});
	} else {
		$('#layoutLength').slider({
			min: 34,
			max: 58,
			value: selected.style.vertical,
			slide: function (event, ui) {
				$('#character').css('top', ui.value + '%');
				selected.style.vertical = ui.value;
				$('.layoutLengthSlider').val(selected.style.vertical);
			}
		});
	}


	// 横位置変更
	if (w > x) {
		$('#layoutSide').slider({
			min: -40,
			max: 40,
			value: selected.style.lateral,
			slide: function (event, ui) {
				$('#character').css('left', ui.value + '%');
				selected.style.lateral = ui.value;
				$('.layoutSideSlider').val(selected.style.lateral);
			}
		});
	} else {
		$('#layoutSide').slider({
			min: -38,
			max: 38,
			value: selected.style.lateral,
			slide: function (event, ui) {
				$('#character').css('left', ui.value + '%');
				selected.style.lateral = ui.value;
				$('.layoutSideSlider').val(selected.style.lateral);
			}
		});
	}


	// ユーザー環境変更
	if (w < x) {
		$('.modelInput').val('SP');
	}


	// スマホ用タブ
	if (w < x) {
		$('.editWrap').tabs({show: { effect: 'fade', duration: 800 }});
	}


	// キャップボディ出し入れ
	$('#capBody a.close').stop(true, true).live('click', function(){
		$('.capBody').stop(true,true).addClass('active');
		$('.capBody').animate({'top': '0'}, {'duration': 200});
		if (w > x) {
			$('.editWrap').animate({'padding-top': '170px'}, {'duration': 200});
		} else {
			$('.editWrap').animate({'padding-top': '110px'}, {'duration': 200});
		}
		$('.fontBody').stop(true,true).removeClass('active');
		$('.fontBody').animate({'top': '-180px'}, {'duration': 200});
		$(this).removeClass('close').addClass('open');
		$('#font a.open').removeClass('open').addClass('close');
		return false;
	});
	$('#capBody a.open').stop(true, true).live('click', function(){
		$('.capBody').stop(true,true).removeClass('active');
		$('.capBody').animate({'top': '-180px'}, {'duration': 200});
		if (w > x) {
			$('.editWrap').animate({'padding-top': '60px'}, {'duration': 200});
		} else {
			$('.editWrap').animate({'padding-top': '0'}, {'duration': 200});
		}
		$(this).removeClass('open').addClass('close');
		return false;
	});


	// フォント出し入れ
	$('#font a.close').stop(true, true).live('click', function(){
		$('.fontBody').stop(true,true).addClass('active');
		$('.fontBody').animate({'top': '0'}, {'duration': 200});
		if (w > x) {
			$('.editWrap').animate({'padding-top': '170px'}, {'duration': 200});
		} else {
			$('.editWrap').animate({'padding-top': '110px'}, {'duration': 200});
		}
		$('.capBody').stop(true,true).removeClass('active');
		$('.capBody').animate({'top': '-180px'}, {'duration': 200});
		$(this).removeClass('close').addClass('open');
		$('#capBody a.open').removeClass('open').addClass('close');
		return false;
	});
	$('#font a.open').stop(true, true).live('click', function(){
		$('.fontBody').stop(true,true).removeClass('active');
		$('.fontBody').animate({'top': '-180px'}, {'duration': 200});
		if (w > x) {
			$('.editWrap').animate({'padding-top': '60px'}, {'duration': 200});
		} else {
			$('.editWrap').animate({'padding-top': '0'}, {'duration': 200});
		}
		$(this).removeClass('open').addClass('close');
		return false;
	});


	// 刺繍可能範囲
	$('.range-btn').click(function() {
		$('.range-btn').toggleClass('off');
		$('.range').toggleClass('disnon');
	});

});
