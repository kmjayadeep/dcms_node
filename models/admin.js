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
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {
        classMethods: {
            associate: function(models) {
                models.admin.belongsToMany(models.event, {
                    through: "event_admins"
                })
                models.event.belongsToMany(models.admin, {
                    through: "event_admins"
                })
            }
        }

    });

    return Admin;
};
