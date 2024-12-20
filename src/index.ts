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

interface WorkingType {
  id: number,
  day: string
}

interface HolidayType {
  id: number,
  day: string
}

interface WeekendType {
  highlight: boolean
}

interface DateType {
  vacations: VacationType[]
  holidays: HolidayType[]
  workings: WorkingType[]
  weekend: WeekendType
}

interface SettingsType {
  date: DateType
}

interface DBNotesType {
  notes: FolderType
}
interface DBBadgesType {
  badges: BadgeType[]
}
interface DBTasksType {
  tasks: TaskType[]
}
interface DBSettingsType {
  settings: SettingsType
}
interface WidgetType {
  type: string
  position: { x: number, y: number }
}
interface DBWidgetsType {
  widgets: WidgetType[]
}

const app = express()

const port = 8000
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json').toString())


const tasksPath = 'db/tasks.json'
const notesPath = 'db/notes.json'
const badgesPath = 'db/badges.json'
const settingsPath = 'db/settings.json'
const widgetsPath = 'db/widgets.json'


const dbTasks: DBTasksType = JSON.parse(fs.readFileSync(path.resolve(__dirname, tasksPath), 'utf-8'))
const dbNotes: DBNotesType = JSON.parse(fs.readFileSync(path.resolve(__dirname, notesPath), 'utf-8'))
const dbBadges: DBBadgesType = JSON.parse(fs.readFileSync(path.resolve(__dirname, badgesPath), 'utf-8'))
const dbSettings: DBSettingsType = JSON.parse(fs.readFileSync(path.resolve(__dirname, settingsPath), 'utf-8'))
const dbWidgets: DBWidgetsType = JSON.parse(fs.readFileSync(path.resolve(__dirname, widgetsPath), 'utf-8'))

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
  res.send(dbTasks.tasks)
})

app.get('/tasks/:id', (req, res) => {
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] GET /tasks/${req.params.id}`)
  const task = dbTasks.tasks.find(task => task.id === Number(req.params.id))
  if (task) {
    res.send(task)
  } else {
    res.send(404)
  }


})

app.post('/tasks', (req, res) => {
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
    dbTasks.tasks.push(newTask)
    fs.writeFileSync(path.resolve(__dirname, tasksPath), JSON.stringify(dbTasks), 'utf-8')
    res.status(200).send(dbTasks)
  } else {
    res.send(400)
  }


})

app.delete('/tasks/:id', (req, res) => {

  const task = dbTasks.tasks.find(task => task.id === Number(req.params.id))
  if (task) {
    const index = dbTasks.tasks.indexOf(task)
    dbTasks.tasks.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, tasksPath), JSON.stringify(dbTasks), 'utf-8')
    res.status(200).send(dbTasks)
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] DELETE /tasks/${req.params.id}`)
  } else {
    res.send(404)
  }

})

app.put('/tasks/:id', (req, res) => {

  const task = dbTasks.tasks.find(task => task.id === Number(req.params.id))
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
    fs.writeFileSync(path.resolve(__dirname, tasksPath), JSON.stringify(dbTasks), 'utf-8')
    res.status(200).send(task)

  } else {
    res.send(404)
  }

})





app.get('/notes', (req, res) => {
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] GET /notes`)
  res.send(dbNotes.notes)

})

app.put('/notes', (req, res) => {

  dbNotes.notes = req.body
  fs.writeFileSync(path.resolve(__dirname, notesPath), JSON.stringify(dbNotes), 'utf-8')
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] PUT /notes`)
  res.status(200).send(dbNotes.notes)
})



app.get('/badges', (req, res) => {
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] GET /badges`)
  res.send(dbBadges.badges)
})

app.get('/badges/:id', (req, res) => {
  /* #swagger.responses[200] = {
           description: 'Get a specific badge.',
           schema: { $ref: '#/definitions/Badge' }
   } */

  const badge = dbBadges.badges.find(badge => badge.id === Number(req.params.id))
  if (badge) {
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] GET /badges/${req.params.id}`)
    res.send(badge)
  } else {
    res.send(404)
  }


})

app.post('/badges', (req, res) => {

  if (req.body.text) {
    const newBadge: BadgeType = {
      "id": Math.random(),
      "color": req.body.color,
      "text": req.body.text
    }
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] POST /badges`)
    dbBadges.badges.push(newBadge)
    fs.writeFileSync(path.resolve(__dirname, badgesPath), JSON.stringify(dbBadges), 'utf-8')
    res.status(200).send(dbBadges.badges)
  } else {
    res.send(400)
  }


})

app.delete('/badges/:id', (req, res) => {

  const badge = dbBadges.badges.find(badge => badge.id === Number(req.params.id))
  if (badge) {
    const index = dbBadges.badges.indexOf(badge)
    dbBadges.badges.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, badgesPath), JSON.stringify(dbBadges), 'utf-8')
    res.status(200).send(dbBadges.badges)
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] DELETE /badges/${req.params.id}`)
  } else {
    res.send(404)
  }

})

app.put('/badges/:id', (req, res) => {

  const badge = dbBadges.badges.find(badge => badge.id === Number(req.params.id))
  if (badge && (req.body.color || req.body.text)) {

    if (req.body.color) {
      badge.color = req.body.color
    }
    if (req.body.text) {
      badge.text = req.body.text
    }

    fs.writeFileSync(path.resolve(__dirname, badgesPath), JSON.stringify(dbBadges), 'utf-8')
    res.status(200).send(badge)
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] PUT /badges/${req.params.id}`)
  } else {
    res.send(404)
  }

})


app.get('/settings', (req, res) => {
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] GET /settings`)
  res.send(dbSettings.settings)
})

app.post('/settings/workings', (req, res) => {

  if (req.body.id && req.body.day) {
    const newWorking: WorkingType = {
      "id": req.body.id,
      "day": req.body.day
    }
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] POST /settings/workings`)
    dbSettings.settings.date.workings.push(newWorking)
    fs.writeFileSync(path.resolve(__dirname, settingsPath), JSON.stringify(dbSettings), 'utf-8')
    res.status(200).send(dbSettings.settings)
  } else {
    res.send(400)
  }
})

app.delete('/settings/workings/:id', (req, res) => {

  const working = dbSettings.settings.date.workings.find(working => working.id === Number(req.params.id))
  if (working) {
    const index = dbSettings.settings.date.workings.indexOf(working)
    dbSettings.settings.date.workings.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, settingsPath), JSON.stringify(dbSettings), 'utf-8')
    res.status(200).send(dbSettings.settings)
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] DELETE /settings/workings/${req.params.id}`)
  } else {
    res.send(404)
  }

})

app.put('/settings/weekend', (req, res) => {


  if (req.body) {
    dbSettings.settings.date.weekend = req.body
    fs.writeFileSync(path.resolve(__dirname, settingsPath), JSON.stringify(dbSettings), 'utf-8')
    res.status(200).send(dbSettings.settings)
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] PUT /settings/weekend`)
  } else {
    res.send(404)
  }

})

app.post('/settings/vacations', (req, res) => {

  if (req.body.id && req.body.start && req.body.end) {
    const newVacation: VacationType = {
      "id": req.body.id,
      "start": req.body.start,
      "end": req.body.end
    }
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] POST /settings/vacations`)
    dbSettings.settings.date.vacations.push(newVacation)
    fs.writeFileSync(path.resolve(__dirname, settingsPath), JSON.stringify(dbSettings), 'utf-8')
    res.status(200).send(dbSettings.settings)
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
    dbSettings.settings.date.holidays.push(newHoliday)
    fs.writeFileSync(path.resolve(__dirname, settingsPath), JSON.stringify(dbSettings), 'utf-8')
    res.status(200).send(dbSettings.settings)
  } else {
    res.send(400)
  }
})

app.delete('/settings/holidays/:id', (req, res) => {

  const holiday = dbSettings.settings.date.holidays.find(holiday => holiday.id === Number(req.params.id))
  if (holiday) {
    const index = dbSettings.settings.date.holidays.indexOf(holiday)
    dbSettings.settings.date.holidays.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, settingsPath), JSON.stringify(dbSettings), 'utf-8')
    res.status(200).send(dbSettings.settings)
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] DELETE /settings/holidays/${req.params.id}`)
  } else {
    res.send(404)
  }

})

app.delete('/settings/vacations/:id', (req, res) => {

  const vacation = dbSettings.settings.date.vacations.find(vacation => vacation.id === Number(req.params.id))
  if (vacation) {
    const index = dbSettings.settings.date.vacations.indexOf(vacation)
    dbSettings.settings.date.vacations.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, settingsPath), JSON.stringify(dbSettings), 'utf-8')
    res.status(200).send(dbSettings.settings)
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] DELETE /settings/vacations/${req.params.id}`)
  } else {
    res.send(404)
  }

})



app.get('/widgets', (req, res) => {
  console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] GET /widgets`)
  res.send(dbWidgets.widgets)
})

app.put('/widgets', (req, res) => {


  if (req.body) {
    dbWidgets.widgets = req.body
    fs.writeFileSync(path.resolve(__dirname, widgetsPath), JSON.stringify(dbWidgets), 'utf-8')
    res.status(200).send(dbWidgets.widgets)
    console.log(`[${new Date().toLocaleDateString("ru-RU", { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', year: 'numeric', month: 'numeric' })}][${req.hostname}] PUT /widgets`)
  } else {
    res.send(404)
  }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})