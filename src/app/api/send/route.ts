import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    // Initialize Resend inside the handler to avoid build-time errors
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Parse the request body
    const { name, email, subject, message } = await request.json();

    // Validate the required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send the email using Resend
    const data = await resend.emails.send({
      from: "UniNav Contact Form <onboarding@resend.dev>",
      to: ["uninav.buildminds@gmail.com"],
      subject: `Contact Form: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      max-width: 600px;
      margin: 0 auto;
    }
    .container { padding: 20px; }
    .header { 
      background-color: #003666; 
      color: white; 
      padding: 15px 20px;
      border-radius: 5px 5px 0 0;
    }
    .content { 
      padding: 20px; 
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 5px 5px;
    }
    .footer { 
      margin-top: 20px; 
      font-size: 12px; 
      color: #666; 
      text-align: center;
    }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; }
    .message { 
      background-color: #f5f5f5; 
      padding: 15px;
      border-radius: 5px;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Name:</span> ${name}
      </div>
      <div class="field">
        <span class="label">Email:</span> ${email}
      </div>
      <div class="field">
        <span class="label">Subject:</span> ${subject}
      </div>
      <div class="field">
        <span class="label">Message:</span>
        <div class="message">${message.replace(/\n/g, "<br>")}</div>
      </div>
    </div>
    <div class="footer">
      <p>This message was sent from the UniNav contact form.</p>
    </div>
  </div>
</body>
</html>
      `,
    });

    console.log("data from email", data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
