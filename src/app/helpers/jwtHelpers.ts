import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken'
const generateToken = (payload: any, secret: string, expiresIn: string | number) => {
    const token = jwt.sign(
        payload,
        secret,
        { 
            algorithm: 'HS256',
            expiresIn: expiresIn as SignOptions['expiresIn'],
        }
    );

    return token;
};

const verifyToken =(token:string,secret:Secret)=>{
    return jwt.verify(token,secret) as JwtPayload
}

export const jwtHelpers ={
    generateToken,
    verifyToken
}