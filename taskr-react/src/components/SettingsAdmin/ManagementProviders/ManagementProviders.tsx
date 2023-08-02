import './ManagementProviders.css'
import { useNavigate } from 'react-router-dom';

const ManagementProviders = () => { 
    const navigate = useNavigate()

        return (
            <div className='ManageProviders'>
                <div className='manageProvidersHeader'>
                    <p>Management Providers</p>
                </div>
                <div className='manageProvidersContent'>
                    <p>Use the button below to access the provider management page where you can check the current provider list by state and also approve and disapprove providers.</p>
                    <button className='goToManageProvidersButton'
                        onClick={() => { navigate("/manageproviders") }}>
                        Go To Management Providers
                    </button>
                </div>
            </div>
        )
}

export default ManagementProviders