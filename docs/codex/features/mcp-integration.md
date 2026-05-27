# 9. MCP 扩展协议

> **本文你将学会：** MCP 是什么、为什么需要它、Codex 怎么用 MCP 接入浏览器 / 数据库 / Figma 等外部工具、5 分钟跑通 Playwright 实战。

## MCP 是什么？

::: info 用一个比喻搞懂
**MCP** = **Model Context Protocol**（模型上下文协议，Anthropic 发起的开放标准）。

**比喻**：MCP 就像 **USB 接口标准**——只要某个工具（浏览器、数据库、Figma…）做了 MCP 服务器，**Codex 就能像电脑插 USB 一样直接用它**，**不用 OpenAI / Codex 团队一家一家去对接**。
:::

把 Codex 想象成一个开发者，**MCP = 给他配备外挂工具**：

| 工具 | 让 Codex 能做什么 |
|---|---|
| 🌐 Playwright | 打开网页、截图、点按钮、爬取内容 |
| 📊 数据库 | 查询 / 修改 SQLite / PostgreSQL / MySQL |
| 🎨 Figma | 读设计稿、按设计图写代码 |
| 📚 Context7 | 实时查最新 API 文档（而非 LLM 训练时的旧版） |
| 📁 Filesystem | 访问指定目录的文件（超出 Codex 默认工作目录） |

## 5 分钟跑通：Playwright 浏览器 MCP（最实用入门）

让 Codex 能**自己打开浏览器、点按钮、截图**。这是个**不需要 API Key**、立刻能跑的入门款。

### 前置：装好 Node.js

参考 [Node.js 与 npm 入门](/claude-code/guide/nodejs)。验证 `node --version` 输出 `v22.x.x` 即可。

### 第 1 步：加 Playwright MCP 到 config.toml

打开 `~/.codex/config.toml`（没有就先跑一次 `codex` 让它自动生成）：

```toml
# ~/.codex/config.toml 末尾追加

[[mcp_servers]]
name = "browser"
transport = "stdio"
command = "npx"
args = ["@playwright/mcp"]
```

::: tip 第一次跑会自动装
`npx @playwright/mcp` 第一次运行会自动从 npm 下载 Playwright 浏览器二进制——大概 100MB，需要几分钟。**国内用户先换 [npm 镜像](/claude-code/guide/nodejs#国内-npm-加速-强烈推荐)**。
:::

### 第 2 步：重启 Codex

```bash
# 退出当前会话（如果在跑）
/exit

# 重新进
codex
```

### 第 3 步：验证 MCP 加载了

输入：
```
列出当前可用的所有 MCP 工具
```

你应该看到 `browser` 服务器和它的工具（`browser_navigate` / `browser_click` / `browser_screenshot` 等）。

### 第 4 步：实际用起来

```
打开 https://news.ycombinator.com，截图给我看头条
```

Codex 会：
1. 调用 MCP 工具 `browser_navigate("https://news.ycombinator.com")`
2. 调用 `browser_screenshot()`
3. 把截图展示给你

更复杂的场景：

```
打开 localhost:3000，
点击页面上"登录"按钮，
填写用户名 test@test.com 和密码 123456，
点提交按钮，
告诉我登录后跳转到哪个页面（截图）
```

🎉 Codex 现在能自己测前端 UI 了。

## 在 config.toml 中配置 MCP

```toml
# ~/.codex/config.toml

# STDIO 类型（本地运行的 MCP 服务，最常见）
[[mcp_servers]]
name = "filesystem"
transport = "stdio"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/workspace"]

# HTTP 类型（远程 MCP 服务）
[[mcp_servers]]
name = "my-remote-tool"
transport = "http"
url = "https://my-mcp-server.example.com/mcp"
headers = { Authorization = "Bearer your-token" }
```

::: info `[[mcp_servers]]` 双中括号是啥
TOML 语法：双中括号 = **数组里的一项**。多个 MCP 服务器各写一个 `[[mcp_servers]]` 段。详见 [TOML 语法](/codex/config/config-basic#config-toml-是什么文件-什么是-toml)。
:::

## 热门 MCP 推荐

按"上手难度"排，前面的更适合新手。

### ⭐ Playwright（浏览器控制）

详见 [上面的 5 分钟实战](#_5-分钟跑通-playwright-浏览器-mcp-最实用入门)。

### ⭐ Filesystem（扩展文件访问）

让 Codex 访问指定目录的文件（超出默认工作目录）：

```toml
[[mcp_servers]]
name = "filesystem"
transport = "stdio"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"]
```

**适用**：让 Codex 读跨多个项目的文档、配置等。

### Figma 读取

让 Codex 读 Figma 设计稿，**按设计图写代码**：

```toml
[[mcp_servers]]
name = "figma"
transport = "stdio"
command = "npx"
args = ["figma-mcp"]
env = { FIGMA_TOKEN = "你的 Figma Personal Access Token" }
```

**怎么拿 Figma Token**：[figma.com/settings](https://www.figma.com/settings) → Personal access tokens → Generate new token。

### Context7（最新 API 文档查询）

让 Codex 实时查最新文档（而不是它训练数据里那一版）：

```toml
[[mcp_servers]]
name = "context7"
transport = "http"
url = "https://mcp.context7.com/mcp"
```

**适用**：用最新框架（如 Next.js 15、Vue 3.5）时避免 Codex 用旧 API。

### 本地数据库

```toml
# SQLite
[[mcp_servers]]
name = "sqlite"
transport = "stdio"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-sqlite", "--db-path", "./mydb.sqlite"]
```

**适用**：让 Codex 直接查数据库回答问题（"用户表里有多少注册超过 30 天的活跃用户"）。

## 排错速查

### Q：`/mcp` 显示 disconnected / error

按这个顺序排查：

1. **手动跑一遍 MCP 服务器**——看是不是命令本身能跑：
   ```bash
   npx @playwright/mcp
   # 没有输出错误 = MCP 命令本身没问题
   ```
2. **检查 config.toml 语法**——TOML 错误会让整段被忽略
3. **重启 Codex**——改了 config.toml 后必须重启会话
4. **看详细错误**：
   ```bash
   codex --debug "mcp"
   ```

### Q：`npx` 每次启动都很慢（10+ 秒）

`npx` 每次都要去 npm 检查新版。**全局装一次**能避免：

```bash
npm install -g @playwright/mcp

# 然后 config.toml 改用直接命令名
```

```toml
[[mcp_servers]]
name = "browser"
transport = "stdio"
command = "mcp-playwright"   # 直接调可执行文件
args = []
```

### Q：MCP 工具明明有，Codex 不主动用

提示工程问题。试着**明确点名让它用**：

```
用 browser MCP 打开 https://example.com
```

或在 [AGENTS.md](/codex/advanced/agents-md) 里写明白什么时候该用哪个 MCP。

### Q：装了 Figma MCP 但报"缺 FIGMA_TOKEN"

```bash
export FIGMA_TOKEN="figd_xxxxxxxxxxxx"
```

或在 config.toml 的 `env` 字段里写：
```toml
[[mcp_servers]]
name = "figma"
env = { FIGMA_TOKEN = "figd_xxxxxxxxxxxx" }
```

## 更多 MCP 资源

- 📚 [官方 MCP 服务器列表](https://github.com/modelcontextprotocol/servers) — Anthropic 维护的官方清单
- 🌟 [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers) — 社区维护的"awesome list"
- 📖 [MCP 协议官方文档](https://modelcontextprotocol.io) — 想自己写 MCP 服务器的看

## 下一步

- 🔧 [Shell 命令执行](/codex/features/shell-commands) — Codex 跑命令的机制
- 📝 [AGENTS.md 自定义指令](/codex/advanced/agents-md) — 指导 Codex 何时用哪个 MCP
- ⚙️ [config.toml 基础配置](/codex/config/config-basic)
