import express,{Application,Request,Response} from 'express'
import 'dotenv/config'

const app:Application = express()
const PORT = process.env.PORT || 5001   

app.get('/',(req:Request,res:Response)=>{
    res.send('hello world')
})
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})