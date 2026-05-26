# AI 学习站

> 面向中文用户的**零基础 AI 工具学习站**——从认识 AI 到精通主流 AI 编程助手 / Agent 框架，一站搞定。

**在线阅读：** https://claude-code-docs-d7esd1zeb50d77a-1310838266.tcloudbaseapp.com

**源码仓库**：
- GitHub：https://github.com/777vv/ai-learning-docs
- Gitee（国内访问更快）：https://gitee.com/vv777/ai-learning-docs

基于 [VitePress](https://vitepress.dev/) 构建，覆盖 主流 AI 工具的完整中文教程，**135 个章节，持续扩展**。

---

## 当前已收录工具

| 工具 | 定位 | 章节数     | 路径 |
|---|---|---------|---|
| 🦞 **OpenClaw** | 开源个人 AI 助手（接飞书/钉钉/IM 自动化） | 40      | `/openclaw/` |
| 🧬 **Hermes** | Nous Research 自进化 AI Agent（Python + 多 backend） | 40      | `/hermes/` |
| 🟠 **Claude Code** | Anthropic 官方 AI 编程助手（代理式） | 33      | `/claude-code/` |
| 🟢 **Codex** | OpenAI 终端 AI 编程助手（开源 + 国内模型友好） | 22      | `/codex/` |
| **合计** | | **135** | |

每个工具按统一 **8 段式结构**编排：
> 入门 → 配置 → 操作 → 进阶 → 国内适配 → 实战案例 → 部署 → 参考

---

## 职场提效场景 · 学完能做到什么

不是"AI 让你更聪明"——是**把每天那些重复、繁琐、消耗精力的事交给 AI**，把时间留给真正需要你判断的事。

### 💻 程序员 / 工程师

| 痛点 | 解决方案 | 来自 |
|---|---|---|
| 改 bug 要翻半天上下文 | 自然语言描述，Claude Code 自主探索代码库定位修复 | `/claude-code/cases/debug` |
| 历史代码不敢动 | 让 AI 先列重构方案再分步执行，测试覆盖兜底 | `/claude-code/cases/refactor` |
| CI 半夜挂了没人看 | OpenClaw 24h 守夜 → AI 分析失败 → 飞书 @ 责任人 | `/openclaw/cases/project-watchdog` |
| 移动端临时想改代码 | 飞书一句话 → OpenClaw → Codex 改 → 自动提 PR | `/openclaw/cases/code-assistant` |

### 💼 产品 / 运营 / 项目管理

| 痛点 | 解决方案 | 来自 |
|---|---|---|
| 每天处理几十封邮件 | AI 按"紧急 / 工作 / 通知 / 垃圾"分桶，重要的才 ping 你 | `/openclaw/cases/office-helper` |
| 周五下午才想起写周报 | 周五 16:30 自动从 GitHub / Notion 拉数据生成草稿 | `/openclaw/cases/office-helper` |
| 会议录音整理两小时 | 上传录音 → AI 转写 + 提炼行动项 → 自动 @ 各 owner | `/openclaw/cases/meeting-notes` |
| 团队问"流程怎么走" | 飞书 @ AI 机器人 → 自动检索公司知识库回答 | `/openclaw/cases/feishu-qa-bot` |

### 📚 内容创作者 / 研究员

| 痛点 | 解决方案 | 来自 |
|---|---|---|
| 信息分散 8 个 APP 看不完 | 早 8 点自动晨报：V2EX + HN + RSS 摘要推送 | `/openclaw/cases/daily-news` |
| 写一遍要适配 3 个平台 | AI 一稿多平台改写（公众号 / 小红书 / 知乎风格自动转） | `/openclaw/cases/content-distribute` |
| 想追前沿但论文读不完 | arxiv 自动监控 → AI 按你研究方向打分 → 周精选 | `/hermes/cases/arxiv-tracker` |
| 调研 10 家公司要一周 | Hermes 派 10 个 subagent 并行调研 → 30 分钟出对比报告 | `/hermes/cases/parallel-research` |

### 🏠 普通人 / 家庭 / 学生

| 痛点 | 解决方案 | 来自 |
|---|---|---|
| 不会写代码但想自动化 | AI 帮你把"每天 X 件事"变成可点击的工具 | `/start/` 入门 6 件套 |
| 学英语没人陪练 | AI 每天推词 + 出题 + 错题本，长期跟踪进度 | `/openclaw/cases/english-coach` |
| 家庭群里事情没人管 | 自然语言加购物清单、定提醒、分家务、生日预警 | `/openclaw/cases/family-manager` |
| 学完想总结但坚持不下来 | Hermes 用一周后会**自己**写 skill，越用越懂你 | `/hermes/cases/self-evolve` |

---

## 跨工具协同（本站独有价值）

每个工具至少留 1 章「联动其他工具」，避免你被一个工具锁死：

- **OpenClaw ch21** → 让 OpenClaw 跑 Codex / Claude Code 当子代理
- **Hermes ch33** → 4 工具协同架构（IM → Hermes → Codex/Claude）
- **Hermes ch34** → `hermes claw migrate` 从 OpenClaw 一键迁移

---

## 技术栈

- [VitePress 1.6](https://vitepress.dev/) — 静态站点生成器
- 品牌配色：橙系 `#c6613f` / `#d97757` / `#e8906d`，暖白背景 `#fafaf7`
- 支持亮色 / 暗色双模式
- 本地全文搜索（无需外部服务）
- 中文界面标签全覆盖

---

## 本地开发

**环境要求**：Node.js ≥ 22

```bash
# 克隆项目（GitHub）
git clone https://github.com/777vv/ai-learning-docs.git

# 或 Gitee 镜像（国内更快）
git clone https://gitee.com/vv777/ai-learning-docs.git

cd ai-learning-docs

# 安装依赖
npm install

# 启动开发服务器（默认 http://127.0.0.1:5173）
npm run dev
```

## 构建与预览

```bash
npm run build       # 构建静态文件（含死链校验）
npm run preview     # 本地预览构建产物
```

## 文档维护工具（本站独有）

为了让 135 个章节不至于"加完就过时"，本站内置了一套**自动审计体系**：

```bash
# 上游变化检测（不调 LLM，30 秒，免费）
npm run audit:check

# 死链扫描（5 分钟）
npm run audit:links

# LLM 快速审计（5-10 分钟）—— 在 Claude Code 里相当于 /update --fast
npm run audit

# LLM 完整审计（60-90 分钟，所有工具）
npm run audit:full

# 单工具 LLM 审计
npm run audit:tool hermes
```

**月度自动跑**：`.github/workflows/monthly-audit.yml` 每月 1 号自动跑轻量检查，发现上游变化/死链自动开 issue 通知。

详见 [`audit-reports/README.md`](./audit-reports/README.md)。

---

## 目录结构

```
ai-learning-docs/
├── docs/                              # 站点内容
│   ├── index.md                       # 站点首页（B+ 三入口 + 4 工具矩阵）
│   ├── start/                         # /start/ 入门 6 件套
│   ├── community.md                   # 学习群
│   │
│   ├── claude-code/                   # 🟠 Claude Code 33 章
│   │   ├── guide/ basics/ advanced/ china/ integration/ cases/ tips/
│   │
│   ├── codex/                         # 🟢 Codex 22 章
│   │   └── guide/ features/ models/ china-models/ advanced/ config/
│   │
│   ├── openclaw/                      # 🦞 OpenClaw 40 章
│   │   └── intro/ setup/ ops/ advanced/ china/ cases/ deploy/ reference/
│   │
│   ├── hermes/                        # 🧬 Hermes 40 章
│   │   └── intro/ setup/ ops/ advanced/ china/ cases/ deploy/ reference/
│   │
│   ├── .vitepress/
│   │   ├── config.ts                  # 站点配置（nav + sidebar + 主题）
│   │   └── theme/
│   │       ├── index.ts
│   │       └── custom.css             # 品牌色 / 样式定制
│   ├── public/                        # 静态资源（SVG / 图片）
│   └── (guide/ basics/ ...)           # 旧路径 301 重定向占位（不要改）
│
├── .claude/
│   ├── commands/
│   │   └── update.md                  # /update 斜杠命令
│   └── skills/
│       ├── add-ai-tool/SKILL.md       # 接入新工具的完整 SOP
│       └── update-docs/SKILL.md       # 文档审计 SOP
│
├── .github/workflows/
│   └── monthly-audit.yml              # 月度自动审计
│
├── scripts/
│   ├── check-upstream-changes.mjs     # 上游 hash 对比
│   └── check-dead-links.mjs           # 死链扫描
│
├── audit-reports/                     # 审计产物
│   ├── README.md
│   └── upstream-snapshots.json        # 上游源快照
│
├── CLAUDE.md                          # 给 AI 协作者看的项目说明
├── README.md                          # 本文件
└── package.json
```

---

## 学习与交流

想跟着站内 4 大工具一起练手？两个入口任选——**群二维码可能 7 天过期**，更推荐加作者微信（注明"AI 学习站"），作者会邀你进当前活跃群，**长期有效**。

<table>
  <tr>
    <td align="center"><b>🦞 学习交流群</b></td>
    <td align="center"><b>👤 作者微信</b></td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/public/qun.png" alt="学习交流群二维码" width="200"/><br/>
      <sub>扫码入群 · 实时互动</sub>
    </td>
    <td align="center">
      <img src="docs/public/author-wx.png" alt="作者微信二维码" width="200"/><br/>
      <sub>微信号：<code>yuxi250428</code><br/>群满 / 码失效请加作者</sub>
    </td>
  </tr>
</table>

---

## License

- 文档内容：基于 Anthropic / OpenAI / Nous Research / OpenClaw 等官方公开资料整理，仅供学习参考
- 代码（脚本 / 配置）：MIT License
- 教程文字：CC BY-NC-SA 4.0（非商用 / 署名 / 相同方式共享）
