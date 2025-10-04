import { NextRequest } from 'next/server'

// ReliefWeb API: requires free appname param. https://apidoc.reliefweb.int/
// After you set RELIEFWEB_APPNAME in .env, uncomment below.
const APPNAME = process.env.RELIEFWEB_APPNAME // e.g., 'yourname-warapp-abc123'

export async function GET(req: NextRequest) {
  const q = {
    query: {
      value: 'conflict OR war',
      operator: 'AND'
    },
    limit: 5,
    sort: ['date:desc'],
    fields: { include: ['title','url','date','country'] }
  }

  const url = `https://api.reliefweb.int/v2/reports?appname=${encodeURIComponent(APPNAME ?? 'warapp-localdev')}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(q)
  })
  const data = await res.json().catch(() => ({ data: [] }))
  return Response.json({
    reports: (data?.data ?? []).map((r: any) => ({
      title: r?.fields?.title,
      url: r?.fields?.url,
      date: r?.fields?.date?.created
    }))
  }, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } })
}
