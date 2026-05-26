# 17. 配置文件详解

::: info 本章你将学到
- 小白刚装完 Claude Code，**最常改的 5 项配置**
- 所有配置文件分别住在哪里、谁优先
- `settings.json` 全字段参考（按需查阅）
- 核心环境变量 + 跨平台设法（Bash / PowerShell / CMD）
- 配置冲突时怎么排查实际生效的值
:::

::: tip 学习这章的两种姿势
- 🎯 **刚装完 / 想跑起来**：只看 [17.1 小白必改的 5 项](#_17-1-小白必改的-5-项)，10 分钟搞定。其余跳过
- 📖 **进阶 / 找特定字段**：直接搜你要的字段名，本章是全集参考
:::

## 17.1 小白必改的 5 项

刚装完 Claude Code，下面 5 项**够你跑很久**了。其他字段先别动。

### ① 选模型

```json
// ~/.claude/settings.json
{
  "model": "sonnet"
}
```

可选：`sonnet`（平衡，默认推荐）/ `opus`（最强但贵 5 倍）/ `haiku`（最便宜但弱）。

不会调？**保留默认 sonnet 就行**。

### ② 设 API Key（如果用 Anthropic 官方 API）

::: code-group

```bash [macOS / Linux]
# 加进 ~/.zshrc 或 ~/.bashrc
echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxx"' >> ~/.zshrc
source ~/.zshrc
```

```powershell [Windows PowerShell]
# 永久写入（重开 PowerShell 生效）
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-xxxxxxxxxxxx", "User")
```

:::

::: warning 永远用环境变量、别写进文件
不要把 API Key 直接写进 `settings.json`——这个文件可能被提交到 git。
:::

国内用户用其它服务商？见 [国内模型接入](/claude-code/china/models)。

### ③ 配 API 代理（国内用户必看）

```bash
# 走代理
export ANTHROPIC_API_BASE="https://api.example-proxy.com"

# 或走系统翻墙工具
export HTTPS_PROXY="http://127.0.0.1:7890"
```

不知道用哪个？看 [代理与网络配置](/claude-code/china/proxy)。

### ④ 让常用命令自动批准（省去每次确认）

每次执行 git / npm 命令都弹框问"允许吗"会很烦。把常用的加进白名单：

```json
// ~/.claude/settings.json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(npm run *)",
      "Read",
      "Edit"
    ],
    "deny": [
      "Bash(sudo *)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)"
    ]
  }
}
```

详见 [权限与模式](/claude-code/advanced/permissions)。

### ⑤ 指定编辑器（让 `claude` 调起你习惯的 IDE）

```json
{
  "editor": {
    "name": "code"  // VS Code
  }
}
```

可选：`code`（VS Code）/ `cursor` / `vim` / `nvim` / `nano`。

---

**上面 5 项做完，你就配好了 95% 的日常需求**。下面是高级用户和需要细调的参考。

## 17.2 配置文件总览

Claude Code 一共有 6 个配置位置，分别管不同的事：

| 文件 | 位置 | 用途 | 优先级 |
|------|------|------|--------|
| `~/.claude/settings.json` | 用户主目录 | 全局默认配置 | 低 |
| `~/.claude.json` | 用户主目录 | 账号认证信息（**别动**） | 中 |
| `.claude/settings.json` | 项目根目录 | 项目级配置 | 高 |
| `.claude/settings.local.json` | 项目根目录 | 本地私有覆盖（**不提交 git**） | 更高 |
| `.mcp.json` | 项目根目录 | MCP 服务器定义（[见上一章](/claude-code/advanced/mcp)） | 按需 |
| `CLAUDE.md` / `CLAUDE.local.md` | 项目根目录 | 会话指令（[见记忆章节](/claude-code/advanced/memory)）| 会话级 |

::: tip 怎么记
- **`~/.claude/`** = 你自己（用户级），所有项目都生效
- **`.claude/`** = 这个项目（项目级），团队共享
- **`.local.json`** = 私有覆盖（个人本地，不提交 git）
:::

## 17.3 settings.json 全字段参考（折叠按需展开）

::: details 点击展开完整 settings.json 模板

```json
{
  // ── 模型 ──────────────────────────────────────────
  "model": "sonnet",
  // 可用值：sonnet, opus, haiku，或完整模型 ID

  "modelOverrides": {
    "sonnet": "claude-sonnet-4-6",
    "opus": "claude-opus-4-7"
  },

  // ── API 连接 ───────────────────────────────────────
  "apiBase": "https://api.anthropic.com",
  // 国内用户可配置代理：https://api.siliconflow.cn/v1

  "apiKey": "${ANTHROPIC_API_KEY}",
  // ⚠️ 建议用环境变量，不要直接写入

  // ── 权限 ───────────────────────────────────────────
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(npm run *)",
      "Read",
      "Write"
    ],
    "deny": [
      "Bash(sudo *)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)"
    ],
    "autoApprove": false
  },

  // ── MCP 服务器 ──────────────────────────────────────
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  },

  // ── 钩子 ────────────────────────────────────────────
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$FILE_PATH\"",
            "timeout": 30
          }
        ]
      }
    ]
  },

  // ── 编辑器 ──────────────────────────────────────────
  "editor": {
    "name": "code",
    "formatOnSave": true
  },

  // ── 终端 ────────────────────────────────────────────
  "terminal": {
    "shell": "/bin/bash",
    "timeout": 30000
  },

  // ── 功能开关 ────────────────────────────────────────
  "autoMemoryEnabled": true,
  "disableAllHooks": false,

  // ── 环境变量（会被合并到 Claude 执行的所有命令环境中）
  "env": {
    "NODE_ENV": "development",
    "USE_BUILTIN_RIPGREP": "0"
  }
}
```
:::

### 模型字段细节

```json
{
  "model": "sonnet",
  "modelOverrides": {
    "sonnet": "claude-sonnet-4-6-20251001"
  }
}
```

`model` 只能填别名（`sonnet` / `opus` / `haiku`），如果想用具体某个版本 ID，写在 `modelOverrides` 里覆盖默认映射。

也可以用环境变量（优先级更高）：

```bash
export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-6-20251001
export ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-7-20251001
export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5-20251001
```

## 17.4 核心环境变量

刚开始**只需要认识下面 3 个**。其余在排错或高级场景才用：

| 变量 | 何时设 | 示例值 |
|---|---|---|
| **`ANTHROPIC_API_KEY`** | 用 Anthropic 官方 API 时 | `sk-ant-xxx` |
| **`ANTHROPIC_API_BASE`** | 换 API 端点（用代理 / 第三方服务） | `https://api.siliconflow.cn/v1` |
| **`HTTPS_PROXY`** | 本地翻墙工具走代理 | `http://127.0.0.1:7890` |

### 跨平台设法（重要）

::: code-group

```bash [Bash / Zsh（macOS / Linux）]
# 临时（当前 shell 会话）
export ANTHROPIC_API_KEY="sk-ant-..."

# 永久（写进 ~/.zshrc 或 ~/.bashrc）
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.zshrc
source ~/.zshrc

# 验证
echo $ANTHROPIC_API_KEY
```

```powershell [PowerShell（Windows 推荐）]
# 临时（当前 PowerShell 窗口）
$env:ANTHROPIC_API_KEY = "sk-ant-..."

# 永久（用户级，下次开机也有，重开 PowerShell 生效）
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-...", "User")

# 验证
$env:ANTHROPIC_API_KEY
```

```cmd [Windows CMD]
# 永久（重开 CMD 才生效）
setx ANTHROPIC_API_KEY "sk-ant-..."

# 验证（重开 CMD 后）
echo %ANTHROPIC_API_KEY%
```

:::

::: warning Windows 用户特别注意
`setx` 不是在当前 CMD 立刻生效，**必须关掉再开新 CMD** 才能读到。验证不到不要慌，关了重开。
:::

### 扩展环境变量（按需查阅）

::: details 点击展开完整环境变量列表

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `ANTHROPIC_API_KEY` | API 密钥 | `sk-ant-...` |
| `ANTHROPIC_API_BASE` | API 端点 | `https://api.anthropic.com` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | 默认 Sonnet 模型 ID | `claude-sonnet-4-6` |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | 默认 Opus 模型 ID | `claude-opus-4-7` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | 默认 Haiku 模型 ID | `claude-haiku-4-5` |
| `ANTHROPIC_CUSTOM_MODEL_OPTION` | 自定义模型条目 | `provider/my-model` |
| `ANTHROPIC_CUSTOM_MODEL_OPTION_NAME` | 自定义模型显示名 | `代码审查专用` |
| `ANTHROPIC_HTTP_TIMEOUT` | HTTP 超时（毫秒） | `60000` |
| `ANTHROPIC_BETAS` | 启用 Beta 功能 | `structured-outputs` |
| `HTTP_PROXY` | HTTP 代理 | `http://127.0.0.1:7890` |
| `HTTPS_PROXY` | HTTPS 代理 | `http://127.0.0.1:7890` |
| `NO_PROXY` | 不走代理的地址列表 | `localhost,127.0.0.1` |
| `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` | 禁用实验性功能 | `1` |
| `USE_BUILTIN_RIPGREP` | 用内置 ripgrep | `0` 关 / `1` 开 |

:::

## 17.5 ~/.claude.json — 账号信息（不要手动改）

::: warning 这个文件包含你的认证信息
- 不要分享、不要提交到版本控制
- 不要手动改它——用 `claude login` / `claude logout` 等命令管理
- 出问题时，最暴力的修复是删了重新 `claude login`
:::

参考用途：

```json
{
  "accounts": [
    {
      "type": "console",
      "apiKey": "sk-ant-..."
    }
  ],
  "activeAccount": 0,
  "lastSessionId": "sess_xxx",
  "sessionHistory": [
    {
      "id": "sess_xxx",
      "project": "/Users/me/my-project",
      "lastAccess": "2026-05-13T10:30:00Z"
    }
  ]
}
```

## 17.6 配置优先级（低→高）

同一个配置项在多处都设了，**高优先级覆盖低优先级**：

```
~/.claude/settings.json            (全局默认)
       ↓ 被覆盖
.claude/settings.json              (项目级)
       ↓ 被覆盖
.claude/settings.local.json        (本地私有覆盖)
       ↓ 被覆盖
环境变量                            (高优先级)
       ↓ 被覆盖
命令行参数                          (最高优先级)
```

### 实战例子：冲突时谁赢？

假设：
- `~/.claude/settings.json` 写了 `"model": "sonnet"`
- 当前项目 `.claude/settings.json` 写了 `"model": "opus"`
- 环境变量 `ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-6` 设了

进这个项目跑 `claude`，实际用的是哪个？

**答**：用 `opus`（项目级覆盖了用户级）。环境变量只影响 sonnet 别名映射，跟 `opus` 没关系。

::: tip 不确定时用 `claude doctor`
```bash
claude doctor
```
会列出**实际生效的所有配置 + 来源**，谁覆盖谁一目了然。配置出问题先跑这个。
:::

## 17.7 常见配置问题速查

### Q：改了 `settings.json` 但没生效？

按这个顺序排查：
1. **JSON 格式错误** —— 漏逗号、引号没闭合。用 [jsonlint.com](https://jsonlint.com/) 验证一下
2. **文件位置错** —— 是 `~/.claude/settings.json`（**不是** `~/.claude.json`，差一个斜杠 / 一个目录）
3. **被高优先级覆盖了** —— 项目根有 `.claude/settings.json`、或者环境变量也设了，跑 `claude doctor` 看实际生效值

### Q：API Key 设了但 Claude Code 还报需要登录？

```bash
# 1. 确认环境变量真的设上了
echo $ANTHROPIC_API_KEY          # macOS / Linux
$env:ANTHROPIC_API_KEY           # PowerShell

# 2. 确认在当前 shell 启动 claude（不是别的 shell）
claude

# 3. 还不行？重新登录
claude logout
claude login
```

### Q：项目级 `.claude/settings.json` 想覆盖某个字段但不知道字段名？

看 [17.3 全字段模板](#_17-3-settings-json-全字段参考-折叠按需展开)。复制其中一段，**只保留你要覆盖的字段**，其余删掉。Claude Code 是**字段级合并**，不写的字段会沿用低优先级的值。

---

## 看完这一章你应该知道

✅ 小白只需要改 5 项：模型 / API Key / 代理 / 权限白名单 / 编辑器
✅ 6 个配置位置各管各的事，看路径就能记
✅ 优先级低→高：`~/.claude/` → `.claude/` → `.claude/settings.local.json` → 环境变量 → 命令行
✅ Win 用户用 `[Environment]::SetEnvironmentVariable` 永久设、`setx` 重开 CMD
✅ 不确定哪个配置生效，跑 `claude doctor`

---

**下一步**：[18. 插件（Plugins） →](/claude-code/advanced/plugins)

Claude Code 还能装第三方插件，把斜杠命令 / 代理 / hook 打包成可复用的扩展。
