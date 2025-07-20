import React, { useState } from 'react'
import { changePasswordAction } from '@/slices/auth.slice'
import { useAppDispatch, useAppSelector } from '@/app/hook'

const AdminSetting = () => {
  const dispatch = useAppDispatch()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const loading = useAppSelector((state) => state.auth.loading)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới nhập lại không trùng khớp')
      return
    }
    try {
      const result = await dispatch(
        changePasswordAction({ current_password: currentPassword, new_password: newPassword })
      )
      if (result.type === 'auth/changePassword/fulfilled') {
        setSuccess('Đổi mật khẩu thành công')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError('Đổi mật khẩu không thành công')
      }
    } catch (err) {
      setError('Có lỗi xảy ra')
    }
  }

  return (
    <div className='max-w-xl mx-auto py-8'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Cài đặt quản trị viên</h2>
      <div className='mb-8 p-6 rounded-lg border bg-white shadow'>
        <h3 className='font-semibold text-lg mb-4 text-center'>Đổi mật khẩu</h3>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='font-medium block mb-2'>Mật khẩu hiện tại</label>
            <input
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className='w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none text-base'
              placeholder='Nhập mật khẩu hiện tại'
              required
            />
          </div>
          <div>
            <label className='font-medium block mb-2'>Mật khẩu mới</label>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none text-base'
              placeholder='Nhập mật khẩu mới'
              required
            />
          </div>
          <div>
            <label className='font-medium block mb-2'>Nhập lại mật khẩu mới</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none text-base'
              placeholder='Nhập lại mật khẩu mới'
              required
            />
          </div>
          {error && <div className='text-red-600 text-center font-medium'>{error}</div>}
          {success && <div className='text-green-600 text-center font-medium'>{success}</div>}
          <button
            type='submit'
            disabled={loading}
            className='w-full py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition'
          >
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminSetting
