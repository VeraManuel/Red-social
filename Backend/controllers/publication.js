'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var Users = require('../models/user');
var Follow = require('../models/follow');
const publication = require('../models/publication');

function savePublication(req, res) {
    var params = req.body;

    if(!params.text) return res.status(200).send({message: 'Debes escribir un texto'});

    var publication = new Publication();

    publication.text = params.text;
    publication.user = req.user.sub;
    publication.file = null;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if(err) return res.status(500).send({message: 'Error al guardad la publicacion'});

        if(!publicationStored) return res.status(404).send({message: 'No se ha podido guardar la publicacion'});

        return res.status(200).send({ publication: publicationStored});
    });   
}

function getPublications(req,res) {
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
        if(err) return res.status(500).send({message: 'Error al obtener los seguidores'});

        var follows_clean = [];

            follows.forEach((follow) => {
                follows_clean.push(follow.followed);
            });
            follows_clean.push(req.user.sub);

            Publication.find({user: {'$in': follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications,total) =>{
                if(err) return res.status(500).send({message: 'Error al obtener las publicaciones'});

                if(!publications) return res.status(404).send({message: 'No sigues a ningun usuario'});

                return res.status(200).send({
                    total_items: total,
                    page: page,
                    items_per_page: itemsPerPage,
                    pages: Math.ceil(total/itemsPerPage),
                    publications
                });
            });
    });
}

function getPublicationsUser(req,res) {
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var user = req.user.sub;
    if(req.params.user){
        user = req.params.user;
    }

    var itemsPerPage = 4;
    

        Publication.find({user: user}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications,total) =>{
            if(err) return res.status(500).send({message: 'Error al obtener las publicaciones'});

            if(!publications) return res.status(404).send({message: 'No sigues a ningun usuario'});

            return res.status(200).send({
                total_items: total,
                page: page,
                items_per_page: itemsPerPage,
                pages: Math.ceil(total/itemsPerPage),
                publications
            });
    });
}

function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if(err) return res.status(500).send({message: 'Error al obtener la publicacion'});

        if(!publication) return res.status(404).send({message: 'No existe la publicacion'});

        return res.status(200).send({publication});
    });
}

function deletePublication(req,res) {
    var publicationId = req.params.id;

    Publication.find({'user': req.user.sub, '_id':publicationId}).deleteOne((err, publicationRemoved) => {
        if(err) return res.status(500).send({message: 'Error al borrar la publicacion'});

        if(!publicationRemoved) return res.status(404).send({message: 'No se ha podido eliminar la publicacion'});

        return res.status(200).send({message: 'La publicacion ha sido eliminada'});
    });
}

function uploadImage(req, res) {
    var publicationId = req.params.id;

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_path.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == "jpg" || file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'gif'){
            
            Publication.findOne({'user': req.user.sub, '_id': publicationId}).exec((err, publication) => {
                
                if(publication){

                    Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdate)=>{
                        if(err) return res.status(500).send({message: 'Error en la peticion'});
        
                        if(!publicationUpdate) return res.status(404).send({message: 'No se ha podido actualizar la imagen de la publicacion'});
        
                        return res.status(200).send({publication: publicationUpdate});
                    });
                }else{
                    return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicacion');
                };
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
    var path_file = './uploads/publications/'+image_file;

    fs.exists(path_file, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(path_file));
        }else{
            return res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) =>{
        res.status(200).send({message: message});
    });
}

module.exports = {
    savePublication,
    getPublications,
    getPublication,
    getPublicationsUser,
    deletePublication,
    uploadImage,
    getImageFile    
}