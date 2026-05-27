# 10. 官方模型一览

> **本文你将学会：** Codex 能用哪些 OpenAI 官方模型、各自适合什么场景、新手该选哪个、Token 和成本怎么算。

::: tip 一分钟搞定选哪个
| 你的情况 | 选 |
|---|---|
| **新手 / 不知道选哪个** | ⭐ **`gpt-5.2-codex`**（默认，均衡，最稳） |
| 想省钱 | `gpt-5.1-codex-mini` |
| 项目级超复杂任务 | `gpt-5.1-codex-max` |
| 极快响应（Pro 用户） | `gpt-5.3-codex-spark` |
| 算法题 / 逻辑推理 | `o3` |
| **国内用户、没 OpenAI 账号** | 看 [国内模型对接](/codex/china-models/overview) |
:::

## 先搞懂：Token 和成本

::: info Token 是什么？
**Token = LLM 处理文字的最小单位**。1 个汉字 ≈ 2 token，1 个英文单词 ≈ 1-2 token。

调 LLM 的费用按 **输入 token 数 + 输出 token 数** 算钱——你发给它多少字 + 它回了多少字。

**一个直观的感受**：
- 一次问"Python 如何读 CSV"：约 50 token 输入 + 300 token 输出 = **¥0.001** 左右（DeepSeek 价格）
- 一次让 Codex 重构一个文件：约 5000 token 输入 + 2000 token 输出 = **¥0.05** 左右
- 一个月日常用：**¥10-30** 起步

**为什么模型表里 token 消耗"高 / 低"**：
- gpt-5.2-codex 是**主力模型**，单 token 算正常价
- gpt-5.1-codex-mini 表里写 `低（4× 更多用量）` = **同样的预算能用 4 倍多的 token**（性能换 token）
- gpt-5.5 / 5.1-codex-max 是**旗舰**，单 token 价格更高
:::

## 模型速查表

| 模型名称 | 特点 | 适用场景 | 单价（相对） |
|----------|------|----------|----------|
| ⭐ `gpt-5.2-codex` | 最强代码 Agent | **日常使用，新手首选** | 中 |
| `gpt-5.1-codex-mini` | 轻量快速 | 日常小任务、快速迭代 | **低**（同预算用 4× token） |
| `gpt-5.1-codex-max` | 超长推理 | 项目级复杂重构 | 很高 |
| `gpt-5.3-codex-spark` | 近实时响应 | 快速问答（仅 Pro） | 极低 |
| `gpt-5.5` | 最强综合能力 | 复杂任务、需广泛知识 | 高 |
| `o3` | 深度推理 | 算法题、复杂逻辑 | 高 |
| `o4-mini` | 轻量推理 | 日常推理任务 | 中 |

## 各模型详解

### ⭐ gpt-5.2-codex（新手默认）

**Codex CLI 的主力模型**，专门针对代码 Agent 场景优化：

- **上下文压缩**：长对话自动压缩，不会因 token 耗尽中断
- **大型重构**：处理跨多文件的重构任务更稳定
- **Windows 原生支持**：在 PowerShell 环境下表现最佳

```bash
codex --model gpt-5.2-codex
```

**适合**：80% 的日常场景。不知道选什么就用它。

### gpt-5.1-codex-mini（省钱首选）

性能略低于 `gpt-5.2-codex`，但 **token 单价约为 1/4**：

- ✅ **适合**：简单 Bug 修复、代码解释、日常问答
- ❌ **不适合**：复杂多步骤重构、需要大量推理的任务

```bash
codex --model gpt-5.1-codex-mini
```

**适合**：预算紧 / 只跑简单任务的开发者。

### gpt-5.1-codex-max（重型任务）

`gpt-5.2-codex` 的"重型"版本——上下文更长、推理更深，**单 token 更贵**。

**适合**：跨多文件的大型重构、复杂的架构改造。

```bash
codex --model gpt-5.1-codex-max
```

### gpt-5.3-codex-spark（极速版）

**近实时响应**——单次回答的延迟极低，适合快速问答。

::: warning 仅 ChatGPT Pro 订阅可用
不是按 API 付费的人无法用。
:::

### gpt-5.5（旗舰通用）

OpenAI 最新旗舰，**不只是代码**：

- 编程 + 研究 + 复杂知识工作均擅长
- 适合需要结合外部知识的任务（如："按行业最佳实践重构代码"）

```bash
codex --model gpt-5.5
```

### o 系列（推理优化）

- `o3`：深度推理，算法 / 数学 / 复杂逻辑
- `o4-mini`：轻量推理，日常推理任务

::: tip 什么时候用 o 系列 vs codex 系列？
- **写 / 改 / 重构代码** → codex 系列（专为代码优化）
- **解算法题 / 调试复杂逻辑** → o 系列（思考时间更长）
- **不确定** → 默认 codex
:::

## 如何切换模型

### 启动时指定

```bash
codex --model gpt-5.1-codex-mini
```

### 在 `config.toml` 中设默认

```toml
# ~/.codex/config.toml
[model]
provider = "openai"
name = "gpt-5.2-codex"
```

### 会话中临时切换

```
/model gpt-5.1-codex-mini
```

切换后立即生效，下次会话还原默认。

## 选哪个模型？决策流程

```
你的需求：
│
├── 复杂多文件重构 / 重型任务
│   → gpt-5.1-codex-max
│
├── 日常写代码、改 bug
│   → gpt-5.2-codex（默认）⭐
│
├── 简单提问、想省钱
│   → gpt-5.1-codex-mini
│
├── 算法 / 数学题 / 复杂推理
│   → o3 / o4-mini
│
└── 在中国大陆，没 OpenAI 账号
    → 改走 国内模型对接
```

::: tip 国内用户
中国大陆**无法稳定访问** OpenAI API。强烈建议用国内模型替代——性能相近、价格更低、无需翻墙：

→ [国内模型对接总览](/codex/china-models/overview)
:::

## 如何估算成本

::: info 实战案例
**场景**：用 Codex 重构一个 200 行的 Python 文件，跑了 3 轮迭代。

| 模型 | token 用量 | 大致费用（OpenAI 价格） |
|---|---|---|
| gpt-5.2-codex | ~15000 token | ¥3-5 |
| gpt-5.1-codex-mini | ~15000 token | ¥0.8-1.2 |
| DeepSeek V3（国内） | ~15000 token | ¥0.1-0.2 |

**结论**：日常开发选 `gpt-5.2-codex` 或 DeepSeek，预算敏感选 mini。一个月下来重度用户可能 ¥100-300（OpenAI）/ ¥20-50（DeepSeek）。
:::

## 看实时余额和用量

```
/usage
```

会显示当前会话累计的 token 用量 + 估算费用。如果开多个 Codex 会话想总览，去 [platform.openai.com/usage](https://platform.openai.com/usage)。

## 下一步

- 🇨🇳 [国内模型对接](/codex/china-models/overview)（国内用户走这条）
- 🔌 [自定义模型供应商](/codex/models/custom-providers)（接你自己的服务）
- 🔐 [Agent 权限模式](/codex/features/agent-modes)
