"use strict";

module.exports = function(sequelize, DataTypes) {
    var Events = sequelize.define("event", {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        format: DataTypes.TEXT, //event format
        problemStatement: DataTypes.TEXT, //problem statement,
        prize1: DataTypes.INTEGER, //first prize
        prize2: DataTypes.INTEGER, //second
        prize3: DataTypes.INTEGER, //third
        //group event or not
        group: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        image: {
            type: DataTypes.STRING
                //TODO Add default Value for event image
        },
        maxParticipants: {
            type: DataTypes.INTEGER,
            defaultValue: 0 //0 denotes unlimited
        },
        //valid only if it is group event
        maxGroups: {
            type: DataTypes.INTEGER,
            defaultValue: 0 //unlimited
        },
    }, {
        classMethods: {
            associate: function(models) {

            }
        }

    });

    return Events;
};
