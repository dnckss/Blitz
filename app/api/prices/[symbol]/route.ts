import { NextRequest } from 'next/server'

const EIA_KEY = process.env.EIA_API_KEY // free key
const METALS_KEY = process.env.METALS_API_KEY // free tier
// Optional: Twelve Data (free tier) for intraday, set TWELVEDATA_API_KEY

// 2025년 10월 5일 기준 더미 데이터
const DUMMY_DATA = {
  'XAU': {
    points: [
      { x: '2025-09-01', y: 2650.50 },
      { x: '2025-09-02', y: 2645.20 },
      { x: '2025-09-03', y: 2658.75 },
      { x: '2025-09-04', y: 2672.30 },
      { x: '2025-09-05', y: 2685.90 },
      { x: '2025-09-06', y: 2678.45 },
      { x: '2025-09-07', y: 2692.15 },
      { x: '2025-09-08', y: 2705.80 },
      { x: '2025-09-09', y: 2718.25 },
      { x: '2025-09-10', y: 2730.60 },
      { x: '2025-09-11', y: 2725.40 },
      { x: '2025-09-12', y: 2740.85 },
      { x: '2025-09-13', y: 2755.20 },
      { x: '2025-09-14', y: 2768.75 },
      { x: '2025-09-15', y: 2782.30 },
      { x: '2025-09-16', y: 2775.45 },
      { x: '2025-09-17', y: 2790.80 },
      { x: '2025-09-18', y: 2805.15 },
      { x: '2025-09-19', y: 2818.60 },
      { x: '2025-09-20', y: 2832.25 },
      { x: '2025-09-21', y: 2825.90 },
      { x: '2025-09-22', y: 2840.35 },
      { x: '2025-09-23', y: 2855.70 },
      { x: '2025-09-24', y: 2870.15 },
      { x: '2025-09-25', y: 2885.50 },
      { x: '2025-09-26', y: 2878.25 },
      { x: '2025-09-27', y: 2895.80 },
      { x: '2025-09-28', y: 2910.35 },
      { x: '2025-09-29', y: 2925.70 },
      { x: '2025-09-30', y: 2940.15 },
      { x: '2025-10-01', y: 2935.80 },
      { x: '2025-10-02', y: 2950.45 },
      { x: '2025-10-03', y: 2965.20 },
      { x: '2025-10-04', y: 2980.75 },
      { x: '2025-10-05', y: 2995.30 }
    ]
  },
  'WTI': {
    points: [
      { x: '2025-09-01', y: 78.50 },
      { x: '2025-09-02', y: 79.20 },
      { x: '2025-09-03', y: 77.85 },
      { x: '2025-09-04', y: 80.15 },
      { x: '2025-09-05', y: 81.30 },
      { x: '2025-09-06', y: 79.75 },
      { x: '2025-09-07', y: 82.45 },
      { x: '2025-09-08', y: 83.60 },
      { x: '2025-09-09', y: 84.25 },
      { x: '2025-09-10', y: 85.90 },
      { x: '2025-09-11', y: 84.75 },
      { x: '2025-09-12', y: 86.35 },
      { x: '2025-09-13', y: 87.20 },
      { x: '2025-09-14', y: 88.45 },
      { x: '2025-09-15', y: 89.80 },
      { x: '2025-09-16', y: 88.25 },
      { x: '2025-09-17', y: 90.15 },
      { x: '2025-09-18', y: 91.40 },
      { x: '2025-09-19', y: 92.75 },
      { x: '2025-09-20', y: 94.20 },
      { x: '2025-09-21', y: 92.85 },
      { x: '2025-09-22', y: 95.30 },
      { x: '2025-09-23', y: 96.65 },
      { x: '2025-09-24', y: 98.10 },
      { x: '2025-09-25', y: 99.45 },
      { x: '2025-09-26', y: 97.80 },
      { x: '2025-09-27', y: 100.25 },
      { x: '2025-09-28', y: 101.60 },
      { x: '2025-09-29', y: 103.15 },
      { x: '2025-09-30', y: 104.80 },
      { x: '2025-10-01', y: 103.25 },
      { x: '2025-10-02', y: 105.90 },
      { x: '2025-10-03', y: 107.45 },
      { x: '2025-10-04', y: 109.20 },
      { x: '2025-10-05', y: 110.75 }
    ]
  },
  'BRENT': {
    points: [
      { x: '2025-09-01', y: 82.75 },
      { x: '2025-09-02', y: 83.40 },
      { x: '2025-09-03', y: 81.95 },
      { x: '2025-09-04', y: 84.25 },
      { x: '2025-09-05', y: 85.60 },
      { x: '2025-09-06', y: 84.15 },
      { x: '2025-09-07', y: 86.85 },
      { x: '2025-09-08', y: 87.90 },
      { x: '2025-09-09', y: 88.55 },
      { x: '2025-09-10', y: 90.20 },
      { x: '2025-09-11', y: 89.05 },
      { x: '2025-09-12', y: 90.75 },
      { x: '2025-09-13', y: 91.60 },
      { x: '2025-09-14', y: 92.85 },
      { x: '2025-09-15', y: 94.20 },
      { x: '2025-09-16', y: 92.65 },
      { x: '2025-09-17', y: 94.55 },
      { x: '2025-09-18', y: 95.80 },
      { x: '2025-09-19', y: 97.15 },
      { x: '2025-09-20', y: 98.60 },
      { x: '2025-09-21', y: 97.25 },
      { x: '2025-09-22', y: 99.70 },
      { x: '2025-09-23', y: 101.05 },
      { x: '2025-09-24', y: 102.50 },
      { x: '2025-09-25', y: 103.85 },
      { x: '2025-09-26', y: 102.20 },
      { x: '2025-09-27', y: 104.65 },
      { x: '2025-09-28', y: 106.00 },
      { x: '2025-09-29', y: 107.55 },
      { x: '2025-09-30', y: 109.20 },
      { x: '2025-10-01', y: 107.65 },
      { x: '2025-10-02', y: 110.30 },
      { x: '2025-10-03', y: 111.85 },
      { x: '2025-10-04', y: 113.60 },
      { x: '2025-10-05', y: 115.15 }
    ]
  }
}

export async function GET(_: NextRequest, { params }: { params: { symbol: string }}) {
  const symbol = params.symbol.toUpperCase()

  if (symbol === 'XAU') {
    // Metals-API: latest + timeseries
    // https://metals-api.com/documentation
    const end = new Date()
    const start = new Date(end.getTime() - 30*24*3600*1000)
    const fmt = (d: Date) => d.toISOString().slice(0,10)

    try {
      // NOTE: supply METALS_API_KEY in .env.local
      // If you don't want to use Metals-API, you can swap to FRED's GOLDAMGBD228NLBM series (requires free FRED key)
      const url = `https://metals-api.com/api/timeseries?access_key=${METALS_KEY}&start_date=${fmt(start)}&end_date=${fmt(end)}&base=USD&symbols=XAU`
      const r = await fetch(url)
      if (!r.ok) throw new Error('API failed')
      const j = await r.json()
      const rates = j?.rates ?? {}
      const points = Object.keys(rates).sort().map(k => ({ x: k, y: 1 / (rates[k]?.XAU ?? 0) })).filter(p => Number.isFinite(p.y))
      
      // API 데이터가 없거나 비어있으면 더미 데이터 사용
      if (points.length === 0) {
        return Response.json(DUMMY_DATA['XAU'], { headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=1800' } })
      }
      
      return Response.json({ points }, { headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=1800' } })
    } catch (error) {
      console.log('Gold API failed, using dummy data:', error)
      return Response.json(DUMMY_DATA['XAU'], { headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=1800' } })
    }
  }

  // Oil via EIA v2 API (daily WTI/Brent). Free, requires EIA_API_KEY.
  // WTI daily series id: PET.RWTC.D ; Brent daily: PET.RBRTE.D  (EIA)
  const seriesId = symbol === 'WTI' ? 'PET.RWTC.D' : symbol === 'BRENT' ? 'PET.RBRTE.D' : null
  if (!seriesId) return Response.json({ points: [] }, { status: 400 })

  try {
    // Use API v1 series endpoint for simplicity.
    const url = `https://api.eia.gov/series/?api_key=${EIA_KEY}&series_id=${seriesId}`

    const r = await fetch(url, { next: { revalidate: 3600 } })
    if (!r.ok) throw new Error('API failed')
    const j = await r.json()
    const arr = j?.series?.[0]?.data ?? []
    
    // data format: [[date, value], ...] date is YYYYMMDD or YYYYMM
    const points = (arr.slice(0, 120).reverse()).map((row: any) => {
      const [d, v] = row
      const s = String(d)
      const iso = s.length === 8 ? `${s.substring(0,4)}-${s.substring(4,6)}-${s.substring(6,8)}` : `${s.substring(0,4)}-${s.substring(4,6)}-01`
      return { x: iso, y: Number(v) }
    }).filter((p: { y: number }) => Number.isFinite(p.y))

    // API 데이터가 없거나 비어있으면 더미 데이터 사용
    if (points.length === 0) {
      return Response.json(DUMMY_DATA[symbol as keyof typeof DUMMY_DATA], { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=21600' } })
    }

    return Response.json({ points }, { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=21600' } })
  } catch (error) {
    console.log('Oil API failed, using dummy data:', error)
    return Response.json(DUMMY_DATA[symbol as keyof typeof DUMMY_DATA], { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=21600' } })
  }
}
