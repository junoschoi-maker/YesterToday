import { cn } from '@/lib/utils'

type Props = {
  deltaC: number
}

export function DeltaHero({ deltaC }: Props) {
  const sign = deltaC > 0 ? '+' : ''
  const colorClass =
    deltaC > 1 ? 'text-amber-500' :
    deltaC < -1 ? 'text-blue-500' :
    'text-slate-500'
  const label =
    deltaC > 1 ? '어제보다 따뜻해요' :
    deltaC < -1 ? '어제보다 추워요' :
    '어제와 비슷해요'

  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <p className={cn('text-[72px] font-bold leading-none tabular-nums', colorClass)}>
        {sign}{deltaC}°
      </p>
      <p className="text-base text-muted-foreground">{label}</p>
    </div>
  )
}
