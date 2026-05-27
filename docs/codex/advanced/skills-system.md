# 19. Skills 技能系统

> **本文你将学会：** 如何创建和使用 Codex 的 Skills（技能文件），让 Codex 执行标准化的重复任务。

## 什么是 Skills？

Skills 是存放在 `~/.codex/skills/` 目录下的 Markdown 文件，每个文件定义一个可复用的"技能"，包含：

- 任务的详细步骤描述
- 需要的工具和命令
- 注意事项

使用 Skills 后，你只需要说"使用 XXX 技能"，Codex 就会按照预定步骤执行。

---

## 创建你的第一个 Skill

```bash
# 创建技能目录
mkdir -p ~/.codex/skills

# 创建一个"代码审查"技能
nano ~/.codex/skills/code-review.md
```

文件内容示例：

```markdown
---
name: code-review
description: 对最近一次 git commit 进行全面代码审查
---

# 代码审查技能

## 步骤

1. 运行 `git diff HEAD~1` 获取最近改动
2. 检查以下方面：
   - 逻辑错误和潜在 bug
   - 安全漏洞（XSS、SQL注入、越权等）
   - 性能问题（N+1查询、内存泄漏等）
   - 代码可读性和命名规范
3. 按严重程度分级输出：🔴 严重 / 🟡 建议 / 🟢 优化
4. 对每个问题给出具体修复建议
5. 最后给出总体评分（1-10分）
```

---

## 使用技能

在 Codex 对话中，直接引用技能名称：

```
使用 code-review 技能审查这次提交
```

或者：

```
/skill code-review
```

---

## 实用技能模板集合

### 提交前检查技能

```markdown
---
name: pre-commit-check
description: 提交代码前的质量检查清单
---

## 检查清单

1. 运行 `npm run lint` — 修复所有 lint 错误
2. 运行 `npm run typecheck` — 确保无 TypeScript 错误
3. 运行 `npm test` — 确保所有测试通过
4. 检查有无 `console.log` 遗留在代码中
5. 检查有无硬编码的密钥或密码
6. 确认所有新功能都有对应测试
7. 输出检查结果摘要
```

### 快速创建 React 组件技能

```markdown
---
name: create-component
description: 创建一个规范的 React TypeScript 组件
---

## 步骤

创建组件时需要：
1. 在 src/components/ 下新建 `{ComponentName}/` 目录
2. 创建 `index.tsx` — 组件主文件
3. 创建 `{ComponentName}.test.tsx` — 单元测试
4. 创建 `{ComponentName}.stories.tsx` — Storybook 文档（如果项目有 Storybook）

组件规范：
- 使用函数组件 + TypeScript
- Props 接口命名为 `{ComponentName}Props`
- 导出方式：`export default` 和 `export type {ComponentName}Props`
- 样式使用 Tailwind CSS class
```

### 数据库迁移技能

```markdown
---
name: db-migration
description: 创建并运行数据库迁移
---

## 步骤

1. 根据需求修改 `prisma/schema.prisma`
2. 运行 `npx prisma migrate dev --name <migration-name>`
3. 如果有 seed 数据需要更新，修改 `prisma/seed.ts`
4. 运行 `npx prisma generate` 更新客户端类型
5. 确认迁移成功：`npx prisma studio`（可选，打开数据库 GUI）
```

---

## 技能目录结构

```
~/.codex/skills/
├── code-review.md
├── pre-commit-check.md
├── create-component.md
├── db-migration.md
└── deploy-check.md
```

---

## 最佳实践

- 技能名称用短横线连接（`kebab-case`）
- `description` 字段简洁说明用途（一句话）
- 步骤写得越具体，执行效果越好
- 可以为不同项目类型创建不同的技能库
