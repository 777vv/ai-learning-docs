# 12. 国内模型对接总览

> **本文你将学会：** 为什么国内用户能用 Codex、接入原理是什么、怎么选模型，以及 5 分钟跑通的最快路径。

::: tip 你只要做对这三件事
1. **选一家国内 LLM 服务商**（DeepSeek / 通义千问 / Kimi 选一个就行）
2. **拿到那家的 API Key**（一长串以 `sk-` 开头的字符）
3. **改 Codex 的 `config.toml` 把 Key 和接口地址填进去**

不需要翻墙、不需要海外信用卡、不需要 +1 手机号。本文先讲原理 + 怎么选，第二节给 **5 分钟最快通道**，第三节告诉你详细教程在哪。
:::

## 为什么国内用户需要替代方案？

直接用 OpenAI 官方有 3 个硬门槛：

| 门槛 | 实际情况 |
|---|---|
| **网络** | `api.openai.com` 国内直连基本不通，需要代理 |
| **注册** | OpenAI 不接受 +86 手机号，需要海外手机号 + 海外 IP |
| **付款** | 不支持国内银行卡 / 微信 / 支付宝，需要海外信用卡 / Wise 虚拟卡 |

**好消息**：国内 LLM 服务商（DeepSeek / 通义千问 / Kimi / 智谱…）**都做了"OpenAI 兼容 API"** —— Codex 可以无缝换过去用，全程不翻墙。

## OpenAI 兼容 API 是什么？

::: info 一句话解释
"OpenAI 兼容 API" = **接口长得跟 OpenAI 一模一样**，所以原本接 OpenAI 的工具（包括 Codex）能直接换成它。

类比：USB-C 接口的笔记本，能直接插任何 USB-C 的硬盘——硬盘虽然来自不同厂商，**插口标准一样**。
:::

具体来说，OpenAI 定义了一个标准接口：

```
POST https://api.openai.com/v1/chat/completions
请求体：{ "model": "gpt-4o", "messages": [...] }
返回值：{ "choices": [{ "message": {...} }] }
```

DeepSeek / Qwen / Kimi 等都实现了**完全一样的接口结构**，只是换了域名和模型名：

```
POST https://api.deepseek.com/v1/chat/completions
请求体：{ "model": "deepseek-chat", "messages": [...] }
返回值：{ "choices": [{ "message": {...} }] }  ← 结构一致
```

**所以 Codex 不在乎背后是哪家模型**——只要 API 长这样，它就能用。

## 接入原理（一图看懂）

```
你输入指令
    ↓
Codex CLI
    ↓
按 OpenAI 兼容格式发请求（POST /v1/chat/completions）
    ↓
┌─────────────────────────────────────┐
│  你在 config.toml 里指向了哪家？     │
│  ↓                                  │
│  DeepSeek / 通义千问 / Kimi / …     │
└─────────────────────────────────────┘
    ↓
模型生成回复（也是 OpenAI 兼容格式）
    ↓
Codex 处理结果并显示给你
```

换模型 = 改 `config.toml` 里的两行（API Key + 服务商域名）。代码、提示词、工作流**完全不变**。

## 模型选择指南

### 星级标准

| 维度 | 评测基准 |
|---|---|
| **代码能力** | HumanEval / MBPP / 实际写代码 / 改 bug 表现 |
| **中文理解** | 复杂中文指令是否能正确执行、中文注释/文档生成质量 |
| **免费额度** | 注册后能白嫖多少 token / 通常够个人开发用多久 |
| **推荐指数** | 综合：上手难度 + 性价比 + 文档完整度 + Codex 接入稳定性 |

### 推荐表

| 模型 | 免费额度 | 代码能力 | 中文理解 | 推荐指数 | 适合谁 |
|------|----------|----------|----------|----------|---|
| **DeepSeek V3** | ✅ 注册送，按 token 计费便宜 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🔥 **首推** | 大部分人都选它 |
| **通义千问 Coder** | ✅ 免费额度大 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 👍 推荐 | 阿里云用户 / 想跑长上下文 |
| **Kimi k1.5** | ✅ 有限 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 👍 推荐 | 想读长文档 |
| **智谱 GLM-4** | ✅ 有 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 👍 推荐 | 备选 |
| **Ollama 本地** | ✅ 完全免费 | ⭐⭐⭐ | ⭐⭐⭐ | 💻 **离线首选** | 8GB+ 显存 / 敏感代码不能上云 |
| **文心一言 4.5** | ✅ 有 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🆗 可用 | 备选 |
| **豆包 Pro** | ✅ 有 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🆗 可用 | 备选 |

::: tip 不知道选哪个？
- **完全新手** → **DeepSeek**（性价比最高、免费够用、Codex 兼容性最好）
- **担心数据安全** → **Ollama 本地**（代码完全不离开你的电脑，[详见](/codex/china-models/ollama-local)）
- **已经在用阿里云生态** → **通义千问**

挑一个就行，**不要一开始就纠结**——以后随时能改 `config.toml` 换。
:::

## 5 分钟最快通道（DeepSeek 示例）

::: warning 前提
- 已经装好 Codex（没装 → [安装指南](/codex/guide/installation)）
- 装好 Node.js + 命令行能跑 `codex --version` 看到版本号
:::

按这三步走，5 分钟内能跑起来：

### 第 1 步：拿 DeepSeek API Key（2 分钟）

1. 打开 [platform.deepseek.com](https://platform.deepseek.com)
2. 用手机号注册（**支持 +86，注册后立刻送代金券**）
3. 登录后左侧 **API Keys** → 点 **创建 API Key** → 起个名（如 `codex-laptop`）
4. **复制出现的 `sk-xxxxxxxx`** —— ⚠️ **只显示一次**，关了就再也看不到，立刻保存到密码管理器/记事本

### 第 2 步：改 Codex 的 `config.toml`（1 分钟）

打开 `~/.codex/config.toml`（没这个文件就先跑一次 `codex` 让它自动生成）：

::: code-group

```toml [~/.codex/config.toml]
# 1. 定义一个叫 "deepseek" 的供应商
[model_providers.deepseek]
name = "deepseek"
api_key = "sk-xxxxxxxxxxxxxxxx"   # ← 换成你刚拿到的 Key
base_url = "https://api.deepseek.com/v1"

# 2. 告诉 Codex 默认用这个供应商 + 这个模型
[model]
provider = "deepseek"
name = "deepseek-chat"
```

```bash [macOS / Linux 直接生成]
mkdir -p ~/.codex
cat > ~/.codex/config.toml <<'EOF'
[model_providers.deepseek]
name = "deepseek"
api_key = "sk-xxxxxxxxxxxxxxxx"
base_url = "https://api.deepseek.com/v1"

[model]
provider = "deepseek"
name = "deepseek-chat"
EOF

# 之后用编辑器打开把 api_key 换成你的
nano ~/.codex/config.toml
```

:::

::: warning ⚠️ 不要把 config.toml 提交 git
里面有你的 API Key。如果项目目录有 `.gitignore`，加一行 `.codex/` 或单独加 `**/config.toml`。
:::

### 第 3 步：验证（2 分钟）

```bash
# 进入一个测试目录
mkdir codex-demo && cd codex-demo
git init

# 启动 Codex
codex
```

输入：

```
你是哪个模型？运行 `node --version` 告诉我 Node.js 版本。
```

**预期**：
- Codex 回答自己是 deepseek-chat（或类似）
- 它弹窗问"允许运行 `node --version` 吗？" → 你点允许 → 看到你机器上的 Node 版本

🎉 接入成功。剩下的玩法跟 OpenAI 完全一样。

::: tip 跑不通怎么办
1. **401 错误** → API Key 错了，回去检查 `config.toml` 里的 `api_key`
2. **超时** → 网络问题，或者 `base_url` 写错（注意有 `/v1`）
3. **Codex 没读取 config.toml** → 确认文件路径是 `~/.codex/config.toml`，不是 `.codex/config.toml` 在项目目录
4. **依然不行** → 看 [DeepSeek 保姆级教程](/codex/china-models/deepseek) 排错段
:::

## 各模型详细教程

5 分钟通道跑通后，针对你选的模型看详细教程（截图 + 完整排错）：

- 🔍 [DeepSeek 保姆级教程](/codex/china-models/deepseek) ⭐ 最推荐（免费额度大、Codex 兼容稳）
- ☁️ [通义千问 保姆级教程](/codex/china-models/qwen)
- 🌙 [Kimi 保姆级教程](/codex/china-models/kimi)
- 🦙 [Ollama 完全离线方案](/codex/china-models/ollama-local)（无需 API Key、完全本地）
- 📋 [其他模型快速参考](/codex/china-models/others)（智谱 / 文心 / 豆包）

## 常见问题

::: details 国内模型和 OpenAI 模型有多大差距？
**代码任务**：DeepSeek V3 在 HumanEval / MBPP 等基准上**与 GPT-4o 相当**，某些代码基准甚至超过。日常开发任务体验差距不明显。

**通用能力（推理 / 写作）**：DeepSeek-R1 / GLM-4 在中文场景甚至更强；英文创意写作 OpenAI 略胜。

**对 Codex 用户**：写代码 / 改 bug / 重构这些 Codex 的主战场，国内模型完全够用。
:::

::: details 会不会有数据安全问题？
- **国内云模型**（DeepSeek / 通义 / Kimi）：代码片段会上云到对方服务器。商业敏感代码评估好风险再用
- **Ollama 本地**：代码**完全不出你的电脑**——这是最安全的选择
- **企业版**：阿里云通义、智谱等都有企业私有部署方案
:::

::: details 可以同时配置多个模型吗？
可以。`config.toml` 里加多个 `[model_providers.*]`，启动 Codex 时用 `--provider` 参数切换：

```toml
[model_providers.deepseek]
api_key = "sk-..."
base_url = "https://api.deepseek.com/v1"

[model_providers.qwen]
api_key = "sk-..."
base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
```

```bash
codex --provider deepseek  # 用 DeepSeek
codex --provider qwen      # 用通义千问
```
:::

::: details 用国内模型会比 OpenAI 慢吗？
国内模型在国内服务器，**通常更快**——OpenAI 经常需要走代理，反而慢。
:::

::: details 我的代金券 / 免费额度用完了会怎样？
- DeepSeek：会拒绝请求返回 402 错误。去控制台充值后立刻恢复（最低 ¥1 起充，按 token 计费极便宜，一般 ¥10 用一个月）
- Ollama 本地：永久免费，无额度限制
:::

## 下一步

- 已选好模型 → 看对应保姆级教程
- 还在比较 → [DeepSeek 保姆级教程](/codex/china-models/deepseek) 是最推荐入口
- 想完全离线 → [Ollama 本地方案](/codex/china-models/ollama-local)
