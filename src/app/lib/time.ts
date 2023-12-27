import { DateTime } from 'luxon'

export function convertTimeToICSTimestamp(time: string): string {
    const [hour, minute, period] = time.split(/:| /)
    let hour24 = parseInt(hour, 10)
    
    if (period === 'PM' && hour24 !== 12) {
        hour24 += 12
    } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0
    }
    
    const date = DateTime.fromISO(`${hour24}:${minute}`)
    
    // YYYYMMDDTHHmmss
    return date.toFormat('yyyyMMdd\'T\'HHmmss')
}
