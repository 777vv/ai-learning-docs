# 11. 自定义模型接入原理

> **本文你将学会：** Codex 如何连接第三方模型，以及判断一个模型是否可以接入的方法。

## 接入原理：OpenAI 兼容 API

Codex 通过 **OpenAI 兼容 API 格式** 与模型通信。只要一个模型的 API 实现了以下接口：

```
POST /v1/chat/completions
```

并且请求/响应格式与 OpenAI 一致，就可以接入 Codex。

---

## 通用配置模板

```toml
# ~/.codex/config.toml

[model_providers.my_provider]
name = "my_provider"              # 提供商标识（自定义）
api_key = "sk-xxxxxxxxxxxxxxxx"   # 该平台的 API Key
base_url = "https://api.xxx.com/v1"  # API 基础地址（到 /v1）

[model]
provider = "my_provider"
name = "model-name"               # 该平台的模型名称
```

---

## 如何判断一个模型是否兼容？

看这三个条件：

| 条件 | 检查方法 |
|------|----------|
| 支持 `/v1/chat/completions` 端点 | 查看该平台 API 文档 |
| 请求格式兼容 OpenAI | 文档中通常会写"OpenAI 兼容" |
| 支持 streaming（流式输出） | Codex 依赖 streaming 实时显示 |

大多数主流国内模型都满足这三个条件。

---

## 使用代理/网关

如果你通过 API 网关（如 Vercel AI Gateway、API2D 等）访问多个模型，配置方式相同：

```toml
[model_providers.gateway]
name = "gateway"
api_key = "gw-xxxxxxxx"
base_url = "https://your-gateway.com/v1"

[model]
provider = "gateway"
name = "deepseek/deepseek-v3"   # 网关路由格式（视网关而定）
```

---

## 本地 Ollama

Ollama 在本地提供 OpenAI 兼容 API，无需 API Key：

```toml
[model_providers.ollama]
name = "ollama"
api_key = "ollama"               # 随意填写，不校验
base_url = "http://localhost:11434/v1"

[model]
provider = "ollama"
name = "deepseek-coder-v2"       # 对应 ollama pull 的模型名
```

详细教程见 [Ollama 离线方案](/codex/china-models/ollama-local)。

---

## 各国内平台对应的 base_url

| 平台 | base_url |
|------|----------|
| DeepSeek | `https://api.deepseek.com/v1` |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Kimi（月之暗面） | `https://api.moonshot.cn/v1` |
| 智谱 AI | `https://open.bigmodel.cn/api/paas/v4` |
| 豆包（字节跳动） | `https://ark.cn-beijing.volces.com/api/v3` |
| 文心一言（百度） | `https://qianfan.baidubce.com/v2` |
| Ollama（本地） | `http://localhost:11434/v1` |

各平台保姆级教程见 [国内模型对接](/codex/china-models/overview) 章节。
