import Cookies from "js-cookie";

export const setAuthTokenCookie = (token: string) => {
    Cookies.set("auth-token", token, {
        path: "/",
        expires: 7,
        sameSite: "Strict",
        secure: true,
    });
};

export const removeAuthTokenCookie = () => {
    Cookies.remove("auth-token", { path: "/" });
};
