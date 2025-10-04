import { NextRequest } from 'next/server'

const EIA_KEY = process.env.EIA_API_KEY // free key
const METALS_KEY = process.env.METALS_API_KEY // free tier
// Optional: Twelve Data (free tier) for intraday, set TWELVEDATA_API_KEY

export async function GET(_: NextRequest, { params }: { params: { symbol: string }}) {
  const symbol = params.symbol.toUpperCase()

  if (symbol === 'XAU') {
    // Metals-API: latest + timeseries
    // https://metals-api.com/documentation
    const end = new Date()
    const start = new Date(end.getTime() - 30*24*3600*1000)
    const fmt = (d: Date) => d.toISOString().slice(0,10)

    // NOTE: supply METALS_API_KEY in .env.local
    // If you don't want to use Metals-API, you can swap to FRED's GOLDAMGBD228NLBM series (requires free FRED key)
    const url = `https://metals-api.com/api/timeseries?access_key=${METALS_KEY}&start_date=${fmt(start)}&end_date=${fmt(end)}&base=USD&symbols=XAU`
    const r = await fetch(url)
    if (!r.ok) return Response.json({ points: [] })
    const j = await r.json()
    const rates = j?.rates ?? {}
    const points = Object.keys(rates).sort().map(k => ({ x: k, y: 1 / (rates[k]?.XAU ?? 0) })).filter(p => Number.isFinite(p.y))
    return Response.json({ points }, { headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=1800' } })
  }

  // Oil via EIA v2 API (daily WTI/Brent). Free, requires EIA_API_KEY.
  // WTI daily series id: PET.RWTC.D ; Brent daily: PET.RBRTE.D  (EIA)
  const seriesId = symbol === 'WTI' ? 'PET.RWTC.D' : symbol === 'BRENT' ? 'PET.RBRTE.D' : null
  if (!seriesId) return Response.json({ points: [] }, { status: 400 })

  // Use API v1 series endpoint for simplicity.
  const url = `https://api.eia.gov/series/?api_key=${EIA_KEY}&series_id=${seriesId}`

  const r = await fetch(url, { next: { revalidate: 3600 } })
  if (!r.ok) return Response.json({ points: [] })
  const j = await r.json()
  const arr = j?.series?.[0]?.data ?? []
  // data format: [[date, value], ...] date is YYYYMMDD or YYYYMM
  const points = (arr.slice(0, 120).reverse()).map((row: any) => {
    const [d, v] = row
    const s = String(d)
    const iso = s.length === 8 ? `${s.substring(0,4)}-${s.substring(4,6)}-${s.substring(6,8)}` : `${s.substring(0,4)}-${s.substring(4,6)}-01`
    return { x: iso, y: Number(v) }
  }).filter(p => Number.isFinite(p.y))

  return Response.json({ points }, { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=21600' } })
}
