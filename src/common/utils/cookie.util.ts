export const cookieOptionsToken = () => {
    return {
        httpOnly: true,
        expires: new Date(Date.now() + 2 * 60 * 1000), 
    }
}