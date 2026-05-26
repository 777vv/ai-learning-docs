import { ref, watch } from 'vue'

declare global {
  interface Window {
    __getSearchScope?: () => Scope
  }
}

export type Scope = 'all' | 'claude-code' | 'codex' | 'openclaw' | 'hermes'

export const SCOPE_OPTIONS = [
  { value: 'all',         label: '全部',         short: '全部' },
  { value: 'claude-code', label: 'Claude Code',  short: 'Claude' },
  { value: 'codex',       label: 'Codex',        short: 'Codex' },
  { value: 'openclaw',    label: 'OpenClaw',     short: 'OpenClaw' },
  { value: 'hermes',      label: 'Hermes',       short: 'Hermes' },
] as const

const STORAGE_KEY = 'ai-docs:search-scope'
const VALID: Scope[] = ['all', 'claude-code', 'codex', 'openclaw', 'hermes']

function isHomePath(): boolean {
  if (typeof window === 'undefined') return false
  const p = window.location.pathname
  return p === '/' || p === '' || p === '/index.html'
}

function detectFromPath(): Scope {
  if (typeof window === 'undefined') return 'all'
  const seg = window.location.pathname.split('/').filter(Boolean)[0]
  return (seg && (VALID as string[]).includes(seg)) ? (seg as Scope) : 'all'
}

function loadInitial(): Scope {
  if (typeof window === 'undefined') return 'all'
  // 首页 / 刷新首页：强制 "全部"，忽略 localStorage
  if (isHomePath()) return 'all'
  // 进具体工具区时，scope 强制跟随当前路径（满足"进 OpenClaw 默认选 OpenClaw"）
  const fromPath = detectFromPath()
  if (fromPath !== 'all') return fromPath
  // 在其他通用页（社区、按角色找路径等）时，恢复用户上次选择
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Scope | null
    if (saved && (VALID as string[]).includes(saved)) return saved
  } catch {}
  return 'all'
}

export const searchScope = ref<Scope>('all')

if (typeof window !== 'undefined') {
  searchScope.value = loadInitial()

  // 暴露给 config.ts 里的 filter 函数读取（client-side 运行时）
  window.__getSearchScope = () => searchScope.value

  // 持久化用户选择
  watch(searchScope, (v) => {
    try { localStorage.setItem(STORAGE_KEY, v) } catch {}
  })

  // 路由变化时根据新路径调整 scope
  // - 跳到首页：强制 "全部"
  // - 跳到工具区：跟随该工具
  // - 跳到其他通用页：保持现有选择
  let lastPath = window.location.pathname
  const onPathChange = () => {
    if (window.location.pathname === lastPath) return
    lastPath = window.location.pathname
    if (isHomePath()) {
      searchScope.value = 'all'
      return
    }
    const fromPath = detectFromPath()
    if (fromPath !== 'all') searchScope.value = fromPath
  }
  // VitePress 用 history.pushState，监听 popstate 不够，hack 一下 pushState
  const origPush = history.pushState.bind(history)
  history.pushState = function (...args: Parameters<typeof history.pushState>) {
    const r = origPush(...args)
    setTimeout(onPathChange, 0)
    return r
  }
  window.addEventListener('popstate', onPathChange)
}
