
import './ServiceAvailability.css';
import 'bootstrap/dist/css/bootstrap.min.css';  
import { Link } from 'react-router-dom';


const ServiceAvailability = () => {
    
    
    
    return (
            <div className='availability-container'>
            <div className='availability-description'>
                
                <p>Select your availability to make sure that your scheduled tasks are in accordance to your available time and personal preferences</p>
                <Link className="availability-link-btn" to='/servicesavailabilitytable' target="_blank">Schedule</Link>
                
            </div>
        </div>
    );
}

export default ServiceAvailability;
