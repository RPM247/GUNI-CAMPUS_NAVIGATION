import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import App from "../App";
import AuthLayouts from "../layout";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOTP from "../pages/VerifyOTP";
import LandingPage from "../pages/LandingPage";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "/",
                element : <LandingPage/>

            },
            {
                path : "register",
                element : <AuthLayouts><RegisterPage/></AuthLayouts>
            },
            {
                path: "verify-otp",  // ✅ New route for OTP verification
                element: <AuthLayouts><VerifyOTP /></AuthLayouts>
            },
            {
                path : "email",
                element : <AuthLayouts><CheckEmailPage/></AuthLayouts>
            },
            {
                path : "password",
                element : <AuthLayouts><CheckPasswordPage/></AuthLayouts>
            },
            {
                path : "forgot-password",
                element : <AuthLayouts><ForgotPassword/></AuthLayouts>
            },
            {
                path : "home",
                element : <AuthLayouts><Home/></AuthLayouts>,
                children : [
                    {
                        path : ":userId",
                        element : <MessagePage/>
                    }
                ]
            },
           
        ]
    }
])

export default router