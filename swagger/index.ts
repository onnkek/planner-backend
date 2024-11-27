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
      id: '1',
      text: 'test',
      done: false
    },
    // модель массива задач
    Tasks: [
      {
        // ссылка на модель задачи
        $ref: '#/definitions/Todo'
      }
    ],
    // модель задачи
    Badge: {
      id: '1',
      text: 'test',
      done: false
    },
    // модель массива задач
    Badges: [
      {
        // ссылка на модель задачи
        $ref: '#/definitions/Todo'
      }
    ],
    // модель задачи
    Note: {
      id: '1',
      text: 'test',
      done: false
    },
    // модель массива задач
    Notes: [
      {
        // ссылка на модель задачи
        $ref: '#/definitions/Todo'
      }
    ],
    // // модель объекта с текстом новой задачи
    // Text: {
    //   text: 'test'
    // },
    // // модель объекта с изменениями существующей задачи
    // Changes: {
    //   changes: {
    //     text: 'test',
    //     done: true
    //   }
    // }
  },
  host: 'localhost:8000',
  schemes: ['http']
}

const outputFile = './output.json';
const routes = ['../src/index.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);