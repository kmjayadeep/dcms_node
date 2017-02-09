"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var Group = sequelize.define("group", {
        report: DataTypes.DATE,
    }, {
        classMethods: {
            associate: function(models) {
                Group.belongsTo(models.eventStudent);
                models.eventStudent.hasOne(Group);
            }
        }

    });

    return Group;
};
