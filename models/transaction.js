"use strict";

//id is the primary key and it is used as drishti/dhwani id to create QR codes

module.exports = function(sequelize, DataTypes) {
    var Transaction = sequelize.define("transaction", {
        reason: {
            type: DataTypes.STRING
        },
        score: {
            type: DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function(models) {
                Transaction.belongsTo(models.student)
                models.student.hasMany(Transaction)
                Transaction.belongsTo(models.admin) //admin who added the score
                models.admin.hasMany(Transaction)
            }
        }
    });
    return Transaction;
};
