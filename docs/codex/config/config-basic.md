# 22. 基础配置参考

> `~/.codex/config.toml` 完整字段说明 + 跨平台路径展开。

::: info config.toml 是什么文件？什么是 TOML？
- **`config.toml`** = Codex 的主配置文件。模型选哪家、API Key、权限模式、MCP 服务器都在这里
- **TOML** = 一种配置文件格式（类似 JSON 但更人性化）。规则：
  - `# 这是注释`
  - `key = "value"` —— 简单赋值
  - `[section]` —— 分组（一个表）
  - `[[array]]` —— 数组里的一项

例：
```toml
# 这是注释
name = "Tom"                # 字符串
age = 30                    # 数字
active = true               # 布尔

[address]                   # 分组：所有 address.* 字段
city = "Shanghai"

[[hobbies]]                 # 数组项 1
name = "Code"

[[hobbies]]                 # 数组项 2
name = "Music"
```
:::

## 文件位置（跨平台）

| 位置 | 用途 |
|---|---|
| `~/.codex/config.toml` | **主配置文件** |
| `~/.codex/instructions.md` | 全局指令文件（可选，[详见](/codex/advanced/agents-md#全局指令文件)） |
| `~/.codex/skills/` | 自定义技能目录（可选） |

::: info `~` 在不同系统上展开成什么？
`~` 是 Unix 风格的"用户主目录"简写：

| 系统 | `~/.codex/config.toml` 实际路径 |
|---|---|
| **macOS** | `/Users/你的用户名/.codex/config.toml` |
| **Linux** | `/home/你的用户名/.codex/config.toml` |
| **Windows PowerShell** | `C:\Users\你的用户名\.codex\config.toml` |
| **Windows WSL2** | `/home/你的用户名/.codex/config.toml`（WSL 里的 home，**不是** Windows 的） |

**在 Windows PowerShell 里访问**：用 `$env:USERPROFILE` 代替 `~`：
```powershell
notepad $env:USERPROFILE\.codex\config.toml
```
:::

## 完整配置示例

```toml
# ~/.codex/config.toml

# ── 模型提供商配置 ──────────────────────────────────────────
[model_providers.openai]
name = "openai"
api_key = "sk-openai-key"

[model_providers.deepseek]
name = "deepseek"
api_key = "sk-deepseek-key"
base_url = "https://api.deepseek.com/v1"

[model_providers.qwen]
name = "qwen"
api_key = "sk-qwen-key"
base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"

[model_providers.ollama]
name = "ollama"
api_key = "ollama"     # Ollama 不需要真实 Key，填占位即可
base_url = "http://localhost:11434/v1"

# ── 默认使用的模型 ──────────────────────────────────────────
[model]
provider = "deepseek"           # 对应上方 model_providers 中的 key
name = "deepseek-chat"          # 该提供商下的模型名称

# ── Agent 行为配置 ──────────────────────────────────────────
[agent]
approval_mode = "auto"          # auto / read-only / full

# ── MCP 服务器配置 ──────────────────────────────────────────
[[mcp_servers]]
name = "filesystem"
transport = "stdio"
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"]
```

::: warning 安全：不要提交到 git
里面有 API Key。要么**别把 `~/.codex/` 放在项目目录附近**（推荐），要么 `.gitignore` 里加 `.codex/`。

macOS / Linux 还可以设文件权限只让自己读：
```bash
chmod 600 ~/.codex/config.toml
# 600 = 只有所有者能读写，其他用户无权限
```
:::

## 字段说明

### `[model_providers.*]`

| 字段 | 必填 | 说明 |
|------|:----:|------|
| `name` | ✅ | 提供商名称（标识符，自己起，跟 section 名一致即可） |
| `api_key` | ✅ | API 密钥 |
| `base_url` | 仅第三方 | API 基础地址（OpenAI 官方默认不需要写）|

### `[model]`

| 字段 | 必填 | 说明 |
|------|:----:|------|
| `provider` | ✅ | 用哪个提供商（对应 `model_providers` 里 section 名后半段） |
| `name` | ✅ | 模型名称（参考各家服务商文档） |

### `[agent]`

| 字段 | 默认值 | 可选值 | 说明 |
|------|--------|--------|------|
| `approval_mode` | `auto` | `auto` / `read-only` / `full` | 默认权限模式，详见 [Agent 权限模式](/codex/features/agent-modes) |

## 环境变量覆盖

也可以用环境变量替代配置文件，适合"临时改一次"或者 CI / Docker 场景：

```bash
# API Key
export OPENAI_API_KEY="sk-xxxxxxxx"

# 覆盖 API 基础地址（接入国内模型时常用）
export OPENAI_BASE_URL="https://api.deepseek.com/v1"

# 指定模型
export OPENAI_MODEL="deepseek-chat"
```

::: tip 优先级
**命令行参数 > 环境变量 > config.toml > 默认值**

举例：你 config.toml 设了 `deepseek`，但启动时 `codex --provider openai`——本次会用 OpenAI。
:::

## 验证当前生效的配置

```
/config
```

进 Codex 会话后跑 `/config` 斜杠命令，会显示**当前实际生效**的所有配置项 + 来源（来自 config.toml / 环境变量 / 默认值）。

或者跑：
```bash
codex --print-config
```

## 常见问题

### Q：改了 config.toml 没生效

按这个顺序排查：
1. **重启 Codex** —— 改了配置必须重启会话才会重载
2. **文件位置对吗** —— 必须是 `~/.codex/config.toml`，不是项目目录里的（不存在项目级配置）
3. **TOML 格式对吗** —— 漏 `=`、引号没闭合、section 名拼错都会让整段被忽略
4. **被环境变量覆盖了** —— 跑 `env | grep OPENAI` 看有没有冲突

### Q：TOML 格式错误怎么办

用 [toml-lint.com](https://toml-lint.com/) 在线校验。或在 VS Code 装 `Even Better TOML` 扩展，实时高亮错误。

### Q：怎么备份 config.toml

```bash
cp ~/.codex/config.toml ~/.codex/config.toml.backup
```

或者把整个 `~/.codex/` 放进版本控制（**记得只入库结构、API Key 用环境变量**）。

## 进阶配置

config.toml 还能配置：
- 自定义 system prompt
- 工具白名单 / 黑名单
- 子代理（subagents）
- 输出格式偏好
- 模型回退策略

详见 [高级配置](/codex/config/config-advanced)。

## 下一步

- ⚙️ [高级配置](/codex/config/config-advanced)
- 🔌 [MCP 集成](/codex/features/mcp-integration)
- 📝 [AGENTS.md 自定义指令](/codex/advanced/agents-md)
