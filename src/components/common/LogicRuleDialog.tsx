import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MultiSelectCheckbox from '@/components/ui/MultiSelectCheckbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type {
  LogicRule,
  LogicRuleAction,
  LogicRuleIndicator,
  LogicRuleOperator,
  LogicRuleTimeFrame
} from '@/types/logicRules'
import type { CategoryEnum } from '@/types/prompts'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { Move, Plus, Target, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface LogicCondition {
  id: string
  indicator: LogicRuleIndicator
  operator: LogicRuleOperator
  value: string
}

interface LogicRuleFormData {
  name: string
  description: string
  conditions: LogicCondition[]
  action: LogicRuleAction
  timeframe: LogicRuleTimeFrame
  priority: number
  is_active: boolean
  category: CategoryEnum[]
}

interface LogicRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule?: LogicRule
  onSubmit: (data: LogicRuleFormData) => void
  isLoading?: boolean
}

const INDICATORS = [
  { value: 'RSI', label: 'RSI (Relative Strength Index)' },
  { value: 'MACD', label: 'MACD (Moving Average Convergence Divergence)' },
  { value: 'SMA', label: 'SMA (Simple Moving Average)' },
  { value: 'EMA', label: 'EMA (Exponential Moving Average)' },
  { value: 'BOLLINGER_BANDS', label: 'Bollinger Bands' },
  { value: 'VOLUME', label: 'Volume' },
  { value: 'PRICE', label: 'Price' }
]

const OPERATORS = [
  { value: '>', label: 'Lớn hơn (>)' },
  { value: '<', label: 'Nhỏ hơn (<)' },
  { value: '>=', label: 'Lớn hơn hoặc bằng (>=)' },
  { value: '<=', label: 'Nhỏ hơn hoặc bằng (<=)' },
  { value: '==', label: 'Bằng (==)' },
  { value: 'CROSSES_ABOVE', label: 'Vượt lên trên' },
  { value: 'CROSSES_BELOW', label: 'Vượt xuống dưới' }
]

const ACTIONS = [
  { value: 'BUY', label: 'Mua', color: 'bg-green-500' },
  { value: 'SELL', label: 'Bán', color: 'bg-red-500' },
  { value: 'HOLD', label: 'Giữ', color: 'bg-yellow-500' },
  { value: 'ALERT', label: 'Cảnh báo', color: 'bg-blue-500' }
]

const TIMEFRAMES = [
  { value: '1m', label: '1 phút' },
  { value: '5m', label: '5 phút' },
  { value: '15m', label: '15 phút' },
  { value: '1h', label: '1 giờ' },
  { value: '4h', label: '4 giờ' },
  { value: '1d', label: '1 ngày' }
]

export const LogicRuleDialog: React.FC<LogicRuleDialogProps> = ({
  open,
  onOpenChange,
  rule,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<LogicRuleFormData>({
    name: '',
    description: '',
    conditions: [],
    action: 'BUY',
    timeframe: '1d',
    priority: 1,
    is_active: true,
    category: ['general']
  })

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description,
        conditions: [
          {
            id: '1',
            indicator: rule.indicator,
            operator: rule.operator,
            value: rule.threshold_value
          }
        ],
        action: rule.action,
        timeframe: rule.timeframe,
        priority: rule.priority,
        is_active: rule.is_active,
        category: rule.category ? (rule.category.split(',').map((cat) => cat.trim()) as CategoryEnum[]) : ['general']
      })
    } else {
      setFormData({
        name: '',
        description: '',
        conditions: [],
        action: 'BUY',
        timeframe: '1d',
        priority: 1,
        is_active: true,
        category: ['general']
      })
    }
  }, [rule])

  const addCondition = () => {
    const newCondition: LogicCondition = {
      id: Date.now().toString(),
      indicator: 'RSI',
      operator: '<',
      value: '30'
    }
    setFormData((prev) => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }))
  }

  const removeCondition = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((c) => c.id !== id)
    }))
  }

  const updateCondition = (id: string, updates: Partial<LogicCondition>) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.map((c) => (c.id === id ? { ...c, ...updates } : c))
    }))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const reorderedConditions = Array.from(formData.conditions)
    const [removed] = reorderedConditions.splice(result.source.index, 1)
    reorderedConditions.splice(result.destination.index, 0, removed)

    setFormData((prev) => ({
      ...prev,
      conditions: reorderedConditions
    }))
  }

  const handleSubmit = () => {
    if (formData.name.trim() && formData.conditions.length > 0) {
      onSubmit(formData)
    }
  }

  const getConditionText = (condition: LogicCondition) => {
    const indicator = INDICATORS.find((i) => i.value === condition.indicator)?.label || condition.indicator
    const operator = OPERATORS.find((o) => o.value === condition.operator)?.label || condition.operator
    return `${indicator} ${operator} ${condition.value}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[600px] w-[95vw] max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{rule ? 'Chỉnh sửa quy tắc logic' : 'Tạo quy tắc logic mới'}</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Basic Info */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Tên quy tắc *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder='Ví dụ: Tín hiệu mua RSI'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='priority'>Độ ưu tiên</Label>
              <Input
                id='priority'
                type='number'
                min='1'
                max='10'
                value={formData.priority}
                onChange={(e) => setFormData((prev) => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='category'>Danh mục</Label>
              <MultiSelectCheckbox
                options={[
                  { value: 'general', label: 'Chung' },
                  { value: 'long_term', label: 'Dài hạn' },
                  { value: 'short_term', label: 'Ngắn hạn' },
                  { value: 'value_style', label: 'Đầu tư giá trị' },
                  { value: 'high_risk', label: 'Rủi ro cao' },
                  { value: 'moderate_risk', label: 'Rủi ro vừa' },
                  { value: 'low_risk', label: 'Rủi ro thấp' },
                  { value: 'goal_>10%', label: 'Mục tiêu >10%' },
                  { value: 'goal_learning', label: 'Mục tiêu học hỏi' },
                  { value: 'f0', label: 'F0' },
                  { value: 'advance', label: 'Nâng cao' },
                  { value: 'passive', label: 'Thụ động' },
                  { value: 'learning_mode', label: 'Chế độ học' },
                  { value: 'low_time', label: 'Ít thời gian' },
                  { value: 'active', label: 'Chủ động' }
                ]}
                value={formData.category}
                onChange={(selected) => setFormData((prev) => ({ ...prev, category: selected as CategoryEnum[] }))}
                className='mt-1'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Mô tả</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder='Mô tả chi tiết về quy tắc logic...'
              rows={3}
            />
          </div>

          {/* IF Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span>NẾU (IF) - Điều kiện</span>
                <Button onClick={addCondition} variant='outline' size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Thêm điều kiện
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.conditions.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                  Chưa có điều kiện nào. Nhấn "Thêm điều kiện" để bắt đầu.
                </div>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId='conditions'>
                    {(provided: any) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-3'>
                        {formData.conditions.map((condition, index) => (
                          <Draggable key={condition.id} draggableId={condition.id} index={index}>
                            {(provided: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                                  index === 0
                                    ? 'bg-blue-50 border-blue-300 hover:bg-blue-100 shadow-sm if-block'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                }`}
                              >
                                <div {...provided.dragHandleProps} className='cursor-move'>
                                  <Move className='h-4 w-4 text-gray-400' />
                                </div>

                                {index === 0 ? (
                                  <Badge className='bg-blue-600 text-white px-3 py-1 font-bold text-xs if-badge'>
                                    NẾU
                                  </Badge>
                                ) : (
                                  <Badge className='bg-gray-600 text-white px-3 py-1 font-bold text-xs and-badge'>
                                    VÀ
                                  </Badge>
                                )}

                                <div className='flex-1'>
                                  <div className='grid grid-cols-1 gap-3'>
                                    <div className='space-y-1'>
                                      <label className='text-xs font-medium text-gray-600 uppercase tracking-wide'>
                                        Chỉ báo
                                      </label>
                                      <Select
                                        value={condition.indicator}
                                        onValueChange={(value) =>
                                          updateCondition(condition.id, { indicator: value as LogicRuleIndicator })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder='Chọn chỉ báo' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {INDICATORS.map((indicator) => (
                                            <SelectItem key={indicator.value} value={indicator.value}>
                                              {indicator.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className='space-y-1'>
                                      <label className='text-xs font-medium text-gray-600 uppercase tracking-wide'>
                                        Toán tử
                                      </label>
                                      <Select
                                        value={condition.operator}
                                        onValueChange={(value) =>
                                          updateCondition(condition.id, { operator: value as LogicRuleOperator })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder='Chọn toán tử' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {OPERATORS.map((operator) => (
                                            <SelectItem key={operator.value} value={operator.value}>
                                              {operator.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className='space-y-1'>
                                      <label className='text-xs font-medium text-gray-600 uppercase tracking-wide'>
                                        Giá trị
                                      </label>
                                      <Input
                                        value={condition.value}
                                        onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                                        placeholder='Nhập giá trị'
                                      />
                                    </div>
                                  </div>
                                </div>

                                <Button
                                  onClick={() => removeCondition(condition.id)}
                                  variant='outline'
                                  size='sm'
                                  className='text-red-500 hover:bg-red-50'
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>

          {/* THEN Action */}
          <Card>
            <CardHeader>
              <CardTitle>THÌ (THEN) - Hành động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='action'>Hành động</Label>
                  <Select
                    value={formData.action}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, action: value as LogicRuleAction }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn hành động' />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIONS.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='timeframe'>Khung thời gian</Label>
                  <Select
                    value={formData.timeframe}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, timeframe: value as LogicRuleTimeFrame }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn khung thời gian' />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEFRAMES.map((timeframe) => (
                        <SelectItem key={timeframe.value} value={timeframe.value}>
                          {timeframe.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {formData.conditions.length > 0 && (
            <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'>
              <CardHeader>
                <CardTitle className='text-blue-800 flex items-center gap-2'>
                  <Target className='h-5 w-5' />
                  Xem trước quy tắc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-sm space-y-3'>
                  <div className='flex items-center gap-2 p-3 bg-blue-100 rounded-lg rule-preview-item if-item'>
                    <Badge className='bg-blue-600 text-white px-3 py-1 font-bold text-xs if-badge'>NẾU</Badge>
                    <span className='font-medium'>{getConditionText(formData.conditions[0])}</span>
                  </div>
                  {formData.conditions.slice(1).map((condition) => (
                    <div
                      key={condition.id}
                      className='flex items-center gap-2 p-3 bg-gray-100 rounded-lg rule-preview-item'
                    >
                      <Badge className='bg-gray-600 text-white px-3 py-1 font-bold text-xs and-badge'>VÀ</Badge>
                      <span className='font-medium'>{getConditionText(condition)}</span>
                    </div>
                  ))}
                  <div className='flex items-center gap-2 p-3 bg-green-100 rounded-lg rule-preview-item then-item'>
                    <Badge className='bg-green-600 text-white px-3 py-1 font-bold text-xs then-badge'>THÌ</Badge>
                    <Badge className={ACTIONS.find((a) => a.value === formData.action)?.color}>
                      {ACTIONS.find((a) => a.value === formData.action)?.label}
                    </Badge>
                    <span className='text-sm text-gray-600'>trong khung thời gian {formData.timeframe}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='is_active'
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor='is_active'>Kích hoạt quy tắc</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !formData.name.trim() || formData.conditions.length === 0}
          >
            {isLoading ? 'Đang lưu...' : rule ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
