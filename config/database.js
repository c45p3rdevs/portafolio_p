
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('portafolio_p', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Desactivar el logging

});

(async ()=>{
    try {
        await sequelize.authenticate();
        console.log('Conexion con la base de datos establecida correctamente');
        } catch (error) {
            console.error('Error al conectar con la base de datos:', error);
        }    
})();

module.exports = sequelize;
