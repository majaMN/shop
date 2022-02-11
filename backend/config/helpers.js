//This file will be used to connect to our database
const MySqli = require ( 'mysqli');

let conn = new MySqli({
    host: 'localhost', // IP/domain
    post: 3306, //port, default 3306
    user: 'moraswi_user', // username
    passwd: 'P@ss123', // password
    db: 'e-commerce_shop' // the default database name  【optional】
});

let db = conn.emit(false, '');

module.exports = {
    database: db
};
