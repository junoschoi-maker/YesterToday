import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WeatherSnapshot } from '@/types/weather'

type Props = {
  label: string
  snapshot: WeatherSnapshot
}

export function WeatherCard({ label, snapshot }: Props) {
  return (
    <Card className="flex-1 min-w-0">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Stat label="기온" value={`${snapshot.tempC}°C`} />
          <Stat label="체감" value={`${snapshot.feelsLikeC}°C`} />
          <Stat label="바람" value={`${snapshot.windMs} m/s`} />
          <Stat label="강수" value={`${snapshot.precipitationMm} mm`} />
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}
