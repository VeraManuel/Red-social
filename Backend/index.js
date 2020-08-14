'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;


    //conexion database
mongoose.connect("mongodb://localhost:27017/red_social", {useNewUrlParser: true , useUnifiedTopology: true})
        .then(() => {
            console.log('La conexion se realizo con exito a la base de datos')

            //crear servidor
        
            app.listen(port, () => {
                console.log('Server online')
            });
        })
        .catch((err) => console.log(err));



