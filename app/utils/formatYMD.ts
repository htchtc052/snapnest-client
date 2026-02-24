export function formatYMD(input: string | number | Date): string {
    const d = input instanceof Date ? input : new Date(input)
    if (Number.isNaN(d.getTime())) return ''

    const parts = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(d)

    const year  = parts.find(p => p.type === 'year')?.value ?? ''
    const month = parts.find(p => p.type === 'month')?.value ?? ''
    const day   = parts.find(p => p.type === 'day')?.value ?? ''

    return `${year}.${month}.${day}`
}