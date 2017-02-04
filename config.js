var config = {
    'development': {
        mysql: {
            database: 'dcms',
            username: 'root',
            password: ''
        },
        firebase: {
            databaseURL: 'https://drishti-bd782.firebaseio.com/'
        }
    },
    'production': {

    }
}


var env = process.env.NODE_ENV || "development";

module.exports = function(mode) {
    return config[mode || env]
}
