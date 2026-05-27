# 18. AGENTS.md 自定义指令

> **本文你将学会：** 怎么用 `AGENTS.md` 给项目"装上说明书"，让 Codex 一进项目就懂你的规范、避免反复纠正。

## 没有 AGENTS.md 之前 vs 之后

::: tip 直接看效果对比
**没有 AGENTS.md**：
```
你：帮我添加一个用户查询接口
Codex：
- 在 src/api.ts 里加了个 export function getUser() { ... }
- 用 fetch 调 API
- 返回 any 类型
- 测试也没写

（你看了想哭——我们项目根本不是这样写的）
```

**有了 AGENTS.md**：
```
你：帮我添加一个用户查询接口
Codex：
- 路由放在 routes/users.ts（你项目的约定）
- 业务逻辑在 services/userService.ts
- 用 axios（项目用的）+ AppError（项目的错误类）
- 返回 { success, data, error } 统一格式
- 自动加了 services/userService.test.ts 测试文件
```

**核心价值**：把"每次都要重复说的项目规范"**写一次**，Codex 每次启动都自动加载。
:::

## AGENTS.md 是什么？

::: info 一句话定义
**`AGENTS.md`** 是放在项目根目录的 Markdown 文件，**Codex 每次启动都会自动读它**——相当于给 AI 的"工作说明书"。

文件名固定就叫 `AGENTS.md`（大写），放在项目根目录（和 `package.json` / `README.md` 同级）。
:::

里面写什么：

- 项目是做什么的、技术栈是啥
- 代码风格规范（缩进、命名、ESLint 配置）
- 有哪些**不能碰**的文件 / 目录
- 特定任务的处理方式（如"加新组件时同时写测试"）
- 团队的口头约定

## 5 分钟跑通：你的第一个 AGENTS.md

### 第 1 步：在项目根目录建文件

```bash
cd ~/my-project
touch AGENTS.md
```

::: tip Windows 用户
```powershell
cd C:\Users\你\my-project
New-Item -ItemType File AGENTS.md
```
或者用 VS Code / 记事本直接新建保存。
:::

### 第 2 步：写基本内容

任意编辑器打开 `AGENTS.md`，写入：

```markdown
# 项目说明

这是一个使用 React + TypeScript + Tailwind CSS 的前端项目，后端 API 基于 Express。

## 技术栈
- 前端：React 18, TypeScript 5, Vite, Tailwind CSS
- 后端：Node.js, Express, Prisma ORM, PostgreSQL
- 测试：Vitest（单元测试），Playwright（E2E）

## 代码规范
- 使用 ESLint + Prettier 格式化，提交前必须通过 lint
- 组件文件使用 PascalCase 命名（如 UserCard.tsx）
- 工具函数文件使用 camelCase 命名
- 所有组件必须有 TypeScript 类型定义，禁止 `any`

## 重要规则
- 不要修改 `src/generated/` 目录（Prisma 自动生成）
- 不要直接修改 `.env` 文件，只能修改 `.env.example`
- 新功能必须同时编写单元测试

## 目录结构
- src/components/ — UI 组件
- src/hooks/ — 自定义 React Hooks
- src/utils/ — 工具函数
- src/api/ — API 请求层
- server/ — 后端代码
```

### 第 3 步：验证 Codex 读取到了

启动 Codex：
```bash
codex
```

测试问一句 Codex：
```
当前项目用了哪些技术？我们的命名规范是什么？
```

如果 Codex 能准确说出"React 18 / TypeScript 5 / 组件用 PascalCase…"——✅ AGENTS.md 已生效。

如果它"不知道"——检查文件是否真的在项目根目录、文件名是否拼对（大小写敏感：`AGENTS.md` 不是 `agents.md`）。

## AGENTS.md 的加载规则

Codex 会按以下顺序查找并**合并**多个 `AGENTS.md` 文件：

```
1. ~/.codex/instructions.md          ← 全局规则（对所有项目生效）
2. /path/to/project/AGENTS.md        ← 项目根目录
3. /path/to/project/src/AGENTS.md    ← 子目录（当你在子目录工作时）
```

**优先级**：层级越深的规则优先级越高。例如 `src/AGENTS.md` 里写"这个目录用 4 格缩进"，会覆盖项目根的"全项目 2 格"。

::: tip 什么时候用子目录 AGENTS.md
- monorepo——每个 package 有自己的规范
- 一个仓库里前后端代码风格不同（如 `src/` 用 TypeScript、`scripts/` 用 Python）
:::

## 全局指令文件

如果你有**所有项目都适用**的规则，写在全局文件：

```bash
# 编辑全局指令
nano ~/.codex/instructions.md
```

```markdown
# 全局规则

## 通用规范
- 代码注释用中文
- 函数和变量命名用英文
- 每次修改前先用 `git diff` 确认当前状态
- 提交信息格式：`类型(范围): 说明`，如 `feat(auth): 添加登录功能`

## 安全规则
- 不要在代码中硬编码任何密码、密钥、Token
- 发现敏感信息时立即提醒我

## 任务节奏
- 复杂任务先列计划等我确认再动手
- 改动多个文件前先简述会影响哪些地方
```

这些规则对**所有项目**都生效，跟项目级 `AGENTS.md` 合并使用。

## 实用模板

### 模板 1：Python 后端项目

```markdown
# Python 项目

## 环境
- Python 3.11+，使用 pyenv 管理版本
- 包管理：Poetry（不要用 pip install 直接安装）
- 测试：pytest

## 规范
- 类型注解：所有函数参数和返回值必须有类型注解
- 文档字符串：使用 Google 风格
- 格式化：black + isort（提交前运行 `make fmt`）

## 禁止操作
- 不要修改 `pyproject.toml` 中的依赖版本
- 不要创建 .pyc 文件（使用 __pycache__ 目录）

## 目录约定
- src/ 业务代码
- tests/ 测试代码（与 src 镜像结构）
- migrations/ 数据库迁移脚本（不要手改，用 alembic）
```

### 模板 2：Node.js API 项目

```markdown
# Node.js API 项目

## 约定
- 所有路由在 `routes/` 目录
- 业务逻辑在 `services/` 目录
- 数据库操作只允许通过 `repositories/` 目录
- 错误统一抛出 `AppError` 类（在 utils/errors.js 中定义）

## API 规范
- RESTful 风格
- 统一响应格式：`{ success, data, error }`
- 分页参数：`page` 和 `pageSize`

## 测试
- 每个 service 必须有对应的 .test.js 文件
- 运行测试：`npm test`
- 覆盖率要求 > 80%
```

### 模板 3：纯前端 React 项目

```markdown
# React 前端项目

## 技术栈
- React 18 + Vite + TypeScript
- 状态管理：Zustand（不要引入 Redux）
- UI：shadcn/ui + Tailwind CSS
- 数据请求：TanStack Query

## 组件规范
- 使用函数组件 + Hooks，禁用 class 组件
- Props 必须用 interface 定义
- 一个文件 = 一个组件，文件名 PascalCase

## 不要碰
- src/generated/ —— OpenAPI 生成代码
- src/locales/zh-CN.ts 自动生成（用脚本同步）
```

## 写好 AGENTS.md 的 5 条建议

::: tip
1. **写具体的、可验证的规则**
   - ❌ "代码要整洁"
   - ✅ "函数不超过 50 行，超过的拆分到新文件"

2. **明确禁止比模糊鼓励有效**
   - ✅ "不要修改 src/generated/——这是自动生成的"
   - ✅ "不要直接调 `fetch`，用项目自带的 `api.client`"

3. **给出具体例子**
   - ✅ "命名格式：`feat(auth): 添加登录页`、`fix(api): 修复 timeout`"

4. **不要太长**
   - 100-300 行是甜区，超过 500 行 Codex 会开始"忘记"细节
   - 太详细的可以拆到子目录 AGENTS.md

5. **定期更新**
   - 团队规范变了就改它
   - Codex 反复犯错的"坑"加进去，下次就不踩
:::

## 排错速查

### Q：写了 AGENTS.md 但 Codex 好像没遵守

按这个顺序排查：
1. **文件名对吗** —— 必须是 `AGENTS.md`（大写），不是 `agents.md`
2. **位置对吗** —— 必须在项目根目录（你启动 `codex` 的目录）
3. **重启 Codex** —— 改了 AGENTS.md 通常会自动重载，但偶尔需要重启会话
4. **直接问 Codex**：
   ```
   你看到我项目的 AGENTS.md 了吗？里面提到了什么规则？
   ```
   它能说出内容 = 加载了；说"没看到" = 没加载

### Q：规则太多，AGENTS.md 越来越长

拆分策略：
- **通用规范** → `~/.codex/instructions.md`（全局）
- **项目级总览** → `AGENTS.md`（根目录）
- **某个模块的特殊规则** → `src/<模块>/AGENTS.md`（子目录）

### Q：Codex 还是会做我禁止的事

可能：
- 规则写得太模糊（试试更具体）
- 文件太长，关键规则在末尾被忽略（把硬规则往前放）
- AGENTS.md 没和实际工作目录对齐（你在子目录启动了，根目录的 AGENTS.md 不会读 —— 在根目录启动）

## 下一步

- ⚙️ [配置文件详解](/codex/config/config-basic) — config.toml 的其他配置项
- 🛠️ [Skills 系统](/codex/advanced/skills-system) — 比 AGENTS.md 更强的可复用任务模板
- 🔐 [Agent 权限模式](/codex/features/agent-modes) — 控制 Codex 的活动范围
