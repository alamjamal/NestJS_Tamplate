export type PayloadType = {
    sub: string; // user ID
    mobile: string; // user mobile
    role: string; // user role
    loginWith: string; // login method (e.g., 'mobile', 'email')
    uid: string; // unique identifier for the user
};
