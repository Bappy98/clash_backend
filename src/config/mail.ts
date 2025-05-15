
import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'bappy.st.98@gmail.com',
    pass: 'etjhhjgirpnxtaqg',
  },
});


const sentEmail = async (to:string,subject:string,body:string) => {
   
    
   await transporter.sendMail({
    from: 'bappy.st.98@gmail.com',
    to: to,
    subject: subject,
    
    html: body, // HTML body
  });
 
};

export default sentEmail