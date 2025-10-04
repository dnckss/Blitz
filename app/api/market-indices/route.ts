import { NextResponse } from 'next/server'

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY
const TWELVEDATA_KEY = process.env.TWELVEDATA_API_KEY

interface MarketIndex {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
}

export async function GET() {
  try {
    const indices: MarketIndex[] = []

    // S&P 500
    if (ALPHA_VANTAGE_KEY) {
      try {
        const sp500Url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${ALPHA_VANTAGE_KEY}&outputsize=compact`
        const sp500Res = await fetch(sp500Url)
        if (sp500Res.ok) {
          const sp500Data = await sp500Res.json()
          const timeSeries = sp500Data?.['Time Series (Daily)']
          if (timeSeries) {
            const sortedDates = Object.keys(timeSeries).sort()
            const latest = timeSeries[sortedDates[sortedDates.length - 1]]
            const previous = timeSeries[sortedDates[sortedDates.length - 2]]
            
            if (latest && previous) {
              const currentValue = parseFloat(latest['4. close'])
              const previousValue = parseFloat(previous['4. close'])
              const change = currentValue - previousValue
              const changePercent = (change / previousValue) * 100

              indices.push({
                symbol: 'SPY',
                name: 'S&P 500',
                value: currentValue,
                change: change,
                changePercent: changePercent
              })
            }
          }
        }
      } catch (error) {
        console.log('S&P 500 API failed:', error)
      }
    }

    // VIX (Fear Index)
    if (ALPHA_VANTAGE_KEY) {
      try {
        const vixUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=VIX&apikey=${ALPHA_VANTAGE_KEY}&outputsize=compact`
        const vixRes = await fetch(vixUrl)
        if (vixRes.ok) {
          const vixData = await vixRes.json()
          const timeSeries = vixData?.['Time Series (Daily)']
          if (timeSeries) {
            const sortedDates = Object.keys(timeSeries).sort()
            const latest = timeSeries[sortedDates[sortedDates.length - 1]]
            const previous = timeSeries[sortedDates[sortedDates.length - 2]]
            
            if (latest && previous) {
              const currentValue = parseFloat(latest['4. close'])
              const previousValue = parseFloat(previous['4. close'])
              const change = currentValue - previousValue
              const changePercent = (change / previousValue) * 100

              indices.push({
                symbol: 'VIX',
                name: 'VIX 지수',
                value: currentValue,
                change: change,
                changePercent: changePercent
              })
            }
          }
        }
      } catch (error) {
        console.log('VIX API failed:', error)
      }
    }

    // NASDAQ
    if (TWELVEDATA_KEY) {
      try {
        const nasdaqUrl = `https://api.twelvedata.com/time_series?symbol=QQQ&interval=1day&outputsize=2&apikey=${TWELVEDATA_KEY}`
        const nasdaqRes = await fetch(nasdaqUrl)
        if (nasdaqRes.ok) {
          const nasdaqData = await nasdaqRes.json()
          const values = nasdaqData?.values || []
          if (values.length >= 2) {
            const latest = values[0]
            const previous = values[1]
            
            const currentValue = parseFloat(latest.close)
            const previousValue = parseFloat(previous.close)
            const change = currentValue - previousValue
            const changePercent = (change / previousValue) * 100

            indices.push({
              symbol: 'QQQ',
              name: 'NASDAQ',
              value: currentValue,
              change: change,
              changePercent: changePercent
            })
          }
        }
      } catch (error) {
        console.log('NASDAQ API failed:', error)
      }
    }

    // DXY (Dollar Index)
    if (TWELVEDATA_KEY) {
      try {
        const dxyUrl = `https://api.twelvedata.com/time_series?symbol=DXY&interval=1day&outputsize=2&apikey=${TWELVEDATA_KEY}`
        const dxyRes = await fetch(dxyUrl)
        if (dxyRes.ok) {
          const dxyData = await dxyRes.json()
          const values = dxyData?.values || []
          if (values.length >= 2) {
            const latest = values[0]
            const previous = values[1]
            
            const currentValue = parseFloat(latest.close)
            const previousValue = parseFloat(previous.close)
            const change = currentValue - previousValue
            const changePercent = (change / previousValue) * 100

            indices.push({
              symbol: 'DXY',
              name: '달러 지수',
              value: currentValue,
              change: change,
              changePercent: changePercent
            })
          }
        }
      } catch (error) {
        console.log('DXY API failed:', error)
      }
    }

    // If no real data available, return simulated data
    if (indices.length === 0) {
      indices.push(
        {
          symbol: 'SPY',
          name: 'S&P 500',
          value: 4850.25,
          change: Math.random() * 40 - 20,
          changePercent: Math.random() * 2 - 1
        },
        {
          symbol: 'VIX',
          name: 'VIX 지수',
          value: 18.5 + Math.random() * 10,
          change: Math.random() * 4 - 2,
          changePercent: Math.random() * 15 + 5
        }
      )
    }

    return NextResponse.json(indices, { 
      headers: { 
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600' 
      } 
    })
  } catch (error) {
    console.error('Error fetching market indices:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch market indices' 
    }, { status: 500 })
  }
}
