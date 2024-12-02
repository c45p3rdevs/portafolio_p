const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Proyecto = require('./Proyecto');

const Archivo = sequelize.define('Archivo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
    
        archivo: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        tipo_archivo:{
            type: DataTypes.ENUM('imagen', 'documento', 'otro'),
            defaultValue: 'otro',
        },
        tamano: {
            type: DataTypes.INTEGER,
        }, 
        fecha_subida: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    //Relacion con Proyectos

    Archivo.belongsTo(Proyecto, { foreignKey: 'proyecto_id', onDelete: 'CASCADE' });
    Proyecto.hasMany(Archivo, { foreignKey: 'proyecto_id' });

    module.exports = Archivo;

