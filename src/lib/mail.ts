import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEYs);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!;
const CLIENT_URL = process.env.CLIENT_URL!;

export const sendVerificationEmail = async (
  email: string,
  token: string,
) => {
    console.log(email, FROM_EMAIL)
    if(!email) throw new Error("Email is missing")
  const verificationUrl =
    `${CLIENT_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verify your email",
    html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h2>Verify your email</h2>

          <p>
            Thanks for creating an account.
            Please verify your email address to continue.
          </p>

          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 10px 16px;
              background: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Verify Email
          </a>

          <p>
            This verification link expires in 24 hours.
          </p>
        </body>
      </html>
    `,
  });
};

