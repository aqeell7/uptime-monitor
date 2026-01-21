import nodemailer from 'nodemailer';

const sendNotification = async (email, monitorName, url, status)=>{

  try{
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    })

    const subject = status === 'DOWN'
    ? `🔴 ALERT : ${monitorName} is DOWN`
    : `✅ RECOVERED : ${monitorName} is UP`

    const text = `
      Hello,

      Your monitor "${monitorName}" has changed status.

     URL: ${url}
      Current Status: ${status}
      Time: ${new Date().toLocaleString()}
    
      -uptime Monitor Team
    ` 

    await transporter.sendMail({
      from: `"Uptime Monitor" <${process.env.EMAIL_USER}>`,
      to: email,
      subject:subject,
      text: text,
    })

    console.log(`Email sent to ${email} regarding ${monitorName}`)
  }catch(error){
    console.error('Error sending email:', error.message)
  }
}

export default sendNotification;

