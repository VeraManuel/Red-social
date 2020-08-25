'use strict'

var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');



/** 
* registra usuarios nuevos
* comprueba que email y nickname no este duplicados en otro usuario
* cifra password
* guarda usuario en la bbdd
**/
function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.lastname && params.nickname &&
        params.email && params.password) {

        user.name = params.name;
        user.lastname = params.lastname;
        user.nickname = params.nickname;
        user.email = params.email;
        user.role = "ROLE_USER";
        user.image = null;

        User.find({ $or: [
            {email: user.email.toLowerCase()},
            {nickname: user.nickname.toLowerCase()}
        ]}).exec((err, users)=> {
            if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

            if(users && users.length >= 1) {
                return res.status(200).send({message: 'El usuario que intentas registrar ya existe'});
            }else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    
                    user.save((err, userStored)=> {
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'});
    
                        if(userStored){
                            return res.status(200).send({user: userStored});
                        }else{
                            return res.status(404).send({message: 'No se ha registrado el usuario'});
                        }                 
                    });
                });
            }
        });            

    }else{
        res.status(200).send({message: "Todos los campos son requeridos"});
    }

}

function login (req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err, user) => {
        if(err) return res.status(500).send({message: "Error en la peticion"});

        if(user) {
            bcrypt.compare(password , user.password, (err, check) => {
                if (check){

                    if(params.gettoken){
                        //generar y devolver token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }else{
                        user.password = undefined;
                        return res.status(200).send({user})
                    }

                }else{
                    return res.status(404).send({message: "El password del usuario no se ha podido identificar"});
                }
            });
        }else{
            return res.status(404).send({message: "El email del usuario no se ha podido identificar!!"})
        }
    });
}

function getUser(req, res) {
    var userId = req.params.id;
  
    User.findById(userId, (err, user) => {
        if (!user) return res.status(404).send({message: 'No se encontro el usuario'});
        if (err) return res.status(500).send({message: "Error en la peticion"});
  
        followThisUser(req.user.sub, userId).then((value) => {
            user.password = undefined;

            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });
        });
    });
 }
  
 async function followThisUser(identity_user_id, user_id) {
    var following = await Follow.findOne({ user: identity_user_id, followed: user_id }).exec()
        .then((following) => {
            return following;
        })
        .catch((err) => {
            return handleError(err);
        });
    var followed = await Follow.findOne({ user: user_id, followed: identity_user_id }).exec()
        .then((followed) => {
            return followed;
        })
        .catch((err) => {
            return handleError(err);
        });
  
    return {
        following: following,
        followed: followed
    };
 }

//conseguir datos de usuarios paginados
function getUsers(req,res){
    var user_id = req.user.sub;
     
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;
     
    User.find().sort('_id').paginate(page,itemsPerPage,(err,users,total)=>{
        if(err) return res.status(500).send({message:"Error en la peticion",err});
        if(!users) return res.status(404).send({message:"No hay Usuarios"});
     
        followUserIds(user_id).then((value)=>{
            return res.status(200).send({
                users,
                users_following: value.following,
                users_followed: value.followed,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });
        });
    });
}

async function followUserIds(user_id){
     
    var following = await Follow.find({'user':user_id}).select({'_id':0,'__v':0,'user':0}).exec()
        .then((follows) => {
            return follows;
        })
        .catch((err) => {
            return handleError(err);
        });
    var followed = await Follow.find({'followed':user_id}).select({'_id':0,'__v':0,'followed':0}).exec()
        .then((follows) => {
            return follows;
        })
        .catch((err) => {
            return handleError(err);
        });
     
    var following_clean = [];
     
    following.forEach((follow)=>{
        following_clean.push(follow.followed);
    });

    var followed_clean = [];
     
    followed.forEach((follow)=>{
        followed_clean.push(follow.user);
    });
    
    return {
        following: following_clean,
        followed:followed_clean
    }
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos para actualizar este usuario'});
    }

    User.find({ $or:[
        {email: update.email.toLowerCase()},
        {nickname: update.nickname.toLowerCase()}
    ]}).exec((err, users)=> {

        var user_isset = false;
        users.forEach((user) => {
            if(user && user._id != userId) user_isset = true;
        });

        if(user_isset) return res.status(404).send({message: 'Los datos ya estan en uso'});
        
        User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdate) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
    
            if(!userUpdate) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
    
            return res.status(200).send({userUpdate});
        });
    });
} 

function uploadImage(req, res) {
    var userId = req.params.id;

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_path.split('\.');
        var file_ext = ext_split[1];

        if(userId != req.user.sub){
            return removeFilesOfUploads(res, file_path, 'No tienes permisos para actualizar datos del usuario');
        }

        if(file_ext == "jpg" || file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'gif'){

            User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdate)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion'});

                if(!userUpdate) return res.status(404).send({message: 'No se ha podido actualizar la imagen del usuario'});

                return res.status(200).send({user: userUpdate});
            });
        }else{
            return removeFilesOfUploads(res, file_path, 'La extension no es valida')
        }
    }else{
        return res.status(200).send({message: 'No se ha subido la imagen'});
    }
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/'+image_file;

    fs.exists(path_file, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(path_file));
        }else{
            return res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

// Elimina imagen si el usuario no tiene permiso o la ext no es correcta
function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) =>{
        res.status(200).send({message: message});
    });
}

function getCounters(req, res){
    var userId = req.user.sub;

    if(req.params.id){
        userId = req.params.id;
    }

    getCountfollow(userId).then((value) => {
        return res.status(200).send(value);
    });
}

async function getCountfollow(user_id){
    var following = await Follow.countDocuments({'user':user_id}).exec()
        .then((count) => {
            return count;
        })
        .catch((err) => {
            return handleError(err);
        });
    var followed = await Follow.countDocuments({'followed':user_id}).exec()
        .then((count) => {
            return count;
        })
        .catch((err) => {
            return handleError(err);
        });
    
    var publications = await Publication.countDocuments({'user':user_id}).exec()
        .then((count) => {
            return count;
        })
        .catch((err) => {
            return handleError(err);
        });

        return {
            following: following,
            followed: followed,
            publications: publications
        }

} 



module.exports = {
    saveUser,
    login,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters
}