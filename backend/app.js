/** Imports module */
const express = require('express');

const app = express();

const path = require('path');

/** Serve static files to server, use path.join for OS compatibility */
app.use(express.static(path.join(__dirname, '../public')));


/** Set responses/request/logs */
// app.use((req, res, next) => {
//     console.log('Requête reçue !');
//     next();
// });
  
// app.use((req, res, next) => {
//     res.status(201);
//     next();
// });
  
// app.use((req, res, next) => {
//     console.log('Réponse envoyée avec succès !');
// });
  
/** Export app object to be used in server.js */
module.exports = app;

