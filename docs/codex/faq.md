# 24. 常见问题 FAQ

::: tip 用法：直接搜
本章用 <kbd>Ctrl+F</kbd>（macOS <kbd>Cmd+F</kbd>）搜你的关键字，比按章节读快得多。
:::

## 🔥 新手最常踩的 5 个坑（先看这里）

### 坑 1：装完跑 `codex` 报"command not found"

`npm install -g @openai/codex` 装到的目录不在 PATH 里。

```bash
# 看 npm 全局 bin 目录
npm config get prefix
# 输出类似：/Users/me/.npm-global

# 加进 PATH（如果还没加）
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 重新跑
codex --version
```

**根本解法**：用 nvm 装 Node.js，自带正确 PATH。[详见](/claude-code/guide/nodejs#为什么用-nvm-而不是直接装)

### 坑 2：跑 `codex` 报"未登录" / "401 Unauthorized"

API Key 没设上 / 拼错 / 已过期。

```bash
# 1. 确认环境变量
echo $OPENAI_API_KEY

# 2. 如果空，重设
echo 'export OPENAI_API_KEY="sk-xxxx"' >> ~/.zshrc
source ~/.zshrc

# 3. 在当前终端启动 codex（环境变量只对当前 shell 有效）
codex
```

国内用户：环境变量名**不是** `OPENAI_API_KEY`——见 [国内模型对接](/codex/china-models/overview)。

### 坑 3：国内访问 OpenAI 超时 / 连不上

99% 是 OpenAI 在国内被墙。两条路：

- **A. 配代理**：[Claude Code 代理配置](/claude-code/china/proxy)（Codex 通用）
- **B. 直接换国内模型**（推荐）：[国内模型对接总览](/codex/china-models/overview)，免翻墙

### 坑 4：Codex 改了一堆文件，我不想要

```bash
# 看看改了什么
git diff HEAD~1

# 全部回滚到最近一次 commit 前
git reset --hard HEAD~1

# 或更彻底，回到最初状态
git reset --hard HEAD~N    # N = Codex 做了多少次操作
```

**前提**：你在 git 仓库里启动的 Codex。如果不是——以后必须 `git init`，[详见](/codex/features/file-editing)。

### 坑 5：Codex 每次都问"是否允许"，太烦了

切到 Auto 模式（默认就是），或加白名单：

```toml
# ~/.codex/config.toml
[agent]
approval_mode = "auto"
auto_approve = ["npm install*", "npm test*", "git diff*"]
```

详见 [Agent 权限模式](/codex/features/agent-modes#排错速查)。

---

## 安装问题

### Q：安装 `@openai/codex` 报权限错误

::: danger 不要用 sudo
有人会说"加 sudo 就好了"——**绝对不要**。`sudo npm install -g` 会污染 npm 目录所有权，**之后每次装包都得 sudo**，越搞越乱。
:::

正确做法：

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g @openai/codex
```

**根本解法**：用 nvm 装 Node.js，[详见](/claude-code/guide/nodejs#为什么用-nvm-而不是直接装)。

### Q：Windows 上安装失败

推荐用 WSL2 环境，[Windows 完整配置](/codex/advanced/windows-setup)。

### Q：npm install 卡住 / 超慢

国内网络问题。换淘宝镜像：
```bash
npm config set registry https://registry.npmmirror.com
```

---

## 认证问题

### Q：报错 `401 Unauthorized`

按这个顺序排查：
- 检查 API Key 是否完整（开头 `sk-`，没多余空格 / 换行）
- 检查 Key 是否过期或被撤销（去对应平台控制台看 Key 列表）
- 重新生成 Key，更新到环境变量 / config.toml，**重启 Codex**

### Q：报错 `429 Too Many Requests`

超出频率限制。
- 等几秒重试
- 充值升级到付费档（频率限制更高）
- 换不同的 provider 错峰

### Q：报错 `Insufficient credits` / 402

余额不足。去对应平台充值。DeepSeek 最低 ¥1 起充。

### Q：API Key 丢了怎么办

**API Key 不能找回**——只能：
1. 去平台控制台**删掉旧的**
2. **创建新的**（这次立刻保存）
3. 更新到环境变量 / config.toml
4. 重启 Codex

---

## 使用问题

### Q：Codex 修改了不该改的文件

```bash
# 看改了啥
git diff HEAD~1

# 撤销最近一次（保留历史）
git revert HEAD

# 或硬撤销最近 N 次
git reset --hard HEAD~N
```

详见 [文件编辑与回滚](/codex/features/file-editing#回滚操作)。

### Q：Codex 不理解我的指令

试试：
1. **提供更多上下文**：说明技术栈、框架版本
2. **分解任务**：把"实现登录"拆成"先看 auth 现有代码 → 再加路由 → 再加表单"
3. **创建 AGENTS.md**：[让 Codex 了解你的项目规范](/codex/advanced/agents-md)

### Q：Codex 每次操作都要确认，太烦

参考[上面的坑 5](#坑-5-codex-每次都问-是否允许-太烦了)。

### Q：如何让 Codex 只读，不修改文件

```bash
codex --approval-mode read-only
```

或会话中：
```
/mode read-only
```

[详见](/codex/features/agent-modes#只读模式-read-only)。

### Q：怎么让 Codex 记住项目的代码规范

在项目根目录建 `AGENTS.md`，每次启动 Codex 自动加载。[详见](/codex/advanced/agents-md)。

---

## 模型问题

### Q：如何知道现在使用的是哪个模型

在 Codex 对话中问：
```
你是哪个模型？版本是多少？
```

或会话中：
```
/config
```

显示当前生效的所有配置 + 来源。

### Q：国内模型效果差很多吗

**代码任务**：DeepSeek V3 在 HumanEval / MBPP 等基准上**与 GPT-4o 相当**，日常开发体验差距不明显。

**复杂创意 / 英文写作**：OpenAI 旗舰略胜。

**对 Codex 用户**：写代码 / 改 bug / 重构这些 Codex 的主战场，国内模型完全够用。

### Q：可以同时配多个模型快速切换吗

可以。`config.toml` 配多个 `[model_providers.*]`，启动时 `codex --provider deepseek` / `--provider openai`。[详见](/codex/guide/authentication#多模型管理)。

### Q：我一个月会花多少钱

参考估算：

| 用量 | gpt-5.2-codex | DeepSeek |
|---|---|---|
| 每天偶尔用一下 | ¥30-60 / 月 | ¥3-10 / 月 |
| 工作日每天 2 小时 | ¥150-300 / 月 | ¥15-30 / 月 |
| 重度（CI + 日常）| ¥500-1500 / 月 | ¥50-150 / 月 |

[详细成本分析](/codex/models/openai-models#如何估算成本)。

---

## 国内模型问题

### Q：DeepSeek 免费额度用完了怎么办

[platform.deepseek.com](https://platform.deepseek.com) 充值。最低 ¥1 起充——一般 ¥10 用一个月。

### Q：Ollama 运行很慢

- **换更小的量化版本**：`qwen2.5-coder:7b-q4_0`（占内存少、速度快）
- **有独立显卡**：装 CUDA，Ollama 自动用 GPU，**速度提升 10+ 倍**
- **没显卡的 CPU**：跑 7B 模型每秒约 10-20 token，相对慢但可用

### Q：Ollama 报 `Connection refused`

Ollama 服务没启动：
```bash
ollama serve
```

或者把 Ollama 设为开机自启动（macOS：Ollama 应用打开后右上角图标会常驻；Linux：用 systemd）。

### Q：国内模型对 Codex 的兼容性都一样吗

不是。**DeepSeek 兼容性最好**（推荐入门）；通义千问、Kimi 次之；某些小厂模型可能在 tool calling、长上下文等场景有兼容问题。

**遇到怪问题**：先换 DeepSeek 试，能跑 = 是模型兼容性问题；不能跑 = 是 Codex 本身的 bug。

---

## 工作流 / 集成

### Q：Codex 和 Claude Code 有什么区别

| 项目 | Codex CLI | Claude Code |
|------|-----------|-------------|
| 出品方 | OpenAI | Anthropic |
| 底层模型 | GPT 系列 / 可自定义 | Claude 系列 / 可自定义 |
| 开源 | ✅ 完全开源 | ✅ 完全开源 |
| 国内模型支持 | ✅ 支持 | ✅ 支持 |
| 配置语言 | TOML | JSON |
| 上下文窗口 | 200K（gpt-5.2-codex） | 200K（Claude 4） |

**怎么选**：
- 想试 Anthropic 旗舰模型（Claude Opus）→ Claude Code
- 想试 OpenAI 旗舰模型（GPT-5.5）→ Codex
- 国内用户用 DeepSeek → 两个都行（推荐同时装、对比着用）

### Q：能在 GitHub Actions 里跑 Codex 吗

可以。[详见 GitHub Action 集成](/codex/advanced/github-action)。

### Q：能在 VS Code 里集成 Codex 吗

可以，VS Code 内置终端跑 `codex` 即可。WSL2 用户配 WSL 扩展体验最佳，[详见](/codex/advanced/windows-setup#推荐-vs-code-wsl-插件)。

---

## 反馈 / 求助

### Q：在哪里提交 Bug 或建议

- **Codex 官方 GitHub**：[github.com/openai/codex/issues](https://github.com/openai/codex/issues)
- **本文档问题**：[提交 Issue](https://github.com/777vv/ai-learning-docs/issues)
- **本站学习群**：[加入交流群](/community)

### Q：怎么写一个好的 bug report

```markdown
## 环境
- OS: macOS 14 / Windows 11 / Ubuntu 22
- Codex 版本: （跑 `codex --version`）
- Node.js 版本: （跑 `node --version`）

## 复现步骤
1. 跑 ...
2. 输入 ...
3. 看到 ...

## 期望 vs 实际
期望：...
实际：（贴报错截图或文本）

## 已经试过的
- claude doctor 的输出（如有）
- 试过 --bare 模式吗？

## 调试日志
（跑 `codex --debug "api"`，附日志）
```
