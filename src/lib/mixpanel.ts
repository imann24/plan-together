import mixpanel from 'mixpanel-browser'

let supported = false
if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    supported = true
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN)
}

export function trackEvent(eventName: string, data: any) {
    if(!supported) {
        // a silent failure is sufficient because there may be cases we don't want analytics
        return
    }
    mixpanel.track(eventName, data)
}

export function trackPageView(page: string) {
    trackEvent('page_view', { page })   
}
