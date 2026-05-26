# 16. MCP（Model Context Protocol）

::: info 本章你将学到
- 一句话搞懂 MCP 是什么、解决什么问题（生活化比喻）
- 从 0 到 1 跑通你的第一个 MCP（Filesystem 实战）
- 添加 / 删除 / 查看 MCP 的全套命令
- 用 `.mcp.json` 给团队共享 MCP 配置
- 环境变量怎么设（API Key 怎么塞进 MCP）
- 10 个热门 MCP 服务器，附"今天能不能用"标记
- MCP 连不上时怎么排查
:::

## 16.1 用一个对比看懂 MCP

::: warning 不读这节直接看命令的，等下肯定会懵
:::

**没有 MCP 时**，Claude Code 能做的事被限定在它电脑上能直接看到的东西：

```
你：「帮我查一下我们 Linear 上"登录页"这张 ticket 的描述」
Claude：「我没办法访问 Linear。请你贴一下内容。」
```

**有了 MCP 服务器之后**：

```
你：「帮我查一下我们 Linear 上"登录页"这张 ticket 的描述」
Claude：「（自动调用 Linear MCP）找到了，ticket 内容是……，要不要顺便把昨天讨论的 3 个 bug 也列一下？」
```

**MCP 是什么？** 它是 Anthropic 发起的一个**通用的"工具接入"标准**，让你能把 Claude Code 接到外部服务（GitHub / Linear / 数据库 / Figma / 你公司的内部 API ……）。

::: tip 生活化比喻
**MCP 就像 USB 接口标准**——只要某个设备（Linear / GitHub / 数据库……）做了个"MCP 服务器"，Claude Code 就能像电脑插 USB 一样直接用它，**不用 Anthropic 一家一家去对接**。
:::

工作原理：

```
Claude Code  ↔  MCP Server  ↔  外部服务（Linear / GitHub / DB）
   (你)         (协议适配)        (真正的数据)
```

## 16.2 5 分钟跑通第一个 MCP：Filesystem

强烈建议第一次玩 MCP 从这个开始——**不需要任何 API Key、不需要外部账号**、Node.js 装好就能跑。

### 前置

::: warning 必须已经装好 Node.js
后面 `npx` 是 Node.js 自带的命令。如果 `node --version` 报错，先去 [Node.js 与 npm 入门](/claude-code/guide/nodejs)。
:::

### 第 1 步：添加 Filesystem MCP

打开项目根目录，运行：

```bash
claude mcp add filesystem npx -y @modelcontextprotocol/server-filesystem ~/Documents
```

这条命令的意思是：
- `claude mcp add` — 加一个 MCP 服务器
- `filesystem` — 你给它起的名字（任意，方便记）
- `npx -y @modelcontextprotocol/server-filesystem` — 用 `npx` 跑一个叫 `server-filesystem` 的官方包
- `~/Documents` — 允许 Claude 访问的目录（**只有这个目录及其子目录**）

::: tip 想换成别的目录
比如允许访问当前项目目录，用 `$(pwd)`（macOS / Linux）或绝对路径（Windows）：
```bash
claude mcp add filesystem npx -y @modelcontextprotocol/server-filesystem /path/to/your/folder
```
:::

### 第 2 步：验证 MCP 装上了

```bash
claude mcp list
```

应该能看到类似：

```
filesystem    npx @modelcontextprotocol/server-filesystem ~/Documents    [user]
```

### 第 3 步：在 Claude Code 里用它

打开 Claude Code：

```bash
claude
```

进入会话后，输入 `/mcp` 看连接状态：

```
/mcp
```

应该看到：
```
✔ filesystem    connected    14 tools available
```

🎉 **连上了**。现在试试：

```
你：列一下我 ~/Documents 目录里都有什么文件
Claude：（调用 MCP 工具 list_directory）
你的 Documents 目录里有这些文件……
```

```
你：把 ~/Documents/notes.md 第一段读出来给我
Claude：（调用 MCP 工具 read_text_file）
第一段内容是……
```

::: tip 你刚刚做了什么
Claude Code 通过 MCP 调用了 Filesystem 服务器提供的"读文件"工具，**而不是你自己手动复制粘贴文件内容**。这就是 MCP 的核心价值——让 Claude **主动获取**它需要的信息。
:::

## 16.3 添加 / 删除 / 查看 MCP 的全套命令

```bash
# 添加（基础形式）
claude mcp add <name> <command> [args...]

# 添加并指定环境变量（API Key 等）
claude mcp add <name> -e KEY=value -- <command>

# 列出所有 MCP
claude mcp list

# 查看某个 MCP 的详细配置
claude mcp get <name>

# 移除某个 MCP
claude mcp remove <name>
```

::: warning `--` 是分隔符
当 MCP 命令带 `-` 开头的参数时，必须用 `--` 把它和 `claude mcp` 的参数隔开，否则会被误解析：

```bash
# 错误 ❌（-y 会被 claude 当成自己的参数）
claude mcp add github npx -y @modelcontextprotocol/server-github

# 正确 ✅
claude mcp add github -- npx -y @modelcontextprotocol/server-github
```
:::

## 16.4 三种作用范围（scope）

MCP 配置可以保存在三个地方：

| 范围 | 写入位置 | 适合谁 |
|---|---|---|
| **user**（默认） | `~/.claude/settings.json` | 个人开发，全局生效 |
| **project** | 项目根目录 `.mcp.json` | 团队共享配置，提交到 git |
| **local** | 项目根目录 `.claude/settings.local.json` | 本地覆盖、个人临时配置 |

加 `--scope` 参数指定：

```bash
# 只对当前项目（写 .mcp.json，团队共享）
claude mcp add my-db --scope project -- node ./mcp-server.js

# 对当前用户所有项目（默认就是这个）
claude mcp add my-db --scope user -- node ./mcp-server.js

# 本地私有，不提交 git
claude mcp add my-db --scope local -- node ./mcp-server.js
```

## 16.5 用 `.mcp.json` 共享配置

适合团队场景：把 MCP 配置写进项目根的 `.mcp.json`，提交到 git，**全团队成员都能直接用**。

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    }
  }
}
```

::: warning 千万别把 API Key 直接写进配置
注意上面 `env` 里的值都是 `${GITHUB_TOKEN}`、`${DATABASE_URL}`，这是**环境变量占位符**——不是字面值。真实的密钥应该放在环境变量里，而不是文件里。下面教怎么设环境变量。
:::

### 环境变量 `${XXX}` 怎么设？

`${GITHUB_TOKEN}` 这种语法的意思是"读你系统里叫 `GITHUB_TOKEN` 的环境变量"。设置方法：

::: code-group

```bash [macOS / Linux 临时（当前终端会话）]
# 当前终端会话有效
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
claude  # 在这个终端启动 claude，能读到
```

```bash [macOS / Linux 永久（每次开新终端都有）]
# 加到 ~/.zshrc 或 ~/.bashrc
echo 'export GITHUB_TOKEN=ghp_xxxxxxxxxxxx' >> ~/.zshrc
source ~/.zshrc
```

```powershell [Windows 临时（当前 PowerShell）]
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"
claude
```

```powershell [Windows 永久（用户级，下次开机也有）]
[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "ghp_xxxxxxxxxxxx", "User")
# 关掉 PowerShell 重开生效
```

:::

::: tip 推荐做法：用项目级 `.env` 文件
团队场景下，更干净的做法是项目根目录建个 `.env` 文件（**记得加进 .gitignore**），再用 [direnv](https://direnv.net/) 之类的工具自动加载。详见 [配置文件详解](/claude-code/advanced/config)。
:::

### HTTP 类型 MCP 服务器

不是所有 MCP 都通过本地进程跑，有些是远程 HTTP 服务：

```json
{
  "mcpServers": {
    "my-api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "Content-Type": "application/json"
      }
    }
  }
}
```

## 16.6 在会话中管理 MCP

进 Claude Code 后用 `/mcp` 斜杠命令：

```
/mcp                                # 查看所有 MCP 连接状态
```

会显示：
```
✔ filesystem    connected    14 tools available
✔ github        connected    23 tools available
✗ postgres      error: missing DATABASE_URL
```

`/mcp` 还能用来完成 OAuth 授权——比如装了 Google Drive MCP 后，第一次进会让你点链接去 Google 登录授权。

## 16.7 热门 MCP 服务器

按"上手难度"排序，前面的更适合小白。

| MCP 服务器 | 装法 | 需 API Key？ | 用途 |
|---|---|---|---|
| **Filesystem** ⭐ | `npx -y @modelcontextprotocol/server-filesystem <dir>` | ❌ 不需要 | 读取/写入指定目录的文件 |
| **Memory** ⭐ | `npx -y @modelcontextprotocol/server-memory` | ❌ 不需要 | 让 Claude 跨会话记住事情 |
| **Fetch** ⭐ | `npx -y @modelcontextprotocol/server-fetch` | ❌ 不需要 | 让 Claude 抓取网页内容 |
| **SQLite** | `npx -y @modelcontextprotocol/server-sqlite -- <db.db>` | ❌ 不需要 | 查询本地 SQLite 数据库 |
| **GitHub** | `npx -y @modelcontextprotocol/server-github` | ✅ 需要 PAT | issue / PR / 仓库操作 |
| **PostgreSQL** | `npx -y @modelcontextprotocol/server-postgres` | ✅ 需要连接串 | 数据库读写 |
| **Slack** | `npx -y @modelcontextprotocol/server-slack` | ✅ 需要 Bot Token | 发送 / 读取消息 |
| **Puppeteer** | `npx -y @modelcontextprotocol/server-puppeteer` | ❌ 不需要 | 浏览器自动化 |
| **Google Drive** | `npx -y @modelcontextprotocol/server-gdrive` | ✅ OAuth 授权 | 读取 Google Drive 文档 |
| **Notion** | 社区维护，看仓库 | ✅ 需要 Token | 页面读写 |

::: tip ⭐ 标记的是"不需要任何外部 Key、装完立刻能用"的入门款
建议第一次只装一个，熟练了再加。装太多会让 Claude 反应慢、token 消耗高。
:::

**官方注册表**：[github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

## 16.8 排错速查

### Q：`/mcp` 显示 `disconnected` 或 `error`

按这个顺序排查：

1. **看具体错误信息** —— `/mcp` 一般会带原因（缺环境变量、命令找不到、超时等）
2. **手动跑一遍命令** —— 比如 Filesystem，先在 shell 里跑：
   ```bash
   npx -y @modelcontextprotocol/server-filesystem ~/Documents
   ```
   能跑起来说明命令本身没问题。卡住就是网络 / 权限 / 没装 Node.js。
3. **检查环境变量** —— 如果配置里用了 `${XXX}`，确认 `echo $XXX`（Windows: `$env:XXX`）能输出值
4. **重启 Claude Code** —— `.mcp.json` 修改后必须重启会话才会重新加载

### Q：`claude mcp add` 装了，但 `/mcp` 里看不到

可能是装到了别的 scope。比如 user scope 装的、但你在另一个项目里有 project scope 的 `.mcp.json`，两者会被合并但优先级不同。用：

```bash
claude mcp list  # 看所有 scope 的 MCP
```

### Q：`npx` 每次启动都很慢（10+ 秒）

`npx -y xxx` 每次都要去 npm 检查最新版本。**全局装一次**能避免：

```bash
# 全局装
npm install -g @modelcontextprotocol/server-filesystem

# 然后改用直接命令名（不用 npx）
claude mcp remove filesystem
claude mcp add filesystem mcp-server-filesystem ~/Documents
```

国内用户还应 [换淘宝镜像](/claude-code/guide/nodejs#国内-npm-加速-强烈推荐)。

### Q：MCP 工具明明有，但 Claude 不主动用

提示工程问题。试试在 prompt 里**点名让它用**：

```
你：用 filesystem 工具列一下 ~/Documents 的内容
```

或在 `CLAUDE.md` 里写明白什么时候该用哪个 MCP（[记忆机制](/claude-code/advanced/memory)）。

### Q：装了 GitHub MCP 但报"missing GITHUB_PERSONAL_ACCESS_TOKEN"

去 [github.com/settings/tokens](https://github.com/settings/tokens) 创建一个 Personal Access Token，勾选需要的权限（至少 `repo` 和 `read:user`），然后：

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxx
```

或者在 `claude mcp add` 时直接传：
```bash
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxx -- npx -y @modelcontextprotocol/server-github
```

## 16.9 自己开发 MCP 服务器（可选 / 高级）

::: tip 这一节是给"想为自己公司内部系统做 MCP 接入"的开发者准备的
普通用户不需要看，跳过即可。
:::

MCP 服务器本质上是一个**遵守 MCP 协议规范的进程**——接受标准格式的 JSON-RPC 请求、按规范返回结果。Anthropic 提供了 [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) 和 [Python SDK](https://github.com/modelcontextprotocol/python-sdk) 做开发。

最简单的 Node.js 示例（注释解释每一行）：

```javascript
// 装依赖：npm install @modelcontextprotocol/sdk

// 引入 SDK 的 Server 类（管 MCP 协议层）和 stdio 传输（用标准输入输出通信）
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

// 创建一个 MCP 服务器实例
const server = new Server(
  { name: 'my-server', version: '1.0.0' },
  { capabilities: { tools: {} } }   // 声明我们提供"tools"能力
)

// 注册"列出我提供哪些工具"的处理逻辑
server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'get_data',                        // 工具名
    description: '从我们的内部 API 获取数据', // 给 Claude 看的描述
    inputSchema: {                           // 工具参数定义（JSON Schema 格式）
      type: 'object',
      properties: {
        id: { type: 'string', description: '数据 ID' }
      },
      required: ['id']
    }
  }]
}))

// 注册"用户调用工具时怎么处理"的逻辑
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'get_data') {
    // 这里写真实的业务逻辑——调用你公司的 API、查数据库等
    const data = await fetchFromInternalAPI(request.params.arguments.id)
    return { content: [{ type: 'text', text: JSON.stringify(data) }] }
  }
})

// 启动服务器（通过 stdio 和 Claude Code 通信）
const transport = new StdioServerTransport()
await server.connect(transport)
```

完整开发文档：[modelcontextprotocol.io](https://modelcontextprotocol.io)

---

## 看完这一章你应该知道

✅ MCP 是 AI 工具接入的"USB 标准"，让 Claude Code 能用外部服务
✅ Filesystem 是入门首选——不需要 Key、5 分钟跑通
✅ `claude mcp add/list/get/remove` 是日常管理命令
✅ 三种 scope：user（个人）/ project（团队共享）/ local（本地覆盖）
✅ `.mcp.json` 用 `${ENV_VAR}` 占位环境变量，不要把密钥写死
✅ 连不上时先看 `/mcp` 的具体错误 + 手动跑一遍命令验证

---

**下一步**：[17. 配置文件详解 →](/claude-code/advanced/config)

接下来看 Claude Code 的所有配置项——包括 `settings.json`、环境变量、配置优先级。
