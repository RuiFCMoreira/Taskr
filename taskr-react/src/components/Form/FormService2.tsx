import './FormService2.css'
import { useEffect, useState } from 'react'
import estrela from './icon/estrela.png'
import verifica from './icon/verifica.png'
import { FormDataProps } from './Form'
import axios from 'axios'
import { hostname } from '../vars'
import { IProvider } from '../../interfaces/IProvider'
import { IProviderService } from '../../interfaces/IProviderService'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'



function getServicePrice(providerServices: IProviderService[], id: Number) {
  for (var providerService of providerServices) {
    if (providerService.serviceType.id === id) {
      return providerService.pricePerHour
    }
  }
  return '-'
}

function getServiceDescription(providerServices: IProviderService[], id: Number) {
  for (var providerService of providerServices) {
    if (providerService.serviceType.id === id) {
      return providerService.description
    }
  }
  return false
}

function getServiceRating(providerServices: IProviderService[], id: Number) {
  for (var providerService of providerServices) {
    if (providerService.serviceType.id === id) {
      if (providerService.numberOfCompletedTasks === 0)
        return "No reviews yet."
      return providerService.averageRating.toFixed(1) + ' (' + providerService.numberOfReviews.toString() + ')'
    }
  }
  return '0.0 (0)'
}

function getServiceDone(providerServices: IProviderService[], id: Number) {
  for (var providerService of providerServices) {
    if (providerService.serviceType.id === id) {
      return providerService.numberOfCompletedTasks
    }
  }
  return 0
}

function getServiceName(providerServices: IProviderService[], id: number) {
    
    for (var providerService of providerServices) {
      if (providerService.serviceType.id === id) {
        return providerService.serviceType.name;
      }
    }
  
  return "";
}


export default function FormService2({ formData, setFormData }: FormDataProps) {

  const providersPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [orderedList, setOrdenar] = useState<IProvider[]>([]);
  const defaultOrderBy:string = "price"
  const [reload, setReload] = useState(0)

  
  useEffect(() => {
    const fetchData = async () => {
      try {


        const response = await axios.get(hostname + 'users/providers', {
          params: {
            district:formData.district,
            municipality:formData.municipality,
            state:"accepted",
            typeId: formData.typeServiceId
          }
        })
        setOrdenarLista(response.data,defaultOrderBy)
       

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    console.log('reload')
  }, [reload]);

  


  const startIndex = (currentPage - 1) * providersPerPage;
  const endIndex = startIndex + providersPerPage;
  const paginatedProviders:IProvider[] = orderedList.slice(startIndex, endIndex);

  const totalPages = Math.ceil(orderedList.length / providersPerPage);




  function setOrdenarLista(list:IProvider[], e: string) {
    
    if (e === "price") {
      list.sort((providerA: IProvider, providerB: IProvider) => {
        const priceA = getServicePrice(providerA.providerServices, formData.typeServiceId);
        const priceB = getServicePrice(providerB.providerServices, formData.typeServiceId);
  
        if (priceA < priceB) {
          return -1;
        } else if (priceA > priceB) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    else if (e === "tasks"){
      list.sort((providerA: IProvider, providerB: IProvider) => {
        const taskCompletedA = getServiceDone(providerA.providerServices, formData.typeServiceId);
        const taskCompletedB = getServiceDone(providerB.providerServices, formData.typeServiceId);
  
        if (taskCompletedA < taskCompletedB) {
          return 1;
        } else if (taskCompletedA > taskCompletedB) {
          return -1;
        } else {
          return 0;
        }
      });
    }
    
    setOrdenar(list);
    setReload(reload + 1)
  
  }
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  return (
    <>
      <div className='FormService2'>
        {orderedList.length > 0 && (
          <div className="container-button-grouporder">
            <button
              className="prev"
              disabled={formData.page == 0}
              onClick={() => {
                setFormData({ ...formData, page: formData.page - 1 })
              }}>
              Prev
            </button>
            <div className='groupOrder'>
              <div className='order'>
                Order By:
              </div>
              <div className="orderby">
                <select onChange={(e) => setOrdenarLista(orderedList,e.target.value)}>
                  <option value="price" disabled defaultValue="price">
                    Price
                  </option>
                  <option value="price">Price</option>
                  <option value="tasks">Jobs Done</option>
                </select>
              </div>
            </div>
          </div>
        )}
        {paginatedProviders.map(({ name, providerServices, averageRating, numberOfReviews, photo, id ,review}: IProvider, index) => (
          <>
            <div className='provider'>
              <div className='profile-image-reservate'>
                <div className='profile-image'>
                <img src={photo} />
                </div>

                <Link to={'/provider/' + id} target="_blank" className='viewProfile'>View Profile</Link>

                <button className='btn' id={'reserve-'+index} onClick={(e) => {
                  // aqui depois ver como é a estrutura do provider e colocar id
                  setFormData({ ...formData, page: formData.page + 1, nameProvider: name , providerReserved:paginatedProviders[index],typeServiceId: formData.typeServiceId,typeServiceName:getServiceName(paginatedProviders[index].providerServices ,formData.typeServiceId), pricePerHour :  getServicePrice(providerServices, formData.typeServiceId).toString()})
                }}>Choose</button>

              </div>
              {

                <div className='description'>
                  <div className='name'>
                    <h3>{name}</h3>

                    <p className='preco'>{
                      getServicePrice(providerServices, formData.typeServiceId)
                    } €/h</p>
                  </div>

                  <div className='data'>
                    <p><img src={estrela} title="Rating of this service type" /> {getServiceRating(providerServices, formData.typeServiceId)}</p>
                    <p><img src={verifica} title='Number of tasks completed of this service type' /> {getServiceDone(providerServices, formData.typeServiceId)}</p>
                  </div>


                  <div className='container' >
                    {getServiceDescription(providerServices, formData.typeServiceId) ? <h3>How can i help:</h3> : ''}
                    {getServiceDescription(providerServices, formData.typeServiceId) ? <p>{getServiceDescription(providerServices, formData.typeServiceId)}</p> : ''}


                    
                    <h3>Last Review</h3>
                    {review !== null ? 
                    <>
                      <p>{review.rating}★: {review.description}</p>
                    </> 
                    :
                     <p>No review yet</p>
                     }
                  </div>
                </div>


              }
            </div>
          </>
        ))
        }
        {orderedList.length === 0 && (
          <div className='noProvider'>
            <p>There is no provider available </p>
          </div>
        )}
        {orderedList.length >= providersPerPage && (
          <div className='pagination'>
            <button
              className={currentPage === 1 ? 'pagination-button previous-button current-page' : 'pagination-button previous-button'}
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className='pagination-button'>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => goToPage(index + 1)}
                  disabled={currentPage === index + 1}
                  className={currentPage === index + 1 ? "current-page" : ""}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              className={currentPage === totalPages ? 'pagination-button next-button current-page' : 'pagination-button next-button'}
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>

  )
}
