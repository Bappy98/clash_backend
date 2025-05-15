import express,{Application,Request,Response} from 'express'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url';
import ejs from 'ejs'
import sentEmail from './config/mail.js';
import router from './routes/index.js';


const app:Application = express()
const PORT = process.env.PORT || 5001

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log(__dirname);


app.use(express.json())
app.use(express.urlencoded({extended:false}))


// Set view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../dist/views/')) // views folder at root level

// Routes
app.use('/api/v1', router)
app.get('/',async (req: Request, res: Response) => {
    try {
        const html = await ejs.renderFile(__dirname+'/views/email/welcome.ejs', { name: 'John Doe' }); 

   await sentEmail('kegeg94030@daupload.com',"test-smtp",html)
    res.status(200).json({
        message:"message sent successfully"
    })
    } catch (error) {
        console.log(error);
        
    }
})
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})