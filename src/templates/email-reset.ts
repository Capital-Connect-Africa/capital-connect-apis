export const resetPasswordTemplate = (resetPasswordUrl: string) => `

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capital Connect Password Reset</title>
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
        <h2>Capital Connect Password Reset</h2>
          <p>You are receiving this email because Capital Connect has requested the reset of the password for your
            account.</p>
        <p>Use the button below to change it.</p>
        <p>Please click on the following link, or paste it into your browser to complete the process:</p>
        <a href="${resetPasswordUrl}" class="button">Reset Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <div class="footer">
            <p><a href="https://capitalconnect.africa/terms-and-conditions/">Terms and Conditions</a></p>
            <p>Copyright 2024 Africa Mali Access. All Rights Reserved by Capital Connect Africa</p>
        </div>
    </div>
</body>

</html>`
