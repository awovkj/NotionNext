import { getDataFromCache } from '@/lib/cache/cache_manager'
import { getPageContentText } from '@/lib/db/notion/getPageContentText'

function createSnippet(content, keyword, radius = 80) {
  if (!content) {
    return null
  }

  const lowerContent = content.toLowerCase()
  const index = lowerContent.indexOf(keyword)
  if (index === -1) {
    return null
  }

  const start = Math.max(0, index - radius)
  const end = Math.min(content.length, index + keyword.length + radius)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < content.length ? '…' : ''

  return `${prefix}${content.slice(start, end).trim()}${suffix}`
}

export async function filterPostsByKeyword(allPosts, keyword) {
  const normalizedKeyword = keyword?.trim().toLowerCase()
  if (!normalizedKeyword) {
    return []
  }

  const filterPosts = []

  for (const post of allPosts) {
    const cacheKey = 'page_block_' + post.id
    const page = await getDataFromCache(cacheKey, true)
    const tagContent =
      post?.tags && Array.isArray(post?.tags) ? post.tags.join(' ') : ''
    const categoryContent =
      post?.category && Array.isArray(post.category)
        ? post.category.join(' ')
        : ''
    const articleInfo = `${post?.title || ''}${post?.summary || ''}${tagContent}${categoryContent}`
    const contentText = page ? getPageContentText(post, page) : ''
    const contentSnippet = createSnippet(contentText, normalizedKeyword)
    const infoHit = articleInfo.toLowerCase().includes(normalizedKeyword)

    if (!infoHit && !contentSnippet) {
      continue
    }

    post.results = contentSnippet ? [contentSnippet] : []
    filterPosts.push(post)
  }

  return filterPosts
}
