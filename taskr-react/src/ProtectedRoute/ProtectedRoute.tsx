import { ReactNode } from 'react';
import {Navigate} from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



interface Props {
    children?: ReactNode
    
}

export const ProtectedRoute = ({ children, ...props }:Props) => {


  const logged = window.localStorage.getItem("logged")
  console.log(logged)
     if (logged != null) {

        return <>{children}</>
     }


     
    return <Navigate to={'/login'}/>;
  
};