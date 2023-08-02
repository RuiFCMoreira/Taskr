import './Tasks.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { useEffect, useState } from "react"
import { IOrder } from "../../interfaces/IOrder"
import { hostname } from "../vars"
import axios from "axios"
import { formatDateHour,durationToString,orderList} from '../../utils'
import { Link } from 'react-router-dom'
import pending from './images/pending.png'
import accepted from './images/accepted.png'
import { Temporal } from '@js-temporal/polyfill';

const Tasks = () => {
    
    const logged = window.localStorage.getItem("logged");
    var typeUser = "" 
    var id= ""
    if(logged){
        const json = JSON.parse(logged)    
        typeUser = json.type
        id = json.id
    }
    const [ordersData, setOrdersData] = useState<IOrder[]>([]) 
    const [load, setLoad] = useState(false)
    const [reload, setReload] = useState(0)


    useEffect(() => {
        const fetchData = async () => {
          try {
            if (typeUser=="client"){
                let responsePending = await axios.get(hostname + 'users/clients/'+id+'/orders?orderState=pending')
                let responseAccepted = await axios.get(hostname + 'users/clients/'+id+'/orders?orderState=accepted')
                let data = responsePending.data.concat(responseAccepted.data)
                data = orderList(data)
                setOrdersData(data)   
            }
            if (typeUser=="provider"){
                let responsePending = await axios.get(hostname + 'users/providers/'+id+'/orders?orderState=pending')
                let responseAccepted = await axios.get(hostname + 'users/providers/'+id+'/orders?orderState=accepted')
                let data = responsePending.data.concat(responseAccepted.data)
                data = orderList(data)
                setOrdersData(data)   
            }
            
            setLoad(true)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
        
      }, []);


    useEffect(() => {},[reload]);

    function removeTask(index: number) {
        const orderRemoved = ordersData[index]

        axios.post(hostname + 'orders/' + orderRemoved.id + '/cancel')
        .then((response) => {
            let newOrdersData = ordersData
            newOrdersData.splice(index,1)
            setOrdersData(newOrdersData)
            setReload(reload+1)

        }).catch((response) => {
            alert('Failed to remove task')
            console.log(response.body)
        })
        
    }


    function acceptTask(index: number) {
        const orderAccept = ordersData[index]

        axios.post(hostname + 'orders/' + orderAccept.id + '/accept')
        .then((response) => {
            orderAccept.state = "accepted"
            let newOrdersData = ordersData
            newOrdersData[index]=orderAccept
            setOrdersData(newOrdersData)
            setReload(reload+1)

        }).catch((response) => {
            alert('Failed to accept task')
            console.log(response.body)
        })
    }

    function isValidDuration(duration: string ) { 
        const zipCodePattern: RegExp = /^\d\d:\d\d$/;
        return zipCodePattern.test(duration);    
    }


    function rejectTask(index: number) {
        const orderRejected = ordersData[index]

        axios.post(hostname + 'orders/' + orderRejected.id + '/reject')
        .then((response) => {
            let newOrdersData = ordersData
            newOrdersData.splice(index,1)
            setOrdersData(newOrdersData)
            setReload(reload+1)

        }).catch((response) => {
            alert('Failed to reject task')
            console.log(response.body)
        })
        
    }

    function completeTask(index: number, duration:string) {
        var hours = parseFloat(duration.split(":")[0])
        var minutes = parseFloat(duration.split(":")[1])
        const finalDuration = Temporal.Duration.from({ hours: hours, minutes: minutes });
        const orderCompleted = ordersData[index]
        console.log(orderCompleted.id)
        axios.post(hostname + 'orders/' + orderCompleted.id + '/completed',{
            duration:finalDuration
        })
        .then((response) => {
            let newOrdersData = ordersData
            newOrdersData.splice(index,1)
            setOrdersData(newOrdersData)
            setReload(reload+1)

        }).catch((response) => {
            alert('Failed to complete task')
            console.log(response.body)
        })
    }



        return (
            <>
            <Navbar></Navbar>
            <div className='TasksPendingTitle'>
                {typeUser=="provider"?
                <h2>Tasks To do</h2>
                :
                <h2>Submited Tasks</h2>}
            </div>
            <div className='TasksPendingContent'>
                <div className='taskHeader'>
                    <table>
                                <tr>
                                    <td className='columnState'>State</td>
                                    <td className='columnDate'>Date and Hour</td>
                                    <td className='columnAdress'>Address</td>
                                    <td className='columnDescription'>Description</td>
                                    <td className='columnCategory'>
                                        <div>Category</div>
                                        <div>Type of Service</div>
                                    </td>
                                    
                                    {typeUser=="provider"?
                                        <></>
                                        :
                                        <td className='columnProvider'>Provider</td>
                                        }
                                    
                                    <td className='columnDuration'>Expected Duration</td>
                                    <td className='columnPrice'>Price per Hour</td>
                                    <td className='columnButtonCancel'></td>
                                </tr>
                    </table>
                </div>
                <div className='tasksList'>
                    <table>
                       
                            {
                            ordersData.map((order,index) => {
                                function buildLinkProvider(providerId: number) {
                                    return "/provider/"+providerId
                                }
                                console.log(order.address)
                                return(
                                    <tr>
                                        {order.state == "accepted" ?
                                                    <td className='columnState'>
                                                        <img className="state" src={accepted} alt="Accepted" title='Accepted from provider' />
                                                    </td>
                                                    :
                                                    <td className='columnState'>
                                                        <img className="state" src={pending} alt="Pending" title='Waiting response from provider' />
                                                    </td>
                                            }
                                        <td className='columnDate'>{formatDateHour(order.datehour)}</td>
                                        <td className='columnAdress'>
                                            <div>{order.address.street.split(',')[0]}</div>
                                            <div>{order.address.parish} - {order.address.municipality}</div>
                                            <div>{order.address.district} {order.address.street.split(',')[1]}</div>
                                        </td>
                                        <td className='columnDescription'>{order.description}</td>
                                        <td className='columnCategory'>
                                            <div>{order.serviceType.serviceCategory.name}</div> 
                                            <div>{order.serviceType.name}</div> 
                                        </td>
                                        
                                        {typeUser=="client"?
                                        <td className='columnProvider'>
                                            <Link className='linkToProvider' to={buildLinkProvider(order.providerId)} >See Profile</Link>            
                                        </td>
                                        :
                                        <></>
                                        }
                                        <td className='columnDuration'>{durationToString(order.duration)}</td>
                                        <td className='columnPrice'>{order.pricePerHour}€</td>
                                        <td className='columnButtonCancel'>
                                                {typeUser== "client" && order.state == "pending" ?
                                                <button 
                                                onClick={() => {
                                                    let text = "Are you sure you want to cancel this task?";
                                                    if (window.confirm(text) == true) {
                                                        removeTask(index)
                                                        
                                                    } else {
                                                    }
                                                }}>Cancel Task</button>
                                                : <></>
                                                }
                                                {typeUser== "provider" && order.state == "pending" ?
                                                <div className='buttonsAccceptRejectTask'>
                                                    <button onClick={() => {
                                                        let text = "Are you sure you want to accept this task?";
                                                        if (window.confirm(text) == true) {
                                                            acceptTask(index)
                                                        }
                                                    }}>Accept Task</button>
                                                    <button onClick={() => {
                                                        let text = "Are you sure you want to reject this task?";
                                                        if (window.confirm(text) == true) {
                                                            rejectTask(index)
                                                        }
                                                    }}>Reject Task</button>
                                                </div>
                                                : <></>
                                                }
                                                {typeUser== "provider" && order.state == "accepted" ?
                                                
                                                    <button onClick={() => {
                                                        let text = "Enter the effective duration of the task in format hh:mm!";
                                                        let text2 = "Incorrect duration format! Make sure you enter the duration in 'hours:minutes' format"!;
                                                        var duration = window.prompt(text,"00:00")
                                                        while (duration != null ){
                                                            if (isValidDuration(duration)) {
                                                                completeTask(index,duration)
                                                                duration = null
                                                            } else {
                                                                duration = window.prompt(text2,"00:00")
                                                            }
                                                            
                                                        }
                                                        // let text = "Are you sure you want to complete this task?";
                                                        // if (window.confirm(text) == true) {
                                                        //     completeTask(index)
                                                        // }
                                                    }}>Complete Task</button>
                                              
                                                : <></>
                                                }
                                        </td>
                                    </tr>
                                )
                            })} 

                        
                    </table>
                </div>
            </div>
            
            <Footer></Footer>
            </>
        )

}

export default Tasks




