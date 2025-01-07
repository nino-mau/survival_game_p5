/** Import express */
const express = require('express');

const app = express();

/** Serve static files to server */
app.use(express.static('public'));

/** Set responses */
app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
});
  
app.use((req, res, next) => {
    res.status(201);
    next();
});
  
app.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
    next();
});
  
app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
});
  
/** Export app object to be used in server.js */
module.exports = app;

