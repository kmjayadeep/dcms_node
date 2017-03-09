"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var GroupStudent = sequelize.define("group_student", {}, {
        classMethods: {
            associate: function(models) {
                models.eventStudent.belongsToMany(models.student, {
                    through: GroupStudent
                });
                models.student.belongsToMany(models.eventStudent, {
                    through: GroupStudent
                });
                models.event.hasMany(GroupStudent);
                models.eventStudent.hasMany(GroupStudent);
                GroupStudent.belongsTo(models.eventStudent);
                GroupStudent.belongsTo(models.student)
            }
        }

    });

    return GroupStudent;
};