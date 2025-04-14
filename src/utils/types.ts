/**
 * Options for sending an email
 */
export interface SendEmailOptions {
  /** Email address of the recipient */
  to: string;
  /** Subject line of the email */
  subject: string;
  /** Plain text content of the email */
  text?: string;
  /** HTML content of the email */
  html?: string;
}
