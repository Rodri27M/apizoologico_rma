const express = require('express')
const app = express()
const port = 3000
// '/' viene siendo la ruta
// el get viene siendo el verbo http 
// req es la solicitud y el res es la respuesta 
app.get('/',(req,res) => {
    res.send('hola mundo, que mas?')
});

app.listen(port, () => {
   console.log('La aplicacón se está ejecutando por el puerto ' + port)
});