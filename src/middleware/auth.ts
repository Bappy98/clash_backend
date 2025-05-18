import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const auth = async(req: Request, res: Response, next: NextFunction) => {

      const authHeader = req.headers.authorization;
      if(!authHeader || authHeader===null){
        res.status(401).json({
            message: 'Unauthorized'
        })
      }
      const token = authHeader?.split(' ')[1];

      jwt.verify(token!,process.env.SECRET_KEY!,(err,user)=>{
        if(err) return res.status(401).json({
            message: 'Unauthorized'
        })
        req.user = user as AuthUser;
        next();
      })
      
   
}

export default auth