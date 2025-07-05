import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { MoreHorizontal, Edit, Eye, Trash2, Activity, Clock, Zap, Target } from 'lucide-react'
import type { LogicRule } from '@/types/logicRules'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface LogicRuleCardProps {
  rule: LogicRule
  onEdit: (rule: LogicRule) => void
  onView: (rule: LogicRule) => void
  onDelete: (rule: LogicRule) => void
  onToggleActive: (rule: LogicRule, isActive: boolean) => void
  isLoading?: boolean
}

const ACTION_COLORS = {
  BUY: 'bg-green-100 text-green-800 border-green-200',
  SELL: 'bg-red-100 text-red-800 border-red-200',
  HOLD: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ALERT: 'bg-blue-100 text-blue-800 border-blue-200'
}

const ACTION_ICONS = {
  BUY: '📈',
  SELL: '📉',
  HOLD: '✋',
  ALERT: '🔔'
}

const ACTION_LABELS = {
  BUY: 'Mua',
  SELL: 'Bán',
  HOLD: 'Giữ',
  ALERT: 'Cảnh báo'
}

const INDICATOR_LABELS = {
  RSI: 'RSI',
  MACD: 'MACD',
  SMA: 'SMA',
  EMA: 'EMA',
  BOLLINGER_BANDS: 'Bollinger Bands',
  VOLUME: 'Volume',
  PRICE: 'Price'
}

const OPERATOR_LABELS = {
  '>': '>',
  '<': '<',
  '>=': '≥',
  '<=': '≤',
  '==': '=',
  CROSSES_ABOVE: '↗️',
  CROSSES_BELOW: '↘️'
}

const TIMEFRAME_LABELS = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1d'
}

export const LogicRuleCard: React.FC<LogicRuleCardProps> = ({
  rule,
  onEdit,
  onView,
  onDelete,
  onToggleActive,
  isLoading = false
}) => {
  const getActionColor = (action: string) => ACTION_COLORS[action as keyof typeof ACTION_COLORS] || ACTION_COLORS.ALERT

  const getActionIcon = (action: string) => ACTION_ICONS[action as keyof typeof ACTION_ICONS] || ACTION_ICONS.ALERT

  const getActionLabel = (action: string) => ACTION_LABELS[action as keyof typeof ACTION_LABELS] || 'Không xác định'

  const getIndicatorLabel = (indicator: string) =>
    INDICATOR_LABELS[indicator as keyof typeof INDICATOR_LABELS] || indicator

  const getOperatorLabel = (operator: string) => OPERATOR_LABELS[operator as keyof typeof OPERATOR_LABELS] || operator

  const getTimeframeLabel = (timeframe: string) =>
    TIMEFRAME_LABELS[timeframe as keyof typeof TIMEFRAME_LABELS] || timeframe

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi })
    } catch {
      return dateString
    }
  }

  const getRuleText = () => {
    return `${getIndicatorLabel(rule.indicator)} ${getOperatorLabel(rule.operator)} ${rule.threshold_value}`
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${!rule.is_active ? 'opacity-60' : ''}`}>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-lg font-semibold flex items-center gap-2'>
              <Target className='h-4 w-4 text-blue-600' />
              {rule.name}
            </CardTitle>
            <div className='flex items-center gap-2 mt-1'>
              <Badge variant={rule.is_active ? 'default' : 'secondary'} className='text-xs'>
                {rule.is_active ? 'Hoạt động' : 'Tạm dừng'}
              </Badge>
              <Badge variant='outline' className='text-xs'>
                Độ ưu tiên: {rule.priority}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onView(rule)}>
                <Eye className='h-4 w-4 mr-2' />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(rule)}>
                <Edit className='h-4 w-4 mr-2' />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(rule)} className='text-red-600 hover:text-red-700'>
                <Trash2 className='h-4 w-4 mr-2' />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Rule Logic Preview */}
        <div className='space-y-2'>
          {/* IF Block */}
          <div className='bg-blue-50 p-3 rounded-lg border-2 border-blue-200 hover:bg-blue-100 transition-colors duration-200'>
            <div className='flex items-center gap-2 text-sm'>
              <Badge className='bg-blue-600 text-white px-3 py-1 text-xs font-bold'>NẾU</Badge>
              <span className='font-semibold text-blue-900'>{getRuleText()}</span>
            </div>
          </div>

          {/* THEN Block */}
          <div className='bg-green-50 p-3 rounded-lg border-2 border-green-200 hover:bg-green-100 transition-colors duration-200'>
            <div className='flex items-center gap-2 text-sm'>
              <Badge className='bg-green-600 text-white px-3 py-1 text-xs font-bold'>THÌ</Badge>
              <span className='text-lg mr-1'>{getActionIcon(rule.action)}</span>
              <Badge className={`text-xs ${getActionColor(rule.action)} font-semibold`}>
                {getActionLabel(rule.action)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Rule Description */}
        {rule.description && <p className='text-sm text-gray-600 line-clamp-2'>{rule.description}</p>}

        {/* Rule Stats */}
        <div className='grid grid-cols-3 gap-3 text-xs'>
          <div className='flex items-center gap-1'>
            <Activity className='h-3 w-3 text-blue-500' />
            <span className='text-gray-600'>{getIndicatorLabel(rule.indicator)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock className='h-3 w-3 text-green-500' />
            <span className='text-gray-600'>{getTimeframeLabel(rule.timeframe)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Zap className='h-3 w-3 text-yellow-500' />
            <span className='text-gray-600'>#{rule.priority}</span>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between pt-2 border-t'>
          <div className='flex items-center gap-2'>
            <Switch
              checked={rule.is_active}
              onCheckedChange={(checked) => onToggleActive(rule, checked)}
              disabled={isLoading}
            />
            <span className='text-xs text-gray-500'>{rule.is_active ? 'Bật' : 'Tắt'}</span>
          </div>
          <div className='text-xs text-gray-500'>Cập nhật {formatDate(rule.updated_at)}</div>
        </div>
      </CardContent>
    </Card>
  )
}
