import defaultSettings from '@/settings'

const title = defaultSettings.title || '越光科技'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
