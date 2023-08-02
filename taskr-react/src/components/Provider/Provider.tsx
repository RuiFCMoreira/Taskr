import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IProvider } from '../../interfaces/IProvider';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import './Provider.css'
import mail from './images/mail.png'
import phone from './images/phone-call.png'
import estrela from './icon/estrela.png'
import verifica from './icon/verifica.png'
import accepted from './images/verify.png'
import rejected from './images/prohibition.png'
import pending from './images/pending.png'
import { IProviderService } from '../../interfaces/IProviderService';
import axios, { AxiosResponse } from 'axios';
import { hostname } from '../vars';
import { durationToString } from '../../utils'
import { Link } from 'react-router-dom';
import { IReview } from '../../interfaces/IReview';

export interface ServiceDisplay {
  categoryName: string;
  categoryDescription: string;
  services: IProviderService[];
}



const Provider = () => {
  const { providerId } = useParams();
  const [provider, setProviderData] = useState<IProvider>({
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
    review : null,
  });

  const [serviceDisplay, setServiceDisplay] = useState<ServiceDisplay[]>([])
  const [serviceReviews, setServiceReviews] = useState<IReview[]>([])

  const [categoryDisplay, setCategoryDisplay] = useState<string>("")
  const [load, setLoad] = useState(0)
  const [loadReview, setLoadReview] = useState(0)
  const [typeServiceName, setTypeServiceName] = useState<String>("")

  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {

        if (load == 0) {
          const response = await axios.get(hostname + 'users/providers/' + providerId)

          setProviderData(response.data)
          const providerAux = response.data

          let serviceDisplayAux: ServiceDisplay[] = []
          for (let i = 0; i < providerAux.providerServices.length; i++) {
            let new_category: boolean = true
            for (let j = 0; j < serviceDisplayAux.length; j++) {
              if (providerAux.providerServices[i].serviceType.serviceCategory.name === serviceDisplayAux[j].categoryName) {
                serviceDisplayAux[j].services.push(providerAux.providerServices[i])
                new_category = false
              }
            }
            if (new_category) {
              let display: ServiceDisplay = {
                categoryName: providerAux.providerServices[i].serviceType.serviceCategory.name,
                categoryDescription: providerAux.providerServices[i].serviceType.serviceCategory.description,
                services: [providerAux.providerServices[i]]
              }
              serviceDisplayAux.push(display)
            }
          }
          if (serviceDisplayAux.length > 0) {
            setCategoryDisplay(serviceDisplayAux[0].categoryName)
          }
          setServiceDisplay(serviceDisplayAux)
          setLoad(1)
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        navigate("/")
      }
    };
    fetchData();
  }, []);

  function handleViewReview(typeId: number) {
    const fetchReviews = async () => {
      try {
        axios.get(hostname + 'users/providers/' + providerId + '/reviews', {
          params: {
            typeId: typeId,
          }
        }).then((response) => {
          setServiceReviews(response.data)
          console.log(response.data)
        })
        setLoadReview(1)


      } catch (error) {
        console.error('Error fetching reviews:', error);
        navigate("/")
      }
    };
    fetchReviews();
  }


  return (
    <>
      <Navbar></Navbar>
      {load ?   <>
        <div className='Provider'>
          <div className='profile'>
            <div className='image'>
              <img src={provider.photo} alt=""></img>
            </div>
            <div className='providerInfo'>
            {provider.state=="accepted" ? 
              <p className='nome'>{provider.name} <img className="verifyProvider" src={accepted} alt="" title="Verified"></img> </p>
              : provider.state=="rejected" ?
              <p className='nome'>{provider.name} <img className="verifyProvider" src={rejected} alt="" title="Rejected"></img> </p>
              :
              <p className='nome'>{provider.name} <img className="verifyProvider" src={pending} alt="" title="Pending"></img> </p>
              }
              
              <p><img src={estrela} alt="" />Average Rating: {provider.averageRating} out of 5 ({provider.numberOfReviews} ratings)</p>
              <p><img src={verifica} alt="" />Number of completed tasks: {provider.numberOfReviews}</p>
              <p><img src={phone} alt="" />Contact: {provider.phone}</p>
              <p><img src={mail} alt="" />Email: {provider.email}</p>
            </div>
          </div>
          <div className='line'>
            <div className="line2"></div>
          </div>
          <div className='services'>
            <h3 className='service-title'>Services</h3>
            {serviceDisplay.length !== 0 ?
              <>
                <div className='button-moving'>
                  {serviceDisplay.map((category, index) => (<>

                    <button
                      key={index}
                      className={categoryDisplay == category.categoryName ? 'buttonSelected' : 'butonFree'}
                      onClick={() => {
                        setCategoryDisplay(category.categoryName)
                        setLoadReview(0)
                      }}
                    >{category.categoryName}
                    </button>

                  </>
                  ))}
                </div>

                {serviceDisplay.map((category, index) => (
                  <>
                    {category.categoryName === categoryDisplay && (
                      <div className="service-category" id={category.categoryName}>
                        <div className="service-category-info">
                          <p>{category.categoryDescription}</p>
                        </div>
                        <div className='services-info'>
                          {category.services.map((service, index) => (
                            <div className='service-info'>
                              <div className='service-name'>
                                <h3>{service.serviceType.name} </h3>
                                <p className='price'>{service.pricePerHour}€/h</p>
                              </div>
                              <p><strong>Description:</strong> {service.description} </p>
                              <p><strong>Expected Duration:</strong> {durationToString(service.expectedDuration)}</p>
                              <p><strong>Average Rating:</strong> {service.averageRating} out of 5 ({service.numberOfReviews} ratings)</p>
                              <p><strong>Number Of Reviews:</strong> {service.numberOfReviews} </p>
                              <p><strong>Number Of Completed Tasks: </strong>{service.numberOfCompletedTasks} </p>
                              <button onClick={() => {
                                setTypeServiceName(service.serviceType.name)
                                setLoadReview(0)
                                handleViewReview(service.serviceType.id)
                              }
                              }>View Reviews</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ))}

                {loadReview === 1 && (
                  <>
                    <div className='ReviewsContent'>
                      <div className='reviewTitle'>
                        <p>Reviews</p>
                      </div>
                      {serviceReviews.length > 0 && (<>

                        <div className='reviewHeader' >
                          <table>
                            <tr>
                              <td className='columnService'>Service</td>
                              <td className='columnDescription'>Description</td>
                              <td className='columnRating'>Rating</td>
                            </tr>
                          </table>
                        </div>
                        <div className='reviewList'>
                          <table>
                            {serviceReviews.map((review, index) => (
                              <>
                                <tr>
                                  <td className='columnService'>{typeServiceName}</td>
                                  <td className='columnDescription'>{review.description}</td>
                                  <td className='columnRating'>{review.rating}</td>
                                </tr>
                              </>
                            ))}
                          </table>
                        </div>
                      </>
                      )}

                      {serviceReviews.length === 0 && (<>
                        <p>This service doesn't have any reviews yet.</p>

                      </>)}

                    </div>
                  </>

                )}

              </>
              :
              <>
                <p>I don't have any service yet</p>
              </>}
          </div>
        </div>
      </>
      : null
      }
      <Footer></Footer>
    </>
  );
};

export default Provider;