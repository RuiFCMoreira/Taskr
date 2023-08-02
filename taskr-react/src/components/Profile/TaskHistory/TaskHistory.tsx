import axios from 'axios';
import './TaskHistory.css'
import { useEffect, useState } from 'react';
import { hostname } from '../../vars';
import { IOrder } from '../../../interfaces/IOrder';
import { formatDateHour,durationToString,priceFinal,orderList } from '../../../utils';
import completed from './images/completed.png'
import rejected from './images/rejected.png'
import paid from './images/money.png'
import { IProvider } from '../../../interfaces/IProvider';
import { Link, useNavigate } from 'react-router-dom';
import { IReview } from '../../../interfaces/IReview';

 
const TaskHistory = () => {

    const logged = window.localStorage.getItem("logged");
    var typeUser = ""
    var id = ""
    if (logged) {
        const json = JSON.parse(logged)
        typeUser = json.type
        id = json.id
    }
    const [ordersData, setOrdersData] = useState<IOrder[]>([])
    const [load, setLoad] = useState(false)
    const [menuAddReview, setMenuAddReview] = useState(false)
    const [orderReview, setOrderReview] = useState<IOrder>()
    const [providerReview, setProviderReview] = useState<IProvider>()
    const [reload, setReload] = useState(0)
    const [reviewDescription, setReviewDescription] = useState("")
    const [starsRating, setStarsRating] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (typeUser == "client") {
                    let responseCompleted = await axios.get(hostname + 'users/clients/' + id + '/orders?orderState=completed')
                    let responseRejected = await axios.get(hostname + 'users/clients/' + id + '/orders?orderState=rejected')
                    let responsePaid = await axios.get(hostname + 'users/clients/' + id + '/orders?orderState=paid')
                    let data = responseCompleted.data.concat(responseRejected.data).concat(responsePaid.data)
                    data = orderList(data)
                    setOrdersData(data)
                }
                if (typeUser == "provider") {
                    let responseCompleted = await axios.get(hostname + 'users/providers/' + id + '/orders?orderState=completed')
                    let responseRejected = await axios.get(hostname + 'users/providers/' + id + '/orders?orderState=rejected')
                    let responsePaid = await axios.get(hostname + 'users/providers/' + id + '/orders?orderState=paid')
                    let data = responseCompleted.data.concat(responseRejected.data).concat(responsePaid.data)
                    data = orderList(data)
                    setOrdersData(data)
                }
                setLoad(true)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();

    }, [load]);


    const handleSubmitReview = async () => {
        if (orderReview!=undefined){
            let rating = getRating()
            axios.post(hostname + 'orders/'+orderReview.id+'/review',{
                description:reviewDescription,
                rating:rating,
            }).then((response) => {
                var ind = ordersData.findIndex((order => order.id == orderReview.id))
                let newOrders = ordersData

                const newReview : IReview = {
                    description: reviewDescription,
                    rating:rating,
                    id:0,
                }
                newOrders[ind].review = newReview
                setOrdersData(newOrders)
                setMenuAddReview(false)
                setReload(reload+1)
            }).catch((response)=> {
                alert('Failed to submit review')
            })
        }
        
    }

    const getProviderReview = async (order : IOrder) => {
        setOrderReview(order)

        let response
        console.log(order,providerReview)
        if (order != undefined) {
            if (providerReview == undefined) {
                console.log("entrei no get Provider primeira vez")
    
                response = await axios.get(hostname + 'users/providers/' + order.providerId)
                    .then((response) => {
                        console.log(response.data)
                        setProviderReview(response.data)
                        setReload(reload+1)
                        setMenuAddReview(true)
    
                    }).catch((response) => {
                        console.log(response.data)
                    })
            } else if (order.providerId == providerReview.id) {
                console.log("entrei no get Provider")
    
                response = await axios.get(hostname + 'users/providers/' + order.providerId)
                    .then((response) => {
                        console.log(response.data)
                        setProviderReview(response.data)
                        setReload(reload+1)
                        setMenuAddReview(true)
    
                    }).catch((response) => {
                        console.log(response.data)
                    })
            }
        }

    }

    function getRating() {
        const radioInputs = document.getElementsByName('stars'); 

        let rating = 0
        for (let i = 0; i < radioInputs.length; i++) {
          const radioInput = radioInputs[i] as HTMLInputElement;
          
          if (radioInput.checked) {
            rating = i + 1
          }
        }
        return rating;
    }
    

    useEffect(() => { }, [reload]);

    if (load) {
        return (
            <div className='TaskHistory'>
                <div className='taskHistoryHeader'>
                    {menuAddReview == false? <p>Task History</p> : <p>Submit Review</p> }
                    {menuAddReview == true &&
                        <button
                            onClick={() => {
                                setMenuAddReview(false)
                                setReload(reload+1)
                            }}>
                            Back
                        </button>}
                </div>
                <div className='taskHistoryContent'>
                    {menuAddReview == false && <>
                        <div className='taskHeader'>
                            <table>
                                <tr>
                                    <td className='columnState2'>State</td>
                                    <td className='columnDate2'>Date and Hour</td>
                                    <td className='columnDescription2'>Description</td>
                                    <td className='columnCategory2'>
                                        <div>Category</div>
                                        <div>Type of Service</div>
                                    </td>
                                    {typeUser == "provider" ?
                                        <></>
                                        :
                                        <td className='columnProvider2'>Provider</td>
                                    }
                                    <td className='columnDuration2'>Duration</td>
                                    <td className='columnPrice2'>Price per Hour</td>

                                    <td className='columnReviewDescription2'>Review Description</td>
                                    <td className='columnReviewRating2'>Review Rating</td>

                                </tr>
                            </table>
                        </div>
                        <div className='tasksList'>
                            <table>

                                {
                                    ordersData.map((order, index) => {
                                        function buildLinkProvider(providerId: number) {
                                            return "/provider/"+providerId
                                        }

                                        return (
                                            <tr>
                                                {order.state == "completed" ?
                                                    <td className='columnState2'>
                                                        <img className="state" src={completed} alt="Completed" title='Completed' />
                                                    </td>
                                                    : 
                                                    order.state == "rejected" ?
                                                    <td className='columnState2'>
                                                        <img className="state" src={rejected} alt="Rejected" title='Rejected' />
                                                    </td>
                                                    :
                                                    <td className='columnState2'>
                                                        <img className="state" src={paid} alt="Paid" title='Paid' />
                                                    </td>
                                                }

                                                <td className='columnDate2'>{formatDateHour(order.datehour)}</td>
                                                <td className='columnDescription2'>{order.description}</td>
                                                <td className='columnCategory2'>
                                                    <div>{order.serviceType.serviceCategory.name}</div>
                                                    <div>{order.serviceType.name}</div>
                                                </td>
                                                {typeUser == "provider" ?
                                                    <></>
                                                    :
                                                    <td className='columnProvider2'>
                                                        <Link className='linkToProvider' to={buildLinkProvider(order.providerId)} >See Profile</Link>
                                                        
                                                    </td>
                                                }
                                                <td className='columnDuration2'>{durationToString(order.duration)}</td>
                                                <td className='columnPrice2'>{order.pricePerHour}€</td>


                                                {typeUser == "provider" && ((order.state == "paid" || order.state == "completed") ?
                                                    order.review == null ?
                                                        <>
                                                            <td className='columnReviewDescriptionNotReview2'>Not reviewed yet</td>
                                                            <td className='columnReviewRating2'></td>
                                                        </>
                                                        :
                                                        <>
                                                            <td className='columnReviewDescription2'>{order.review.description}</td>
                                                            <td className='columnReviewRating2'>{order.review.rating}★</td>
                                                        </>
                                                    :
                                                    <>
                                                        <td className='columnReviewDescription2'>-</td>
                                                        <td className='columnReviewRating2'>-</td>
                                                    </>)
                                                }
                                                {typeUser == "client" && (order.state == "paid" ? (
                                                    order.review == null ?
                                                        <>
                                                            <td className='columnReviewDescription2'>
                                                                <><button className='ButtonYes'
                                                                    onClick={() => {
                                                                        getProviderReview(order)
                                                                    }}>
                                                                    Add Review
                                                                </button></>
                                                            </td>
                                                            <td className='columnReviewRating2'></td>
                                                        </>
                                                        :
                                                        <>
                                                            <td className='columnReviewDescription2'>{order.review.description}</td>
                                                            <td className='columnReviewRating2'>{order.review.rating}★</td>
                                                        </>)
                                                    : order.state == "completed" ? 
                                                    <>
                                                    <td className='columnReviewDescription2'>
                                                                <><button className='ButtonYes'
                                                                    onClick={() => {
                                                                        navigate("/pay/"+order.id)
                                                                    }}>
                                                                    Pay
                                                                </button></>
                                                            </td>
                                                            <td className='columnReviewRating2'></td>
                                                    </>
                                                    :
                                                    <>
                                                        <td className='columnReviewDescription2'>-</td>
                                                        <td className='columnReviewRating2'>-</td>
                                                    </>)
                                                }

                                            </tr>
                                        )
                                    })}
                            </table>
                        </div>
                    </>}


                    {menuAddReview == true  && orderReview != undefined && providerReview != undefined && <>
                        <h2>Order Info:</h2>
                        <div className='taskHistoryReview'>
                            <div className='taskHistoryReviewLeft'>
                                <div className='taskHistoryReviewLeftLine'>
                                    <p className='Bold'>Date:</p>
                                    <p>{formatDateHour(orderReview.datehour)}</p>
                                </div>
                                <div className='taskHistoryReviewLeftLine'>
                                    <p className='Bold'>Description of task:</p>
                                    <p>{orderReview.description}</p>
                                </div>
                                <div className='taskHistoryReviewLeftLine'>
                                    <p className='Bold'>Category:</p>
                                    <p>{orderReview.serviceType.serviceCategory.name}</p>
                                </div>
                                <div className='taskHistoryReviewLeftLine'>
                                    <p className='Bold'>Type of Service:</p>
                                    <p>{orderReview.serviceType.name}</p>
                                </div>
                            </div>
                            <div className='taskHistoryReviewRight'>
                                <div className='taskHistoryReviewProvider'>

                                    <div className='taskHistoryReviewProviderLeft'>
                                        <img className="photoProvider" src={providerReview.photo} alt=""></img>
                                    </div>
                                    <div className='taskHistoryReviewProviderRight'>
                                        <div className='taskHistoryReviewRightLine'>
                                            <p className='Bold'>Name:</p>
                                            <p>{providerReview.name}</p>
                                        </div>
                                        <div className='taskHistoryReviewRightLine'>
                                            <p className='Bold'>Average Rating:</p>
                                            <p>{providerReview.averageRating}</p>
                                        </div>
                                        <div className='taskHistoryReviewRightLine'>
                                            <p className='Bold'>Duration:</p>
                                            <p>{durationToString(orderReview.duration)}</p>
                                        </div>
                                        <div className='taskHistoryReviewRightLine'>
                                            <p className='Bold'>Price per Hour:</p>
                                            <p>{orderReview.pricePerHour}€</p>
                                        </div>
                                        <div className='taskHistoryReviewRightLine'>
                                            <p className='Bold'>Final Price:</p>
                                            <p>{priceFinal(orderReview.duration,orderReview.pricePerHour)}€</p>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className='taskHistoryReviewAdd'>
                            <div className='taskHistoryReviewInputs'>
                                <div className='descriptionReview'> 
                                    <input type="text"
                                            className="ReviewDescription"
                                            placeholder="Description of Review" 
                                            autoFocus
                                            id ="description"
                                            name="description"
                                            value={reviewDescription}
                                            onChange={(e) =>
                                                setReviewDescription(e.target.value)}
                                        />
                                </div>
                                <div className='ratingReview'>
                                    <form className="rating" name="rating">
                                        <label>
                                            <input type="radio" name="stars" value="1"/>
                                            <span className="icon">★</span>
                                        </label>
                                        <label>
                                            <input type="radio" name="stars" value="2" />
                                            <span className="icon">★</span>
                                            <span className="icon">★</span>
                                        </label>
                                        <label>
                                            <input type="radio" name="stars" value="3" />
                                            <span className="icon">★</span>
                                            <span className="icon">★</span>
                                            <span className="icon">★</span>
                                        </label>
                                        <label>
                                            <input type="radio" name="stars" value="4" />
                                            <span className="icon">★</span>
                                            <span className="icon">★</span>
                                            <span className="icon">★</span>
                                            <span className="icon">★</span>
                                        </label>
                                        <label>
                                            <input type="radio" name="stars" value="5" />
                                            <span className="icon">★</span>
                                            <span className="icon">★</span>
                                            <span className="icon">★</span>
                                            <span className="icon">★</span>
                                            <span className="icon">★</span>
                                        </label>
                                    </form>
                                    <button
                                        onClick={() => {
                                            let text = "Are you sure you want to submit this review? This action cannot be undone.";
                                            let text0 = "Are you sure you want to submit this review with 0 stars? This action cannot be undone."
                                            if (getRating() == 0){
                                                if (window.confirm(text0) == true) {
                                                    handleSubmitReview()                                                        
                                                }
                                            }else {
                                                    if (window.confirm(text) == true) {
                                                        handleSubmitReview()                                                        
                                                    }
                                                }
                                            }}
                                            
                                              
                                        >
                                    Submit Review
                                    </button>
                                </div>
                            </div>

                            
                        </div>

                    </>}
                </div>
            </div>
        )

    } else {
        return (
            <div className='TaskHistory'>
                <div className='taskHistoryHeader'>
                    <p>Task History</p>
                </div>
                <div className='taskHistoryContent'>

                </div>
            </div>
        )
    }



}

export default TaskHistory