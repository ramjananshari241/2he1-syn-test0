import CONFIG from '@/blog.config'
import { BlockRender } from '../../components/blocks/BlockRender'
import { BlogLayoutPure } from '../../components/layout/BlogLayout'
import ContentLayout from '../../components/layout/ContentLayout'
import PostFooter from '../../components/post/PostFooter'
import PostHeader from '../../components/post/PostHeader'
import PostMessage from '../../components/post/PostMessage'
import PostNavigation from '../../components/post/PostNavigation'
import CommentSection from '../../components/section/CommentSection'
import { Section404 } from '../../components/section/Section404'
import withNavFooter from '../../components/withNavFooter'
import { formatBlocks } from '../../lib/blog/format/block'
import { formatPosts, getNavigationInfo } from '../../lib/blog/format/post'
import { withNavFooterStaticProps } from '../../lib/blog/withNavFooterStaticProps'
import { getAllBlocks } from '../../lib/notion/getBlocks'
import { getPosts } from '../../lib/notion/getBlogData'
import { addSubTitle } from '../../lib/util'
import { NextPageWithLayout, PartialPost, Post, SharedNavFooterStaticProps } from '../../types/blog'
import { ApiScope, BlockResponse } from '../../types/notion'
import { GetStaticPropsContext, NextPage } from 'next'

export const getStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps = withNavFooterStaticProps(
  async (context: GetStaticPropsContext, sharedPageStaticProps: SharedNavFooterStaticProps) => {
    try {
      const slug = context.params?.post as string
      const postsRaw = await getPosts(ApiScope.Archive)
      const allPosts = await formatPosts(postsRaw)
      const post = allPosts.find((p) => p.slug === slug)

      // 🛡️ 修复 TypeScript 类型报错：不再返回 notFound: true，而是返回合规的空 props
      if (!post) {
        return {
          props: JSON.parse(JSON.stringify({
            ...sharedPageStaticProps.props,
            post: null,
            blocks: [],
            navigation: { previousPost: null, nextPost: null }
          })),
          revalidate: 10
        }
      }

      addSubTitle(sharedPageStaticProps.props, '', { text: post.title, color: 'gray', slug: post.slug }, false)
      
      const { previousPost, nextPost } = getNavigationInfo(allPosts, post)
      const blocks = await getAllBlocks(post.id)
      const formattedBlocks = await formatBlocks(blocks)

      // 暴力序列化清洗
      const safeData = JSON.parse(JSON.stringify({
        ...sharedPageStaticProps.props,
        post,
        blocks: formattedBlocks,
        navigation: { previousPost: previousPost || null, nextPost: nextPost || null },
      }))

      if (safeData.widgets?.profile && safeData.widgets.profile.links === undefined) {
        safeData.widgets.profile.links = null
      }

      return {
        props: safeData,
        revalidate: 10,
      }
    } catch (error) {
      console.error("ISR Error:", error)
      // 🛡️ 同样修复 catch 里的类型报错
      return {
        props: JSON.parse(JSON.stringify({
          ...sharedPageStaticProps.props,
          post: null,
          blocks: [],
          navigation: { previousPost: null, nextPost: null }
        })),
        revalidate: 10
      }
    }
  }
)

const PostPage: NextPage<{ post: Post; blocks: BlockResponse[]; navigation: { previousPost: PartialPost; nextPost: PartialPost } }> = ({ post, blocks, navigation }) => {
  // 如果后端传过来的是 post: null，前端组件会渲染 404，逻辑完美闭环
  if (!post) return <Section404 />
  
  return (
    <>
      <PostHeader post={post} blocks={blocks} />
      <ContentLayout>
        <PostMessage post={post} />
        <BlockRender blocks={blocks} />
        <PostFooter post={post} />
        <PostNavigation navigation={navigation} />
        {CONFIG.ENABLE_COMMENT && <CommentSection />}
      </ContentLayout>
    </>
  )
}

const withNavPage = withNavFooter(PostPage)
;(withNavPage as NextPageWithLayout).getLayout = (page) => <BlogLayoutPure>{page}</BlogLayoutPure>
export default withNavPage