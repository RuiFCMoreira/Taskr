
import './ServiceProfile.css';
import { useState, useEffect } from 'react';
import excluir from './icons/excluir.png'
import ServiceArea from './ServiceArea';
import ServiceAvailability from './ServiceAvailability';
import ServiceEdit from './ServiceEdit';
import { IProvider } from '../../interfaces/IProvider';
import { IProviderService } from '../../interfaces/IProviderService';
import AddServices from './AddServices/AddServices';
import { hostname } from '../vars';
import axios from 'axios';
import { IServiceCategoryTypes } from '../../interfaces/IServiceCategoryTypes';


export interface ServiceDisplay {
    categoryName: string;
    categoryDescription: string;
    services: IProviderService[];
}

const ServiceProfile = (props: { provider: IProvider, setProvider: React.Dispatch<React.SetStateAction<IProvider>> }) => {

    const [serviceMenu, setServiceMenu] = useState("");
    const [addServices, setAddServices] = useState(false);
    const [serviceCategoryTypes, setServiceCategoryTypes] = useState<IServiceCategoryTypes[]>([])
    const [load, setLoad] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(hostname + 'categories/types')
                setServiceCategoryTypes(response.data)
                setLoad(true)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div className='ServiceProfile'>
                <div className='menuService'>
                    <p>Services {serviceMenu} {addServices ? " - Add Services" : ""}</p>

                    {(serviceMenu !== "" && serviceMenu !== "Type") && (
                        <button className='back' onClick={() => { setServiceMenu("") }} >Back</button>
                    )}

                    {(serviceMenu !== "" && serviceMenu === "Type" && !addServices) && (
                        <>
                            <div className='btn-services'>
                                <button onClick={() => { setAddServices(true) }} >Add/Remove</button>
                                <button onClick={() => { setServiceMenu("") }} >Back</button>
                            </div>
                        </>
                    )}
                    {(serviceMenu === "Type" && addServices) && (
                        <>
                                <button className='back' onClick={() => { setAddServices(false) }} >Back</button>
                        </>
                    )}

                </div>
                {serviceMenu === "" && (<>
                <div className='service-buttons'>
                    <div className='service-content'>
                        <button onClick={() => { setServiceMenu("Area") }}>Service Area</button>
                        <button onClick={() => { setServiceMenu("Availability") }}>Service Availability</button>
                        <button onClick={() => { setServiceMenu("Type") }}>Service Type</button>
                    </div>
                    </div>
                </>
                )}
                {serviceMenu === "Area" && (
                    <>
                        <ServiceArea provider={props.provider} setProvider={props.setProvider}></ServiceArea>
                    </>
                )}
                {serviceMenu === "Availability" && (
                    <>
                        <ServiceAvailability></ServiceAvailability>
                    </>
                )}
                {serviceMenu === "Type" && (
                    <>
                        {!addServices && (
                            <ServiceEdit provider={props.provider} setProvider={props.setProvider}></ServiceEdit>
                        )
                        }

                        {addServices && (
                            <AddServices provider={props.provider} setProvider={props.setProvider} serviceCategoryTypes={serviceCategoryTypes} setServiceCategoryTypes={setServiceCategoryTypes}></AddServices>
                        )
                        }
                    </>
                )}
            </div>
        </>
    );
}

export default ServiceProfile;
