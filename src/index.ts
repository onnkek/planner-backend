import express from 'express'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

interface NoteType {
  uid: number,
  folderUid: number,
  label: string,
  body: string,
  create: string,
  icon: string,
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

interface FolderType {
  uid: number
  label: string
  create: string
  children: FolderType[] | NoteType[]
}

interface VacationType {
  id: number,
  start: string,
  end: string
}

interface HolidayType {
  id: number,
  day: string
}

interface DateType {
  vacations: VacationType[]
  holidays: HolidayType[]
}

interface SettingsType {
  date: DateType
}

interface DBType {
  settings: SettingsType,
  tasks: TaskType[],
  notes: FolderType,
  badges: BadgeType[]
}

const app = express()

const port = 8000
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json').toString())

const db: DBType = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'utf-8'))
const dateFormat = { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' }
app.use(cors());
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(express.json());




app.get('/tasks', (req, res) => {
  // #swagger.description = 'Get all active tasks'
  /* #swagger.responses[200] = {
           description: 'Get all tasks.',
           schema: { $ref: '#/definitions/Tasks' }
   } */
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.host}] GET /tasks`)
  res.send(db.tasks)

})

app.get('/tasks/:id', (req, res) => {
  /* #swagger.responses[200] = {
           description: 'Get a specific task.',
           schema: { $ref: '#/definitions/Task' }
   } */
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] GET /tasks/${req.params.id}`)
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
  console.log(req.body)
  if (req.body.body && req.body.deadline) {
    console.log(req.body)
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
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] POST /tasks/`)
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
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] DELETE /tasks/${req.params.id}`)
  } else {
    res.send(404)
  }

})

app.put('/tasks/:id', (req, res) => {

  const task = db.tasks.find(task => task.id === Number(req.params.id))
  console.log(task)
  console.log(req.body.visible)
  if (task && (req.body.body || req.body.create || req.body.remove || req.body.timeleft || req.body.deadline || req.body.link || "visible" in req.body || req.body.badges)) {

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
    if ("visible" in req.body) {
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
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] PUT /tasks/${req.params.id}`)
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
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] GET /notes`)
  res.send(db.notes)

})

// app.get('/notes/:id', (req, res) => {
//   /* #swagger.responses[200] = {
//            description: 'Get a specific note.',
//            schema: { $ref: '#/definitions/Note' }
//    } */

//   const note = db.notes.find(note => note.uid === Number(req.params.id))
//   if (note) {
//     res.send(note)
//   } else {
//     res.send(404)
//   }


// })

// app.post('/notes', (req, res) => {
//   /*  #swagger.auto = false

//             #swagger.path = '/notes'
//             #swagger.method = 'post'
//             #swagger.description = 'Endpoint added note.'
//             #swagger.produces = ["application/json"]
//             #swagger.consumes = ["application/json"]
//         */

//   /*  #swagger.parameters['body'] = {
//           in: 'body',
//           description: 'Body of note.',
//           required: true,
//           schema: {
//                 $body: '<p>Test body</p>'
//             }
//       }
//   */
//   if (req.body.body) {
//     const newNote: NoteType = {
//       uid: Math.random(),
//       folderUid: 0,
//       label: "New note",
//       body: req.body.body,
//       create: Date.now().toString(),
//       icon: ""
//     }
//     if (req.body.name) {
//       newNote.label = req.body.name
//     }

//     db.notes.push(newNote)
//     fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
//     res.status(200).send(db.notes)
//   } else {
//     res.send(400)
//   }



// })

// app.delete('/notes/:id', (req, res) => {

//   const note = db.notes.find(note => note.uid === Number(req.params.id))
//   if (note) {
//     const index = db.notes.indexOf(note)
//     db.notes.splice(index, 1);
//     fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
//     res.status(200).send(db.notes)

//   } else {
//     res.send(404)
//   }

// })

app.put('/notes', (req, res) => {

  db.notes = req.body
  fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] PUT /notes`)
  res.status(200).send(db.notes)
})



// app.get('/folders', (req, res) => {
//   // #swagger.description = 'Get all active folders.'
//   /* #swagger.responses[200] = {
//            description: 'Get all folders.',
//            schema: { $ref: '#/definitions/Folders' }
//    } */

//   res.send(db.folders)

// })



const removeSlash = (input: string): string => {
  return input.replace(/"/gi, "\"")
}


app.get('/badges', (req, res) => {
  // #swagger.description = 'Get all active badges'
  /* #swagger.responses[200] = {
           description: 'Get all badges.',
           schema: { $ref: '#/definitions/Badges' }
   } */
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] GET /badges`)
  res.send(db.badges)

})

app.get('/badges/:id', (req, res) => {
  /* #swagger.responses[200] = {
           description: 'Get a specific badge.',
           schema: { $ref: '#/definitions/Badge' }
   } */

  const badge = db.badges.find(badge => badge.id === Number(req.params.id))
  if (badge) {
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] GET /badges/${req.params.id}`)
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
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] POST /badges`)
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
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] DELETE /badges/${req.params.id}`)
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
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] PUT /badges/${req.params.id}`)
  } else {
    res.send(404)
  }

})


app.get('/settings', (req, res) => {
  // #swagger.description = 'Get all settings'
  /* #swagger.responses[200] = {
           description: 'Get all settings.',
           schema: { $ref: '#/definitions/Settings' }
   } */
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] GET /settings`)
  res.send(db.settings)

})
app.post('/settings/vacations', (req, res) => {

  if (req.body.id && req.body.start && req.body.end) {
    const newVacation: VacationType = {
      "id": req.body.id,
      "start": req.body.start,
      "end": req.body.end
    }
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] POST /settings/vacations`)
    db.settings.date.vacations.push(newVacation)
    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(db.settings)
  } else {
    res.send(400)
  }
})
app.post('/settings/holidays', (req, res) => {

  if (req.body.id && req.body.day) {
    const newHoliday: HolidayType = {
      "id": req.body.id,
      "day": req.body.day
    }
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] POST /settings/holidays`)
    db.settings.date.holidays.push(newHoliday)
    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(db.settings)
  } else {
    res.send(400)
  }
})

app.delete('/settings/holidays/:id', (req, res) => {

  const holiday = db.settings.date.holidays.find(holiday => holiday.id === Number(req.params.id))
  if (holiday) {
    const index = db.settings.date.holidays.indexOf(holiday)
    db.settings.date.holidays.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(db.settings)
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] DELETE /settings/holidays/${req.params.id}`)
  } else {
    res.send(404)
  }

})

app.delete('/settings/vacations/:id', (req, res) => {

  const vacation = db.settings.date.vacations.find(vacation => vacation.id === Number(req.params.id))
  if (vacation) {
    const index = db.settings.date.vacations.indexOf(vacation)
    db.settings.date.vacations.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
    res.status(200).send(db.settings)
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] DELETE /settings/vacations/${req.params.id}`)
  } else {
    res.send(404)
  }

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})