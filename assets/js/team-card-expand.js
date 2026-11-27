/**
 * iQuanti Team Listing - Smooth Card Expand Animation
 * File: assets/js/team-card-expand.js
 */

(function ($) {
    'use strict';

    let activeCard = null;
    let activeOverlay = null;
    let isClosing = false;

    // Accessibility initialization
    function initAccessibility() {
        $('.iq-profile-card-item').each(function () {
            const $this = $(this);
            $this.attr({
                'tabindex': '0',
                'role': 'button',
                'aria-expanded': 'false',
                'aria-label': 'View ' + ($this.find('.sub-head-3').text().trim() || 'leader') + ' bio'
            });
        });
    }

    // Smooth Close Function
    function closeExpandedCard(callback, isFast) {
        if (!activeOverlay || isClosing) {
            if (typeof callback === 'function') callback();
            return;
        }

        isClosing = true;
        const $overlay = activeOverlay;
        const $card = activeCard;
        const animDuration = isFast ? 200 : 350;

        // Retrieve the stored original coordinates captured at open time
        const origin = $overlay.data('origin') || {
            left: 0,
            top: 0,
            width: $card.outerWidth(),
            height: $card.outerHeight()
        };

        // 1. Instantly make the underlying card visible beneath the overlay
        // so there is NEVER a blank empty hole or flash!
        if ($card) {
            $card.removeClass('is-morphing-source is-expanded')
                 .attr('aria-expanded', 'false');
        }

        // 2. Immediately fade out right-side details panel
        $overlay.find('.iq-profile-morph-details').css({
            'opacity': '0',
            'transform': 'translateX(20px)',
            'transition': 'opacity 0.12s ease, transform 0.12s ease'
        });

        // 3. Trigger smooth collapse + cross-fade
        $overlay.removeClass('is-expanded').addClass('is-collapsing');
        if (isFast) {
            $overlay.css('transition-duration', '0.2s');
        }

        $overlay.css({
            left: origin.left + 'px',
            top: origin.top + 'px',
            width: origin.width + 'px',
            height: origin.height + 'px'
        });

        // Shrink the media width back to match original card width
        $overlay.find('.iq-profile-morph-media').css({
            'width': origin.width + 'px',
            'transition': 'width ' + (animDuration / 1000) + 's cubic-bezier(0.16, 1, 0.3, 1)'
        });

        // 4. Cleanup after animation completes
        setTimeout(function () {
            $('.iq-profile-card-item').removeClass('is-expanded is-morphing-source');
            $('.iq-profile-grid-wrapper').removeClass('has-expanded-card');

            $overlay.remove();

            activeOverlay = null;
            activeCard = null;
            isClosing = false;

            if (typeof callback === 'function') {
                callback();
            }
        }, animDuration);
    }

    // Smooth Open Function
    function openCard($card) {
        if (isClosing) return;

        // If another card is already open: close it first, then open new card
        if (activeOverlay) {
            if (activeCard && activeCard[0] === $card[0]) {
                return; // Already open
            }
            closeExpandedCard(function () {
                openCard($card);
            }, true);
            return;
        }

        activeCard = $card;

        const cardEl = $card[0];
        const $wrapper = $card.closest('.iq-profile-grid-wrapper');
        const wrapperEl = $wrapper[0];

        const cardRect = cardEl.getBoundingClientRect();
        const wrapperRect = wrapperEl.getBoundingClientRect();

        // Coordinates relative to grid wrapper
        const startLeft = Math.round(cardRect.left - wrapperRect.left);
        const startTop = Math.round(cardRect.top - wrapperRect.top);
        const startWidth = Math.round(cardRect.width);
        const startHeight = Math.round(cardRect.height);

        const targetLeft = 0;
        const targetTop = startTop;
        const targetWidth = Math.round(wrapperRect.width);
        const targetHeight = startHeight; // 500px on desktop

        // Extract content from card
        const imgSrc = $card.find('.iq-profile-card-image img').attr('src') || '';
        const imgAlt = $card.find('.iq-profile-card-image img').attr('alt') || '';
        const badgeHtml = $card.find('.iq-profile-card-badge').html() || '';
        const detailsHtml = $card.find('.iq-profile-details-body').html() || '';

        // Build the animated morph overlay
        const $overlay = $(`
            <div class="iq-profile-morph-card" style="left: ${startLeft}px; top: ${startTop}px; width: ${startWidth}px; height: ${startHeight}px;" role="dialog" aria-modal="true" aria-label="Team member details">
                <div class="iq-profile-morph-media" style="width: ${startWidth}px;">
                    <div class="iq-profile-card-image">
                        <img src="${imgSrc}" alt="${imgAlt}">
                    </div>
                    <div class="iq-profile-card-badge has-glass-effect has-glass-dark">
                        ${badgeHtml}
                    </div>
                </div>
                <div class="iq-profile-morph-details">
                    <button type="button" class="iq-profile-close-btn js-morph-close js-profile-close" aria-label="Close profile details">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                            <path d="M0.671875 17.7486L17.7486 0.671875" stroke-width="1.89741" stroke="#CCCDCF" stroke-linecap="round"></path>
                            <path d="M17.75 17.7486L0.673269 0.671875" stroke-width="1.89741" stroke="#CCCDCF" stroke-linecap="round"></path>
                        </svg>
                    </button>
                    <div class="iq-profile-details-body">
                        ${detailsHtml}
                    </div>
                </div>
            </div>
        `);

        // Store origin rectangle on the overlay for 100% accurate collapse animation
        $overlay.data('origin', {
            left: startLeft,
            top: startTop,
            width: startWidth,
            height: startHeight
        });

        activeOverlay = $overlay;

        // Hide only the source card underneath the overlay
        $card.addClass('is-morphing-source').attr('aria-expanded', 'true');

        $wrapper.append($overlay);

        // Double requestAnimationFrame ensures browser renders start frame before animating to target
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                $overlay.addClass('is-expanded');

                const isMobile = window.innerWidth <= 991;
                if (isMobile) {
                    $overlay.css({
                        left: '0px',
                        width: targetWidth + 'px',
                        height: 'auto'
                    });
                    $overlay.find('.iq-profile-morph-media').css('width', '100%');
                } else {
                    $overlay.css({
                        left: targetLeft + 'px',
                        top: targetTop + 'px',
                        width: targetWidth + 'px',
                        height: targetHeight + 'px'
                    });
                }

                setTimeout(function () {
                    $overlay.find('.js-morph-close').focus();
                }, 380);
            });
        });
    }

    // Card click event
    $(document).on('click', '.iq-profile-card-item', function (e) {
        if ($(e.target).closest('.js-morph-close, .js-profile-close').length) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openCard($(this));
    });

    // Close button click event
    $(document).on('click', '.js-morph-close, .js-profile-close', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeExpandedCard();
    });

    // Click outside to close (anywhere outside active morph card)
    $(document).on('click', function (e) {
        if (!activeOverlay || isClosing) return;
        if (!$(e.target).closest('.iq-profile-morph-card').length &&
            !$(e.target).closest('.iq-profile-card-item').length) {
            closeExpandedCard();
        }
    });

    // Keyboard navigation (Escape key and Enter/Space on card)
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (activeOverlay) {
                closeExpandedCard();
            }
        }
    });

    $(document).on('keydown', '.iq-profile-card-item', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).trigger('click');
        }
    });

    // Window resize handler
    let resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (activeOverlay && activeCard) {
                const wrapperEl = activeCard.closest('.iq-profile-grid-wrapper')[0];
                const cardEl = activeCard[0];
                const cardRect = cardEl.getBoundingClientRect();
                const wrapperRect = wrapperEl.getBoundingClientRect();

                const isMobile = window.innerWidth <= 991;
                if (isMobile) {
                    activeOverlay.css({
                        left: '0px',
                        width: wrapperRect.width + 'px',
                        height: 'auto'
                    });
                    activeOverlay.find('.iq-profile-morph-media').css('width', '100%');
                } else {
                    const startTop = Math.round(cardRect.top - wrapperRect.top);
                    activeOverlay.css({
                        left: '0px',
                        top: startTop + 'px',
                        width: wrapperRect.width + 'px',
                        height: cardRect.height + 'px'
                    });
                    activeOverlay.find('.iq-profile-morph-media').css('width', cardRect.width + 'px');
                }
            }
        }, 100);
    });

    // Initialize on ready & strip any rogue listeners
    $(document).ready(function () {
        initAccessibility();
    });

})(jQuery);
