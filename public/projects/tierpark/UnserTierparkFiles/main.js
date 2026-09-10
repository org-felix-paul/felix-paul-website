jQuery(window).ready(function(){

	// Beim Aufruf der Seite eine Klasse an den Body um animationen zu steuern
	$('body').addClass('activePage');
	
	// Slider beim hovern nicht pausieren
	$('.carousel.no-startdelay').carousel({
	    pause: "false",
	    interval: 5000
	});
	$('.carousel.startdelay').carousel({
	    pause: "false",
	    interval: 7500
	});
	
	// Fix viewport height iOS, Android
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
		
	
	
	$(window).on("resize", function () {	
		if( typeof(windowresize)!='undefined' ){
			clearTimeout(windowresize);
		}
		windowresize = setTimeout(function(){
			var slider = $('#content .col-right .carousel-inhalt.parallax-sticky');
			var height = slider.closest('.row').find('.col-left .frame:first-child').outerHeight();
			slider.height(height);
		}, 100);
	
	}).trigger('resize');
	
	stickybits('.parallax-sticky,.frame-parallax,.frame-parallax-viewport,.carousel-item .left');
	
	$('.marquee').marquee({
		duration: 10000,
		direction: 'left'
	});
	
	// Slider
	$('.slickslider').slick({
		arrows: false,
		dots: true,
		fade:false,
		autoplay:true,
		prevArrow: '<button class="slick-prev"> <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>',
		nextArrow: '<button class="slick-next"> <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>'		
	});
	
	
	// Bildergalerie
	$('.gallery').each(function(){
		$(this).find('.item').each(function(){
			var captionHeight = $(this).find('.caption .title').outerHeight();
			$(this).find('.caption').height(captionHeight);
		});
	});
	// Bildergalerie Popup
	$('.carousel,.gallery,.ce-gallery').each(function(){
		$(this).magnificPopup({
			delegate: 'a.fancybox',
			type: 'image',
			closeOnContentClick: false,
			closeBtnInside: false,
			mainClass: 'mfp-with-zoom mfp-img-mobile',
			image: {
				verticalFit: true,
				titleSrc: function(item) {
					return item.el.attr('title');
				}
			},
			gallery: {
				enabled: true,
				tCounter: '<span class="mfp-counter">%curr% von %total%</span>'
			},
			zoom: {
				enabled: true,
				duration: 300, // don't foget to change the duration also in CSS
				opener: function(element) {
					return element.find('img');
				}
			}
		});
	});
	
	
	
	// Karussell
	
	$('.slick-carousel').slick({
		arrows: true,
		slidesToShow: 3,
		slidesToScroll: 3,
		infinite: false,
		dots: true
	});
	
	// Erweitertes Karussell
	$('.slick-carousel-extended').slick({
		arrows: false,
		dots: true,
		slidesToShow: 3,
		slidesToScroll: 3,
		responsive: [{
			breakpoint: 991,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			}
		},{
			breakpoint: 767,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}]
	});
	
	// scroll to top
	$(window).scroll(function(){ 
        if ($(this).scrollTop() > 150) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    }); 
	
	$('.scrollup').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});
	
	
	// Body bekommt eine Zusatzklasse beim scrollen
	stickyNavTop = $('.header').offset().top + 300;
	var stickyNav = function() {
		var scrollTop = $(window).scrollTop();
		if(scrollTop > stickyNavTop) {
			$('body').addClass('scrolled');
		} else {
			$('body').removeClass('scrolled');
		}
	};
	stickyNav();
	$(window).scroll(function() {
		stickyNav();
	});
	
	
	// Touch erster Klick hover, zweiter Klick aufruf
	$( '#mainnav li:has(ul)' ).doubleTapToGo();
	
	
	
	// inViewport 
	// @desc Beim scrollen die Klasse visible in abhängigkeit der Sichtbarkeit an allen div.in-viewport toggeln
	$(window).bind('scroll resize load',function(){
		var scrollpos = $(window).scrollTop();
		var windowheight = $(window).height();
		$('div.viewport,img.viewport').each(function(){
			var elementheight = $(this).outerHeight();
			var elementtop = $(this).offset().top + 100;
			var visible = ((scrollpos<(elementtop+elementheight)) && ((scrollpos+windowheight)>=elementtop));
			if( visible != $(this).is('.inviewport') ){
				//$(this).toggleClass('inviewport', visible).toggleClass('outofviewport', !visible);
				if(visible){
					$(this).addClass('inviewport').removeClass('outofviewport').trigger('inViewport');
				} else {
					$(this).addClass('outofviewport').removeClass('inviewport').trigger('outOfViewport');
				}
			}
        });
	});
    
    
	// .counter
	// @desc Zähler bei inViewport initialisieren und hochzählen, bei outOfViewport zurücksetzen
	$(".counter").bind('inViewport',function() {
		var initial = $(this).data('initial')||0;
		var end = $(this).data('end')||$(this).find('span.count-number').text();
		var duration = $(this).data('duration')||(3+Math.log10(end))*1000;
		
		$(this).find('span.count-number').prop('counter',initial).animate({
			counter: parseInt(end,10)
		}, {
			duration: duration,
			
			step: function(current) {
				if($(this).closest('.counter').hasClass('group')){
					$(this).text(Math.ceil(current).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
				} else {
					$(this).text(Math.ceil(current).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
				}
				
			},
			easing: 'easeOutExpo'
		});
	}).bind('outOfViewport',function(){
		// Animation anhalten, ursprünglichen Wert setzen
		$(this).find('span.count-number').stop().text($(this).data('end'));
	});
	
});