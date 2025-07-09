export const Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #4CAF50;
              background: #e8f5e9;
              border: 1px dashed #4CAF50;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email</div>
          <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up with GoTogether! Please confirm your email address by entering the code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} GoTogether. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;




export const Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to CarPool!</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f2f4f7;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
              overflow: hidden;
              border: 1px solid #e0e0e0;
          }
          .header {
              background-color: #2563eb;
              color: #ffffff;
              padding: 24px;
              text-align: center;
              font-size: 28px;
              font-weight: 600;
          }
          .content {
              padding: 30px;
              line-height: 1.7;
              font-size: 16px;
          }
          .footer {
              background-color: #f9fafb;
              padding: 16px;
              text-align: center;
              color: #888;
              font-size: 13px;
              border-top: 1px solid #eee;
          }
          ul {
              padding-left: 18px;
              margin-top: 12px;
          }
          li {
              margin-bottom: 8px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Welcome to CarPool!</div>
          <div class="content">
              <p>Hi {name},</p>
              <p>We're excited to welcome you to <strong>GoTogether</strong> — a community built to make daily commuting smarter, greener, and more affordable.</p>
              <p>With CarPool, you can:</p>
              <ul>
                  <li>Offer or find rides for your regular commute or long trips.</li>
                  <li>Reduce travel costs while meeting like-minded people.</li>
                  <li>Stay safe with verified profiles and real-time ride information.</li>
              </ul>
              <p>You're all set to start your journey with us. Simply log in and begin creating or booking rides that fit your schedule.</p>
              <p>If you ever need help or have questions, feel free to reach out — we’re here to help!</p>
              <p>Happy commuting,<br>The GoTogether Team</p>
          </div>
          <div class="footer">
              &copy; ${new Date().getFullYear()} GoTogether | Making Travel Better Together.
          </div>
      </div>
  </body>
  </html>
`;
