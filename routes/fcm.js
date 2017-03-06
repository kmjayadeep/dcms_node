var FCM = require('fcm-node');
var serverKey = 'AAAACLrbQKs:APA91bEI9gyjzCAYq6WWxy8SPuoprNygcLquRMOXZuEyUQQXBwKnUI45jdUPyl3LBGYmrOKmPZCG1WEd1NUF4GbuEflYcSOqj3uOR5yM4pl05LxqvIDU9Agi_ZcDUwTyO09QXpyQtSMp';
var fcm = new FCM(serverKey);
var Promise = require('bluebird');
var debug = require('debug')('fcm');
var wrapper = {

    updateSync() {
        var message = {
            to: '/topics/drishti',
            data: {
                'type': 'EVENT_SYNC'
            }
        };

        var promise = new Promise((resolve,reject)=>{
            fcm.send(message, (err, res) => {
                if (err){
                    debug("Error : ",err);
                    reject(err);
                }
                else{
                    debug("Resolve : ",res);
                    resolve(res);
                }
            })
        })

        return promise;
    },

    updateHighlightSync() {
        var message = {
            to: '/topics/drishti',
            data: {
                'type': 'HIGHLIGHT_SYNC'
            }
        };

        var promise = new Promise((resolve,reject)=>{
            fcm.send(message, (err, res) => {
                if (err){
                    debug("Error : ",err);
                    reject(err);
                }
                else{
                    debug("Resolve : ",res);
                    resolve(res);
                }
            })
        })

        return promise;
    },

    notification(title, body) {
        var message = {
                to: '/topics/drishti' ,
                notification: {
                    'title': title,
                    'body': body
                }
            }

        var promise = new Promise((resolve,reject)=>{
            fcm.send(message, (err, res) => {
                if (err){
                    debug("Error : ",err);
                    reject(err);
                }
                else{
                    debug("Resolve : ",res);
                    resolve(res);
                }
            })
        })

        return promise;
    }
};
module.exports = wrapper;
