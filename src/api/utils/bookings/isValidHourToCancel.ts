export const isValidHourToCancel = (hour: string) => {
  const matchHour = Number(hour)
  const date = new Date()

  const currentHour = date.getHours()
  const currentMinutes = date.getMinutes()

  const lessThanAnHourLeft = matchHour - currentHour === 1
  const lessThan30Minutes = currentMinutes >= 30
  const itIsPlayingOrWasPlayed = currentHour >= matchHour

  if ((lessThanAnHourLeft && lessThan30Minutes) || itIsPlayingOrWasPlayed) {
    return false
  } else {
    return true
  }
}
