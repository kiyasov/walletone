# walletone
Оплата услуг через walletone OpenApi



## Нужно отключить SMS-подтверждение https://www.walletone.com/wallet/client/#/settings/security

## Пример оплаты :


`type` - Поставщик услуг.

 ### Список игр:

 Steam => steam
 World of Tanks/World of Warplanes => `wot`
 World of Warships => `wow`
 Танки Онлайн => `tankionline`
 Warface => `warface`

 ### Другое:

 Вконтакте:
 
 
`user` - Ник или E-mail пользователя. 
Требуемые данные можно посмотреть [тут](https://www.walletone.com/wallet/client/#/payment).

`sum` - Сумма.



 ```javascript
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
```


