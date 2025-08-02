import { useAppDispatch, useAppSelector } from '@/app/hook'
import EmailNotificationDialog from '@/components/common/EmailNotificationDialog'
import { Button } from '@/components/ui/button'
import { fetchEmailStatus } from '@/slices/email.slice'
import { fetchSurveyStatus } from '@/slices/survey.slice'
import { useEffect, useState } from 'react'

const Setting = () => {
  const dispatch = useAppDispatch()
  const { emailStatus } = useAppSelector((state) => state.email)
  const { status, isLoading: surveyLoading } = useAppSelector((state) => state.survey)
  const { user } = useAppSelector((state) => state.auth)
  const [showEmailDialog, setShowEmailDialog] = useState(false)

  useEffect(() => {
    dispatch(fetchEmailStatus())
    dispatch(fetchSurveyStatus())
  }, [dispatch])

  // Xử lý làm lại khảo sát
  const handleRedoSurvey = () => {
    window.location.href = '/survey?action=reset'
  }

  return (
    <div className='mx-auto py-8'>
      <h2 className='text-2xl font-bold mb-6'>Cài đặt người dùng</h2>

      {/* Thông tin người dùng */}
      <div className='mb-8 p-6 rounded-lg border bg-white shadow flex items-center gap-4'>
        {user?.avatar && <img src={user.avatar} alt='avatar' className='w-16 h-16 rounded-full object-cover border' />}
        <div>
          <div className='font-semibold text-lg'>{user?.full_name || 'Chưa có tên'}</div>
          <div className='text-sm text-gray-700'>
            Email: <span className='font-medium'>{user?.email || 'Chưa có'}</span>
          </div>
          <div className='text-sm text-gray-700'>
            Vai trò: <span className='font-medium'>{user?.role || 'user'}</span>
          </div>
          {user?.zalo_id && (
            <div className='text-sm text-gray-700'>
              Zalo: <span className='font-medium'>{user.zalo_name || user.zalo_id}</span>
            </div>
          )}
          <div className='text-sm text-gray-700'>
            Trạng thái Zalo:{' '}
            <span className='font-medium'>
              {user?.zalo_id ? (
                <span className='text-green-600'>Đã liên kết</span>
              ) : (
                <span className='text-red-600'>Chưa liên kết</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Quản lý email */}
      <div className='mb-8 p-6 rounded-lg border bg-white shadow'>
        <div className='flex items-center justify-between mb-2'>
          <div className='font-semibold text-lg'>Quản lý Email</div>
          <Button variant='outline' size='sm' onClick={() => setShowEmailDialog(true)}>
            {emailStatus.email_verified ? 'Thay đổi Email' : 'Thêm Email'}
          </Button>
        </div>
        <div className='text-sm text-gray-700'>
          <div>
            Email hiện tại: <span className='font-medium'>{emailStatus.current_email || 'Chưa có'}</span>
          </div>
          {emailStatus.pending_email && (
            <div>
              Email đang chờ xác thực: <span className='font-medium text-blue-600'>{emailStatus.pending_email}</span>
            </div>
          )}
          <div>
            Trạng thái:{' '}
            {emailStatus.email_verified ? (
              <span className='text-green-600'>Đã xác thực</span>
            ) : (
              <span className='text-red-600'>Chưa xác thực</span>
            )}
          </div>
        </div>
        <EmailNotificationDialog open={showEmailDialog} onOpenChange={setShowEmailDialog} />
      </div>

      {/* Quản lý khảo sát */}
      <div className='mb-8 p-6 rounded-lg border bg-white shadow'>
        <div className='font-semibold text-lg mb-2'>Trạng thái khảo sát</div>
        <div className='text-sm text-gray-700 mb-2'>
          {surveyLoading ? (
            <span>Đang tải trạng thái khảo sát...</span>
          ) : status?.is_completed ? (
            <span className='text-green-600'>Bạn đã hoàn thành khảo sát</span>
          ) : (
            <span className='text-red-600'>Bạn chưa làm khảo sát</span>
          )}
        </div>
        <Button variant='outline' size='sm' onClick={handleRedoSurvey}>
          {status?.is_completed ? 'Làm lại khảo sát' : 'Làm khảo sát'}
        </Button>
      </div>
    </div>
  )
}

export default Setting
