# Email Configuration for Contact Form

The contact form on the website sends emails to `danik.bachnov@gmail.com`. To make this work in production, you need to configure email settings in your Laravel backend.

## Configuration Steps

### 1. Environment Variables

Add the following to your `.env` file in the `massage-course-backend` directory:

```bash
# Email Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-gmail@gmail.com
MAIL_FROM_NAME="Massage Academy"
```

### 2. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `MAIL_PASSWORD`

### 3. Alternative Email Services

#### Using Mailgun
```bash
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_SECRET=your-mailgun-secret
```

#### Using SendGrid
```bash
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
```

#### Using Postmark
```bash
MAIL_MAILER=postmark
POSTMARK_TOKEN=your-postmark-token
```

### 4. Testing

You can test email sending using Laravel's Artisan command:

```bash
php artisan tinker
```

Then run:
```php
Mail::raw('Test email', function ($message) {
    $message->to('danik.bachnov@gmail.com')
           ->subject('Test Email');
});
```

### 5. Development Mode

For development, you can use the `log` driver to see emails in the Laravel log:

```bash
MAIL_MAILER=log
```

Emails will be written to `storage/logs/laravel.log`

### 6. Production Considerations

- Always use environment variables for sensitive data
- Consider using a dedicated email service (SendGrid, Mailgun, etc.)
- Monitor email delivery rates and bounce rates
- Set up SPF, DKIM, and DMARC records for better deliverability

### 7. Contact Form Features

The contact form includes:
- Form validation
- Spam protection through rate limiting
- Support categorization
- Email reply-to functionality
- Reference ID generation for tracking
- Error logging for debugging

### 8. Rate Limiting

The API includes built-in rate limiting to prevent spam. Users are limited to:
- 60 requests per minute per IP address
- Additional throttling can be configured in `app/Http/Kernel.php`

### 9. Monitoring

All contact form submissions are logged with:
- User information
- IP address
- User agent
- Timestamp
- Message content (for debugging)

Check logs at `storage/logs/laravel.log` for any issues.
