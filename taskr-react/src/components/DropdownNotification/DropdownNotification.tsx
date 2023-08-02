import './DropdownNotification.css'
import notification from './images/notification.png'
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import {INotification } from '../../interfaces/INotification';
import { hostname } from '../vars';
import axios from 'axios';
import pay from './images/pay.png'
import cancel from './images/close.png'
import order_accepted from './images/accept.png'
import order_rejected from './images/refuse.png'
import review from './images/star.png'
import new_order from './images/order.png'
import other from './images/other.png'
import activeNot from './images/notification-activated.png'
import { Link } from 'react-router-dom';



const DropdownNotification = () => {
   
  const [notifications,setNotifications] = useState<INotification[]>([])
  const [load, setLoad] = useState(false)

  useEffect(()=>{
    
      const fetchData = async () => {
        try {

                const logged = window.localStorage.getItem("logged");
                var id = ""
                if(logged){
                    const json = JSON.parse(logged)    
                    id = json.id
                }

                const response = await axios.get(hostname + `users/${id}/notifications`)
                
                if(response.data.length === 0){
                  setNotifications([{id:-1, notification:"There are no pending notifications", type:'OTHER', referTo:'-' }])
                  setLoad(true)
                }else {
                  setNotifications(response.data)
                  setLoad(true)
                }
                
                
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
      fetchData();
  },[])


  const deleteNotification = async (id:number, index:number) => {
    

      try {
        const response = await axios.delete(hostname + `users/notification/${id}`)
        
        var auxNotifications = [...notifications]
        auxNotifications.splice(index,1)

        if(auxNotifications.length === 0){
          auxNotifications.push({id:-1, notification:"There are no pending notifications", type:'OTHER', referTo:'-' })
        }

        setNotifications(auxNotifications)

    
        
      } catch (error) {
        console.log(error)
      }
    };

  
    if(load){
      return (

        <Dropdown >
        <Dropdown.Toggle   style={{background:"white",border:"none"}} variant="warning" id="dropdown-basic">
          <img src={notifications[0].type != 'OTHER' ? activeNot : notification}></img>
        </Dropdown.Toggle>
        <Dropdown.Menu  style={{width:'300px'}}>
          {
            notifications.map((notification, index)=>{
              return(
                <div className='drop-item'>
                  {notification.type === 'PAY' ? 
                  <Link to={`/pay/${notification.referTo}`} className='no-link'>
                    <img className="left-image" src={pay}></img>
                    <p>{notification.notification}</p>
                  </Link> :<>
                  
                    {notification.type === 'ORDER_ACCEPTED' ? <img className="left-image" src={order_accepted}></img> :<></>}
                    {notification.type === 'ORDER_REJECTED' ? <img className="left-image" src={order_rejected}></img> :<></>}
                    {notification.type === 'ORDER_PAID' ? <img className="left-image" src={pay}></img> :<></>}
                    {notification.type === 'ORDER_REVIEWED' ? <img className="left-image" src={review}></img> :<></>}
                    {notification.type === 'NEW_ORDER' ? <img className="left-image" src={new_order}></img> :<></>}
                    {notification.type === 'OTHER' ? <img className="left-image" src={other}></img> :<></>}
                    <p>{notification.notification}</p>
                    {notification.type !== 'OTHER' ? <img className='delete-notification' src={cancel} onClick={() => deleteNotification(notification.id, index)}/> : <></>}
                  
                  </>}
                  
                  
                </div>
              )
            })
          }
    
        </Dropdown.Menu>
      </Dropdown>
      )
    }else {
      return <></>
    }

  
}

export default DropdownNotification