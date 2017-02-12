"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var Admin = sequelize.define("admin", {
        name: DataTypes.STRING,
        uid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:true
        },
        phone: {
            type: DataTypes.STRING
        },
        picture: DataTypes.STRING,
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        eventMail:DataTypes.STRING
        /*
        Status codes
        ------------
        0 - not verified
        10 - superadmin - has all privilages
        9 - admin - cannot add/edit other admins
        8 - event admin - can edit their event and see details about it
        7 - registration desk- can view registered students and corresponding events, can verify payments by scanning qr code
        6 - hospitality - view accomodation details
        5 - event volunteer - can check whether a student is eligible to enter an event and mark attendance
        */

    }, {
        classMethods: {
            associate: function(models) {
            }
        }

    });

    return Admin;
};
