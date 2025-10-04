export function toParams(obj: Record<string, any>) {
  const p = new URLSearchParams()
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (Array.isArray(v)) v.forEach((vv) => p.append(k, String(vv)))
    else p.set(k, String(v))
  })
  return p.toString()
}
