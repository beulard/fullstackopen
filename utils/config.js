require('dotenv').config()

const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_BLOGLIST_TEST
    : process.env.MONGODB_URI_BLOGLIST
const PORT = process.env.PORT || '3003'

module.exports = {
    MONGODB_URI,
    PORT
}