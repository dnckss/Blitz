import { NextRequest } from 'next/server'

// GDELT GEO 2.0 API -> GeoJSON output
// Docs: https://blog.gdeltproject.org/gdelt-geo-2-0-api-debuts/
// Example: https://api.gdeltproject.org/api/v2/geo/geo?format=GeoJSON&mode=PointData&query=war%20OR%20conflict%20OR%20attack&startdatetime=20250101000000&enddatetime=20250102235959
// NOTE: GDELT is free. No key required.

function yyyymmddhhmmss(d: Date) {
  const pad = (n: number, l=2) => n.toString().padStart(l, '0')
  return d.getUTCFullYear().toString()
    + pad(d.getUTCMonth()+1)
    + pad(d.getUTCDate())
    + pad(d.getUTCHours())
    + pad(d.getUTCMinutes())
    + pad(d.getUTCSeconds())
}

export async function GET(req: NextRequest) {
  const hours = Number(req.nextUrl.searchParams.get('hours') ?? '24')
  const end = new Date()
  const start = new Date(end.getTime() - hours*60*60*1000)

  const params = new URLSearchParams({
    format: 'GeoJSON',
    mode: 'PointData',
    query: 'war OR conflict OR military OR attack OR clashes OR shelling OR airstrike',
    startdatetime: yyyymmddhhmmss(start),
    enddatetime: yyyymmddhhmmss(end)
  })

  const url = `https://api.gdeltproject.org/api/v2/geo/geo?${params}`
  const res = await fetch(url, { next: { revalidate: 0 } })
  if (!res.ok) {
    return Response.json({ type: 'FeatureCollection', features: [] })
  }
  const geo = await res.json()

  // add a derived "severity" (very naive): use mentioncount if present
  for (const f of geo.features ?? []) {
    const m = Number(f.properties?.mentioncount ?? 0)
    f.properties.severity = m > 50 ? 2 : m > 10 ? 1 : 0
  }

  return Response.json(geo, { headers: { 'Cache-Control': 'no-store' } })
}
