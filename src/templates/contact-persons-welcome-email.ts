export const contactPersonWelcomeEmailTemplate = (emailVerificationUrl: string, password: string) => `

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capital Connect Welcome Email</title>
    <style>
        body {
            font-family: sans-serif;
        }

        .container {
            width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        h2 {
            color: #333;
        }

        p {
            line-height: 1.6;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #6c757d;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Follow instructions below to verify you email address</h2>
        <p>You are receiving this email because you (or someone else) have signed up for an account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the verification process:</p>
        <a href="${emailVerificationUrl}" class="button">Verify your email address</a>
        <p>Password: ${password}</p>
        <p>Consider reseting your passwords</p>
        <p>If you did not request this, please ignore this email.</p>
        <div class="footer">
            <p>
              <a href="https://capitalconnect.africa">www.capitalconnect.africa</a>&nbsp;|&nbsp;
              <a href="https://capitalconnect.africa/terms-and-conditions/">Terms and Conditions</a>
            </p>
            <p>Copyright 2024 Africa Mali Access. All Rights Reserved by Capital Connect Africa</p>
        </div>
    </div>
</body>

</html>`;
