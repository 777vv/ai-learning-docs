# 23. 实战案例总览

通过真实场景的案例，看 Claude Code 是怎么工作的。

## 案例列表

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:24px">

<a href="/claude-code/cases/fullstack" style="display:block;padding:24px;border:1px solid var(--vp-c-divider);border-radius:12px;text-decoration:none;transition:border-color .2s,transform .2s" onmouseover="this.style.borderColor='var(--vp-c-brand-1)';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--vp-c-divider)';this.style.transform=''">
  <div style="font-size:2rem;margin-bottom:12px">🚀</div>
  <div style="font-weight:600;font-size:1.1rem;color:var(--vp-c-text-1);margin-bottom:8px">案例 1：从零搭建全栈项目</div>
  <div style="font-size:14px;color:var(--vp-c-text-2)">从空目录开始，用 Claude Code 搭建一个带认证的 Todo 应用。覆盖：需求分析 → 架构设计 → 数据库建模 → API 开发 → 前端实现 → 测试。</div>
  <div style="margin-top:12px;font-size:13px;color:var(--vp-c-brand-1)">阅读案例 →</div>
</a>

<a href="/claude-code/cases/refactor" style="display:block;padding:24px;border:1px solid var(--vp-c-divider);border-radius:12px;text-decoration:none;transition:border-color .2s,transform .2s" onmouseover="this.style.borderColor='var(--vp-c-brand-1)';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--vp-c-divider)';this.style.transform=''">
  <div style="font-size:2rem;margin-bottom:12px">🔧</div>
  <div style="font-weight:600;font-size:1.1rem;color:var(--vp-c-text-1);margin-bottom:8px">案例 2：遗留代码重构</div>
  <div style="font-size:14px;color:var(--vp-c-text-2)">接手一个有 5 年历史的老项目：理解架构、识别技术债、制定重构计划、安全执行迁移、验证行为不变。</div>
  <div style="margin-top:12px;font-size:13px;color:var(--vp-c-brand-1)">阅读案例 →</div>
</a>

<a href="/claude-code/cases/debug" style="display:block;padding:24px;border:1px solid var(--vp-c-divider);border-radius:12px;text-decoration:none;transition:border-color .2s,transform .2s" onmouseover="this.style.borderColor='var(--vp-c-brand-1)';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--vp-c-divider)';this.style.transform=''">
  <div style="font-size:2rem;margin-bottom:12px">🐛</div>
  <div style="font-weight:600;font-size:1.1rem;color:var(--vp-c-text-1);margin-bottom:8px">案例 3：复杂 Bug 调试</div>
  <div style="font-size:14px;color:var(--vp-c-text-2)">生产环境的随机性 Bug，难以复现。用 Claude Code 深度分析日志、追踪代码路径、定位根本原因并验证修复。</div>
  <div style="margin-top:12px;font-size:13px;color:var(--vp-c-brand-1)">阅读案例 →</div>
</a>

</div>

## 案例的共同结构

每个案例都会展示：

1. **初始状态** — 项目是什么样的，问题是什么
2. **对话过程** — 完整的提示词和 Claude 的响应
3. **关键决策点** — 为什么这样提问，有什么技巧
4. **最终结果** — 解决了什么，花了多少时间
5. **可复用的提示词模板**

---

下一步：[24. 案例 1：从零搭建全栈项目 →](/claude-code/cases/fullstack)
