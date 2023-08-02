import axios from 'axios';
import './DeleteAccount.css'
import { useState } from 'react'
import { hostname } from '../../vars';
import { useNavigate } from 'react-router-dom';


const DeleteAccount = () => {

    const logged = window.localStorage.getItem("logged");
    var typeUser = "" 
    var id= ""
    if(logged){
        const json = JSON.parse(logged)    
        typeUser = json.type
        id = json.id
    }

    const navigate = useNavigate()

    const handleDeleteAccount = async() => {
        axios.delete(hostname + 'users/'+typeUser+'s/'+id)
            .then((response) => {
                alert('Account deleted successfully')
                window.localStorage.removeItem("logged")
                navigate('/');
            }).catch((response)=> {
                alert('Failed to delete account')
            })
    }

    const [confirmMenu, setConfirmMenu] = useState(false);

    return (
        <div className='DeleteAccount'>
            <div className= 'deleteAccountHeader'>
                    <p>Delete Account</p>
            </div>
            <div className={!confirmMenu ? 'deleteAccountContent': 'free'}>
                <p> After deleting the account, you will no longer be able to login to the Taskr website. This action cannot be undone.</p>
                <button className='deleteButton'
                    onClick={() => { setConfirmMenu(true) }}>
                    Delete Account
                </button>
            </div>
            <div className={confirmMenu ? 'deleteAccountConfirm': 'free'}>
                <p> Are you sure you want to delete your account? </p>
                <button className='ButtonNo'
                    onClick={() => { setConfirmMenu(false) }}>
                    No
                </button>
                <button className='ButtonYes'
                    onClick={() => { handleDeleteAccount() }}>
                    Yes
                </button>
            </div>

        </div>
    )

}

export default DeleteAccount