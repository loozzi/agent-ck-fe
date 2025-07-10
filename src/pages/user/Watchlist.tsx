import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Star, StarOff, Loader2, BarChart2 } from 'lucide-react'
import StockCard from '@/components/common/StockCard'
import { useIsMobile } from '@/hooks/use-mobile'
import { toast } from 'react-toastify'
import {
  fetchWatchlistDetail,
  addToWatchlist,
  updateWatchlistItem,
  deleteWatchlistItem,
  updateWatchlist
} from '@/slices/watchlist.slice'
import type { RootState } from '@/app/store'
import type { WatchlistItem, UpdateWatchlistItemPayload, AddToWatchlistPayload } from '@/types/watchlist'
import '@/components/common/mobile-fixes.css'
import StockChart from '@/components/common/StockChart'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { ChevronsUpDown } from 'lucide-react'
import { fetchListStocksByName } from '@/slices/stock.slice'

// --- Dialog form thêm mã cổ phiếu ---
function AddWatchlistItemDialog({ open, onOpenChange, onSubmit, loading }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSubmit: (data: AddToWatchlistPayload) => void,
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
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Thêm mã theo dõi</DialogTitle>
          <DialogDescription>Nhập thông tin mã cổ phiếu để thêm vào watchlist.</DialogDescription>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-3">
          {/* Autocomplete mã cổ phiếu */}
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={openCombobox}
                className='w-full justify-between cursor-pointer'
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
            <PopoverContent className='w-[360px] p-0' align='start' sideOffset={4}>
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
                            className='cursor-pointer px-2 py-2'
                            onSelect={() => {
                              setForm(f => ({ ...f, ticker: stock.ticker }))
                              setOpenCombobox(false)
                            }}
                          >
                            <span className='font-semibold'>{stock.ticker}</span>
                            <span className='ml-2 text-gray-500'>{stock.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* Các trường còn lại */}
          <Input
            placeholder="Ghi chú"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          />
          <Input
            placeholder="Tag (cách nhau dấu phẩy)"
            value={form.tags.join(', ')}
            onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
          />
          <Input
            placeholder="Nhóm/Category"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          />
          <Input
            placeholder="Giá mục tiêu"
            type="number"
            value={form.target_price || ''}
            onChange={e => setForm(f => ({ ...f, target_price: Number(e.target.value) }))}
          />
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Lưu'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// --- Dialog form sửa mã cổ phiếu ---
function EditWatchlistItemDialog({ open, onOpenChange, onSubmit, initial, loading }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSubmit: (data: UpdateWatchlistItemPayload) => void,
  initial?: WatchlistItem,
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
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa mã theo dõi</DialogTitle>
          <DialogDescription>Cập nhật thông tin mã cổ phiếu trong watchlist.</DialogDescription>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-3">
          <Input
            placeholder="Ghi chú"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          />
          <Input
            placeholder="Tag (cách nhau dấu phẩy)"
            value={form.tags.join(', ')}
            onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
          />
          <Input
            placeholder="Nhóm/Category"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          />
          <Input
            placeholder="Giá mục tiêu"
            type="number"
            value={form.target_price || ''}
            onChange={e => setForm(f => ({ ...f, target_price: Number(e.target.value) }))}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_favorite}
              onChange={e => setForm(f => ({ ...f, is_favorite: e.target.checked }))}
              id="is_favorite"
            />
            <label htmlFor="is_favorite" className="text-sm">Yêu thích</label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Lưu'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// --- Dialog xác nhận xoá ---
function ConfirmDeleteDialog({ open, onOpenChange, onConfirm, loading }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onConfirm: () => void,
  loading?: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xoá</DialogTitle>
        </DialogHeader>
        <p>Bạn chắc chắn muốn xoá mã này khỏi watchlist?</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Huỷ</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>{loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Xoá'}</Button>
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
  useEffect(() => { dispatch(fetchWatchlistDetail() as any) }, [dispatch])
  useEffect(() => {
    if (watchlistDetail) setWLInfo({ name: watchlistDetail.name, description: watchlistDetail.description })
  }, [watchlistDetail])

  const filteredItems = useMemo(() => {
    if (!watchlistDetail?.items) return []
    if (!search.trim()) return watchlistDetail.items
    return watchlistDetail.items.filter((item: WatchlistItem) =>
      item.ticker.toLowerCase().includes(search.toLowerCase()) ||
      item.company_name?.toLowerCase().includes(search.toLowerCase())
    )
  }, [watchlistDetail, search])

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

  if (isLoading || !watchlistDetail) return (
    <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin w-8 h-8" /></div>
  )

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4">
      {/* Header watchlist */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{watchlistDetail.name}</h1>
            <Button size="icon" variant="ghost" onClick={() => setEditWL(true)}><Edit className="w-4 h-4" /></Button>
          </div>
          <p className="text-gray-500 text-sm max-w-md truncate">{watchlistDetail.description}</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="w-full sm:w-auto" size={isMobile ? 'lg' : 'default'}>
          <Plus className="w-4 h-4 mr-1" /> Thêm mã theo dõi
        </Button>
      </div>
      {/* Filter/Search */}
      <div className="flex gap-2 mb-4 items-center">
        <Input
          placeholder="Tìm kiếm mã hoặc tên công ty..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Badge variant="outline" className="hidden sm:inline-block">Tổng: {watchlistDetail.total_items}</Badge>
        <Badge variant="outline" className="hidden sm:inline-block">Yêu thích: {watchlistDetail.favorites_count}</Badge>
      </div>
      {/* Top/Worst performer */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm">Top tăng mạnh</span>
          <Star className="w-4 h-4 text-yellow-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {watchlistDetail.top_performers?.map((item: WatchlistItem) => (
            <div key={item.id} style={{ cursor: 'pointer' }} onClick={() => setChartTicker(item.ticker)}>
              <StockCard data={{
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
              }} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 mb-2">
          <span className="font-semibold text-sm">Top giảm mạnh</span>
          <StarOff className="w-4 h-4 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {watchlistDetail.worst_performers?.map((item: WatchlistItem) => (
            <div key={item.id} style={{ cursor: 'pointer' }} onClick={() => setChartTicker(item.ticker)}>
              <StockCard data={{
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
              }} />
            </div>
          ))}
        </div>
      </div>
      {/* Danh sách mã theo dõi */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-base">Danh sách mã theo dõi</span>
          <span className="text-xs text-gray-400">{filteredItems.length} mã</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredItems.map((item: WatchlistItem) => (
            <div key={item.id} className="relative group">
              {/* Click vào card để xem biểu đồ */}
              <div onClick={() => setChartTicker(item.ticker)} style={{ cursor: 'pointer' }}>
                <StockCard data={{
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
                }} />
              </div>
              {/* Nút thao tác */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-80 group-hover:opacity-100">
                <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); setChartTicker(item.ticker) }} title="Xem biểu đồ"><BarChart2 className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); setEditItem(item) }}><Edit className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); setDeleteItem(item) }}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Dialog thêm mã */}
      <AddWatchlistItemDialog open={showAdd} onOpenChange={setShowAdd} onSubmit={handleAdd} loading={isLoading} />
      {/* Dialog sửa mã */}
      <EditWatchlistItemDialog open={!!editItem} onOpenChange={v => { if (!v) setEditItem(null) }} onSubmit={handleEdit} initial={editItem || undefined} loading={isLoading} />
      {/* Dialog xoá mã */}
      <ConfirmDeleteDialog open={!!deleteItem} onOpenChange={v => { if (!v) setDeleteItem(null) }} onConfirm={handleDelete} loading={isLoading} />
      {/* Dialog sửa thông tin watchlist */}
      <Dialog open={editWL} onOpenChange={setEditWL}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin watchlist</DialogTitle>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); handleEditWL() }} className="space-y-3">
            <Input
              placeholder="Tên watchlist"
              value={wlInfo.name}
              onChange={e => setWLInfo(info => ({ ...info, name: e.target.value }))}
              required
            />
            <Input
              placeholder="Mô tả"
              value={wlInfo.description}
              onChange={e => setWLInfo(info => ({ ...info, description: e.target.value }))}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Lưu'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Dialog xem biểu đồ giá */}
      <Dialog open={!!chartTicker} onOpenChange={v => { if (!v) setChartTicker(null) }}>
        <DialogContent className="max-w-2xl w-full">
          {chartTicker && <StockChart ticker={chartTicker} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Watchlist
