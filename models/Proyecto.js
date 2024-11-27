const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proyecto = sequelize.define('Proyecto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    
    },
    descripcion: {
        type: DataTypes.TEXT,
        
    },
    
    fecha_estimada: {
        type: DataTypes.DATEONLY,
    },
    fecha_real: {
        type: DataTypes.DATEONLY,
    },
    cumplimiento: {
        type: DataTypes.ENUM('Si', 'No'),
        defaultValue: 'No',
    },
    evidencia: {
        type: DataTypes.STRING,
    },
    observaciones: {
        type: DataTypes.TEXT,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Proyecto;