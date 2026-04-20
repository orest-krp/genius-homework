class Carousel {
    constructor() {
        this.carousel = document.querySelector('.procedures__carousel');
        this.track = this.carousel.querySelector('.carousel__track');
        this.nextBtn = this.carousel.querySelector('.procedures__carousel-btn.next');
        this.prevBtn = this.carousel.querySelector('.procedures__carousel-btn.prev');
        this.dotsContainer = this.carousel.querySelector('.carousel__dots');

        this.isAnimating = false;
        this.currentIndex = 0;
        this.slideWidth = 0;

        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.isDragging = false;

        this.init();
    }

    init() {
        this.originalSlidesCount = this.track.children.length;

        this.cloneSlides();
        this.updateWidth();
        this.createDots();

        this.currentIndex = this.originalSlidesCount;
        this.setPosition();

        this.bindEvents();
    }

    cloneSlides() {
        const slides = Array.from(this.track.children);

        slides.forEach(slide => {
            this.track.appendChild(slide.cloneNode(true));
        });

        slides.slice().reverse().forEach(slide => {
            this.track.insertBefore(slide.cloneNode(true), this.track.firstChild);
        });
    }

    updateWidth() {
        const slide = this.track.children[0];
        const gap = parseFloat(getComputedStyle(this.track).gap) || 0;

        this.slideWidth = slide.getBoundingClientRect().width + gap;
    }

    setPosition() {
        this.track.style.transition = 'none';
        this.track.style.transform = `translateX(-${this.slideWidth * this.currentIndex}px)`;
    }

    bindEvents() {
        this.nextBtn.addEventListener('click', () => this.next());
        this.prevBtn.addEventListener('click', () => this.prev());

        window.addEventListener('resize', () => this.onResize());

        this.track.addEventListener('mousedown', this.touchStart.bind(this));
        this.track.addEventListener('mousemove', this.touchMove.bind(this));
        this.track.addEventListener('mouseup', this.touchEnd.bind(this));
        this.track.addEventListener('mouseleave', this.touchEnd.bind(this));

        this.track.addEventListener('touchstart', this.touchStart.bind(this), { passive: true });
        this.track.addEventListener('touchmove', this.touchMove.bind(this), { passive: true });
        this.track.addEventListener('touchend', this.touchEnd.bind(this));
    }

    next() {
        this.moveTo(this.currentIndex + 1);
    }

    prev() {
        this.moveTo(this.currentIndex - 1);
    }

    moveTo(index) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.currentIndex = index;

        this.track.style.transition = 'transform 0.4s ease';
        this.track.style.transform = `translateX(-${this.slideWidth * this.currentIndex}px)`;

        const onEnd = () => {
            this.resetPositionIfNeeded();
            this.updateDots();
            this.isAnimating = false;
        };

        this.track.addEventListener('transitionend', onEnd, { once: true });
    }

    resetPositionIfNeeded() {
        const total = this.track.children.length;
        const original = this.originalSlidesCount;

        const firstRealIndex = original;
        const lastRealIndex = original * 2 - 1;

        if (this.currentIndex >= total - original) {
            this.currentIndex = firstRealIndex;
            this.setPosition();
            return;
        }

        if (this.currentIndex < original) {
            this.currentIndex = lastRealIndex;
            this.setPosition();
            return;
        }
    }

    createDots() {
        this.dots = [];

        for (let i = 0; i < this.originalSlidesCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel__dot');

            dot.addEventListener('click', () => {
                this.goTo(i);
            });

            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        }

        this.updateDots();
    }

    goTo(index) {
        this.moveTo(index + this.originalSlidesCount);
    }

    updateDots() {
        const realIndex =
            (this.currentIndex - this.originalSlidesCount + this.originalSlidesCount) %
            this.originalSlidesCount;

        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === realIndex);
        });
    }

    onResize() {
        this.updateWidth();
        this.setPosition();
    }

    touchStart(e) {
        this.isDragging = true;
        this.startX = this.getX(e);
        this.prevTranslate = -this.slideWidth * this.currentIndex;
        this.track.style.transition = 'none';
    }

    touchMove(e) {
        if (!this.isDragging) return;

        const currentX = this.getX(e);
        const diff = currentX - this.startX;

        this.currentTranslate = this.prevTranslate + diff;
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    touchEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;
        const movedBy = this.currentTranslate - this.prevTranslate;

        if (movedBy < -50) this.next();
        else if (movedBy > 50) this.prev();
        else this.setPosition();
    }

    getX(e) {
        return e.type.includes('mouse')
            ? e.pageX
            : e.touches[0].clientX;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});