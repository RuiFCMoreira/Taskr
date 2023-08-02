import './Footer.css'
import facebook from './icons/facebook.png'
import twitter from './icons/twitter.png'
import instagram from './icons/instagram.png'


const Footer = () => {
  
    return (
      <div className="Footer">
        <div className='aligned-row'>
           
            <div className='follow-us'>
                <h5>Follow us</h5>

                <ul>
                    <li><img src={instagram} /></li>
                    <li><img src={twitter} /></li>
                    <li><img src={facebook} /></li>
                </ul>
            </div>

            <div className='newsletter'>
                <div className='msg'>
                    <h5>Get the newsletter</h5>
                </div>
                
                <input type="text" />
                <button>Submit</button>
            </div>
        
        </div>

        <div className='address'>
            <p>Universidade do Minho, 4804-533
                <br/>
                © 2023 Taskr.  All rights reserved
            </p>
        </div>
      
      </div>
      
    )
}
export default Footer