import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hook'
import { fetchAdminStats } from '@/slices/admin.slice'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'

const AdminDashboard = () => {
  const dispatch = useAppDispatch()
  const { adminStats, isLoading, error } = useAppSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAdminStats())
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
        <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
        <p className='text-gray-600'>Tổng quan về hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Tổng Users</CardTitle>
            <CardDescription>Tất cả người dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{adminStats?.users.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
            <CardDescription>Người dùng đã đăng ký</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{adminStats?.users.subscribers ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trainers</CardTitle>
            <CardDescription>Huấn luyện viên</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{adminStats?.users.trainers ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admins</CardTitle>
            <CardDescription>Quản trị viên</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{adminStats?.users.admins ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tổng Prompts</CardTitle>
            <CardDescription>Tất cả prompts đã tạo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{adminStats?.prompts ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tổng Logic Rules</CardTitle>
            <CardDescription>Tất cả logic rules đã tạo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{adminStats?.logic_rules ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Survey Questions</CardTitle>
            <CardDescription>Câu hỏi khảo sát</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{adminStats?.survey_questions ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tổng tiền giao dịch</CardTitle>
            <CardDescription>Tổng tiền đã thanh toán (VND)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {adminStats?.purchase_history.total_money_paid_vnd?.toLocaleString() ?? 0} VND
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê giao dịch theo tuần/tháng/năm dạng Tabs */}
      <div className='mt-8'>
        <Tabs defaultValue='week' className='w-full'>
          <TabsList className='flex gap-2 mb-4'>
            <TabsTrigger
              value='week'
              className='px-4 py-2 rounded-md border data-[state=active]:bg-primary data-[state=active]:text-white'
            >
              Tuần này
            </TabsTrigger>
            <TabsTrigger
              value='month'
              className='px-4 py-2 rounded-md border data-[state=active]:bg-primary data-[state=active]:text-white'
            >
              Tháng này
            </TabsTrigger>
            <TabsTrigger
              value='year'
              className='px-4 py-2 rounded-md border data-[state=active]:bg-primary data-[state=active]:text-white'
            >
              Năm nay
            </TabsTrigger>
          </TabsList>
          <TabsContent value='week'>
            <Card className='rounded-2xl border-2 border-gray-200 shadow-lg p-6'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xl font-bold'>Giao dịch tuần này</CardTitle>
              </CardHeader>
              <CardContent className='pl-2'>
                <div className='text-base mb-1'>
                  Số giao dịch:{' '}
                  <span className='font-bold text-lg'>{adminStats?.purchase_history.week.count ?? 0}</span>
                </div>
                <div className='text-base'>
                  Tổng tiền:{' '}
                  <span className='font-bold text-lg'>
                    {adminStats?.purchase_history.week.money_vnd?.toLocaleString() ?? 0} VND
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='month'>
            <Card className='rounded-2xl border-2 border-gray-200 shadow-lg p-6'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xl font-bold'>Giao dịch tháng này</CardTitle>
              </CardHeader>
              <CardContent className='pl-2'>
                <div className='text-base mb-1'>
                  Số giao dịch:{' '}
                  <span className='font-bold text-lg'>{adminStats?.purchase_history.month.count ?? 0}</span>
                </div>
                <div className='text-base'>
                  Tổng tiền:{' '}
                  <span className='font-bold text-lg'>
                    {adminStats?.purchase_history.month.money_vnd?.toLocaleString() ?? 0} VND
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='year'>
            <Card className='rounded-2xl border-2 border-gray-200 shadow-lg p-6'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xl font-bold'>Giao dịch năm nay</CardTitle>
              </CardHeader>
              <CardContent className='pl-2'>
                <div className='text-base mb-1'>
                  Số giao dịch:{' '}
                  <span className='font-bold text-lg'>{adminStats?.purchase_history.year.count ?? 0}</span>
                </div>
                <div className='text-base'>
                  Tổng tiền:{' '}
                  <span className='font-bold text-lg'>
                    {adminStats?.purchase_history.year.money_vnd?.toLocaleString() ?? 0} VND
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard
