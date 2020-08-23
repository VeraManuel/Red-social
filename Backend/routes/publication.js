'use strict'

var express = require('express');
var publicationController = require('../controllers/publication');

var md_auth = require('../middlewares/authentication');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/publications'});

var api = express.Router();

api.post('/publication', md_auth.ensureAuth, publicationController.savePublication);
api.get('/publications/:page?', md_auth.ensureAuth, publicationController.getPublications);
api.get('/publications-user/:user/:page?', md_auth.ensureAuth, publicationController.getPublicationsUser);
api.get('/publication/:id', md_auth.ensureAuth, publicationController.getPublication);
api.delete('/publication/:id', md_auth.ensureAuth, publicationController.deletePublication);
api.post('/upload-image-pub/:id', [md_auth.ensureAuth, md_upload], publicationController.uploadImage);
api.get('/get-image-pub/:imageFile', publicationController.getImageFile);


module.exports = api;