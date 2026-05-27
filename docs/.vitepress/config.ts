import { defineConfig } from 'vitepress'

type SearchScopeGetter = () => string

declare global {
  interface Window {
    __getSearchScope?: SearchScopeGetter
  }
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'AI 学习站',
  description: '零基础学 AI 工具 · 覆盖 Claude Code、Codex 等主流 AI 编程助手 · 持续扩展中',

  head: [
    ['meta', { name: 'theme-color', content: '#c6613f' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'AI 学习站' }],
    ['meta', { property: 'og:description', content: '零基础学 AI 工具 · 持续扩展中' }],
  ],

  themeConfig: {
    logo: '/lighthouse-logo.svg',
    siteTitle: 'AI 学习站',

    nav: [
      {
        text: '按角色找路径',
        activeMatch: '/for/',
        items: [
          { text: '💻 工程师 / 程序员', link: '/for/engineer' },
          { text: '💼 产品 / 运营 / PM', link: '/for/pm' },
          { text: '📚 创作者 / 研究员', link: '/for/creator' },
          { text: '🏠 普通人 / 学生', link: '/for/general' },
        ],
      },
      { text: 'OpenClaw', link: '/openclaw/', activeMatch: '/openclaw/' },
      { text: 'Hermes', link: '/hermes/', activeMatch: '/hermes/' },
      { text: 'Claude Code', link: '/claude-code/', activeMatch: '/claude-code/' },
      { text: 'Codex', link: '/codex/', activeMatch: '/codex/' },
      { text: '学习交流', link: '/community' },
    ],

    sidebar: {
      '/for/': [
        {
          text: '按职场角色找路径',
          collapsed: false,
          items: [
            { text: '‍💻 工程师 / 程序员', link: '/for/engineer' },
            { text: '💼 产品 / 运营 / PM', link: '/for/pm' },
            { text: '📚 创作者 / 研究员', link: '/for/creator' },
            { text: '🏠 普通人 / 学生', link: '/for/general' },
          ],
        },
        {
          text: '其他入口',
          items: [
            { text: '💬 学习交流', link: '/community' },
          ],
        },
      ],

      '/claude-code/': [
        {
          text: '入门',
          collapsed: false,
          items: [
            { text: '1. 什么是 Claude Code', link: '/claude-code/guide/intro' },
            { text: '2. 系统要求', link: '/claude-code/guide/requirements' },
            { text: '📦 Node.js 与 npm 入门（可选）', link: '/claude-code/guide/nodejs' },
            { text: '3. 安装', link: '/claude-code/guide/install' },
            { text: '4. 登录认证', link: '/claude-code/guide/auth' },
            { text: '5. 快速开始', link: '/claude-code/guide/quickstart' },
          ],
        },
        {
          text: '基础',
          collapsed: false,
          items: [
            { text: '6. 基础使用', link: '/claude-code/basics/usage' },
            { text: '7. CLI 命令参考', link: '/claude-code/basics/cli' },
            { text: '8. 斜杠命令', link: '/claude-code/basics/slash-commands' },
            { text: '9. 键盘快捷键', link: '/claude-code/basics/shortcuts' },
          ],
        },
        {
          text: '进阶',
          collapsed: false,
          items: [
            { text: '10. CLAUDE.md 与记忆', link: '/claude-code/advanced/memory' },
            { text: '11. 权限与模式', link: '/claude-code/advanced/permissions' },
            { text: '12. 计划模式', link: '/claude-code/advanced/plan-mode' },
            { text: '13. 技能（Skills）', link: '/claude-code/advanced/skills' },
            { text: '14. 子代理（Subagents）', link: '/claude-code/advanced/subagents' },
            { text: '15. 钩子（Hooks）', link: '/claude-code/advanced/hooks' },
            { text: '16. MCP 协议', link: '/claude-code/advanced/mcp' },
            { text: '17. 配置文件详解', link: '/claude-code/advanced/config' },
            { text: '18. 插件（Plugins）', link: '/claude-code/advanced/plugins' },
          ],
        },
        {
          text: '国内适配',
          collapsed: false,
          items: [
            { text: '19. 国内模型接入', link: '/claude-code/china/models' },
            { text: '20. 代理与网络配置', link: '/claude-code/china/proxy' },
          ],
        },
        {
          text: '集成与自动化',
          collapsed: false,
          items: [
            { text: '21. GitHub Actions 集成', link: '/claude-code/integration/github-actions' },
            { text: '22. Agents SDK 开发指南', link: '/claude-code/integration/agents-sdk' },
          ],
        },
        {
          text: '实战案例',
          collapsed: false,
          items: [
            { text: '23. 实战案例总览', link: '/claude-code/cases/' },
            { text: '24. 案例 1：从零搭建全栈项目', link: '/claude-code/cases/fullstack' },
            { text: '25. 案例 2：遗留代码重构', link: '/claude-code/cases/refactor' },
            { text: '26. 案例 3：复杂 Bug 调试', link: '/claude-code/cases/debug' },
          ],
        },
        {
          text: '技巧与参考',
          collapsed: false,
          items: [
            { text: '27. 最佳实践', link: '/claude-code/tips/best-practices' },
            { text: '28. 常见工作流', link: '/claude-code/tips/workflows' },
            { text: '29. 并行与自动化', link: '/claude-code/tips/parallel' },
            { text: '30. IDE 集成', link: '/claude-code/tips/ide' },
            { text: '31. 故障排除', link: '/claude-code/tips/troubleshoot' },
            { text: '32. 术语表', link: '/claude-code/tips/glossary' },
            { text: '33. 资源链接', link: '/claude-code/tips/resources' },
          ],
        },
        {
          text: '学习与交流',
          items: [
            { text: '加入交流群', link: '/community' },
          ],
        },
      ],

      '/hermes/': [
        {
          text: '入门',
          collapsed: false,
          items: [
            { text: '1. Hermes 是什么', link: '/hermes/intro/what-is' },
            { text: '2. 核心概念图解', link: '/hermes/intro/concepts' },
            { text: '3. 能做什么 / 不能做什么', link: '/hermes/intro/can-do' },
            { text: '4. 系统要求与安全提醒', link: '/hermes/intro/requirements' },
            { text: '5. 装好 Python + uv', link: '/hermes/intro/python-uv' },
            { text: '6. 安装 Hermes', link: '/hermes/intro/install' },
          ],
        },
        {
          text: '配置',
          collapsed: false,
          items: [
            { text: '7. 申请你的第一个 API Key', link: '/hermes/setup/api-key' },
            { text: '8. 配置模型供应商', link: '/hermes/setup/model-provider' },
            { text: '9. hermes setup 向导走读', link: '/hermes/setup/hermes-setup' },
            { text: '10. 接入 Telegram', link: '/hermes/setup/telegram' },
            { text: '11. 接入 Discord', link: '/hermes/setup/discord' },
          ],
        },
        {
          text: '日常操作',
          collapsed: false,
          items: [
            { text: '12. CLI 命令手册', link: '/hermes/ops/cli' },
            { text: '13. 终端 UI 玩法', link: '/hermes/ops/terminal-ui' },
            { text: '14. hermes doctor 与排查', link: '/hermes/ops/doctor' },
            { text: '15. 安全清单（必读）', link: '/hermes/ops/security-checklist' },
          ],
        },
        {
          text: '进阶',
          collapsed: false,
          items: [
            { text: '16. Skills 自改进系统', link: '/hermes/advanced/skills' },
            { text: '17. 写你自己的 Skill', link: '/hermes/advanced/write-skill' },
            { text: '18. 40+ 内置工具一览', link: '/hermes/advanced/tools' },
            { text: '19. Honcho 记忆 + Memory', link: '/hermes/advanced/memory-honcho' },
            { text: '20. MCP 协议接入', link: '/hermes/advanced/mcp' },
            { text: '21. Subagents + Worktree', link: '/hermes/advanced/subagents' },
          ],
        },
        {
          text: '国内适配',
          collapsed: false,
          items: [
            { text: '22. 国内 LLM 接入', link: '/hermes/china/models' },
            { text: '23. 网络与镜像加速', link: '/hermes/china/network' },
            { text: '24. 国内 channel 现实', link: '/hermes/china/channels' },
          ],
        },
        {
          text: '实战案例',
          collapsed: false,
          items: [
            { text: '25. 自进化日记', link: '/hermes/cases/self-evolve' },
            { text: '26. 多 backend 实战', link: '/hermes/cases/multi-backend' },
            { text: '27. 跨平台对话连续', link: '/hermes/cases/cross-platform' },
            { text: '28. 个人知识库构建', link: '/hermes/cases/knowledge-base' },
            { text: '29. 定时夜班任务', link: '/hermes/cases/cron-night' },
            { text: '30. 浏览器自动化', link: '/hermes/cases/browser-automation' },
            { text: '31. 训练数据生成', link: '/hermes/cases/trajectory-data' },
            { text: '32. 多 agent 并行调研', link: '/hermes/cases/parallel-research' },
            { text: '33. 联动其他 AI 工具', link: '/hermes/cases/with-other-tools' },
            { text: '34. ⭐ 从 OpenClaw 迁移', link: '/hermes/cases/migrate-from-openclaw' },
          ],
        },
        {
          text: '部署',
          collapsed: false,
          items: [
            { text: '35. 7 种 backend 选型', link: '/hermes/deploy/backends' },
            { text: '36. Docker 完整部署', link: '/hermes/deploy/docker' },
            { text: '37. 云端 / VPS 部署', link: '/hermes/deploy/cloud' },
          ],
        },
        {
          text: '参考',
          collapsed: false,
          items: [
            { text: '38. 故障排除大全', link: '/hermes/reference/troubleshoot' },
            { text: '39. 术语表', link: '/hermes/reference/glossary' },
            { text: '40. 资源链接 & FAQ', link: '/hermes/reference/resources' },
          ],
        },
        {
          text: '学习与交流',
          items: [
            { text: '加入交流群', link: '/community' },
          ],
        },
      ],

      '/openclaw/': [
        {
          text: '入门',
          collapsed: false,
          items: [
            { text: '1. OpenClaw 是什么', link: '/openclaw/intro/what-is' },
            { text: '2. 核心概念图解', link: '/openclaw/intro/concepts' },
            { text: '3. 能做什么 / 不能做什么', link: '/openclaw/intro/can-do' },
            { text: '4. 系统要求与安全提醒', link: '/openclaw/intro/requirements' },
            { text: '5. 装好 Node.js', link: '/openclaw/intro/nodejs' },
            { text: '6. 安装 OpenClaw', link: '/openclaw/intro/install' },
          ],
        },
        {
          text: '配置',
          collapsed: false,
          items: [
            { text: '7. 申请你的第一个 API Key', link: '/openclaw/setup/api-key' },
            { text: '8. 配置模型供应商', link: '/openclaw/setup/model-provider' },
            { text: '9. 你的第一个 Agent', link: '/openclaw/setup/first-agent' },
            { text: '10. 接入 Telegram', link: '/openclaw/setup/telegram' },
            { text: '11. 接入飞书', link: '/openclaw/setup/feishu' },
          ],
        },
        {
          text: '日常操作',
          collapsed: false,
          items: [
            { text: '12. CLI 命令手册', link: '/openclaw/ops/cli' },
            { text: '13. Dashboard 控制台', link: '/openclaw/ops/dashboard' },
            { text: '14. 日志与故障排查', link: '/openclaw/ops/logs' },
            { text: '15. 安全清单（必读）', link: '/openclaw/ops/security-checklist' },
          ],
        },
        {
          text: '进阶',
          collapsed: false,
          items: [
            { text: '16. Skills 系统入门', link: '/openclaw/advanced/skills-intro' },
            { text: '17. 写你的第一个 Skill', link: '/openclaw/advanced/write-skill' },
            { text: '18. 多 Agent 协作', link: '/openclaw/advanced/multi-agent' },
            { text: '19. Memory 记忆系统', link: '/openclaw/advanced/memory' },
            { text: '20. MCP 协议接入', link: '/openclaw/advanced/mcp' },
            { text: '21. 联动 Codex / Claude Code', link: '/openclaw/advanced/with-coding-tools' },
          ],
        },
        {
          text: '国内适配',
          collapsed: false,
          items: [
            { text: '22. 国内 LLM 接入', link: '/openclaw/china/models' },
            { text: '23. 国内 channel 接入', link: '/openclaw/china/channels' },
            { text: '24. 网络与镜像加速', link: '/openclaw/china/network' },
          ],
        },
        {
          text: '实战案例',
          collapsed: false,
          items: [
            { text: '25. 每日资讯晨报', link: '/openclaw/cases/daily-news' },
            { text: '26. 个人办公助理', link: '/openclaw/cases/office-helper' },
            { text: '27. 英语学习陪练', link: '/openclaw/cases/english-coach' },
            { text: '28. 论文追踪助手', link: '/openclaw/cases/arxiv-tracker' },
            { text: '29. 飞书问答机器人', link: '/openclaw/cases/feishu-qa-bot' },
            { text: '30. 会议纪要自动整理', link: '/openclaw/cases/meeting-notes' },
            { text: '31. 项目 24h 守夜人', link: '/openclaw/cases/project-watchdog' },
            { text: '32. AI 帮你写代码', link: '/openclaw/cases/code-assistant' },
            { text: '33. 自媒体一稿多发', link: '/openclaw/cases/content-distribute' },
            { text: '34. 家庭管家', link: '/openclaw/cases/family-manager' },
          ],
        },
        {
          text: '部署',
          collapsed: false,
          items: [
            { text: '35. 本地 vs 云端', link: '/openclaw/deploy/local-vs-cloud' },
            { text: '36. Docker 完整部署', link: '/openclaw/deploy/docker' },
            { text: '37. NemoClaw 安全沙箱', link: '/openclaw/deploy/nemoclaw' },
          ],
        },
        {
          text: '参考',
          collapsed: false,
          items: [
            { text: '38. 故障排除大全', link: '/openclaw/reference/troubleshoot' },
            { text: '39. 术语表', link: '/openclaw/reference/glossary' },
            { text: '40. 资源链接 & FAQ', link: '/openclaw/reference/resources' },
          ],
        },
        {
          text: '学习与交流',
          items: [
            { text: '加入交流群', link: '/community' },
          ],
        },
      ],

      '/codex/': [
        {
          text: '入门指南',
          collapsed: false,
          items: [
            { text: '1. Codex 是什么', link: '/codex/guide/what-is-codex' },
            { text: '2. 安装 Codex', link: '/codex/guide/installation' },
            { text: '3. 快速开始', link: '/codex/guide/quick-start' },
            { text: '4. 认证与 API Key', link: '/codex/guide/authentication' },
          ],
        },
        {
          text: '核心功能',
          collapsed: false,
          items: [
            { text: '5. Agent 权限模式', link: '/codex/features/agent-modes' },
            { text: '6. 文件编辑与回滚', link: '/codex/features/file-editing' },
            { text: '7. Shell 命令执行', link: '/codex/features/shell-commands' },
            { text: '8. 代码审查', link: '/codex/features/code-review' },
            { text: '9. MCP 扩展协议', link: '/codex/features/mcp-integration' },
          ],
        },
        {
          text: '模型配置',
          collapsed: false,
          items: [
            { text: '10. 官方模型一览', link: '/codex/models/openai-models' },
            { text: '11. 自定义模型接入', link: '/codex/models/custom-providers' },
          ],
        },
        {
          text: '国内模型对接',
          collapsed: false,
          items: [
            { text: '12. 接入总览', link: '/codex/china-models/overview' },
            { text: '13. DeepSeek 保姆级教程', link: '/codex/china-models/deepseek' },
            { text: '14. 通义千问 保姆级教程', link: '/codex/china-models/qwen' },
            { text: '15. Kimi 保姆级教程', link: '/codex/china-models/kimi' },
            { text: '16. Ollama 离线方案', link: '/codex/china-models/ollama-local' },
            { text: '17. 其他模型快速参考', link: '/codex/china-models/others' },
          ],
        },
        {
          text: '进阶使用',
          collapsed: false,
          items: [
            { text: '18. AGENTS.md 自定义指令', link: '/codex/advanced/agents-md' },
            { text: '19. Skills 技能系统', link: '/codex/advanced/skills-system' },
            { text: '20. GitHub Action 集成', link: '/codex/advanced/github-action' },
            { text: '21. Windows + WSL2 配置', link: '/codex/advanced/windows-setup' },
          ],
        },
        {
          text: '配置参考',
          collapsed: false,
          items: [
            { text: '22. 基础配置', link: '/codex/config/config-basic' },
            { text: '23. 高级配置', link: '/codex/config/config-advanced' },
          ],
        },
        {
          text: '其他',
          collapsed: false,
          items: [
            { text: '24. 常见问题 FAQ', link: '/codex/faq' },
            { text: '25. 资源链接', link: '/codex/resources' },
          ],
        },
        {
          text: '学习与交流',
          items: [
            { text: '加入交流群', link: '/community' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/777vv/ai-learning-docs' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><circle cx="512" cy="512" r="512" fill="#C71D23"/><path fill="#fff" d="M771.149 455.117h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.62V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z"/></svg>',
        },
        link: 'https://gitee.com/vv777/ai-learning-docs',
        ariaLabel: 'Gitee',
      },
    ],

    footer: {
      message: '面向中文用户的 AI 工具学习站 · 持续更新',
      copyright: '内容遵循对应官方授权 · 2026',
    },

    search: {
      provider: 'local',
      options: {
        // 按"搜索范围"全局状态过滤结果（状态由 SearchScope 组件维护，挂在 window）
        miniSearch: {
          searchOptions: {
            filter(result: { id?: string }) {
              if (typeof window === 'undefined') return true
              const getter = window.__getSearchScope
              if (typeof getter !== 'function') return true
              const scope = getter()
              if (!scope || scope === 'all') return true
              return typeof result.id === 'string' && result.id.includes(`/${scope}/`)
            },
          },
        },
        // 给每篇文档的搜索标题加上 "[工具名]" 前缀，结果列表一眼看出归属（只影响索引、不影响页面渲染）
        _render(src, env, md) {
          const html = md.render(src, env)
          const rel: string | undefined = env.relativePath
          if (!rel) return html
          const tool = rel.split('/')[0]
          const labels: Record<string, string> = {
            'claude-code': '[Claude Code] ',
            'codex':       '[Codex] ',
            'openclaw':    '[OpenClaw] ',
            'hermes':      '[Hermes] ',
          }
          const label = labels[tool]
          if (!label) return html
          // 替换首个 <h1> 文本，把前缀加进去
          return html.replace(/(<h1[^>]*>)([\s\S]*?)(<\/h1>)/, (_m, open, inner, close) => {
            // 避免重复加前缀（_render 在某些场景会被多次调用）
            if (inner.startsWith(label.trim())) return _m
            return `${open}${label}${inner}${close}`
          })
        },
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
      },
    },

    editLink: {
      pattern: 'https://github.com/777vv/claude-chinese-docs/issues',
      text: '在 GitHub 上反馈问题',
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: { dateStyle: 'short' },
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    outline: {
      label: '本页目录',
      level: [2, 3],
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'one-dark-pro',
      dark: 'one-dark-pro',
    },
  },
})
