import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store'
import { getStats } from '@/slices/prompt.slice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Activity, FileText, Settings } from 'lucide-react'

const TrainerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { stats, isLoading, error } = useSelector((state: RootState) => state.prompt)

  useEffect(() => {
    dispatch(getStats())
  }, [dispatch])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Đang tải thống kê...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <p className='text-red-600'>Lỗi: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard Trainer</h1>
        <p className='text-gray-600'>Tổng quan về hoạt động training của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng Prompts</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.total_prompts || 0}</div>
            <p className='text-xs text-muted-foreground'>Tất cả prompts đã tạo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Prompts Hoạt Động</CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.active_prompts || 0}</div>
            <p className='text-xs text-muted-foreground'>Prompts đang được sử dụng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng Logic Rules</CardTitle>
            <Settings className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.total_logic_rules || 0}</div>
            <p className='text-xs text-muted-foreground'>Tất cả logic rules đã tạo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Logic Rules Hoạt Động</CardTitle>
            <BarChart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.active_logic_rules || 0}</div>
            <p className='text-xs text-muted-foreground'>Logic rules đang được sử dụng</p>
          </CardContent>
        </Card>
      </div>

      {/* Prompts by Category */}
      {stats?.prompts_by_category && Object.keys(stats.prompts_by_category).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prompts theo Danh Mục</CardTitle>
            <CardDescription>Phân bố prompts theo từng danh mục</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {Object.entries(stats.prompts_by_category).map(([category, count]) => (
                <Badge key={category} variant='secondary' className='text-sm'>
                  {category}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Thêm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Tỷ lệ prompts hoạt động:</span>
              <span className='text-sm font-medium'>
                {stats?.total_prompts ? `${Math.round((stats.active_prompts / stats.total_prompts) * 100)}%` : '0%'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Tỷ lệ logic rules hoạt động:</span>
              <span className='text-sm font-medium'>
                {stats?.total_logic_rules
                  ? `${Math.round((stats.active_logic_rules / stats.total_logic_rules) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TrainerDashboard
