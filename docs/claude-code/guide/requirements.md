# 2. 系统要求

::: info 本章你将学到
- 支持的操作系统和硬件要求
- 需要什么账号才能使用
- 国内用户的特殊注意事项
:::

## 2.1 支持平台

| 操作系统 | 最低版本 |
|---------|---------|
| macOS | 13.0 (Ventura) 及以上 |
| Windows | 10 版本 1809+ 或 Server 2019+ |
| Ubuntu | 20.04 LTS 及以上 |
| Debian | 10 (Buster) 及以上 |
| Alpine Linux | 3.19 及以上 |

::: warning Windows 用户必看：为什么需要 Git？
Windows 原生安装前，先去装 [Git for Windows](https://git-scm.com/downloads/win)。

**为什么 Claude Code 需要 Git？** Claude Code 内部用 Git 附带的 **Git Bash** 跑各种命令——它需要 Unix 风格的 shell（`grep`、`ls`、`cat` 等命令）才能正常工作，而 Windows 自带的 PowerShell 不提供这些。装 Git for Windows 后，Git Bash 就有了。

**怎么装**：
1. 下载 [Git for Windows 安装器](https://git-scm.com/downloads/win)
2. 双击 `.exe`，**一路 Next 默认就行**，安装时确认勾选「Add Git to PATH」
3. 装完打开 **新的** PowerShell 跑 `git --version`，能输出版本号就成功

::: tip 用 WSL 的人不用装
如果你打算用 WSL（Windows Subsystem for Linux），按 Linux 方式处理，**不需要**额外装 Git for Windows。
:::
:::

## 2.2 硬件要求

| 项目 | 要求 |
|------|------|
| 内存 | 4 GB 以上（建议 8 GB） |
| 处理器 | x64 或 ARM64 |
| 磁盘空间 | 约 500 MB（程序本体 + 缓存） |
| 网络 | 需要互联网连接访问 API |

## 2.3 账号要求

Claude Code **不支持**免费的 claude.ai 账号，必须是以下之一：

| 账号类型 | 说明 | 适合 |
|---------|------|------|
| **Claude Pro** | 个人订阅，$20/月 | 个人开发者 |
| **Claude Max** | 个人高用量，$100/月 | 重度用户 |
| **Claude Team** | 团队版，$25/人/月 | 小团队 |
| **Claude Enterprise** | 企业版，定制价格 | 大型组织 |
| **Anthropic Console** | 按量付费 API | 开发者/API 接入 |
| **Amazon Bedrock** | AWS 托管 | AWS 用户 |
| **Google Vertex AI** | GCP 托管 | GCP 用户 |

::: tip 几个名词的解释
- **Anthropic Console** = Anthropic 官方的 API 控制台（[console.anthropic.com](https://console.anthropic.com)），充钱、拿 API Key、看用量都在这里。**按量付费**，没有 $20 月费，但需要按 token 计费
- **Amazon Bedrock / Google Vertex AI** = AWS / GCP 的"托管 Anthropic 模型"服务，企业级合规场景才用，普通人不用看
:::

::: tip 推荐方案
- **个人开发者**：Claude Pro（$20/月）是性价比最高的起点
- **国内用户**：可以通过 [硅基流动](/claude-code/china/models) 等服务商使用国内镜像，无需订阅官方
- **企业用户**：考虑 Team/Enterprise 或 Bedrock/Vertex 以满足合规要求
:::

## 2.4 网络要求

| 场景 | 要求 |
|------|------|
| 官方 Claude 账号 | 需能访问 `api.anthropic.com`（部分地区需代理） |
| 国内服务商 | 可直连，无需代理（如硅基流动、通义千问） |
| 代码库分析 | 仅本地，不上传代码到 Anthropic（工具调用在本机执行）|

::: info 代码隐私说明（小白常误解）
**"代码库分析仅本地"** 是说：Claude Code **运行的工具**（读文件、跑命令、改文件）全在你电脑上跑，**不会**把你整个代码库打包传给 Anthropic。

但是——**Claude 写回答时要"看"的内容当然会传**：比如你让它解释 `auth.ts`，那个文件的内容会作为 prompt 上下文发到模型。

简单说：**Claude 想看什么、需要什么上下文**，那一部分会传；其他全在本地。
:::

## 2.5 地区支持

Claude Code 官方支持的国家和地区见 [Anthropic 支持地区列表](https://www.anthropic.com/supported-countries)。

**国内用户**：可以通过配置国内服务商（硅基流动等）绕过访问限制，详见 [国内模型接入](/claude-code/china/models)。

---

下一步：[安装 Claude Code →](/claude-code/guide/install)

::: tip 第一次接触 Node.js / npm？
如果你打算走 `npm install -g` 路径、或者后面想用 [Agents SDK](/claude-code/integration/agents-sdk)、[GitHub Actions](/claude-code/integration/github-actions)，建议先看一眼 [Node.js 与 npm 入门（可选）](/claude-code/guide/nodejs)。走官方安装脚本 / WinGet / Homebrew 的可以跳过这一节。
:::
