export type EventItem = {
    title: string,
    image: string,
    slug: string,
    location: string,
    date: string,
    time: string,
}

export const events: EventItem[] = [
    {image:'/images/event1.png', title: 'React Summit US 2025',slug: 'react-summit-us-2025',location :'San Francisco, CA, USA', date:'2025-11-07', time:'09:00 AM'}, 
    {image:'/images/event2.png', title: 'KubeCon + CloudNativeCon Europe 2026',slug: 'kubecon-cloudnativecon-europe-2026',location :'Vienna, Austria', date:'2026-03-18', time:'10:00 AM'},
    {image:'/images/event3.png', title: 'AWS re:Ivent 2025',slug: 'aws-reinvent-2025',location :'Las Vegas, NV, USA', date:'2025-12-01', time:'08:30 AM'},
    {image:'/images/event4.png', title: 'React Summit US 2025',slug: 'react-summit-us-2025',location :'San Francisco, CA, USA', date:'2025-11-07', time:'09:00 AM'},
    {image:'/images/event5.png', title: 'KubeCon + CloudNativeCon Europe 2026',slug: 'kubecon-cloudnativecon-europe-2026',location :'Vienna, Austria', date:'2026-03-18', time:'10:00 AM'},
    {image:'/images/event6.png', title: 'AWS re:Ivent 2025',slug: 'aws-reinvent-2025',location :'Las Vegas, NV, USA', date:'2025-12-01', time:'08:30 AM'},
]