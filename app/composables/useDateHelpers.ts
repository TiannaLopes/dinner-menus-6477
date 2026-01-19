export const useDateHelpers = () => {
  const getWeekStart = (date: Date = new Date()) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
    const monday = new Date(d.setDate(diff))
    monday.setHours(0, 0, 0, 0)
    return monday
  }

  const formatWeekRange = (weekStart: Date) => {
    const start = new Date(weekStart)
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 6)
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
  }

  const getWeekDays = (weekStart: Date) => {
    const days = []
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(day.getDate() + i)
      days.push({
        date: day,
        dayOfWeek: i,
        dayName: dayNames[i],
        shortName: dayNames[i].slice(0, 3),
        formatted: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })
    }
    
    return days
  }

  const formatDate = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const toISODate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  return {
    getWeekStart,
    formatWeekRange,
    getWeekDays,
    formatDate,
    toISODate
  }
}
