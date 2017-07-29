'use strict';

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = new _index2.default({
    login: '',
    password: ''
});

api.requestPayment({ type: 'tankionline', user: 'islam7407@gmail.com', sum: '10' }, function (err, data) {

    if (err) {
        return console.error(err);
    }

    api.processPayment({
        "PaymentId": data.PaymentId
    }, processComplete);
});

var processComplete = function processComplete(err, data) {

    if (err) {
        return console.error(err);
    }

    console.log(data);
};