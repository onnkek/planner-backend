import express from 'express'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'

interface NoteType {
  id: number,
  body: string,
  create: number,
  visible: boolean
}

const app = express()
const port = 8000
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json').toString())

const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'utf-8'))

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(express.json());

app.get('/tasks', (req, res) => {
  // описание роута
  // #swagger.description = 'Get all active tasks'
  // возвращаемый ответ
  /* #swagger.responses[200] = {
      // описание ответа
      description: 'Array of all tasks',
      // схема ответа - ссылка на модель
      schema: { $ref: '#/definitions/Tasks' }
  } */

  res.send(db.tasks)

})

app.get('/notes', (req, res) => {
  // описание роута
  // #swagger.description = 'Get all notes'
  // возвращаемый ответ
  /* #swagger.responses[200] = {
      // описание ответа
      description: 'Array of all notes',
      // схема ответа - ссылка на модель
      schema: { $ref: '#/definitions/Notes' }
  } */

  res.send(db.notes)

})

app.get('/badges', (req, res) => {
  // описание роута
  // #swagger.description = 'Get all notes'
  // возвращаемый ответ
  /* #swagger.responses[200] = {
      // описание ответа
      description: 'Array of all notes',
      // схема ответа - ссылка на модель
      schema: { $ref: '#/definitions/Badges' }
  } */

  res.send(db.badges)

})

app.post('/notes', (req, res) => {
  /*  #swagger.auto = false

            #swagger.path = '/notes'
            #swagger.method = 'post'
            #swagger.description = 'Endpoint added note.'
            #swagger.produces = ["application/json"]
            #swagger.consumes = ["application/json"]
        */

  /*  #swagger.parameters['body'] = {
          in: 'body',
          description: 'Body of note.',
          required: true,
          schema: {
                $body: '<p>Test body</p>'
            }
      }
  */
  if (req.body.body) {
    const newNote = {
      "id": Math.random(),
      "body": req.body.body,
      "create": Date.now(),
      "visible": true
    }

    db.notes.push(newNote)
    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(db.notes)
  } else {
    res.send(400)
  }



})

app.post('/tasks', (req, res) => {
  /*  #swagger.auto = false

            #swagger.path = '/tasks'
            #swagger.method = 'post'
            #swagger.description = 'Endpoint added task.'
            #swagger.produces = ["application/json"]
            #swagger.consumes = ["application/json"]
        */

  /*  #swagger.parameters['body'] = {
          in: 'body',
          description: 'Data of task.',
          required: true,
          schema: {
                $body: 'Test task',
                $deadline: '2024-03-13T16:38',
                link: 'https://google.com',
                badges: [
                  {
                    "id": 3,
                    "color": 2,
                    "text": "Пробую сделать"
                  }
                ]
            }
      }
  */
  if (req.body.body && req.body.deadline && req.body.link && req.body.badges) {
    const newTask = {
      "id": Math.random(),
      "body": req.body.body,
      "create": Date.now(),
      "remove": "",
      "timeleft": "",
      "deadline": req.body.deadline,
      "link": req.body.link,
      "visible": true,
      "badges": req.body.badges
    }

    db.tasks.push(newTask)
    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(db.tasks)
  } else {
    res.send(400)
  }


})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})