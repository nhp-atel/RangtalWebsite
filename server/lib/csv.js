// Minimal RFC-4180-ish CSV serializer (no dependency).
export function toCsv(rows, columns) {
  const escape = (v) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const header = columns.map((c) => escape(c.label)).join(',')
  const body = rows
    .map((r) => columns.map((c) => escape(r[c.key])).join(','))
    .join('\n')
  return header + '\n' + (body ? body + '\n' : '')
}
