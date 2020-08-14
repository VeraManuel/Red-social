'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_para_poder_decodificar_jwt_en_el_curso_red_social';


exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        nickname: user.nickname,
        password: user.password,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment(30, 'days').unix
    };
    return jwt.encode(payload, secret)
};