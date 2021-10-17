export function convertDurationToTimeString(duration: number){

    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const timeString = [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0')).join(":")
    // paara cada valor desse array eu vou converter em string e se o número tiver apenas 1 digito,
    // acrescenta o 0 na frente

    return timeString;


}