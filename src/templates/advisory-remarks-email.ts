export const advisoryRemarksEmailTemplate = (notes: string, username: string, advisorname: string) => `

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
    Dear ${username},

    Ahead of your advisory session with ${advisorname}, please review their following remarks to ensure a productive discussion. Let us know if you have any questions.

    <div>${notes}</div>


    Best regards,

       
    </div>
</body>

</html>`;
