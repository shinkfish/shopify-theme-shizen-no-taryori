// Swiper JavaScript
document.addEventListener("DOMContentLoaded", function () {
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
	const basicSwipers = document.querySelectorAll(".bl_swiper .swiper:not(.swiper-main .swiper):not(.swiper-thumbnails)");

	basicSwipers.forEach((container, index) => {
		const swiperId = `swiper-${index + 1}`;
		container.id = swiperId;

		const parentWrapper = container.closest(".bl_swiper");

		// ナビゲーションボタンを取得（bl_swiper_controls.liquidでレンダリングされたもの）
		const nextButton = container.querySelector(".swiper-button-next") || (parentWrapper ? parentWrapper.querySelector(".swiper-button-next") : null);
		const prevButton = container.querySelector(".swiper-button-prev") || (parentWrapper ? parentWrapper.querySelector(".swiper-button-prev") : null);

		const slidePerViewPCAttr = container.getAttribute("data-swiperSlidePC");
		const slidePerViewSPAttr = container.getAttribute("data-swiperSlideSP");
		const slidePerViewPC = slidePerViewPCAttr === "auto" ? "auto" : parseFloat(slidePerViewPCAttr) || 3;
		const slidePerViewSP = slidePerViewSPAttr === "auto" ? "auto" : parseFloat(slidePerViewSPAttr) || 1.8;
		const direction = container.getAttribute("data-direction") || "horizontal";
		const mousewheelAttr = container.getAttribute("mousewheelControl");
		const mousewheel = mousewheelAttr === "true";
		const slideCentered = container.hasAttribute("slideCentered");
		const freeMode = container.hasAttribute("freeMode");
		// loop設定を取得
		const loopAttr = container.getAttribute("data-loop");
		const loop = loopAttr === "true";

		// space between
		const spaceBetweenSPAttr = container.getAttribute("data-spaceBetween-sp");
		const spaceBetweenPCAttr = container.getAttribute("data-spaceBetween-pc");
		// data-spaceBetweenが設定されている場合のみその値を使用、それ以外はデフォルト値
		const spaceBetweenSPDefault = 8; // モバイルのデフォルト値
		const spaceBetweenPCDefault = 24; // PCのデフォルト値
		const spaceBetweenSP = spaceBetweenSPAttr !== null ? (spaceBetweenSPAttr === "auto" ? "auto" : parseFloat(spaceBetweenSPAttr)) : spaceBetweenSPDefault;
		const spaceBetweenPC = spaceBetweenPCAttr !== null ? (spaceBetweenPCAttr === "auto" ? "auto" : parseFloat(spaceBetweenPCAttr)) : spaceBetweenPCDefault;

		// 新しい属性を取得
		const autoScrollAttr = container.getAttribute("data-autoScroll");
		const autoScroll = autoScrollAttr === "true";
		const autoScrollDelayAttr = container.getAttribute("data-autoScrollDelay");
		const autoScrollDelay = autoScrollDelayAttr !== null ? parseFloat(autoScrollDelayAttr) : 4000;

		// scrollSpeed設定を取得
		const scrollSpeedAttr = container.getAttribute("data-scrollSpeed");
		const scrollSpeed = scrollSpeedAttr !== null ? parseInt(scrollSpeedAttr) : 300;

		const fadeEffectAttr = container.getAttribute("data-fade");
		const fadeEffect = fadeEffectAttr === "true";
		const fadeSpeed = parseInt(container.getAttribute("data-fadeSpeed")) || 1000;

		// サムネイルスライダーの設定を取得
		const showThumbsAttr = container.getAttribute("data-showThumbs");
		const showThumbs = showThumbsAttr === "true";

		// Swiper設定オブジェクトを作成
		const swiperConfig = {
			autoHeight: false,
			slidesPerView: slidePerViewSP,
			freeMode: freeMode,
			direction: direction === "vertical" ? "vertical" : direction,
			spaceBetween: spaceBetweenSP,
			centeredSlides: slideCentered,
			loop: loop,
			speed: scrollSpeed,
			mousewheel: mousewheel,
			scrollbar: {
				el: `#${swiperId} + .swiper-scrollbar`,
				hide: false,
				draggable: true
			},
			breakpoints: {
				740: {
					slidesPerView: slidePerViewPC,
					spaceBetween: spaceBetweenPC
				}
			}
		};

		// Pagination設定（要素が存在する場合のみ）
		const paginationEl = container.querySelector(".swiper-pagination") || (parentWrapper ? parentWrapper.querySelector(".swiper-pagination") : null);
		if (paginationEl) {
			swiperConfig.pagination = {
				el: paginationEl,
				type: "fraction",
				clickable: true,
				formatFractionCurrent: function (number) {
					return number < 10 ? "0" + number : number;
				},
				formatFractionTotal: function (number) {
					return number < 10 ? "0" + number : number;
				},
				renderFraction: function (currentClass, totalClass) {
					return '<span class="text-base ' + currentClass + '"></span>' + '<span class="swiper-pagination-separator"></span>' + '<span class="text-base ' + totalClass + '"></span>';
				}
			};
		}

		// ナビゲーション設定（ボタンが存在する場合のみ）
		if (nextButton && prevButton) {
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
			// data-autoScrollContinuous="true" の場合は常に流れるように
			const continuous = container.getAttribute("data-autoScrollContinuous") === "true";

			if (continuous) {
				swiperConfig.autoplay = {
					delay: 0,
					disableOnInteraction: false
				};
				swiperConfig.speed = parseInt(container.getAttribute("data-scrollSpeed")) || 6000;
				swiperConfig.loop = true;
				swiperConfig.allowTouchMove = false;

				// CSSで線形モーションを適用
				container.querySelector(".swiper-wrapper").style.transitionTimingFunction = "linear";
			} else {
				swiperConfig.autoplay = {
					delay: autoScrollDelay,
					disableOnInteraction: false
				};
			}
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
				pagination: {
					el: ".swiper-pagination"
				},
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev"
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
