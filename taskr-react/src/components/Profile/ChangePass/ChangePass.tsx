import axios from 'axios';
import './ChangePass.css'
import { useState } from 'react'
import { hostname } from '../../vars';
import { verifyPassword } from '../../../utils';


const ChangePass = () => {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [newPass2, setNewPass2] = useState("");

    const [showPass, setShowPass] = useState<boolean>(false);

    const logged = window.localStorage.getItem("logged");
    var typeUser = ""
    var id = ""
    if (logged) {
        const json = JSON.parse(logged)
        typeUser = json.type
        id = json.id
    }

    function dataEmpty(){
        return oldPass === "" || newPass === "" || newPass2 === ""
    }

    const handleChangePassword = async () => {
        if (verifyPassword(newPass, newPass2)) {
            if (typeUser == "provider") {
                axios.post(hostname + 'users/providers/' + id + '/edit', {
                    name: null,
                    newPassword: newPass,
                    oldPassword: oldPass,
                    phone: null,
                    birthDate: null,
                    photo: null,
                })
                    .then((response) => {
                        setOldPass("")
                        setNewPass("")
                        setNewPass2("")
                        alert('Password changed successfully')
                        console.log(response.data)

                    }).catch((response) => {
                        alert('Old password is incorrect!')
                        console.log(response)
                    })
            }
            else if (typeUser == "client") {
                axios.post(hostname + 'users/clients/' + id + '/edit', {
                    name: null,
                    newPassword: newPass,
                    oldPassword: oldPass,
                    phone: null,
                    birthDate: null,
                    photo: null,
                })
                    .then((response) => {
                        alert('Password changed successfully')
                        console.log(response.data)
                        setOldPass("")
                        setNewPass("")
                        setNewPass2("")
                    }).catch((response) => {
                        alert('Old password is incorrect!')
                        console.log(response)
                    })
            } else if (typeUser == "admin") {
                axios.post(hostname + 'users/admin/' + id + '/edit', {
                    name: null,
                    newPassword: newPass,
                    oldPassword: oldPass,
                    phone: null,
                    birthDate: null,
                    photo: null,
                })
                    .then((response) => {
                        alert('Password changed successfully')
                        console.log(response.data)
                        setOldPass("")
                        setNewPass("")
                        setNewPass2("")
                    }).catch((response) => {
                        alert('Old password is incorrect!')
                        console.log(response)
                    })
            }
        } else {
            alert("Passwords don't match")
        }
    }



    return (
        <>
            <div className='ChangePass'>
                <div className='changePassHeader'>
                    <p>Change Password</p>
                </div>
                <div className='changePassContent'>
                    <div className='inputPass'>
                        <div className='inputPassLine'>
                            <p>Old Password</p>
                            <input
                                type={showPass ? "text" : "password"}
                                name="username"
                                value={oldPass}
                                placeholder=""
                                onChange={e => setOldPass(e.target.value)
                                }
                            />
                        </div>
                        <div className='inputPassLine'>
                            <p>New Password</p>
                            <input
                                type={showPass ? "text" : "password"} name="username"
                                placeholder=""
                                value={newPass}
                                onChange={e => setNewPass(e.target.value)
                                }
                            />
                        </div>
                        <div className='inputPassLine'>
                            <p>Re-Write Pasword:</p>
                            <input
                                type={showPass ? "text" : "password"} name="username"
                                placeholder=""
                                value={newPass2}
                                onChange={e => setNewPass2(e.target.value)
                                }
                            />
                        </div>
                        <div className='lastLine'>
                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => setShowPass(!showPass)}
                                />
                                Show Password
                            </label>

                            {!dataEmpty() ?
                                <button className='confirm'
                                    onClick={() => {
                                        if (dataEmpty() == false) {
                                            handleChangePassword() 
                                        }
                                    }}>
                                    Confirm
                                </button>

                                :

                                <button className='confirm notSave'
                                    disabled>
                                    Confirm
                                </button>
                            }

                            
                        </div>
                    </div>
                </div>
            </div>


        </>
    )

}

export default ChangePass