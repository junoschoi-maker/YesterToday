import { Wind, CloudRain, Shirt, Layers, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { OutfitRecommendation } from '@/lib/outfit/rules'

type Props = {
  recommendation: OutfitRecommendation
  actualTempC: number
}

export function OutfitCard({ recommendation, actualTempC }: Props) {
  const { layer, rationale, feelsLikeC, windMs } = recommendation

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 pt-2">
        {/* Hero: 체감온도 크게, 실제 기온 작게 */}
        <div className="flex flex-col gap-0.5">
          <p className="text-[56px] font-bold leading-none tabular-nums">
            {feelsLikeC}°
          </p>
          <p className="text-sm text-muted-foreground">
            체감온도 · 실제 {actualTempC}°C
          </p>
        </div>

        {/* 바람/강수 배지 */}
        <div className="flex flex-wrap gap-2">
          <WeatherBadge icon={<Wind className="size-3.5" />} label={`${windMs} m/s`} />
          {layer.needsRainGear && (
            <WeatherBadge icon={<CloudRain className="size-3.5" />} label="강수 있음" />
          )}
        </div>

        {/* 경고 배지 */}
        {(layer.needsWindbreaker || layer.needsRainGear) && (
          <div className="flex flex-col gap-2">
            {layer.needsWindbreaker && (
              <WarningBadge icon={<Wind className="size-4" />} label="방풍재킷 권장" />
            )}
            {layer.needsRainGear && (
              <WarningBadge icon={<CloudRain className="size-4" />} label="우비 / 방수 재킷 권장" />
            )}
          </div>
        )}

        {/* 착장 리스트 */}
        <div className="flex flex-col gap-3">
          <OutfitRow icon={<Shirt className="size-4" />} label="상의" value={layer.top} />
          <OutfitRow icon={<Layers className="size-4" />} label="하의" value={layer.bottom} />
          {layer.accessories.length > 0 && (
            <OutfitRow
              icon={<Tag className="size-4" />}
              label="액세서리"
              value={layer.accessories.join(', ')}
            />
          )}
        </div>

        <p className="text-xs text-muted-foreground">{rationale}</p>
      </CardContent>
    </Card>
  )
}

function WeatherBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      {icon}
      {label}
    </span>
  )
}

function WarningBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className={cn(
      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
      'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    )}>
      {icon}
      {label}
    </div>
  )
}

function OutfitRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  )
}
