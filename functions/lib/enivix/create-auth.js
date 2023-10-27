module.exports = (apikey, token, email, storeId) => new Promise((resolve, reject) => {
  const axios = require('./create-axios')(null)
  const request = isRetry => {
    console.log(`>> Create Auth s:${storeId}`)
    axios.post('/get/auth', {
      apikey,
      token,
      email
    })
      .then(({ data }) => resolve(data))
      .catch(err => {
        console.log('>> Authentication failed', JSON.stringify(err))
        // console.log('Deu erro quero response status', err.response.status)
        if (!isRetry && err.response && err.response.status >= 429) {
          setTimeout(() => request(true), 7000)
        }
        reject(err)
      })
  }
  request()
})
