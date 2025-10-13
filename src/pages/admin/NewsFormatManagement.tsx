import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hook'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  checkNewsFormatConflict,
  createNewsFormat,
  deleteNewsFormat,
  fetchNewsFormats,
  testNewsFormat,
  updateNewsFormat
} from '@/slices/newsFormat.slice'
import type { NewsFormatResponse } from '@/types/news_format'
import { AlertTriangle, Clock, Eye, MoreHorizontal, Plus, Settings, Trash2 } from 'lucide-react'

const NewsFormatManagement = () => {
  const dispatch = useAppDispatch()
  const {
    formats,
    conflictFormat,
    total,
    page,
    per_page,
    loadingFetchFormats,
    loadingCreateFormat,
    loadingUpdateFormat,
    loadingDeleteFormat,
    loadingTestFormat
  } = useAppSelector((state) => state.newsFormat)

  const [deleteFormatId, setDeleteFormatId] = useState<string | null>(null)
  const [manageFormat, setManageFormat] = useState<NewsFormatResponse | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const [editedName, setEditedName] = useState('')
  const [editedActiveDays, setEditedActiveDays] = useState<number[]>([])
  const [editedActiveHour, setEditedActiveHour] = useState<number>(9)
  const [activeTab, setActiveTab] = useState('settings')
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [testResult, setTestResult] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newFormatName, setNewFormatName] = useState('')
  const [newFormatContent, setNewFormatContent] = useState('')
  const [newActiveDays, setNewActiveDays] = useState<number[]>([])
  const [newActiveHour, setNewActiveHour] = useState<number>(9)
  const [createActiveTab, setCreateActiveTab] = useState('settings')
  const [isCreatePreviewLoading, setIsCreatePreviewLoading] = useState(false)
  const [createTestResult, setCreateTestResult] = useState<string>('')
  const [showConflictWarning, setShowConflictWarning] = useState(false)

  const daysOfWeek = [
    { value: 0, label: 'Chủ nhật' },
    { value: 1, label: 'Thứ 2' },
    { value: 2, label: 'Thứ 3' },
    { value: 3, label: 'Thứ 4' },
    { value: 4, label: 'Thứ 5' },
    { value: 5, label: 'Thứ 6' },
    { value: 6, label: 'Thứ 7' }
  ]

  useEffect(() => {
    dispatch(fetchNewsFormats({ page: 1, per_page: 10 }))
  }, [dispatch])

  const handleDeleteFormat = async (id: string) => {
    try {
      await dispatch(deleteNewsFormat(id)).unwrap()
      // Refresh the list after deletion
      dispatch(fetchNewsFormats({ page, per_page }))
    } catch (error) {
      console.error('Error deleting format:', error)
    }
    setDeleteFormatId(null)
  }

  const handleManageFormat = (format: NewsFormatResponse) => {
    setManageFormat(format)
    setEditedContent(format.content)
    setEditedName(format.name)
    setEditedActiveDays(format.active_days)
    setEditedActiveHour(format.active_hour)
    setActiveTab('settings')
    setTestResult('')
  }

  const handleSaveChanges = async () => {
    if (!manageFormat) return

    // Check for conflicts before saving
    try {
      await dispatch(
        checkNewsFormatConflict({
          active_days: editedActiveDays,
          active_hour: editedActiveHour,
          exclude_id: manageFormat.id
        })
      ).unwrap()

      // If no conflict, proceed with update
      await dispatch(
        updateNewsFormat({
          id: manageFormat.id,
          payload: {
            name: editedName,
            content: editedContent,
            active_days: editedActiveDays,
            active_hour: editedActiveHour,
            test_result: testResult
          }
        })
      ).unwrap()

      // Refresh the list and close modal
      dispatch(fetchNewsFormats({ page, per_page }))
      setManageFormat(null)
    } catch (error) {
      console.error('Error updating format:', error)
    }
  }

  const handlePreviewResult = async () => {
    if (!manageFormat) return

    setIsPreviewLoading(true)
    try {
      const testPayload = {
        content: editedContent
      }

      const response = await dispatch(testNewsFormat(testPayload)).unwrap()

      if (response.success) {
        setTestResult(response.result)
        setActiveTab('result')
      } else {
        console.error('Test failed:', response.error)
        setTestResult(response.error || 'Có lỗi xảy ra khi test format')
        setActiveTab('result')
      }
    } catch (error) {
      console.error('Error testing format:', error)
      setTestResult('Có lỗi xảy ra khi test format: ' + (error as Error).message)
      setActiveTab('result')
    } finally {
      setIsPreviewLoading(false)
    }
  }

  const hasChanges = () => {
    if (!manageFormat) return false
    return (
      editedName !== manageFormat.name ||
      editedContent !== manageFormat.content ||
      JSON.stringify(editedActiveDays) !== JSON.stringify(manageFormat.active_days) ||
      editedActiveHour !== manageFormat.active_hour ||
      testResult !== manageFormat.test_result
    )
  }

  const handleOpenCreateModal = () => {
    setShowCreateModal(true)
    setNewFormatName('')
    setNewFormatContent('')
    setNewActiveDays([])
    setNewActiveHour(9)
    setCreateActiveTab('settings')
    setCreateTestResult('')
    setShowConflictWarning(false)
  }

  const handleCreateFormat = async () => {
    if (!newFormatName.trim() || !newFormatContent.trim() || newActiveDays.length === 0) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }

    // Check for conflicts before creating
    try {
      const conflictCheck = await dispatch(
        checkNewsFormatConflict({
          active_days: newActiveDays,
          active_hour: newActiveHour
        })
      ).unwrap()

      if (conflictCheck.conflict) {
        setShowConflictWarning(true)
        return
      }

      await dispatch(
        createNewsFormat({
          name: newFormatName.trim(),
          content: newFormatContent.trim(),
          active_days: newActiveDays,
          active_hour: newActiveHour,
          test_result: createTestResult
        })
      ).unwrap()

      // Refresh danh sách sau khi tạo thành công
      dispatch(fetchNewsFormats({ page, per_page }))
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating format:', error)
      alert('Có lỗi xảy ra khi tạo format')
    }
  }

  const handleCreatePreviewResult = async () => {
    if (!newFormatContent.trim()) {
      alert('Vui lòng nhập nội dung format trước khi test')
      return
    }

    setIsCreatePreviewLoading(true)
    try {
      const testPayload = {
        content: newFormatContent.trim()
      }

      const response = await dispatch(testNewsFormat(testPayload)).unwrap()

      if (response.success) {
        setCreateTestResult(response.result)
        setCreateActiveTab('result')
      } else {
        console.error('Test failed:', response.error)
        setCreateTestResult(response.error || 'Có lỗi xảy ra khi test format')
        setCreateActiveTab('result')
      }
    } catch (error) {
      console.error('Error testing format:', error)
      setCreateTestResult('Có lỗi xảy ra khi test format: ' + (error as Error).message)
      setCreateActiveTab('result')
    } finally {
      setIsCreatePreviewLoading(false)
    }
  }

  const handleDayToggle = (dayValue: number, isCreate: boolean = false) => {
    if (isCreate) {
      setNewActiveDays((prev) =>
        prev.includes(dayValue) ? prev.filter((d) => d !== dayValue) : [...prev, dayValue].sort()
      )
    } else {
      setEditedActiveDays((prev) =>
        prev.includes(dayValue) ? prev.filter((d) => d !== dayValue) : [...prev, dayValue].sort()
      )
    }
  }

  const getTestResultBadge = (format: NewsFormatResponse) => {
    if (format.test_result) {
      return (
        <Badge variant='secondary' className='bg-green-100 text-green-800'>
          Đã test
        </Badge>
      )
    }
    return (
      <Badge variant='destructive' className='bg-blue-100 text-blue-800'>
        Chưa test
      </Badge>
    )
  }

  const formatActiveDays = (days: number[]) => {
    return days.map((day) => daysOfWeek.find((d) => d.value === day)?.label).join(', ')
  }

  const formatActiveHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`
  }

  if (loadingFetchFormats && formats.length === 0) {
    return (
      <div className='p-6'>
        <Card>
          <CardContent className='flex items-center justify-center h-32'>
            <div className='flex items-center space-x-2'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
              <span>Đang tải...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Thư viện Format</h1>
        <Button className='bg-blue-600 hover:bg-blue-700' onClick={handleOpenCreateModal}>
          <Plus className='w-4 h-4 mr-2' />
          Thêm Format mới
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600'>
              Hiển thị {formats.length} trong tổng số {total} formats
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Format</TableHead>
                <TableHead>Ngày hoạt động</TableHead>
                <TableHead>Giờ hoạt động</TableHead>
                <TableHead>Đã test?</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingFetchFormats ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className='h-4 w-32' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-48' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-16' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-6 w-20' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-8 w-20' />
                    </TableCell>
                  </TableRow>
                ))
              ) : formats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='text-center py-8'>
                    <div className='flex flex-col items-center space-y-2'>
                      <Settings className='w-12 h-12 text-gray-400' />
                      <p className='text-gray-500'>Chưa có format nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                formats.map((format) => (
                  <TableRow key={format.id}>
                    <TableCell className='font-medium'>{format.name}</TableCell>
                    <TableCell>{formatActiveDays(format.active_days)}</TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        <Clock className='w-4 h-4 text-gray-500' />
                        <span>{formatActiveHour(format.active_hour)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getTestResultBadge(format)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => handleManageFormat(format)}>
                            <Settings className='mr-2 h-4 w-4' />
                            Quản lý
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteFormatId(format.id)} className='text-red-600'>
                            <Trash2 className='mr-2 h-4 w-4' />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Manage Format Modal */}
      <Dialog open={!!manageFormat} onOpenChange={() => setManageFormat(null)}>
        <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto '>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold'>Quản lý Format</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='settings'>Cài đặt</TabsTrigger>
              <TabsTrigger value='result'>Kết quả test</TabsTrigger>
            </TabsList>

            <TabsContent value='settings' className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold mb-1'>Tên Format</h3>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className='w-full'
                  placeholder='Nhập tên format...'
                />
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3'>Nội dung Format</h3>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className='min-h-[200px] max-h-[30vh] resize-none overflow-y-auto'
                  placeholder='Nhập nội dung format...'
                  spellCheck={false}
                />
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3'>Ngày hoạt động</h3>
                <div className='grid grid-cols-4 gap-2'>
                  {daysOfWeek.map((day) => (
                    <div key={day.value} className='flex items-center space-x-2'>
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={editedActiveDays.includes(day.value)}
                        onCheckedChange={() => handleDayToggle(day.value)}
                      />
                      <Label htmlFor={`day-${day.value}`} className='text-sm'>
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3'>Giờ hoạt động</h3>
                <Select
                  value={editedActiveHour.toString()}
                  onValueChange={(value) => setEditedActiveHour(parseInt(value))}
                >
                  <SelectTrigger className='w-32'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center justify-between pt-4'>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={handleSaveChanges}
                    disabled={!hasChanges() || loadingUpdateFormat}
                    className='bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
                  >
                    {loadingUpdateFormat ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                  <Button
                    onClick={handlePreviewResult}
                    disabled={isPreviewLoading || loadingTestFormat}
                    variant='outline'
                    className='text-blue-600 border-blue-600 hover:bg-blue-50'
                  >
                    <Eye className='w-4 h-4 mr-2' />
                    {isPreviewLoading || loadingTestFormat ? 'Đang test...' : 'Xem trước kết quả'}
                  </Button>
                </div>
                <Button variant='outline' onClick={() => setManageFormat(null)}>
                  Đóng
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='result' className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold mb-3'>Kết quả Test</h3>
                {testResult ? (
                  <div className='border rounded-lg p-4 bg-gray-50'>
                    <pre className='whitespace-pre-wrap text-sm'>{testResult}</pre>
                  </div>
                ) : manageFormat?.test_result ? (
                  <div className='border rounded-lg p-4 bg-gray-50'>
                    <pre className='whitespace-pre-wrap text-sm'>{manageFormat.test_result}</pre>
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>Chưa có kết quả test. Vui lòng chạy test ở tab Cài đặt.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Create Format Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold'>Thêm Format Mới</DialogTitle>
          </DialogHeader>

          {showConflictWarning && conflictFormat && (
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4'>
              <div className='flex items-center space-x-2'>
                <AlertTriangle className='w-5 h-5 text-yellow-600' />
                <p className='text-yellow-800 font-medium'>Cảnh báo xung đột!</p>
              </div>
              <p className='text-yellow-700 mt-2'>
                Đã tồn tại format "{conflictFormat}" với cùng thời gian hoạt động. Vui lòng chọn thời gian khác.
              </p>
              <Button variant='outline' size='sm' className='mt-2' onClick={() => setShowConflictWarning(false)}>
                Đã hiểu
              </Button>
            </div>
          )}

          <Tabs value={createActiveTab} onValueChange={setCreateActiveTab} className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='settings'>Cài đặt format</TabsTrigger>
              <TabsTrigger value='result'>Kết quả test</TabsTrigger>
            </TabsList>

            <TabsContent value='settings' className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold mb-1'>Tên Format</h3>
                <Input
                  value={newFormatName}
                  onChange={(e) => setNewFormatName(e.target.value)}
                  className='w-full'
                  placeholder='Nhập tên format...'
                />
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3'>Nội dung Format</h3>
                <Textarea
                  value={newFormatContent}
                  onChange={(e) => setNewFormatContent(e.target.value)}
                  className='min-h-[200px] max-h-[30vh] resize-none overflow-y-auto'
                  placeholder='Nhập nội dung format...'
                  spellCheck={false}
                />
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3'>Ngày hoạt động</h3>
                <div className='grid grid-cols-4 gap-2'>
                  {daysOfWeek.map((day) => (
                    <div key={day.value} className='flex items-center space-x-2'>
                      <Checkbox
                        id={`new-day-${day.value}`}
                        checked={newActiveDays.includes(day.value)}
                        onCheckedChange={() => handleDayToggle(day.value, true)}
                      />
                      <Label htmlFor={`new-day-${day.value}`} className='text-sm'>
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3'>Giờ hoạt động</h3>
                <Select value={newActiveHour.toString()} onValueChange={(value) => setNewActiveHour(parseInt(value))}>
                  <SelectTrigger className='w-32'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center justify-between pt-4'>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={handleCreateFormat}
                    disabled={
                      !newFormatName.trim() ||
                      !newFormatContent.trim() ||
                      newActiveDays.length === 0 ||
                      loadingCreateFormat
                    }
                    className='bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
                  >
                    {loadingCreateFormat ? 'Đang tạo...' : 'Tạo Format'}
                  </Button>
                  <Button
                    onClick={handleCreatePreviewResult}
                    disabled={!newFormatContent.trim() || isCreatePreviewLoading || loadingTestFormat}
                    variant='outline'
                    className='text-blue-600 border-blue-600 hover:bg-blue-50'
                  >
                    <Eye className='w-4 h-4 mr-2' />
                    {isCreatePreviewLoading || loadingTestFormat ? 'Đang test...' : 'Xem trước kết quả'}
                  </Button>
                </div>
                <Button variant='outline' onClick={() => setShowCreateModal(false)}>
                  Đóng
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='result' className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold mb-3'>Kết quả Test</h3>
                {createTestResult ? (
                  <div className='border rounded-lg p-4 bg-gray-50'>
                    <pre className='whitespace-pre-wrap text-sm'>{createTestResult}</pre>
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>Chưa có kết quả test. Vui lòng chạy test ở tab Cài đặt.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteFormatId} onOpenChange={() => setDeleteFormatId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa format này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFormatId && handleDeleteFormat(deleteFormatId)}
              className='bg-red-600 hover:bg-red-700'
              disabled={loadingDeleteFormat}
            >
              {loadingDeleteFormat ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default NewsFormatManagement
