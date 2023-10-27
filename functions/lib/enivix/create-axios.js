const axios = require('axios')

module.exports = () => {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  const baseURL = 'https://oms.enivix.com.br/api'

  return axios.create({
    baseURL,
    headers
  })
}
