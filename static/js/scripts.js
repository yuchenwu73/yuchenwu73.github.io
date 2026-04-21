const contentDir = '/contents/';
const defaultLanguage = 'en';
const supportedLanguages = ['en', 'zh'];
const sectionNames = ['home', 'preprints', 'publications', 'projects', 'competitions', 'awards'];

let currentLanguage = getInitialLanguage();

function getInitialLanguage() {
    return window.location.pathname.replace(/\/$/, '').endsWith('/zh') ? 'zh' : defaultLanguage;
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

function ensureBibtexModal() {
    let modal = document.getElementById('bibtex-modal');
    if (modal) {
        return modal;
    }

    modal = document.createElement('div');
    modal.id = 'bibtex-modal';
    modal.className = 'bibtex-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="bibtex-modal-backdrop" data-bibtex-close="true"></div>
        <div class="bibtex-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="bibtex-modal-title">
            <div class="bibtex-modal-header">
                <h3 id="bibtex-modal-title">BibTeX</h3>
                <button type="button" class="bibtex-modal-close" data-bibtex-close="true" aria-label="Close">&times;</button>
            </div>
            <pre id="bibtex-modal-content" class="bibtex-modal-content"></pre>
            <div class="bibtex-modal-actions">
                <button type="button" id="bibtex-copy-button" class="bibtex-copy-button">Copy</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
    return modal;
}

function getBibtexContent(sourceElement) {
    if (!sourceElement) {
        return '';
    }

    if (sourceElement.tagName === 'TEMPLATE') {
        return sourceElement.innerHTML.trim();
    }

    return sourceElement.textContent.trim();
}

function openBibtexModal(templateId, title) {
    const sourceElement = document.getElementById(templateId);
    if (!sourceElement) {
        return;
    }

    const modal = ensureBibtexModal();
    const titleElement = document.getElementById('bibtex-modal-title');
    const contentElement = document.getElementById('bibtex-modal-content');
    const copyButton = document.getElementById('bibtex-copy-button');

    titleElement.textContent = 'BibTeX';
    contentElement.textContent = getBibtexContent(sourceElement);
    copyButton.textContent = currentLanguage === 'zh' ? '复制' : 'Copy';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
}

function closeBibtexModal() {
    const modal = document.getElementById('bibtex-modal');
    if (!modal) {
        return;
    }
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
}

function copyBibtex() {
    const contentElement = document.getElementById('bibtex-modal-content');
    const copyButton = document.getElementById('bibtex-copy-button');
    const text = contentElement ? contentElement.textContent : '';

    const markCopied = () => {
        copyButton.textContent = currentLanguage === 'zh' ? '已复制' : 'Copied';
        window.setTimeout(() => {
            copyButton.textContent = currentLanguage === 'zh' ? '复制' : 'Copy';
        }, 1400);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(markCopied).catch(() => fallbackCopy(text, markCopied));
    } else {
        fallbackCopy(text, markCopied);
    }
}

function fallbackCopy(text, callback) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    callback();
}

function setupBibtexModalEvents() {
    document.addEventListener('click', event => {
        const bibtexButton = event.target.closest('.bibtex-button');
        if (bibtexButton) {
            openBibtexModal(bibtexButton.dataset.bibtexId, bibtexButton.dataset.bibtexTitle);
            return;
        }

        if (event.target.closest('[data-bibtex-close="true"]')) {
            closeBibtexModal();
            return;
        }

        if (event.target.closest('#bibtex-copy-button')) {
            copyBibtex();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeBibtexModal();
        }
    });
}

function switchLanguage() {
    const hash = window.location.hash || '';
    window.location.href = currentLanguage === 'en' ? `/zh/${hash}` : `/${hash}`;
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

    setupBibtexModalEvents();

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
