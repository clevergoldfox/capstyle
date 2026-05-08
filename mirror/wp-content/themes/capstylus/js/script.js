$(function(){


	// viewport 切り替え
	var w = $(window).width();
	var x = 641;
	if (w > x) {
		$('meta[name=viewport]').remove();
		var meta = document.createElement('meta');
		meta.setAttribute('name', 'viewport');
		meta.setAttribute('content', 'width=1200');
		document.getElementsByTagName('head')[0].appendChild(meta);
	}


	// IE8以下は非対応
	var ua = navigator.userAgent;
	var isIE = ua.match(/msie/i),
	isIE6 = ua.match(/msie [6.]/i),
	isIE7 = ua.match(/msie [7.]/i),
	isIE8 = ua.match(/msie [8.]/i)
	if (isIE6) {
		$(location).attr("href", "http://www.capstylus.com/unsupported/");
	} else if (isIE7) {
		$(location).attr("href", "http://www.capstylus.com/unsupported/");
	} else if (isIE8) {
		$(location).attr("href", "http://www.capstylus.com/unsupported/");
	}


	// スムーススクロール
	$('a[href^="#"].smooth').click(function() {
		$('html:not(:animated), body:not(:animated)').animate({ scrollTop: $($(this).attr('href')).offset().top - 20}, 200, 'swing' );
		return false;
	});


	// アニメーション設定
	if (w > x) {
	wow = new WOW({
		animateClass: 'animated',
		offset: 100
	});
	wow.init();
	}


	// スクロールバーのデザイン変更
	$('.capBody, .fontBody').perfectScrollbar();
	var speed = 5;
	$('.capBody').mousewheel(function(event, mov) {
		$(this).scrollLeft($(this).scrollLeft() - mov * speed);
		$('.capBody').scrollLeft($('.capBody').scrollLeft() - mov * speed);
		return false;
	});
	$('.fontBody').mousewheel(function(event, mov) {
		$(this).scrollLeft($(this).scrollLeft() - mov * speed);
		$('.fontBody').scrollLeft($('.fontBody').scrollLeft() - mov * speed);
		return false;
	});
	$('.formWrap').perfectScrollbar();


	// bg 出し入れ
	$('.btn-order').click(function() {
		$('#bg, #formWrap').fadeIn(200);
	});
	$('#bg').click(function() {
		$('#bg, #formWrap').fadeOut(200);
	});


	// カバー画像出し入れ
	$('.btn-start, #capBody, #font').click(function() {
		$('.coverWrap').fadeOut(600);
		$('.container').removeClass('containerSp');
		$('.editWrap .inner').addClass('dison');
	});


	// 注文フォームに readonly 付与
	$('.characterInput, .nameInput, .priceInput').attr('readonly', 'readonly');


	// よくある質問
	$(".faq dt").on("click", function() {
		$(this).next().slideToggle(200);
	});


	// loading
	$("#loading .loading_img").delay(0).fadeOut(800,function(){
		$("#loading").delay(0).fadeOut(800);
	});


	// その他キャップの処理
	$('.capbodyImg a:first-child').addClass('first');

});