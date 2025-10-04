import { NextResponse } from 'next/server'
import warZonesData from '../../../data/war-zones.json'

export async function GET() {
  try {
    // 실시간 데이터 시뮬레이션을 위한 랜덤 강도 업데이트
    const updatedFeatures = warZonesData.features.map((feature: any) => {
      // 지역별로 다른 변동성을 적용
      const volatility = feature.properties.severity === 'extreme' ? 1.5 : 
                        feature.properties.severity === 'high' ? 1.0 : 0.5
      const randomIntensityChange = (Math.random() - 0.5) * volatility
      const newIntensity = Math.max(0, Math.min(10, feature.properties.intensity + randomIntensityChange))
      
      // 상태별 색상 및 상태 업데이트
      let status = feature.properties.status
      if (newIntensity > 8.5) {
        status = 'active_conflict'
      } else if (newIntensity > 6.5) {
        status = 'shelling'
      } else if (newIntensity > 4.0) {
        status = 'tension'
      } else if (newIntensity > 2.0) {
        status = 'monitoring'
      } else {
        status = 'stable'
      }
      
      return {
        ...feature,
        properties: {
          ...feature.properties,
          intensity: Number(newIntensity.toFixed(1)),
          lastUpdate: new Date().toISOString(),
          status: status
        }
      }
    })

    // 통계 계산
    const activeConflicts = updatedFeatures.filter((f: any) => f.properties.status === 'active_conflict').length
    const shellingZones = updatedFeatures.filter((f: any) => f.properties.status === 'shelling').length
    const tensionZones = updatedFeatures.filter((f: any) => f.properties.status === 'tension').length
    const extremeSeverity = updatedFeatures.filter((f: any) => f.properties.severity === 'extreme').length
    const highSeverity = updatedFeatures.filter((f: any) => f.properties.severity === 'high').length
    
    const response = {
      ...warZonesData,
      features: updatedFeatures,
      lastUpdated: new Date().toISOString(),
      statistics: {
        totalZones: updatedFeatures.length,
        activeConflicts,
        shellingZones,
        tensionZones,
        extremeSeverity,
        highSeverity,
        averageIntensity: Number((updatedFeatures.reduce((sum: number, f: any) => sum + f.properties.intensity, 0) / updatedFeatures.length).toFixed(2))
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching war zones data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch war zones data' },
      { status: 500 }
    )
  }
}
