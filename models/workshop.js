"use strict";

module.exports = function(sequelize, DataTypes) {
    var Workshops = sequelize.define("workshop", {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        format: DataTypes.TEXT, //workshop format
        //group event or not
        group: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        image: {
            type: DataTypes.STRING
        },
        //valid only if it is group event
        maxPerGroup: {
            type: DataTypes.INTEGER
        },
        regFee: {
            type: DataTypes.INTEGER,
            defaultValue: 0
                //For group event, fee is per group
        },
        contactName1: DataTypes.STRING,
        contactPhone1: DataTypes.STRING,
        contactEmail1: DataTypes.STRING,
        contactName2: DataTypes.STRING,
        contactPhone2: DataTypes.STRING,
        contactEmail2: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Workshops.belongsTo(models.admin)
                models.admin.hasMany(Workshops)
            }
        }

    });

    return Workshops;
};
