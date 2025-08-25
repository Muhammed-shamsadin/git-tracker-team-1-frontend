import { Badge } from "@/components/ui/badge"
import type { StatusConfig } from "./types"
import type { FC } from "react"

interface StatusBadgeProps {
  status: string
  config?: StatusConfig
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status, config }) => {
  if (!config || !config[status]) {
    return <Badge variant="secondary">{status}</Badge>
  }

  const { icon, color, label } = config[status]
  return (
    <Badge variant="secondary" className={`bg-${color}-100 text-${color}-800 border-${color}-200`}>
      <span className="mr-1">{icon}</span>
      {label || status}
    </Badge>
  )
}
