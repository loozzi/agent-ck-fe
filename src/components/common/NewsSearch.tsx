import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { GetNewsParams, NewsImportance } from '@/types/news'
import { format } from 'date-fns'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface NewsSearchProps {
  onSearch: (params: GetNewsParams) => void
  isLoading?: boolean
}

const NewsSearch = ({ onSearch, isLoading }: NewsSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [importance, setImportance] = useState<NewsImportance | ''>('')
  const [source, setSource] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const handleSearch = () => {
    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const params: GetNewsParams = {
      from_date: fromDate || format(lastWeek, 'yyyy-MM-dd'),
      to_date: toDate || format(today, 'yyyy-MM-dd'),
      search: searchTerm || undefined,
      importance: importance || undefined,
      source: source || undefined,
      per_page: 20
    }

    onSearch(params)
  }

  const handleReset = () => {
    setSearchTerm('')
    setImportance('')
    setSource('')
    setFromDate('')
    setToDate('')

    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    onSearch({
      from_date: format(lastWeek, 'yyyy-MM-dd'),
      to_date: format(today, 'yyyy-MM-dd'),
      per_page: 20
    })
  }

  return (
    <div className='space-y-4 p-3 sm:p-4 border rounded-lg bg-card'>
      <div className='flex items-center space-x-2'>
        <Search className='h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground' />
        <h3 className='text-base sm:text-lg font-semibold'>Tìm kiếm tin tức</h3>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
        <div className='space-y-2 sm:col-span-2 lg:col-span-1'>
          <Label htmlFor='search-term' className='text-sm'>
            Từ khóa
          </Label>
          <Input
            id='search-term'
            placeholder='Nhập từ khóa...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className='text-sm'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='importance' className='text-sm'>
            Mức độ quan trọng
          </Label>
          <Select value={importance} onValueChange={(value) => setImportance(value as NewsImportance)}>
            <SelectTrigger className='text-sm'>
              <SelectValue placeholder='Chọn mức độ' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>Tất cả</SelectItem>
              <SelectItem value='high'>Quan trọng</SelectItem>
              <SelectItem value='medium'>Trung bình</SelectItem>
              <SelectItem value='low'>Thấp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='source' className='text-sm'>
            Nguồn tin
          </Label>
          <Input
            id='source'
            placeholder='Nguồn tin...'
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className='text-sm'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='from-date' className='text-sm'>
            Từ ngày
          </Label>
          <Input
            id='from-date'
            type='date'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className='text-sm'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='to-date' className='text-sm'>
            Đến ngày
          </Label>
          <Input
            id='to-date'
            type='date'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className='text-sm'
          />
        </div>

        <div className='flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-2'>
          <Button onClick={handleSearch} disabled={isLoading} className='w-full sm:flex-1 text-sm'>
            {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
          </Button>
          <Button variant='outline' onClick={handleReset} disabled={isLoading} className='w-full sm:w-auto text-sm'>
            Xóa
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewsSearch
