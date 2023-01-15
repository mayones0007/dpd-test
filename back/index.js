const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const { users, fields } = require('./data/users')

const app = express()
const port = 3000

app.use(cors())
app.use(express())
app.use(bodyParser.json())
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})


app.get('/', (req, res) => {
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const { filter, sorted } = req.query
  const reverse = req.query.reverse === 'true' ? true : false
  const fieldNames = Object.keys(fields)
  let results = filter ? users.filter(user => fieldNames.some(field => user[field].toLowerCase().includes(filter.toLowerCase()))) : users
  results = sorted ? results.sort((a, b) => (a[sorted] > b[sorted] ? 1 : -1)) : results
  results = reverse ? results.reverse() : results
  res.send({
    results: results.slice((page - 1) * limit, limit + (page - 1) * limit),
    count: results.length,
    fields
  })
})