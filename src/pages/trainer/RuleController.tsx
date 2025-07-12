import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Filter, Activity, BarChart3, Settings, AlertCircle } from 'lucide-react'
import { LogicRuleCard } from '@/components/common/LogicRuleCard'
import { LogicRuleDialog } from '@/components/common/LogicRuleDialog'
import { LogicRuleDetailDialog } from '@/components/common/LogicRuleDetailDialog'
import { DeleteLogicRuleDialog } from '@/components/common/DeleteLogicRuleDialog'
import { createLogicRule, getLogicRules, updateLogicRule, deleteLogicRule } from '@/slices/logicRule.slice'
import type { LogicRule, LogicRuleIndicator, LogicRuleAction } from '@/types/logicRules'
import type { CategoryEnum } from '@/types/prompts'
import { toast } from 'react-toastify'
import '@/components/common/LogicRuleController.css'

interface LogicRuleFormData {
  name: string
  description: string
  conditions: Array<{
    id: string
    indicator: LogicRuleIndicator
    operator: string
    value: string
  }>
  action: LogicRuleAction
  timeframe: string
  priority: number
  category: CategoryEnum | 'learning_mode'
  is_active: boolean
}

const RuleController = () => {
  const dispatch = useAppDispatch()
  const { logicRules, isLoading } = useAppSelector((state) => state.logicRule)

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedRule, setSelectedRule] = useState<LogicRule | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterIndicator, setFilterIndicator] = useState<string>('all')
  const [filterAction, setFilterAction] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<CategoryEnum | 'all'>('all')
  const [activeTab, setActiveTab] = useState('all')

  // Loading states
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    dispatch(getLogicRules({}))
  }, [dispatch])

  // Filter logic rules
  const filteredRules = logicRules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndicator = !filterIndicator || filterIndicator === 'all' || rule.indicator === filterIndicator
    const matchesAction = !filterAction || filterAction === 'all' || rule.action === filterAction
    const matchesStatus =
      !filterStatus || filterStatus === 'all' || (filterStatus === 'active' ? rule.is_active : !rule.is_active)
    const matchesCategory = filterCategory === 'all' || rule.category === filterCategory
    const matchesTab =
      activeTab === 'all' || (activeTab === 'active' && rule.is_active) || (activeTab === 'inactive' && !rule.is_active)

    return matchesSearch && matchesIndicator && matchesAction && matchesStatus && matchesCategory && matchesTab
  })

  // Get statistics
  const stats = {
    total: logicRules.length,
    active: logicRules.filter((r) => r.is_active).length,
    inactive: logicRules.filter((r) => !r.is_active).length,
    byAction: {
      BUY: logicRules.filter((r) => r.action === 'BUY').length,
      SELL: logicRules.filter((r) => r.action === 'SELL').length,
      HOLD: logicRules.filter((r) => r.action === 'HOLD').length,
      ALERT: logicRules.filter((r) => r.action === 'ALERT').length
    }
  }

  // Handlers
  const handleCreateRule = async (data: LogicRuleFormData) => {
    try {
      if (data.conditions.length === 0) {
        toast.error('Vui lòng thêm ít nhất một điều kiện')
        return
      }

      const payload = {
        name: data.name,
        description: data.description,
        indicator: data.conditions[0].indicator,
        operator: data.conditions[0].operator,
        threshold_value: data.conditions[0].value,
        action: data.action,
        timeframe: data.timeframe,
        priority: data.priority,
        category: data.category,
        is_active: data.is_active
      }

      await dispatch(createLogicRule(payload)).unwrap()
      setShowCreateDialog(false)
      toast.success('Tạo quy tắc logic thành công!')
    } catch (error) {
      toast.error('Không thể tạo quy tắc logic')
    }
  }

  const handleEditRule = async (data: LogicRuleFormData) => {
    if (!selectedRule) return

    try {
      if (data.conditions.length === 0) {
        toast.error('Vui lòng thêm ít nhất một điều kiện')
        return
      }

      const payload = {
        name: data.name,
        description: data.description,
        indicator: data.conditions[0].indicator,
        operator: data.conditions[0].operator,
        threshold_value: data.conditions[0].value,
        action: data.action,
        timeframe: data.timeframe,
        priority: data.priority,
        category: data.category,
        is_active: data.is_active
      }

      await dispatch(updateLogicRule({ id: selectedRule.id, data: payload })).unwrap()
      setShowEditDialog(false)
      setSelectedRule(null)
      toast.success('Cập nhật quy tắc logic thành công!')
    } catch (error) {
      toast.error('Không thể cập nhật quy tắc logic')
    }
  }

  const handleDeleteRule = async () => {
    if (!selectedRule) return

    setIsDeleting(true)
    try {
      await dispatch(deleteLogicRule(selectedRule.id)).unwrap()
      setShowDeleteDialog(false)
      setSelectedRule(null)
      toast.success('Xóa quy tắc logic thành công!')
    } catch (error) {
      toast.error('Không thể xóa quy tắc logic')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleActive = async (rule: LogicRule, isActive: boolean) => {
    setIsToggling(true)
    try {
      await dispatch(
        updateLogicRule({
          id: rule.id,
          data: { is_active: isActive }
        })
      ).unwrap()
      toast.success(`${isActive ? 'Kích hoạt' : 'Tạm dừng'} quy tắc thành công!`)
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái quy tắc')
    } finally {
      setIsToggling(false)
    }
  }

  const handleViewRule = (rule: LogicRule) => {
    setSelectedRule(rule)
    setShowDetailDialog(true)
  }

  const handleEditClick = (rule: LogicRule) => {
    setSelectedRule(rule)
    setShowEditDialog(true)
  }

  const handleDeleteClick = (rule: LogicRule) => {
    setSelectedRule(rule)
    setShowDeleteDialog(true)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterIndicator('all')
    setFilterAction('all')
    setFilterStatus('all')
    setFilterCategory('all')
  }

  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Quản lý quy tắc logic</h1>
          <p className='text-gray-600 mt-1'>Tạo và quản lý các quy tắc logic cho giao dịch chứng khoán</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className='flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          Tạo quy tắc mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 stats-grid'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2'>
              <BarChart3 className='h-4 w-4 text-blue-600' />
              <div>
                <p className='text-sm font-medium'>Tổng số quy tắc</p>
                <p className='text-2xl font-bold text-blue-600'>{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2'>
              <Activity className='h-4 w-4 text-green-600' />
              <div>
                <p className='text-sm font-medium'>Đang hoạt động</p>
                <p className='text-2xl font-bold text-green-600'>{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2'>
              <Settings className='h-4 w-4 text-gray-600' />
              <div>
                <p className='text-sm font-medium'>Tạm dừng</p>
                <p className='text-2xl font-bold text-gray-600'>{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>Tín hiệu mua</p>
                <p className='text-2xl font-bold text-green-600'>{stats.byAction.BUY}</p>
              </div>
              <Badge className='bg-green-100 text-green-800'>📈</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>Tín hiệu bán</p>
                <p className='text-2xl font-bold text-red-600'>{stats.byAction.SELL}</p>
              </div>
              <Badge className='bg-red-100 text-red-800'>📉</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Tìm kiếm quy tắc...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4'>
              <Select value={filterIndicator} onValueChange={setFilterIndicator}>
                <SelectTrigger>
                  <SelectValue placeholder='Tất cả chỉ báo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả chỉ báo</SelectItem>
                  <SelectItem value='RSI'>RSI</SelectItem>
                  <SelectItem value='MACD'>MACD</SelectItem>
                  <SelectItem value='SMA'>SMA</SelectItem>
                  <SelectItem value='EMA'>EMA</SelectItem>
                  <SelectItem value='BOLLINGER_BANDS'>Bollinger Bands</SelectItem>
                  <SelectItem value='VOLUME'>Volume</SelectItem>
                  <SelectItem value='PRICE'>Price</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder='Tất cả hành động' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả hành động</SelectItem>
                  <SelectItem value='BUY'>Mua</SelectItem>
                  <SelectItem value='SELL'>Bán</SelectItem>
                  <SelectItem value='HOLD'>Giữ</SelectItem>
                  <SelectItem value='ALERT'>Cảnh báo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder='Tất cả trạng thái' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                  <SelectItem value='active'>Đang hoạt động</SelectItem>
                  <SelectItem value='inactive'>Tạm dừng</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterCategory}
                onValueChange={(value) => setFilterCategory(value as CategoryEnum | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Tất cả danh mục' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả danh mục</SelectItem>
                  <SelectItem value='long_term'>Dài hạn</SelectItem>
                  <SelectItem value='short_term'>Ngắn hạn</SelectItem>
                  <SelectItem value='value_style'>Đầu tư giá trị</SelectItem>
                  <SelectItem value='high_risk'>Rủi ro cao</SelectItem>
                  <SelectItem value='moderate_risk'>Rủi ro vừa</SelectItem>
                  <SelectItem value='low_risk'>Rủi ro thấp</SelectItem>
                  <SelectItem value='goal_>10%'>Mục tiêu {'>'}10%</SelectItem>
                  <SelectItem value='goal_learning'>Mục tiêu học hỏi</SelectItem>
                  <SelectItem value='f0'>F0</SelectItem>
                  <SelectItem value='advance'>Nâng cao</SelectItem>
                  <SelectItem value='passive'>Thụ động</SelectItem>
                  <SelectItem value='learning_mode'>Chế độ học</SelectItem>
                  <SelectItem value='low_time'>Ít thời gian</SelectItem>
                  <SelectItem value='active'>Chủ động</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='all'>Tất cả ({stats.total})</TabsTrigger>
          <TabsTrigger value='active'>Hoạt động ({stats.active})</TabsTrigger>
          <TabsTrigger value='inactive'>Tạm dừng ({stats.inactive})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className='space-y-4'>
          {/* Rules List */}
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className='animate-pulse'>
                  <CardContent className='p-4'>
                    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                    <div className='h-3 bg-gray-200 rounded w-1/2 mb-4'></div>
                    <div className='h-16 bg-gray-200 rounded mb-4'></div>
                    <div className='h-3 bg-gray-200 rounded w-1/4'></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRules.length === 0 ? (
            <Card>
              <CardContent className='p-8 text-center'>
                <AlertCircle className='h-12 w-12 mx-auto text-gray-400 mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>Không có quy tắc logic nào</h3>
                <p className='text-gray-600 mb-4'>
                  {searchTerm || filterIndicator !== 'all' || filterAction !== 'all' || filterStatus !== 'all'
                    ? 'Không tìm thấy quy tắc nào phù hợp với bộ lọc.'
                    : 'Bạn chưa tạo quy tắc logic nào. Hãy tạo quy tắc đầu tiên!'}
                </p>
                {!searchTerm && filterIndicator === 'all' && filterAction === 'all' && filterStatus === 'all' && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className='h-4 w-4 mr-2' />
                    Tạo quy tắc đầu tiên
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredRules.map((rule) => (
                <LogicRuleCard
                  key={rule.id}
                  rule={rule}
                  onEdit={handleEditClick}
                  onView={handleViewRule}
                  onDelete={handleDeleteClick}
                  onToggleActive={handleToggleActive}
                  isLoading={isToggling}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <LogicRuleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateRule}
        isLoading={isLoading}
      />

      <LogicRuleDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        rule={selectedRule || undefined}
        onSubmit={handleEditRule}
        isLoading={isLoading}
      />

      <LogicRuleDetailDialog open={showDetailDialog} onOpenChange={setShowDetailDialog} rule={selectedRule} />

      <DeleteLogicRuleDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        rule={selectedRule}
        onConfirm={handleDeleteRule}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default RuleController
