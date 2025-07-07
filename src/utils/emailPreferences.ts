// Utility functions for managing email notification preferences

export const clearEmailDeclinePreference = (userId: string) => {
  if (userId) {
    localStorage.removeItem(`email_declined_${userId}`)
  }
}

export const hasDeclinedEmailNotification = (userId: string): boolean => {
  if (!userId) return false
  return localStorage.getItem(`email_declined_${userId}`) === 'true'
}

export const setEmailDeclinePreference = (userId: string) => {
  if (userId) {
    localStorage.setItem(`email_declined_${userId}`, 'true')
  }
}
