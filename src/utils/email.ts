import type { SendEmailOptions } from "./types";

/**
 * Sends an email using the SendGrid API
 * @param options Email options including recipient, subject, and content
 * @returns Promise that resolves with the email response data
 */
export async function sendEmail(options: SendEmailOptions) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/send-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }
  console.log("response  :: ", response);
  return response.json();
}
