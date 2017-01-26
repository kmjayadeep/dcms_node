"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var Group = sequelize.define("group", {
        report: DataTypes.DATE,
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                models.group.belongsTo(models.event)
                models.group.belongsTo(models.college)
            }
        }

    });

    return Group;
};
