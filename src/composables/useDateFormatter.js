export function useDateFormatter() {
  const parseDueDate = (value) => {
    if (!value) return null
    const date = value instanceof Date ? value : new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const formatDateLocal = (dateObj) => {
    if (!dateObj) return null
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)

    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
    }).format(date)
  }

  return {
    parseDueDate,
    formatDateLocal,
    formatDate,
  }
}
