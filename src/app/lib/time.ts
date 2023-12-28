import { DateTime } from 'luxon'

function getDate(time: string): DateTime {
    const [hour, minutes, period] = time.split(/:| /)
    let hour24 = parseInt(hour, 10)
    
    if (period === 'PM' && hour24 !== 12) {
        hour24 += 12
    } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0
    }
    return DateTime.fromISO(`${hour24}:${minutes}`)
}

export function convertTimeToICSTimestamp(time: string): string {
    // YYYYMMDDTHHmmss
    return getDate(time).toFormat('yyyyMMdd\'T\'HHmmss')
}

export function convertToDatabaseTimestamp(time: string): string {
    return getDate(time).toSQL() as string
}
