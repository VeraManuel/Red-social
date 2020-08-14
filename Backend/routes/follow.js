'use strict'

var express = require('express');
var followController = require('../controllers/follow');

var md_auth = require('../middlewares/authentication');
var api = express.Router();

api.post('/follow', md_auth.ensureAuth, followController.saveFollow);
api.delete('/follow/:id', md_auth.ensureAuth, followController.deleteFollow);
api.get('/following/:id?/:page?', md_auth.ensureAuth, followController.getFollowingUsers);
api.get('/followed/:id?/:page?', md_auth.ensureAuth, followController.getFollowedUsers);
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, followController.getMyFollows);

module.exports = api;