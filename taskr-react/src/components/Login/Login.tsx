import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import React, {useState} from 'react';
import './Login.css'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import loginImg from './images/login.jpg'
import axios from 'axios'
import  {hostname} from '../vars'
import { useNavigate } from "react-router-dom";


const Login = () => {

    const navigate = useNavigate()
    

    async function login(email:string,password:string) {

      
        var res = await axios.get(hostname + 'users/login', {params:{
            email: email,
            password: password
    }})
        .then((response) => {
            console.log(response.data.id)
            window.localStorage.setItem("logged", JSON.stringify({
                logged : true,
                id: response.data.id,
                type : response.data.type,
                token : response.data.token}));
            navigate("/");
        }).catch((response) => {
            alert('The email or password are incorrect.')
        })
    }



    const handleSubmit = () => {
      
        login(email,password)
        
    }
    
    
    const [email,SetEmail] = useState('')
    const [password,SetPassword] = useState('')
    


    return(
        <>
        
        <Navbar></Navbar>

        <div className="signUp">
        
            <form className='signUp-form'>
                
                <label>
                    Email:
                    <input value={email} onChange={(event)=>SetEmail(event.target.value)} type="text" name="email" />
                </label>
                <label>
                    Password:
                    <input value={password} onChange={(event)=>SetPassword(event.target.value)}type="password" name="password" />
                </label>
               
                
                <Button className='btn-submit' variant="primary" onClick={()=>handleSubmit()}>Submit</Button>
            </form>

            <div className='pretty-img'>
                <img src={loginImg} alt="" />
            </div>
            
        </div>

        <Footer></Footer>
        
        </>
    )
}

export default Login