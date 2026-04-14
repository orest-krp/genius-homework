const SCREEN_MD = 768;


class MobileMenu {
    constructor() {
        this.burger = document.querySelector('.header__burger');
        this.overlay = document.querySelector('.header__mobile-overlay');
        this.mobileMenu = document.querySelector('.header__mobile');
        this.logo = document.querySelector('.header__logo');
        this.isOpen = false;

        this.init();
    }

    init() {
        this.burger.addEventListener('click', () => this.toggleMenu());

        this.logo.addEventListener('click', () => this.closeMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        const mobileMenuItems = this.mobileMenu.querySelectorAll('.header__mobile__menu-link');
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', () => this.closeMenu());
        });

        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        if (window.innerWidth >= SCREEN_MD && this.isOpen) {
            this.closeMenu();
        }
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.burger.classList.add('header__burger--active');
        this.overlay.classList.add('header__mobile-overlay--active');
        this.mobileMenu.classList.add('header__mobile--active');
        document.body.classList.add('body--no-scroll');
        this.isOpen = true;
    }

    closeMenu() {
        this.burger.classList.remove('header__burger--active');
        this.overlay.classList.remove('header__mobile-overlay--active');
        this.mobileMenu.classList.remove('header__mobile--active');
        document.body.classList.remove('body--no-scroll');
        this.isOpen = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
});