// apps/app/src/app/api/send-email/route.ts
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(request: Request) {
  try {
    const { to, subject, text } = await request.json();

    const msg = {
      to,
      from: "yogeshsatkari2@gmail.com", // Make sure this email is verified in SendGrid
      subject,
      text,
    };

    try {
      await sgMail.send(msg);
      // console.log('SendGrid Response:', response);
      return NextResponse.json({ message: "Email sent successfully!" });
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      // More detailed error logging
      console.error("SendGrid Error Details:", {
        code: error.code,
        message: error.message,
        response: error.response?.body,
      });
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
