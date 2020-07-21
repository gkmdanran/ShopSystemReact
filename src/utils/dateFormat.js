export default function dateFormat(originVal){
    const dt=new Date(originVal*1000)
    const y=dt.getFullYear()
    const m=(dt.getMonth()+1+'').padStart(2,'0')
    const d=(dt.getDate()+'').padStart(2,'0')
    const h=(dt.getHours()+'').padStart(2,'0')
    const mm=(dt.getMinutes()+'').padStart(2,'0')
    const s=(dt.getSeconds()+'').padStart(2,'0')
    return `${y}-${m}-${d} ${h}:${mm}:${s}`
}