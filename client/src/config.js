export const config = {
    uri: process.env.NODE_ENV === 'development'
        ? 'http://localhost:5001/graphql'
        : 'https://wp-offline-updater.herokuapp.com/graphql'
}