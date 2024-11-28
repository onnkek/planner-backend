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

interface TaskType {
  id: number,
  body: string,
  create: string,
  remove: string,
  timeleft: string,
  deadline: string,
  link: string,
  visible: boolean,
  badges: number[]
}

interface BadgeType {
  id: number,
  color: number,
  text: string
}

interface DBType {
  tasks: TaskType[],
  notes: NoteType[],
  badges: BadgeType[]
}

const app = express()
const port = 8000
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json').toString())

const db: DBType = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'utf-8'))

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(express.json());




app.get('/tasks', (req, res) => {
  // #swagger.description = 'Get all active tasks'
  /* #swagger.responses[200] = {
           description: 'Get all tasks.',
           schema: { $ref: '#/definitions/Tasks' }
   } */

  res.send(db.tasks)

})

app.get('/tasks/:id', (req, res) => {
  /* #swagger.responses[200] = {
           description: 'Get a specific task.',
           schema: { $ref: '#/definitions/Task' }
   } */

  const task = db.tasks.find(task => task.id === Number(req.params.id))
  if (task) {
    res.send(task)
  } else {
    res.send(404)
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
    const newTask: TaskType = {
      "id": Math.random(),
      "body": req.body.body,
      "create": Date.now().toString(),
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

app.delete('/tasks/:id', (req, res) => {

  const task = db.tasks.find(task => task.id === Number(req.params.id))
  if (task) {
    const index = db.tasks.indexOf(task)
    db.tasks.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(db.tasks)

  } else {
    res.send(404)
  }

})

app.put('/tasks/:id', (req, res) => {

  const task = db.tasks.find(task => task.id === Number(req.params.id))
  if (task && (req.body.body || req.body.create || req.body.remove || req.body.timeleft || req.body.deadline || req.body.link || req.body.visible || req.body.badges)) {

    if (req.body.body) {
      task.body = req.body.body
    }
    if (req.body.create) {
      task.create = req.body.create
    }
    if (req.body.remove) {
      task.remove = req.body.remove
    }
    if (req.body.timeleft) {
      task.timeleft = req.body.timeleft
    }
    if (req.body.deadline) {
      task.deadline = req.body.deadline
    }
    if (req.body.link) {
      task.link = req.body.link
    }
    if (req.body.visible) {
      task.visible = req.body.visible
    }
    if (req.body.badges) {

      let badges = [];
      for (let i in req.body.badges) {
        if (typeof req.body.badges[i] === 'number') {
          badges.push(req.body.badges[i])
        } else {
          res.send(404)
        }
      }
      task.badges = badges
    }

    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(task)

  } else {
    res.send(404)
  }

})





app.get('/notes', (req, res) => {
  // #swagger.description = 'Get all active notes'
  /* #swagger.responses[200] = {
           description: 'Get all notes.',
           schema: { $ref: '#/definitions/Notes' }
   } */

  res.send(db.notes)

})

app.get('/notes/:id', (req, res) => {
  /* #swagger.responses[200] = {
           description: 'Get a specific note.',
           schema: { $ref: '#/definitions/Note' }
   } */

  const note = db.notes.find(note => note.id === Number(req.params.id))
  if (note) {
    res.send(note)
  } else {
    res.send(404)
  }


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
    const newNote: NoteType = {
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

app.delete('/notes/:id', (req, res) => {

  const note = db.notes.find(note => note.id === Number(req.params.id))
  if (note) {
    const index = db.notes.indexOf(note)
    db.notes.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(db.notes)

  } else {
    res.send(404)
  }

})

app.put('/notes/:id', (req, res) => {

  const note = db.notes.find(note => note.id === Number(req.params.id))
  if (note && (req.body.body || req.body.create || req.body.visible)) {

    if (req.body.body) {
      note.body = req.body.body
    }
    if (req.body.create) {
      note.create = req.body.create
    }
    if (req.body.visible) {
      note.visible = req.body.visible
    }

    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(note)

  } else {
    res.send(404)
  }

})





app.get('/badges', (req, res) => {
  // #swagger.description = 'Get all active badges'
  /* #swagger.responses[200] = {
           description: 'Get all badges.',
           schema: { $ref: '#/definitions/Badges' }
   } */

  res.send(db.badges)

})

app.get('/badges/:id', (req, res) => {
  /* #swagger.responses[200] = {
           description: 'Get a specific badge.',
           schema: { $ref: '#/definitions/Badge' }
   } */

  const badge = db.badges.find(badge => badge.id === Number(req.params.id))
  if (badge) {
    res.send(badge)
  } else {
    res.send(404)
  }


})

app.post('/badges', (req, res) => {
  /*  #swagger.auto = false

            #swagger.path = '/badges'
            #swagger.method = 'post'
            #swagger.description = 'Endpoint added badge.'
            #swagger.produces = ["application/json"]
            #swagger.consumes = ["application/json"]
        */

  /*  #swagger.parameters['body'] = {
          in: 'body',
          description: 'Data of badge.',
          required: true,
          schema: {
            "color": 3,
            "text": "WARNING"
          }
      }
  */
  if (req.body.text && req.body.color) {
    const newBadge: BadgeType = {
      "id": Math.random(),
      "color": req.body.color,
      "text": req.body.text
    }

    db.badges.push(newBadge)
    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(db.badges)
  } else {
    res.send(400)
  }


})

app.delete('/badges/:id', (req, res) => {

  const badge = db.badges.find(badge => badge.id === Number(req.params.id))
  if (badge) {
    const index = db.badges.indexOf(badge)
    db.badges.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(db.badges)

  } else {
    res.send(404)
  }

})

app.put('/badges/:id', (req, res) => {

  const badge = db.badges.find(badge => badge.id === Number(req.params.id))
  if (badge && (req.body.color || req.body.text)) {

    if (req.body.color) {
      badge.color = req.body.color
    }
    if (req.body.text) {
      badge.text = req.body.text
    }

    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(badge)

  } else {
    res.send(404)
  }

})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})