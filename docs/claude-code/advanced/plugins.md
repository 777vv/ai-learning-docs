# 18. 插件（Plugins）

::: info 本章你将学到
- 插件是什么，解决什么问题
- 如何安装和管理插件
- 插件的目录结构
- 如何开发自己的插件
:::

## 18.1 插件是什么

**插件（Plugin）** 把 Skills、Hooks、Subagents、MCP 服务器打包成一个可安装的单元，方便分发和复用。

插件 vs 手动配置的区别：

| 方式 | 说明 |
|------|------|
| 手动配置 | 自己创建文件、配置路径，适合个人定制 |
| 插件 | 一条命令安装，自动配置好所有东西，适合分发给团队或社区 |

## 18.2 安装和管理插件

```bash
# 浏览插件市场（在会话中）
/plugin

# 安装插件
claude plugin install code-review@claude-plugins-official

# 列出已安装插件
claude plugin list

# 更新插件
claude plugin update code-review

# 卸载插件
claude plugin remove code-review

# 不重启，热重载所有插件
/reload-plugins
```

## 18.3 常见插件类型

| 类型 | 说明 |
|------|------|
| 🧠 **代码智能** | 给 Claude 精确的符号导航和自动错误检测能力 |
| 🔍 **代码审查** | 自动 PR 审查、安全扫描、性能分析 |
| 🧪 **测试增强** | 更智能的测试生成、覆盖率分析 |
| 🎨 **框架专用** | React、Vue、Django、Rails 等特定框架的深度集成 |
| 🔗 **服务集成** | Jira、Linear、Notion、Figma 等工具的工作流 |

## 18.4 插件目录结构

```
my-plugin/
├── plugin.json          # 插件清单（必须）
├── .mcp.json            # MCP 服务器定义（可选）
├── skills/
│   ├── my-workflow/
│   │   └── SKILL.md
│   └── code-review/
│       └── SKILL.md
├── agents/
│   └── security-agent.md
├── hooks/
│   └── hooks.json       # 钩子配置
└── servers/
    └── my-mcp-server.js # MCP 服务器实现
```

### plugin.json 格式

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "插件的简短描述",
  "author": "Your Name",
  "repository": "https://github.com/you/my-plugin",

  "skills": ["skills/my-workflow", "skills/code-review"],
  "agents": ["agents/security-agent"],
  "hooks": "hooks/hooks.json",

  "mcpServers": {
    "my-server": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/my-mcp-server.js",
      "env": {
        "API_KEY": "${MY_PLUGIN_API_KEY}"
      }
    }
  },

  "config": {
    "MY_PLUGIN_API_KEY": {
      "description": "API Key for My Plugin service",
      "required": true,
      "env": "MY_PLUGIN_API_KEY"
    }
  }
}
```

## 18.5 开发并发布插件

```bash
# 1. 创建插件目录
mkdir my-awesome-plugin && cd my-awesome-plugin

# 2. 创建 plugin.json
# （参考上面的格式）

# 3. 在本地测试
claude plugin install ./my-awesome-plugin

# 4. 发布到 npm（社区插件通过 npm 分发）
npm publish

# 5. 其他人安装
claude plugin install my-awesome-plugin
```

::: tip 插件开发建议
- 保持插件的单一职责（一个插件解决一个特定问题）
- 在 `plugin.json` 中清晰描述每个 Skill 和 Agent 的用途
- 把需要的环境变量在 `config` 字段中声明，安装时会提示用户配置
- 使用 `${CLAUDE_PLUGIN_ROOT}` 引用插件目录内的文件路径
:::

---

下一步：[19. 国内模型接入 →](/claude-code/china/models)
