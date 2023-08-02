import './HomePage.css'
import '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import stnd from './images/2nd-column.jpg'
import Navbar from '../Navbar/Navbar'
import assembling from './images/assembling.webp'
import cleaning from './images/cleaning.jpg'
import gardening from './images/gardening.jpg'
import moving from './images/moving.jpg'
import reparing from './images/reparing.jpg'
import { Link } from 'react-router-dom'



const HomePage = () => {
  
    const serviceCategories = [{name : 'Gardening', description : "Whether you're looking to offer your green thumb expertise or seeking professional help for your garden, we've got you covered. Connect with skilled gardeners offering a range of services such as lawn care, planting, pruning, and more. Find the perfect match for your gardening needs and create beautiful outdoor spaces.", img:gardening },
                               {name : 'Assembling', description : "Experience hassle-free assembling services with the help of skilled professionals that will securely assemble your TVs, shelves, artwork, and more, saving you time and ensuring a polished look for your space. Enjoy peace of mind knowing that your items are expertly installed and ready to be used.", img:assembling},
                               {name : 'Cleaning', description : "We make it easy for you to find trusted professionals who excel in keeping your spaces spotless and tidy. Whether you need regular home cleaning, deep carpet cleaning, or post-construction cleanup, our platform connects you with experienced cleaners who deliver exceptional results, from residential properties to commercial spaces.", img:cleaning}, 
                               {name : 'Moving', description :"Relocate with confidence using our various experienced movers that ensure a smooth and stress-free transition to your new home. From packing and loading to transportation and unpacking, we handle every aspect of your move with utmost care and professionalism. Sit back, relax, and let us take the heavy lifting off your shoulders.", img:moving},
                               {name : 'Fixing', description: "Whether it's a leaky faucet, a broken electrical outlet, or a squeaky door, connect with a bunch of professionals that are here to help. From minor repairs to more complex projects, we've got you covered. We prioritize your convenience and work diligently to complete the fixes efficiently without compromising on quality.", img:reparing}]


  const logged = window.localStorage.getItem("logged");
  var typeUser = ""
  var id = ""
  if (logged) {
      const json = JSON.parse(logged)
      typeUser = json.type
      id = json.id
  }


    return (
      <>
        <Navbar></Navbar>

        <div className='first-row'>
          
          <div className='left-column'>

            <h2>Specialized network</h2>
            <p>With Taskr you can connect with a vast network of professionals that will help you solve your everyday problems, from simple tasks like assembling a table to making your garden new again.</p>
        

          </div>

          <div className='right-column'>
            <img src={stnd} alt="" />
          </div>

        </div>

        <div className='second-row'>

          <h3>Choose Whatever Service You Need</h3>
          
          <div className='images'>
            {
            serviceCategories.map(({name,description,img}) => {
              return(
                <img src={img}></img>
              )
            })
            }
          </div>
          
        </div>

        <div className='service-categories'>
        {
            serviceCategories.map(({name,description,img},index) => {
      
              if(index % 2 == 0){
                return(

                  <div className='category'>

                    <div className='category-image'>
                      <img src={img} alt="" />
                    </div>

                    <div className='category-description'>
                      <h3>{name}</h3>

                      <p>{description}</p>

                      {typeUser == "provider" ?
                        <Link to={'/profile/ServiceProfile'} id='profile-services'  className="btn btn-outline-dark">Provide a Service</Link> 
                        :
                        <Link to={'/category/'+name} className="btn btn-outline-dark">See more</Link>  
                       }

                    </div>
                  </div>
              )
              }else{
                return(

                  <div className='category'>

                    <div className='category-description'>
                      <h3>{name}</h3>

                      <p>{description}</p>

                      {typeUser == "provider" ?
                        <Link to={'/profile/ServiceProfile'} id='profile-services'  className="btn btn-outline-dark">Provide a Service</Link> 
                        :
                        <Link to={'/category/'+name} className="btn btn-outline-dark">See more</Link>  
                       }
                  
                      
                    </div>

                    <div className='category-image'>
                      <img src={img} alt="" />
                    </div>

                  </div>
              )
              }
            })
          }
        </div>

        <Footer></Footer>
      </>
      
    )
}
export default HomePage