'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = _request2.default.defaults({
    headers: {
        'Content-Type': 'application/vnd.wallet.openapi.v1+json',
        'Accept': 'application/vnd.wallet.openapi.v1+json'
    },
    json: true
});

var Wallet = function () {
    function Wallet(data) {
        _classCallCheck(this, Wallet);

        this.login = data.login;
        this.password = data.password.trim().replace(/\s|\(|\)|\+/g, '');
        this.merchant = {
            APP_TOKEN: '54344285-82DA-42EA-B7D0-0C9B978FFD89',
            SESSION_COOKIE: 'w1merchant:SessionKey',
            LAST_LOGIN_COOKIE: 'w1merchant:LastLogin',
            OWNER_SESSION_COOKIE: 'w1merchant:OwnerSessionKey',
            LOGIN_USER_ID_COOKIE: 'w1merchant:LoginUserId'
        };
    }

    _createClass(Wallet, [{
        key: 'getId',
        value: function getId(type, user, sum) {
            if (type === 'wot') {
                return {
                    providerId: 'warg',
                    data: {
                        "FormId": "Index",
                        "Params": [{ "FieldId": "Email", "Value": user }, { "FieldId": "account", "Value": "26" }, { "FieldId": "Amount", "Value": sum }]
                    }
                };
            } else if (type === 'wow') {
                return {
                    providerId: 'warg',
                    data: {
                        "FormId": "Index",
                        "Params": [{ "FieldId": "Email", "Value": user }, { "FieldId": "account", "Value": "1959" }, { "FieldId": "Amount", "Value": sum }]
                    }
                };
            } else if (type === 'tankionline') {
                return {
                    providerId: 'xs20',
                    data: {
                        "FormId": "Index",
                        "Params": [{ "FieldId": "v1", "Value": user }, { "FieldId": "Amount", "Value": sum }]
                    }
                };
            } else if (type === 'tankionline_kz') {
                return {
                    providerId: 'k031',
                    data: {
                        "FormId": "Index",
                        "Params": [{ "FieldId": "account", "Value": user }, { "FieldId": "Amount", "Value": sum }]
                    }
                };
            } else if (type === 'wafe' || type === 'wthu') {
                return {
                    providerId: type,
                    data: {
                        "FormId": "Index",
                        "Params": [{ "FieldId": "account", "Value": user }, { "FieldId": "Amount", "Value": sum }]
                    }
                };
            } else if (type === 'steam') {
                return {
                    providerId: 'xs52',
                    data: {
                        "FormId": "Index",
                        "Params": [{ "FieldId": "v1", "Value": user }, { "FieldId": "Amount", "Value": sum }]
                    }
                };
            } else if (type === 'vkru' || type === 'gmmn') {
                return {
                    providerId: type,
                    data: {
                        "FormId": "Index",
                        "Params": [{ "FieldId": "id", "Value": user }, { "FieldId": "Amount", "Value": sum }]
                    }
                };
            }
        }
    }, {
        key: 'getToken',
        value: function getToken(callback) {
            request.post({
                url: 'https://www.walletone.com/OpenApi/sessions',
                headers: {
                    'Authorization': 'Bearer ' + this.merchant.APP_TOKEN
                },
                body: { 'Login': this.login, 'Password': this.password, 'Scope': 'All' }
            }, this.processResponse(callback));
        }
    }, {
        key: 'checkPayment',
        value: function checkPayment(PaymentId) {
            var that = this;
            return new Promise(function (resolve, reject) {
                check();

                function check() {

                    that.getToken(function (err, data) {
                        if (err) {
                            return reject(err);
                        }

                        request({
                            url: 'https://www.walletone.com/OpenApi/payments/' + PaymentId,
                            headers: {
                                'Authorization': 'Bearer ' + data.Token
                            }
                        }, function (err, response, body) {

                            if (err) {
                                return reject(err);
                            }

                            if (body.State === undefined) {
                                return reject(body);
                            }

                            switch (body.State.StateId) {
                                case 'CheckError':
                                    {
                                        return reject({ ErrorMessage: body.ErrorMessage, ErrorCode: body.ErrorCode });
                                    }
                                case 'ProcessError':
                                    {
                                        return reject({ ErrorMessage: body.ErrorMessage, ErrorCode: body.ErrorCode });
                                    }
                                case 'Paid':
                                    {
                                        return resolve(body);
                                    }
                                default:
                                    {
                                        setTimeout(function () {
                                            check();
                                        }, 1000);
                                    }
                            }
                        });
                    });
                }
            });
        }
    }, {
        key: 'processPayment',
        value: function processPayment(option, callback) {
            var _this = this;

            this.getToken(function (err, data) {
                if (err) {
                    return callback(err);
                }
                request.put({
                    url: 'https://www.walletone.com/OpenApi/payments/' + option.PaymentId,
                    headers: {
                        'Authorization': 'Bearer ' + data.Token
                    },
                    body: { 'FormId': '$Final' }
                }, function (err, request, body) {
                    if (err) {
                        return callback(err);
                    }

                    if (body.Error !== undefined) {
                        return callback(body);
                    }

                    _this.checkPayment(option.PaymentId).then(function (data) {
                        callback(null, data);
                    }, function (err) {
                        callback(err);
                    });
                });
            });
        }
    }, {
        key: 'requestPayment',
        value: function requestPayment(option, callback) {
            var _this2 = this;

            var info = this.getId(option.type, option.user, option.sum);
            this.getToken(function (err, data) {
                if (err) {
                    return callback(err);
                }

                request.put({
                    url: 'https://www.walletone.com/OpenApi/payments/?providerId=' + info.providerId,
                    headers: {
                        'Authorization': 'Bearer ' + data.Token
                    },
                    body: info.data
                }, _this2.processResponse(callback));
            });
        }
    }, {
        key: 'balanceInfo',
        value: function balanceInfo(callback) {
            var _this3 = this;

            this.getToken(function (err, data) {
                if (err) {
                    return callback(err);
                }
                request({
                    url: 'https://www.walletone.com/OpenApi/balance',
                    headers: {
                        'Authorization': 'Bearer ' + data.Token
                    }
                }, _this3.processResponse(callback));
            });
        }
    }, {
        key: 'notificationsInfo',
        value: function notificationsInfo() {
            var _this4 = this;

            var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { pageNumber: 1, itemsPerPage: 10 };
            var callback = arguments[1];

            this.getToken(function (err, data) {
                if (err) {
                    return callback(err);
                }
                request({
                    url: 'https://www.walletone.com/OpenApi/notifications?pageNumber=' + option.pageNumber + '&itemsPerPage=' + option.pageNumber + '&formattingLevel=Full',
                    headers: {
                        'Authorization': 'Bearer ' + data.Token
                    }
                }, _this4.processResponse(callback));
            });
        }
    }, {
        key: 'limitsInfo',
        value: function limitsInfo(callback) {
            var _this5 = this;

            this.getToken(function (err, data) {
                if (err) {
                    return callback(err);
                }
                request({
                    url: 'https://www.walletone.com/OpenApi/limits',
                    headers: {
                        'Authorization': 'Bearer ' + data.Token
                    }
                }, _this5.processResponse(callback));
            });
        }
    }, {
        key: 'providersInfo',
        value: function providersInfo(page, itemsPerPage, searchString, callback) {
            var _this6 = this;

            this.getToken(function (err, data) {
                if (err) {
                    return callback(err);
                }
                request({
                    url: 'https://api.w1.ru/OpenApi/providers?page=' + page + '&itemsPerPage=' + itemsPerPage + '&searchString=' + searchString,
                    headers: {
                        'Authorization': 'Bearer ' + data.Token
                    }
                }, _this6.processResponse(callback));
            });
        }
    }, {
        key: 'accountInfo',
        value: function accountInfo(callback) {
            var _this7 = this;

            this.getToken(function (err, data) {
                if (err) {
                    return callback(err);
                }
                request({
                    url: 'https://www.walletone.com/OpenApi/profile?userId=' + data.UserId,
                    headers: {
                        'Authorization': 'Bearer ' + data.Token
                    }
                }, _this7.processResponse(callback));
            });
        }
    }, {
        key: 'processResponse',
        value: function processResponse(callback) {
            return function httpCallback(error, response, body) {
                if (error) {
                    return callback(error);
                }

                if (body.Error !== undefined) {
                    return callback(body);
                }

                switch (response.statusCode) {
                    case 400:
                        callback(body);
                        break;
                    case 401:
                        callback(body);
                        break;
                    case 403:
                        callback(body);
                        break;
                    default:
                        callback(null, body, response);
                }
            };
        }
    }]);

    return Wallet;
}();

exports.default = Wallet;