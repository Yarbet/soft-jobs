//Establezco las rutas que harán las solicitudes

const router = require('express').Router()
const { handleRegister, handleLogin, handleGetUser,handleDeleteUser } = require('../controllers/users.controllers')
//funciones del controlador para registrar, log in y ver si usuario existe
const { authMiddleware } = require('../middlewares/authMiddleware')
//Importo el middleware para validar que el usuario que está intentando acceder a la ruta protegida esté autenticado

router.get('/', function (req, res) {
    //Define una ruta GET para la raíz (/)
    res.send('Bienvenido a la API');
    //Cuando cliente solicita esta ruta, el servidor envía el archivo index.html
    })
    
// Ruta comodín para capturar cualquier otra ruta no definida
router.get('*', (req, res) => {
    res.status(404).send('Ruta equivocada');
});

// Ruta para obtener los datos del usuario autenticado (Protegida)
router.post('/usuarios', handleRegister)

// Ruta para iniciar sesión y obtener un token (sin protección)
router.post('/login', handleLogin)

// Ruta para obtener los datos del usuario autenticado (Protegida)
router.get('/usuarios', authMiddleware, handleGetUser)

router.delete('/usuarios/:id', authMiddleware, handleDeleteUser)

// router.delete("/usuarios/:id", async (req, res) => {
//     try {
//     const { id } = req.params
//     const Authorization = req.header("Authorization")
//     const token = Authorization.split("Bearer ")[1]
//     console.log(token)
//     } catch (error) {
//     res.status(error.code || 500).send(error)
//     }
//    })


module.exports = router