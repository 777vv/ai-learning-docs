import { ref, watch } from 'vue'

interface VisitRecord {
  path: string
  title: string
  ts: number
}

interface ProgressState {
  lastVisit: VisitRecord | null
  /** key: 归一化路径 -> 读完时间戳 */
  read: Record<string, number>
}

const STORAGE_KEY = 'ai-docs:reading-progress'
const TOOLS = ['claude-code', 'codex', 'openclaw', 'hermes'] as const

export function normalizePath(path: string): string {
  // 去 hash、去 .html、去末尾 /
  const p = path.split('#')[0].split('?')[0].replace(/\.html$/, '').replace(/\/$/, '')
  return p || '/'
}

/** 是否是某个工具区下面的"章节"（不含工具落地页 /openclaw/ 自身） */
export function isChapterPath(path: string): boolean {
  const p = normalizePath(path)
  for (const tool of TOOLS) {
    if (p.startsWith(`/${tool}/`)) return true
  }
  return false
}

const TOOL_LABELS: Record<string, string> = {
  'claude-code': 'Claude Code',
  'codex': 'Codex',
  'openclaw': 'OpenClaw',
  'hermes': 'Hermes',
}

/** 从路径里取出工具信息（slug + 显示名）；非章节路径返回 null */
export function getToolFromPath(path: string): { slug: string; label: string } | null {
  const p = normalizePath(path)
  const slug = p.split('/').filter(Boolean)[0]
  if (slug && TOOL_LABELS[slug]) return { slug, label: TOOL_LABELS[slug] }
  return null
}

function load(): ProgressState {
  if (typeof window === 'undefined') return { lastVisit: null, read: {} }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { lastVisit: null, read: {} }
    const parsed = JSON.parse(raw)
    return {
      lastVisit: parsed.lastVisit ?? null,
      read: parsed.read ?? {},
    }
  } catch (e) {
    console.warn('[readingProgress] load failed', e)
    return { lastVisit: null, read: {} }
  }
}

function save(s: ProgressState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch (e) {
    console.warn('[readingProgress] save failed', e)
  }
}

export const progress = ref<ProgressState>(load())

if (typeof window !== 'undefined') {
  watch(progress, (v) => save(v), { deep: true })
}

export function recordVisit(rawPath: string, title: string) {
  const path = normalizePath(rawPath)
  if (!isChapterPath(path)) return
  // 标题去掉可能的 ANCHOR / 多空格
  const cleanTitle = (title || '').trim().replace(/\s+/g, ' ')
  if (!cleanTitle) return
  progress.value = {
    ...progress.value,
    lastVisit: { path, title: cleanTitle, ts: Date.now() },
  }
}

export function markRead(rawPath: string) {
  const path = normalizePath(rawPath)
  if (!isChapterPath(path)) return
  if (progress.value.read[path]) return
  progress.value = {
    ...progress.value,
    read: { ...progress.value.read, [path]: Date.now() },
  }
}

export function isRead(rawPath: string): boolean {
  return !!progress.value.read[normalizePath(rawPath)]
}
