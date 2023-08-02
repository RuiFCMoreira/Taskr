import './MenuProfile.css'
import Navbar from '../../Navbar/Navbar'
import Footer from '../../Footer/Footer'
import { useEffect, useState } from 'react'
import profile from './images/user2.png'
import nameIMG from './images/user.png'
import emailIMG from './images/mail.png'
import phoneIMG from './images/phone-call.png'
import birthDateIMG from './images/date-of-birth.png'
import nifIMG from './images/nif.png'
import accepted from './images/verify.png'
import rejected from './images/prohibition.png'
import pending from './images/pending.png'
import { IProvider } from '../../../interfaces/IProvider'
import { ProfileProps } from '../Profile'
import { validateEmail,formatDateYMD,readImage } from '../../../utils'
import axios from 'axios'
import { hostname } from '../../vars'



export default function MenuProfile({ profileData, setProfileData }: ProfileProps) {

    const [editProfile, setEditProfile] = useState(false);
    const [name, setName] = useState<string>(profileData.name)
    const [email, setEmail] = useState<string>(profileData.email)
    const [phone, setPhone] = useState<string>(profileData.phone)
    const [birthDate, setBirthDate] = useState(formatDateYMD(profileData.birthDate))
    const [nif,setNIF] = useState<string>(profileData.nif)
    const [photo,setPhoto] = useState<any | null>(profileData.photo)
    const [changePhoto,setChangePhoto] = useState(false)
    // const [phoneAux, setPhoneAux] = useState<string | null>(null)
    
    const logged = window.localStorage.getItem("logged");
    var typeUser = "" 
    var id= ""
    if(logged){
        const json = JSON.parse(logged)    
        typeUser = json.type
        id = json.id
    }

    function compareData(){
        if(name == profileData.name && email == profileData.email && phone == profileData.phone  && 
            birthDate == formatDateYMD(profileData.birthDate)  && nif == profileData.nif && photo == profileData.photo)
            return true
        else 
            return false
    }

    useEffect(() => {
        setName(profileData.name)
    }, []);

    
    const handleSaveChanges = async() => {
        let phoneAux: string | null = null
        if (phone != profileData.phone) {
            phoneAux = phone
        }

        if (validateEmail(email) || typeUser == "admin"){
            if (typeUser == "provider"){
                if (!changePhoto) {
                    axios.post(hostname + 'users/providers/'+id+'/edit',{
                        name:name,
                        newPassword:null,
                        oldPassword:null,
                        phone:phoneAux,
                        birthDate:birthDate,
                        photo:null,
                        })
                        .then((response) => {
                            setProfileData({...profileData, name: name, email: email, phone: phone, birthDate: new Date(birthDate), nif: nif,photo: photo})
                        }).catch((response)=> {
                            alert('Failed to edit profile')
                        })
                        
                }
                else {
                    readImage(photo[0]).then((photoReaded) => {

                        if(validateEmail(email)){
                            axios.post(hostname + 'users/providers/'+id+'/edit',{
                                name:name,
                                newPassword:null,
                                oldPassword:null,
                                phone:phoneAux,
                                birthDate:birthDate,
                                photo:photoReaded,
                            })
                            .then((response) => {
                                setProfileData({...profileData, name: name, email: email, phone: phone, birthDate: new Date(birthDate), nif: nif,photo: photoReaded})
                            }).catch((response)=> {
                                alert('Failed to edit profile')
                
                            })
                        }
                    })
                }
            } 
            if (typeUser == "client") {
                axios.post(hostname + 'users/clients/'+id+'/edit',{
                    name:name,
                    newPassword:null,
                    oldPassword:null,
                    phone:phoneAux,
                    birthDate:birthDate,
                })
                .then((response) => {
                    setProfileData({...profileData, name: name, email: email, phone: phone, birthDate: new Date(birthDate), nif: nif,photo: photo})
                }).catch((response)=> {
                    alert('Failed to edit profile')

                })
            }

            if(typeUser == "admin"){
                axios.post(hostname + 'users/admins/'+id+'/edit',{
                    name:name,
                    newPassword:null,
                    oldPassword:null,
                    phone:phoneAux,
                    birthDate:birthDate,
                })
                .then((response) => {
                    setProfileData({...profileData, name: name, email: email, phone: phone, birthDate: new Date(birthDate), nif: nif,photo: photo})
                }).catch((response)=> {
                    alert('Failed to edit profile')

                })
            }
            
        } else {
            alert("Invalid email format")
        }
    }



    return (<>
            {!editProfile && (
                <div className='MenuProfile'>
                    <div className='menuProfileHeader'>
                        <p>Account</p>
                        <button
                            onClick={() => { 
                                setEditProfile(true)
                                }}>
                            Edit
                        </button>
                    </div>
                    <div className='menuProfileContent'>
                        <div className='menuProfileContentLeft'>
                            {typeUser == "client" &&
                                (<img className="profile" src={profile} alt="" />)
                            }
                            {typeUser == "provider" && 
                                (<img className="photoProvider" src={profileData.photo} alt=""></img>)
                            }
                           

                        </div>
                        <div className={typeUser === "provider" ? 'menuProfileContentRigthProvider' : "menuProfileContentRigthClient"}>
                            <div className='menuProfileContentRigthLine'>
                                <img src={nameIMG} alt="" />
                                <p>{profileData.name}</p>
                                {typeUser === "provider" ? profileData.state=="accepted" ? 
                                <img className="verifyProvider" src={accepted} alt="" title='Accepted'></img>
                                : profileData.state=="rejected" ?
                                <img className="verifyProvider" src={rejected} alt="" title='Rejected'></img>
                                :
                                <img className="verifyProvider" src={pending} alt="" title='Pending'></img>
                                :
                                <></>
                                }
                            </div>
                            <div className='menuProfileContentRigthLine'>
                                <img src={emailIMG} alt="" />
                                <p>{profileData.email}</p>
                            </div>
                            <div className='menuProfileContentRigthLine'>
                                <img src={phoneIMG} alt="" />
                                <p>{profileData.phone}</p>
                            </div>
                            <div className='menuProfileContentRigthLine'>
                                <img src={birthDateIMG} alt="" />
                                <p>{formatDateYMD(profileData.birthDate)}</p>   
                            </div>
                            <div className={typeUser == "provider" ? 'menuProfileContentRigthLine' : "free"}>
                                <img src={nifIMG} alt="" />
                                <p>{profileData.nif}</p>
                            </div>
                        </div>
                    </div>
                </div>

            )}


            {editProfile && (
                <div className='MenuProfile'>
                <div className='menuProfileHeader'>
                    <p>Edit Profile</p>
                    <button
                        onClick={() => { setEditProfile(false) }}>
                        Back
                    </button>
                </div>
                <div className='menuProfileContent'>
                    <div className='menuProfileContentLeft'> 
                        {typeUser === "client" &&
                        (<img className="profile" src={profile} alt="" />)
                        }
                        {typeUser === "provider" && 
                        (<img className="photoProvider" src={profileData.photo} alt=""></img>)
                        }
                        
                    </div>
                    <div className={typeUser === "provider" ? 'menuProfileContentRigthProvider' : "menuProfileContentRigthClient"}>
                        <div className='menuProfileContentRigthLine'>
                            <img src={nameIMG} alt="" />
                            <input type="text"
                                   placeholder="Name" 
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   ></input>
                        </div>
                        <div className='menuProfileContentRigthLine'>
                            <img src={emailIMG} alt="" />
                            <input type="text"
                                   placeholder="Email" 
                                   value={email}
                                   disabled
                                   onChange={(e) => setEmail(e.target.value)}
                                   ></input>
                        </div>
                        <div className='menuProfileContentRigthLine'>
                            <img src={phoneIMG} alt="" />
                            <input type="text"
                                   placeholder="Phone Number" 
                                   value={phone}
                                   onChange={(e) => setPhone(e.target.value)}
                                   ></input>
                        </div>
                        <div className='menuProfileContentRigthLine'>
                            <img src={birthDateIMG} alt="" />
                            <input type="date"
                                   name="birthDate"
                                   value={birthDate}
                                   onChange={(e)=>setBirthDate(e.target.value)}
                                   ></input>
                        </div>
                        <div className={typeUser == "provider" ? 'menuProfileContentRigthLine' : "free"}>
                                <img src={nifIMG} alt="" />
                                <input type="text"
                                   placeholder="NIF"
                                   value={nif}
                                   disabled
                                   onChange={(e) => setNIF(e.target.value)}
                                 ></input>
                        </div>
                        
                        
                        
                    </div>
                </div>
                {typeUser === "provider" && 
                    (<div className='newPhotoProvider'>
                        <input type="file" 
                                name="file"
                                onChange={e =>{
                                setPhoto(e.target.files)
                                setChangePhoto(true)
                                }
                            }/>
                    </div>)
                    }
                {!compareData() ? 
                    <button className='save'    
                            onClick={() => { 
                                if (compareData() == false){
                                        handleSaveChanges()
                                        setEditProfile(false) 
                                    }
                                    }}>
                        Save changes
                    </button> 
                    
                    :

                    <button className='notSave'
                            disabled>
                        Save changes
                    </button>
                    }
                </div>
            )}

        </>)
}
