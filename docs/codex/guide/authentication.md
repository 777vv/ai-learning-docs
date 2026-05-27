# 4. 认证与 API Key

> **本文你将学会：** 如何获取 OpenAI / 国内模型的 API Key、安全保存、配置到 Codex、多模型切换。

::: tip 30 秒走向：你该看哪一节
| 你的情况 | 直接看 |
|---|---|
| 国内用户，没注册过 OpenAI | [国内模型 API Key](#国内模型-api-key)（推荐） |
| 有 ChatGPT Plus / Pro 订阅 | [方式二：ChatGPT 账号登录](#方式二-chatgpt-账号登录) |
| 海外用户，有 OpenAI 信用卡 | [OpenAI API Key](#openai-api-key) |
| 想同时配多家模型，按需切换 | [多模型管理](#多模型管理) |
:::

## 认证方式概览

Codex 支持两种认证方式：

| 方式 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| **API Key**（推荐） | 大多数场景 | 灵活 / 支持所有模型 / 国内方案唯一选择 | 需自己生成 + 保管 |
| **ChatGPT 账号** | 已有 ChatGPT Plus / Pro | 无需单独购买 API 额度 | 仅限官方 OpenAI |

::: info API Key 是什么？
**API Key** = 调用 LLM 的"加油卡"密钥。一长串以 `sk-` 开头的字符（如 `sk-abc123...`）。

**比喻**：你把它交给 Codex 就等于"凭这张卡去给我买 LLM 算力"。它代表你的身份和余额——**保管好别泄露**，泄露了别人可以白嫖你的钱。
:::

## 方式一：使用 API Key

### OpenAI API Key

::: warning 国内用户先看这个
注册 OpenAI 账号需要海外手机号 + 海外 IP + 海外信用卡，**门槛非常高**。国内用户**强烈建议直接走 [国内模型方案](/codex/china-models/overview)**——同样的 Codex，免折腾。

后面这段是给海外用户 / 已经有 OpenAI 账号的人看的。
:::

**获取步骤**：

1. 登录 [platform.openai.com](https://platform.openai.com)
2. 左侧菜单选 **API Keys**
3. 点 **Create new secret key**
4. 起个有意义的名字（如 `codex-laptop`、`codex-2026`）
5. **立刻复制弹出的 `sk-xxxxxxxx`**

::: danger ⚠️ API Key 只显示一次
这串 `sk-` 一关闭对话框就**再也看不到**。**立刻保存到密码管理器或安全笔记里**——别只是复制到剪贴板，剪贴板会被覆盖。

**万一没保存就关了**：去 API Keys 列表删掉这个 Key，**重新创建一个**（不能"找回"，只能重生成）。
:::

**保存方式推荐**（按安全度由高到低）：

1. ✅ **密码管理器**（1Password / Bitwarden / KeePass）—— 最安全
2. ✅ **加密笔记** Notion / Obsidian + 密码保护
3. ⚠️ **本地纯文本文件**（如 `~/secrets.txt`） —— 至少别人不容易拿到
4. ❌ 微信收藏 / 浏览器记事本 / 截屏发给自己 —— 不安全，别用

**配置到环境变量**（详见 [快速开始](/codex/guide/quick-start#第二步-配置-api-key)）：

```bash
echo 'export OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxx"' >> ~/.zshrc
source ~/.zshrc
```

### 国内模型 API Key

国内模型的 Key 获取流程更简单（**手机号 + 实名即可**），各家略有差异：

| 模型 | 注册门槛 | 详细教程 |
|---|---|---|
| **DeepSeek** ⭐ | +86 手机号注册即送代金券 | [DeepSeek 申请教程](/codex/china-models/deepseek#获取-api-key) |
| **通义千问** | 阿里云账号（实名） | [通义千问 申请教程](/codex/china-models/qwen#获取-api-key) |
| **Kimi** | +86 手机号 | [Kimi 申请教程](/codex/china-models/kimi#获取-api-key) |

::: tip 国内 Key 也要安全保存
和 OpenAI 一样—— **只显示一次**、丢了只能重生成、保存到密码管理器最稳妥。
:::

## 方式二：ChatGPT 账号登录

如果你有 ChatGPT Plus / Pro / Business / Enterprise / Edu 订阅，可以**直接用账号登录**，不用单独买 API 额度：

```bash
codex auth login
```

终端会显示一段 URL，按提示完成浏览器授权。

::: info 适用的订阅计划
- ChatGPT Plus（$20/月）
- ChatGPT Pro（$200/月）
- ChatGPT Business / Enterprise / Edu

❌ **免费版 ChatGPT 不支持** Codex CLI——必须付费订阅。
:::

::: warning 浏览器没自动弹？
- 复制终端里的 URL 手动粘到任意浏览器
- 国内访问 chatgpt.com 需要[配代理](/claude-code/china/proxy)
- WSL / SSH 环境：登录链接在你的本地浏览器打开，授权码会自动回传到终端
:::

## 在 config.toml 中管理凭证

环境变量适合"只用一家模型"的场景。**多家模型 / 想要更结构化**的话，写进 `~/.codex/config.toml`：

```toml
# ~/.codex/config.toml

# 方式一：OpenAI 官方
[model]
provider = "openai"
name = "gpt-5.2-codex"
api_key = "sk-xxxxxxxxxxxxxxxx"

# 或者方式二：国内模型（以 DeepSeek 为例）
[model]
provider = "deepseek"
name = "deepseek-chat"
api_key = "sk-xxxxxxxxxxxxxxxx"
base_url = "https://api.deepseek.com/v1"
```

::: info config.toml 是什么文件？什么是 TOML？
- **TOML** = 一种配置文件格式（类似 JSON 但更人性化）。`[xxx]` 是分组，`key = value` 是赋值
- **位置**：`~/.codex/config.toml`，其中 `~` 表示你的用户主目录：
  - macOS：`/Users/你的用户名/.codex/config.toml`
  - Linux：`/home/你的用户名/.codex/config.toml`
  - Windows：`C:\Users\你的用户名\.codex\config.toml`
- **打开方式**：任意文本编辑器（VS Code / 记事本 / nano / vim）都能开
- **优先级**：写在这里的配置 > 环境变量 > 默认值
:::

::: danger Key 文件安全 ⚠️
`config.toml` 里有你的 API Key，做两件事保护它：

1. **不要提交 git** —— `.gitignore` 加 `.codex/`，或者干脆别在 git 仓库目录附近建它
2. **设文件权限**（macOS / Linux）：
   ```bash
   chmod 600 ~/.codex/config.toml
   ```
   这条命令的意思是：**只有你自己能读写**，其他用户和组别想看。Windows 在 NTFS 默认权限里基本够用，不用专门设。
:::

## 多模型管理

你可以**同时配多家**，启动时按需切换：

```toml
# ~/.codex/config.toml

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
```

启动时指定：

```bash
# 用 DeepSeek
codex --model deepseek-chat --provider deepseek

# 用通义千问
codex --model qwen-coder-plus --provider qwen

# 用 OpenAI
codex --model gpt-5.2-codex --provider openai
```

也可以**设默认**，免去每次输入 `--provider`：

```toml
# config.toml 末尾加
[model]
provider = "deepseek"           # 默认用 DeepSeek
name = "deepseek-chat"
```

## 验证认证是否成功

启动 Codex 后输入：

```
你好，请自我介绍一下，并告诉我你是哪个模型
```

**预期**：收到正常回复，并能从回复看出当前用的是 OpenAI / DeepSeek / Qwen 等。

## 常见错误速查

| 错误信息 | 原因 | 解决方法 |
|----------|------|----------|
| `401 Unauthorized` | API Key 无效 / 拼错 / 已删除 | 检查 Key 是否完整、空格、有无多余字符；不行就重新生成 |
| `403 Forbidden` | Key 权限不足 / 区域限制 | 检查账号区域、Key 是否启用所需 scope |
| `429 Too Many Requests` | 超出频率限制 | 等几秒重试；或在控制台升级套餐 |
| `Connection refused` / 超时 | 网络问题 / `base_url` 错 | 1. 检查 `base_url`（要带 `/v1`）<br>2. 国内访问 OpenAI 需要[代理](/claude-code/china/proxy) |
| `Insufficient credits` / 402 | 余额不足 | 充值或换用其他模型；DeepSeek 最低 ¥1 起充 |
| `Model not found` | 模型名拼错或不在该 provider 下 | 检查 `name` 字段，参考服务商官方模型列表 |

## API Key 丢了怎么办？

::: tip 这是个"不可逆"操作
**所有 API Key 平台都不能"找回"**——只能：
1. 去对应平台 API Keys 控制台
2. 删掉原来那个（即使你不记得它叫啥，可以根据创建时间认）
3. **创建一个新的**，**这次立刻保存**到密码管理器
4. 更新 `config.toml` / 环境变量里的值
5. 重启 Codex

新建 Key 不影响账号余额、不影响其他配置。
:::

## 下一步

- 👉 [快速开始](/codex/guide/quick-start) — 用配置好的模型完成第一个任务
- 🇨🇳 [国内模型对接总览](/codex/china-models/overview) — 国内用户优先看这里
- ⚙️ [配置文件详解](/codex/config/config-basic) — 了解 config.toml 还能做什么
