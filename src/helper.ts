import { ZodError } from "zod";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { supportedMimes } from "./config/filesystem.js";
import { UploadedFile } from "express-fileupload";
import fs from 'fs'

export const formatError = (error: ZodError) => {
  let errors:any = {};
    error.errors?.map((issue)=>{
        errors[issue.path?.[0]] = issue.message
    })
    return errors
};

export const checkDateHourDiff = (date:Date | string ):number=>{
  const now = moment();
  const tokenSentAt = moment(date);
  const difference = moment.duration(now.diff(tokenSentAt));
  const hours = difference.asHours();
  return hours

}

export const imageValidator = (size:number,min:string)=>{
  if(bytesToMb(size) > 5){
    return "Image size must be less than 5MB"
  }
  else if(!supportedMimes.includes(min)){
    return "Image must be a valid image"
  }
  return null
}

export const bytesToMb = (bytes:number) =>{
  return (bytes / (1024 * 1024))
}
export const generateRandomNum = () => {
  return uuidv4();
};

export const uploadImage = (image:UploadedFile) => {
  const imgExt = image?.name.split('.');
  const imageName = generateRandomNum() + '.' + imgExt[imgExt.length - 1];
  const uploadPath = process.cwd() + '/public/images/' + imageName;
  image.mv(uploadPath, (err) => {
    if (err) {
      throw err
    }
  });
  return imageName
}

export const removeImage = (imageName:string) =>{
  const path = process.cwd()+"/public/images/"+imageName
  if(fs.existsSync(path)) {
    fs.unlinkSync(path)
  }
}