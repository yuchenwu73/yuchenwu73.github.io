const contentDir = 'contents/';
const defaultLanguage = 'en';
const supportedLanguages = ['en', 'zh'];
const sectionNames = ['home', 'competitions', 'awards', 'projects', 'publications'];

let currentLanguage = getInitialLanguage();

function getInitialLanguage() {
    const savedLanguage = localStorage.getItem('preferred-language');
    return supportedLanguages.includes(savedLanguage) ? savedLanguage : defaultLanguage;
}

function localizedFile(name, extension) {
    return currentLanguage === defaultLanguage
        ? `${name}.${extension}`
        : `${name}_${currentLanguage}.${extension}`;
}

function updateLanguageToggle() {
    const button = document.getElementById('language-toggle');
    if (!button) {
        return;
    }

    const nextLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    button.innerHTML = currentLanguage === 'en' ? '中文' : 'English';
    button.setAttribute('aria-label', `Switch to ${nextLanguage === 'en' ? 'English' : 'Chinese'}`);
}

function applyConfig(config) {
    Object.keys(config).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.innerHTML = config[key];
        } else {
            console.log(`Unknown id and value: ${key},${config[key].toString()}`);
        }
    });
}

function loadConfig() {
    return fetch(contentDir + localizedFile('config', 'yml'))
        .then(response => response.text())
        .then(text => applyConfig(jsyaml.load(text)));
}

function loadSection(name) {
    return fetch(contentDir + localizedFile(name, 'md'))
        .then(response => response.text())
        .then(markdown => {
            document.getElementById(name + '-md').innerHTML = marked.parse(markdown);
        });
}

function typesetMath() {
    if (typeof MathJax !== 'undefined') {
        if (MathJax.typesetPromise) {
            return MathJax.typesetPromise();
        }
        MathJax.typeset();
    }
    return Promise.resolve();
}

function refreshScrollSpy() {
    const scrollSpy = bootstrap.ScrollSpy.getInstance(document.body);
    if (scrollSpy) {
        scrollSpy.refresh();
    }
}

function loadLanguage() {
    document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
    updateLanguageToggle();

    return loadConfig()
        .then(() => Promise.all(sectionNames.map(loadSection)))
        .then(typesetMath)
        .then(refreshScrollSpy)
        .catch(error => console.log(error));
}

function switchLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    localStorage.setItem('preferred-language', currentLanguage);
    loadLanguage();
}

window.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', switchLanguage);
    }

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(responsiveNavItem => {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    marked.use({ mangle: false, headerIds: false });
    loadLanguage();
});
