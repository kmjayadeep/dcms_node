"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var EventStudent = sequelize.define("event_student", {
        report: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {
                models.event.belongsToMany(models.student, {
                    through: EventStudent
                })
                models.student.belongsToMany(models.event, {
                    through: EventStudent
                })
            }
        }

    });

    return EventStudent;
};
