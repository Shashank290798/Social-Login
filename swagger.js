const swaggerAutogen = require('swagger-autogen')()


const doc = {
    info: {
        title: 'Lp Investment API Documentation',
        description: 'Description'
    },
    host: 'localhost:5000/api/v1'
};

const outputFile = './swagger-output.json'
const routes = ['./router', './routes/auth.js'];

swaggerAutogen(outputFile, routes, doc).then(() => {
    require('./app').default; //compliant
}).catch((err) => {
    throw new Error(err)
})
