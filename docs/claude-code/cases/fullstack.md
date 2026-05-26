# 24. 案例 1：从零搭建全栈项目

**场景**：从一个空目录开始，用 Claude Code 搭建一个带用户认证的 Todo 应用。  
**技术栈**：Node.js + Express + SQLite + React  
**时间**：约 2 小时完成一个可运行的原型

---

## 第一阶段：需求梳理和架构设计

**你（提示词）：**
```
我要做一个 Todo 应用，技术栈：Node.js + Express + SQLite（后端），React（前端）。

功能：用户注册/登录（JWT），增删改查 Todo，Todo 支持标签和优先级。

在写任何代码之前，先帮我：
1. 设计数据库 schema
2. 列出 API 端点
3. 规划目录结构

给我一个清晰的计划，我确认后再开始写代码。
```

**Claude（回复摘要）：**
```
# 数据库 Schema

users 表：id, email, password_hash, created_at
todos 表：id, user_id, title, description, priority(1-3), done, created_at, updated_at
tags 表：id, name, user_id
todo_tags 表：todo_id, tag_id

# API 端点

POST /api/auth/register
POST /api/auth/login
GET  /api/todos          # 获取当前用户的 todos，支持 ?tag=&priority=&done=
POST /api/todos
PUT  /api/todos/:id
DELETE /api/todos/:id
GET  /api/tags
POST /api/tags

# 目录结构

todo-app/
├── server/
│   ├── db/          # 数据库初始化和迁移
│   ├── routes/      # API 路由
│   ├── middleware/  # JWT 验证等
│   └── index.js
└── client/          # React 应用（用 Vite）
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── api/     # API 调用封装
    └── ...
```

::: tip 关键技巧：先规划再动手
直接说「做个 Todo 应用」Claude 会立刻开始写代码，可能写出你不喜欢的结构。明确要求「先给计划，确认后再写」，可以避免大量返工。
:::

---

## 第二阶段：后端实现

**你：**
```
计划很好，先实现后端。

步骤：
1. 初始化项目（package.json、依赖）
2. 创建数据库初始化脚本（按刚才的 schema）
3. 实现 /api/auth 路由（注册/登录）
4. 实现 /api/todos 路由（CRUD + 过滤）
5. 实现 JWT 中间件

每完成一步，告诉我做了什么。最后给我启动命令。
```

Claude 开始逐步创建文件。每一步它都会展示 diff 并等待你确认。

**中途纠正（按 Esc 打断）：**

Claude 把密码用 MD5 加密了，你立刻打断：

```
停，密码不要用 MD5，换成 bcrypt。MD5 不安全。
```

Claude 立刻调整，改用 bcrypt。

---

## 第三阶段：前端实现

**你：**
```
后端可以运行了。现在做前端。

用 Vite + React，页面：
1. 登录/注册页（/login，/register）
2. Todo 列表页（/，需要登录）
3. 组件：TodoItem、TagFilter、PriorityBadge

样式用 Tailwind CSS，保持简洁。
先实现登录注册，跑起来验证没问题，再做 Todo 列表。
```

**继续查看进展：**

```
登录页做好了，帮我测试：
1. 访问 http://localhost:3000
2. 注册一个账号
3. 登录
4. 告诉我有没有报错

如果有报错，分析原因并修复。
```

::: tip 关键技巧：让 Claude 自己测试
Claude Code 可以运行命令。让它自己启动服务、测试 API，比你手动测试再反馈要快得多。
:::

---

## 第四阶段：写测试

**你：**
```
核心功能实现了，现在写测试。

用 Jest + Supertest 给后端 API 写测试：
- 认证流程（注册、登录、Token 验证）
- Todo CRUD（创建、获取、更新、删除）
- 权限测试（不能访问别人的 Todo）

写好后跑测试，修复所有失败的测试。
```

---

## 第五阶段：收尾

**你：**
```
测试全绿了。帮我：
1. 更新 README.md，包含安装步骤和功能说明
2. 创建 .env.example 文件列出所有需要的环境变量
3. 写一个有意义的 commit 信息并提交
4. 如果有明显的技术债或待改进的地方，列出来

不要改任何代码，只做以上 4 件事。
```

---

## 总结

| 阶段 | 花费时间 | 主要提示词技巧 |
|------|---------|--------------|
| 需求和架构 | 15 分钟 | 强制先计划，不急着写代码 |
| 后端实现 | 45 分钟 | 分步骤，每步确认再下一步 |
| 前端实现 | 40 分钟 | 让 Claude 自己测试验证 |
| 测试 | 20 分钟 | 指定测试框架和覆盖范围 |
| 收尾 | 10 分钟 | 明确列出任务，防止额外修改 |

**可复用的提示词模板**：

```
我要做 [项目类型]，技术栈：[技术列表]。

功能需求：
- [功能1]
- [功能2]

在写代码之前，先给我：
1. 数据库/数据结构设计
2. 主要模块/接口列表
3. 目录结构

计划确认后，分步骤实现，每步做完告诉我，等我确认再继续。
```

---

下一步：[25. 案例 2：遗留代码重构 →](/claude-code/cases/refactor)
