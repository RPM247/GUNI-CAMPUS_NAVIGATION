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
import Places from "../pages/Places";
import PlaceList from "../pages/PlaceList";

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
                path: "verify-otp", 
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
                path : "places",
                element : <AuthLayouts><Places/></AuthLayouts>
            },
            {
                path : "places/:categories",
                element : <AuthLayouts><PlaceList/></AuthLayouts>
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