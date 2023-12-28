import { DateTime } from 'luxon'

function getDate(time: string): DateTime {
    // when parsing from DB entry, it will already be in ISO format
    const tryIso = DateTime.fromISO(time)
    if (tryIso.isValid) {
        return tryIso
    }

    // when parsing from ChatGPT output, it will be in 12-hour format
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

export function convertToDisplayTimeRange(start: string, end: string): string {
    const startObj = DateTime.fromISO(start)
    const endObj = DateTime.fromISO(end)
    return `${startObj.toLocaleString()}, ${startObj.toLocaleString(DateTime.TIME_SIMPLE)}-${endObj.toLocaleString(DateTime.TIME_SIMPLE)}`
}
