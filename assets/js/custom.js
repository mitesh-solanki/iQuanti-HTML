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
