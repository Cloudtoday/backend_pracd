const jwt = require("jsonwebtoken");
const { isBlacklisted } = require("../utils/tokenBlacklist");

const verifyToken = (req,res, next) =>{
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith("Bearer ")){
        token = authHeader.split(" ")[1];
        if(!token){
            return res
            .status(401)
            .json({message: "No token, authorization denied"});
        }
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            if (isBlacklisted(decode.jti)) {
                return res.status(401).json({message:"Token has been revoked"});
            }
            req.user = decode;
            console.log("The decoded user is : ", req.user);
            next();
        }catch(err){
            res.status(400).json({message:"Token is not valid"});
        }
    }else{
        return res        
        .status(401)
        .json({message: "No token, authorization denied"});
    }
};

module.exports=verifyToken;
