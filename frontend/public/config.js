module.exports = {
  apiURL: process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:3000/api'
}
