# 17. 其他模型快速参考

本页提供智谱 AI、文心一言、豆包的快速接入配置，适合已熟悉接入流程的用户。

---

## 智谱 AI（GLM-4）

> **官网：** [open.bigmodel.cn](https://open.bigmodel.cn)

**注册地址：** [open.bigmodel.cn](https://open.bigmodel.cn) → 注册 → API Keys → 创建

```toml
# ~/.codex/config.toml

[model_providers.zhipu]
name = "zhipu"
api_key = "你的智谱 API Key"
base_url = "https://open.bigmodel.cn/api/paas/v4"

[model]
provider = "zhipu"
name = "glm-4-plus"
```

**可用模型：**

| 模型名 | 说明 |
|--------|------|
| `glm-4-plus` | 旗舰版，能力最强 |
| `glm-4-flash` | 极速版，成本极低，有免费额度 |
| `glm-4-air` | 均衡版 |
| `codegeex-4` | 代码专属模型 |

::: tip
`glm-4-flash` 有较大免费额度，日常轻量使用可以完全免费。代码任务推荐 `codegeex-4`。
:::

---

## 文心一言（百度）

> **官网：** [qianfan.baidu.com](https://qianfan.baidu.com)

**注册地址：** [qianfan.baidu.com](https://qianfan.baidu.com) → 注册百度账号 → 开通千帆平台 → 应用接入 → 创建应用获取 API Key

```toml
# ~/.codex/config.toml

[model_providers.ernie]
name = "ernie"
api_key = "你的千帆 API Key"
base_url = "https://qianfan.baidubce.com/v2"

[model]
provider = "ernie"
name = "ernie-4.5-turbo-128k"
```

**可用模型（部分）：**

| 模型名 | 说明 |
|--------|------|
| `ernie-4.5-turbo-128k` | 最新旗舰，128K 上下文 |
| `ernie-4.5-8k` | 标准版 |
| `ernie-lite-8k` | 轻量版，有免费额度 |

---

## 豆包（字节跳动）

> **官网：** [console.volcengine.com/ark](https://console.volcengine.com/ark)

**注意：** 豆包 API 需要通过**火山引擎**平台接入，注册稍微复杂一些。

**步骤：**
1. 注册 [火山引擎](https://www.volcengine.com) 账号（可用抖音账号登录）
2. 进入 [方舟控制台](https://console.volcengine.com/ark)
3. 开通服务 → 创建推理接入点（Endpoint）
4. 获取 API Key

```toml
# ~/.codex/config.toml

[model_providers.doubao]
name = "doubao"
api_key = "你的火山引擎 API Key"
base_url = "https://ark.cn-beijing.volces.com/api/v3"

[model]
provider = "doubao"
name = "doubao-pro-32k"    # 替换为你创建的接入点 ID
```

::: warning 豆包特别说明
豆包 API 中的 `name` 字段填写的是你在方舟控制台创建的**接入点 ID**（形如 `ep-20241201xxxxxx-xxxxx`），而不是模型名称。请在控制台找到你的接入点 ID 后填入。
:::

---

## 所有国内模型 base_url 汇总

```
DeepSeek:    https://api.deepseek.com/v1
通义千问:     https://dashscope.aliyuncs.com/compatible-mode/v1
Kimi:        https://api.moonshot.cn/v1
智谱 AI:     https://open.bigmodel.cn/api/paas/v4
文心一言:     https://qianfan.baidubce.com/v2
豆包:        https://ark.cn-beijing.volces.com/api/v3
Ollama:      http://localhost:11434/v1
```
