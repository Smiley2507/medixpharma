# Email Configuration Guide - Gmail SMTP Setup

## Overview
This guide will help you configure Gmail SMTP for the Pharmacy Management System to send emails (OTP verification, password reset, notifications, etc.).

---

## Prerequisites
- A Gmail account
- Access to Google Account settings

---

## Step-by-Step Setup

### Step 1: Enable 2-Step Verification

1. **Go to Google Account Security**
   - Visit: https://myaccount.google.com/security
   - Or: Google Account → Security

2. **Enable 2-Step Verification**
   - Scroll to "How you sign in to Google"
   - Click on **2-Step Verification**
   - Click **Get Started**
   - Follow the prompts to verify your phone number
   - Complete the setup

   ![2-Step Verification](https://support.google.com/accounts/answer/185839)

### Step 2: Generate App Password

1. **Access App Passwords**
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App passwords
   - You may need to sign in again

2. **Create New App Password**
   - Under "Select app", choose **Mail**
   - Under "Select device", choose **Other (Custom name)**
   - Enter name: `Pharmacy Management System`
   - Click **Generate**

3. **Copy the Password**
   - Google will display a 16-character password
   - Example format: `abcd efgh ijkl mnop`
   - **IMPORTANT**: Copy this password immediately
   - You won't be able to see it again!

### Step 3: Update Application Configuration

#### Option A: Update application.properties (Local Development)

1. **Open the file**:
   ```
   pharmacy-management/src/main/resources/application.properties
   ```

2. **Update these lines**:
   ```properties
   spring.mail.username=YOUR_EMAIL@gmail.com
   spring.mail.password=YOUR_APP_PASSWORD
   ```

3. **Replace**:
   - `YOUR_EMAIL@gmail.com` → Your actual Gmail address
   - `YOUR_APP_PASSWORD` → The 16-character password from Step 2 (remove spaces)

4. **Example**:
   ```properties
   spring.mail.username=john.doe@gmail.com
   spring.mail.password=abcdefghijklmnop
   ```

#### Option B: Use Environment Variables (Docker - Recommended)

For Docker deployment, it's better to use environment variables to keep credentials secure.

1. **Create a `.env` file** in the project root:
   ```bash
   # Email Configuration
   SPRING_MAIL_USERNAME=your_email@gmail.com
   SPRING_MAIL_PASSWORD=your_app_password
   ```

2. **Update docker-compose.yml**:
   ```yaml
   backend:
     environment:
       SPRING_MAIL_USERNAME: ${SPRING_MAIL_USERNAME}
       SPRING_MAIL_PASSWORD: ${SPRING_MAIL_PASSWORD}
   ```

3. **Add `.env` to `.gitignore`**:
   ```
   .env
   ```

---

## Step 4: Test the Configuration

### Test Locally

1. **Start the application**:
   ```bash
   cd pharmacy-management
   ./mvnw spring-boot:run
   ```

2. **Test email sending**:
   - Register a new user
   - Request OTP verification
   - Check if you receive the email

### Test in Docker

1. **Rebuild and restart**:
   ```bash
   docker compose down
   docker compose up -d --build backend
   ```

2. **Check logs**:
   ```bash
   docker compose logs backend -f
   ```

3. **Look for**:
   - No email-related errors
   - Successful email sending messages

---

## Troubleshooting

### Issue 1: "Username and Password not accepted"

**Solution**:
- Make sure you're using an **App Password**, not your regular Gmail password
- Verify 2-Step Verification is enabled
- Check that you copied the App Password correctly (no spaces)

### Issue 2: "Connection timed out"

**Solution**:
- Check your internet connection
- Verify firewall isn't blocking port 587
- Try port 465 with SSL:
  ```properties
  spring.mail.port=465
  spring.mail.properties.mail.smtp.ssl.enable=true
  ```

### Issue 3: "Authentication failed"

**Solution**:
- Regenerate the App Password
- Make sure the email address is correct
- Check for typos in the password

### Issue 4: Health check fails

**Solution**:
The mail health check is now disabled by default. If you want to enable it after configuring email:

```properties
management.health.mail.enabled=true
```

---

## Security Best Practices

### 1. Never Commit Credentials
```bash
# Add to .gitignore
application-local.properties
.env
*.env
```

### 2. Use Environment Variables in Production
```bash
# Set environment variables
export SPRING_MAIL_USERNAME=your_email@gmail.com
export SPRING_MAIL_PASSWORD=your_app_password
```

### 3. Rotate App Passwords Regularly
- Delete old app passwords from Google Account
- Generate new ones periodically

### 4. Use Different Accounts for Different Environments
- Development: dev-pharmacy@gmail.com
- Production: pharmacy-system@gmail.com

---

## Alternative Email Providers

If you prefer not to use Gmail, here are other options:

### Outlook/Hotmail
```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=your_email@outlook.com
spring.mail.password=your_password
```

### SendGrid (Recommended for Production)
```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=YOUR_SENDGRID_API_KEY
```

### Mailgun
```properties
spring.mail.host=smtp.mailgun.org
spring.mail.port=587
spring.mail.username=postmaster@your-domain.mailgun.org
spring.mail.password=YOUR_MAILGUN_PASSWORD
```

---

## Email Templates

The application sends emails for:

1. **OTP Verification** - When users log in
2. **Password Reset** - When users forget their password
3. **Welcome Email** - When new users register (optional)
4. **Low Stock Alerts** - When inventory is low (optional)

---

## Quick Reference

### Gmail SMTP Settings
```properties
Host: smtp.gmail.com
Port: 587 (TLS) or 465 (SSL)
Authentication: Required
Username: Your Gmail address
Password: App Password (16 characters)
```

### Important Links
- Google Account Security: https://myaccount.google.com/security
- App Passwords: https://myaccount.google.com/apppasswords
- Gmail SMTP Help: https://support.google.com/mail/answer/7126229

---

## For Tomorrow's Presentation

### What to Say About Email Configuration:

1. **Security**: "I'm using Gmail's App Password feature, which is more secure than using the actual account password."

2. **Best Practices**: "Email credentials are stored as environment variables in Docker, not hardcoded in the source code."

3. **Functionality**: "The system sends OTP codes for two-factor authentication and password reset emails."

4. **Health Checks**: "I've configured the health check to exclude email validation to prevent deployment issues if SMTP is temporarily unavailable."

---

## Next Steps

1. ✅ Enable 2-Step Verification on your Gmail
2. ✅ Generate an App Password
3. ✅ Update application.properties or .env file
4. ✅ Test email functionality
5. ✅ Rebuild Docker containers
6. ✅ Verify everything works

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review application logs: `docker compose logs backend`
3. Verify Gmail settings at https://myaccount.google.com/security
4. Test with a simple email client first to verify credentials

---

**Last Updated**: December 2025
**For**: Pharmacy Management System Project Submission
