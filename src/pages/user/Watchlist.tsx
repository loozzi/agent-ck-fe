import type { RootState } from '@/app/store'
import '@/components/common/mobile-fixes.css'
import StockCard from '@/components/common/StockCard'
import StockChart from '@/components/common/StockChart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useIsMobile } from '@/hooks/use-mobile'
import { fetchListStocksByName } from '@/slices/stock.slice'
import {
  addToWatchlist,
  deleteWatchlistItem,
  fetchWatchlistDetail,
  updateWatchlist,
  updateWatchlistItem
} from '@/slices/watchlist.slice'
import type { AddToWatchlistPayload, UpdateWatchlistItemPayload, WatchlistItem } from '@/types/watchlist'
import {
  BarChart2,
  Calendar,
  ChevronsUpDown,
  DollarSign,
  Edit,
  Loader2,
  Plus,
  Star,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

// --- Dialog form thêm mã cổ phiếu ---
function AddWatchlistItemDialog({
  open,
  onOpenChange,
  onSubmit,
  loading
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AddToWatchlistPayload) => void
  loading?: boolean
}) {
  const dispatch = useDispatch()
  const { stocks, loading: stockLoading } = useSelector((state: RootState) => state.stock)
  const [form, setForm] = useState<AddToWatchlistPayload>({
    ticker: '',
    notes: '',
    tags: [],
    category: '',
    target_price: 0
  })
  const [openCombobox, setOpenCombobox] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  // Debounce search
  useEffect(() => {
    if (!openCombobox || !searchValue.trim()) return
    const timeoutId = setTimeout(() => {
      dispatch(fetchListStocksByName({ q: searchValue.trim(), limit: 50 }) as any)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchValue, openCombobox, dispatch])
  useEffect(() => {
    if (!open) setForm({ ticker: '', notes: '', tags: [], category: '', target_price: 0 })
  }, [open])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Thêm mã theo dõi</DialogTitle>
          <DialogDescription>Nhập thông tin mã cổ phiếu để thêm vào watchlist.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(form)
          }}
          className='space-y-4'
        >
          {/* Autocomplete mã cổ phiếu */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>Mã cổ phiếu *</label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={openCombobox}
                  className='w-full justify-between cursor-pointer h-10'
                  type='button'
                >
                  <span className='truncate text-left'>
                    {form.ticker
                      ? `${form.ticker} - ${stocks?.find((stock) => stock.ticker === form.ticker)?.name || form.ticker}`
                      : 'Chọn mã cổ phiếu...'}
                  </span>
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[550px] p-0' align='start' sideOffset={4}>
                <Command>
                  <CommandInput
                    placeholder='Tìm kiếm mã cổ phiếu...'
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList className='max-h-60'>
                    {stockLoading ? (
                      <div className='flex items-center justify-center p-4'>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        <span className='ml-2 text-sm text-gray-500'>Đang tìm kiếm...</span>
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>
                          {searchValue.trim() ? 'Không tìm thấy mã cổ phiếu nào.' : 'Nhập để tìm kiếm mã cổ phiếu...'}
                        </CommandEmpty>
                        <CommandGroup>
                          {stocks?.map((stock) => (
                            <CommandItem
                              key={stock.ticker}
                              value={`${stock.ticker} ${stock.name}`.toLowerCase()}
                              className='cursor-pointer px-3 py-3'
                              onSelect={() => {
                                setForm((f) => ({ ...f, ticker: stock.ticker }))
                                setOpenCombobox(false)
                              }}
                            >
                              <div className='flex flex-col'>
                                <span className='font-semibold text-blue-600'>{stock.ticker}</span>
                                <span className='text-sm text-gray-500'>{stock.name}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Các trường còn lại */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>Ghi chú</label>
              <Input
                placeholder='Nhập ghi chú...'
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>Nhóm/Category</label>
              <Input
                placeholder='Nhập nhóm...'
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>Tags</label>
              <Input
                placeholder='Tag (cách nhau bằng dấu phẩy)'
                value={form.tags.join(', ')}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    tags: e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                  }))
                }
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>Giá mục tiêu</label>
              <Input
                placeholder='Nhập giá mục tiêu...'
                type='number'
                value={form.target_price || ''}
                onChange={(e) => setForm((f) => ({ ...f, target_price: Number(e.target.value) }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={loading}>
              {loading ? <Loader2 className='animate-spin w-4 h-4' /> : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// --- Dialog form sửa mã cổ phiếu ---
function EditWatchlistItemDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
  loading
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UpdateWatchlistItemPayload) => void
  initial?: WatchlistItem
  loading?: boolean
}) {
  const [form, setForm] = useState<UpdateWatchlistItemPayload>({
    notes: initial?.notes || '',
    tags: initial?.tags || [],
    category: initial?.category || '',
    target_price: initial?.target_price || 0,
    is_favorite: initial?.is_favorite || false
  })
  useEffect(() => {
    setForm({
      notes: initial?.notes || '',
      tags: initial?.tags || [],
      category: initial?.category || '',
      target_price: initial?.target_price || 0,
      is_favorite: initial?.is_favorite || false
    })
  }, [initial, open])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa mã theo dõi</DialogTitle>
          <DialogDescription>Cập nhật thông tin mã cổ phiếu trong watchlist.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(form)
          }}
          className='space-y-4'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>Ghi chú</label>
              <Input
                placeholder='Nhập ghi chú...'
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>Nhóm/Category</label>
              <Input
                placeholder='Nhập nhóm...'
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>Tags</label>
              <Input
                placeholder='Tag (cách nhau bằng dấu phẩy)'
                value={form.tags.join(', ')}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    tags: e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                  }))
                }
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>Giá mục tiêu</label>
              <Input
                placeholder='Nhập giá mục tiêu...'
                type='number'
                value={form.target_price || ''}
                onChange={(e) => setForm((f) => ({ ...f, target_price: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className='flex items-center gap-2 pt-2'>
            <input
              type='checkbox'
              checked={form.is_favorite}
              onChange={(e) => setForm((f) => ({ ...f, is_favorite: e.target.checked }))}
              id='is_favorite'
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label htmlFor='is_favorite' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Đánh dấu là yêu thích
            </label>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={loading}>
              {loading ? <Loader2 className='animate-spin w-4 h-4' /> : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// --- Dialog xác nhận xoá ---
function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
  item
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  loading?: boolean
  item?: WatchlistItem | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Trash2 className='w-5 h-5 text-red-500' />
            Xác nhận xoá mã cổ phiếu
          </DialogTitle>
          <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          {item && (
            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4'>
              <div className='flex items-center gap-3'>
                <div className='text-lg font-bold text-blue-600'>{item.ticker}</div>
                <div className='text-gray-600 dark:text-gray-400'>{item.company_name}</div>
              </div>
              {item.notes && <p className='text-sm text-gray-500 mt-1'>Ghi chú: {item.notes}</p>}
            </div>
          )}
          <p className='text-gray-700 dark:text-gray-300'>
            Bạn chắc chắn muốn xoá mã cổ phiếu này khỏi watchlist không?
          </p>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={loading}>
            Huỷ
          </Button>
          <Button variant='destructive' onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 className='animate-spin w-4 h-4 mr-2' /> : <Trash2 className='w-4 h-4 mr-2' />}
            Xoá khỏi watchlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const Watchlist = () => {
  const dispatch = useDispatch()
  const isMobile = useIsMobile()
  // Lấy state từ slice watchlist
  const { watchlistDetail, isLoading } = useSelector((state: RootState) => state.watchlist)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<WatchlistItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<WatchlistItem | null>(null)
  const [editWL, setEditWL] = useState(false)
  const [wlInfo, setWLInfo] = useState({ name: '', description: '' })
  const [chartTicker, setChartTicker] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('performance')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    dispatch(fetchWatchlistDetail() as any)
  }, [dispatch])
  useEffect(() => {
    if (watchlistDetail) setWLInfo({ name: watchlistDetail.name, description: watchlistDetail.description })
  }, [watchlistDetail])

  const filteredItems = useMemo(() => {
    if (!watchlistDetail?.items) return []
    let filtered = watchlistDetail.items

    // Filter by search
    if (search.trim()) {
      filtered = filtered.filter(
        (item: WatchlistItem) =>
          item.ticker.toLowerCase().includes(search.toLowerCase()) ||
          item.company_name?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'favorites') {
        filtered = filtered.filter((item: WatchlistItem) => item.is_favorite)
      } else {
        filtered = filtered.filter((item: WatchlistItem) => item.category === categoryFilter)
      }
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'performance':
          return (b.price_info.change_percent || 0) - (a.price_info.change_percent || 0)
        case 'alphabetical':
          return a.ticker.localeCompare(b.ticker)
        case 'price':
          return (b.price_info.current_price || 0) - (a.price_info.current_price || 0)
        case 'volume':
          return (b.price_info.volume || 0) - (a.price_info.volume || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [watchlistDetail, search, categoryFilter, sortBy])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!watchlistDetail?.items) return null

    const items = watchlistDetail.items
    const totalValue = items.reduce((sum, item) => sum + item.price_info.current_price * 100, 0) // Assuming 100 shares each
    const totalGainLoss = items.reduce((sum, item) => sum + item.price_info.change_amount * 100, 0)
    const avgPerformance =
      items.length > 0 ? items.reduce((sum, item) => sum + item.price_info.change_percent, 0) / items.length : 0
    const winnersCount = items.filter((item) => item.price_info.change_percent > 0).length
    const losersCount = items.filter((item) => item.price_info.change_percent < 0).length

    return {
      totalValue,
      totalGainLoss,
      avgPerformance,
      winnersCount,
      losersCount,
      totalItems: items.length
    }
  }, [watchlistDetail])

  const handleAdd = (data: AddToWatchlistPayload) => {
    dispatch(addToWatchlist(data) as any).then((res: any) => {
      if (!res.error) {
        setShowAdd(false)
        toast.success('Đã thêm mã vào watchlist!')
      }
    })
  }
  const handleEdit = (data: UpdateWatchlistItemPayload) => {
    if (!editItem) return
    dispatch(updateWatchlistItem({ itemId: editItem.id, payload: data }) as any).then((res: any) => {
      if (!res.error) {
        setEditItem(null)
        toast.success('Đã cập nhật mã!')
      }
    })
  }
  const handleDelete = () => {
    if (!deleteItem) return
    dispatch(deleteWatchlistItem(deleteItem.id) as any).then((res: any) => {
      if (!res.error) {
        setDeleteItem(null)
        toast.success('Đã xoá mã khỏi watchlist!')
      }
    })
  }
  const handleEditWL = () => {
    dispatch(updateWatchlist(wlInfo) as any).then((res: any) => {
      if (!res.error) {
        setEditWL(false)
        toast.success('Đã cập nhật thông tin watchlist!')
      }
    })
  }

  if (isLoading || !watchlistDetail)
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='animate-spin w-8 h-8' />
      </div>
    )

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            <div>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-500 rounded-lg'>
                  <BarChart2 className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{watchlistDetail.name}</h1>
                  <p className='text-gray-600 dark:text-gray-300 mt-1'>{watchlistDetail.description}</p>
                </div>
                <Button size='icon' variant='ghost' onClick={() => setEditWL(true)} className='ml-2'>
                  <Edit className='w-4 h-4' />
                </Button>
              </div>
            </div>
            <Button
              onClick={() => setShowAdd(true)}
              className='bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              size={isMobile ? 'lg' : 'default'}
            >
              <Plus className='w-4 h-4 mr-2' />
              Thêm mã theo dõi
            </Button>
          </div>
        </div>

        {/* Summary Statistics Cards */}
        {summaryStats && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
            <Card className='bg-white dark:bg-gray-800 shadow-lg border-0'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Tổng giá trị</p>
                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {(summaryStats.totalValue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <DollarSign className='w-8 h-8 text-blue-500' />
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white dark:bg-gray-800 shadow-lg border-0'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Lãi/Lỗ hôm nay</p>
                    <p
                      className={`text-2xl font-bold ${summaryStats.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {summaryStats.totalGainLoss >= 0 ? '+' : ''}
                      {(summaryStats.totalGainLoss / 1000).toFixed(0)}K
                    </p>
                  </div>
                  {summaryStats.totalGainLoss >= 0 ? (
                    <TrendingUp className='w-8 h-8 text-green-500' />
                  ) : (
                    <TrendingDown className='w-8 h-8 text-red-500' />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white dark:bg-gray-800 shadow-lg border-0'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Hiệu suất TB</p>
                    <p
                      className={`text-2xl font-bold ${summaryStats.avgPerformance >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {summaryStats.avgPerformance >= 0 ? '+' : ''}
                      {summaryStats.avgPerformance.toFixed(2)}%
                    </p>
                  </div>
                  <Target className='w-8 h-8 text-purple-500' />
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white dark:bg-gray-800 shadow-lg border-0'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>Tăng/Giảm</p>
                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                      <span className='text-green-600'>{summaryStats.winnersCount}</span>/
                      <span className='text-red-600'>{summaryStats.losersCount}</span>
                    </p>
                  </div>
                  <Calendar className='w-8 h-8 text-orange-500' />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='mb-6'>
          <TabsList className='grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3'>
            <TabsTrigger value='overview'>Tổng quan</TabsTrigger>
            <TabsTrigger value='performance'>Hiệu suất</TabsTrigger>
            <TabsTrigger value='watchlist'>Danh sách</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-6'>
            {/* Top Performers Section */}
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <Star className='w-5 h-5 text-yellow-500' />
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>Mã tăng mạnh nhất</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {watchlistDetail.top_performers?.map((item: WatchlistItem) => (
                  <div
                    key={item.id}
                    className='cursor-pointer transform hover:scale-105 transition-transform'
                    onClick={() => setChartTicker(item.ticker)}
                  >
                    <StockCard
                      data={{
                        ticker: item.ticker,
                        name: item.company_name,
                        exchange: item.exchange,
                        open: item.price_info.open_price,
                        close: item.price_info.current_price,
                        high: item.price_info.high_price,
                        low: item.price_info.low_price,
                        volume: item.price_info.volume,
                        time: item.price_info.last_updated,
                        sectors: [item.sector]
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Worst Performers Section */}
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <TrendingDown className='w-5 h-5 text-red-500' />
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>Mã giảm mạnh nhất</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {watchlistDetail.worst_performers?.map((item: WatchlistItem) => (
                  <div
                    key={item.id}
                    className='cursor-pointer transform hover:scale-105 transition-transform'
                    onClick={() => setChartTicker(item.ticker)}
                  >
                    <StockCard
                      data={{
                        ticker: item.ticker,
                        name: item.company_name,
                        exchange: item.exchange,
                        open: item.price_info.open_price,
                        close: item.price_info.current_price,
                        high: item.price_info.high_price,
                        low: item.price_info.low_price,
                        volume: item.price_info.volume,
                        time: item.price_info.last_updated,
                        sectors: [item.sector]
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value='performance' className='space-y-6'>
            <Card className='bg-white dark:bg-gray-800 shadow-lg border-0'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart2 className='w-5 h-5' />
                  Phân tích hiệu suất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg'>
                      <p className='text-2xl font-bold text-green-600'>{summaryStats?.winnersCount || 0}</p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>Mã tăng giá</p>
                    </div>
                    <div className='text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg'>
                      <p className='text-2xl font-bold text-red-600'>{summaryStats?.losersCount || 0}</p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>Mã giảm giá</p>
                    </div>
                    <div className='text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                      <p className='text-2xl font-bold text-blue-600'>{summaryStats?.totalItems || 0}</p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>Tổng số mã</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value='watchlist' className='space-y-6'>
            {/* Filters and Search */}
            <Card className='bg-white dark:bg-gray-800 shadow-lg border-0'>
              <CardContent className='p-6'>
                <div className='flex flex-col lg:flex-row gap-4'>
                  <div className='flex-1'>
                    <Input
                      placeholder='Tìm kiếm mã hoặc tên công ty...'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className='w-full'
                    />
                  </div>
                  <div className='flex gap-2'>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className='w-40'>
                        <SelectValue placeholder='Danh mục' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Tất cả</SelectItem>
                        <SelectItem value='favorites'>Yêu thích</SelectItem>
                        {watchlistDetail.categories?.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className='w-40'>
                        <SelectValue placeholder='Sắp xếp' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='performance'>Hiệu suất</SelectItem>
                        <SelectItem value='alphabetical'>A-Z</SelectItem>
                        <SelectItem value='price'>Giá</SelectItem>
                        <SelectItem value='volume'>Khối lượng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='flex gap-2 mt-4'>
                  <Badge variant='outline' className='text-blue-600'>
                    Tổng: {watchlistDetail.total_items}
                  </Badge>
                  <Badge variant='outline' className='text-yellow-600'>
                    Yêu thích: {watchlistDetail.favorites_count}
                  </Badge>
                  <Badge variant='outline' className='text-green-600'>
                    Đang xem: {filteredItems.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Watchlist Items */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredItems.map((item: WatchlistItem) => (
                <div key={item.id} className='relative group'>
                  <div
                    onClick={() => setChartTicker(item.ticker)}
                    className='cursor-pointer transform hover:scale-105 transition-all duration-200'
                  >
                    <StockCard
                      data={{
                        ticker: item.ticker,
                        name: item.company_name,
                        exchange: item.exchange,
                        open: item.price_info.open_price,
                        close: item.price_info.current_price,
                        high: item.price_info.high_price,
                        low: item.price_info.low_price,
                        volume: item.price_info.volume,
                        time: item.price_info.last_updated,
                        sectors: [item.sector]
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className='absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                    {item.is_favorite && <Star className='w-4 h-4 text-yellow-500 fill-current' />}
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-8 w-8 bg-white/80 hover:bg-white'
                      onClick={(e) => {
                        e.stopPropagation()
                        setChartTicker(item.ticker)
                      }}
                      title='Xem biểu đồ'
                    >
                      <BarChart2 className='w-4 h-4' />
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-8 w-8 bg-white/80 hover:bg-white'
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditItem(item)
                      }}
                      title='Chỉnh sửa'
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-8 w-8 bg-white/80 hover:bg-white'
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteItem(item)
                      }}
                      title='Xoá'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <div className='absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 text-xs'>
                      {item.category && (
                        <Badge variant='secondary' className='text-xs mr-1'>
                          {item.category}
                        </Badge>
                      )}
                      {item.target_price > 0 && (
                        <span className='text-gray-600 dark:text-gray-400'>
                          Mục tiêu: {item.target_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddWatchlistItemDialog open={showAdd} onOpenChange={setShowAdd} onSubmit={handleAdd} loading={isLoading} />
        <EditWatchlistItemDialog
          open={!!editItem}
          onOpenChange={(v) => {
            if (!v) setEditItem(null)
          }}
          onSubmit={handleEdit}
          initial={editItem || undefined}
          loading={isLoading}
        />
        <ConfirmDeleteDialog
          open={!!deleteItem}
          onOpenChange={(v) => {
            if (!v) setDeleteItem(null)
          }}
          onConfirm={handleDelete}
          loading={isLoading}
          item={deleteItem}
        />

        {/* Edit Watchlist Dialog */}
        <Dialog open={editWL} onOpenChange={setEditWL}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin watchlist</DialogTitle>
              <DialogDescription>Cập nhật tên và mô tả cho watchlist của bạn</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleEditWL()
              }}
              className='space-y-4'
            >
              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>Tên watchlist</label>
                <Input
                  placeholder='Nhập tên watchlist'
                  value={wlInfo.name}
                  onChange={(e) => setWLInfo((info) => ({ ...info, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>Mô tả</label>
                <Input
                  placeholder='Nhập mô tả'
                  value={wlInfo.description}
                  onChange={(e) => setWLInfo((info) => ({ ...info, description: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button type='button' variant='outline' onClick={() => setEditWL(false)}>
                  Huỷ
                </Button>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? <Loader2 className='animate-spin w-4 h-4 mr-2' /> : null}
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Stock Chart Dialog */}
        <Dialog
          open={!!chartTicker}
          onOpenChange={(v) => {
            if (!v) setChartTicker(null)
          }}
        >
          <DialogContent className='max-w-6xl w-full max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Biểu đồ giá - {chartTicker}</DialogTitle>
            </DialogHeader>
            {chartTicker && <StockChart ticker={chartTicker} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Watchlist
