"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var Result = sequelize.define("result", {
        position:{
            type:DataTypes.INTEGER
        },
        points:{
            type:DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function(models) {
                models.result.belongsTo(models.event)
                models.result.belongsTo(models.college)
                models.result.belongsTo(models.student) //for individual event
                models.result.belongsTo(models.group) //for group event
            }
        }

    });

    return Result;
};
