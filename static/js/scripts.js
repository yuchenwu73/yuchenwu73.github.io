const content_dir = 'contents/'
const config_file = 'config.yml'
// 不包括publications
const section_names = ['home', 'competitions', 'awards', 'projects'];

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }
            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })

    // 先加载除了publications之外的部分
    Promise.all(
        section_names.map(name =>
            fetch(content_dir + name + '.md')
                .then(response => response.text())
                .then(markdown => {
                    const html = marked.parse(markdown);
                    document.getElementById(name + '-md').innerHTML = html;
                })
        )
    ).then(() => {
        // 所有其他部分加载完成后，再加载publications
        return fetch(content_dir + 'publications.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById('publications-md').innerHTML = html;
            });
    }).then(() => {
        // 所有内容加载完成后处理MathJax
        MathJax.typeset();
    }).catch(error => console.log(error));

    // 设置最后更新时间 - 从GitHub API获取最后一次提交时间
    fetch('https://api.github.com/repos/yuchenwu73/yuchenwu73.github.io/commits/main')
        .then(response => response.json())
        .then(data => {
            const commitDate = new Date(data.commit.author.date);
            const lastUpdated = commitDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            });
            document.getElementById('last-updated').textContent = lastUpdated;
        })
        .catch(error => {
            console.log('Error fetching last commit date:', error);
            // 如果API调用失败，显示当前年月作为后备
            const fallbackDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            });
            document.getElementById('last-updated').textContent = fallbackDate;
        });

});

// 加载markdown文件
function loadMarkdown(id, file) {
    fetch(`contents/${file}`)
        .then(response => response.text())
        .then(text => {
            // 对于publications部分，直接使用HTML内容
            if (file === 'publications.md') {
                document.getElementById(id).innerHTML = text;
                // 触发MathJax重新渲染
                if (typeof MathJax !== 'undefined') {
                    MathJax.typesetPromise && MathJax.typesetPromise();
                }
            } else {
                // 其他markdown文件正常处理
                document.getElementById(id).innerHTML = marked.parse(text);
                // 触发MathJax重新渲染
                if (typeof MathJax !== 'undefined') {
                    MathJax.typesetPromise && MathJax.typesetPromise();
                }
            }
        });
}
