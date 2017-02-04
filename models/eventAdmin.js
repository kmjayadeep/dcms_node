"use strict";


module.exports = function(sequelize, DataTypes) {
    var EventAdmin = sequelize.define("event_admin", {}, {
        classMethods: {
            associate: function(models) {
                models.admin.belongsToMany(models.event, {
                    through: EventAdmin
                })
                models.event.belongsToMany(models.admin, {
                    through: EventAdmin
                })
            }
        }

    });

    return EventAdmin;
};
