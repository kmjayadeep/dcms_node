"use strict";

module.exports = function(sequelize, DataTypes) {
    var Colleges = sequelize.define("college", {
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {

            }
        }

    });

    return Colleges;
};
