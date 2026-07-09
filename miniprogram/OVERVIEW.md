# 茶之百科 · 微信小程序 上线说明

把原网站（茶叶分类 / 最佳冲泡温度 / 功效典故）完整转换为微信小程序，功能一一对应。

## 功能对照（网站 → 小程序）

| 网站模块 | 小程序实现 |
| --- | --- |
| Hero + 分类导航 | 首页 Hero + 顶部「全部 / 基础茶类 / 再加工茶」切换 |
| 茶叶卡片（图、温度条、保质期、存放、核心功效标签） | `tea-card` 可复用组件 |
| 全文搜索（茶名/分类/功效） | 首页搜索框，实时过滤 |
| 茶叶详情弹窗（功效/历史/轶事/文献/诗词） | `pages/detail` 详情页 |
| 水温速查表（温度计） | `pages/brewing` 冲泡指南 |
| “名不副实”茶名对照表 | `pages/naming` 识茶名 |
| 页脚《茶经》 | `pages/about` 关于 |

额外增强（利于“获客”）：详情页已接入 `onShareAppMessage`（分享好友）与 `onShareTimeline`（分享朋友圈），首页也支持分享。

## 目录结构

```
miniprogram/
├── app.js / app.json / app.wxss        # 全局配置、暗色东方设计系统
├── project.config.json / sitemap.json  # 开发者工具配置
├── data/
│   ├── teas.js      # 24 款茶（由 index.html + tea-details.js 自动生成）
│   ├── brewing.js   # 6 类水温速查
│   └── naming.js    # 9 条茶名对照
├── components/tea-card/   # 可复用茶叶卡片
├── utils/util.js         # 主题色 / 温度条 / 功效标签
├── images/               # 24 张压缩 JPEG（共 1.15MB）
└── pages/  index / detail / brewing / naming / about
```

## 如何打开与预览

1. 用 **微信开发者工具**（稳定版）打开 `miniprogram/` 目录。
2. 当前 `project.config.json` 的 `appid` 为 `touristappid`（游客模式），可直接编译预览。
3. 正式发布前，把 `appid` 改成你自己的小程序 AppID（公众号平台申请）。

## 发布前 checklist

- [ ] 替换自有 AppID（个人/企业主体均可，内容型小程序需符合类目规范）。
- [ ] 在「小程序后台 → 开发管理 → 服务器域名」无需配置（图片已本地打包，无网络请求）。
- [ ] 隐私协议：本程序不获取手机号/位置等敏感信息，但发布时仍需在后台填写《隐私保护指引》。
- [ ] 提交审核：功能完整、无外部链接、无诱导分享文案即可，预计 1–3 个工作日过审。

## 包体说明

- 主包 **1.5MB**（限制 2MB）✅，未使用分包。
- 若后续新增大量图片，可把 `pages/detail` 等移入 `subpackages` 以腾出主包空间。

## 数据维护

`data/teas.js` 已由脚本从网站源码生成。如需新增/修改茶叶，直接编辑该文件中的对应对象即可（图片放入 `images/`，命名与 `id` 一致）。
