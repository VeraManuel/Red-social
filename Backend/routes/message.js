'use strict'

var express = require('express');
var messageController = require('../controllers/message');
var md_auth = require('../middlewares/authentication');
var api = express.Router();

api.post('/message', md_auth.ensureAuth, messageController.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, messageController.getReceiverMesssages);
api.get('/messages/:pag?', md_auth.ensureAuth, messageController.getEmmiteMessages);
api.get('/unviewed-messages', md_auth.ensureAuth, messageController.getUnviewedMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, messageController.setViewedMessages);


module.exports = api;