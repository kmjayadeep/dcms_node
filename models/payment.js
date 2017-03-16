"use strict";

module.exports = function(sequelize, DataTypes) {
    var Payments = sequelize.define("payment", {
        paid: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                Payments.belongsTo(models.admin);
                Payments.belongsTo(models.eventStudent);
                models.eventStudent.hasOne(Payments);
                models.admin.hasMany(Payments);
            }
        }
    });

    return Payments;
};