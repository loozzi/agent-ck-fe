import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  createSubscriptionPricing,
  deleteSubscriptionPricing,
  fetchSubscriptionPricings,
  updateSubscriptionPricing
} from '@/slices/subscription.slice'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const initialForm = {
  tier_name: '',
  purchase_count_min: 1,
  purchase_count_max: 1,
  price_vnd: 0,
  duration_days: 30,
  is_active: true
}

const PricingManagement = () => {
  const dispatch = useAppDispatch()
  const { listPricings } = useAppSelector((state) => state.subscription)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchSubscriptionPricings())
  }, [dispatch])

  const openCreate = () => {
    setEditId(null)
    setForm(initialForm)
    setDialogOpen(true)
  }

  const openEdit = (pricing: any) => {
    setEditId(pricing.id)
    setForm({
      tier_name: pricing.tier_name,
      purchase_count_min: pricing.purchase_count_min,
      purchase_count_max: pricing.purchase_count_max,
      price_vnd: pricing.price_vnd,
      duration_days: pricing.duration_days,
      is_active: pricing.is_active
    })
    setDialogOpen(true)
  }

  const handleFormChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFormSubmit = async () => {
    setFormLoading(true)
    try {
      if (editId) {
        await dispatch(
          updateSubscriptionPricing({
            id: editId,
            data: {
              ...form,
              purchase_count_min: Number(form.purchase_count_min),
              purchase_count_max: Number(form.purchase_count_max),
              price_vnd: Number(form.price_vnd),
              duration_days: Number(form.duration_days)
            }
          })
        ).unwrap()
        toast.success('Cập nhật gói thành công!')
      } else {
        await dispatch(
          createSubscriptionPricing({
            ...form,
            purchase_count_min: Number(form.purchase_count_min),
            purchase_count_max: Number(form.purchase_count_max),
            price_vnd: Number(form.price_vnd),
            duration_days: Number(form.duration_days)
          })
        ).unwrap()
        toast.success('Tạo gói thành công!')
      }
      setDialogOpen(false)
      setForm(initialForm)
    } catch (e) {
      toast.error('Có lỗi xảy ra!')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      await dispatch(deleteSubscriptionPricing(deleteId)).unwrap()
      toast.success('Xóa gói thành công!')
      setDeleteId(null)
    } catch (e) {
      toast.error('Không thể xóa gói!')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className='p-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Quản lý gói dịch vụ</CardTitle>
              <CardDescription>Danh sách các gói dịch vụ/subscription cho người dùng</CardDescription>
            </div>
            <Button onClick={openCreate}>
              <Plus className='h-4 w-4 mr-2' /> Tạo gói mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên gói</TableHead>
                <TableHead>Giá (VND)</TableHead>
                <TableHead>Thời hạn (ngày)</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listPricings.map((pricing) => (
                <TableRow key={pricing.id}>
                  <TableCell>{pricing.tier_name}</TableCell>
                  <TableCell>{pricing.price_vnd.toLocaleString()}</TableCell>
                  <TableCell>{pricing.duration_days}</TableCell>
                  <TableCell>
                    <Button variant='ghost' size='sm' onClick={() => openEdit(pricing)}>
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='sm' onClick={() => setDeleteId(pricing.id)}>
                      <Trash2 className='h-4 w-4 text-red-600' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog tạo/sửa gói */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Chỉnh sửa gói' : 'Tạo gói mới'}</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='tier_name' className='text-right'>
                Tên gói
              </Label>
              <Input
                id='tier_name'
                name='tier_name'
                value={form.tier_name}
                onChange={handleFormChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='purchase_count_min' className='text-right'>
                Min
              </Label>
              <Input
                id='purchase_count_min'
                name='purchase_count_min'
                type='number'
                value={form.purchase_count_min}
                onChange={handleFormChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='purchase_count_max' className='text-right'>
                Max
              </Label>
              <Input
                id='purchase_count_max'
                name='purchase_count_max'
                type='number'
                value={form.purchase_count_max}
                onChange={handleFormChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price_vnd' className='text-right'>
                Giá (VND)
              </Label>
              <Input
                id='price_vnd'
                name='price_vnd'
                type='number'
                value={form.price_vnd}
                onChange={handleFormChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='duration_days' className='text-right'>
                Thời hạn (ngày)
              </Label>
              <Input
                id='duration_days'
                name='duration_days'
                type='number'
                value={form.duration_days}
                onChange={handleFormChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='is_active' className='text-right'>
                Kích hoạt
              </Label>
              <Switch
                id='is_active'
                name='is_active'
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)} disabled={formLoading}>
              Hủy
            </Button>
            <Button onClick={handleFormSubmit} disabled={formLoading}>
              {formLoading ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Xác nhận xóa */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa gói</DialogTitle>
          </DialogHeader>
          <div>Bạn có chắc chắn muốn xóa gói này không?</div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteId(null)} disabled={deleteLoading}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PricingManagement
