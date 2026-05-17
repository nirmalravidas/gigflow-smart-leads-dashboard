export enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    EMAIL_VERIFICATION = 'email_verification',
    PASSWORD_RESET = 'password_reset',
}

export enum AuthEvent {
    SIGNUP = 'auth.signup',
    SIGNIN = 'auth.sign',
    SIGNOUT = 'auth.signout',
    EMAIL_VERIFIED = 'auth.email_verified',
    PASSWORD_RESET = 'auth.password_reset',
}