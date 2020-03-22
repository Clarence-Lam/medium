import defaultSettings from '@/settings'

const title = defaultSettings.title || 'TM媒介'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
