# 16. Ollama 完全离线方案

> **官网：** [ollama.com](https://ollama.com)
>
> **本文你将学会：** 不依赖任何云服务 API，在本地运行大语言模型并接入 Codex，代码完全不出你的机器。

## 为什么选择 Ollama？

| 优势 | 说明 |
|------|------|
| **完全免费** | 无需 API Key，无调用费用 |
| **隐私最高** | 数据完全本地处理，不联网 |
| **无速率限制** | 随便调用，不限次数 |
| **离线可用** | 没有网络也能正常工作 |

**劣势：** 需要本地有足够的显存/内存（模型越大，要求越高）。

---

## 硬件要求参考

| 模型大小 | 最低内存/显存 | 推荐配置 |
|----------|-------------|----------|
| 7B 参数 | 8GB RAM（CPU 推理） | 16GB RAM 或 8GB 显存 |
| 14B 参数 | 16GB RAM | 16GB 显存 |
| 70B 参数 | 64GB RAM | 多卡 GPU |

::: tip 普通电脑也能跑
即使没有独立显卡，现代 CPU 也能运行 7B 模型（速度较慢，但可用）。
8GB 内存运行 7B 量化版无问题。
:::

---

## 第一步：安装 Ollama

### macOS

```bash
# 方法一：官网下载安装包（推荐）
# 前往 https://ollama.com/download 下载 macOS 版本

# 方法二：Homebrew
brew install ollama
```

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows

前往 [ollama.com/download](https://ollama.com/download) 下载 Windows 安装包（`.exe`），双击安装。

---

## 第二步：下载并运行模型

```bash
# 推荐：DeepSeek Coder V2（代码能力强）
ollama pull deepseek-coder-v2

# 备选：通用能力强的 Qwen2.5
ollama pull qwen2.5:14b

# 轻量版（内存不足时）
ollama pull deepseek-coder-v2:lite   # 更小的 DeepSeek
ollama pull qwen2.5:7b               # 7B 轻量版 Qwen
```

下载完成后，验证模型是否正常：

```bash
# 启动对话测试
ollama run deepseek-coder-v2
# 输入：你好，请写一个 Python 的快速排序
# Ctrl+D 退出
```

---

## 第三步：确认 Ollama 服务正在运行

Ollama 在后台以 HTTP 服务方式运行，默认地址 `http://localhost:11434`：

```bash
# 检查服务状态
curl http://localhost:11434/api/version

# 列出已下载的模型
ollama list
```

如果服务未运行，手动启动：
```bash
ollama serve
```

---

## 第四步：配置 Codex 使用 Ollama

```toml
# ~/.codex/config.toml

[model_providers.ollama]
name = "ollama"
api_key = "ollama"                        # 随意填写，Ollama 不校验
base_url = "http://localhost:11434/v1"    # Ollama 的 OpenAI 兼容端点

[model]
provider = "ollama"
name = "deepseek-coder-v2"               # 对应 ollama pull 的模型名
```

---

## 第五步：验证

```bash
codex
```

输入测试：
```
你好，你是什么模型？
```

如果正常回复，说明 Ollama 已成功接入 Codex 🎉

---

## 推荐的本地模型

### 代码任务

```bash
# DeepSeek Coder V2 （强烈推荐）
ollama pull deepseek-coder-v2

# 配置
name = "deepseek-coder-v2"
```

### 中文理解 + 代码综合

```bash
# Qwen2.5 Coder（阿里出品，中文好）
ollama pull qwen2.5-coder:14b

name = "qwen2.5-coder:14b"
```

### 轻量快速（内存有限）

```bash
ollama pull qwen2.5-coder:7b
name = "qwen2.5-coder:7b"
```

---

## 完整配置示例

```toml
# ~/.codex/config.toml

[model_providers.ollama]
name = "ollama"
api_key = "ollama"
base_url = "http://localhost:11434/v1"

[model]
provider = "ollama"
name = "deepseek-coder-v2"

[agent]
approval_mode = "auto"
```

---

## 常见问题

### Codex 报错 `Connection refused`

**原因：** Ollama 服务没有启动。

**解决：**
```bash
# 前台启动（看日志）
ollama serve

# 或后台启动
nohup ollama serve &
```

### 响应很慢

正常现象：本地 CPU 推理速度比云端 GPU 慢。

优化方法：
1. 使用更小的模型（7B 而非 14B）
2. 如果有 GPU，安装对应 CUDA 驱动后 Ollama 会自动使用 GPU
3. 使用量化版本（`:q4_0` 后缀，如 `qwen2.5-coder:7b-q4_0`）

### 模型名称找不到

```bash
# 查看已下载的模型列表
ollama list

# 确保 config.toml 中的 name 与列表中完全一致
```

---

## 查看所有可用模型

前往 [ollama.com/library](https://ollama.com/library) 查看所有可下载的模型，搜索 `coder` 可以筛选代码相关模型。
