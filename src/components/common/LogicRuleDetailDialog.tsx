import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, Clock, Target, Zap, Activity, Settings } from 'lucide-react'
import type { LogicRule } from '@/types/logicRules'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface LogicRuleDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: LogicRule | null
}

const INDICATOR_LABELS = {
  RSI: 'RSI (Relative Strength Index)',
  MACD: 'MACD (Moving Average Convergence Divergence)',
  SMA: 'SMA (Simple Moving Average)',
  EMA: 'EMA (Exponential Moving Average)',
  BOLLINGER_BANDS: 'Bollinger Bands',
  VOLUME: 'Volume',
  PRICE: 'Price'
}

const OPERATOR_LABELS = {
  '>': 'Lớn hơn (>)',
  '<': 'Nhỏ hơn (<)',
  '>=': 'Lớn hơn hoặc bằng (>=)',
  '<=': 'Nhỏ hơn hoặc bằng (<=)',
  '==': 'Bằng (==)',
  CROSSES_ABOVE: 'Vượt lên trên',
  CROSSES_BELOW: 'Vượt xuống dưới'
}

const ACTION_LABELS = {
  BUY: { label: 'Mua', color: 'bg-green-500', icon: '📈' },
  SELL: { label: 'Bán', color: 'bg-red-500', icon: '📉' },
  HOLD: { label: 'Giữ', color: 'bg-yellow-500', icon: '✋' },
  ALERT: { label: 'Cảnh báo', color: 'bg-blue-500', icon: '🔔' }
}

const TIMEFRAME_LABELS = {
  '1m': '1 phút',
  '5m': '5 phút',
  '15m': '15 phút',
  '1h': '1 giờ',
  '4h': '4 giờ',
  '1d': '1 ngày'
}

export const LogicRuleDetailDialog: React.FC<LogicRuleDetailDialogProps> = ({ open, onOpenChange, rule }) => {
  if (!rule) return null

  const getIndicatorLabel = (indicator: string) =>
    INDICATOR_LABELS[indicator as keyof typeof INDICATOR_LABELS] || indicator

  const getOperatorLabel = (operator: string) => OPERATOR_LABELS[operator as keyof typeof OPERATOR_LABELS] || operator

  const getActionInfo = (action: string) => ACTION_LABELS[action as keyof typeof ACTION_LABELS] || ACTION_LABELS.ALERT

  const getTimeframeLabel = (timeframe: string) =>
    TIMEFRAME_LABELS[timeframe as keyof typeof TIMEFRAME_LABELS] || timeframe

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi })
    } catch {
      return dateString
    }
  }

  const actionInfo = getActionInfo(rule.action)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-6xl w-[95vw] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <Target className='h-5 w-5 text-blue-600' />
              <span>{rule.name}</span>
            </div>
            <Badge variant={rule.is_active ? 'default' : 'secondary'}>
              {rule.is_active ? 'Đang hoạt động' : 'Tạm dừng'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Overview Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center gap-2'>
                  <Activity className='h-4 w-4 text-blue-600' />
                  <div>
                    <p className='text-sm font-medium'>Chỉ báo</p>
                    <p className='text-xs text-gray-600'>{getIndicatorLabel(rule.indicator)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-green-600' />
                  <div>
                    <p className='text-sm font-medium'>Khung thời gian</p>
                    <p className='text-xs text-gray-600'>{getTimeframeLabel(rule.timeframe)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center gap-2'>
                  <Zap className='h-4 w-4 text-yellow-600' />
                  <div>
                    <p className='text-sm font-medium'>Độ ưu tiên</p>
                    <p className='text-xs text-gray-600'>{rule.priority}/10</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center gap-2'>
                  <Settings className='h-4 w-4 text-gray-600' />
                  <div>
                    <p className='text-sm font-medium'>Trạng thái</p>
                    <p className='text-xs text-gray-600'>{rule.is_active ? 'Hoạt động' : 'Tạm dừng'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rule Logic */}
          <Card>
            <CardHeader>
              <CardTitle>Quy tắc logic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {/* IF Section */}
                <div className='flex items-start gap-3'>
                  <Badge
                    variant='outline'
                    className='mt-1 px-3 py-1 bg-blue-100 text-blue-800 border-blue-300 font-semibold'
                  >
                    NẾU
                  </Badge>
                  <div className='flex-1'>
                    <div className='bg-blue-50 p-4 rounded-lg border-2 border-blue-200'>
                      <div className='flex items-center gap-2 text-sm'>
                        <Badge variant='secondary' className='bg-blue-600 text-white'>
                          {getIndicatorLabel(rule.indicator)}
                        </Badge>
                        <span className='font-semibold text-blue-800'>{getOperatorLabel(rule.operator)}</span>
                        <Badge variant='outline' className='bg-blue-100 text-blue-800 border-blue-300 font-semibold'>
                          {rule.threshold_value}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* THEN Section */}
                <div className='flex items-start gap-3'>
                  <Badge
                    variant='outline'
                    className='mt-1 px-3 py-1 bg-green-100 text-green-800 border-green-300 font-semibold'
                  >
                    THÌ
                  </Badge>
                  <div className='flex-1'>
                    <div className='bg-green-50 p-4 rounded-lg border-2 border-green-200'>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg'>{actionInfo.icon}</span>
                        <Badge className={actionInfo.color}>{actionInfo.label}</Badge>
                        <span className='text-sm text-gray-600'>
                          trên khung thời gian {getTimeframeLabel(rule.timeframe)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {rule.description && (
            <Card>
              <CardHeader>
                <CardTitle>Mô tả</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-700 whitespace-pre-wrap'>{rule.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Rule Example */}
          <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'>
            <CardHeader>
              <CardTitle className='text-blue-800'>Ví dụ minh họa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm text-blue-800'>
                <p className='font-medium mb-3'>Quy tắc này sẽ hoạt động như sau:</p>
                <div className='bg-white p-4 rounded-lg border border-blue-200'>
                  <p className='leading-relaxed'>
                    "<strong className='text-blue-700'>Nếu</strong>{' '}
                    <strong className='text-blue-600'>{getIndicatorLabel(rule.indicator)}</strong>{' '}
                    <span className='text-blue-600'>{getOperatorLabel(rule.operator).toLowerCase()}</span>{' '}
                    <strong className='text-blue-600'>{rule.threshold_value}</strong> trên khung thời gian{' '}
                    <strong className='text-blue-600'>{getTimeframeLabel(rule.timeframe)}</strong> →
                    <strong className='text-green-600'> Hệ thống sẽ gợi ý {actionInfo.label.toLowerCase()}</strong>"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm'>
                <div className='flex items-center gap-2'>
                  <CalendarDays className='h-4 w-4 text-gray-500' />
                  <span className='text-gray-600'>Tạo:</span>
                  <span>{formatDate(rule.created_at)}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CalendarDays className='h-4 w-4 text-gray-500' />
                  <span className='text-gray-600'>Cập nhật:</span>
                  <span>{formatDate(rule.updated_at)}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-600'>ID:</span>
                  <code className='bg-gray-100 px-2 py-1 rounded text-xs'>{rule.id}</code>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-600'>Trainer ID:</span>
                  <code className='bg-gray-100 px-2 py-1 rounded text-xs'>{rule.trainer_id}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
