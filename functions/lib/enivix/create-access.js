const createAxios = require('./create-axios')
const auth = require('./create-auth')

const firestoreColl = 'enivix_tokens'
module.exports = function (apikey, token, email, storeId) {
  const self = this

  let documentRef
  if (firestoreColl) {
    documentRef = require('firebase-admin')
      .firestore()
      .doc(`${firestoreColl}/${storeId}`)
  }

  this.preparing = new Promise((resolve, reject) => {
    const authenticate = () => {
      self.axios = createAxios()
      resolve(self)
    }

    const handleAuth = () => {
      console.log('> Enivix Auth02 ', storeId)
      auth(apikey, token, email, storeId)
        .then(async (data) => {
          console.log('> Enivix token => ', data.token)
          await appSdk.apiApp(storeId, 'hidden_data', 'PATCH', { tokenProd: data.token }).catch(console.error)
          authenticate()
          if (documentRef) {
            documentRef.set({
              tokenProd: data.token,
              updatedAt: new Date().toISOString()

            }).catch(console.error)
          }
        })
        .catch(reject)
    }

    if (documentRef) {
      documentRef.get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists &&
            Date.now() - documentSnapshot.updateTime.toDate().getTime() <= 40 * 60 * 1000 // token expires in 50 min
          ) {
            authenticate()
          } else {
            handleAuth()
          }
        })
        .catch(console.error)
    } else {
      handleAuth()
    }
  })
}
