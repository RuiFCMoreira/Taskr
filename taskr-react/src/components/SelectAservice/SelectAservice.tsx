
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './SelectAservice.css'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { hostname } from '../vars'



const SelectAservice = () => {

    const {name} = useParams();

    const [serviceTypes,setServiceTypes] = useState([])

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
          const response = await axios.get(hostname + `categories/${name}/types`)
          setServiceTypes(response.data);
          console.log(response.data)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);


    
    return(
        
        <>  
            <Navbar/>
        
            <div className="selectAservice">
                {
                    serviceTypes.map(({id,name,description,imageURL},index) => {
                        if(index % 2 == 0){
                            return(
            
                              <div className='service'>
            
                                <div className='service-image'>
                                  <img src={imageURL} alt="" />
                                </div>
            
                                <div className='service-description'>
                                  <h3 id={'h3-serviceType'+index}>{name}</h3>
            
                                  <p>{description}</p>

                                 
                                  <Link to={'/form/?typeService='+id} id={'serviceType'+index}  className="btn btn-outline-dark">Schedule a Service</Link>  
                                  
                                  
                                </div>
                              </div>
                          )
                          }else{
                            return(
            
                              <div className='service'>
            
                                <div className='service-description'>
                                  <h3 id={'h3-serviceType'+index}>{name}</h3>
            
                                  <p>{description}</p>
                                  {typeUser == "provider" ?
                                 <Link to={'/profile'} id='profile-services'  className="btn btn-outline-dark">Provider Service</Link> 
                                  :
                                  <Link to={'/form/?typeService='+id} id={'serviceType'+index}  className="btn btn-outline-dark">Schedule a Service</Link>  
                                  }
                                   
            
                                </div>
            
                                <div className='service-image'>
                                  <img src={imageURL} alt="" />
                                </div>
            
                              </div>
                          )
                          }
                    })
                }
                

            </div>

            <Footer/>
        </>
    )
}


export default SelectAservice