import { Router, Request, Response, RequestHandler } from "express";    
import { clashSchema } from "../validation/clashValidation.js";
import { FileArray, UploadedFile } from "express-fileupload";
import { formatError, imageValidator, removeImage, uploadImage } from "../helper.js";
import prisma from "../config/db.config.js";
import auth from "../middleware/auth.js";
import { ZodError } from "zod";

const router = Router();

router.post('/',auth,async(req:Request,res:Response)=>{
    try {
        const body = req.body
        const payload = clashSchema.parse(body)
        if(req.files?.image) {
            const img:UploadedFile = req.files.image as UploadedFile
            const validMsg = imageValidator(img.size,img.mimetype)
            if(validMsg){
                res.status(400).json({
                    message:validMsg
                })
            }
            payload.image = uploadImage(img)
        } else {
            res.status(422).json({errors:{image:"Image is required"}})
        }
      await prisma.clash.create({
        data:{
            title:payload.title,
            description:payload.description,
            expire_at:new Date(payload.expire_at),
            image:payload?.image,
            user_id:Number(req.user?.id)
        }
      })  
      res.status(201).json({
        message:"Clash created successfully"
      })
    } catch (error) {
         if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid data", errors });
    } else {
    
      res
        .status(500)
        .json({ error: "Something went wrong.please try again!", data: error });
    }
    }
})

router.get('/',auth,async(req:Request,res:Response)=>{
    try {
        const clashes = await prisma.clash.findMany({
            where:{
                user_id:Number(req.user?.id)
            }
        })
        res.status(200).json({
            data:clashes
        })
    } catch (error) {
        res.status(500).json({
            error:"Something went wrong.please try again!"
        })
    }
})

router.get('/:id',auth,async(req:Request,res:Response) :Promise<any> =>{
    try {
        const id = Number(req.params.id)

        const clash = await prisma.clash.findUnique({
            where:{
                id
            },
            include:{
                clashItem:true
            }
        })
        if(!clash){
           return res.status(404).json({
                message:"Clash not found"
            })
        }
       return res.status(200).json({
            data:clash
        })
    } catch (error) {
        res.status(500).json({
            error:"Something went wrong.please try again!"
        })
    }
})


router.put('/:id',auth, async (req:Request,res:Response):Promise<any> =>{
    try {
        const {id} = req.params
        const body = req.body
        const payload = clashSchema.parse(body)
        if(req.files?.image) {
            const image:UploadedFile = req.files.image as UploadedFile
            const validMsg = imageValidator(image?.size,image?.mimetype) 
            if(validMsg) {
               return res.status(422).json({errors:{image:validMsg}}) 
            }
            //delete old image
            const clash = await prisma.clash.findUnique({
                where:{
                    id:Number(id)
                },
                select:{
                    image:true,
                    id:true
                }
    
            })
            if(clash?.image) removeImage(clash?.image)
            payload.image = uploadImage(image)
        }

        await prisma.clash.update({
            data:payload,
            where:{
                id:Number(id)
            }
        })
      return res.json({message:"Clash Update successfully"})

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message:"Internal server error"
        })
    }
})

// //to add items
router.post('/items',auth,async(req:Request,res:Response):Promise<any> =>{
    try {
        const {id} = req.body
        const files:FileArray | undefined | null  = req.files
        let imgError : Array<string> = []
        const images = files?.['images[]'] as UploadedFile[]
        if(images?.length <= 2) {
            images?.map((img)=>{
                const validMsg = imageValidator(img.size,img.mimetype)
                if(validMsg){
                    imgError.push(validMsg)
                }
            })
            if(imgError.length > 0){
                return res.status(422).json({
                    errors:{images:imgError}
                })
            }
        }
        let uploadImages:string[] = []
        images?.map((img)=>{
            uploadImages.push(uploadImage(img))
        })
        const items = await prisma.clashItem.createMany({
            data:uploadImages.map((img)=>{
                return {
                    image:img,
                    clash_id:Number(id)
                }
            })
        })
        if(items){
            return res.status(201).json({
                message:"Items added successfully"
            })
        }
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Internal server error",
            error
        })
    }
})

// router.post('/items', auth, async (req: Request, res: Response): Promise<any> => {
//     try {
//         const { id } = req.body;
//         const files = req.files as FileArray | undefined;
//         console.log(files);
        

//         let imgError: string[] = [];
//         const images = files?.['images[]'];

//         if (!images || (Array.isArray(images) && images.length < 1)) {
//             return res.status(400).json({ message: 'At least one image is required.' });
//         }

//         const imageArray: UploadedFile[] = Array.isArray(images) ? images : [images];

//         if (imageArray.length < 1 || imageArray.length > 2) {
//             return res.status(422).json({ message: 'Please upload 1 or 2 images only.' });
//         }

//         imageArray.forEach((img) => {
//             const validMsg = imageValidator(img.size, img.mimetype);
//             if (validMsg) imgError.push(validMsg);
//         });

//         if (imgError.length > 0) {
//             return res.status(422).json({ errors: { images: imgError } });
//         }

//         const uploadImages: string[] = await Promise.all(
//             imageArray.map((img) => uploadImage(img))
//         );

//         await prisma.clashItem.createMany({
//             data: uploadImages.map((img) => ({
//                 image: img,
//                 clash_id: Number(id)
//             }))
//         });

//         return res.status(201).json({
//             message: 'Items added successfully'
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: 'Internal server error',
//             error
//         });
//     }
// });

router.delete('/:id',auth,async(req:Request,res:Response):Promise<any> =>{
  try {
    const id = Number(req.params.id)
    const clash = await prisma.clash.findUnique({
        where:{
            id
        }
    })
    if(!clash){
        return res.status(404).json({
            message:"Clash not found"
        })
    }

    if(Number(clash.user_id) !== Number(req.user?.id)){
        return res.status(403).json({
            message:"You are not authorized to delete this clash"
        })
    }

    if(clash.image) removeImage(clash.image)
    const clashItems = await prisma.clashItem.findMany({
        where:{
            clash_id:id
        },
        select:{
            image:true
        }
    })
  
      // * Remove Clash items images
    if (clashItems.length > 0) {
      clashItems.forEach((item) => {
        removeImage(item.image);
      });
    }
   
    await prisma.clash.delete({
        where:{
            id
        }
    })
    
    return res.status(200).json({
        message:"Clash deleted successfully"
    })
  } catch (error) {
    return res.status(500).json({
        message:"Internal server error",
        error
    })
  }
})






export default router