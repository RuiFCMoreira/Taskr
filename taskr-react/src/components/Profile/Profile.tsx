import './Profile.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { useEffect, useState } from 'react'
import { IProviderService } from '../../interfaces/IProviderService'
import MenuProfile from './MenuProfile/MenuProfile'
import ChangePass from './ChangePass/ChangePass'
import DeleteAccount from './DeleteAccount/DeleteAccount'
import axios from 'axios'
import { hostname } from '../vars'
import { IProvider } from '../../interfaces/IProvider'
import ServiceProfile from './ServiceProfile'
import CancelTask from './CancelTask/CancelTask'
import TaskHistory from './TaskHistory/TaskHistory'
import { useParams } from 'react-router-dom'



export interface ServiceDisplay {
    categoryName: string;
    categoryDescription: string;
    services: IProviderService[];
}


export interface ProfileProps {
    profileData: IProvider
    setProfileData: React.Dispatch<React.SetStateAction<IProvider>>
}

const Profile = () => {


    const {menu} = useParams()

    var menuAux = "Profile"
    
    if(menu != undefined){
        menuAux = menu
    }

    const [currentMenu, setCurrentMenu] = useState(menuAux);
    const [profileData, setProfileData] = useState<IProvider>({
        id: -1,
        name: "",
        email: "",
        birthDate: new Date(),
        phone: "",
        state: "pending",
        nif: "",
        photo: "",
        averageRating: 0,
        numberOfReviews: 0,
        providerServices: [],
        providerServiceAreas: [],
        availability: [],
        review:null
    })
    const [load, setLoad] = useState(false)

    const logged = window.localStorage.getItem("logged");
    var typeUser = ""
    var id = ""
    if (logged) {
        const json = JSON.parse(logged)
        typeUser = json.type
        id = json.id
    }




    useEffect(() => {
        const fetchData = async () => {
            try {
                let response
                if (typeUser === "provider") {
                    response = await axios.get(hostname + 'users/providers/' + id)
                    setProfileData(response.data)
                } else if (typeUser === "client") {
                    response = await axios.get(hostname + 'users/clients/' + id)
                    setProfileData(response.data)
                }
                else if (typeUser === "admin") {
                    response = await axios.get(hostname + 'users/admins/' + id)
                    console.log(response.data)
                    setProfileData(response.data)
                }
                setLoad(true)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        console.log(typeUser)
        fetchData();

    }, [load]);

    if (load) {
        return (<>
            <Navbar></Navbar>
            <div className='Profile'>
                <div className={currentMenu === "TaskHistory" || currentMenu === "ServiceProfile" ? "profileBoxBig" : "profileBox"}>
                    <div className='profileBoxCollumn1'>

                        <button className={currentMenu === "Profile" || currentMenu === "EditProfile" ? "selected" : "free"}
                            onClick={() => { setCurrentMenu("Profile") }}>
                            Profile
                        </button>

                        <button className={currentMenu === "Password" ? "selected" : "free"}
                            onClick={() => { setCurrentMenu("Password") }}>
                            Password
                        </button>
                    
                        {typeUser === 'client' && (
                            <>
                                <button className={(currentMenu === "CancelTasks" ? "selected" : "free")}
                                    onClick={() => { setCurrentMenu("CancelTasks") }}>
                                    Cancel Tasks
                                </button>
                                <button className={(currentMenu === "TaskHistory" ? "selected" : "free")}
                                    onClick={() => { setCurrentMenu("TaskHistory") }}>
                                    Task History
                                </button>
                            </>
                        )}


                        {typeUser === 'provider' && (
                            <>

                                <button className={currentMenu === "ServiceProfile" ? "selected" : "free"}
                                    onClick={() => { setCurrentMenu("ServiceProfile") }}>
                                    Service
                                </button>

                                <button className={(currentMenu === "TaskHistory" ? "selected" : "free")}
                                    onClick={() => { setCurrentMenu("TaskHistory") }}>
                                    Task History
                                </button>

                            </>
                        )}



                        <button className={currentMenu === "DeleteAccount" ? "selected" : "free"}
                            onClick={() => { setCurrentMenu("DeleteAccount") }}>
                            Delete Account
                        </button>



                    </div>
                    <div className='profileBoxCollumn2'>
                        <div className={currentMenu === "Profile" ? "profileSelected" : "menuFree"}>
                            <MenuProfile profileData={profileData} setProfileData={setProfileData}></MenuProfile>
                        </div>

                        <div className={currentMenu === "Password" ? "passwordSelected" : "menuFree"}>
                            <ChangePass></ChangePass>
                        </div>
                        <div className={currentMenu === "CancelTasks" ? "cancelTasksSelected" : "menuFree"}>
                            <CancelTask></CancelTask>
                        </div>
                        <div className={currentMenu === "TaskHistory" ? "taskHistorySelected" : "menuFree"}>
                            <TaskHistory></TaskHistory>
                        </div>
                        <div className={currentMenu === "ServiceProfile" ? "serviceProfileSelected" : "menuFree"}>
                            <ServiceProfile provider={profileData} setProvider={setProfileData}  ></ServiceProfile>
                        </div>
                        <div className={currentMenu === "DeleteAccount" ? "deleteAccountSelected" : "menuFree"}>
                            <DeleteAccount></DeleteAccount>
                        </div>
                    </div>
                </div>

            </div>
            <Footer></Footer>
        </>)
    }
    else {
        return <></>
    }

}

export default Profile