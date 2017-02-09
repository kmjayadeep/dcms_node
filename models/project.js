"use strict";

module.exports = function(sequelize, DataTypes) {
    var Projects = sequelize.define("project", {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        documentation: DataTypes.TEXT, //for future use
        //group event or not
        image: {
            type: DataTypes.STRING
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
                Projects.belongsTo(models.admin)
                models.admin.hasMany(Projects)
            }
        }
    });

    return Projects;
};
