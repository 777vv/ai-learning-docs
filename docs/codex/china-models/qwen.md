# 14. 通义千问 保姆级教程

> **官网：** [dashscope.aliyun.com](https://dashscope.aliyun.com) · [阿里云百炼平台](https://bailian.console.aliyun.com)
>
> **本文你将学会：** 从注册到配置，在 Codex 中使用阿里云通义千问模型。

## 通义千问简介

通义千问（Qwen）是阿里巴巴达摩院推出的大语言模型系列，具有：

- **国内访问最稳定**：依托阿里云基础设施，延迟低、稳定性高
- **免费额度慷慨**：新用户赠送大量免费 tokens
- **编程专属模型**：`qwen-coder-plus` 专门针对代码任务优化
- **模型系列丰富**：从轻量到旗舰多种选择

---

## 第一步：注册阿里云账号

1. 前往 [aliyun.com](https://www.aliyun.com) 注册账号（已有账号可跳过）
2. 完成实名认证（必须，否则无法使用 API）
3. 进入 **阿里云百炼平台**：[bailian.console.aliyun.com](https://bailian.console.aliyun.com)

::: tip 也可以直接从 DashScope 入口
[dashscope.aliyun.com](https://dashscope.aliyun.com) 是通义千问 API 的专属入口，注册并开通即可。
:::

---

## 第二步：开通 DashScope 服务

1. 登录后进入 [DashScope 控制台](https://dashscope.console.aliyun.com)
2. 如果未开通，点击 **"开通服务"**（免费开通）
3. 新用户会自动获得免费 token 额度

---

## 第三步：获取 API Key

1. 在 DashScope 控制台，点击右上角头像 → **"API-KEY 管理"**
2. 点击 **"创建新的 API-KEY"**
3. 复制生成的 API Key（格式：`sk-xxxxxxxxxxxxxxxx`）

---

## 第四步：配置 Codex

```toml
# ~/.codex/config.toml

[model_providers.qwen]
name = "qwen"
api_key = "sk-你的API Key"
base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"

[model]
provider = "qwen"
name = "qwen-coder-plus"
```

::: info base_url 说明
通义千问的 OpenAI 兼容端点是：
```
https://dashscope.aliyuncs.com/compatible-mode/v1
```
注意路径中有 `/compatible-mode/`，不要写错。
:::

---

## 第五步：验证

```bash
codex
```

输入测试问题：
```
你好，你是哪个模型？
```

---

## 可用模型列表

| 模型名称 | 特点 | 适用场景 |
|----------|------|----------|
| `qwen-coder-plus` | 代码专属，强推理 | 编程任务首选 |
| `qwen-coder-turbo` | 更快，稍弱 | 简单代码任务 |
| `qwen-max` | 旗舰通用模型 | 复杂综合任务 |
| `qwen-plus` | 均衡版 | 日常任务 |
| `qwen-turbo` | 最快最便宜 | 简单问答 |
| `qwen3-235b-a22b` | 最新旗舰（2025） | 最高性能 |

::: tip 代码任务推荐
使用 `qwen-coder-plus`，它是专门针对编程场景训练的模型，在代码生成和理解方面表现优于通用模型。
:::

---

## 完整配置示例

```toml
# ~/.codex/config.toml

[model_providers.qwen]
name = "qwen"
api_key = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"

[model]
provider = "qwen"
name = "qwen-coder-plus"

[agent]
approval_mode = "auto"
```

---

## 查看余额和用量

登录 [DashScope 控制台](https://dashscope.console.aliyun.com) → **"费用"** → **"资源包管理"** 查看剩余额度。

---

## 常见问题

### 报错：`InvalidApiKey`

检查 API Key 是否正确，确认已开通 DashScope 服务。

### 报错：`Model not found`

检查 `name` 字段是否正确，模型名称区分大小写，参考上方模型列表。

### 报错：`Access denied`

部分模型（如 `qwen3-235b`）需要单独申请权限，在控制台找到对应模型申请开通。
