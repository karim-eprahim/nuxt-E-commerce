export const getResourceName = (resourseUrl: string) => {
    const name = resourseUrl.split('.')[resourseUrl.split('.').length - 2]?.split('/').pop()
    const public_id = resourseUrl.split('.')[resourseUrl.split('.').length - 2]?.split('/').slice(-2).join('/');
    return { name, public_id }
}