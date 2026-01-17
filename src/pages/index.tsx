import CONFIG from '@/blog.config'
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import ContainerLayout from '../components/post/ContainerLayout'
import { WidgetCollection } from '../components/section/WidgetCollection'
import withNavFooter from '../components/withNavFooter'
import { formatPosts } from '../lib/blog/format/post'
import { formatWidgets, preFormatWidgets } from '../lib/blog/format/widget'
import getBlogStats from '../lib/blog/getBlogStats'
import { withNavFooterStaticProps } from '../lib/blog/withNavFooterStaticProps'
import { getWidgets } from '../lib/notion/getBlogData'
import { getLimitPosts } from '../lib/notion/getDatabase'

import { MainPostsCollection } from '../components/section/MainPostsCollection'
import { MorePostsCollection } from '../components/section/MorePostsCollection'
import { Post, SharedNavFooterStaticProps } from '../types/blog'
import { ApiScope } from '../types/notion'

const Home: NextPage<{
  posts: Post[]
  widgets: {
    [key: string]: any
  }
}> = ({ posts, widgets }) => {
  return (
    <>
      <ContainerLayout>
        {/* widgets 已经包含了我们注入的 announcement */}
        <WidgetCollection widgets={widgets} />
        <div data-aos="fade-up" data-aos-delay={300}>
          <MainPostsCollection posts={posts} />
        </div>
      </ContainerLayout>
      <MorePostsCollection posts={posts} />
    </>
  )
}

export const getStaticProps: GetStaticProps = withNavFooterStaticProps(
  async (
    _context: GetStaticPropsContext,
    sharedPageStaticProps: SharedNavFooterStaticProps
  ) => {
    const { LARGE, MEDIUM, SMALL, MORE } = CONFIG.HOME_POSTS_COUNT
    const sum = LARGE + MEDIUM + SMALL + MORE

    // 1. 获取普通文章列表 (Post)
    const posts = await getLimitPosts(sum, ApiScope.Home)
    const formattedPosts = await formatPosts(posts)

    // 2. 获取统计数据
    const blogStats = await getBlogStats()
    
    // 3. 获取所有 Widget 类型的页面 (用于 Profile 等)
    const rawWidgets = await getWidgets()

    // --- 🔥 核心修复：直接从 sharedPageStaticProps 获取全局页面数据 ---
    // 不需要额外 import getGlobalData，因为它已经传进来了
    // 使用 (as any) 绕过类型检查，直接读取 allNavPages
    const allPages = (sharedPageStaticProps?.props as any)?.allNavPages || []
    
    // 在所有 Page 中查找 slug 为 'announcement' 的页面
    const announcementData = allPages.find((p: any) => p.slug === 'announcement')
    // ----------------------------------------------------

    // 4. 执行原有的 Widget 格式化流程
    const preFormattedWidgets = await preFormatWidgets(rawWidgets)
    const formattedWidgets = await formatWidgets(preFormattedWidgets, blogStats)

    // 5. 将找到的公告数据注入到最终对象中
    // 即使没找到，也传 null，防止组件报错
    ;(formattedWidgets as any).announcement = announcementData || null

    return {
      props: {
        ...sharedPageStaticProps.props,
        posts: formattedPosts,
        widgets: formattedWidgets,
      },
      // revalidate: CONFIG.NEXT_REVALIDATE_SECONDS,
    }
  }
)

const withNavPage = withNavFooter(Home, undefined, true)

export default withNavPage
