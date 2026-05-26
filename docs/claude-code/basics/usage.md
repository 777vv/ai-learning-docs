# 6. 基础使用

::: info 本章你将学到
- 三种运行模式 + **你该用哪个模式的决策树**
- 管道输入（带每条命令的小白解释）
- 会话续接和命名习惯
- @引用文件 / 粘贴图片 / 拖入文件 / 贴 URL / 跑 Shell 命令
- 几种实用工作模式（计划模式、额外目录、不污染上下文）
:::

## 6.1 三种运行模式 + 决策树

| 命令 | 模式 | 典型场景 |
|------|------|---------|
| `claude` | **交互式** | 日常开发，跟 AI 持续对话 |
| `claude "任务描述"` | **交互 + 初始提示** | 你已经知道想干啥，让 Claude 接着话茬开始 |
| `claude -p "查询"` | **非交互（print）** | 脚本里调 / 一次性查询完就退 |

### 决策树：你该选哪个？

```
你想干什么？
│
├── 想跟 AI 对话、慢慢迭代代码      → claude
│
├── 已经想好一个具体任务，让它接手  → claude "任务描述"
│
├── 想在 shell / CI 脚本里调用      → claude -p "..."
│   │
│   ├── 需要解析结果   → 加 --output-format json
│   └── 输出很长 / 流式 → 加 --output-format stream-json
│
└── 想让它读 stdin 的内容          → 用管道，见 6.2
```

### 交互式模式

```bash
claude                       # 启动空会话
claude "帮我理解这个项目"     # 带初始提示启动
```

进入后是 REPL（命令行对话框），可以一问一答。退出用 `/exit` 或 `Ctrl+D`。

### 非交互模式（`-p`）

`-p` 即 `--print`，执行一次查询后立即退出，**适合自动化场景**：

```bash
# 单次查询
claude -p "这个项目用了哪些依赖？"

# 结合 --output-format 输出结构化数据，方便脚本解析
claude -p "列出所有 API 端点" --output-format json

# 流式输出（边算边出，适合实时显示）
claude -p "分析这段日志" --output-format stream-json
```

::: tip `-p` 适合什么？不适合什么？
- ✅ 适合：CI 检查代码、定时任务、单次查询、组合 Unix 命令
- ❌ 不适合：需要多轮纠正的复杂任务、需要 Claude 修改文件并验证的工作流
:::

## 6.2 管道输入

Claude Code 遵循 Unix 哲学，能和其他命令组合使用。下面**每条命令都标注了用到的小工具**：

```bash
# 分析日志：tail = "取文件最后 N 行"
tail -200 app.log | claude -p "这里有异常吗？"

# 审查代码改动：git diff = "查看 git 未提交的修改"
git diff main | claude -p "这些改动有安全问题吗？"

# 读取文件：cat = "把文件内容打印出来"
cat error.log | claude -p "解释这个错误原因"

# 抓远程 API：curl -s = "静默拉取一个 URL"
curl -s https://api.example.com/data | claude -p "总结这个 API 响应"

# 分析 git 历史：--oneline 是简洁格式
git log --oneline -50 | claude -p "最近做了哪些主要改动？"
```

::: tip 用到的 Unix 小工具速查
- `tail -N` / `head -N` —— 取文件最后 / 最前 N 行
- `cat <file>` —— 打印整个文件内容
- `grep "pattern" <file>` —— 在文件里找包含某段文本的行
- `wc -l <file>` —— 数行数
- `|`（管道） —— 把左边命令的输出，作为右边命令的输入

不熟这些命令？让 Claude 给你写就行，告诉它"我想分析最近 200 行日志"，它会帮你拼好管道。
:::

## 6.3 会话续接与恢复

每次运行 `claude` 默认都是**全新会话**（不记得之前的对话）。续接方式：

```bash
# 继续当前目录最近的对话（最常用）
claude -c

# 交互式选择要恢复的会话（会显示列表）
claude -r

# 按会话名称恢复
claude -r "auth-refactor"

# 启动时给会话起名（以后可以按名称恢复）
claude -n "user-auth-feature"
```

::: tip 养成起名习惯
给重要会话起有意义的名字（`claude -n "任务名"`），以后可以精确恢复，不用在列表里找。比如：
```bash
claude -n "fix-login-bug-2026-05"
# 隔几天回来：
claude -r "fix-login"   # 模糊匹配也行
```
:::

## 6.4 输入技巧

### @引用文件

在提示里输入 `@` 可以引用特定文件，Claude 会自动读取它：

```
@src/auth/login.ts 这个函数里的 token 刷新逻辑有问题吗？
把 @package.json 里的所有依赖升级到最新版本
对比 @src/old-api.ts 和 @src/new-api.ts 的差异
```

**提示**：`@` 后会自动弹出文件名补全。

### 粘贴图片

截图后直接在终端 <kbd>Ctrl+V</kbd> / <kbd>Cmd+V</kbd> 粘贴，Claude 能理解图片内容：

```
[粘贴设计稿截图] 帮我用 CSS 实现这个布局
[粘贴错误截图] 这个报错是什么原因？
[粘贴 UI 截图] 和这个设计对比，我的实现有什么差异？
```

::: warning 终端不支持粘贴图片？
- macOS / Linux：iTerm2 / WezTerm / Ghostty / Alacritty 都支持
- Windows：Windows Terminal 支持
- 旧版 cmd / 简版 Terminal.app：不支持，需要先把图片**保存成文件**再 `@/path/to/image.png` 引用
:::

### 拖入文件

从文件管理器把文件拖入终端，会自动填入完整路径（macOS / 大多数 Linux 终端支持）。

### 贴 URL

```
阅读 https://docs.example.com/api 里的文档，然后帮我写对应的 SDK
```

::: warning URL 需要加入允许列表
Claude 默认不会主动访问 URL。第一次访问会询问你是否允许；想永久允许某域名，可以在 `/permissions` 里加白名单。
:::

### 运行 Shell 命令

提示里用 `!` 前缀可以**临时运行一条 shell 命令**，结果会插入对话：

```
! git status
! npm test 2>&1 | head -50
```

::: warning ! 前缀和工具调用的区别
- `! cmd` —— **当下立刻**跑一次命令，结果直接进 prompt（不消耗工具回合）
- 让 Claude 用 Bash 工具跑 —— Claude **判断需要**才跑，是独立的工具调用

`!` 适合"我现在就要塞个 git status 进去"，不是让 Claude 自己想要不要跑。
:::

## 6.5 实用工作模式

### 快速提问不污染上下文

```
/btw 顺便问一下，ES2022 的 await 在 top-level 怎么用？
```

`/btw` 的回答不会进入对话历史，**不消耗后续上下文**。适合"我突然好奇个语法问题"。

### 在计划模式下只读探索

```bash
# 启动时直接进入只读模式（不能修改任何东西）
claude --permission-mode plan
```

非常适合在动手前先彻底理解代码库——Claude 可以读、可以分析、**但无法误改文件**。详见 [12. 计划模式](/claude-code/advanced/plan-mode)。

### 带额外目录访问权限

默认 Claude 只能访问启动时的目录。如果需要它读别处：

```bash
# 给 Claude 额外访问 ~/shared-libs 的权限
claude --add-dir ~/shared-libs

# 同时给多个目录
claude --add-dir ~/shared-libs --add-dir ~/configs

# 在会话中动态添加
/add-dir ../shared-config
```

### 在隔离的 worktree 里跑

```bash
# 在新的 git worktree 里启动，不影响主分支
claude --worktree feature-x
```

适合"想让 Claude 大改一通、又不想污染当前分支"。

---

## 看完这一章你应该知道

✅ 三种模式：交互 / 带初始提示 / `-p` 非交互；不确定就 `claude`
✅ 管道适合给 Claude 喂 shell 命令的输出，常用：`tail` / `git diff` / `cat` / `curl -s`
✅ 多用 `claude -c` 续上次的会话，重要任务用 `-n` 起名字
✅ `@` 引用文件、`!` 跑 shell 命令、粘贴图片直接在终端粘
✅ 计划模式（`--permission-mode plan`）适合先想后做

---

**下一步**：[7. CLI 命令完整参考 →](/claude-code/basics/cli)
