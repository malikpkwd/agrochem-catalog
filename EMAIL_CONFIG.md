# Email Configuration Guide

To enable order confirmation emails, follow these steps:

## Option 1: Using Gmail (Free)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password

3. **Set Environment Variables** (create a `.env` file in project root):
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

4. **Restart the server** to apply the environment variables

## Option 2: Using Other Email Services

For other services (SendGrid, Mailgun, etc.), update the transporter in `server.js`:

```javascript
// Example for SendGrid
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

## Testing

1. Complete a checkout order with a valid email
2. Check the provided email inbox for order confirmation
3. The email will include:
   - Order ID and date
   - Product list with quantities and prices
   - Order total
   - Shipping address

## Notes

- **Important**: Never commit `.env` file with real credentials to version control
- Email sending will not block the checkout process if it fails
- Order is saved even if email sending fails
- Check server console logs for email sending errors
