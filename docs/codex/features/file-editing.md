# 6. 文件编辑与 git 回滚

> **本文你将学会：** Codex 怎么读写文件、改动如何被 git 追踪、不想要的操作怎么回滚、超大文件的处理技巧。

::: tip 一句话总结
**Codex 的所有改动都被 git 跟踪**——这意味着你随时能看到 / 撤销任何修改。前提是：**在 git 仓库里启动 Codex**。
:::

## Codex 的文件操作机制

```
你下指令
   ↓
Codex 读取相关文件
   ↓
生成修改方案
   ↓
展示 diff（绿色 + / 红色 -）
   ↓
(Auto 模式：自动执行 / 只读模式：等你确认)
   ↓
写入文件 → 自动 git commit
```

::: info 为什么自动 commit？
Codex **每次改文件都会做一个 git 提交**——好处是：
- 每个 commit = 一次明确的操作记录
- 想看"刚才那一步改了啥"：`git show HEAD`
- 想撤销那一步：`git revert HEAD` 或 `git reset --hard HEAD~1`

**前提是你 `git init` 了**。没有 git 的目录里 Codex 仍然能改文件，**但失去回滚保护**。
:::

## 查看 Codex 做了哪些改动

### 实时（操作中）

Codex UI 中实时显示每次修改的 diff：
- 🟢 **绿色**：新增的行
- 🔴 **红色**：删除的行

按 `↑` / `↓` 翻看历史，按 `q` 关闭 diff 视图。

### 操作后（命令行）

```bash
# 看 Codex 的操作历史（每次操作 = 一个 commit）
git log --oneline

# 看最近一次操作的改动
git diff HEAD~1

# 看某个特定 commit 的改动
git show <commit-hash>

# 看当前**还没提交**的改动（一般情况下应该是空）
git diff
```

::: info `HEAD` / `HEAD~1` 是啥？
- `HEAD` = 当前最新 commit
- `HEAD~1` = 往前 1 次 commit
- `HEAD~3` = 往前 3 次 commit
- `git diff HEAD~1` = 对比"当前 vs 上一次"
:::

## 回滚操作

### 只想撤销最近一次

```bash
git revert HEAD
# 这会**新建一个 commit** 来反向应用刚才的改动
# 优点：git log 历史保留，能看到"撤销了 X"
```

或者更彻底：
```bash
git reset --hard HEAD~1
# 直接删除最近一次 commit，工作目录恢复到那之前
# ⚠️ 历史不见了，谨慎用
```

### 撤销最近 N 次

```bash
# 1. 先查历史，找到想回到的位置
git log --oneline

# 看到类似：
# a1b2c3d Codex: fix login bug
# d4e5f6g Codex: refactor auth
# ...

# 2A. revert 方式（保留历史）
git revert HEAD~3..HEAD

# 2B. reset 方式（删除历史，谨慎）
git reset --hard HEAD~3
```

### 只回滚某个文件

```bash
# 把 src/app.ts 恢复到 2 次操作之前的版本
git checkout HEAD~2 -- src/app.ts
```

::: tip revert vs reset 的选择
- **想保留完整历史**（团队协作 / 公开仓库）→ `revert`
- **私人项目 / 临时实验**（历史不重要）→ `reset --hard`
:::

## 文件编辑的默认范围

**Auto 模式**下，Codex 默认只能编辑**当前工作目录及其子目录**内的文件：

```bash
cd ~/my-project
codex
# → Codex 只能操作 ~/my-project/ 下的文件
```

要让 Codex 访问其他目录：

```bash
# 启动时加多个允许的目录
codex --add-dir ~/shared-libs --add-dir ~/configs
```

或在会话中：
```
/add-dir ../sibling-project
```

详见 [Agent 权限模式](/codex/features/agent-modes)。

## 多文件同时编辑

Codex 能在一次对话中按顺序处理多个文件：

```
重构用户认证模块：
- 将 auth.js 拆分为 auth-login.js 和 auth-register.js
- 更新 routes/index.js 中的引用
- 在每个新文件顶部添加 JSDoc 注释
```

你会在 UI 中看到每一步的进度——每个文件改完一个 commit。

## 推荐工作流：与 git 配合

::: tip 标准流程
```bash
# 1. 开始前确保工作区干净
git status
# 应该输出 "nothing to commit, working tree clean"

# 2. 启动 Codex 完成任务
codex

# 3. 任务完成后看 Codex 做了哪些 commit
git log --oneline

# 4A. 满意：把 Codex 的多个 commit 合并成一个有意义的提交
git reset --soft HEAD~N        # N 是 Codex 的 commit 数
git commit -m "feat: 实现用户认证模块"

# 或者用交互式 rebase 精修
git rebase -i HEAD~N

# 4B. 不满意：全部回滚
git reset --hard HEAD~N
```
:::

## 处理大文件

::: info 为什么大文件特殊
LLM 有"**上下文窗口**"限制（一次能处理的最大 token 数）。GPT-5.2-codex 是 200K token，但实际中超过 5000 行的单文件会让 Codex 反应变慢、容易遗漏细节。
:::

**3 种策略，按场景选**：

### 策略 1：指定行范围

```
只修改 utils.js 中 150-200 行的 parseDate 函数，其他部分不要动
```

适合：知道具体要改哪段。

### 策略 2：先拆分再处理

```
1. 先看一眼 huge-file.js（不要全读，只列结构）
2. 把它按功能拆成多个文件
3. 我们再针对要改的那个小文件操作
```

适合：大文件本来就该拆。

### 策略 3：让 Codex 只用 grep / 部分读

```
用 grep 找 huge-log.txt 里所有 "ERROR" 行，统计错误类型
```

Codex 会用 `grep` / `awk` 等命令处理，**不全读到上下文**。适合日志、CSV 等大数据。

## 注意事项

::: warning 没初始化 git 的目录
Codex 仍然能编辑文件，**但失去回滚能力**。强烈建议先：
```bash
cd 你的项目
git init
git add . && git commit -m "initial"
```
:::

::: warning 二进制文件
Codex 主要为文本文件设计。对二进制（图片 / 视频 / .docx / .xlsx）通常**只能告诉你"那是个二进制文件"**，不会改它。如果你需要 Codex 处理表格 / 图，让它**先用脚本读出内容**（如 pandas）。
:::

::: warning 不要改用户主目录的关键文件
Codex 不会主动改 `~/.zshrc` / `~/.bashrc` 等，但你要小心**在主目录启动 Codex**——主目录范围大、风险高。**永远在具体项目目录启动**。
:::

## 排错速查

### Q：Codex 改完文件，git log 里没看到自动 commit？

可能：
1. 当前目录不是 git 仓库——跑 `git init` 初始化
2. Codex 启动时检测不到 git——重启会话试试
3. 你设了 `disable_auto_commit = true`？看 config.toml

### Q：想撤销但 `git log` 看不到 Codex 的 commit

```bash
# 把 Codex 改但还没 commit 的全扔掉
git checkout .

# 加上未跟踪的新文件
git clean -fd
```

### Q：怎么让 Codex 改文件时**不**自动 commit

config.toml：
```toml
[agent]
auto_commit = false
```

这样 Codex 改完文件不 commit，最后由你统一一个 commit。

## 下一步

- 🔐 [Agent 权限模式](/codex/features/agent-modes) — 控制 Codex 能不能改文件
- 🔧 [Shell 命令执行](/codex/features/shell-commands) — Codex 怎么跑命令
- 📝 [AGENTS.md 自定义指令](/codex/advanced/agents-md) — 项目级规范
