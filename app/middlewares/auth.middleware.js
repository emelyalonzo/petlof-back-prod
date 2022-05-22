//importamos jwt
const jwt = require("jsonwebtoken")
const HTTPSTATUSCODE = require("../utils/httpStatusCode")
const isAuth = (req, res, next) => {
    //guardamos en una variable la información de la autorizacion de la cabecera
    //de la petición
    const authorization = req.headers.authorization;
    //si no existe autorizacion, no hay token y se retorna error
    if(!authorization){
        return res.json({
            status: 401,
            message: HTTPSTATUSCODE[401],
            data: null
        })
    }
    //si hay token, lo "troceamos " para separar la parte bearer de la info
    //del token
    const splits = authorization.split(" ")
    if( splits.length!=2 || splits[0]!="Bearer"){
        return res.json({
            status: 400,
            message: HTTPSTATUSCODE[400],
            data: null
        })
    }
    //guardamos la info del token en una variable
    const jwtString = splits[1];
    try{
        //verificamos el token y si es ok lo guardamos en una variable
        var token = jwt.verify(jwtString, req.app.get("secretKey"));
        
        //console.log("token tras verify",token)  
    } catch(err){
        return next(err)
    }
    //creamos una variable con la informacion que queremos meter en la 
    //peticion
    const authority = {
        id   : token.id,
        name: token.name
    }
    //Se la asignamos al request de la peticion
    req.authority = authority
    //si todo ha ido bien pasamos el middleware
		next()
}
//exportamos la funcion isAuth
module.exports = {
    isAuth,
}