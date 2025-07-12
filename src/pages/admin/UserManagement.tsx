import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { updateUserRole, fetchUsers, directActiveSubscription } from '@/slices/admin.slice'
import { useEffect, useState } from 'react'

const UserManagement = () => {
  const { users = [], isLoading } = useAppSelector((state) => state.admin)
  const dispatch = useAppDispatch()

  // Filter states
  const [filterRole, setFilterRole] = useState('')
  const [filterOnboarding, setFilterOnboarding] = useState('')
  const [filterNameEmail, setFilterNameEmail] = useState('')
  const [filterZaloId, setFilterZaloId] = useState('')

  // Badge background for status
  const getStatusCellClass = (status: string) => {
    if (status === 'subscriber') {
      return 'bg-green-100' // Tailwind: light green background
    }
    return ''
  }

  // Quick action: Direct activate user
  const handleDirectActivate = async (user: any) => {
    try {
      await dispatch(
        directActiveSubscription({
          user_email: user.email,
          durations_days: 30, // default 30 days, adjust as needed
          subcription_type: 'premium'
        })
      )
    } catch (error) {
      console.error('Error activating user:', error)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'destructive'
      case 'trainer':
        return 'default'
      case 'user':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  // Filter function
  const filteredUsers = users.filter((user) => {
    // Role filter
    if (filterRole && user.role.toLowerCase() !== filterRole.toLowerCase()) {
      return false
    }

    // Onboarding filter
    if (filterOnboarding) {
      const isCompleted = user.onboarding_completed
      if (filterOnboarding === 'completed' && !isCompleted) return false
      if (filterOnboarding === 'not-completed' && isCompleted) return false
    }

    // Name/Email filter
    if (filterNameEmail) {
      const searchTerm = filterNameEmail.toLowerCase()
      const nameMatch = user.full_name?.toLowerCase().includes(searchTerm)
      const emailMatch = user.email?.toLowerCase().includes(searchTerm)
      if (!nameMatch && !emailMatch) return false
    }

    // Zalo ID filter
    if (filterZaloId) {
      const hasZaloId = user.zalo_id && user.zalo_id.trim() !== ''
      if (filterZaloId === 'has-zalo' && !hasZaloId) return false
      if (filterZaloId === 'no-zalo' && hasZaloId) return false
    }

    return true
  })

  const clearFilters = () => {
    setFilterRole('')
    setFilterOnboarding('')
    setFilterNameEmail('')
    setFilterZaloId('')
  }

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await dispatch(updateUserRole({ user_id: userId, new_role: newRole }))
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  useEffect(() => {
    dispatch(fetchUsers())
  }, [])

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Quản lý người dùng</h1>
      {/* Filter Section */}
      <div className='mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Tìm theo tên/email</label>
          <Input
            placeholder='Nhập tên hoặc email...'
            value={filterNameEmail}
            onChange={(e) => setFilterNameEmail(e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Vai trò</label>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger>
              <SelectValue placeholder='Chọn vai trò' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='admin'>Admin</SelectItem>
              <SelectItem value='trainer'>Trainer</SelectItem>
              <SelectItem value='user'>User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Trạng thái khảo sát</label>
          <Select value={filterOnboarding} onValueChange={setFilterOnboarding}>
            <SelectTrigger>
              <SelectValue placeholder='Chọn trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='completed'>Hoàn thành</SelectItem>
              <SelectItem value='not-completed'>Chưa hoàn thành</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Zalo ID</label>
          <Select value={filterZaloId} onValueChange={setFilterZaloId}>
            <SelectTrigger>
              <SelectValue placeholder='Chọn trạng thái Zalo' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='has-zalo'>Đã có Zalo ID</SelectItem>
              <SelectItem value='no-zalo'>Chưa có Zalo ID</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && users.length === 0 ? (
        <div className='flex justify-center items-center h-32'>
          <div className='text-muted-foreground'>Đang tải dữ liệu...</div>
        </div>
      ) : (
        <>
          <div className='mb-4 flex gap-2'>
            <Button variant='outline' onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
            <span className='text-sm text-muted-foreground self-center'>
              Hiển thị {filteredUsers.length} / {users.length} người dùng
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Họ và tên</TableHead>
                {/* <TableHead>Trạng thái</TableHead> */}
                <TableHead>Zalo ID</TableHead>
                <TableHead>Khảo sát</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className={getStatusCellClass(user.status)}>
                  <TableCell className='font-medium max-w-[160px] truncate' title={user.email}>
                    {user.email}
                  </TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  {/* <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                  </TableCell> */}
                  <TableCell className='max-w-[120px] truncate' title={user.zalo_id || 'Chưa có'}>
                    {user.zalo_id || 'Chưa có'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.onboarding_completed ? 'default' : 'destructive'}>
                      {user.onboarding_completed ? 'Đã làm' : 'Chưa làm'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell className='flex flex-col gap-2'>
                    <Select onValueChange={(newRole) => handleRoleUpdate(user.id, newRole)}>
                      <SelectTrigger className='w-32'>
                        <SelectValue placeholder='Đổi vai trò' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='admin' disabled={user.role === 'admin'}>
                          Admin
                        </SelectItem>
                        <SelectItem value='trainer' disabled={user.role === 'trainer'}>
                          Trainer
                        </SelectItem>
                        <SelectItem value='user' disabled={user.role === 'user'}>
                          User
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Quick action: Direct activate */}
                    {user.status !== 'subscriber' && (
                      <Button size='sm' className='bg-blue-400' onClick={() => handleDirectActivate(user)}>
                        Kích hoạt nhanh
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  )
}

export default UserManagement
