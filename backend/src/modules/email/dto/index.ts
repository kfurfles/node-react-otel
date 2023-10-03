export interface SendEmailDto {
  from: 'system' | 'marketing';
  to: string;
  subject: string;
  body: string;
}
