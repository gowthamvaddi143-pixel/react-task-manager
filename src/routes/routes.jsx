import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { TaskmanagerHome } from "../components/task-manager-home";
import { UserLogin } from "../components/user-login";
import { UserDashboard } from "../components/User-dashboard";


const router = createBrowserRouter([
    {
        path:'/',
        element:<App/>,
        children:[
            {
                index:true,
                element:<TaskmanagerHome/>
            },
            {
                path:'login',
                element:<UserLogin/>
            }
        ]
    },
    {
        path:'dashboard',
        element:<UserDashboard/>
    }
    
])
export default router