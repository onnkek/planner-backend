import express from 'express'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'

const app = express()
const port = 8000
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json').toString())

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.get('/tasks', (req, res) => {
  // описание роута
  // #swagger.description = 'Get all active tasks'
  // возвращаемый ответ
  /* #swagger.responses[200] = {
      // описание ответа
      description: 'Array of all tasks',
      // схема ответа - ссылка на модель
      schema: { $ref: '#/definitions/Todos' }
  } */


  res.send('Hello world!')

})

app.post('/tasks', (req, res) => {
  // описание роута
  // #swagger.description = 'Create new task'
  // возвращаемый ответ
  /* #swagger.responses[200] = {
      // описание ответа
      description: 'Array of all closed tasks',
      // схема ответа - ссылка на модель
      schema: { $ref: '#/definitions/Todos' }
  } */

      
  res.send('Hello world!')

})

app.put('/tasks', (req, res) => {
  // описание роута
  // #swagger.description = 'Update task parameters'
  // возвращаемый ответ
  /* #swagger.responses[200] = {
      // описание ответа
      description: 'Array of all closed tasks',
      // схема ответа - ссылка на модель
      schema: { $ref: '#/definitions/Todos' }
  } */

      
  res.send('Hello world!')

})




app.get('/oldtasks', (req, res) => {
  // описание роута
  // #swagger.description = 'Get all closed tasks'
  // возвращаемый ответ
  /* #swagger.responses[200] = {
      // описание ответа
      description: 'Array of all closed tasks',
      // схема ответа - ссылка на модель
      schema: { $ref: '#/definitions/Todos' }
  } */

      
  res.send('Hello world!')

})


app.get('/notes', (req, res) => {
  // описание роута
  // #swagger.description = 'Get all notes'
  // возвращаемый ответ
  /* #swagger.responses[200] = {
      // описание ответа
      description: 'Array of all notes',
      // схема ответа - ссылка на модель
      schema: { $ref: '#/definitions/Todos' }
  } */


  res.send('Hello world!')

})

app.post('/notes', (req, res) => {
  // описание роута
  // #swagger.description = 'Create new notes'
  // возвращаемый ответ
  /* #swagger.responses[200] = {
      // описание ответа
      description: 'Array of all closed notes',
      // схема ответа - ссылка на модель
      schema: { $ref: '#/definitions/Todos' }
  } */

      
  res.send('Hello world!')

})

app.put('/notes', (req, res) => {
  // описание роута
  // #swagger.description = 'Update note information'
  // возвращаемый ответ
  /* #swagger.responses[200] = {
      // описание ответа
      description: 'Array of all closed tasks',
      // схема ответа - ссылка на модель
      schema: { $ref: '#/definitions/Todos' }
  } */

      
  res.send('Hello world!')

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})