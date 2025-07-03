import { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppDispatch } from '@/app/hook'
import { updateTransaction } from '@/slices/portfolio.slice'

interface Transaction {
  id: string
  ticker: string
  action?: string
  quantity?: number
  price?: number
  note?: string
  transaction_time: string
}

interface EditTransactionDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

const EditTransactionDialog = ({ transaction, open, onOpenChange, onSuccess }: EditTransactionDialogProps) => {
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
    onSubmit: (values, { setSubmitting }) => {
      if (!transaction) return

      const transactionData = {
        ticker: values.ticker.toUpperCase(),
        action: values.action,
        quantity: parseInt(values.quantity),
        price: parseFloat(values.price),
        note: values.note
      }

      dispatch(updateTransaction({ id: transaction.id, payload: transactionData }))
        .unwrap()
        .then(() => {
          onOpenChange(false)
          onSuccess?.()
        })
        .catch((error) => {
          console.error('Failed to update transaction:', error)
        })
        .finally(() => {
          setSubmitting(false)
        })
    }
  })

  // Reset form when transaction changes
  useEffect(() => {
    if (transaction && open) {
      formik.setValues({
        ticker: transaction.ticker || '',
        action: transaction.action || '',
        quantity: transaction.quantity?.toString() || '',
        price: transaction.price?.toString() || '',
        note: transaction.note || ''
      })
    }
  }, [transaction, open])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      formik.resetForm()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa giao dịch</DialogTitle>
          <DialogDescription>Cập nhật thông tin giao dịch của bạn.</DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className='space-y-4'>
          <div className='grid gap-4 py-4'>
            {/* Ticker */}
            <div className='grid gap-2'>
              <Label htmlFor='ticker'>Mã cổ phiếu *</Label>
              <Input
                id='ticker'
                name='ticker'
                type='text'
                placeholder='VD: AAPL, GOOGL'
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
              <Select value={formik.values.action} onValueChange={(value) => formik.setFieldValue('action', value)}>
                <SelectTrigger className={formik.touched.action && formik.errors.action ? 'border-red-500' : ''}>
                  <SelectValue placeholder='Chọn hành động' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='buy'>Mua</SelectItem>
                  <SelectItem value='sell'>Bán</SelectItem>
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
                placeholder='VD: 150.50'
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
                placeholder='VD: Điều chỉnh theo kế hoạch'
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
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)} className='cursor-pointer'>
              Hủy
            </Button>
            <Button type='submit' disabled={formik.isSubmitting || !formik.isValid} className='cursor-pointer'>
              {formik.isSubmitting ? 'Đang cập nhật...' : 'Cập nhật giao dịch'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTransactionDialog
