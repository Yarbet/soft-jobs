//En este archivo hago las funciones para registrar nuevos usuarios, logearse y Borrarlos. Trayendo la contraseña haseada y la función para firmar

const { handleHashPassword, handleSignToken } = require('../helpers/helpers');
//recibe funcion para hashear pass y funcion para generar el token
const Users = require('../models/Users')
//Traigo modelo con funciones para crear user, verificar si existe user y verificar pass de user

require('dotenv').config()
const { decode } = require('jsonwebtoken');

//funcion para registrar usuario
const handleRegister = async (req, res) => {
    try {

        const { email, password, rol, lenguage } = req.body
        //Extracción de Datos del Cuerpo de la Solicitud

        if (!email || !password) {
        //Si no existe email o password
            res.status(400).json({ msg: 'Email y password requeridos' })
        } 
        //Si existen
        else {
            //función handleHashPassword con parametro email
            const passwordHashed = handleHashPassword(password);
            //funcion VerificarUsuario con parametro email extraida del modelo users 
            const verifyIfUser = await Users.VerificarUsuario(email)

            //si usuario existe
            if (verifyIfUser.exist) {
                return res.status(400).json({ msg: 'Ya existe un usuario con este email' });

            //si no crea un usuario con estos parametros que te paso
            } else {
                const response = await Users.CrearUsuario(email, passwordHashed, rol, lenguage); // Pasa rol y lenguage
                return res.status(200).json(response);
            }
        }
    } catch (error) {
        throw error
    }
}

//función para hacer log in verificando email y contraseña 
const handleLogin = async (req, res) => {
                        //solicitud/respuesta
    try {
        const { email, password } = req.body // Obtenemos el email y password del cuerpo de la solicitud

        //Si email y password no son correctos
        if (!email || !password) {
            res.status(400).json({ msg: 'Email y password requeridos' })
            //responde esto
        } else {
            // Si no, busca al usuario en la base de datos
            const passwordMatch = await Users.VerificarPassword(email, password)
            //const passwordMatch = ModeloUsers.funciónVerificarPassword con parametros que obtuve del cuerpo de la solicitud
           
            if (passwordMatch.match) {
            //la funcion VerificarPassword tiene una propiedad match que me indica si la contraseña coincide o no
            //Entonces le digo "si la contraseña coincide devuelve status 200" 
                res.status(200).json({
                    token: handleSignToken({ email, roles: ['admin', 'customer'] })
                    // genera un token utilizando handleSignToken, que incluye el email y roles asociados (en este caso, ['admin', 'customer'])
                })
            } else {
                //si no, esto otro
                res.status(401).json({ msg: 'Credenciales incorrectas' })
            }
        }

    } catch (error) {
        throw error
    }
}

//función para ver si existe usuario 
const handleGetUser = async (req, res) => {
    try {
        // Obtenemos el email del usuario a través del token decodificado en el middleware
        const { email } = req.user;

        // Buscamos al usuario en la base de datos
        const user = await Users.FindByEmail(email);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Devolvemos la información del usuario
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor: ' + error.message });
    }
};

// const handleDeleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const token = req.token;

//         if (!token) {
//             return res.status(401).json({ msg: 'Token no proporcionado' });
//         }

//         console.log('Token:', token);

//         const decoded = decode(token);
//         if (!decoded) {
//             return res.status(401).json({ msg: 'Token inválido' });
//         }

//         const { email } = decoded;  
//         console.log('Email decodificado:', email);

//         let response = await Users.Delete(id);
//         response['msg'] = `El usuario ${email} acaba de eliminar a ${response.data.email}`;

//         res.status(200).json(response);
//     } catch (error) {
//         res.status(500).json({ msg: 'Error en el servidor: ' + error.message });
//     }
// };

const handleDeleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica que req.user esté definido
        if (!req.user || !req.user.email) {
            return res.status(400).json({ msg: 'Usuario no autenticado o sin email' });
        }

        const { email } = req.user;  // Extrae el email del token decodificado

        // Aquí deberías manejar la lógica de eliminar el usuario con el ID dado
        const response = await Users.Delete(id);

        // Mensaje de respuesta
        res.status(200).json({ msg: `El usuario ${email} ha eliminado al usuario con ID ${id}` });
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor: ${error.message}` });
    }
};
module.exports = {
    handleRegister,
    handleLogin,
    handleGetUser,
    handleDeleteUser
}