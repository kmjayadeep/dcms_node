"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var GroupStudent = sequelize.define("group_student", {
    }, {
        classMethods: {
            associate: function(models) {
                models.group.belongsToMany(models.student, {
                    through: GroupStudent
                })
                models.student.belongsToMany(models.group, {
                    through: GroupStudent
                })
            }
        }

    });

    return GroupStudent;
};
