# 帮助教程

访问帮助：[NotionNext帮助手册](https://docs.tangly1024.com/)

> 本项目教程为免费、公开资源，仅限个人学习使用，禁止利用本教程建立的博客发布非法内容、进行违法犯罪活动。严禁任何个人或组织将本教程用于商业用途，包括但不限于直接售卖、间接收费、或其他变相盈利行为。转载、复制或介绍本教程内容时，须保留作者信息并明确注明来源。
> 本项目仅提供由作者团队授权的付费咨询服务，请注意辨别，谨防诈骗行为。任何未经授权的收费服务均可能存在法律风险。

Notion是一个能让效率暴涨的生产力引擎，可以帮你书写文档、管理笔记，搭建知识库，甚至可以为你规划项目、时间管理、组织团队、提高生产力、还有当前最强大的AI技术加持。

> 若希望进一步探索Notion的功能，欢迎购买《[Notion笔记从入门到精通进阶课程](https://docs.tangly1024.com/article/notion-tutorial)》

> 若希望获得稳定、高速、不限设备数量的VPN科学上网服务，欢迎使用[飞鸟VPN](https://fbinv02.fbaff.cc/auth/register?code=kaA7t4kh)，这是我目前在用的VPN，仅作友情推广

# NotionNext

<p>
  <a aria-label="GitHub commit activity" href="https://github.com/tangly1024/NotionNext/commits/main" title="GitHub commit activity">
    <img src="https://img.shields.io/github/commit-activity/m/tangly1024/NotionNext?style=for-the-badge"/>
  </a>
  <a aria-label="GitHub contributors" href="https://github.com/tangly1024/NotionNext/graphs/contributors" title="GitHub contributors">
    <img src="https://img.shields.io/github/contributors/tangly1024/NotionNext?color=orange&style=for-the-badge"/>
  </a>
  <a aria-label="Build status" href="#" title="Build status">
    <img src="https://img.shields.io/github/deployments/tangly1024/NotionNext/Production?logo=Vercel&style=for-the-badge"/>
  </a>
  <a aria-label="Powered by Vercel" href="https://vercel.com?utm_source=Craigary&utm_campaign=oss" title="Powered by Vercel">
    <img src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg" height="28"/>
  </a>
</p>

中文文档 | [README in English](./README_EN.md)

<hr/>

一个使用 NextJS + Notion API 实现的，部署在 Vercel 上的静态博客系统。为Notion和所有创作者设计。

支持多种部署方案

## Cloudflare Workers 部署（静态导出版）

本项目已支持通过 Cloudflare Workers 的静态资源模式部署（基于 `out/` 目录）。

### 1) 登录 Cloudflare（首次）

```bash
npx wrangler login
```

### 2) 构建静态站点

```bash
npm run cf:build
```

### 3) 部署到 Workers

```bash
npm run cf:deploy
```

### 本地预览（可选）

```bash
npm run cf:dev
```

### 配置说明

- 使用仓库根目录 `wrangler.toml`
- 静态资源目录为 `./out`
- 当前为博客场景，404 处理使用 `not_found_handling = "404-page"`

## 预览效果

在线演示：[https://preview.tangly1024.com/](https://preview.tangly1024.com/)（当前仓库仅保留 heo 主题）。

## 致谢

感谢Craig Hart发起的Nobelium项目

<table><tr align="left">
  <td align="center"><a href="https://github.com/craigary" title="Craig Hart"><img src="https://avatars.githubusercontent.com/u/10571717" width="64px;"alt="Craig Hart"/></a><br/><a href="https://github.com/craigary" title="Craig Hart">Craig Hart</a></td>
</tr></table>

## 贡献者

致敬每一位开发者！

[![Contributors](https://contrib.rocks/image?repo=tangly1024/NotionNext)](https://github.com/tangly1024/NotionNext/graphs/contributors)

## 引用技术

- **框架**: [Next.js](https://nextjs.org)
- **样式**: [Tailwind CSS](https://www.tailwindcss.cn/)
- **渲染**: [React-notion-x](https://github.com/NotionX/react-notion-x)
- **评论**: [Twikoo](https://github.com/imaegoo/twikoo), [Giscus](https://giscus.app/zh-CN), [Gitalk](https://gitalk.github.io), [Cusdis](https://cusdis.com), [Utterances](https://utteranc.es)
- **图标**: [Fontawesome](https://fontawesome.com/v6/icons/)

## 🔗 友情链接

- [Elog](https://github.com/LetTTGACO/elog) Markdown 批量导出工具、开放式跨平台博客解决方案，随意组合写作平台(语雀/Notion/FlowUs/飞书)和博客平台(Hexo/Vitepress/Halo/Confluence/WordPress等)

## License

The MIT License.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=tangly1024/NotionNext&type=Date)](https://star-history.com/#tangly1024/NotionNext&Date)
