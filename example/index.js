import walletone from '../index'

const api = new walletone({
    login: '',
    password: ''
});

api.requestPayment({ type: 'tankionline', user: 'islam7407@gmail.com', sum: '10' }, (err, data) => {

    if (err) {
        return console.error(err);
    }

    api.processPayment({
        "PaymentId": data.PaymentId
    }, processComplete);

});

const processComplete = (err, data) => {

    if (err) {
        return console.error(err);
    }

    console.log(data);

};