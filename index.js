require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const basilStream = require('./basilstream')

let main = express()
let controls = express()

let interval, distance, backupMode

let settings = {
  interval: 1,
  distance: 5
}

main.use(bodyParser.text({
  type: 'text/plain'
}))

main.use(express.static('public'))

main.post('/postsurfacearea', function(req, res) {
  basilStream.bundleData(req.body)
  res.status(200).send()
})

main.get('/gettransactiondatabundle', function(req, res) {
  res.send(basilStream.transactionDataBundle)
  console.log('\nTRANSACTION PREPARED: ' + basilStream.transactionDataBundle)
})

main.get('/gettransactionhash', function(req, res) {
  if (basilStream.passTransactionHash === true) {
    res.send(basilStream.transactionHash)
    basilStream.passTransactionHash = false
  } else {
    res.status(403).send()
  }
})

main.get('/getsettings', function(req, res) {
  res.send(settings)
})

main.listen(3000)

controls.use(express.static('settings'))

controls.use(bodyParser.text({
  type: 'text/plain'
}))

controls.post('/postsettings', function(req, res) {
  settings = JSON.parse(req.body)
  console.log('\nSEETINGS CHANGED: ' + JSON.stringify(settings))
})

controls.get('/getsettings', function(req, res) {
  res.send(settings)
})

controls.listen(4000)

module.exports.settings = settings
