# 13. DeepSeek 保姆级教程

> **官网：** [platform.deepseek.com](https://platform.deepseek.com)
>
> **本文你将学会：** 从注册账号到成功在 Codex 中使用 DeepSeek，全程图文步骤。

## 为什么首推 DeepSeek？

- **免费额度充足**：新用户注册即获赠 10 元额度，可用于大量 API 调用
- **代码能力顶级**：DeepSeek-V3 在代码基准测试（HumanEval）中得分与 GPT-4o 相当
- **价格极低**：付费调用价格约为 OpenAI 的 1/20
- **无需翻墙**：国内直连，延迟低
- **OpenAI 完全兼容**：接入无缝，几乎零配置

---

## 第一步：注册 DeepSeek 账号

1. 打开 [platform.deepseek.com](https://platform.deepseek.com)
2. 点击右上角 **"注册"**
3. 使用手机号或邮箱注册
4. 完成邮箱/手机验证

::: tip 注册后自动获得
- 新用户免费赠送 **10 元 API 额度**
- DeepSeek-V3 的调用价格约为 0.001 元/千 tokens
- 10 元约可完成约 10,000 次代码编辑任务
:::

---

## 第二步：获取 API Key

1. 登录后进入控制台，点击左侧菜单 **"API Keys"**
2. 点击 **"创建 API Key"**
3. 输入一个描述名称（如 `codex-cli`）
4. 点击确认，**立即复制 API Key**（只显示一次！）

API Key 格式如下（以 `sk-` 开头）：
```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

::: warning 重要
API Key 创建后只会完整显示一次，请立即保存到安全的地方（如密码管理器）。如果忘记，需要重新创建。
:::

---

## 第三步：配置 Codex

打开或创建配置文件 `~/.codex/config.toml`：

```bash
# 如果文件不存在，先创建目录
mkdir -p ~/.codex

# 用任意编辑器打开配置文件
nano ~/.codex/config.toml
# 或
code ~/.codex/config.toml
```

写入以下配置：

```toml
# ~/.codex/config.toml

[model_providers.deepseek]
name = "deepseek"
api_key = "sk-你的API Key粘贴到这里"
base_url = "https://api.deepseek.com/v1"

[model]
provider = "deepseek"
name = "deepseek-chat"
```

保存文件。

---

## 第四步：验证是否成功

```bash
codex
```

启动后在输入框中输入：

```
你好，请用一句话介绍你自己，并告诉我你是哪个模型
```

如果看到类似这样的回复，说明配置成功 🎉：

> 你好！我是 DeepSeek-V3，由深度求索（DeepSeek）开发的大语言模型...

---

## 可用的 DeepSeek 模型

| 模型名称（`name` 字段填写） | 说明 | 价格 |
|---------------------------|------|------|
| `deepseek-chat` | DeepSeek V3，主力通用+代码模型 | 低 |
| `deepseek-reasoner` | DeepSeek R1，深度推理版，适合复杂算法 | 中 |

::: tip 推荐
日常编程任务用 `deepseek-chat`（速度快、价格低）。遇到复杂算法题、需要深度推理时切换到 `deepseek-reasoner`。
:::

切换到推理模型：

```toml
[model]
provider = "deepseek"
name = "deepseek-reasoner"
```

---

## 完整配置示例

```toml
# ~/.codex/config.toml
# DeepSeek 完整配置示例

[model_providers.deepseek]
name = "deepseek"
api_key = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
base_url = "https://api.deepseek.com/v1"

[model]
provider = "deepseek"
name = "deepseek-chat"

[agent]
approval_mode = "auto"
```

---

## 常见问题排查

### 报错：`401 Unauthorized`

**原因：** API Key 不正确或已过期。

**解决：**
1. 检查 `config.toml` 中的 `api_key` 是否完整，没有多余空格
2. 前往 [platform.deepseek.com](https://platform.deepseek.com) 检查 Key 是否仍有效
3. 尝试重新创建一个新的 API Key

### 报错：`429 Too Many Requests`

**原因：** 调用频率超出限制（免费额度有每分钟请求数限制）。

**解决：** 等待几秒后重试，或充值后使用付费档位（限制更高）。

### 报错：`insufficient balance`

**原因：** 免费额度已用完。

**解决：** 登录 [platform.deepseek.com](https://platform.deepseek.com)，进入"账单"页面充值（最低 10 元）。

### 响应很慢

DeepSeek API 在高峰时段（白天）可能较慢，**推荐在晚上 22:00 之后使用**，速度会明显提升。

---

## 查看用量和余额

登录 [platform.deepseek.com](https://platform.deepseek.com)，在控制台的 **"用量"** 页面可以查看：
- 今日/本月 token 消耗
- 剩余余额
- 每次调用的详细记录

---

## 下一步

- 🚀 [快速开始](/codex/guide/quick-start) — 开始你的第一个任务
- ⚙️ [config.toml 完整配置](/codex/config/config-basic) — 了解更多配置选项
- 🔄 [通义千问](/codex/china-models/qwen) — 了解其他国内模型选项
