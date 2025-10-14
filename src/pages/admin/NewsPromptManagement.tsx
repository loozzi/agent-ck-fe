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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  createNewsPrompt,
  deleteNewsPrompt,
  fetchNewsPrompts,
  testNewsPrompt,
  toggleNewsPromptActive,
  updateNewsPrompt
} from '@/slices/newsPrompt.slice'
import type { NewsPrompt } from '@/types/news_prompt'
import { Eye, MoreHorizontal, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'

const NewsPromptManagement = () => {
  const dispatch = useAppDispatch()
  const { prompts, isLoading, error, total, page, per_page } = useAppSelector((state) => state.newsPrompt)

  const [deletePromptId, setDeletePromptId] = useState<string | null>(null)
  const [managePrompt, setManagePrompt] = useState<NewsPrompt | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const [editedName, setEditedName] = useState('')
  const [activeTab, setActiveTab] = useState('settings')
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [testResult, setTestResult] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPromptName, setNewPromptName] = useState('')
  const [newPromptContent, setNewPromptContent] = useState('')
  const [createActiveTab, setCreateActiveTab] = useState('settings')
  const [isCreatePreviewLoading, setIsCreatePreviewLoading] = useState(false)
  const [createTestResult, setCreateTestResult] = useState<string>('')

  useEffect(() => {
    dispatch(fetchNewsPrompts({ page: 1, per_page: 10 }))
  }, [dispatch])

  const handleDeletePrompt = async (id: string) => {
    try {
      await dispatch(deleteNewsPrompt(id)).unwrap()
      // Refresh the list after deletion
      dispatch(fetchNewsPrompts({ page, per_page }))
    } catch (error) {
      console.error('Error deleting prompt:', error)
    }
    setDeletePromptId(null)
  }

  const handleManagePrompt = (prompt: NewsPrompt) => {
    setManagePrompt(prompt)
    setEditedContent(prompt.content)
    setEditedName(prompt.name)
    setActiveTab('settings')
    setTestResult('')
  }

  const handleSaveChanges = () => {
    dispatch(
      updateNewsPrompt({
        id: managePrompt!.id,
        data: { name: editedName, content: editedContent, test_result: testResult }
      })
    ).unwrap()
    // close modal
    setManagePrompt(null)
  }

  const handlePreviewResult = async () => {
    if (!managePrompt) return

    setIsPreviewLoading(true)
    try {
      const currentHour = new Date().getHours()
      const testPayload = {
        content: editedContent,
        vn_hour: currentHour
      }

      const response = await dispatch(testNewsPrompt(testPayload)).unwrap()

      if (response.success) {
        setTestResult(response.result)
        setActiveTab('result')
      } else {
        console.error('Test failed:', response.error)
        setTestResult(response.error || 'Có lỗi xảy ra khi test prompt')
        setActiveTab('result')
      }
    } catch (error) {
      console.error('Error testing prompt:', error)
      setTestResult('Có lỗi xảy ra khi test prompt: ' + (error as Error).message)
      setActiveTab('result')
    } finally {
      setIsPreviewLoading(false)
    }
  }

  const hasChanges = () => {
    if (!managePrompt) return false
    return (
      editedName !== managePrompt.name ||
      editedContent !== managePrompt.content ||
      testResult !== managePrompt.test_result
    )
  }

  const handleOpenCreateModal = () => {
    setShowCreateModal(true)
    setNewPromptName('')
    setNewPromptContent('')
    setCreateActiveTab('settings')
    setCreateTestResult('')
  }

  const handleCreatePrompt = async () => {
    if (!newPromptName.trim() || !newPromptContent.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }

    try {
      await dispatch(
        createNewsPrompt({
          name: newPromptName.trim(),
          content: newPromptContent.trim(),
          test_result: createTestResult
        })
      ).unwrap()

      // Refresh danh sách sau khi tạo thành công
      dispatch(fetchNewsPrompts({ page, per_page }))
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating prompt:', error)
      alert('Có lỗi xảy ra khi tạo prompt')
    }
  }

  const handleCreatePreviewResult = async () => {
    if (!newPromptContent.trim()) {
      alert('Vui lòng nhập nội dung prompt trước khi test')
      return
    }

    setIsCreatePreviewLoading(true)
    try {
      const currentHour = new Date().getHours()
      const testPayload = {
        content: newPromptContent.trim(),
        vn_hour: currentHour
      }

      const response = await dispatch(testNewsPrompt(testPayload)).unwrap()

      if (response.success) {
        setCreateTestResult(response.result)
        setCreateActiveTab('result')
      } else {
        console.error('Test failed:', response.error)
        setCreateTestResult(response.error || 'Có lỗi xảy ra khi test prompt')
        setCreateActiveTab('result')
      }
    } catch (error) {
      console.error('Error testing prompt:', error)
      setCreateTestResult('Có lỗi xảy ra khi test prompt: ' + (error as Error).message)
      setCreateActiveTab('result')
    } finally {
      setIsCreatePreviewLoading(false)
    }
  }

  const handleTogglePromptStatus = async (prompt: NewsPrompt) => {
    try {
      await dispatch(toggleNewsPromptActive(prompt.id)).unwrap()
      // Refresh the list after toggle
      dispatch(fetchNewsPrompts({ page, per_page }))
    } catch (error) {
      console.error('Error toggling prompt status:', error)
    }
  }

  const getTestResultBadge = (prompt: NewsPrompt) => {
    if (prompt.test_result) {
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

  if (error) {
    return (
      <div className='p-6'>
        <Card>
          <CardContent className='flex items-center justify-center h-32'>
            <p className='text-red-500'>Lỗi: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Thư viện Prompt</h1>
        <Button className='bg-blue-600 hover:bg-blue-700' onClick={handleOpenCreateModal}>
          <Plus className='w-4 h-4 mr-2' />
          Thêm Prompt mới
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600'>
              Hiển thị {prompts.length} trong tổng số {total} prompts
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Prompt</TableHead>
                {/* <TableHead>Mô tả</TableHead> */}
                <TableHead>Đã test?</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className='h-4 w-32' />
                    </TableCell>
                    {/* <TableCell>
                      <Skeleton className='h-4 w-48' />
                    </TableCell> */}
                    <TableCell>
                      <Skeleton className='h-6 w-20' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-8 w-20' />
                    </TableCell>
                  </TableRow>
                ))
              ) : prompts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='text-center py-8'>
                    <p className='text-gray-500'>Không có prompt nào</p>
                  </TableCell>
                </TableRow>
              ) : (
                prompts.map((prompt) => (
                  <TableRow key={prompt.id}>
                    <TableCell className='font-medium'>{prompt.name}</TableCell>
                    {/* <TableCell className='max-w-xs truncate' title={prompt.content}>
                      {prompt.content.length > 80 ? `${prompt.content.substring(0, 80)}...` : prompt.content}
                    </TableCell> */}
                    <TableCell>{getTestResultBadge(prompt)}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-blue-600 border-blue-600 hover:bg-blue-50'
                          onClick={() => handleManagePrompt(prompt)}
                        >
                          Quản lý
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => handleTogglePromptStatus(prompt)}>
                              {prompt.is_active ? (
                                <>
                                  <ToggleLeft className='w-4 h-4 mr-2' />
                                  Bỏ kích hoạt
                                </>
                              ) : (
                                <>
                                  <ToggleRight className='w-4 h-4 mr-2' />
                                  Kích hoạt
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className='text-red-600' onClick={() => setDeletePromptId(prompt.id)}>
                              <Trash2 className='w-4 h-4 mr-2' />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Manage Prompt Modal */}
      <Dialog open={!!managePrompt} onOpenChange={() => setManagePrompt(null)}>
        <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto '>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold'>Quản lý Prompt</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='settings'>Cài đặt & Phiên bản</TabsTrigger>
              {/* <TabsTrigger value='abtesting'>A/B Testing</TabsTrigger> */}
              <TabsTrigger value='result'>Kết quả test</TabsTrigger>
            </TabsList>

            <TabsContent value='settings' className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold mb-1'>Tên Prompt</h3>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className='w-full'
                  placeholder='Nhập tên prompt...'
                />
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3'>Nội dung Prompt</h3>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className='min-h-[200px] max-h-[30vh] resize-none overflow-y-auto'
                  placeholder='Nhập nội dung prompt...'
                  spellCheck={false}
                />
              </div>

              <div className='flex items-center justify-between pt-4'>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={handleSaveChanges}
                    disabled={!hasChanges()}
                    className='bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
                  >
                    Lưu thay đổi
                  </Button>
                  <Button
                    onClick={handlePreviewResult}
                    disabled={isPreviewLoading}
                    variant='outline'
                    className='text-blue-600 border-blue-600 hover:bg-blue-50'
                  >
                    <Eye className='w-4 h-4 mr-2' />
                    {isPreviewLoading ? 'Đang xử lý...' : 'Xem trước kết quả'}
                  </Button>
                </div>
                <Button variant='outline' onClick={() => setManagePrompt(null)}>
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
                ) : managePrompt?.test_result ? (
                  <div className='border rounded-lg p-4 bg-gray-50'>
                    <h4 className='font-medium mb-2'>Kết quả test trước đó:</h4>
                    <pre className='whitespace-pre-wrap text-sm'>{managePrompt.test_result}</pre>
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>Chưa có kết quả test nào</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Create Prompt Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold'>Thêm Prompt Mới</DialogTitle>
          </DialogHeader>

          <Tabs value={createActiveTab} onValueChange={setCreateActiveTab} className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='settings'>Cài đặt prompt</TabsTrigger>
              <TabsTrigger value='result'>Kết quả test</TabsTrigger>
            </TabsList>

            <TabsContent value='settings' className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold mb-1'>Tên Prompt</h3>
                <Input
                  value={newPromptName}
                  onChange={(e) => setNewPromptName(e.target.value)}
                  className='w-full'
                  placeholder='Nhập tên prompt...'
                />
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3'>Nội dung Prompt</h3>
                <Textarea
                  value={newPromptContent}
                  onChange={(e) => setNewPromptContent(e.target.value)}
                  className='min-h-[200px] max-h-[30vh] resize-none overflow-y-auto'
                  placeholder='Nhập nội dung prompt...'
                  spellCheck={false}
                />
              </div>

              <div className='flex items-center justify-between pt-4'>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={handleCreatePrompt}
                    disabled={!newPromptName.trim() || !newPromptContent.trim()}
                    className='bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
                  >
                    Tạo Prompt
                  </Button>
                  <Button
                    onClick={handleCreatePreviewResult}
                    disabled={!newPromptContent.trim() || isCreatePreviewLoading}
                    variant='outline'
                    className='text-blue-600 border-blue-600 hover:bg-blue-50'
                  >
                    <Eye className='w-4 h-4 mr-2' />
                    {isCreatePreviewLoading ? 'Đang xử lý...' : 'Xem trước kết quả'}
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
                    <p className='text-gray-500'>Chưa có kết quả test nào</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePromptId} onOpenChange={() => setDeletePromptId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa prompt này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePromptId && handleDeletePrompt(deletePromptId)}
              className='bg-red-600 hover:bg-red-700'
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default NewsPromptManagement
