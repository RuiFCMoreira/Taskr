import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import React, {useState} from 'react';
import './SignUpTasker.css'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import joinUs from './images/joinUs.jpg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { hostname } from '../vars';
import{verifyPassword, validateEmail, validatePhone, readImage} from '../../utils'


const SignUpTasker = () => {
    

    const navigate = useNavigate()
    
    const handleSubmit = async() => {
        


        if(verifyPassword(password,sdPassword)){
            
            readImage(photo[0]).then((photoReaded) => {

                if(validateEmail(email)){

                    if(validatePhone(phone)){
                        axios.post(hostname + 'users/providers',{
                            name:name,
                            email:email,
                            password:password,
                            phone:phone,
                            birthDate:birthDate,
                            nif:nif,
                            photo:photoReaded
                        })
                       .then((response) => {
                           alert('Account Created Successfully')
                           
                           console.log(response.data)
                           window.localStorage.setItem("logged", JSON.stringify({
                               logged : true,
                               id: response.data.id,
                               type: response.data.type,
                               token : response.data.token}));
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

            })
            

        }else{
            alert("Passwords don't match")
        }
    }
    
    const [name,SetName] = useState('')
    const [email,SetEmail] = useState('')
    const [password,SetPassword] = useState('')
    const [sdPassword,setSdPassword] = useState('')
    const [phone,SetPhone] = useState('')
    const [birthDate,SetBirthDate] = useState('')
    const [nif,setNif] = useState('')
    const [photo,setPhoto] = useState<any | null>(null)


    return(
        <>
        
        <Navbar></Navbar>

        <div className="signupTasker">
        
            <form className='signupTasker-form'>
                <label>
                    Name:
                    <input value={name} onChange={(event)=>SetName(event.target.value)} type="text" name="name" />
                </label>
                <label>
                    Email:
                    <input value={email} onChange={(event)=>SetEmail(event.target.value)} type="email" name="email" />
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
                    <input value={phone} onChange={(event)=>SetPhone(event.target.value)} type="text" name="phone" />
                </label>

                <label>
                    NIF:
                    <input value={nif} onChange={(event)=>setNif(event.target.value)} type="text" name="nif" />
                </label>

                <label>
                    Photo:
                    <input onChange={(event)=>{
                        setPhoto(event.target.files)
                        }} type="file" name="photo" />
                </label>
                
                <label>
                    Birth Date:
                    <input value={birthDate} onChange={(event)=>SetBirthDate(event.target.value)} type="date" name="birthDate" />
                </label>
                
                <Button className='btn-submit' variant="primary" onClick={()=>handleSubmit()}>Submit</Button>
            </form>

            <div className='pretty-img'>
                <img src={joinUs} alt="" />
            </div>
            
        </div>

        <Footer></Footer>
        
        </>
    )
}

export default SignUpTasker