import express,{Application,Request,Response} from 'express'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url';
import ejs from 'ejs'
import router from './routes/index.js';
import ExpressFileUpload from 'express-fileupload';
import { appLimiter } from './config/rateLimit.js';


const app:Application = express()
const PORT = process.env.PORT || 5001

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log(__dirname);


app.use(express.json())
app.use(ExpressFileUpload({
    useTempFiles: true,
    tempFileDir:"/tmp/"
}))
app.use(appLimiter)
app.use(express.urlencoded({extended:false}))
app.use(express.static('public/images'))


// // Set view engine
// app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, '../dist/views/')) // views folder at root level

// Routes
app.use('/api/v1', router)
// app.get('/',async (req: Request, res: Response) => {
//     try {
//         const html = await ejs.renderFile(__dirname+'/views/email/welcome.ejs', { name: 'John Doe' }); 

//    await sentEmail('kegeg94030@daupload.com',"test-smtp",html)
//     res.status(200).json({
//         message:"message sent successfully"
//     })
//     } catch (error) {
//         console.log(error);
        
//     }
// })
app.get('/',(req: Request, res: Response) => {
    res.status(200).json({
        message:"hello world"
    })
})
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})