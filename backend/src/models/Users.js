const { db } = require('../db/config');
//Importo la base de datos
const { verificarContraseña } = require('../helpers/helpers');
//Importa la función de verificar contraseña

//Función para crear usuarios
const CrearUsuario = async (email, hashedPassword,rol = "Full Stack Developer", lenguage = "JavaScript") => {
    //creo función asincrona con parametros, algunos por default
    try {
        //Creo la función SQLrequest de insertar valores 
        const SQLrequest = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *"
                            //Son marcadores de posición que se reemplazan con los valores proporcionados en el array SQLValues. Esta es una forma de prevenir inyecciones SQL
                            // RETURNING *:
                            // Esta cláusula le dice a PostgreSQL que, después de ejecutar la inserción, devuelva todos los campos del registro que se acaba de insertar.

        const SQLValues = [email, hashedPassword, rol, lenguage]
        //crea un arreglo llamado SQLValues que contiene los valores que se van a insertar en la base de datos.

        const { rows: [newUser] } = await db.query(SQLrequest, SQLValues)
        //destructuración de rows que es 
        // "rows": [
        //         {
        //         "id": 1,
        //         "email": "usuario@example.com",
        //         "password": "hashedpassword",
        //         "rol": "customer",
        //         "lenguage": "JavaScript"
        //         }
        //[newUser] toma el primer (y en este caso, único) elemento de ese arreglo y lo asigna a la variable newUser
        //await db.query(SQLrequest, SQLValues)
        //db.query se usa para ejecutar la consulta
        //(SQLrequest, -->inserta los valores
        //, SQLValues) -->arreglo que contiene los valores que deseas insertar = [email, hashedPassword, rol, lenguage]
        //Esta función me sirve para tomar las propiedas de rows y crear un nuevo usuario con el contenido que me devuelve el request

        //retorna el mensaje y data que contiene el newUser
        return {
            msg: 'Register success',
            data: newUser
        }

    } catch (error) {
        throw error
    }
}

//Función para verificar contraseña
const VerificarPassword = async (email, password) => {
    //me pasa por parametro el email y el pass sin hashear
    try {
        //Intenta
        //userExiste = espera función VerificarUsuario(usando parametro email)
        const userExist = await VerificarUsuario(email)
        //verifica si existe un usuario con este email
        
        if (userExist) {
            //si existe = si es true
            const hashedPassword = userExist.data.password
            //Define hashedPassword como = 
            //La variable userExist.data.password osea el password en data en var userExist
            // {userExist [
            //     data: { 
            //         id: 1,
            //         email: "1@correo.com",
            //         password: "hashed_password",
            //         // ...otros campos
            //     }
            //]
            // }
        
            //match (coinciden) = función de verificar contraseña con parametro de password y password hasheado
            const match = verificarContraseña(password, hashedPassword)
            //si coinciden
            if (match) {
                return {
                    msg: 'Existe contraseña',
                    match,
                }
                //si no
            } else {
                return {
                    msg: 'Contraseña no concuerda',
                    match
                }
            }
            //o
        } else {
            return {
                msg: 'Usuario no existe',
                match: false

            }
        }



    } catch (error) {
        throw error
    }
}

//Función para verificar existencia
const VerificarUsuario = async (email) => {
    //paso parametro de email
    try {
        //constantes para llamar a ala base donde email es primer parametro
        const SQLrequest = "SELECT * FROM usuarios WHERE email = $1"
        //con el valor email
        const SQLValues = [email]
        //Desestructuro para crear nuevo usuario con estos valores
        const { rows: [user] } = await db.query(SQLrequest, SQLValues)
        //se verifica si un usuario existe o no en la base
        return user ? { exist: true, data: user } : { exist: false, data: {} }
        //retorna user ?
        //? evalúa 
        //si existe retorna un objeto con las siguientes propiedades { exist: true, data: user } :
        //si no existe { exist: false, data: {} }
    } catch (error) {
        throw error
    }
}
const Delete = async (id) => {
    try {

        const SQLrequest = "DELETE FROM usuarios WHERE id = $1 RETURNING *"
        const SQLValues = [id]

        const { rows: [user] } = await db.query(SQLrequest, SQLValues)

        return {
            deleted: true,
            data: user
        }

    } catch (error) {
        throw error
    }
}

module.exports = {
    CrearUsuario,
    VerificarUsuario,
    VerificarPassword,
    Delete
}