/* ==========================================================================
   UpRank Premium JS Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. FIXED HEADER TRANSITION */
    const header = document.getElementById('header');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial call in case page is loaded scrolled
    handleScroll();


    /* 2. MOBILE MENU & TOGGLES */
    const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
    const mobileNav = document.getElementById('mobile-nav');
    const body = document.body;

    const toggleMobileMenu = () => {
        mobileMenuTrigger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.classList.toggle('no-scroll'); // Prevents background body scrolling
    };

    mobileMenuTrigger.addEventListener('click', toggleMobileMenu);

    // Close mobile nav when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuTrigger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });

    // Mobile dropdown toggle inside slide-over
    const mobileDropdownHeaders = document.querySelectorAll('.mobile-dropdown-header');
    mobileDropdownHeaders.forEach(dropdownHeader => {
        dropdownHeader.addEventListener('click', () => {
            dropdownHeader.classList.toggle('active');
            const sublist = dropdownHeader.nextElementSibling;
            if (sublist) {
                sublist.classList.toggle('active');
            }
        });
    });


    /* 3. 3D MOUSE PARALLAX TILT EFFECT */
    const parallaxContainer = document.getElementById('parallax-container');
    const heroSection = document.getElementById('hero');

    if (parallaxContainer && heroSection && window.innerWidth > 992) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();

            // Mouse coordinates relative to the hero section bounds
            const xVal = e.clientX - rect.left;
            const yVal = e.clientY - rect.top;

            // Calculate tilt percentages relative to center (ranges between -0.5 and +0.5)
            const xPercent = (xVal / rect.width) - 0.5;
            const yPercent = (yVal / rect.height) - 0.5;

            // Calculate rotations (max 12deg tilt for responsiveness)
            const rotateX = -(yPercent * 18).toFixed(2);
            const rotateY = (xPercent * 18).toFixed(2);

            // Apply 3D matrix-like transformations
            parallaxContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        // Smooth reset on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            parallaxContainer.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
    }


    /* 4. STATS COUNTER ANIMATION */
    const counterNumbers = document.querySelectorAll('.counter-number');

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds animation duration
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            // Easing function: cubic ease-out
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeProgress * target);

            // Special formatting
            if (target >= 1000000) {
                // Leads formatting (e.g. 1.5M represented as number)
                element.textContent = (currentValue / 1000000).toFixed(1) + 'M';
            } else if (target >= 1000) {
                element.textContent = currentValue.toLocaleString();
            } else {
                element.textContent = currentValue;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Make sure we end up exactly on the target label
                if (target >= 1000000) {
                    element.textContent = (target / 1000000).toFixed(1);
                } else {
                    element.textContent = target.toLocaleString();
                }
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Intersection Observer to trigger counter when section is in view
    const observerOptions = {
        root: null,
        threshold: 0.15, // trigger when 15% visible
        once: true
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, observerOptions);

    counterNumbers.forEach(counter => {
        counterObserver.observe(counter);
    });


    /* 5. CONTACT FORM SUBMISSION & SUCCESS OVERLAY */
    const contactForm = document.getElementById('uprank-contact-form');
    const successOverlay = document.getElementById('form-success-overlay');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    if (contactForm && successOverlay) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop standard form submissions

            // Mock submission delay to feel authentic
            const submitBtn = contactForm.querySelector('.btn-submit-form');
            const originalBtnHtml = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Validating Market Exclusivity...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;

            setTimeout(() => {
                // Show custom success screen with high micro-animations
                successOverlay.classList.add('active');

                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }, 1200);
        });

        // Close success screen logic
        closeSuccessBtn.addEventListener('click', () => {
            successOverlay.classList.remove('active');
            contactForm.reset(); // Clear all inputs
        });
    }

    // Scroll to contact form when header/hero CTAs are clicked
    const ctaLinks = document.querySelectorAll('a[href="#contact"]');
    ctaLinks.forEach(cta => {
        cta.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = cta.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Stretches scroll margin for smooth alignments
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* 6. SUCCESS STORIES SLIDER (SLICK SLIDER) */
    const storiesSlider = $('.stories-slider');

    if (storiesSlider.length) {
        storiesSlider.slick({
            dots: false,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 0,
            speed: 5000,
            slidesToShow: 5.5,
            slidesToScroll: 1,
            prevArrow: $('.slick-prev-custom'),
            nextArrow: $('.slick-next-custom'),
            cssEase: 'linear',
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 1200, // laptop
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 992, // tablet
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 576, // mobile
                    settings: {
                        slidesToShow: 1.2,
                        slidesToScroll: 1,
                        infinite: true
                    }
                }
            ]
        });
    }

    /* 8. TABS SWITCHING LOGIC */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Add active class to corresponding pane
            const targetId = button.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    /* 9. BRAND LOGOS SLICK SLIDER */
    $('.slider-right-to-left').slick({
        speed: 5000,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
        slidesToShow: 6,
        slidesToScroll: 1,
        infinite: true,
        swipeToSlide: true,
        centerMode: true,
        focusOnSelect: false,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: { slidesToShow: 5 }
            },
            {
                breakpoint: 900,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 540,
                settings: { slidesToShow: 2 }
            }
        ]
    });

    $('.slider-left-to-right').slick({
        speed: 5000,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
        slidesToShow: 6,
        slidesToScroll: 1,
        infinite: true,
        swipeToSlide: true,
        centerMode: true,
        focusOnSelect: false,
        arrows: false,
        dots: false,
        rtl: true, /* Reverses the scroll direction */
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: { slidesToShow: 5 }
            },
            {
                breakpoint: 900,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 540,
                settings: { slidesToShow: 2 }
            }
        ]
    });

    /* 10. SOCIAL JOURNEY SLIDER */
    $('.social-slider').slick({
        speed: 5000,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
        swipeToSlide: true,
        centerMode: true,
        focusOnSelect: false,
        arrows: false,
        dots: false,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: { slidesToShow: 4 }
            },
            {
                breakpoint: 900,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 2 }
            }
        ]
    });

});

