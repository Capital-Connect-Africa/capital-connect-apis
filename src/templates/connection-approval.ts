export const connectionApproval = (
  investorName: string,
  companyName: string,
) => `

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
        <p>Dear ${investorName},</p> 

        <p>I hope this message finds you well.</p> 
        
        <p>We’re pleased to inform you that ${companyName} has accepted your connection request through <a href="www.capitalconnect.africa">www.capitalconnect.africa</a>. They are interested in exploring potential opportunities and discussing how your investment could align with their goals.</p> 
        
        <p>You can now begin the discussion via the platform.</p>
        
        <p>If you have any questions or need assistance, please don’t hesitate to reach out.</p>
        
        <p>Best regards,<br>Capital Connect Team</p>
        
        <p><a href="tel:+254715501703">+254 715 501 703</a></p> 
        
        <p><a href="mailto:services@capitalconnect.africa">services@capitalconnect.africa</a></p>  
        
        <p><a href="https://capitalconnect.africa">www.capitalconnect.africa</a></p>

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
