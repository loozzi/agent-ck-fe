import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useAppDispatch } from '@/app/hook'
import { addTransaction } from '@/slices/portfolio.slice'

interface AddTransactionDialogProps {
  onSuccess?: () => void
}

const validationSchema = Yup.object({
  ticker: Yup.string().required('Mã cổ phiếu là bắt buộc').min(1, 'Mã cổ phiếu không được để trống'),
  action: Yup.string().required('Hành động là bắt buộc').oneOf(['buy', 'sell'], 'Hành động phải là mua hoặc bán'),
  quantity: Yup.number()
    .required('Số lượng là bắt buộc')
    .positive('Số lượng phải lớn hơn 0')
    .integer('Số lượng phải là số nguyên'),
  price: Yup.number().required('Giá là bắt buộc').positive('Giá phải lớn hơn 0'),
  note: Yup.string().required('Ghi chú là bắt buộc').min(1, 'Ghi chú không được để trống')
})

const AddTransactionDialog = ({ onSuccess }: AddTransactionDialogProps) => {
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      ticker: '',
      action: '',
      quantity: '',
      price: '',
      note: ''
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const transactionData = {
        ticker: values.ticker.toUpperCase(),
        action: values.action,
        quantity: parseInt(values.quantity),
        price: parseFloat(values.price),
        transaction_time: new Date().toISOString(),
        note: values.note
      }

      dispatch(addTransaction(transactionData))
      resetForm()
      setOpen(false)
      setSubmitting(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      formik.resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2 cursor-pointer'>
          <Plus className='w-4 h-4' />
          Thêm giao dịch
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Plus className='w-5 h-5 text-blue-600' />
            Thêm giao dịch mới
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin giao dịch cổ phiếu của bạn. Tất cả các trường đều bắt buộc.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className='grid gap-4 py-4'>
            {/* Ticker */}
            <div className='grid gap-2'>
              <Label htmlFor='ticker'>Mã cổ phiếu *</Label>
              <Input
                id='ticker'
                name='ticker'
                type='text'
                placeholder='VD: AAPL, MSFT, GOOGL'
                value={formik.values.ticker}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.ticker && formik.errors.ticker ? 'border-red-500' : ''}
              />
              {formik.touched.ticker && formik.errors.ticker && (
                <p className='text-sm text-red-500'>{formik.errors.ticker}</p>
              )}
            </div>

            {/* Action */}
            <div className='grid gap-2'>
              <Label htmlFor='action'>Hành động *</Label>
              <Select
                value={formik.values.action}
                onValueChange={(value) => formik.setFieldValue('action', value)}
                onOpenChange={() => formik.setFieldTouched('action', true)}
              >
                <SelectTrigger className={formik.touched.action && formik.errors.action ? 'border-red-500' : ''}>
                  <SelectValue placeholder='Chọn hành động' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='buy'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                      Mua
                    </div>
                  </SelectItem>
                  <SelectItem value='sell'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                      Bán
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.action && formik.errors.action && (
                <p className='text-sm text-red-500'>{formik.errors.action}</p>
              )}
            </div>

            {/* Quantity */}
            <div className='grid gap-2'>
              <Label htmlFor='quantity'>Số lượng *</Label>
              <Input
                id='quantity'
                name='quantity'
                type='number'
                placeholder='VD: 100'
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.quantity && formik.errors.quantity ? 'border-red-500' : ''}
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <p className='text-sm text-red-500'>{formik.errors.quantity}</p>
              )}
            </div>

            {/* Price */}
            <div className='grid gap-2'>
              <Label htmlFor='price'>Giá ($) *</Label>
              <Input
                id='price'
                name='price'
                type='number'
                step='0.01'
                placeholder='VD: 150.25'
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.price && formik.errors.price ? 'border-red-500' : ''}
              />
              {formik.touched.price && formik.errors.price && (
                <p className='text-sm text-red-500'>{formik.errors.price}</p>
              )}
            </div>

            {/* Note */}
            <div className='grid gap-2'>
              <Label htmlFor='note'>Ghi chú *</Label>
              <Input
                id='note'
                name='note'
                type='text'
                placeholder='VD: Mua vào theo kế hoạch'
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.note && formik.errors.note ? 'border-red-500' : ''}
              />
              {formik.touched.note && formik.errors.note && (
                <p className='text-sm text-red-500'>{formik.errors.note}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setOpen(false)} className='cursor-pointer'>
              Hủy
            </Button>
            <Button type='submit' disabled={formik.isSubmitting || !formik.isValid} className='cursor-pointer'>
              {formik.isSubmitting ? 'Đang xử lý...' : 'Thêm giao dịch'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTransactionDialog
