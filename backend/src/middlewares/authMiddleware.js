//El middleware sirve para implementar autenticación y autorización en la app, para que solo los usuarios válidos puedan realizar ciertas acciones. Extraye el token del Header Authorization, verificándolo con una clave secreta y comunicándose con JWT para decodificarlo y comprobar su validez. Si el token es válido, almacena la información del usuario codificada en req.user, permitiendo así el acceso a rutas protegidas; de lo contrario, deniega el acceso, asegurando así la seguridad de la aplicación.
const jwt = require('jsonwebtoken');
const { verify } = require('jsonwebtoken');
//Este método viene del paquete jsonwebtoken y se usa para verificar la validez de un token JWT (JSON Web Token)
const { JWT_SECRET } = process.env
// Se obtiene la clave secreta almacenada en el archivo .env. Esta clave se usa tanto para firmar (generar) como para verificar los tokens JWT. Es una cadena de texto secreta que solo el servidor debe conocer.
require('dotenv').config()

// Middleware para verificar el token JWT y autenticación
// const authMiddleware = async (req, res, next) => {
//                             //se reciben 3 parametros
//     try {
//         const authHeader = req.header('Authorization');
//         console.log('Authorization Header:', authHeader); // Para verificar si llega el encabezado
//             //Se obtiene el encabezado Authorization de la solicitud, que generalmente contiene el token JWT en la forma Bearer <token>
//         if (!authHeader) {
//             return res.status(401).json({ msg: 'No se proporcionó un token' });
//         }
//         //Si no lo está, se envía una respuesta con un código de estado 401

//         const token = authHeader.split(' ')[1]; // Obtén el token del encabezado
//         //Se utiliza split(' ')[1] para dividir el encabezado en dos partes: el tipo (Bearer) y el token

//         // Verifica el token
//         const decoded = verify(token, String(JWT_SECRET)); 
//         //Se llama a la función verify del paquete jsonwebtoken
//         //para verificar la validez del token usando la clave secreta JWT_SECRET

//         if (!decoded) {
//             return res.status(401).json({ msg: 'Token inválido' });
//         }//Si decoded es undefined o null, se envía una respuesta 401

//         // Si el token es válido, lo guardamos en req para usarlo en otros controladores
//         req.user = decoded;
//         next(); // Continuamos al siguiente middleware o controlador
//     } catch (error) {
//         res.status(500).json({ msg: 'Error en el servidor: ' + error.message });
//     }
// }

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token del encabezado

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar y decodificar el token

        console.log('Decoded JWT:', decoded); // Ver qué contiene el token decodificado
        req.user = decoded; // Almacena los datos decodificados en req.user

        next(); // Continuar al siguiente middleware o controlador
    } catch (err) {
        return res.status(401).json({ msg: 'Token inválido o expirado' });
    }
};
module.exports = {
    authMiddleware
}

// Paso por paso:
// Obtiene el token del encabezado Authorization.
// Verifica que el token esté presente; si no, responde con un error.
// Extrae el token y lo verifica usando la clave secreta.
// Si el token es válido, almacena la información del usuario decodificada en req.user.
// Llama a next() para continuar con el siguiente middleware o controlador.
// Maneja cualquier error que pueda ocurrir, respondiendo adecuadamente.