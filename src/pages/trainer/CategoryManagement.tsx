import { useAppDispatch, useAppSelector } from '@/app/hook'
import { DeleteLogicRuleDialog } from '@/components/common/DeleteLogicRuleDialog'
import { LogicRuleCard } from '@/components/common/LogicRuleCard'
import { LogicRuleDetailDialog } from '@/components/common/LogicRuleDetailDialog'
import { LogicRuleDialog } from '@/components/common/LogicRuleDialog'
import { Card } from '@/components/ui/card'
import { deleteLogicRule, updateLogicRule } from '@/slices/logicRule.slice'
import { getCategorizedContent } from '@/slices/prompt.slice'
import type { LogicRule } from '@/types/logicRules'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import type { LogicRuleFormData } from './RuleController'

const CATEGORY_LABELS: Record<string, string> = {
  long_term: 'Dài hạn',
  short_term: 'Ngắn hạn',
  value_style: 'Đầu tư giá trị',
  high_risk: 'Rủi ro cao',
  moderate_risk: 'Rủi ro vừa',
  low_risk: 'Rủi ro thấp',
  'goal_>10%': 'Mục tiêu >10%',
  goal_learning: 'Mục tiêu học hỏi',
  f0: 'F0',
  advance: 'Nâng cao',
  passive: 'Thụ động',
  learning_mode: 'Chế độ học',
  low_time: 'Ít thời gian',
  active: 'Chủ động',
  general: 'Chung'
}

const CategoryManagement = () => {
  const dispatch = useAppDispatch()
  const { categorizedContent, isLoading } = useAppSelector((state) => state.prompt)
  const navigate = useNavigate()

  // Loading states
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  // Dialog states
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedRule, setSelectedRule] = useState<LogicRule | null>(null)

  // Tab state
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    dispatch(getCategorizedContent())
  }, [dispatch])

  if (isLoading) return <div className='p-4'>Đang tải dữ liệu...</div>
  if (!categorizedContent) return <div className='p-4'>Không có dữ liệu</div>

  // Lấy danh sách category
  const categoryKeys = Object.keys(categorizedContent)
  // Nếu chưa chọn tab, chọn tab đầu tiên
  const activeCategory = selectedCategory || categoryKeys[0]

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

  const viewPromptDetail = (prompt: any) => {
    navigate(`/trainer/prompts/${prompt.id}`, {
      state: { prompt } // Truyền dữ liệu prompt vào state để sử dụng trong trang chi tiết
    })
  }

  return (
    <div className='p-4'>
      {/* Combobox for category selection */}
      <div className='mb-4'>
        <label htmlFor='category-select' className='block text-sm font-medium text-gray-700 mb-1'>
          Chọn category
        </label>
        <select
          id='category-select'
          className='border rounded px-3 py-2 w-full max-w-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={activeCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categoryKeys.map((key) => {
            const content = categorizedContent[key as keyof typeof categorizedContent]
            const prompts = content.prompts || content.prompts || []
            const logicRules = content.logic_rules || []
            return (
              <option key={key} value={key}>
                {`${CATEGORY_LABELS[key] || key} (${prompts.length} prompt, ${logicRules.length} rule)`}
              </option>
            )
          })}
        </select>
      </div>

      {/* Content for selected category */}
      {(() => {
        const key = activeCategory
        const content = categorizedContent[key as keyof typeof categorizedContent]
        const prompts = content.prompts || content.prompts || []
        const logicRules = content.logic_rules || []
        return (
          <div className='border rounded-lg p-4 bg-white shadow-sm'>
            <div className='bg-gray-50 rounded-lg p-4'>
              <h2 className='text-lg font-bold mb-2 text-blue-700'>{CATEGORY_LABELS[key] || key}</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Prompts */}
                <div>
                  <h3 className='font-semibold mb-2 text-gray-700'>Prompts</h3>
                  <div className='space-y-2'>
                    {prompts.length === 0 && <div className='text-xs text-gray-400'>Không có prompt</div>}
                    {prompts.map((prompt: any) => (
                      <Card
                        key={prompt.id}
                        className='flex items-start justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 transition'
                        onClick={() => {
                          viewPromptDetail(prompt)
                        }}
                      >
                        <div>
                          <div className='font-medium text-sm'>{prompt.name}</div>
                          <div className='text-xs text-gray-500 line-clamp-1 max-w-xs'>{prompt.description}</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                {/* Logic Rules */}
                <div>
                  <h3 className='font-semibold mb-2 text-gray-700'>Logic Rules</h3>
                  <div className='space-y-2'>
                    {logicRules.length === 0 && <div className='text-xs text-gray-400'>Không có logic rule</div>}
                    {logicRules.map((rule: any) => (
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
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Dialogs */}
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

export default CategoryManagement
