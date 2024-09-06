// emailTemplate.ts

export interface EmailTemplateProps {
  logoUrl: string;
  emailHeading: string;
  emailBody: string;
  callToAction?: {
    url: string;
    text: string;
  };
  currentYear: number;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
}

export function generateEmailHTML(props: EmailTemplateProps): string {
  const {
    logoUrl,
    emailHeading,
    emailBody,
    callToAction,
    currentYear,
    privacyPolicyUrl,
    termsOfServiceUrl,
  } = props;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailHeading}</title>
        <style>
            body, html {
                margin: 0;
                padding: 0;
                font-family: Open Sans, Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                line-height: 1.5;
                color: #333333;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
            }
            .header {
                background-color: #0071FC;
                padding: 20px;
                text-align: center;
            }
            .logo {
                max-width: 150px;
                height: auto;
            }
            .content {
                padding: 20px;
            }
            .footer {
                background-color: #f8f8f8;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666666;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #0071FC;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${logoUrl}" alt="Vendorspot Logo" class="logo">
            </div>
            
            <div class="content">
                <h1>${emailHeading}</h1>
                
                ${emailBody}
                
                ${
                  callToAction
                    ? `
                <p style="text-align: center; margin-top: 30px;">
                    <a href="${callToAction.url}" class="button">${callToAction.text}</a>
                </p>
                `
                    : ""
                }
            </div>
            
            <div class="footer">
                <p>&copy; ${currentYear} Vendorspot. All rights reserved.</p>
                <p>
                    <a href="${privacyPolicyUrl}">Privacy Policy</a> | 
                    <a href="${termsOfServiceUrl}">Terms of Service</a>
                </p>
                <p>If you have any questions, please contact us at <a href="mailto:support@vendorspot.ng">support@vendorspot.ng</a></p>
            </div>
        </div>
    </body>
    </html>
  `;
}
