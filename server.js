'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routers/apiRouter').router;
const cors = require('cors');

const server = express();

server.use(cors());

const models = require('./models');
// const { urlencoded } = require('body-parser');

// const admin = models.admin.build({
//     fname: "Josue",
//     lname: "Ushindi",
//     phone: "+243900000000",
//     email: "josueushindi@gmail.com",
//     password: "654321",
//     isActive: true
// });

// for save...
// admin.save().then(function(newAdmin) {
//     console.log(newAdmin);
// });

// fetch a particular task (filter) ...
// models.admin.findOne({
//     where: {
//         fname: "Josue",
//     }
// }).then(function(admin) {
//     console.log(admin);
// })

// plan find one method without filter ...
// models.admin.findOne().then(function(admin) {
//     console.log(admin);
// });


// delete one admin ...
// models.admin.destroy({
//     where: {
//         id: 2
//     }
// }).then(function(deleted) {
//     console.log(deleted);
// });

// plan find all method without filter ...
// models.admin.findAll({
//     where: {
//         fname: "Vianney",
//         password: "123456"
//     }
// }).then(function(admin) {
//     console.log(admin);
// });

// body-parser config ...
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// configer routes ...
server.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>The server is running</h1>');
});
server.use('/api/v1/', apiRouter);

// launch server ...
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Server running at: localhost:' + port);
})