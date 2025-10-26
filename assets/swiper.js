// Swiper JavaScript
document.addEventListener("DOMContentLoaded", function () {
	// SVGアイコンの定義
	const arrowSVG_prev = `
		<svg id="_レイヤー_1" data-name="レイヤー_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24">
  <!-- Generator: Adobe Illustrator 29.5.1, SVG Export Plug-In . SVG Version: 2.1.0 Build 141)  -->
  <path d="M16.1125001,22.4522497L5.66025,11.9999996,16.1125001,1.5477503l2.2272499,2.2272492-8.2250001,8.2250001,8.2250001,8.2250001s-2.2272499,2.2272499-2.2272499,2.22725Z"/>
</svg>
	`;
	const arrowSVG_next = `
		<?xml version="1.0" encoding="UTF-8"?>
<svg id="_レイヤー_1" data-name="レイヤー_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24">
  <!-- Generator: Adobe Illustrator 29.5.1, SVG Export Plug-In . SVG Version: 2.1.0 Build 141)  -->
  <path d="M7.8874996,22.4522505l-2.2272499-2.22725,8.2250009-8.2250001L5.6602504,3.7750002l2.2272492-2.2272507,10.4522508,10.4522508-10.4522508,10.4522502Z"/>
</svg>
	`;

	// カスタムナビゲーションボタンを作成する関数
	function createCustomNavButtons(container) {
		// 新しいボタンを作成
		const nextButton = document.createElement("div");
		nextButton.className = "swiper-button-next swiper-nav-custom";
		nextButton.innerHTML = arrowSVG_next;

		const prevButton = document.createElement("div");
		prevButton.className = "swiper-button-prev swiper-nav-custom";
		prevButton.innerHTML = arrowSVG_prev;

		// コンテナに追加
		container.appendChild(nextButton);
		container.appendChild(prevButton);

		return { nextButton, prevButton };
	}

	// image-banner.liquid用のSwiper初期化
	if (document.querySelector(".swiper-main .swiper")) {
		// メインスライダーの初期化
		const mainSwiper = new Swiper(".swiper-main .swiper", {
			spaceBetween: 0,
			slidesPerView: 1,
			effect: "fade",
			loop: true,
			autoplay: {
				delay: 4000,
				disableOnInteraction: false
			},
			pagination: {
				el: ".swiper-main .swiper-pagination",
				clickable: true
			}
		});
	}

	// その他の基本的なSwiper
	const basicSwipers = document.querySelectorAll(".swiper:not(.swiper-main .swiper):not(.swiper-thumbnails)");

	basicSwipers.forEach((container, index) => {
		const swiperId = `swiper-${index + 1}`;
		container.id = swiperId;

		// ナビゲーションボタンの表示設定を取得
		const showNavigationAttr = container.getAttribute("data-swiperShowNavigation");
		const showNavigation = showNavigationAttr !== "false"; // デフォルトは true

		// カスタムナビゲーションボタンを作成（表示する場合のみ）
		let nextButton, prevButton;
		if (showNavigation) {
			const navButtons = createCustomNavButtons(container.parentElement);
			nextButton = navButtons.nextButton;
			prevButton = navButtons.prevButton;
		}

		const slidePerViewPCAttr = container.getAttribute("data-swiperSlidePC");
		const slidePerViewSPAttr = container.getAttribute("data-swiperSlideSP");
		const slidePerViewPC = slidePerViewPCAttr === "auto" ? "auto" : parseFloat(slidePerViewPCAttr) || 3;
		const slidePerViewSP = slidePerViewSPAttr === "auto" ? "auto" : parseFloat(slidePerViewSPAttr) || 1.8;
		const direction = container.getAttribute("data-direction") || "horizontal";
		const mousewheelAttr = container.getAttribute("mousewheelControl");
		const mousewheel = mousewheelAttr === "true";
		const slideCentered = container.hasAttribute("slideCentered");
		const freeMode = container.hasAttribute("freeMode");

		// 新しい属性を取得
		const autoScrollAttr = container.getAttribute("data-autoScroll");
		const autoScroll = autoScrollAttr === "true";
		const autoScrollDelay = parseInt(container.getAttribute("data-autoScrollDelay")) || 4000;
		const fadeEffectAttr = container.getAttribute("data-fade");
		const fadeEffect = fadeEffectAttr === "true";
		const fadeSpeed = parseInt(container.getAttribute("data-fadeSpeed")) || 1000;

		// サムネイルスライダーの設定を取得
		const showThumbsAttr = container.getAttribute("data-showThumbs");
		const showThumbs = showThumbsAttr === "true";

		// Swiper設定オブジェクトを作成
		const swiperConfig = {
			autoHeight: true,
			slidesPerView: slidePerViewSP,
			freeMode: freeMode,
			direction: direction === "vertical" ? "vertical" : direction,
			spaceBetween: 15,
			centeredSlides: slideCentered,
			mousewheel: mousewheel,
			scrollbar: {
				el: `#${swiperId} + .swiper-scrollbar`,
				hide: false,
				draggable: true
			},
			breakpoints: {
				740: {
					slidesPerView: slidePerViewPC,
					spaceBetween: 20
				}
			},
			pagination: {
				el: `#${swiperId} .swiper-pagination`,
				clickable: true
			}
		};

		// ナビゲーション設定（表示する場合のみ）
		if (showNavigation && nextButton && prevButton) {
			swiperConfig.navigation = {
				nextEl: nextButton,
				prevEl: prevButton
			};
		}

		// フェード効果の設定
		if (fadeEffect) {
			swiperConfig.effect = "fade";
			swiperConfig.fadeEffect = {
				crossFade: true
			};
			swiperConfig.speed = fadeSpeed;
			// フェード効果の場合は spaceBetween を0に
			swiperConfig.spaceBetween = 0;
			swiperConfig.breakpoints[740].spaceBetween = 0;
		}

		// オートスクロールの設定
		if (autoScroll) {
			swiperConfig.autoplay = {
				delay: autoScrollDelay,
				disableOnInteraction: false
			};
		}

		// サムネイルスライダーの設定
		if (showThumbs) {
			// サムネイルスライダーを初期化
			const thumbsSwiper = new Swiper(".swiper-thumbnails", {
				spaceBetween: 8,
				slidesPerView: 4,
				breakpoints: {
					640: {
						slidesPerView: 6
					},
					768: {
						slidesPerView: 6
					},
					1024: {
						slidesPerView: 8
					}
				},
				watchSlidesProgress: true,
				navigation: {
					nextEl: ".swiper-thumbnails .swiper-button-next",
					prevEl: ".swiper-thumbnails .swiper-button-prev"
				},
				loop: false,
				allowTouchMove: true,
				centeredSlides: false
			});

			// メインスライダーにサムネイルを関連付け
			swiperConfig.thumbs = {
				swiper: thumbsSwiper
			};
		}

		new Swiper(`#${swiperId}`, swiperConfig);
	});
});
