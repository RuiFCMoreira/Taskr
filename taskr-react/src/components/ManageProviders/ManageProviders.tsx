import './ManageProviders.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { useEffect, useState } from "react"
import { hostname } from "../vars"
import axios from 'axios'
import { IProvider } from '../../interfaces/IProvider'
import { Link } from 'react-router-dom'
import { formatDateYMD } from '../../utils'
import nameIMG from './images/user.png'
import emailIMG from './images/mail.png'
import phoneIMG from './images/phone-call.png'
import birthDateIMG from './images/date-of-birth.png'
import nifIMG from './images/nif.png'
import starIMG from './images/estrela.png'
import numberTasksIMG from './images/verifica.png'
import verifyIMG from './images/verify.png'
import rejectedIMG from './images/prohibition.png'
import pendingIMG from './images/pending.png'
import { useNavigate } from 'react-router-dom';


const ManageProviders = () => {

    const [providers,setProviders] = useState<IProvider[]>([])
    const [load, setLoad] = useState(false)
    const [stateSelected,setStateSelected] = useState("pending")
    const [reload, setReload] = useState(0)

    const logged = window.localStorage.getItem("logged");
    var typeUser = "" 
    var id= ""
    if(logged){
        const json = JSON.parse(logged)    
        typeUser = json.type
        id = json.id
    }

    const navigate = useNavigate()
    

    useEffect(() => {
        const fetchData = async () => {
          try {
            let response = await axios.get(hostname+'users/providers')
            setProviders(response.data)
            setLoad(true)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
        
      }, [load]);

      useEffect(() => {}, [reload]);

    function approveProvider(index: number) {        
        axios.post(hostname + 'users/providers/' + providers[index].id + '/approve')
        .then((response) => {
            let newProvidersData = providers
            newProvidersData[index].state = "accepted"
            setProviders(newProvidersData)
            setReload(reload+1)
        }).catch((response) => {
            alert('Failed to approve provider')
            console.log(response.body)
        })
    }

    function rejectProvider(index: number) {   

        axios.post(hostname + 'users/providers/' + providers[index].id + '/disapprove')
        .then((response) => {
            let newProvidersData = providers
            newProvidersData[index].state = "rejected"
            setProviders(newProvidersData)
            setReload(reload+1)
        }).catch((response) => {
            alert('Failed to reject provider')
            console.log(response.body)
        })
    }

if (typeUser == "admin"){
    if (load){
        return (
            <>
            <Navbar></Navbar>
            {/* <div className='ManageProvidersTitle'>
                    <p>Providers</p>
            </div> */}
            <div className='ManageProvidersContent'>
                    <div className='selectState'>
                        <button className={stateSelected == "all" ? 'buttonSelected' : 'butonFree'}
                                onClick={() => {setStateSelected("all")
                                                setReload(reload+1)}}>
                            All
                        </button>
                        <button className={stateSelected == "pending" ? 'buttonSelected' : 'butonFree'}
                                onClick={() => {setStateSelected("pending")
                                                setReload(reload+1)}}>
                                    Pending
                        </button>
                        <button className={stateSelected == "accepted" ? 'buttonSelected' : 'butonFree'}
                                onClick={() => {setStateSelected("accepted")
                                                setReload(reload+1)}}>
                                    Accepted
                        </button>
                        <button className={stateSelected == "rejected" ? 'buttonSelected' : 'butonFree'}
                                onClick={() => {setStateSelected("rejected")
                                                setReload(reload+1)}}>
                                    Rejected
                        </button>
                    </div>
                    <div className='providersHeader'>
                        <table>
                                    <tr>
                                        <td className='photoProvider'>Providers</td>
                                        <td className='nameProvider'></td>
                                        <td className='contactProvider'></td>
                                        <td className='reviewsProvider'>Reviews</td>
                                        <td className='stateProvider'>State</td>
                                        <td className='buttonsProvider'></td>
                                    </tr>
                        </table>
                    </div>
                    <div className='providersList'>
                        <table>
                            {
                                providers.map((provider,index) => {
                                    function buildLinkProvider(providerId: number) {
                                        return "/provider/"+providerId
                                    }
                                    
                                    if (provider.state == stateSelected || stateSelected == "all") {
                                        return(
                                            <tr>
                                                <td className='photoProvider'><img src={provider.photo} alt=''></img></td>
                                                <td className='nameProvider'>
                                                    <div className='line'>
                                                        <img src={nameIMG} alt="Name" title='Name' />
                                                        <p>{provider.name}</p>
                                                    </div>
                                                    <div className='line'>
                                                        <img src={birthDateIMG} alt="Birthday Date" title="Birthday Date" />
                                                        <p>{formatDateYMD(provider.birthDate)}</p>
                                                    </div>
                                                    <div className='line'>
                                                        <img src={nifIMG} alt="NIF" title="NIF"/>
                                                        <p>{provider.nif}</p>
                                                    </div>
                                                </td>

                                                <td className='contactProvider'>
                                                    <div className='line'>
                                                        <img src={phoneIMG} alt="Phone Number" title="Phone Number"/>
                                                        <p>{provider.phone}</p>
                                                    </div>
                                                    <div className='line'>
                                                        <img src={emailIMG} alt="Email" title="Email"/>
                                                        <p>{provider.email}</p>
                                                    </div>
                                                </td>
                            
                                                <td className='reviewsProvider'>
                                                    <div className='line'>
                                                        <img src={starIMG} alt="Average Rating" title="Average Rating" />
                                                        <p>Average Rating: {provider.averageRating} out of 5 ({provider.numberOfReviews} ratings)</p>
                                                    </div>
                                                    <div className='line'>
                                                        <img src={numberTasksIMG} alt="Number of Tasks Done" title="Number of Tasks Done"/>
                                                        <p>Number of Tasks Done: {provider.numberOfReviews}</p>
                                                    </div>
                                                    <div className='line'>
                                                        <Link className='linkToProvider' to={buildLinkProvider(provider.id)} >See More</Link>
                                                    </div>
                                                </td>

                                                {provider.state == "accepted" ?
                                                <td className='stateProvider'><img src={verifyIMG} alt="Verified" title='Verified' /></td>
                                                : provider.state == "rejected" ?
                                                <td className='stateProvider'><img src={rejectedIMG} alt="Verified" title='Verified' /></td>
                                                : 
                                                <td className='stateProvider'><img src={pendingIMG} alt="Verified" title='Verified' /></td>
                                                }


                                                <td className='buttonsProvider'>
                                                    {provider.state == "accepted" ?
                                                    <button onClick={() => {
                                                        rejectProvider(index)
                                                    }}>
                                                        Disapprove Provider
                                                    </button>
                                                    : provider.state == "rejected" ?
                                                    <></>
                                                    : 
                                                    <div className='twoButtons'>
                                                        <button onClick={() => {
                                                            approveProvider(index)
                                                        }}>
                                                            Accept Provider
                                                        </button>
                                                        <button onClick={() => {
                                                            rejectProvider(index)
                                                        }}>
                                                            Reject Provider
                                                        </button>
                                                    </div>
                                                    }
                                                </td>
                                                

                                            </tr>
                                        )
                                    }
                                    else {
                                        return(<></>)
                                    }
                                    })
                                }
                        </table>
                    </div>
            </div>
            
            <Footer></Footer>
            </>
        )
    }else {
        return (<></>)
    }
} else {
    navigate("/")
    return (<></>)
}

}

export default ManageProviders