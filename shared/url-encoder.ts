export const encodeUrl = (videoUrl: string) => {
    const encodeAmpersand: string = videoUrl.replaceAll('&', 'ENCODED_AMPERSAND')
    return encodeAmpersand.replaceAll('%', 'ENCODED_PERCENT')
}