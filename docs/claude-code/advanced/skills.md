# 13. 技能（Skills）

::: info 本章你将学到
- Skills 是什么、解决什么问题（vs CLAUDE.md / Hook 的关键区别）
- 5 分钟跑通你的第一个 Skill（PR 摘要实战）
- 文件结构 + 三种存放位置
- frontmatter 字段详解（哪些必填、哪些可选）
- 进阶用法：带参数、动态上下文注入、隔离运行
- 6 个开箱即用的官方 Bundled Skills
- 常见问题速查（Skill 不触发？参数没替换？）
:::

## 13.1 一句话搞懂 Skills

::: tip 三件套对比，先记住区别再看细节
| | 何时加载 | 谁触发 | 适合放什么 |
|---|---|---|---|
| **CLAUDE.md** | **每次会话都加载**，常驻上下文 | 自动（你看不到加载过程） | 项目的"常识"——技术栈 / 规范 / 红线 |
| **Skill** | **被调用时才加载**，按需消耗 | 自动识别 or 手动 `/name` | 详细工作流 / 长文档 / 一次性深加工 |
| **Hook** | 工具调用前后**强制触发** | 系统按事件触发 | 自动化动作（格式化 / 拦截危险命令） |
:::

**Skill 解决什么问题？**

CLAUDE.md 啥都往里塞，token 会爆。把"偶尔才用到的详细流程"挪到 Skill 里——比如「PR 摘要怎么写」「客户问题工单怎么处理」「发周报模板」——Claude **平时看不到这些内容**，只有用户说「写个 PR 摘要」时才加载，省 token 又能写得很详细。

## 13.2 5 分钟跑通你的第一个 Skill

我们做一个最简单又实用的：**PR 摘要 Skill**——告诉 Claude 一个 PR 编号，它自动拉 diff、写摘要。

### 第 1 步：创建 Skill 目录和文件

```bash
mkdir -p ~/.claude/skills/pr-summary
```

::: tip 个人级 vs 项目级 位置选哪个？
- **`~/.claude/skills/`** —— 个人级，所有项目都能用（适合通用 Skill）
- **`.claude/skills/`** —— 项目级，跟当前项目走，可提交 git 团队共享
- 入门**先放个人级**，玩熟了再考虑团队共享
:::

### 第 2 步：写 SKILL.md

新建 `~/.claude/skills/pr-summary/SKILL.md`：

```markdown
---
name: pr-summary
description: 总结一个 GitHub PR 的改动内容、风险点和测试覆盖。
             当用户说"总结 PR #xxx"或"看下这个 PR"时使用。
allowed-tools:
  - Bash(gh *)
  - Read
---

按以下格式写一份 PR 摘要：

## 当前 PR 上下文（自动获取）
- 元信息：!`gh pr view $ARGUMENTS`
- diff：!`gh pr diff $ARGUMENTS`
- CI 状态：!`gh pr checks $ARGUMENTS`

## 输出格式

### 一句话说明
（PR 想达到什么目标，30 字内）

### 改动要点
（3-5 条关键改动，每条一行）

### 潜在风险
（如有：影响的兼容性、数据迁移、性能等）

### 测试覆盖
（有没有新加测试？覆盖哪些场景？）
```

### 第 3 步：调用

进 Claude Code，两种调用方式都能用：

**方式 A：显式调用**
```
/pr-summary 1234
```

**方式 B：自然语言（Claude 自动识别）**
```
帮我看下 PR #1234 在干嘛
```

Claude 会自动加载这个 Skill、把 `$ARGUMENTS` 替换成 `1234`、跑 `gh pr view 1234` 拉数据，按你写的格式输出。

::: warning 前提：装好 `gh` 命令
这个 Skill 用到了 GitHub CLI（`gh`）。没装的话先 [装一下](https://cli.github.com/)，并跑 `gh auth login` 登录。
:::

### 第 4 步：怎么知道 Skill 真的被加载了？

跑 `/help` 或 `/skills`，能看到列表里有 `pr-summary` 就是装好了。或者在 `claude --debug` 模式下看启动日志。

## 13.3 文件结构与存放位置

| 作用范围 | 路径 | 适合谁 |
|---|---|---|
| **个人级** | `~/.claude/skills/<name>/SKILL.md` | 所有项目都能用，个人偏好 |
| **项目级** | `.claude/skills/<name>/SKILL.md` | 跟项目走，提交 git 团队共享 |
| **插件提供** | `<plugin>/skills/<name>/SKILL.md` | 安装第三方插件时自动带来 |

**目录结构**（一个 Skill = 一个目录）：

```
~/.claude/skills/pr-summary/
├── SKILL.md          ← 必须叫这个名字
├── template.md       ← 可选：辅助文件，SKILL.md 里可以引用
└── examples/         ← 可选：示例资料
    └── good-pr.md
```

::: tip 为什么是目录而不是单文件
让你能把辅助资料（模板、示例、参考文档）跟 SKILL.md 放一起。SKILL.md 里可以 `@template.md` 引用同目录其他文件。
:::

## 13.4 frontmatter 字段详解

```yaml
---
name: skill-name                    # 名称（小写字母、数字、连字符）
description: 做什么，什么时候用     # 影响 Claude 是否自动触发！写得具体
arguments:                          # 位置参数（可选）
  - name: issue-number
    description: GitHub issue 编号
disable-model-invocation: true      # true = 只能手动调用，不会自动触发
user-invocable: false               # false = 从 / 菜单隐藏
allowed-tools:                      # 技能活跃时自动允许的工具
  - Bash(gh *)
  - Read
model: opus                         # 技能活跃时切换到指定模型
paths:                              # 只在处理这些文件时激活
  - "src/api/**/*.ts"
context: fork                       # 在隔离的子代理上下文中运行
---
```

**字段速查表**：

| 字段 | 必填 | 默认值 | 何时用 |
|---|---|---|---|
| `name` | ✅ | 无 | 永远要写，决定 `/name` 触发命令 |
| `description` | ✅ | 无 | **重中之重**——决定 Claude 是否自动触发 |
| `arguments` | ❌ | 空 | 需要 `$ARGUMENTS` 接收参数时 |
| `allowed-tools` | 推荐 | 继承会话权限 | 限制 Skill 只能用哪些工具，更安全 |
| `disable-model-invocation` | ❌ | false | 想强制只手动调（如重要操作） |
| `user-invocable` | ❌ | true | 想从 `/` 菜单隐藏（如内部 Skill） |
| `model` | ❌ | 当前会话模型 | Skill 任务复杂，临时切到 opus |
| `paths` | ❌ | 全部文件 | Skill 只对特定文件类型激活 |
| `context` | ❌ | 主会话 | 需要隔离避免污染主会话上下文 |

::: warning description 写得好不好，决定 Skill 用不用得起来
Claude 是看 description 判断"现在该不该自动触发这个 Skill"的。模糊的 description = 永远不会被自动触发。

**反例（差）**：
```yaml
description: 代码审查
```

**正例（好）**：
```yaml
description: 审查 Pull Request 的代码质量、安全漏洞和性能问题。
             当用户说"审查这个 PR"、"看看这段代码"、"code review"时使用。
```
:::

## 13.5 进阶用法

### 用法 1：带参数

用 `$ARGUMENTS` 占位，调用时跟在斜杠命令后传入：

```markdown
---
name: fix-issue
description: 修复一个 GitHub issue。用户说"修复 issue #xxx"时使用。
arguments:
  - name: issue-number
    description: GitHub issue 编号
allowed-tools:
  - Bash(gh *)
  - Read
  - Edit
  - Bash(git *)
---

修复 GitHub issue #$ARGUMENTS，按我们的编码规范：

1. `gh issue view $ARGUMENTS` 看 issue 详情
2. 找到相关代码、理解根本原因
3. 实现修复
4. 写测试覆盖这个 bug
5. 创建 commit 和 PR，PR 描述里 `Fixes #$ARGUMENTS`
```

调用：
```
/fix-issue 1234
```

::: tip 多个参数
`$ARGUMENTS` 是**整串参数**。如果你写 `/fix-issue 1234 priority-high`，`$ARGUMENTS` 会是字符串 `"1234 priority-high"`。需要解析的话在 Skill 里自己拆。
:::

### 用法 2：动态上下文注入

用 `` !`<命令>` `` 语法，**在 Skill 内容发给 Claude 之前先执行命令**，把输出嵌入提示：

```markdown
---
name: morning-standup
description: 早会准备：列出我昨天的提交和今天的待办
allowed-tools:
  - Bash(git *)
  - Bash(gh *)
---

## 我昨天做了什么（自动获取）
- 我的提交：!`git log --since="1 day ago" --author="$(git config user.email)" --oneline`
- 我创建的 PR：!`gh pr list --author @me --state all --limit 5`

## 我今天可能要做（自动获取）
- 待办 issue：!`gh issue list --assignee @me --state open --limit 5`

## 你的任务
基于以上，帮我整理一段 3 分钟早会发言：
1. 昨天进展（重点）
2. 今天计划
3. 阻塞或需要帮助的事
```

::: tip ` ` !`command` `` vs 让 Claude 自己跑 `Bash`
`` !`command` `` 是**Skill 加载时立刻跑**，结果直接嵌入提示，**不消耗工具调用回合**。让 Claude 用 Bash 工具跑则是个独立工具调用，更慢且消耗 token。前者适合"必须有的上下文"，后者适合"按需查询"。
:::

### 用法 3：在隔离子代理里运行

设置 `context: fork`，Skill 会在**独立的子代理上下文**里跑，不污染主会话：

```yaml
---
name: security-audit
description: 对当前代码做安全审计，发现常见漏洞
context: fork
model: opus
allowed-tools:
  - Read
  - Grep
  - Glob
---

扫描代码库找出以下安全问题：

1. 硬编码的 API Key / Token / 密码
2. SQL 注入风险
3. 命令注入风险（exec / eval / shell=True）
4. 不安全的反序列化
5. 缺失的认证 / 鉴权检查

按风险等级排序输出，每条给：文件:行号 + 代码片段 + 修复建议
```

**什么时候用 fork？**

- 任务输出特别长（如安全扫描报告），不想塞回主会话
- 想让 Skill 独立用 opus 跑（成本高的深度任务），但主会话保持 sonnet
- 防止 Skill 内部的中间推理污染你后续的对话

## 13.6 内置 Skills（开箱即用）

Anthropic / Claude Code 自带的 Skill：

| 命令 | 功能 | 适合时机 |
|---|---|---|
| `/simplify` | 三个代理并行审查代码质量 / 复杂度 / 可读性，然后修复 | 写完一段复杂代码后 |
| `/debug [描述]` | 开详细调试日志，分析问题根因 | 程序行为诡异、查不到原因 |
| `/batch <指令>` | 大规模并行改动，自动拆分任务 | 重命名 / 批量替换跨多文件 |
| `/loop [间隔] [prompt]` | 循环执行（如每 5 分钟跑一次） | 看 deploy、轮询 CI |
| `/claude-api` | 加载 Anthropic SDK 参考文档 | 写 Claude API 应用时 |
| `/fewer-permission-prompts` | 分析历史，生成权限白名单 | 用了一阵子嫌 prompt 太烦 |

跑 `/help` 看你当前能用哪些 Skill（包括第三方插件带的）。

## 13.7 常见问题速查

### Q：写了 Skill 但 Claude 从不自动调用

99% 是 description 写得太模糊。**改成"具体场景 + 具体触发词"**：

```yaml
# ❌
description: 写 commit

# ✅
description: 按团队规范写 git commit 消息（type(scope): subject 格式）。
             用户说"写 commit"、"提交一下"、"帮我 commit"时使用。
```

### Q：`$ARGUMENTS` 没被替换，原文输出

检查：
1. 调用时**有没有传参数**？`/fix-issue` 没传 → `$ARGUMENTS` 是空串
2. 在 frontmatter 的 `arguments` 字段里**声明过这个参数**没？没声明也能用，但不规范

### Q：Skill 跑了一半报权限错

`allowed-tools` 没写全。Skill 用到的所有命令模式都要在 `allowed-tools` 里列出来，否则会触发权限确认。

### Q：怎么调试一个 Skill

```bash
claude --debug
```

看日志能看到 Skill 加载顺序、`$ARGUMENTS` 替换结果、`` !`cmd` `` 执行结果。

### Q：Skill 和 Subagent 的关系

- **Skill** = 可复用的**提示词模板**（带命令注入和参数）
- **Subagent** = 独立的**会话进程**（可以并行跑多个）
- Skill 里设 `context: fork` 本质就是用 Subagent 跑

详见 [14. 子代理（Subagents）](/claude-code/advanced/subagents)。

---

## 看完这一章你应该知道

✅ Skill = 按需加载的 Markdown 工作流模板，省 token、可复用
✅ 文件位置：个人级 `~/.claude/skills/` / 项目级 `.claude/skills/`
✅ **description 决定 Claude 自动触发**——写得越具体越好
✅ `$ARGUMENTS` 接收参数、`` !`cmd` `` 注入动态上下文、`context: fork` 隔离运行
✅ 6 个官方 Bundled Skills 开箱即用（`/simplify` / `/debug` 等）

---

**下一步**：[14. 子代理（Subagents） →](/claude-code/advanced/subagents)

下一章看怎么用多个独立子代理并行干活（Skill `context: fork` 的底层就是它）。
