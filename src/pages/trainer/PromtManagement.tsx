import { useAppDispatch, useAppSelector } from '@/app/hook'
import CreatePromptDialog from '@/components/common/CreatePromptDialog'
import PromptCard from '@/components/common/PromptCard'
import UploadDocumentDialog from '@/components/common/UploadDocumentDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchPrompts as fetchAdminPrompts } from '@/slices/admin.slice'
import { getPrompts, getStats } from '@/slices/prompt.slice'
import { Activity, BarChart3, FileText, Filter, Search, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'

const PromtManagement = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const promptState = useAppSelector((state) => (user?.role === 'admin' ? state.admin : state.prompt))
  const { prompts, isLoading } = promptState
  // const adminState = useReduxSelector((state: RootState) => state.admin)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    loadData()
    // eslint-disable-next-line
  }, [user?.role])

  const loadData = async () => {
    try {
      if (user?.role === 'admin') {
        await dispatch(fetchAdminPrompts({})).unwrap()
      } else {
        await Promise.all([dispatch(getPrompts({})).unwrap(), dispatch(getStats()).unwrap()])
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleSearch = () => {
    const params: any = {}

    if (selectedCategory !== 'all') {
      params.category = selectedCategory
    }

    if (selectedStatus !== 'all') {
      params.is_active = selectedStatus === 'active'
    }

    if (user?.role === 'admin') {
      dispatch(fetchAdminPrompts(params))
    } else {
      dispatch(getPrompts(params))
    }
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && prompt.is_active) ||
      (selectedStatus === 'inactive' && !prompt.is_active)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const StatCard = ({ title, value, icon: Icon, description }: any) => (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>Quản lý Prompt</h1>
          <p className='text-gray-600 mt-1'>Tạo và quản lý các prompt cho hệ thống AI</p>
        </div>
        <div className='flex gap-2'>
          <CreatePromptDialog onCreated={loadData} />
          <UploadDocumentDialog onUploaded={loadData} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          title='Tổng số prompt'
          value={prompts.length}
          icon={FileText}
          description='Tất cả prompt trong hệ thống'
        />
        <StatCard
          title='Đang hoạt động'
          value={prompts.filter((p) => p.is_active).length}
          icon={Activity}
          description='Prompt đang được sử dụng'
        />
        <StatCard
          title='Tạm dừng'
          value={prompts.filter((p) => !p.is_active).length}
          icon={TrendingUp}
          description='Prompt đã tạm dừng'
        />
        <StatCard
          title='Danh mục'
          value={new Set(prompts.map((p) => p.category)).size}
          icon={BarChart3}
          description='Số danh mục khác nhau'
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Filter className='h-5 w-5' />
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Tìm kiếm prompt...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <div className='flex items-center justify-between md:flex-row flex-col'>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className='w-full md:w-48'>
                  <SelectValue placeholder='Chọn danh mục' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả danh mục</SelectItem>
                  {Array.from(new Set(prompts.map((p) => p.category))).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className='w-full md:w-48'>
                  <SelectValue placeholder='Trạng thái' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                  <SelectItem value='active'>Hoạt động</SelectItem>
                  <SelectItem value='inactive'>Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSearch} className='w-full md:w-auto cursor-pointer'>
              Tìm kiếm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prompt List */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Danh sách prompt ({filteredPrompts.length})</h2>
          <div className='flex items-center space-x-2'>
            <Badge variant='outline'>{filteredPrompts.length} kết quả</Badge>
          </div>
        </div>

        {isLoading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-3 w-full' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='h-20 w-full' />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <FileText className='h-12 w-12 text-gray-400 mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>Không tìm thấy prompt nào</h3>
              <p className='text-gray-600 text-center mb-4'>Hãy thử điều chỉnh bộ lọc hoặc tạo prompt mới</p>
              <CreatePromptDialog onCreated={loadData} />
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} onUpdated={loadData} onDeleted={loadData} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PromtManagement
