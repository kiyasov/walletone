import walletone from '../index'

const api = new walletone({
    login: '',
    password: ''
});

api.balanceInfo((err, data) => {
    if (err) {
        console.error(`Баланс ${err}`);
    } else {

        console.log(data);

        api.requestPayment({ type: 'wot', user: 'islam7407@gmail.com', sum: '10' }, (err, data) => {

            if (err) {
                return console.error(err);
            }

            console.log(data.PaymentId);

            api.processPayment({
                "PaymentId": data.PaymentId
            }, processComplete);

        });

    }

});

const processComplete = (err, data) => {

    if (err) {
        return console.error(err); // Вывод всех ошибок
    }

    console.log(data); // Вывод только при успешной оплате

};

