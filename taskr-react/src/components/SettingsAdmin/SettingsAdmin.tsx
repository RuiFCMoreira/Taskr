import './SettingsAdmin.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { hostname } from '../vars'
import MenuProfile from '../Profile/MenuProfile/MenuProfile'
import ChangePass from '../Profile/ChangePass/ChangePass'
import { IProvider } from '../../interfaces/IProvider'
import ManagementProviders from './ManagementProviders/ManagementProviders'
import AddAdmin from './AddAdmin/AddAdmin'
import AddTypeServices from './AddTypeServices/AddTypeServices'


const SettingsAdmin = () => {

    const [currentMenu, setCurrentMenu] = useState("Profile");
    const [profileData, setProfileData] = useState<IProvider>({
        id: -1,
        name: "",
        email: "",
        birthDate: new Date(),
        phone: "",
        state:"pending",
        nif : "",
        photo : "",
        averageRating : 0,
        numberOfReviews : 0,
        providerServices: [],
        providerServiceAreas:[],
        availability:[],
        review:null
    }) 

    const logged = window.localStorage.getItem("logged");
    var id = ""
    if(logged){
        const json = JSON.parse(logged)    
        id = json.id
    }
    

    const [load, setLoad] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
        try {
                const response = await axios.get(hostname + 'users/admins/'+id)
                setProfileData(response.data)
                
            
            setLoad(true)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
        fetchData();
        
    }, [load]);

if(load){
    return (
     <>
        <Navbar></Navbar>

        <div className='Profile'>
                <div className={currentMenu === "TaskHistory" || currentMenu === "ServiceProfile" || currentMenu === "AddTypeServices"  ? "profileBoxBig" : "profileBox"}>
                    <div className='profileBoxCollumn1'>
                        
                    <button className={currentMenu === "Profile" || currentMenu === "EditProfile" ? "selected" : "free"}
                                    onClick={() => { setCurrentMenu("Profile") }}>
                                    Profile
                                </button>
                                
                    <button className={currentMenu === "Password" ? "selected" : "free"}
                        onClick={() => { setCurrentMenu("Password") }}>
                        Password
                    </button>

                    <button className={currentMenu === "AddTypeServices" ? "selected" : "free"}
                            onClick={() => {setCurrentMenu("AddTypeServices")}}>
                        Management Type Services
                    </button>

                    <button className={currentMenu === "ManageProviders" ? "selected" : "free"}
                        onClick={() => { setCurrentMenu("ManageProviders") }}>
                        Management Providers
                    </button>

                    <button className={currentMenu === "AddAdmin" ? "selected" : "free"}
                        onClick={() => { setCurrentMenu("AddAdmin") }}>
                        Add Other Admins
                    </button>
                        
                       
                        
                
                    </div>
                    <div className='profileBoxCollumn2'>
                        <div className={currentMenu === "Profile" ? "profileSelected" : "menuFree"}>
                            <MenuProfile profileData={profileData} setProfileData={setProfileData}></MenuProfile>
                        </div>

                        <div className={currentMenu === "Password" ? "passwordSelected" : "menuFree"}>
                            <ChangePass></ChangePass>
                        </div>

                        <div className={currentMenu === "AddTypeServices" ? "selected" : "menuFree"}>
                            <AddTypeServices></AddTypeServices>
                        </div>

                        <div className={currentMenu === "ManageProviders" ? "selected" : "menuFree"}>
                            <ManagementProviders></ManagementProviders>
                        </div>

                        <div className={currentMenu === "AddAdmin" ? "selected" : "menuFree"}>
                            <AddAdmin></AddAdmin>
                        </div>
                        
                    </div>
                </div>

            </div>
        
        <Footer></Footer>
    </>
    )
}
else{
    return <></>
}
}

export default SettingsAdmin