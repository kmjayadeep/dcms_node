"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var WorkshopGroup = sequelize.define("workshop_group", {
        report: DataTypes.DATE,
        payment: {
            //total amount paid
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        paid: {
            //payment complete or not
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                models.workshop.belongsToMany(models.group, {
                    through: WorkshopGroup
                })
                models.group.belongsToMany(models.workshop, {
                    through: WorkshopGroup
                })
            }
        }
    });

    return WorkshopGroup
};
