import { useAppDispatch, useAppSelector } from '@/app/hook'
import { DeleteLogicRuleDialog } from '@/components/common/DeleteLogicRuleDialog'
import { LogicRuleCard } from '@/components/common/LogicRuleCard'
import PromptCard from '@/components/common/PromptCard'
import { Button } from '@/components/ui/button'
import {
  bulkAddStrategies,
  deleteLogicRuleStrategy,
  deletePromptStrategy,
  fetchStrategiesRecommendations,
  getMyStrategy
} from '@/slices/strategy.slice'
import type { LogicRule } from '@/types/logicRules'
import type { RecommendedLogicRule, RecommendedPrompt, StrategyPrompt } from '@/types/strategy.type'
import { useCallback, useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa'

const Strategy = () => {
  const dispatch = useAppDispatch()
  const { my_strategies, recommendations, isLoading, isUpdating, isBulkUpdating } = useAppSelector(
    (state) => state.strategy
  )
  const [showDeleteLogicRuleDialog, setShowDeleteLogicRuleDialog] = useState(false)
  const [logicRuleToDelete, setLogicRuleToDelete] = useState<LogicRule | null>(null)
  const [showAddStrategy, setShowAddStrategy] = useState(false)
  const [selectedPromptIds, setSelectedPromptIds] = useState<string[]>([])
  const [selectedLogicRuleIds, setSelectedLogicRuleIds] = useState<string[]>([])

  // Fetch data on mount
  useEffect(() => {
    dispatch(getMyStrategy())
  }, [dispatch])

  // Fetch recommendations only when dialog mở
  useEffect(() => {
    if (showAddStrategy) {
      dispatch(fetchStrategiesRecommendations())
    }
  }, [showAddStrategy, dispatch])

  // Quick delete prompt
  // Xóa prompt khỏi chiến lược: truyền strategy_id
  const handleDeletePrompt = useCallback(
    async (strategyId: string) => {
      await dispatch(deletePromptStrategy(strategyId))
      dispatch(getMyStrategy())
    },
    [dispatch]
  )

  // Quick delete logic rule
  const handleDeleteLogicRule = useCallback(async (rule: LogicRule) => {
    setLogicRuleToDelete(rule)
    setShowDeleteLogicRuleDialog(true)
  }, [])

  const confirmDeleteLogicRule = async () => {
    if (logicRuleToDelete) {
      await dispatch(deleteLogicRuleStrategy(logicRuleToDelete.id))
      setShowDeleteLogicRuleDialog(false)
      setLogicRuleToDelete(null)
      dispatch(getMyStrategy())
    }
  }

  // Add strategy (prompt or logic rule)
  const handleAddStrategy = async () => {
    if (selectedPromptIds.length || selectedLogicRuleIds.length) {
      await dispatch(
        bulkAddStrategies({
          prompt_ids: selectedPromptIds,
          logic_rule_ids: selectedLogicRuleIds,
          action: 'activate'
        })
      )
      setShowAddStrategy(false)
      setSelectedPromptIds([])
      setSelectedLogicRuleIds([])
      dispatch(getMyStrategy())
    }
  }

  // UI
  return (
    <div className='container mx-auto max-w-5xl p-4'>
      <h1 className='text-2xl font-bold mb-4'>Quản lý chiến lược của bạn</h1>

      {/* Quick actions */}
      <div className='flex gap-2 mb-6'>
        <Button onClick={() => dispatch(getMyStrategy())} disabled={isLoading || isUpdating}>
          Làm mới
        </Button>
        <Button variant='outline' onClick={() => setShowAddStrategy(true)}>
          Thêm chiến lược từ gợi ý
        </Button>
      </div>

      {/* Danh sách Prompt */}
      <h2 className='text-xl font-semibold mb-2'>Prompt của bạn</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
        {my_strategies.prompts.length === 0 && <div className='col-span-2 text-gray-500'>Chưa có prompt nào.</div>}
        {my_strategies.prompts.map((item: StrategyPrompt) => (
          <div key={item.strategy_id} className='group'>
            <div className='relative'>
              <PromptCard key={item.prompt.id} prompt={item.prompt} showActions={false} />
              <Button
                className='absolute bottom-3 right-4 z-10'
                size='icon'
                variant='ghost'
                onClick={() => handleDeletePrompt(item.prompt.id)}
                disabled={isUpdating}
                title='Xóa prompt khỏi chiến lược'
              >
                <FaTrash color='red' className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Danh sách Logic Rule */}
      <h2 className='text-xl font-semibold mb-2'>Logic Rule của bạn</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
        {my_strategies.logic_rules.length === 0 && (
          <div className='col-span-2 text-gray-500'>Chưa có logic rule nào.</div>
        )}
        {my_strategies.logic_rules.map((item: any) => {
          // Nếu là kiểu StrategyLogicRule thì lấy item.logic_rule, nếu là LogicRule thì lấy trực tiếp
          const rule = item.logic_rule ? item.logic_rule : item
          return (
            <LogicRuleCard
              key={rule.id}
              rule={rule}
              onEdit={() => {}}
              onView={() => {}}
              onDelete={handleDeleteLogicRule}
              onToggleActive={() => {}}
              isLoading={isUpdating}
            />
          )
        })}
      </div>

      {/* Dialog xác nhận xóa logic rule */}
      <DeleteLogicRuleDialog
        open={showDeleteLogicRuleDialog}
        onOpenChange={setShowDeleteLogicRuleDialog}
        rule={logicRuleToDelete}
        onConfirm={confirmDeleteLogicRule}
        isLoading={isUpdating}
      />

      {/* Dialog thêm strategy từ recommendations */}
      {showAddStrategy && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
          <div className='bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h3 className='text-lg font-bold mb-4'>Gợi ý chiến lược</h3>
            <div className='mb-4'>
              <div className='font-semibold mb-2'>Prompt gợi ý</div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {recommendations.recommended_prompts.length === 0 && (
                  <div className='col-span-2 text-gray-500'>Không có prompt gợi ý.</div>
                )}
                {recommendations.recommended_prompts.map((prompt: RecommendedPrompt) => (
                  <div
                    key={prompt.id}
                    className={`border rounded p-3 flex items-center gap-2 ${selectedPromptIds.includes(prompt.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() =>
                      setSelectedPromptIds((prev) =>
                        prev.includes(prompt.id) ? prev.filter((id) => id !== prompt.id) : [...prev, prompt.id]
                      )
                    }
                  >
                    <input type='checkbox' checked={selectedPromptIds.includes(prompt.id)} readOnly />
                    <div>
                      <div className='font-medium'>{prompt.name}</div>
                      <div className='text-xs text-gray-500 line-clamp-2'>{prompt.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='mb-4'>
              <div className='font-semibold mb-2'>Logic Rule gợi ý</div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {recommendations.recommended_logic_rules.length === 0 && (
                  <div className='col-span-2 text-gray-500'>Không có logic rule gợi ý.</div>
                )}
                {recommendations.recommended_logic_rules.map((rule: RecommendedLogicRule) => (
                  <div
                    key={rule.id}
                    className={`border rounded p-3 flex items-center gap-2 ${selectedLogicRuleIds.includes(rule.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() =>
                      setSelectedLogicRuleIds((prev) =>
                        prev.includes(rule.id) ? prev.filter((id) => id !== rule.id) : [...prev, rule.id]
                      )
                    }
                  >
                    <input type='checkbox' checked={selectedLogicRuleIds.includes(rule.id)} readOnly />
                    <div>
                      <div className='font-medium'>{rule.name}</div>
                      <div className='text-xs text-gray-500 line-clamp-2'>{rule.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex justify-end gap-2 mt-6'>
              <Button variant='outline' onClick={() => setShowAddStrategy(false)} disabled={isBulkUpdating}>
                Hủy
              </Button>
              <Button
                onClick={handleAddStrategy}
                disabled={isBulkUpdating || (!selectedPromptIds.length && !selectedLogicRuleIds.length)}
              >
                {isBulkUpdating ? 'Đang thêm...' : 'Thêm vào chiến lược'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Strategy
