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
            type: DataTypes.STRING
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
