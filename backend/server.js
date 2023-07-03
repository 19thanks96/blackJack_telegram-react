const express = require('express')
const app = express()
const {connectToDb, getBalanceDb, createUserDb, getRateDb: updateRateDb, updateWalletDb,  resetUserRate, updateWinRate} = require('./db.js')
const port = 5000
connectToDb().catch(console.error);


app.post('/:user', async (req, res) => {
  console.info('post /user/, user:', req.params.user)

    let user = await createUserDb(req.params.user)
    res.json(user)
})

app.get('/:user/balance', async (req, res) => {
    console.info('get /user/balance, user:', req.params.user)
    let balance = await getBalanceDb(req.params.user)
    res.json(balance) 
})

app.get('/:user/rate', async (req, res) => {
  console.info('get /user/rate, user:', req.params.user)
  let rate = await updateRateDb(req.params.user)
  console.log('updated rate', rate)
  res.json(rate) 
})

app.put('/:user/rate/reset', async (req, res) => {
  console.info('put /user/rate/reset, user:', req.params.user)
  let rate = await resetUserRate(req.params.user)
  res.json(rate)
})

app.put('/:user/balance', async (req, res) => {
  console.info('put /user/balance, user:', req.params.user)
  let wallet = await updateWalletDb(req.params.user)
  console.log('updated balance', wallet.balance)
  res.json(wallet) 
})

app.put('/:user/:winrate', async (req,res) => {
  console.info('put /:user/:winrate, user:', req.params.user)
  let balance = await updateWinRate(req.params.user, req.params.winrate)
  console.log('updated balance', balance)
  res.json(balance) 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
