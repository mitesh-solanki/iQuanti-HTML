// Sticky Header Js
jQuery(document).ready(function ($) {
    jQuery(window).on('scroll', function () {
        if (jQuery(window).scrollTop() > 50) {
            jQuery('.site-header').addClass('sticky-header');
        } else {
            jQuery('.site-header').removeClass('sticky-header');
        }
    });

});

// Mobile Menu Js 

jQuery(function ($) {

    var $header = $('.site-header');
    var $menuToggle = $('.menu-toggle');
    var $mobileNavigation = $('.mobile-navigation');
    var $menuClose = $('.menu-close');
    var $overlay = $('.overlay');

    var panel = $mobileNavigation[0];
    var isMenuOpen = false;

    // Display value used when the panel is shown (change to 'block' if the
    // layout looks different from before)
    var PANEL_DISPLAY = 'flex';
    var SLIDE_DURATION = 250;

    // Header children that must be inert while the menu is open
    var HEADER_BACKGROUND = '.site-logo, .main-navigation, .header-contact, .menu-toggle';

    // ========================================
    // SLIDE ANIMATION (native, no jQuery effects)
    // jQuery 4 slim has no .slideDown() / .slideUp() / .stop()
    // ========================================

    var currentAnimation = null;

    function getDuration() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 0
            : SLIDE_DURATION;
    }

    function cancelAnimation() {
        if (currentAnimation) {
            currentAnimation.cancel();
            currentAnimation = null;
        }
    }

    function slideDown() {
        cancelAnimation();

        // Visible and focusable immediately
        panel.style.display = PANEL_DISPLAY;

        var duration = getDuration();
        if (!duration || !panel.animate) return;

        var height = panel.scrollHeight;
        panel.style.overflow = 'hidden';

        var animation = panel.animate(
            [{ height: '0px' }, { height: height + 'px' }],
            { duration: duration, easing: 'ease' }
        );

        currentAnimation = animation;
        animation.onfinish = function () {
            panel.style.overflow = '';
            currentAnimation = null;
        };
    }

    function slideUp() {
        cancelAnimation();

        var duration = getDuration();
        if (!duration || !panel.animate) {
            panel.style.display = 'none';
            return;
        }

        var height = panel.offsetHeight;
        panel.style.overflow = 'hidden';

        var animation = panel.animate(
            [{ height: height + 'px' }, { height: '0px' }],
            { duration: duration, easing: 'ease' }
        );

        currentAnimation = animation;
        animation.onfinish = function () {
            panel.style.display = 'none';
            panel.style.overflow = '';
            currentAnimation = null;
        };
    }

    // ========================================
    // INITIAL STATE (menu closed)
    // ========================================

    $mobileNavigation
        .attr('aria-hidden', 'true')
        .prop('inert', true);

    // ========================================
    // HELPERS
    // ========================================

    // Keyboard-focusable, visible elements inside the panel
    function getFocusableElements() {
        return $mobileNavigation.find(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ).filter(':visible');
    }

    // Elements we made inert (so we only undo our own changes)
    var inertedElements = [];

    // Make everything behind the panel inert.
    // Walks up from the header to <body> and inerts every SIBLING along the
    // way, so it works even when the header sits inside a page wrapper
    // (the wrapper itself must NOT be inert, or the panel would be too).
    function disableBackground() {
        inertedElements = [];

        var node = $header[0];
        while (node && node !== document.body && node.parentNode) {
            Array.prototype.forEach.call(node.parentNode.children, function (sibling) {
                if (sibling !== node && !sibling.inert) {
                    sibling.inert = true;
                    inertedElements.push(sibling);
                }
            });
            node = node.parentNode;
        }

        // Header parts other than the mobile panel / overlay
        $header.find(HEADER_BACKGROUND).each(function () {
            if (!this.inert) {
                this.inert = true;
                inertedElements.push(this);
            }
        });
    }

    function enableBackground() {
        inertedElements.forEach(function (el) {
            el.inert = false;
        });
        inertedElements = [];
    }

    // ========================================
    // OPEN MENU
    // ========================================

    function openMenu() {
        if (isMenuOpen) return;
        isMenuOpen = true;

        $header.addClass('menu-open');
        $('body').addClass('mobile-menu-active');

        // Background first, so nothing behind the panel can take focus
        disableBackground();

        // Expose the panel to keyboard and screen readers, then show it
        $mobileNavigation
            .prop('inert', false)
            .attr('aria-hidden', 'false');

        slideDown();

        // aria-expanded carries the state, so the label stays "Open menu"
        $menuToggle.attr('aria-expanded', 'true');

        // Move focus into the panel (retry briefly in case CSS delays it)
        var attempts = 0;
        (function focusClose() {
            if (!isMenuOpen) return;

            $menuClose[0].focus({ preventScroll: true });

            if (document.activeElement !== $menuClose[0] && attempts < 20) {
                attempts++;
                setTimeout(focusClose, 50);
            }
        })();
    }

    // ========================================
    // CLOSE MENU
    // ========================================

    function closeMenu(restoreFocus) {
        if (restoreFocus === undefined) restoreFocus = true;
        if (!isMenuOpen) return;
        isMenuOpen = false;

        $header.removeClass('menu-open');
        $('body').removeClass('mobile-menu-active');

        $menuToggle.attr('aria-expanded', 'false');

        // 1. Re-enable the background so the toggle can take focus
        enableBackground();

        // 2. Move focus OUT of the panel before hiding it
        //    (aria-hidden / inert on a focused element drops focus to <body>)
        if (restoreFocus) {
            $menuToggle[0].focus({ preventScroll: true });
        }

        // 3. Now hide the panel from keyboard and screen readers
        $mobileNavigation
            .attr('aria-hidden', 'true')
            .prop('inert', true);

        slideUp();
    }

    // ========================================
    // CLICK HANDLERS
    // ========================================

    $menuToggle.on('click', openMenu);

    $menuClose.on('click', function () {
        closeMenu();
    });

    $overlay.on('click', function () {
        closeMenu();
    });

    $mobileNavigation.find('a').on('click', function () {
        closeMenu();
    });

    // ========================================
    // KEYBOARD: ESCAPE + FOCUS TRAP
    // ========================================

    $(document).on('keydown', function (event) {
        if (!isMenuOpen) return;

        // Escape closes the menu
        if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu();
            return;
        }

        // Tab / Shift+Tab stay inside the panel
        if (event.key === 'Tab') {
            var $focusable = getFocusableElements();

            if (!$focusable.length) {
                event.preventDefault();
                $menuClose[0].focus();
                return;
            }

            var first = $focusable[0];
            var last = $focusable[$focusable.length - 1];
            var active = document.activeElement;

            // Focus is outside the panel for any reason: pull it back in
            if (!$.contains(panel, active)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
                return;
            }

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    // Safety net: if focus ever lands outside the panel, bring it back
    $(document).on('focusin', function (event) {
        if (
            isMenuOpen &&
            !$.contains(panel, event.target) &&
            event.target !== panel
        ) {
            $menuClose[0].focus();
        }
    });

    // ========================================
    // RESET ON DESKTOP
    // ========================================

    $(window).on('resize', function () {
        if (window.innerWidth > 991 && isMenuOpen) {
            // Don't steal focus on resize; the toggle is hidden on desktop
            closeMenu(false);
        }
    });

});



// Slider js //

document.addEventListener("DOMContentLoaded", function () {

    const sliderTrack = document.querySelector(".research-track");
    const sliderItems = document.querySelectorAll(".research-slide");
    const previousButton = document.querySelector(".research-prev");
    const nextButton = document.querySelector(".research-next");
    const paginationDots = document.querySelectorAll(".research-dot");

    let activeSlide = 0;
    let autoPlay;

    function showSlide(index) {

        if (index >= sliderItems.length) {
            activeSlide = 0;
        } else if (index < 0) {
            activeSlide = sliderItems.length - 1;
        } else {
            activeSlide = index;
        }

        const slideWidth = sliderItems[0].offsetWidth;
        const gap = 20;

        sliderTrack.style.transform =
            `translateX(-${activeSlide * (slideWidth + gap)}px)`;

        paginationDots.forEach(function (dot, index) {
            dot.classList.toggle(
                "active",
                index === activeSlide
            );
        });
    }

    function nextSlide() {
        showSlide(activeSlide + 1);
    }

    function previousSlide() {
        showSlide(activeSlide - 1);
    }

    nextButton.addEventListener("click", function () {
        nextSlide();
        restartAutoPlay();
    });

    previousButton.addEventListener("click", function () {
        previousSlide();
        restartAutoPlay();
    });

    paginationDots.forEach(function (dot, index) {

        dot.addEventListener("click", function () {
            showSlide(index);
            restartAutoPlay();
        });

    });

    function startAutoPlay() {
        autoPlay = setInterval(function () {
            nextSlide();
        }, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlay);
    }

    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    const sliderArea = document.querySelector(".research-slider");

    sliderArea.addEventListener("mouseenter", stopAutoPlay);
    sliderArea.addEventListener("mouseleave", startAutoPlay);

    /* Initial slide */
    showSlide(0);
    startAutoPlay();

    /* Recalculate on resize */
    window.addEventListener("resize", function () {
        showSlide(activeSlide);
    });

});





// Our Works Filters
jQuery(function ($) {
    var $filters = $('.our-works-filters');

    if (!$filters.length) {
        return;
    }

    $filters.on('click', '[data-works-mode]', function () {
        var mode = $(this).data('works-mode');

        $filters.find('[data-works-mode]')
            .removeClass('cta-action-primary')
            .attr('aria-pressed', 'false');

        $(this)
            .addClass('cta-action-primary')
            .attr('aria-pressed', 'true');

        $filters.find('.our-works-chips').attr('hidden', true);
        $filters.find('.our-works-chips[data-works-group="' + mode + '"]').removeAttr('hidden');
    });

    $filters.on('click', '.our-works-chip', function () {
        $(this).addClass('is-active').siblings('.our-works-chip').removeClass('is-active');
    });
});

// Write JQuery Code Here
 jQuery(document).ready(function () {

    // Testimonials Slider
    jQuery('.testimonial-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: false,
        dots: true,
        autoplay: false,
        speed: 600,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

});


// Vercel prototype motion parity.
document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.site-header');
    if (header) {
        requestAnimationFrame(function () {
            header.classList.add('is-motion-ready');
        });
    }

    const clientSection = document.querySelector('.client-section');
    if (clientSection && 'IntersectionObserver' in window) {
        const chartObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-chart-visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.2,
            rootMargin: '-10% 0px -10% 0px'
        });

        chartObserver.observe(clientSection);
    } else if (clientSection) {
        clientSection.classList.add('is-chart-visible');
    }
});


// Webinar Slider
(function (window) {
  'use strict';

  function initWebinarSlider(section) {
    if (!section || section.dataset.sliderInitialized === 'true') {
      return;
    }

    var viewport = section.querySelector('[data-slider-viewport]');
    var track = section.querySelector('[data-slider-track]');
    var prevBtn = section.querySelector('[data-slider-action="prev"]');
    var nextBtn = section.querySelector('[data-slider-action="next"]');
    var pagination = section.querySelector('[data-slider-pagination]');

    if (!viewport || !track) return;

    var originalCards = Array.prototype.slice.call(
      track.querySelectorAll('[data-slider-item]:not([data-slider-clone])')
    );
    var N = originalCards.length;
    if (N === 0) return;

    section.dataset.sliderInitialized = 'true';

    // Remove existing clones if re-initializing
    var existingClones = track.querySelectorAll('[data-slider-clone]');
    existingClones.forEach(function (c) {
      c.remove();
    });

    // Clone cards before and after in exact order for infinite looping
    var firstRealCard = originalCards[0];
    originalCards.forEach(function (card) {
      var cloneBefore = card.cloneNode(true);
      cloneBefore.setAttribute('data-slider-clone', 'true');
      cloneBefore.classList.remove('is-active');
      track.insertBefore(cloneBefore, firstRealCard);
    });

    originalCards.forEach(function (card) {
      var cloneAfter = card.cloneNode(true);
      cloneAfter.setAttribute('data-slider-clone', 'true');
      cloneAfter.classList.remove('is-active');
      track.appendChild(cloneAfter);
    });

    var allCards = Array.prototype.slice.call(track.querySelectorAll('[data-slider-item]'));
    var currentIndex = N;
    var isTransitioning = false;
    var startX = 0;
    var isDragging = false;

    // Render Pagination Dots
    function buildPagination() {
      if (!pagination) return;
      pagination.innerHTML = '';
      for (var i = 0; i < N; i++) {
        (function (realIndex) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'iq-pagination-dot' + (realIndex === 0 ? ' is-active' : '');
          dot.setAttribute('data-slider-dot-index', realIndex);
          dot.setAttribute('aria-label', 'Go to slide ' + (realIndex + 1));
          dot.addEventListener('click', function () {
            if (isTransitioning) return;
            currentIndex = N + realIndex;
            updateSlider(true);
          });
          pagination.appendChild(dot);
        })(i);
      }
    }

    function updateSlider(animate) {
      track.style.transition = animate 
        ? 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)' 
        : 'none';

      var inactiveCard = track.querySelector('[data-slider-item]:not(.is-active)');
      var cardWidth = inactiveCard ? inactiveCard.offsetWidth : 297;
      var gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      var moveDistance = (cardWidth + gap) * currentIndex;
      track.style.transform = 'translateX(-' + moveDistance + 'px)';

      var realActive = ((currentIndex % N) + N) % N;

      // Active state updates
      allCards.forEach(function (card, idx) {
        card.classList.toggle('is-active', idx === currentIndex);
      });

      if (pagination) {
        var dots = pagination.querySelectorAll('.iq-pagination-dot');
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === realActive);
        });
      }

      if (prevBtn) prevBtn.disabled = false;
      if (nextBtn) nextBtn.disabled = false;
    }

    // Seamless loop reset
    track.addEventListener('transitionend', function (e) {
      if (e.target !== track) return;
      isTransitioning = false;

      if (currentIndex >= 2 * N) {
        currentIndex = currentIndex - N;
        updateSlider(false);
      } else if (currentIndex < N) {
        currentIndex = currentIndex + N;
        updateSlider(false);
      }
    });

    // Card click navigation
    allCards.forEach(function (card, idx) {
      card.addEventListener('click', function (e) {
        if (idx !== currentIndex) {
          e.preventDefault();
          if (isTransitioning) return;
          isTransitioning = true;
          currentIndex = idx;
          updateSlider(true);
        }
      });
    });

    function slideNext() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateSlider(true);
    }

    function slidePrev() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updateSlider(true);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        slideNext();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        slidePrev();
      });
    }

    // Drag & Touch gestures
    viewport.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX;
      viewport.classList.add('is-dragging');
    });

    window.addEventListener('mouseup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove('is-dragging');
      var diff = e.pageX - startX;
      if (diff < -45) slideNext();
      else if (diff > 45) slidePrev();
    });

    viewport.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });

    viewport.addEventListener('touchend', function (e) {
      var endX = e.changedTouches[0].clientX;
      var diff = endX - startX;
      if (diff < -40) slideNext();
      else if (diff > 40) slidePrev();
    }, { passive: true });

    window.addEventListener('resize', function () {
      updateSlider(false);
    });

    buildPagination();
    updateSlider(false);
  }

  function initWebinarSliders(root) {
    var scope = root || document;
    var sections = scope.querySelectorAll('[data-slider-root]');
    sections.forEach(function (sec) {
      initWebinarSlider(sec);
    });
  }

  window.iQuantiInitWebinarSliders = initWebinarSliders;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initWebinarSliders(document);
    });
  } else {
    initWebinarSliders(document);
  }
})(window);
 
