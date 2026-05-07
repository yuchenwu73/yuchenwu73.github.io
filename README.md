# Yuchen Wu's Personal Homepage

[English](README.md) | [简体中文](README_zh-CN.md)

![Last Commit](https://img.shields.io/github/last-commit/yuchenwu73/yuchenwu73.github.io)
![License](https://img.shields.io/github/license/yuchenwu73/yuchenwu73.github.io)

## About

This is the source code for my personal academic homepage, hosted at [https://yuchenwu73.github.io](https://yuchenwu73.github.io).

## Features

- **Markdown-based content**: All content sections are written in Markdown files for easy editing
- **LaTeX support**: Mathematical formulas can be written using LaTeX syntax with MathJax
- **Responsive design**: Mobile-friendly layout based on Bootstrap
- **Auto-updated**: Last updated date is automatically fetched from the GitHub REST API (latest commit timestamp), with a static fallback configured in `config.yml`

## Project Structure

```
.
├── contents/              # Content files
│   ├── config.yml        # English site configuration
│   ├── config_zh.yml     # Chinese site configuration
│   ├── home.md           # English home section
│   ├── home_zh.md        # Chinese home section
│   ├── publications.md   # English publications section
│   ├── publications_zh.md# Chinese publications section
│   └── ...               # Other bilingual content sections
├── static/
│   ├── assets/           # Images and other assets
│   ├── css/             # Stylesheets
│   └── js/              # JavaScript files
├── paper/               # PDF files of publications
└── index.html           # Main HTML file
```

## Local Development

To view the website locally:

1. Clone this repository
2. Open `index.html` in a web browser, or
3. Use a local server (recommended):
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## Updating Content

- **Personal information**: Edit `contents/config.yml` and `contents/config_zh.yml`
- **Sections**: Edit corresponding `.md` and `_zh.md` files in `contents/` folder
- **Images**: Replace files in `static/assets/`
- **Publications**: Update `contents/publications.md` and add PDFs to `paper/` folder

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This website is built upon the excellent work of the following projects and individuals:

- **Original Template**: [Sen Li's Academic Homepage Template](https://github.com/senli1073/senli1073.github.io) - A clean and elegant academic personal website template with Markdown support
- **Bootstrap Theme**: [Start Bootstrap - New Age](https://github.com/StartBootstrap/startbootstrap-new-age) - The underlying Bootstrap theme
- **Special Thanks**: Sen Li for creating and sharing the original template that made this website possible
