const SCREEN_MD = 768;


class MobileMenu {
    constructor() {
        this.burger = document.getElementById('burger-button');
        this.overlay = document.getElementById('mobile-overlay');
        this.mobileMenu = document.getElementById('mobile-menu-container');
        this.logo = document.getElementById('main-logo');
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
        this.burger.setAttribute('aria-expanded', 'true');
        this.overlay.classList.add('header__mobile-overlay--active');
        this.mobileMenu.classList.add('header__mobile--active');
        this.mobileMenu.removeAttribute('inert');
        document.body.classList.add('body--no-scroll');
        this.isOpen = true;
    }

    closeMenu() {
        this.burger.classList.remove('header__burger--active');
        this.burger.setAttribute('aria-expanded', 'false');
        this.overlay.classList.remove('header__mobile-overlay--active');
        this.mobileMenu.classList.remove('header__mobile--active');
        this.mobileMenu.setAttribute('inert', true);
        document.body.classList.remove('body--no-scroll');
        this.isOpen = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
});