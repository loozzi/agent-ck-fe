import { useAppDispatch, useAppSelector } from '@/app/hook'
import MarketStats from '@/components/common/MarketStats'
import NewsList from '@/components/common/NewsList'
import NewsSearch from '@/components/common/NewsSearch'
import NewsTimeline from '@/components/common/NewsTimeline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getSubscriptionStatus } from '@/slices/auth.slice'
import { fetchLatestNews, fetchNews, fetchPendingNews } from '@/slices/news.slice'
import type { GetNewsParams } from '@/types/news'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BarChart3, Bell, Globe, RefreshCw, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

const UserDashboard = () => {
  const dispatch = useAppDispatch()
  const { subscription, user } = useAppSelector((state) => state.auth)
  const { latestNews, pendingNews, news, isLoading } = useAppSelector((state) => state.news)
  const [refreshTime, setRefreshTime] = useState(new Date())

  useEffect(() => {
    dispatch(getSubscriptionStatus())

    // Fetch different types of news
    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    dispatch(fetchLatestNews({ limit: 10 }))
    dispatch(fetchPendingNews({ limit: 5 }))
    dispatch(
      fetchNews({
        from_date: format(lastWeek, 'yyyy-MM-dd'),
        to_date: format(today, 'yyyy-MM-dd'),
        per_page: 20,
        importance: 'high'
      })
    )
  }, [])

  const handleRefresh = () => {
    setRefreshTime(new Date())
    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    dispatch(fetchLatestNews({ limit: 10 }))
    dispatch(fetchPendingNews({ limit: 5 }))
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

  // Group news by importance
  const highImportanceNews = news.filter((n) => n.importance === 'high')
  const mediumImportanceNews = news.filter((n) => n.importance === 'medium')

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Thị trường chứng khoán</h1>
          <p className='text-muted-foreground text-sm sm:text-base'>
            Chào mừng {user?.full_name || 'User'} - Trạng thái: {subscription?.status || 'Inactive'}
          </p>
        </div>
        <div className='flex items-center space-x-2'>
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
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>Tin nóng</CardTitle>
            <Bell className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-red-600'>{highImportanceNews.length}</div>
            <p className='text-xs text-muted-foreground'>Tin quan trọng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>Tin mới nhất</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-blue-600'>{latestNews.length}</div>
            <p className='text-xs text-muted-foreground'>Tin tức mới</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>Chờ phát</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-orange-600'>{pendingNews.length}</div>
            <p className='text-xs text-muted-foreground'>Tin chờ phát</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>Tổng tin</CardTitle>
            <Globe className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold'>{news.length}</div>
            <p className='text-xs text-muted-foreground'>Tất cả tin tức</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
        {/* Latest News - Main Column */}
        <div className='lg:col-span-2 order-2 lg:order-1'>
          <NewsList
            news={latestNews}
            title='Tin tức mới nhất'
            description='Cập nhật tin tức chứng khoán mới nhất từ các nguồn uy tín'
            variant='featured'
            showViewMore={true}
            isLoading={isLoading}
          />
        </div>

        {/* Sidebar */}
        <div className='space-y-4 sm:space-y-6 order-1 lg:order-2'>
          {/* Market Stats */}
          <MarketStats news={news} isLoading={isLoading} />

          {/* High Importance News */}
          <NewsList
            news={highImportanceNews.slice(0, 5)}
            title='Tin nóng'
            description='Tin tức quan trọng nhất'
            variant='compact'
            isLoading={isLoading}
          />

          {/* Pending News */}
          <NewsList
            news={pendingNews}
            title='Tin chờ phát'
            description='Tin tức sắp được phát hành'
            variant='compact'
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Categorized News Tabs */}
      <Tabs defaultValue='all' className='space-y-4'>
        <div className='w-full'>
          <div className='flex overflow-x-auto scrollbar-hide tab-scroll'>
            <TabsList className='flex bg-muted p-1 rounded-lg min-w-max'>
              <TabsTrigger
                value='all'
                className='text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 tab-trigger-mobile'
              >
                Tất cả
              </TabsTrigger>
              <TabsTrigger
                value='timeline'
                className='text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 tab-trigger-mobile'
              >
                Thời gian
              </TabsTrigger>
              <TabsTrigger
                value='search'
                className='text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 tab-trigger-mobile'
              >
                Tìm kiếm
              </TabsTrigger>
              <TabsTrigger
                value='high'
                className='text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 tab-trigger-mobile'
              >
                Quan trọng
              </TabsTrigger>
              <TabsTrigger
                value='medium'
                className='text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 tab-trigger-mobile'
              >
                Trung bình
              </TabsTrigger>
              <TabsTrigger
                value='analysis'
                className='text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 tab-trigger-mobile'
              >
                Phân tích
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value='all' className='space-y-4 tab-content'>
          <NewsList
            news={news}
            title='Tất cả tin tức'
            description='Toàn bộ tin tức chứng khoán'
            variant='default'
            showViewMore={true}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value='timeline' className='space-y-4 tab-content'>
          <NewsTimeline news={news} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value='search' className='space-y-4 tab-content'>
          <NewsSearch onSearch={handleSearch} isLoading={isLoading} />
          <NewsList
            news={news}
            title='Kết quả tìm kiếm'
            description='Tin tức theo tiêu chí tìm kiếm'
            variant='default'
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value='high' className='space-y-4 tab-content'>
          <NewsList
            news={highImportanceNews}
            title='Tin tức quan trọng'
            description='Những tin tức có tác động lớn đến thị trường'
            variant='default'
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value='medium' className='space-y-4 tab-content'>
          <NewsList
            news={mediumImportanceNews}
            title='Tin tức trung bình'
            description='Tin tức có tác động trung bình đến thị trường'
            variant='default'
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value='analysis' className='space-y-4 tab-content'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <BarChart3 className='h-5 w-5' />
                <span>Phân tích thị trường</span>
              </CardTitle>
              <CardDescription>Các bài phân tích chuyên sâu về thị trường chứng khoán</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='text-center py-8 text-gray-500'>
                <BarChart3 className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                <p>Tính năng phân tích sẽ được cập nhật sớm</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UserDashboard
