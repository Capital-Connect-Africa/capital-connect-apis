export const connectionRequest = (
  contactPersonName: string,
  companyName: string,
  uuid: string,
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

        .decline-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #fc4943;
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
        <p>Dear ${contactPersonName},</p> 

        <p>I hope this message finds you well.</p> 
        
        <p>We wanted to inform you that an investor has expressed interest and requested a connection with ${companyName} through <a href="www.capitalconnect.africa">www.capitalconnect.africa</a>. They are keen to explore potential opportunities, including the possibility of investment.</p> 
        
        <p>This is an invitation for an exploratory discussion rather than a commitment. If you’re open to a follow-up conversation, please accept the request on our platform. </p>
        <a href="${process.env.FRONTEND_URL}/connection-requests/${uuid}/approve" class="button">Approve Connection Request</a>
        <a href="${process.env.FRONTEND_URL}/connection-requests/${uuid}/decline" class="decline-button">Decline Connection Request</a>
        <p>Feel free to reach out if you have any questions or need assistance.</p>
        
        <p>Best regards, <br> Capital Connect Team</p>
        
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
