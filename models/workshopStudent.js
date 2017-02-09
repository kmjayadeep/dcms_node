"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var WorkshopStudent = sequelize.define("workshop_student", {
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
                models.workshop.belongsToMany(models.student, {
                    through: WorkshopStudent
                })
                models.student.belongsToMany(models.workshop, {
                    through: WorkshopStudent
                })
            }
        }

    });

    return WorkshopStudent;
};
