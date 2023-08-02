import './AddAdmin.css'
import { useEffect, useState } from 'react'
import nameIMG from './images/user.png'
import emailIMG from './images/mail.png'
import phoneIMG from './images/phone-call.png'
import birthDateIMG from './images/date-of-birth.png'
import passwordIMG from './images/padlock.png'
import { validateEmail, validatePhone } from '../../../utils'
import axios from 'axios'
import { hostname } from '../../vars'

const AddAdmin = () => { 

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [phone,setPhone] = useState('')
    const [birthDate,setBirthDate] = useState('')

    function compareData (){
        return (name != '' && email != '' && password != '' && phone != '' && birthDate != '')
    }
    const handleSubmitNewAdmin = async() => {
        if (compareData()){
            if(validateEmail(email)){
                if(validatePhone(phone)){
                    axios.post(hostname + 'users/admins',{
                        email:email,
                        password:password,
                        phone:phone,
                        name:name,
                        birthDate:birthDate
                    }).then((response) => {
                        alert('Admin Created Successfully')
                        setName('')
                        setEmail('')
                        setPassword('')
                        setPhone('')
                        setBirthDate('')
                        
                    }).catch((response)=> {
                        alert('Admin not created successfully')
                        console.log(response)
                    })
                }else{
                    alert('Invalid Phone Number')
                }
            }else{
                alert("Invalid email")
            }
        }else {
            alert("Please fill in all fields!")
        }
    }



        return (
            <div className='AddAdmins'>
                <div className='addAdminsHeader'>
                    <p>Add Admin</p>
                </div>
                <div className='addAdminsContent'>
                    <div className='addAdminForm'>
                        <div className='addAdminLine'>
                            <img src={nameIMG} alt="" />
                            <input type="text"
                                    required
                                   placeholder="Name" 
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   ></input>
                        </div>
                        <div className='addAdminLine'>
                            <img src={emailIMG} alt="" />
                            <input type="email"
                                    required
                                   placeholder="Email" 
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   ></input>
                        </div>
                        <div className='addAdminLine'>
                            <img src={passwordIMG} alt="" />
                            <input type="password"
                                    required
                                   placeholder="Password" 
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   ></input>
                        </div>
                        <div className='addAdminLine'>
                            <img src={phoneIMG} alt="" />
                            <input type="text"
                                    required
                                   placeholder="Phone Number" 
                                   value={phone}
                                   onChange={(e) => setPhone(e.target.value)}
                                   ></input>
                        </div>
                        <div className='addAdminLine'>
                            <img src={birthDateIMG} alt="" />
                            <input type="date"
                                   required
                                   name="birthDate"
                                   value={birthDate}
                                   onChange={(e)=>setBirthDate(e.target.value)}
                                   ></input>
                        </div>
                    </div>
                    <div className='buttonSubmitAdmin'>
                        <button className='save'    
                                onClick={() => { 
                                    handleSubmitNewAdmin() }}>
                            Register new Admin
                        </button> 
                    </div>
                </div>
            </div>
        )
}

export default AddAdmin