Barba.Pjax.start();
var transitionAnimation = Barba.BaseTransition.extend({
    start: function () {
        /**
         * This function is automatically called as soon the Transition starts
         * this.newContainerLoading is a Promise for the loading of the new container
         * (Barba.js also comes with an handy Promise polyfill!)
         */

        // As soon the loading is finished and the old page is faded out, let's fade the new page
        Promise
            .all([this.newContainerLoading, this.startTransition()])
            .then(this.fadeIn.bind(this));
    },

    startTransition: function () {
        var transitionPromise = new Promise(function (resolve) {
            var outTransition = new TimelineMax();
            outTransition
                .to('.new-slider-container', 0, {y: -50, autoAlpha: 0})
                .set('.color-wipe', {display: "block", y: "100%"})
                .staggerFromTo('.color-wipe', .3, {y: "100%"}, {y: "-100%", ease: Expo.easeOut}, 0.1)
                .staggerFromTo('.color-wipe', 0.3, {y: "-100%"}, {
                    y: "-200%", ease: Expo.easeOut, onComplete: function () {
                        resolve()
                    }
                }, 0.1)
                .set('.color-wipe', {display: "none"})
        })
        return transitionPromise
    },

    fadeIn: function () {
        /**
         * this.newContainer is the HTMLElement of the new Container
         * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
         * Please note, newContainer is available just after newContainerLoading is resolved!
         */
        if(document.title.indexOf('Home') != -1) {
            // console.log(window.location.pathname.indexOf('index.html'))
            // console.log('Rendering now...')
            render()
        }
        var _this = this;
        var $el = $(this.newContainer);

        TweenMax.set($(this.oldContainer), {display: "none"})
        TweenMax.fromTo('.new-slider-container', 1.5, {autoAlpha: 0, y: 30}, {y: 0, autoAlpha: 1})
        TweenMax.to($el, 0.1, {
            opacity: 1, onComplete: function () {
                _this.done()
            }
        })

    }
});

/**
 * Next step, you have to tell Barba to use the new Transition
 */

Barba.Pjax.getTransition = function () {
    /**
     * Here you can use your own logic!
     * For example you can use different Transition based on the current page or link...
     */

    return transitionAnimation;
};


function render() {

    var slidersContainer = document.querySelector('.sliders-container');

    // Initializing the numbers slider
    var msNumbers = new MomentumSlider({
        el: slidersContainer,
        cssClass: 'ms--numbers',
        range: [1, 4],
        rangeContent: function (i) {
            return '0' + i;
        },
        style: {
            transform: [{scale: [0.4, 1]}],
            opacity: [0, 1]
        },
        interactive: false
    });

    // Initializing the titles slider
    var titles = [
        'Abhishek Bhaskar',
        'Murray Mulhoy',
        'Mentalist Kannan R',
        'Anne Amie'
    ];
    var pages = [
        '1.html',
        '2.html',
        '3.html',
        '4.html'
    ];
    var msTitles = new MomentumSlider({
        el: slidersContainer,
        cssClass: 'ms--titles',
        range: [0, 3],
        rangeContent: function (i) {
            return '<h3>' + titles[i] + '</h3>';
        },
        vertical: true,
        reverse: true,
        style: {
            opacity: [0, 1]
        },
        interactive: false
    });

    // Initializing the links slider
    var msLinks = new MomentumSlider({
        el: slidersContainer,
        cssClass: 'ms--links',
        range: [0, 3],
        rangeContent: function (i) {
            return '<a href="' + pages[i] + '" class="ms-slide__link">Show Details</a>';
        },
        vertical: true,
        interactive: false
    });

    // Get pagination items
    var pagination = document.querySelector('.pagination');
    var paginationItems = [].slice.call(pagination.children);

    // Initializing the images slider
    var msImages = new MomentumSlider({
        // Element to append the slider
        el: slidersContainer,
        // CSS class to reference the slider
        cssClass: 'ms--images',
        // Generate the 4 slides required
        range: [0, 3],
        rangeContent: function () {
            return '<div class="ms-slide__image-container"><div class="ms-slide__image"></div></div>';
        },
        // Syncronize the other sliders
        sync: [msNumbers, msTitles, msLinks],
        // Styles to interpolate as we move the slider
        style: {
            '.ms-slide__image': {
                transform: [{scale: [1.5, 1]}]
            }
        },
        // Update pagination if slider change
        change: function (newIndex, oldIndex) {
            if (typeof oldIndex !== 'undefined') {
                paginationItems[oldIndex].classList.remove('pagination__item--active');
            }
            paginationItems[newIndex].classList.add('pagination__item--active');
        }
    });

    // Select corresponding slider item when a pagination button is clicked
    pagination.addEventListener('click', function (e) {
        if (e.target.matches('.pagination__button')) {
            var index = paginationItems.indexOf(e.target.parentNode);
            msImages.select(index);
        }
    });

};
