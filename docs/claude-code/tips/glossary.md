# 32. 术语表

| 术语 | 含义 |
|------|------|
| **Agentic（代理式）** | AI 能自主探索、决策、多步执行，而不只是被动回答问题 |
| **Agentic Loop（代理循环）** | 观察 → 思考 → 调用工具 → 观察结果 → 继续思考 的循环，直到任务完成 |
| **Context Window（上下文窗口）** | Claude 本次对话能「看到」的所有内容（消息历史+读过的文件+命令输出）的总长度上限 |
| **Compaction（压缩）** | 上下文接近上限时自动总结历史对话，释放空间继续工作 |
| **Slash Command（斜杠命令）** | 以 `/` 开头的会话内命令，如 `/clear`、`/plan`、`/review` |
| **Skill（技能）** | 带 frontmatter 的 Markdown 文件，被调用时注入到 Claude 的上下文中 |
| **Subagent（子代理）** | 拥有独立上下文和工具的 Claude 实例，用于隔离特定任务 |
| **Hook（钩子）** | 在 Claude Code 生命周期特定事件时自动执行的脚本或 HTTP 请求 |
| **MCP（Model Context Protocol）** | Anthropic 主导的开放标准，让 AI 连接到外部数据源和工具 |
| **Plan Mode（计划模式）** | 只读权限模式：Claude 可以探索和规划，但不能修改任何文件或执行命令 |
| **Auto Mode（自动模式）** | 智能权限模式：分类器判断操作风险，只对危险操作询问确认 |
| **bypassPermissions** | 跳过所有权限检查的危险模式，只在受信任的沙盒环境中使用 |
| **Checkpoint（检查点）** | Claude 每次动作前自动保存的状态，双击 Esc 可以回滚到任意检查点 |
| **Worktree** | Git 的功能，让一个仓库在不同目录同时有多个分支处于工作状态 |
| **CLAUDE.md** | 项目/用户/组织级的指令文件，每次会话开始时自动加载 |
| **CLAUDE.local.md** | 只影响自己（不提交到 git）的本地指令覆盖文件 |
| **Auto Memory（自动记忆）** | Claude 自动写入的 MEMORY.md 文件，跨会话积累经验和偏好 |
| **Plugin（插件）** | 把 Skills + Hooks + Subagents + MCP 服务器打包的可安装单元 |
| **Tool Use** | Claude 调用外部工具（函数、API）的机制，是构建 Agent 的核心能力 |
| **Fan-Out** | 把一个大任务拆分成多个并行的子任务同时处理 |
| **TOCTOU** | Time-of-Check-to-Time-of-Use，一种先读后写的竞态条件 bug |
| **/btw** | 「顺便问一下」命令，问题和回答不进入主对话历史，不消耗上下文 |
| **path-scoped rules** | 只在处理特定路径文件时才加载的规则，节省上下文 |
| **Bearer Token** | HTTP 认证中用 `Authorization: Bearer <token>` 传递的令牌 |
| **Stream JSON** | 流式 JSON 输出格式，边生成边输出，适合处理大量内容 |
