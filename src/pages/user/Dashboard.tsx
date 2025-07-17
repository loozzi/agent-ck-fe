import { useAppDispatch, useAppSelector } from '@/app/hook'
import NewsList from '@/components/common/NewsList'
import NewsSearch from '@/components/common/NewsSearch'
import NewsTimeline from '@/components/common/NewsTimeline'
import EmailNotificationDialog from '@/components/common/EmailNotificationDialog'
import EmailSettingsButton from '@/components/common/EmailSettingsButton'
import WatchlistSection from '@/components/common/WatchlistSection'
import WatchlistCard from '@/components/common/WatchlistCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getSubscriptionStatus, getMeAction } from '@/slices/auth.slice'
import { fetchLatestNews, fetchNews } from '@/slices/news.slice'
import { fetchWatchlistDetail } from '@/slices/watchlist.slice'
import type { GetNewsParams } from '@/types/news'
import { hasDeclinedEmailNotification } from '@/utils/emailPreferences'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BarChart3, Bell, Globe, RefreshCw, TrendingUp, TrendingDown, ListChecks } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchEmailStatus } from '@/slices/email.slice'

const UserDashboard = () => {
  const dispatch = useAppDispatch()
  const { subscription, user } = useAppSelector((state) => state.auth)
  const { latestNews, news, isLoading } = useAppSelector((state) => state.news)
  const { watchlistDetail, isLoading: watchlistLoading } = useAppSelector((state) => state.watchlist)
  const { emailStatus } = useAppSelector((state) => state.email)
  const [refreshTime, setRefreshTime] = useState(new Date())
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (user) {
      const hasDeclined = hasDeclinedEmailNotification(user.id)
      if (!user.email && !hasDeclined) {
        setShowEmailDialog(true)
      }
    }

    dispatch(getSubscriptionStatus())
    dispatch(fetchWatchlistDetail())

    // Fetch different types of news
    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    dispatch(fetchLatestNews({ limit: 10 }))
    dispatch(
      fetchNews({
        from_date: format(lastWeek, 'yyyy-MM-dd'),
        to_date: format(today, 'yyyy-MM-dd'),
        per_page: 20,
        importance: 'high'
      })
    )
    dispatch(fetchWatchlistDetail())
  }, [dispatch, user])

  const handleRefresh = () => {
    setRefreshTime(new Date())
    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    dispatch(fetchLatestNews({ limit: 10 }))
    dispatch(fetchWatchlistDetail())
    dispatch(
      fetchNews({
        from_date: format(lastWeek, 'yyyy-MM-dd'),
        to_date: format(today, 'yyyy-MM-dd'),
        per_page: 20,
        importance: 'high'
      })
    )
  }

  const handleSearch = (params: GetNewsParams) => {
    dispatch(fetchNews(params))
  }

  const handleEmailComplete = async (email: string) => {
    console.log('Email updated:', email)
    // Refresh user data to get updated email
    try {
      await dispatch(getMeAction())
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  const handleEmailDecline = () => {
    console.log('User declined email notifications')
    // Optional: You can track this event for analytics
  }

  const handleManualEmailDialog = () => {
    // When user manually opens the dialog, reset any decline preference
    // This allows them to change their mind
    setShowEmailDialog(true)
  }

  // Group news by importance
  const highImportanceNews = news.filter((n) => n.importance === 'high')
  const mediumImportanceNews = news.filter((n) => n.importance === 'medium')

  const handleViewChart = (ticker: string) => {
    // Navigate to chart view or open chart modal
    console.log('View chart for:', ticker)
  }

  const handleToggleFavorite = (itemId: string) => {
    // Handle toggle favorite functionality
    console.log('Toggle favorite for:', itemId)
  }

  const handleViewAllWatchlist = () => {
    // Navigate to full watchlist page
    console.log('Navigate to full watchlist')
    // You can add navigation logic here, e.g., router.push('/watchlist')
  }

  const handleViewMoreNews = () => {
    // Switch to "all" tab to show more news
    setActiveTab('all')
    // Scroll to the tabs section
    setTimeout(() => {
      const tabsSection = document.querySelector('[role="tablist"]')
      if (tabsSection) {
        tabsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  useEffect(() => {
    dispatch(fetchEmailStatus())
  }, [])

  return (
    <div className='space-y-4'>
      {/* EmailNotificationDialog */}
      <EmailNotificationDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onComplete={handleEmailComplete}
        onDecline={handleEmailDecline}
        userId={user?.id}
      />

      {/* Header Section */}
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <div className='flex-1'>
            <h1 className='text-xl sm:text-2xl font-bold tracking-tight'>Thị trường chứng khoán</h1>
            <p className='text-muted-foreground text-sm'>
              Chào mừng {user?.full_name || 'User'} - Trạng thái:{' '}
              {subscription?.status === 'subscriber' ? 'Đã đăng ký' : 'Chưa đăng ký'}
            </p>
          </div>

          {/* Desktop Actions */}
          <div className='hidden lg:flex items-center space-x-2'>
            {!emailStatus.email_verified && (
              <EmailSettingsButton onClick={handleManualEmailDialog} hasEmail={!!user?.email} />
            )}
            <Badge variant='outline' className='text-xs'>
              Cập nhật lần cuối: {format(refreshTime, 'HH:mm', { locale: vi })}
            </Badge>
            <Button variant='outline' size='sm' onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </Button>
          </div>
        </div>

        {/* Mobile and Tablet Actions */}
        <div className='flex lg:hidden flex-wrap items-center gap-2'>
          <EmailSettingsButton onClick={handleManualEmailDialog} hasEmail={emailStatus.email_verified} />
          <Badge variant='outline' className='text-xs'>
            Cập nhật lần cuối: {format(refreshTime, 'HH:mm', { locale: vi })}
          </Badge>
          <Button variant='outline' size='sm' onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className='hidden sm:inline'>Làm mới</span>
            <span className='sm:hidden'>Mới</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3'>
        <Card className='py-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1'>
            <CardTitle className='text-xs font-medium'>Tin nóng</CardTitle>
            <Bell className='h-3 w-3 text-muted-foreground' />
          </CardHeader>
          <CardContent className='pt-1'>
            <div className='text-lg font-bold text-red-600'>{highImportanceNews.length}</div>
            <p className='text-xs text-muted-foreground'>Tin quan trọng</p>
          </CardContent>
        </Card>
        <Card className='py-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1'>
            <CardTitle className='text-xs font-medium'>Tin mới nhất</CardTitle>
            <TrendingUp className='h-3 w-3 text-muted-foreground' />
          </CardHeader>
          <CardContent className='pt-1'>
            <div className='text-lg font-bold text-blue-600'>{latestNews.length}</div>
            <p className='text-xs text-muted-foreground'>Tin tức mới</p>
          </CardContent>
        </Card>
        <Card className='py-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1'>
            <CardTitle className='text-xs font-medium'>Watchlist</CardTitle>
            <ListChecks className='h-3 w-3 text-muted-foreground' />
          </CardHeader>
          <CardContent className='pt-1'>
            <div className='text-lg font-bold text-purple-600'>{watchlistDetail?.total_items || 0}</div>
            <p className='text-xs text-muted-foreground'>Cổ phiếu theo dõi</p>
          </CardContent>
        </Card>
        <Card className='py-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1'>
            <CardTitle className='text-xs font-medium'>Tổng tin</CardTitle>
            <Globe className='h-3 w-3 text-muted-foreground' />
          </CardHeader>
          <CardContent className='pt-1'>
            <div className='text-lg font-bold'>{news.length}</div>
            <p className='text-xs text-muted-foreground'>Tất cả tin tức</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4'>
        {/* Latest News - Main Column */}
        <div className='xl:col-span-2 order-2 xl:order-1'>
          <NewsList
            news={latestNews}
            title='Tin tức mới nhất'
            description='Cập nhật tin tức chứng khoán mới nhất từ các nguồn uy tín'
            variant='featured'
            showViewMore={true}
            isLoading={isLoading}
            onViewMore={handleViewMoreNews}
          />
        </div>

        {/* Sidebar */}
        <div className='space-y-3 sm:space-y-4 order-1 xl:order-2'>
          {/* High Importance News */}
          <NewsList
            news={highImportanceNews.slice(0, 3)}
            title='Tin nóng'
            description='Tin tức quan trọng nhất'
            variant='compact'
            isLoading={isLoading}
          />

          {/* Watchlist Section */}
          <WatchlistSection
            watchlistDetail={watchlistDetail}
            isLoading={watchlistLoading}
            onViewChart={handleViewChart}
            onToggleFavorite={handleToggleFavorite}
            onViewAll={handleViewAllWatchlist}
          />
        </div>
      </div>

      {/* Categorized News Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-3'>
        <div className='w-full'>
          <div className='flex overflow-x-auto scrollbar-hide tab-scroll'>
            <TabsList className='flex bg-muted p-1 rounded-lg min-w-max'>
              <TabsTrigger value='all' className='text-xs whitespace-nowrap px-2 py-1 tab-trigger-mobile'>
                Tất cả
              </TabsTrigger>
              <TabsTrigger value='watchlist' className='text-xs whitespace-nowrap px-2 py-1 tab-trigger-mobile'>
                Watchlist
              </TabsTrigger>
              <TabsTrigger value='timeline' className='text-xs whitespace-nowrap px-2 py-1 tab-trigger-mobile'>
                Thời gian
              </TabsTrigger>
              <TabsTrigger value='search' className='text-xs whitespace-nowrap px-2 py-1 tab-trigger-mobile'>
                Tìm kiếm
              </TabsTrigger>
              <TabsTrigger value='high' className='text-xs whitespace-nowrap px-2 py-1 tab-trigger-mobile'>
                Quan trọng
              </TabsTrigger>
              <TabsTrigger value='medium' className='text-xs whitespace-nowrap px-2 py-1 tab-trigger-mobile'>
                Trung bình
              </TabsTrigger>
              <TabsTrigger value='analysis' className='text-xs whitespace-nowrap px-2 py-1 tab-trigger-mobile'>
                Phân tích
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value='all' className='space-y-3 tab-content'>
          <NewsList
            news={news}
            title='Tất cả tin tức'
            description='Toàn bộ tin tức chứng khoán'
            variant='default'
            showViewMore={true}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value='watchlist' className='space-y-3 tab-content'>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3'>
            {watchlistDetail?.items?.map((item) => (
              <WatchlistCard
                key={item.id}
                item={item}
                onViewChart={handleViewChart}
                onToggleFavorite={handleToggleFavorite}
              />
            )) || (
              <div className='col-span-full text-center py-6 text-gray-500'>
                <ListChecks className='h-10 w-10 mx-auto mb-3 text-gray-300' />
                <p className='text-sm'>Danh sách theo dõi trống</p>
                <p className='text-xs'>Thêm cổ phiếu để bắt đầu theo dõi</p>
              </div>
            )}
          </div>
          {watchlistDetail?.top_performers && watchlistDetail.top_performers.length > 0 && (
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center space-x-2 text-base'>
                  <TrendingUp className='h-4 w-4 text-green-600' />
                  <span>Top Performers</span>
                </CardTitle>
                <CardDescription className='text-xs'>Cổ phiếu có hiệu suất tốt nhất trong watchlist</CardDescription>
              </CardHeader>
              <CardContent className='pt-0'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {watchlistDetail.top_performers.slice(0, 4).map((item) => (
                    <WatchlistCard
                      key={item.id}
                      item={item}
                      onViewChart={handleViewChart}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {watchlistDetail?.worst_performers && watchlistDetail.worst_performers.length > 0 && (
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center space-x-2 text-base'>
                  <TrendingDown className='h-4 w-4 text-red-600' />
                  <span>Worst Performers</span>
                </CardTitle>
                <CardDescription className='text-xs'>Cổ phiếu có hiệu suất kém nhất trong watchlist</CardDescription>
              </CardHeader>
              <CardContent className='pt-0'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {watchlistDetail.worst_performers.slice(0, 4).map((item) => (
                    <WatchlistCard
                      key={item.id}
                      item={item}
                      onViewChart={handleViewChart}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='timeline' className='space-y-3 tab-content'>
          <NewsTimeline news={news} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value='search' className='space-y-3 tab-content'>
          <NewsSearch onSearch={handleSearch} isLoading={isLoading} />
          <NewsList
            news={news}
            title='Kết quả tìm kiếm'
            description='Tin tức theo tiêu chí tìm kiếm'
            variant='default'
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value='high' className='space-y-3 tab-content'>
          <NewsList
            news={highImportanceNews}
            title='Tin tức quan trọng'
            description='Những tin tức có tác động lớn đến thị trường'
            variant='default'
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value='medium' className='space-y-3 tab-content'>
          <NewsList
            news={mediumImportanceNews}
            title='Tin tức trung bình'
            description='Tin tức có tác động trung bình đến thị trường'
            variant='default'
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value='analysis' className='space-y-3 tab-content'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center space-x-2 text-base'>
                <BarChart3 className='h-4 w-4' />
                <span>Phân tích thị trường</span>
              </CardTitle>
              <CardDescription className='text-xs'>
                Các bài phân tích chuyên sâu về thị trường chứng khoán
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='text-center py-6 text-gray-500'>
                <BarChart3 className='h-10 w-10 mx-auto mb-3 text-gray-300' />
                <p className='text-sm'>Tính năng phân tích sẽ được cập nhật sớm</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UserDashboard
