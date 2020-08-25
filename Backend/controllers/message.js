'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');


function saveMessage(req, res) {
    var params = req.body;

    if(!params.text || !params.receiver) return res.status(200).send({message: 'Introduce un texto y receptor para continuar'});

    var message = new Message();
    message.text = params.text;
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err, messageStored) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!messageStored) return res.status(404).send({message: 'No se ha podido enviar el mensage'});

        return res.status(200).send({message: messageStored});
    });
}

function getReceiverMesssages(req, res) {
    var userId = req.user.sub;
    var page = 1;
    if(req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({receiver: userId}).sort('-created_at').populate('emitter', 'name lastname image nickname _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!messages) return res.status(404).send({message: 'No hay mensajes que mostrar'});

        return res.status(200).send({
           total: total,
           pages: Math.ceil(total/itemsPerPage),
           messages 
        });
    });
}

function getEmitterMessages(req, res) {
    var userId = req.user.sub;
    var page = 1;

    if(req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({emitter: userId}).sort('-created_at').populate('emitter receiver', 'name lastname image nickname _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({messages: 'Error en la peticion'});
        if(!messages) return res.status(404).send({messages: 'No hay mensajes que mostrar'});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

function getUnviewedMessages(req, res) {
    var userId = req.user.sub;

    Message.countDocuments({receiver:userId, viewed:'false'}).exec((err, count) =>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        return res.status(200).send({
            'unviewed': count,
        });
    });
}

function setViewedMessages(req, res) {
    var userId = req.user.sub;

    Message.updateMany({receiver:userId}, {viewed:'true'}, {'multi':true}, (err, messagesUpdate) => {
        if(err) return res.status(200).send({message: 'Error en la peticion'});

        return res.status(200).send({
            message: messagesUpdate,
        });
    });
}

module.exports = {
    saveMessage,
    getReceiverMesssages,
    getEmitterMessages,
    getUnviewedMessages,
    setViewedMessages
};