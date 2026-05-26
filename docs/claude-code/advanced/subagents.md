# 14. 子代理（Subagents）

::: info 本章你将学到
- 子代理是什么，解决什么问题
- 如何创建和配置子代理
- 内置子代理的使用方式
- 子代理 vs Skill 的选择
:::

## 14.1 子代理是什么

**子代理（Subagent）**是一个拥有**独立上下文窗口**的 Claude 实例，配备一套专属工具，为特定任务量身定制。

主要使用场景：

| 场景 | 为什么用子代理 |
|------|--------------|
| **代码库研究** | 读大量文件不污染主对话的上下文 |
| **无偏审查** | 让一个独立实例审查它自己刚写的代码（减少确认偏差）|
| **专项任务** | 安全审查、性能分析等需要专业视角的任务 |
| **并行工作** | 多个子代理同时处理不同任务 |

**子代理 vs Skill 的区别**：

| 特性 | Skill | Subagent |
|------|-------|---------|
| 上下文 | 与主会话共享 | 完全独立 |
| 工具 | 继承主会话 + 额外允许 | 独立定义 |
| 适合 | 改变 Claude 的行为方式 | 需要隔离的重任务 |

### 具体场景对比：什么用 Skill / 什么用 Subagent

| 场景 | 用 Skill | 用 Subagent | 理由 |
|---|---|---|---|
| **写 commit 信息** | ✅ | ❌ | 一次性、需要主会话上下文（知道改了啥） |
| **PR 摘要** | ✅ | ❌ | 简短任务，没必要新开上下文 |
| **代码审查（自己写的）** | ❌ | ✅ | 让独立实例审查，避免确认偏差 |
| **安全审计整个项目** | ❌ | ✅ | 输出大、需要读大量文件，污染主会话 |
| **早会准备模板** | ✅ | ❌ | 固定流程 + 命令注入，Skill 完美 |
| **并行调研 3 个方案** | ❌ | ✅✅✅ | 必须并行，每个独立上下文 |
| **从 0 到 1 写一个组件** | 都行 | 都行 | 简单组件用 Skill，复杂的用 Subagent |
| **fix #123 修个 bug** | ✅ | ❌ | 一次性流程，Skill 模板 + `$ARGUMENTS` 就行 |

**记法**：
- **Skill = 工作流模板**——固定流程，按步骤走
- **Subagent = 独立实例**——并行、隔离、长任务

也可以**组合用**：Skill 里设 `context: fork` 就是用 Subagent 跑这个 Skill（[Skill 13.5 用法 3](/claude-code/advanced/skills#用法-3-在隔离子代理里运行)）。

## 14.2 创建子代理

在 `.claude/agents/` 目录下创建 Markdown 文件：

```bash
# 个人级（所有项目可用）
mkdir -p ~/.claude/agents/

# 项目级（只在当前项目，可提交 git）
mkdir -p .claude/agents/
```

**示例：安全审查代理**

`.claude/agents/security-reviewer.md`：

```markdown
---
name: security-reviewer
description: 审查代码中的安全漏洞，包括注入、认证问题、数据处理缺陷。
             当用户说"审查安全性"或"找安全漏洞"时使用。
tools: Read, Grep, Glob, Bash
model: opus
---

你是一名拥有 10 年经验的安全工程师。你的任务是审查代码中的安全问题。

重点关注：
- **注入漏洞**：SQL 注入、命令注入、XSS、SSTI
- **认证与授权**：会话固定、越权访问、弱密码策略
- **硬编码密钥**：API Key、密码、私钥直接写在代码里
- **不安全数据处理**：未验证的用户输入、不安全的反序列化
- **敏感信息泄露**：日志、错误信息、API 响应中的敏感数据

对每个发现：
1. 指出具体文件和行号
2. 说明漏洞类型和严重程度（高/中/低）
3. 提供具体的修复方案
4. 给出修复后的代码示例
```

## 14.3 调用子代理

Claude 可以根据你的描述自动选择合适的子代理，也可以显式指定：

```
# 自动选择（Claude 根据描述判断）
用子代理审查这段代码的安全问题

# 显式调用
用 security-reviewer 审查 src/auth/ 目录

# 启动时指定
claude --agent security-reviewer
```

## 14.4 子代理配置字段

```yaml
---
name: agent-name             # 代理名称（小写字母、数字、连字符）
description: 做什么用        # 帮助主 Claude 判断何时使用
tools: Read, Grep, Glob      # 允许使用的工具列表
model: opus                  # 使用的模型（默认继承当前设置）
---
```

**常用工具组合**：

| 用途 | 工具组合 |
|------|---------|
| 只读分析 | `Read, Grep, Glob` |
| 代码审查 | `Read, Grep, Glob, Bash` |
| 代码修改 | `Read, Edit, Write, Bash, Grep, Glob` |
| 完整能力 | 省略 tools 字段（继承全部）|

## 14.5 内置子代理

Claude Code 预置了以下子代理：

| 代理 | 功能 | 工具 |
|------|------|------|
| `Explore` | 快速代码库探索，只读 | Read, Grep, Glob |
| `Plan` | 架构设计和规划，只读 | Read, Grep, Glob |
| `general-purpose` | 通用研究和任务 | 全部 |

在提示中引用：
```
用 Explore 代理分析 src/db/ 目录的结构，不要修改任何东西
```

## 14.6 实战示例

**Writer + Reviewer 协作模式**：

```
# 会话 A（你在操作）：让主 Claude 写代码
实现一个 API 限流中间件，支持每 IP 每分钟 100 次请求

# 写完后，让子代理审查
用 security-reviewer 子代理审查刚写的 src/middleware/rateLimiter.ts，
找边界情况、竞态条件，以及和已有中间件模式的一致性问题

# 根据审查结果改进
根据审查结果修复以下问题：[子代理输出]
```

**并行调研模式**：

```
# 让三个独立子代理并行调研三个方案，然后汇总对比
用 Explore 子代理：研究 BullMQ 怎么用
用 Explore 子代理：研究 Cloudflare Queues 怎么用
用 Explore 子代理：研究 AWS SQS 怎么用

# 等三个跑完后
对比三个方案的：成本、上手难度、可观测性、限制。给出推荐。
```

每个 Explore 在独立上下文跑，主会话只接收最终结果。

## 14.7 排错速查

### Q：调用子代理后没反应

- 检查 frontmatter 里 `name` 和 `description` 是否写了
- 在 `.claude/agents/` 目录而不是 `~/.claude/agents/`？检查作用范围
- 跑 `claude agents` 列出所有可用子代理

### Q：子代理用了主会话不该用的工具

`tools:` 字段没限制好。明确列出允许的工具：

```yaml
---
tools: Read, Grep, Glob   # 只读
---
```

不写 `tools:` = 继承主会话所有工具。

### Q：让子代理跑大任务太慢

切到 opus 模型，但**只对这个子代理**：

```yaml
---
model: opus
---
```

主会话保持 sonnet（便宜），子代理用 opus（聪明）。

---

**下一步**：[15. 钩子（Hooks） →](/claude-code/advanced/hooks)
