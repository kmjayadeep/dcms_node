"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var Students = sequelize.define("student", {
        name: DataTypes.STRING,
        uid: {
            //user_id from google idToken
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phone: {
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        accomodation: {
            type: DataTypes.ENUM,
            values: ['none', 'male', 'female'],
            defaultValue: 'none'
        },
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'banned', 'pending'],
            defaultValue: 'active'
        },
        score: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        registered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        picture: {
            type: DataTypes.STRING,
            defaultValue: 'https://firebasestorage.googleapis.com/v0/b/drishti-bd782.appspot.com/o/images%2F1486499663_icons_user.png?alt=media&token=3af2649d-cdfb-4a4d-93df-64dfb5285593'
        },
        normalisedScore: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        }
    }, {
        classMethods: {
            associate: function(models) {
                models.student.belongsTo(models.college)
                models.college.hasMany(models.student)
            }
        }

    });

    return Students;
};
