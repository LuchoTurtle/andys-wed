import domI18n from 'dom-i18n/dist/dom-i18n.min';

export default domI18n({
    selector: '[data-translatable]',
    separator: ' // ',
    languages: ['en', 'pt'],
    defaultLanguage: 'en',
    currentLanguage: 'en'
});

