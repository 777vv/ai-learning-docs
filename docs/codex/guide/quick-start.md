# 3. 快速开始

> **本文你将学会：** 配置好 API Key 后，5 分钟内完成你的第一个 Codex 任务。

::: tip 前提条件
- 已安装 Codex（参考 [安装指南](/codex/guide/installation)）
- 已有可用的 API Key
  - 没有 → 国内用户走 [国内模型对接](/codex/china-models/overview)（推荐）/ 海外用户走 [OpenAI 认证](/codex/guide/authentication)
:::

::: warning 国内用户：建议先看完这一节
本章默认演示用的是 `OPENAI_API_KEY`，但**国内用户大部分会用 DeepSeek / 通义千问 / Kimi 等国内模型**——配置方式不一样（环境变量名 + base URL）。

强烈建议**先看 [国内模型对接总览](/codex/china-models/overview)**（5 分钟看完），再回来跑本章的步骤。
:::

## 第一步：理解几个新名词（30 秒）

继续之前，下面这几个词在本章会反复出现：

::: info 1 分钟读懂
- **API Key**：调用 LLM 的"加油卡"密钥（一长串字符），类似 `sk-xxxxxxxxxxxx`
- **环境变量**：操作系统层面的全局配置——你设了一个 `OPENAI_API_KEY=sk-xxx`，所有终端程序都能读到它
- **shell 配置文件**（`.zshrc` / `.bashrc`）：你打开新终端时**自动加载**的脚本，永久环境变量放在这里
- **Git**：版本控制工具，跟踪文件什么时候被改了什么。Codex 通过它**记录每次改动**，方便你回滚
:::

::: tip 完全没听过这些？
回头看 [Node.js 与 npm 入门](/claude-code/guide/nodejs) + [Claude Code Git 章节](/claude-code/guide/requirements#_2-1-支持平台)，铺垫好基础再来。
:::

## 第二步：配置 API Key

API Key 通过**环境变量**告诉 Codex"用谁的 Key 调 LLM"。两种方式：

### 临时（当前终端会话有效，重开就没了）

```bash
export OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxx"
```

### 永久（推荐，重开终端也有）

把这条命令**追加进你的 shell 配置文件**——以后每次开终端自动生效：

::: code-group

```bash [macOS / Linux Zsh（macOS 默认）]
# 加进 ~/.zshrc
echo 'export OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxx"' >> ~/.zshrc
source ~/.zshrc

# 这两行做了啥：
# 1. echo 'xxx' >> ~/.zshrc  把这一行追加到 .zshrc 末尾
# 2. source ~/.zshrc          让当前终端立刻读一遍新内容（不用重启终端）
```

```bash [macOS / Linux Bash]
# 加进 ~/.bashrc
echo 'export OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxx"' >> ~/.bashrc
source ~/.bashrc
```

```powershell [Windows PowerShell]
# 永久写入用户级环境变量（关掉再开 PowerShell 才生效）
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "sk-xxxxxxxxxxxx", "User")

# 验证（关掉再开 PowerShell 后跑）
$env:OPENAI_API_KEY
```

:::

### 验证 API Key 设上了

```bash
echo $OPENAI_API_KEY      # macOS / Linux
$env:OPENAI_API_KEY       # Windows PowerShell
```

**预期输出**：你刚才设的那个 `sk-xxxxxx...`。如果是空的，说明没生效——重新跑一遍上面的设置命令。

::: warning 国内用户用 DeepSeek / Qwen 等
环境变量名**不是 `OPENAI_API_KEY`**——见 [国内模型对接](/codex/china-models/overview)，每家有自己的变量名。
:::

## 第三步：创建一个练习项目

::: info 为啥要单独建个空目录？
不要在你的正式代码仓库里玩 Codex——第一次用，Codex 可能跑出你不想要的改动。先在**空目录**里熟悉它，再到正式项目用。
:::

```bash
# 1. 在主目录建个练习用的空文件夹
mkdir codex-demo && cd codex-demo

# 2. 初始化 git 仓库（重要！）
git init
```

::: danger 务必在 git 仓库中使用 Codex
Codex 通过 git 记录所有改动——每次改文件前会自动 commit 一下。这意味着：
- 你能用 `git diff` 看 Codex 改了啥
- 不喜欢可以 `git checkout .` 一键回滚到改之前

**没有 git 初始化的目录中操作存在风险**——改坏了找不回。
:::

::: tip Git 没装？
- macOS：装了 Xcode Command Line Tools 就有，跑 `git --version` 试试
- Linux：`sudo apt install git`（Ubuntu）或 `sudo dnf install git`（Fedora）
- Windows：装 [Git for Windows](https://git-scm.com/downloads/win)，详见 [Claude Code 系统要求](/claude-code/guide/requirements#_2-1-支持平台)
:::

## 第四步：启动 Codex

```bash
codex
```

成功启动后，你会看到一个全屏终端 UI：
- 顶部是对话区域
- 底部是输入框

::: tip 第一次启动看到登录提示？
说明 Codex 没读到 `OPENAI_API_KEY`。退出（`Ctrl+C`），回到第二步检查环境变量。
:::

## 第五步：完成你的第一个任务

在输入框中输入以下内容，按回车发送：

```
创建一个 Python 脚本，读取当前目录下所有 .txt 文件，统计每个文件的行数并打印出来
```

你会看到 Codex：
1. **思考任务需求**（你能看到它的思考过程）
2. **创建** `count_lines.py` 文件
3. **写入代码**
4. **可能运行脚本验证**（这一步会弹出"是否允许执行"的确认）

::: tip 默认 Auto 模式的行为
- 在当前目录内的文件操作（读 / 写）→ **自动执行**
- 涉及外部网络、其他目录、危险命令 → **弹窗询问你**
- 详见 [Agent 权限模式](/codex/features/agent-modes)
:::

## 常用操作快捷键

| 按键 | 功能 |
|------|------|
| `Enter` | 发送消息 |
| `Shift + Enter` | 换行（不发送） |
| `Ctrl + C` | 中断当前操作 |
| `Ctrl + D` 或 输入 `exit` | 退出 Codex |
| `↑ / ↓` | 翻看历史消息 |
| `Esc` | 取消当前输入 |

## 查看和回滚改动

Codex 每次改文件前都会进行 git 提交，所以你可以随时：

```bash
# 查看 Codex 做了哪些改动
git log --oneline
git diff HEAD~1

# 回滚到操作前
git checkout HEAD~1 -- .

# 或者回滚到最初状态
git reset --hard HEAD~3  # 回退 3 次操作
```

::: info `HEAD` / `HEAD~1` 是啥
- `HEAD` = 当前最新提交
- `HEAD~1` = 往前 1 次提交
- `HEAD~3` = 往前 3 次提交
- `git diff HEAD~1` = 对比"当前 vs 上一次"
:::

## 在已有项目中使用

进入你的项目目录，直接启动 Codex：

```bash
cd ~/my-project
codex
```

建议在第一次使用时**告诉 Codex 项目背景**，这样它能更准确地理解你的需求：

```
这是一个 React + TypeScript 项目，使用 Tailwind CSS，后端是 Express。
帮我在 src/components 目录下创建一个 LoadingSpinner 组件。
```

::: tip 想让 Codex 每次都自动知道项目背景？
新建一个 `AGENTS.md` 文件写在项目根目录——详见 [AGENTS.md 自定义指令](/codex/advanced/agents-md)。
:::

## 实用提示词示例

以下是一些好用的提示词模板：

```bash
# 解释代码
解释 src/utils/auth.ts 这个文件的作用和主要函数

# 修复 Bug
运行 npm test，如果有测试失败，帮我修复

# 添加功能
给 UserCard 组件添加一个 onClick 属性，点击后触发 onSelect 回调

# 代码审查
帮我审查最近一次 git commit 的代码，列出潜在问题

# 重构
把 utils/helpers.js 里的所有函数改成 TypeScript 并加上类型注解
```

## 常见问题速查

### Q：跑 `codex` 报"未登录" / "找不到 API Key"

```bash
# 1. 确认环境变量真的设上了
echo $OPENAI_API_KEY

# 2. 如果为空，重新设并 source
echo 'export OPENAI_API_KEY="sk-xxxx"' >> ~/.zshrc
source ~/.zshrc

# 3. 在当前终端启动 codex（环境变量只对当前 shell 有效）
codex
```

### Q：报 "Unauthorized" / 401

API Key 过期 / 拼错 / 余额耗尽。去 [platform.openai.com](https://platform.openai.com) 检查 Key 和余额。

### Q：国内访问 OpenAI 超时

要么[配代理](/claude-code/china/proxy)，要么直接换 [国内模型](/codex/china-models/overview)（推荐）。

### Q：Codex 改了一堆文件我不想要

```bash
# 看看改了啥
git diff HEAD~1

# 全部回滚
git checkout HEAD~1 -- .

# 或重置工作目录到上次 commit
git reset --hard HEAD
```

## 下一步

掌握了基本用法后，进一步探索：

- 🔐 [Agent 权限模式](/codex/features/agent-modes) — 了解 Auto / 只读 / 完全三种模式的区别
- 📝 [AGENTS.md 自定义指令](/codex/advanced/agents-md) — 为项目配置专属 AI 行为
- 🇨🇳 [国内模型对接](/codex/china-models/overview) — 切换为国内模型降低使用成本
- ⚙️ [配置文件详解](/codex/config/config-basic) — 用 `config.toml` 精细控制
