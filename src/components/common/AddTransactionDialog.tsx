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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hook'
import { addTransaction } from '@/slices/portfolio.slice'
import { cn } from '@/lib/utils'

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
  const [openCombobox, setOpenCombobox] = useState(false)
  const dispatch = useAppDispatch()
  const { stocks } = useAppSelector((state) => state.stock)

  // Function to remove Vietnamese accents
  const removeVietnameseAccents = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
  }

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
      setOpenCombobox(false)
      setSubmitting(false)
      onSuccess?.()
    }
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      formik.resetForm()
      setOpenCombobox(false)
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
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={openCombobox}
                    className={cn(
                      'max-w-[372px] justify-between cursor-pointer',
                      formik.touched.ticker && formik.errors.ticker ? 'border-red-500' : ''
                    )}
                  >
                    <span className='truncate text-left'>
                      {formik.values.ticker
                        ? `${formik.values.ticker} - ${stocks?.find((stock) => stock.ticker === formik.values.ticker)?.name || formik.values.ticker} ${(stocks?.find((stock) => stock.ticker === formik.values.ticker)?.name.slice(0, 38) || formik.values.ticker).length > 38 ? '...' : ''}`
                        : 'Chọn mã cổ phiếu...'}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[360px] p-0' align='start' sideOffset={4}>
                  <Command>
                    <CommandInput placeholder='Tìm kiếm mã cổ phiếu...' />
                    <CommandList className='max-h-60'>
                      <CommandEmpty>Không tìm thấy mã cổ phiếu nào.</CommandEmpty>
                      <CommandGroup>
                        {stocks?.map((stock) => (
                          <CommandItem
                            key={stock.ticker}
                            value={`${stock.ticker} ${stock.name} ${removeVietnameseAccents(stock.name)}`.toLowerCase()}
                            className='cursor-pointer px-2 py-2'
                            onSelect={async () => {
                              await formik.setFieldValue('ticker', stock.ticker)
                              formik.setFieldTouched('ticker', true)
                              formik.validateForm()
                              setOpenCombobox(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4 shrink-0',
                                formik.values.ticker === stock.ticker ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            <div className='flex flex-col min-w-0 flex-1 overflow-hidden'>
                              <span className='font-medium text-sm truncate'>{stock.ticker}</span>
                              <span className='text-xs text-gray-500 truncate'>{stock.name}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
              <Label htmlFor='price'>Giá (nghìn VNĐ) *</Label>
              <Input
                id='price'
                name='price'
                type='number'
                step='0.01'
                placeholder='VD: 150.5'
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
