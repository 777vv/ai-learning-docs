# 15. Kimi 保姆级教程

> **官网：** [platform.moonshot.cn](https://platform.moonshot.cn)
>
> **本文你将学会：** 从注册到配置，在 Codex 中使用月之暗面（Moonshot AI）的 Kimi 模型。

## Kimi 简介

Kimi 是月之暗面（Moonshot AI）推出的大语言模型，特点：

- **超长上下文**：支持最高 128K tokens 上下文，适合分析大型代码库
- **中文理解极佳**：中文指令理解准确
- **新用户有免费额度**：注册即送 tokens
- **OpenAI 兼容**：接入 Codex 无缝

---

## 第一步：注册 Moonshot 开放平台

1. 前往 [platform.moonshot.cn](https://platform.moonshot.cn)
2. 点击 **"立即注册"**
3. 使用手机号注册并验证
4. 完成注册后进入控制台

---

## 第二步：获取 API Key

1. 登录后进入控制台
2. 点击左侧菜单 **"API Keys"**
3. 点击 **"新建 API Key"**
4. 输入名称（如 `codex`），点击确认
5. **立即复制**生成的 Key

---

## 第三步：配置 Codex

```toml
# ~/.codex/config.toml

[model_providers.kimi]
name = "kimi"
api_key = "sk-你的API Key"
base_url = "https://api.moonshot.cn/v1"

[model]
provider = "kimi"
name = "moonshot-v1-8k"
```

---

## 第四步：验证

```bash
codex
```

输入测试：
```
你好，请告诉我你是哪个模型，以及你支持多长的上下文
```

---

## 可用模型列表

| 模型名称 | 上下文长度 | 适用场景 |
|----------|-----------|----------|
| `moonshot-v1-8k` | 8K tokens | 日常小任务，速度最快 |
| `moonshot-v1-32k` | 32K tokens | 中等规模代码分析 |
| `moonshot-v1-128k` | 128K tokens | 大型代码库，长文档分析 |
| `kimi-k1.5-turbo` | 128K tokens | 最新推理增强模型 |

::: tip 推荐
- 日常编程任务：`moonshot-v1-8k`（速度快，成本低）
- 分析整个项目/读大文件：`moonshot-v1-128k`（上下文超长）
:::

### 使用长上下文版本

```toml
[model]
provider = "kimi"
name = "moonshot-v1-128k"
```

适合这类任务：
```
读取整个 src 目录下的所有代码，帮我梳理模块依赖关系并画出图表
```

---

## 完整配置示例

```toml
# ~/.codex/config.toml

[model_providers.kimi]
name = "kimi"
api_key = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
base_url = "https://api.moonshot.cn/v1"

[model]
provider = "kimi"
name = "moonshot-v1-8k"

[agent]
approval_mode = "auto"
```

---

## 常见问题

### 速度较慢

Kimi 在高峰期（白天）响应可能较慢，可以尝试：
1. 切换到 `moonshot-v1-8k`（最快）
2. 在非高峰时段使用

### 额度用完

前往 [platform.moonshot.cn](https://platform.moonshot.cn) 控制台充值，价格按 tokens 计费。
