"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var Students = sequelize.define("student", {
        name: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
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
            defaultValue: 'pending' //email verification pending
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
