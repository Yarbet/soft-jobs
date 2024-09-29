//Aquí se tienen las funciones para hashear la contraseña con hashSync de bcrypt
// verificar la contraseña con compareSync de jsonwebtoken
//y crear el token con WT_SECRET y sign de jsonwebtoken

require('dotenv').config()
const { hashSync, compareSync } = require('bcrypt');
//Se importan estas dos funciones de bcrypt
//hashSync: crear un hash de una contraseña
//compareSync: comparar una contraseña en texto claro con un hash
const { sign } = require('jsonwebtoken');

const { JWT_SECRET } = process.env
//me traigo el seceto


// funcion para encriptar contraseñas
const handleHashPassword = (password) => {
    return hashSync(password, 10)
}
// 10: número representa la cantidad de "salt rounds" (rondas de sal) que se utilizarán para el hashing. Cuantas más rondas, más seguro será el hash, pero también más tiempo llevará generar el hash. El límite técnico para el número de salt rounds es hasta 31. Sin embargo, usar un número muy alto (por ejemplo, más de 14) lo hace más lento
//

// funcion para verificar contraseñas 
const verificarContraseña = (password, hashedPassword) => {
                         //(Pass del cliente y Pass base de datos)
    return compareSync(password, hashedPassword)
    //retorna el resultado de la comparación
}

const handleSignToken = (data) => {
    return sign(data, String(JWT_SECRET), { expiresIn: 60 * 60 })
}
//sign es función de JWT que se encarga de generar un token a partir de la información proporcionada en el parámetro data y con JWT_SECRET y { expiresIn: 60 * 60 } especifica la duración del token, en este caso, 1 hora (60 minutos)

module.exports = {
    handleHashPassword,
    verificarContraseña,
    handleSignToken
}