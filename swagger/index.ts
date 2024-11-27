const swaggerAutogen = require('swagger-autogen')();

const doc = {
  // общая информация
  info: {
    title: 'Planner API',
    description: 'This API is interface for interaction with tasks, badges and notes for planner'
  },
  // что-то типа моделей
  definitions: {
    // модель задачи
    Task: {
      "id": 34,
      "body": "123",
      "create": "1690207761767",
      "remove": "",
      "timeleft": "",
      "deadline": "",
      "link": "",
      "visible": false,
      "badges": []
    },
    // модель массива задач
    Tasks: [
      {
        // ссылка на модель задачи
        $ref: '#/definitions/Task'
      }
    ],
    // модель задачи
    Badge: {
      "id": 3,
      "color": 2,
      "text": "Пробую сделать"
    },
    // модель массива задач
    Badges: [
      {
        // ссылка на модель задачи
        $ref: '#/definitions/Badge'
      }
    ],
    // модель задачи
    Note: {
      "id": 1,
      "body": "<h1>Тут будет HTML текст заметки</h1>",
      "create": "1690207761767",
      "visible": true
    },
    // модель массива задач
    Notes: [
      {
        // ссылка на модель задачи
        $ref: '#/definitions/Note'
      }
    ]
  },
  host: 'localhost:8000',
  schemes: ['http']
}

const outputFile = './output.json';
const routes = ['../src/index.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);