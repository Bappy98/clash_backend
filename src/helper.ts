import { ZodError } from "zod";
import moment from "moment";

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