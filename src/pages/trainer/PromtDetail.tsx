import type { AppDispatch, RootState } from '@/app/store'
import DeletePromptDialog from '@/components/common/DeletePromptDialog'
import EditPromptDialog from '@/components/common/EditPromptDialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { getPromptDetail } from '@/slices/prompt.slice'
import { Activity, ArrowLeft, Calendar, Edit, FileText, Tag, User } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const PromtDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { promptDetail, isLoading, error } = useSelector((state: RootState) => state.prompt)

  useEffect(() => {
    if (id) {
      dispatch(getPromptDetail(id))
    }
  }, [id, dispatch])

  const handleBack = () => {
    navigate('/trainer/prompts')
  }

  const handleDeleted = () => {
    navigate('/trainer/prompts')
  }

  const handleUpdated = () => {
    if (id) {
      dispatch(getPromptDetail(id))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'trading':
        return 'bg-blue-100 text-blue-800'
      case 'analysis':
        return 'bg-green-100 text-green-800'
      case 'education':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className='p-6 space-y-6'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-64' />
            <Skeleton className='h-4 w-full' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-32 w-full' />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-6'>
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!promptDetail) {
    return (
      <div className='p-6'>
        <Alert>
          <AlertDescription>Không tìm thấy prompt</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleBack}
            className='flex items-center space-x-2 cursor-pointer'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>Quay lại</span>
          </Button>
          <div>
            <h1 className='text-2xl font-bold'>{promptDetail.name}</h1>
            <p className='text-gray-600'>Chi tiết prompt</p>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <EditPromptDialog prompt={promptDetail} onUpdated={handleUpdated} />
          <DeletePromptDialog promptId={promptDetail.id} promptName={promptDetail.name} onDeleted={handleDeleted} />
        </div>
      </div>

      {/* Status and Category */}
      <div className='flex items-center space-x-4'>
        <Badge
          variant={promptDetail.is_active ? 'default' : 'secondary'}
          className={`flex items-center space-x-1 ${promptDetail.is_active ? 'bg-green-500' : 'bg-gray-400'}`}
        >
          <Activity className='h-3 w-3' />
          <span>{promptDetail.is_active ? 'Hoạt động' : 'Tạm dừng'}</span>
        </Badge>
        <Badge className={`flex items-center space-x-1 ${getCategoryColor(promptDetail.category)}`}>
          <Tag className='h-3 w-3' />
          <span>{promptDetail.category}</span>
        </Badge>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Prompt Content */}
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <FileText className='h-5 w-5' />
                <span>Mô tả</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700 leading-relaxed'>{promptDetail.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <FileText className='h-5 w-5' />
                <span>Nội dung Prompt</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='bg-gray-50 rounded-lg p-4'>
                <pre className='whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed'>
                  {promptDetail.prompt_text}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <User className='h-4 w-4 text-gray-500' />
                <div>
                  <p className='text-sm font-medium'>Trainer</p>
                  <p className='text-sm text-gray-600'>ID: {promptDetail.trainer_id.slice(0, 8)}...</p>
                </div>
              </div>

              <Separator />

              <div className='flex items-center space-x-3'>
                <Calendar className='h-4 w-4 text-gray-500' />
                <div>
                  <p className='text-sm font-medium'>Ngày tạo</p>
                  <p className='text-sm text-gray-600'>{formatDate(promptDetail.created_at)}</p>
                </div>
              </div>

              <Separator />

              <div className='flex items-center space-x-3'>
                <Edit className='h-4 w-4 text-gray-500' />
                <div>
                  <p className='text-sm font-medium'>Cập nhật lần cuối</p>
                  <p className='text-sm text-gray-600'>{formatDate(promptDetail.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PromtDetail
