import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Homepage from "./pages/Homepage"; 
import Profile from "./pages/Profile";   
import NotFoundPage from "./pages/NotFoundPage"; 
import Signup from "./pages/Signup"; 

const router = createBrowserRouter([
  {
    path: "/",  
    element: <App />,
  },
  {
    path: "/homepage",  
    element: <Homepage />,
  },
  {
    path: "/profile",  
    element: <Profile />,
  },
  {
    path: "/signup",  
    element: <Signup />,
  },
  {
    path: "*",  
    element: <NotFoundPage />,
  },
]);

export default router;
