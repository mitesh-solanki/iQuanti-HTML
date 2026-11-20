jQuery(document).ready(function ($) {
    // Sticky Header Js
    jQuery(window).on('scroll', function () {
        if (jQuery(window).scrollTop() > 50) {
            jQuery('.site-header').addClass('sticky-header');
        } else {
            jQuery('.site-header').removeClass('sticky-header');
        }
    });

    // Flipping Blog Card JS
    $(document).on('click', '.media-content-card-front-btn', function(e) {
        e.preventDefault();
        $(this).closest('.media-content-card').addClass('flipped');
    });

    $(document).on('click', '.media-content-card-close', function(e) {
        e.preventDefault();
        $(this).closest('.media-content-card').removeClass('flipped');
    });

});

// Mobile Menu Js 

// Mobile Menu Js
jQuery(function ($) {
 
    var $header = $('.site-header');
    var $menuToggle = $('.menu-toggle');
    var $mobileNavigation = $('.mobile-navigation');
    var mobileNav = $mobileNavigation.get(0);
 
    if (!mobileNav) {
        return;
    }
 
    var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
 
    function setPanelInert(isInert) {
        if (!mobileNav) {
            return;
        }
 
        if (isInert) {
            mobileNav.setAttribute('inert', '');
            mobileNav.setAttribute('aria-hidden', 'true');
            mobileNav.removeAttribute('open');
            mobileNav.inert = true;
        } else {
            mobileNav.removeAttribute('inert');
            mobileNav.setAttribute('aria-hidden', 'false');
            mobileNav.setAttribute('open', '');
            mobileNav.inert = false;
        }
    }
 
    function setBackgroundInert(isInert) {
        if (isInert) {
            var current = mobileNav;
            while (current && current !== document.body && current.parentElement) {
                var parent = current.parentElement;
                var children = parent.children;
                for (var i = 0; i < children.length; i++) {
                    var sibling = children[i];
                    if (sibling !== current && !sibling.contains(mobileNav)) {
                        // Keep backdrop overlay interactive for click dismiss
                        if (sibling.classList && sibling.classList.contains('overlay')) {
                            continue;
                        }
                        var tag = sibling.tagName ? sibling.tagName.toUpperCase() : '';
                        if (tag !== 'SCRIPT' && tag !== 'STYLE' && tag !== 'LINK') {
                            if (!sibling.hasAttribute('inert')) {
                                sibling.setAttribute('inert', '');
                                sibling.setAttribute('data-menu-inert', 'true');
                                sibling.inert = true;
                            }
                        }
                    }
                }
                current = parent;
            }
        } else {
            var inerted = document.querySelectorAll('[data-menu-inert="true"]');
            for (var j = 0; j < inerted.length; j++) {
                inerted[j].removeAttribute('inert');
                inerted[j].removeAttribute('data-menu-inert');
                inerted[j].inert = false;
            }
        }
    }
 
    function getFocusableElements() {
        if (!mobileNav) {
            return [];
        }
        return $(mobileNav)
            .find(FOCUSABLE)
            .filter(function () {
                return $(this).is(':visible') && !this.disabled && !this.hasAttribute('inert');
            })
            .toArray();
    }
 
    function focusCloseButton() {
        if (!mobileNav || !$header.hasClass('menu-open')) {
            return false;
        }
 
        var closeBtn = $mobileNavigation.find('.menu-close').get(0);
        if (closeBtn) {
            try {
                closeBtn.focus({ preventScroll: true });
            } catch (e) {
                closeBtn.focus();
            }
            if (document.activeElement === closeBtn) {
                $(closeBtn).addClass('has-focus');
                return true;
            }
        }
 
        // Fallback: focus dialog container itself (tabindex="-1")
        if (typeof mobileNav.focus === 'function') {
            try {
                mobileNav.focus({ preventScroll: true });
            } catch (e) {
                mobileNav.focus();
            }
        }
 
        return document.activeElement === closeBtn || document.activeElement === mobileNav;
    }
 
    function openMenu() {
        if ($header.hasClass('menu-open')) {
            return;
        }
 
        $header.addClass('menu-open');
        $menuToggle.attr('aria-expanded', 'true');
 
        // 1. Expose panel to assistive technology & keyboard
        setPanelInert(false);
 
        // 2. Move focus into panel FIRST before marking background inert.
        // This prevents the browser from resetting focus to document.body when .menu-toggle's container is inerted.
        focusCloseButton();
 
        // 3. Make all background content inert
        setBackgroundInert(true);
 
        // 4. Reinforce focus on close button across execution ticks and paint frames
        focusCloseButton();
 
        window.requestAnimationFrame(function () {
            if ($header.hasClass('menu-open')) {
                focusCloseButton();
            }
        });
 
        setTimeout(function () {
            if ($header.hasClass('menu-open')) {
                focusCloseButton();
            }
        }, 10);
 
        setTimeout(function () {
            if ($header.hasClass('menu-open')) {
                focusCloseButton();
            }
        }, 50);
 
        setTimeout(function () {
            if ($header.hasClass('menu-open')) {
                focusCloseButton();
            }
        }, 150);
    }
 
    function closeMenu(returnFocus) {
        if (!$header.hasClass('menu-open')) {
            return;
        }
 
        if (returnFocus === undefined) {
            returnFocus = true;
        }
 
        $header.removeClass('menu-open');
        $menuToggle.attr('aria-expanded', 'false');
        $mobileNavigation.find('.menu-close').removeClass('has-focus');
 
        // 1. Re-enable background content BEFORE moving focus
        setBackgroundInert(false);
 
        // 2. Return focus to menu toggle before making panel inert
        if (returnFocus && $menuToggle.length && $menuToggle.is(':visible')) {
            var toggleBtn = $menuToggle.get(0);
            if (toggleBtn) {
                try {
                    toggleBtn.focus({ preventScroll: true });
                } catch (e) {
                    toggleBtn.focus();
                }
                setTimeout(function () {
                    if (toggleBtn && document.activeElement !== toggleBtn && !$header.hasClass('menu-open')) {
                        try {
                            toggleBtn.focus({ preventScroll: true });
                        } catch (e) {}
                    }
                }, 10);
                setTimeout(function () {
                    if (toggleBtn && document.activeElement !== toggleBtn && !$header.hasClass('menu-open')) {
                        try {
                            toggleBtn.focus({ preventScroll: true });
                        } catch (e) {}
                    }
                }, 50);
            }
        }
 
        // 3. Make mobile navigation panel inert & hidden
        setPanelInert(true);
    }
 
    // Toggle menu
    $menuToggle.on('click', function (event) {
        event.preventDefault();
        if ($header.hasClass('menu-open')) {
            closeMenu(true);
        } else {
            openMenu();
        }
    });
 
    // Close button
    $mobileNavigation.find('.menu-close').on('click', function (event) {
        event.preventDefault();
        closeMenu(true);
    });
 
    // Overlay click
    $('.overlay').on('click', function () {
        closeMenu(true);
    });
 
    // Mobile navigation link click
    $mobileNavigation.find('a').on('click', function () {
        closeMenu(false);
    });
 
    // Outside click
    $(document).on('click', function (event) {
        if (
            $header.hasClass('menu-open') &&
            !$(event.target).closest('.site-header').length
        ) {
            closeMenu(true);
        }
    });
 
    // Native dialog cancel event (e.g. Escape key on <dialog>)
    $mobileNavigation.on('cancel', function (event) {
        event.preventDefault();
        closeMenu(true);
    });
 
    // Keyboard navigation: Escape to dismiss & Tab focus trap
    $(document).on('keydown', function (event) {
        if (!$header.hasClass('menu-open')) {
            return;
        }
 
        // Escape closes menu
        if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {
            event.preventDefault();
            closeMenu(true);
            return;
        }
 
        // Tab focus trap inside panel
        if (event.key === 'Tab' || event.keyCode === 9) {
            var focusable = getFocusableElements();
            if (!focusable.length) {
                event.preventDefault();
                var closeBtn = $mobileNavigation.find('.menu-close').get(0);
                if (closeBtn) {
                    closeBtn.focus({ preventScroll: true });
                }
                return;
            }
 
            var firstEl = focusable[0];
            var lastEl = focusable[focusable.length - 1];
            var active = document.activeElement;
 
            // If focus is outside panel, pull it in
            if (!$.contains(mobileNav, active) && active !== mobileNav) {
                event.preventDefault();
                (event.shiftKey ? lastEl : firstEl).focus({ preventScroll: true });
                return;
            }
 
            if (event.shiftKey && (active === firstEl || active === mobileNav)) {
                // Shift+Tab on first element wraps to last element
                event.preventDefault();
                lastEl.focus({ preventScroll: true });
            } else if (!event.shiftKey && (active === lastEl || active === mobileNav)) {
                // Tab on last element wraps to first element
                event.preventDefault();
                firstEl.focus({ preventScroll: true });
            }
        }
    });
 
    // Safety net: if focus lands outside while open, restore to close button
    $(document).on('focusin', function (event) {
        if (
            $header.hasClass('menu-open') &&
            !$.contains(mobileNav, event.target) &&
            event.target !== mobileNav
        ) {
            focusCloseButton();
        }
    });
 
    // Remove focus highlight class on blur
    $mobileNavigation.find('.menu-close').on('blur', function () {
        $(this).removeClass('has-focus');
    });
 
    // Reset on desktop resize
    $(window).on('resize', function () {
        if (window.innerWidth > 991 && $header.hasClass('menu-open')) {
            closeMenu(false);
        }
    });
 
    // Initial state: closed menu is inert and aria-hidden
    setPanelInert(true);
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
 


// Sticky Contact Form JS 
(function (window, document) {
    'use strict';

    var MQ = '(min-width: 1024px)';
    var TOP_GAP = 24;
    var BOTTOM_GAP = 0; // Bottom ki extra space hatane ke liye 0 kiya gaya hai
    var END_CLASS = 'sticky-contact-end';
    var HEADER_MOTION_MS = 350;

    function initStickyContactForm(form) {
        if (!form || form.getAttribute('data-sticky-contact-init') === 'true') {
            return;
        }

        form.setAttribute('data-sticky-contact-init', 'true');

        var footer = document.querySelector('.site-footer');
        var header = document.querySelector('.site-header');
        var media = window.matchMedia(MQ);
        var slot = document.createElement('div');
        slot.className = 'sticky-contact-form-slot';
        slot.setAttribute('aria-hidden', 'true');
        form.parentNode.insertBefore(slot, form);

        var metrics = {
            top: 0,
            left: 0,
            width: 0,
            height: 0
        };
        var ticking = false;
        var headerMotionUntil = 0;
        var headerMotionRaf = 0;
        var lenisBound = false;

        function clearPinned() {
            form.classList.remove('is-sticky-fixed', 'is-sticky-bottom', 'has-scroll-bg');
            form.style.position = '';
            form.style.top = '';
            form.style.left = '';
            form.style.width = '';
            form.style.marginLeft = '';
            form.style.maxHeight = '';
            slot.style.display = '';
            slot.style.height = '';
            slot.style.width = '';
        }

        function headerOffset() {
            if (!header) {
                header = document.querySelector('.site-header');
            }
            if (!header) {
                return TOP_GAP;
            }

            if (
                header.classList.contains('header-hidden') &&
                performance.now() >= headerMotionUntil
            ) {
                return TOP_GAP;
            }

            var bottom = Math.ceil(header.getBoundingClientRect().bottom);
            if (bottom <= 0) {
                return TOP_GAP;
            }

            return bottom + 12;
        }

        function boundaryStopY(el, formHeight, scrollY, useBottom, gap) {
            if (!el) {
                return Number.POSITIVE_INFINITY;
            }
            var rect = el.getBoundingClientRect();
            var edgeY = useBottom
                ? rect.bottom + scrollY
                : rect.top + scrollY;
            return edgeY - formHeight - gap;
        }

        function resolveStopY(formHeight, scrollY, startY) {
            var stopY = Number.POSITIVE_INFINITY;
            var customSel = form.getAttribute('data-sticky-end');

            if (customSel) {
                try {
                    var customEl = document.querySelector(customSel);
                    var candidate = boundaryStopY(
                        customEl,
                        formHeight,
                        scrollY,
                        true,
                        BOTTOM_GAP
                    );
                    if (candidate > startY) {
                        stopY = Math.min(stopY, candidate);
                    }
                } catch (err) {
                    // Invalid selector
                }
            }

            var endNodes = document.querySelectorAll('.' + END_CLASS);
            for (var i = 0; i < endNodes.length; i++) {
                var candidateEnd = boundaryStopY(
                    endNodes[i],
                    formHeight,
                    scrollY,
                    true,
                    BOTTOM_GAP
                );
                if (candidateEnd > startY) {
                    stopY = Math.min(stopY, candidateEnd);
                }
            }

            // Footer ke upar thoda gap (TOP_GAP) banaye rakhega
            var candidateFooter = boundaryStopY(
                footer,
                formHeight,
                scrollY,
                false,
                TOP_GAP
            );
            if (candidateFooter > startY) {
                stopY = Math.min(stopY, candidateFooter);
            }

            return stopY;
        }

        function measure() {
            clearPinned();
            if (!media.matches) {
                return;
            }

            var rect = form.getBoundingClientRect();
            metrics.top = rect.top + window.pageYOffset;
            metrics.left = rect.left + window.pageXOffset;
            metrics.width = rect.width;
            metrics.height = rect.height;
        }

        function update() {
            if (!media.matches) {
                clearPinned();
                return;
            }

            var scrollY = window.pageYOffset;
            if (
                window.iquantiLenis &&
                typeof window.iquantiLenis.scroll === 'number'
            ) {
                scrollY = Math.max(0, window.iquantiLenis.scroll);
            }

            var topOffset = headerOffset();
            var heroSection = form.closest('.iq-split-hero-section, .iq-contact-section');
            var nextSection = document.querySelector('.iq-contact-content-section') || (heroSection ? heroSection.nextElementSibling : null);
            var inNextSection = false;

            if (nextSection) {
                var nextRect = nextSection.getBoundingClientRect();
                if (nextRect.top <= topOffset + 60) {
                    inNextSection = true;
                }
            } else if (heroSection) {
                var heroRect = heroSection.getBoundingClientRect();
                if (heroRect.bottom <= topOffset + (metrics.height / 2)) {
                    inNextSection = true;
                }
            }

            var pad = 20;
            var padX = inNextSection ? pad : 0;

            if (inNextSection) {
                form.classList.add('has-scroll-bg');
            } else {
                form.classList.remove('has-scroll-bg');
            }

            var start = metrics.top - topOffset;

            if (scrollY < start) {
                clearPinned();
                return;
            }

            slot.style.display = 'block';
            slot.style.height = metrics.height + 'px';
            slot.style.width = metrics.width + 'px';

            form.classList.add('is-sticky-fixed');
            form.style.position = 'fixed';
            form.style.left = (metrics.left - padX) + 'px';
            form.style.width = (metrics.width + (padX * 2)) + 'px';
            form.style.marginLeft = '0';
            form.style.maxHeight =
                'calc(100vh - ' + (topOffset + TOP_GAP) + 'px)';

            // has-scroll-bg lagne ke baad actual rendered height measure karein
            var formHeight = form.getBoundingClientRect().height || metrics.height;
            var stopY = resolveStopY(formHeight, scrollY, start);

            if (scrollY + topOffset >= stopY) {
                form.classList.add('is-sticky-bottom');
                form.style.top = (stopY - scrollY) + 'px';
            } else {
                form.classList.remove('is-sticky-bottom');
                form.style.top = topOffset + 'px';
            }
        }

        function requestUpdate() {
            if (ticking) {
                return;
            }
            ticking = true;
            window.requestAnimationFrame(function () {
                ticking = false;
                update();
            });
        }

        function followHeaderMotion() {
            headerMotionUntil = performance.now() + HEADER_MOTION_MS;
            if (headerMotionRaf) {
                return;
            }

            function tick() {
                update();
                if (performance.now() < headerMotionUntil) {
                    headerMotionRaf = window.requestAnimationFrame(tick);
                } else {
                    headerMotionRaf = 0;
                    update();
                }
            }

            headerMotionRaf = window.requestAnimationFrame(tick);
        }

        function onResize() {
            measure();
            update();
        }

        function onHeaderClassChange() {
            followHeaderMotion();
        }

        function bindLenisScroll() {
            if (
                lenisBound ||
                !window.iquantiLenis ||
                typeof window.iquantiLenis.on !== 'function'
            ) {
                return !!lenisBound;
            }
            window.iquantiLenis.on('scroll', requestUpdate);
            lenisBound = true;
            return true;
        }

        function watchLenis() {
            if (bindLenisScroll()) {
                return;
            }

            document.addEventListener('iquanti:lenisready', function onReady() {
                document.removeEventListener('iquanti:lenisready', onReady);
                bindLenisScroll();
            });
        }

        measure();
        update();
        watchLenis();

        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', onResize);
        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', onResize);
        } else if (typeof media.addListener === 'function') {
            media.addListener(onResize);
        }

        if (header && typeof window.MutationObserver === 'function') {
            var observer = new window.MutationObserver(onHeaderClassChange);
            observer.observe(header, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    function boot() {
        var forms = document.querySelectorAll('.sticky-contact-form');
        for (var i = 0; i < forms.length; i++) {
            initStickyContactForm(forms[i]);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})(window, document);


