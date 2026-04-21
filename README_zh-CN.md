# 吴宇辰的个人主页

[English](README.md) | [简体中文](README_zh-CN.md)

![Last Commit](https://img.shields.io/github/last-commit/yuchenwu73/yuchenwu73.github.io)
![License](https://img.shields.io/github/license/yuchenwu73/yuchenwu73.github.io)

## 关于

这是我的个人学术主页的源代码，托管在[https://yuchenwu73.github.io](https://yuchenwu73.github.io)。

## 特性

- **基于Markdown的内容**：所有内容部分都使用Markdown文件编写，便于编辑
- **LaTeX支持**：可以使用LaTeX语法和MathJax编写数学公式
- **响应式设计**：基于Bootstrap的移动端友好布局
- **自动更新**：最后更新日期自动生成

## 项目结构

```
.
├── contents/              # 内容文件
│   ├── config.yml        # 网站配置
│   ├── home.md           # 主页部分
│   ├── publications.md   # 发表论文部分
│   ├── projects.md       # 项目部分
│   ├── competitions.md   # 精选竞赛
│   └── awards.md         # 精选奖项
├── static/
│   ├── assets/           # 图片和其他资源
│   ├── css/             # 样式表
│   └── js/              # JavaScript文件
├── paper/               # 论文PDF文件
└── index.html           # 主HTML文件
```

## 本地开发

在本地查看网站：

1. 克隆此仓库
2. 在浏览器中打开`index.html`，或
3. 使用本地服务器（推荐）：
   ```bash
   python -m http.server 8000
   ```
   然后访问`http://localhost:8000`

## 更新内容

- **个人信息**：编辑`contents/config.yml`
- **各部分内容**：编辑`contents/`文件夹中对应的`.md`文件
- **图片**：替换`static/assets/`中的文件
- **发表论文**：更新`contents/publications.md`并将PDF文件添加到`paper/`文件夹

## 许可证

本项目采用MIT许可证，详见[LICENSE](LICENSE)文件。

## 致谢

本网站基于以下优秀项目和个人的工作构建：

- **原始模板**：[Sen Li的学术主页模板](https://github.com/senli1073/senli1073.github.io) - 一个简洁优雅的支持Markdown的学术个人网站模板
- **Bootstrap主题**：[Start Bootstrap - New Age](https://github.com/StartBootstrap/startbootstrap-new-age) - 底层Bootstrap主题
- **特别感谢**：感谢Sen Li创建并分享了原始模板，使本网站得以实现

