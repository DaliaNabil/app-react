export function formatDate(date){
    const formatedDate = new Date(date)
    const result = formatedDate.toLocaleDateString('en-us',{
        day:'2-digit',
        month:'short',
        year:'numeric',
        hour:'2-digit',
        minute:'2-digit'
    })
    return result

}