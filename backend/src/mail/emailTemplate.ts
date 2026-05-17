export const generateVerificationCodeEmail = (verificationToken: string) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify your email</title>
            </head>
            <body>
                <div>
                    <div>
                        <h1>
                            Verify Your Email
                        </h1>      
                    </div>
                    <div>
                        <p>Enter verification code to verify your email.</p>
                        <p>Verification code: </p>
                        <p><b>${verificationToken}</b></p>
                    </div>
                </div>
            </body>
        </html>
    `;
};

export const generateWelcomeEmail = (name: string) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome</title>
            </head>
            <body>
                <div>
                    <div>
                        <h1>
                            Welcome
                        </h1>      
                    </div>
                    <div>
                    <p>Hi ${name}</p>
                    <p>Congratulation, your account has been created successfully.<p/>
                    </div>
                </div>
            </body>
        </html>
    `;
};

export const generatePasswordResetEmail = (resetUrl: string) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
            </head>
            <body>
                <div>
                    <div>
                        <h1>
                            Reset your password.
                        </h1>      
                    </div>
                    <div>
                        <p>click here to reset your password</p>
                        <p><a href="${resetUrl}">${resetUrl}</a></p>
                    </div>
                </div>
            </body>
        </html>
    `;
};

export const generatePasswordResetSuccessEmail = () => {
  return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password reset successfully.</title>
            </head>
            <body>
                <div>
                    <div>
                        <h1>
                            Password reset successfully.
                        </h1>      
                    </div>
                    <div>
                        <p>Your password has been reset successfully.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
};