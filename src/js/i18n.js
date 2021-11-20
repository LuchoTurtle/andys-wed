import domI18n from 'dom-i18n/dist/dom-i18n.min';

const KEY = "lng";

export default class I18N {
    constructor() {
        this.i18n = domI18n({
            selector: '[data-translatable]',
            separator: ' // ',
            languages: ['en', 'pt'],
            defaultLanguage: 'en',
            currentLanguage: this._getCurrentLanguage()
        });
    }

    /**
     * Gets the current language on local storage. If nothing is null, it defaults to 'en'
     * @returns {string} returns current languange on local storage.
     * @private
     */
    _getCurrentLanguage() {
        const ls_lang = localStorage.getItem(KEY);
        return !ls_lang ? 'en' : ls_lang
    }

    /**
     * Changes language of [data-translatable] HTML elements.
     * @param language language to change.
     */
    setLanguage(language) {
        this.i18n.changeLanguage(language);
        localStorage.setItem(KEY, language)
    }

}
