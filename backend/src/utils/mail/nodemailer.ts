import nodemailer from "nodemailer";
import { config } from "../../config/env";

export const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: config.email.user && config.email.pass ? { 
      user: config.email.user, 
      pass: config.email.pass 
    } : undefined,
});

export const sender = {
  email: config.email.fromAddress,
  name: config.email.fromName,
};
