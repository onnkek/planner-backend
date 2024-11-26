import express from 'express'

// const fs = require('fs')
// const path = require('path')

const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})