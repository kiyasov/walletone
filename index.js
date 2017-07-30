import r from 'request';

const request = r.defaults({
    headers: {
        'Content-Type': 'application/vnd.wallet.openapi.v1+json',
        'Accept': 'application/vnd.wallet.openapi.v1+json'
    },
    json: true
});

export default class Wallet {
    constructor(data) {
        this.login = data.login;
        this.password = data.password.trim().replace(/\s|\(|\)|\+/g, '');
        this.merchant = {
            APP_TOKEN: '54344285-82DA-42EA-B7D0-0C9B978FFD89',
            SESSION_COOKIE: 'w1merchant:SessionKey',
            LAST_LOGIN_COOKIE: 'w1merchant:LastLogin',
            OWNER_SESSION_COOKIE: 'w1merchant:OwnerSessionKey',
            LOGIN_USER_ID_COOKIE: 'w1merchant:LoginUserId'
        }
    }

    getId(type, user, sum) {
        if (type === 'wot') {
            return {
                providerId: 'warg',
                data: {
                    "FormId": "Index",
                    "Params": [
                        { "FieldId": "Email", "Value": user },
                        { "FieldId": "account", "Value": "26" },
                        { "FieldId": "Amount", "Value": sum }
                    ]
                }
            };
        } else if (type === 'wow') {
            return {
                providerId: 'warg',
                data: {
                    "FormId": "Index",
                    "Params": [
                        { "FieldId": "Email", "Value": user },
                        { "FieldId": "account", "Value": "1959" },
                        { "FieldId": "Amount", "Value": sum }
                    ]
                }
            };
        } else if (type === 'tankionline') {
            return {
                providerId: 'xs20',
                data: {
                    "FormId": "Index",
                    "Params": [
                        { "FieldId": "v1", "Value": user },
                        { "FieldId": "Amount", "Value": sum }
                    ]
                }
            };
        } else if (type === 'wafe' || type === 'wthu') {
            return {
                providerId: type,
                data: {
                    "FormId": "Index",
                    "Params": [
                        { "FieldId": "account", "Value": user },
                        { "FieldId": "Amount", "Value": sum }
                    ]
                }
            };
        } else if (type === 'steam') {
            return {
                providerId: 'xs52',
                data: {
                    "FormId": "Index",
                    "Params": [
                        { "FieldId": "v1", "Value": user },
                        { "FieldId": "Amount", "Value": sum }
                    ]
                }
            };
        } else if (type === 'vkru' || type === 'gmmn') {
            return {
                providerId: type,
                data: {
                    "FormId": "Index",
                    "Params": [
                        { "FieldId": "id", "Value": user },
                        { "FieldId": "Amount", "Value": sum }
                    ]
                }
            };
        }
    }

    getToken(callback) {
        request.post({
            url: 'https://www.walletone.com/OpenApi/sessions',
            headers: {
                'Authorization': 'Bearer ' + this.merchant.APP_TOKEN
            },
            body: { 'Login': this.login, 'Password': this.password, 'Scope': 'All' }
        }, this.processResponse(callback));
    }

    checkPayment(PaymentId) {
        let that = this;
        return new Promise((resolve, reject) => {
            check();

            function check() {

                that.getToken((err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    request({
                        url: `https://www.walletone.com/OpenApi/payments/${PaymentId}`,
                        headers: {
                            'Authorization': 'Bearer ' + data.Token
                        },
                    }, (err, response, body) => {

                        if (err) {
                            return reject(err);
                        }

                        if (body.State === undefined) {
                            return reject(body);
                        }

                        switch (body.State.StateId) {
                            case 'CheckError' : {
                                return reject({ ErrorMessage: body.ErrorMessage, ErrorCode: body.ErrorCode });
                            }
                            case 'ProcessError' : {
                                return reject({ ErrorMessage: body.ErrorMessage, ErrorCode: body.ErrorCode });
                            }
                            case 'Paid' : {
                                return resolve(body);
                            }
                            default : {
                                setTimeout(() => {
                                    check();
                                }, 1000);
                            }
                        }

                    });

                });
            }

        });
    }

    processPayment(option, callback) {
        this.getToken((err, data) => {
            if (err) {
                return callback(err);
            }
            request.put({
                url: `https://www.walletone.com/OpenApi/payments/${option.PaymentId}`,
                headers: {
                    'Authorization': 'Bearer ' + data.Token
                },
                body: { 'FormId': '$Final' }
            }, (err, request, body) => {
                if (err) {
                    return callback(err);
                }

                if (body.Error !== undefined) {
                    return callback(body);
                }

                this.checkPayment(option.PaymentId).then(data => {
                    callback(null, data);
                }, err => {
                    callback(err);
                })
            });
        });
    }

    requestPayment(option, callback) {
        let info = this.getId(option.type, option.user, option.sum);
        this.getToken((err, data) => {
            if (err) {
                return callback(err);
            }

            request.put({
                url: `https://www.walletone.com/OpenApi/payments/?providerId=${info.providerId}`,
                headers: {
                    'Authorization': 'Bearer ' + data.Token
                },
                body: info.data
            }, this.processResponse(callback));
        });
    }

    balanceInfo(callback) {
        this.getToken((err, data) => {
            if (err) {
                return callback(err);
            }
            request({
                url: `https://www.walletone.com/OpenApi/balance`,
                headers: {
                    'Authorization': 'Bearer ' + data.Token
                }
            }, this.processResponse(callback));
        });
    }

    notificationsInfo(option = { pageNumber: 1, itemsPerPage: 10 }, callback) {
        this.getToken((err, data) => {
            if (err) {
                return callback(err);
            }
            request({
                url: `https://www.walletone.com/OpenApi/notifications?pageNumber=${option.pageNumber}&itemsPerPage=${option.pageNumber}&formattingLevel=Full`,
                headers: {
                    'Authorization': 'Bearer ' + data.Token
                }
            }, this.processResponse(callback));
        });
    }

    limitsInfo(callback) {
        this.getToken((err, data) => {
            if (err) {
                return callback(err);
            }
            request({
                url: `https://www.walletone.com/OpenApi/limits`,
                headers: {
                    'Authorization': 'Bearer ' + data.Token
                }
            }, this.processResponse(callback));
        });
    }

    accountInfo(callback) {
        this.getToken((err, data) => {
            if (err) {
                return callback(err);
            }
            request({
                url: `https://www.walletone.com/OpenApi/profile?userId=${data.UserId}`,
                headers: {
                    'Authorization': 'Bearer ' + data.Token
                }
            }, this.processResponse(callback));
        });
    }

    processResponse(callback) {
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

}

