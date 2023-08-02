import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import React, {useState} from 'react';
import './SignUp.css'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import signup from './images/signup.jpg'
import {hostname} from '../vars'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import{verifyPassword, validateEmail, validatePhone} from '../../utils'





const SignUp = () => {
    
    const navigate = useNavigate()



    const handleSubmit = () => {
        

        if(verifyPassword(password,sdPassword)){
            
            if(validateEmail(email)){

                if(validatePhone(phone)){
                    axios.post(hostname + 'users/clients',{
                        email:email,
                        password:password,
                        phone:phone,
                        name:name,
                        birthDate:birthDate
                    }).then((response) => {
                        alert('Account Created Successfully')
                        
                        console.log(response.data)
                        window.localStorage.setItem("logged", JSON.stringify({
                            logged : true,
                            id: response.data.id,
                            type: response.data.type,
                            token: response.data.token}));
                        navigate("/");
                    }).catch((response)=> {
                        alert('Account already exists')
                        console.log(response)
                    })
                }else{
                    alert('Invalid Phone Number')
                }
                

            }else{
                alert("Invalid email")
            }
            

        }else{
            alert("Passwords don't match")
        }
    }
    
    const [name,SetName] = useState('')
    const [email,SetEmail] = useState('')
    const [password,SetPassword] = useState('')
    const [sdPassword,setSdPassword] = useState('')
    const [phone,SetPhoneNumber] = useState('')
    const [birthDate,SetBirthDate] = useState('')


    return(
        <>
        
        <Navbar></Navbar>

        <div className="signUp">
        
            <form className='signUp-form'>
                <label>
                    Name:
                    <input value={name} onChange={(event)=>SetName(event.target.value)} type="text" name="name" />
                </label>
                <label>
                    Email:
                    <input value={email} onChange={(event)=>SetEmail(event.target.value)} type="text" name="email" />
                </label>
                <label>
                    Password:
                    <input value={password} onChange={(event)=>SetPassword(event.target.value)}type="password" name="password" />
                </label>
                <label>
                    Re-Write Password:
                    <input value={sdPassword} onChange={(event)=>setSdPassword(event.target.value)} type="password" name="2password" />
                </label>
                <label>
                    Phone Number:
                    <input value={phone} onChange={(event)=>SetPhoneNumber(event.target.value)} type="text" name="phone" />
                </label>
                <label>
                    Birth Date:
                    <input value={birthDate} onChange={(event)=>SetBirthDate(event.target.value)} type="date" name="birthDate" />
                </label>
                
                <Button className='btn-submit' variant="primary" onClick={()=>handleSubmit()}>Submit</Button>
            </form>

            <div className='pretty-img'>
                <img src={signup} alt="" />
            </div>
            
        </div>

        <Footer></Footer>
        
        </>
    )
}

export default SignUp