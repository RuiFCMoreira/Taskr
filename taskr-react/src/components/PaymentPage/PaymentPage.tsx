import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import React, {useEffect, useState} from 'react';
import './PaymentPage.css'
import axios from 'axios'
import { hostname } from '../vars';
import mbway from './images/mbway.png'
import paypal from './images/paypal.png'
import visa from './images/visa.png'
import { useParams } from 'react-router-dom';
import { IOrder } from '../../interfaces/IOrder';
import { priceFinal } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePhone, validateName, validateVisaCardNumber, validateVisaExpiryDate, validateVisaCVV} from '../../utils';


const PaymentPage = () => {

    const navigate = useNavigate()
    const {id} = useParams()
    const paymentMethods = [{name:'MBWAY', img:mbway}, {name:'PAYPAL', img:paypal}, {name:'VISA', img:visa} ]
    const [paymentMethod, setPaymentMethod] = useState('MBWAY')
    const [order, setOrder] = useState<IOrder>()
    const [load ,setLoad] = useState(false)
    const [phone,setPhone] = useState('')
    const [email,setEmail] = useState('')
    const [name,setName] = useState('')
    const [cardNumber,setCardNumber] = useState('')
    const [expiryDate,setExpiryDate] = useState('')
    const [cvv,setCVV] = useState('')


    const changePayment = (name:string) => {
        setPaymentMethod(name)
        console.log(name)
    }


    useEffect(() => {
        const fetchData = async () => {
          try {
           
            const response = await axios.get(hostname + `orders/${id}`)
            setOrder(response.data)
            setLoad(true)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);



    const submitPayment = async () => {
        
        
        if(paymentMethod === 'MBWAY'){
            if(!validatePhone(phone)){
                alert('Please assign a valid phone number')
                return
            }
        }

        if(paymentMethod === 'PAYPAL'){
            if(!validateEmail(email)){
                alert('Please assign a valid email')
                return
            }
        }


        if(paymentMethod === 'VISA'){
            if(!validateName(name)){
                alert('Please assign a valid name')
                return
            }

            if(!validateVisaCardNumber(cardNumber)){
                alert('Please assign a valid VISA card number')
                return
            }

            if(!validateVisaExpiryDate(expiryDate)){
                alert('Please assign a valid VISA expiry date')
                return
            }
    
            if(!validateVisaCVV(cvv)){
                alert('Please assign a valid cvv')
                return
            }
        }
        
        
        try {

            const response = await axios.post(hostname + `orders/${id}/pay`)
            console.log(response)
            navigate('/')
         
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }  


      if(load){ 

        return(
            <>
            
            <Navbar></Navbar>
            <div className='payment-all'>
                <div className="payment-container">
                    
                    
                    <div className='payment-methods' >
                       
                            {
                                paymentMethods.map(({name,img})=>{
                                    return(
                                        <div className='paymentMethod' onClick={()=>changePayment(name)}>
                                            <img src={img}/>
                                        </div>   
                                    )
                                })
                            }
                            
                          
    
                    </div>
                    
                    <div className='show-price'>
                        <h5>Total Price: {order?.duration ? priceFinal(order?.duration,order?.pricePerHour) : 0} €</h5>
                    </div>
    
    
    
                    {paymentMethod === 'MBWAY' ?  
                        <div className='MBWAY'> 
                            <form onSubmit={(e)=> {
                                e.preventDefault()
                                submitPayment()
                                }}>
                               
                                <div className="form-group">
                                    <label> MBWAY Phone Number</label>
                                    <input type="text" id="mbwayNumber" name="mbwayNumber" required onChange={(e)=>{setPhone(e.target.value)}}></input>
                                </div>
                                <button className="button" type="submit" >Submit Payment</button>
                            </form>
                        </div>:<></>}
    
                    {paymentMethod === 'PAYPAL' ?  
                        <div className='PAYPAL'> 
                            <form onSubmit={(e)=> {
                                e.preventDefault()
                                submitPayment()
                                }}>
                               
                               <div className="form-group">
                                   <label> PAYPAL Mail</label>
                                   <input type="text" id="mbwayNumber" name="mbwayNumber" required onChange={(e)=>{setEmail(e.target.value)}}></input>
                               </div>
                               <button className="button" type="submit" >Submit Payment</button>
                           </form>
                            
                        
                        </div>:<></>}
    
                    {paymentMethod === 'VISA' ?  
                        <div className='VISA' > 
                            <form onSubmit={(e)=> {
                                e.preventDefault()
                                submitPayment()
                                }}>
                                <div className="form-group">
                                    <label> Name on Card</label>
                                    <input type="text" id="name" name="name" required onChange={(e)=>{setName(e.target.value)}}></input>
                                </div>
                                <div className="form-group">
                                    <label> Card Number</label>
                                    <input type="text" id="cardNumber" name="cardNumber" required onChange={(e)=>{setCardNumber(e.target.value)}}></input>
                                </div>
                                <div className="form-group">
                                    <label> Expiry Date</label>
                                    <input type="text" id="expiryDate" name="expiryDate" required onChange={(e)=>{setExpiryDate(e.target.value)}}></input>
                                </div>
                                <div className="form-group">
                                    <label> CVV</label>
                                    <input type="password" id="cvv" name="cvv" required onChange={(e)=>{setCVV(e.target.value)}}></input>
                                </div>
                                <button className="button" type="submit" >Submit Payment</button>
                            </form>
    
                        </div>:<></>}
    
    
                </div>
                </div>
            
            <div className='footer-container'>
            <Footer ></Footer>
            </div>
            
            </>
        )

      }else {
        return <></>
      }
    
}

export default PaymentPage