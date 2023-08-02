import './Navbar.css'
import logo from './images/logo-black.png';
import profile from './images/user.png'
import logout from './images/logout.png'
import tasks from './images/to-do-list.png'
import settings from './images/settings.png'
import management from './images/management.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import DropdownNotification from '../DropdownNotification/DropdownNotification';


const Navbar = () => {
  
    const navLinks = [{name:'Be a tasker', url:'/beatasker'},{name:'Sign Up', url:'/signup'},{name:'Log In',url:'/login'}]
    const logged = window.localStorage.getItem("logged")

    const navigate = useNavigate()

    if(logged){

      const json = JSON.parse(logged)
      
      var navLinksLogged:{[key: string]: string}[] = []
      
      
      if(json.type === 'client'){
          navLinksLogged = [{icon:tasks, url:'/tasks'},{icon:profile, url:'/profile'},{icon:logout, url:'/'}]
      }

      if(json.type === 'admin'){
        navLinksLogged = [{icon:management, url:'/manageproviders'},{icon:settings, url:'/settings'},{icon:logout, url:'/'}]

      }

      if(json.type === 'provider'){
        navLinksLogged = [{icon:tasks, url:'/tasks'},{icon:profile, url:'/profile'},{icon:logout, url:'/'}]
      }

      return (
        <nav className='navbar'>
          
          <a href='/'><img  className="logo" src={logo} alt="" /></a>
          
          <ul>
          {json.type != 'admin' ? <li>{<DropdownNotification/>}</li> :<></>}
          
          {
          navLinksLogged.map(({icon,url}) => {
            if (icon == logout){
              return(
                <li><Link className='button-nav-icon' to={url} onClick={() => 
                  { 
                    window.localStorage.removeItem("logged")
                    navigate('/');}
              }><img src={icon} alt="" /></Link></li>
              )
            }else {
              return(
                <li><Link className='button-nav-icon'to={url} ><img src={icon} alt="" /></Link></li>
            )
            }
              
          })
          }
          </ul>   
         
        </nav>
        
      )
  

      
    }else {
      return (
      <nav className='navbar'>
        
        <a href='/'><img  className="logo" src={logo} alt="" /></a>
        
        <ul>
        {
        navLinks.map(({name,url}) => {
            return(
                <li><Link id={name.split(' ')[0]} className='button-nav'to={url} >{name}</Link></li>
            )
        })}    
        </ul>   
       
      </nav>
      
    )

    }
   
    

    

   
    


    
}
export default Navbar