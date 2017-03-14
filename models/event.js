"use strict";

module.exports = function(sequelize, DataTypes) {
    var Events = sequelize.define("event", {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        format: DataTypes.TEXT, //event format
        prize1: DataTypes.INTEGER, //first prize
        prize2: DataTypes.INTEGER, //second
        prize3: DataTypes.INTEGER, //third
        //group event or not
        group: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //valid only if it is group event
        maxPerGroup: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        category: {
            type: DataTypes.ENUM('AR','COMECON','CIVIL', 'EE', 'EC', 'ME', 'CS', 'ROBO', 'GEN', 'ONLINE','GAMING','ORIGINALS'),
            allowNull: false,
            defaultValue:'GEN'
        },
        regFee: {
            type: DataTypes.INTEGER,
            defaultValue: 0
            //For group event, fee is per group
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1
            //0 registration open
            //1 registration closed
            //2 event cancelled
            //3 no need of registration
        },
        day: DataTypes.INTEGER, //day 1 2 3
        time: DataTypes.STRING,
        isWorkshop: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        location: DataTypes.STRING,
        timeRequired: DataTypes.STRING,
        contactName1: DataTypes.STRING,
        contactPhone1: DataTypes.STRING,
        contactEmail1: DataTypes.STRING,
        contactName2: DataTypes.STRING,
        contactPhone2: DataTypes.STRING,
        contactEmail2: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Events.belongsTo(models.admin)
                models.admin.hasMany(Events)
            }
        }
    });
    return Events;
};
