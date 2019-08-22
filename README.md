# walletone
Оплата услуг через walletone OpenApi



# Нужно отключить SMS-подтверждение https://www.walletone.com/wallet/client/#/settings/security

# Пример оплаты:

## Поставщики услуг:
 
 ### Список игр:

 * Steam === `steam`
 * War Thunder === `wthu`
 * World of Tanks/World of Warplanes === `wot`
 * World of Warships === `wow`
 * Танки Онлайн оплата в рублях === `tankionline`
 * Танки Онлайн оплата в тенге === `tankionline_kz`
 * Warface === `wafe`
 * GameMiner === `gmmn`

 ### Другое:

 Вконтакте === `vkru`
 
`type` - Поставщик услуг.

`user` - Ник или E-mail пользователя. 
Требуемые данные можно посмотреть [тут](https://www.walletone.com/wallet/client/#/payment).

`sum` - Сумма.


# ES5 - const walletone = require('walletone.com').default;


 ```javascript
import walletone from 'walletone.com'

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
        return console.error(err); // Вывод всех ошибок
    }

    console.log(data); // Вывод только при успешной оплате

};
```


# Пример получения профиля

 ```javascript
import walletone from 'walletone.com'

const api = new walletone({
    login: '',
    password: ''
});

api.accountInfo((err, data) => {

    if (err) {
        return console.error(err); // Вывод всех ошибок
    }

      console.log(data); // Вывод только при успешном ответе

});

```

# Пример получения баланса

 ```javascript
import walletone from 'walletone.com'

const api = new walletone({
    login: '',
    password: ''
});

api.balanceInfo((err, data) => {

    if (err) {
        return console.error(err); // Вывод всех ошибок
    }

      console.log(data); // Вывод только при успешном ответе

});

```


# Пример получения лимитов

 ```javascript
import walletone from 'walletone.com'

const api = new walletone({
    login: '',
    password: ''
});

api.limitsInfo((err, data) => {

    if (err) {
        return console.error(err); // Вывод всех ошибок
    }

      console.log(data); // Вывод только при успешном ответе

});

```


# Пример получения уведомлений

По умолча́нию : `{ pageNumber: 1, itemsPerPage: 10 }`


 ```javascript
import walletone from 'walletone.com'

const api = new walletone({
    login: '',
    password: ''
});

api.notificationsInfo(undefined, (err, data) => { 

    if (err) {
        return console.error(err); // Вывод всех ошибок
    }

      console.log(data); // Вывод только при успешном ответе

});

```






