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