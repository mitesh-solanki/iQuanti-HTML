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

    // Close menu function
    function closeMenu() {
        $header.removeClass('menu-open');

        $mobileNavigation
            .stop(true, true)
            .slideUp(250);

        $menuToggle.attr('aria-expanded', 'false');
    }


    // Open / Close menu
    $menuToggle.on('click', function () {

        if ($header.hasClass('menu-open')) {
            closeMenu();
        } else {

            $header.addClass('menu-open');

            $mobileNavigation
                .stop(true, true)
                .slideDown(250);

            $menuToggle.attr('aria-expanded', 'true');
        }

    });


    // Close menu when mobile link is clicked
    $mobileNavigation.find('a').on('click', function () {
        closeMenu();
    });


    // Close menu when .menu-close or .overlay is clicked
    $('.menu-close, .overlay').on('click', function () {
        closeMenu();
    });


    // Close menu when clicking outside header
    $(document).on('click', function (event) {

        if (
            $header.hasClass('menu-open') &&
            !$(event.target).closest('.site-header').length
        ) {
            closeMenu();
        }

    });


    // Reset menu on desktop
    $(window).on('resize', function () {

        if (window.innerWidth > 991) {

            $header.removeClass('menu-open');

            $mobileNavigation
                .stop(true, true)
                .removeAttr('style')
                .hide();

            $menuToggle.attr('aria-expanded', 'false');
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
 
