'use server'

import DowntimeAlert from "@/components/email-template";
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailAlert(to: string, siteName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Cato <alert@cato.deepanshumishra.xyz>',
      to: to,
      subject: 'Alert: Downtime Detected',
      react: DowntimeAlert({ siteName }),
    })

    if (error) {
      return {
        status: 500,
        message: error,
      }
    }

    console.log('Email sent successfully');

    return {
      status: 200,
      message: data,
    }


  } catch (error) {
    return {
      status: 500,
      message: error,
    }
  }
}
