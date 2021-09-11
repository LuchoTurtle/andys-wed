import {gsap} from 'gsap';

export default class GalleryItem {
    constructor(el) {
        this.el = {el: el};
        this.el.img = this.el.el.querySelector('.gallery__item-img');
        this.el.imgInner = this.el.img.querySelector('.gallery__item-imginner');
        this.el.caption = {
            title: this.el.el.querySelector('.gallery__item-title'),
            number: this.el.el.querySelector('.gallery__item-header'),
            texts: this.el.el.querySelectorAll('.gallery__item-text')
        };
        this.el.captionChars = this.el.caption.title.querySelectorAll('span');
        this.captionCharsTotal = this.el.captionChars.length;
        this.addEventListeners();
    }

    addEventListeners() {
        // On hover, scale in/out the image and inner image elements and also the caption titles
        this.mouseEnter = () => {
            gsap
                .timeline({defaults: {duration: 1, ease: 'expo'}})
                .to(this.el.img, {scale: 0.95})
                .to(this.el.captionChars, {
                    x: pos => -10 * (Math.floor(this.captionCharsTotal / 2) - pos),
                    stagger: {from: 'center'}
                }, 0);
        };

        this.mouseLeave = () => {
            gsap
                .timeline({defaults: {duration: 1, ease: 'expo'}})
                .to(this.el.img, {scale: 1})
                .to(this.el.captionChars, {x: 0}, 0);
        };

        this.el.img.addEventListener('mouseenter', this.mouseEnter);
        this.el.img.addEventListener('mouseleave', this.mouseLeave);
    }
}
