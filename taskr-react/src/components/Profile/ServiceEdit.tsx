
import './ServiceEdit.css';
import { useState, useEffect } from 'react';
import { IProviderService } from '../../interfaces/IProviderService';
import { IProvider } from '../../interfaces/IProvider';
import axios from 'axios';
import { hostname } from '../vars';
import { Temporal } from '@js-temporal/polyfill';
import { durationToString } from '../../utils';



export interface ServiceDisplay {
    categoryName: string;
    categoryDescription: string;
    services: IProviderService[];
}


const ServiceEdit = (props: { provider: IProvider, setProvider: React.Dispatch<React.SetStateAction<IProvider>> }) => {


    const [serviceDisplay, setServiceDisplay] = useState<ServiceDisplay[]>([])
    const [categoryDisplay, setCategoryDisplay] = useState<string>("")

    const [editService, setEditService] = useState<String>("")
    const [description, SetDescription] = useState('')
    const [price, SetPrice] = useState<number>(0)
    const [durationMinutes, SetDurationMinutes] = useState<number>(0)
    const [durationHour, SetDurationHour] = useState<number>(0)

    const [reload, setReload] = useState(0)
    const maxHours = 8;
    const minHours = 1;
    const [typeIndex,setTypeIndex] = useState(0)

    function compareData(){
        const expectedDuration = Temporal.Duration.from(props.provider.providerServices[typeIndex].expectedDuration).hours;

        if(price == props.provider.providerServices[typeIndex].pricePerHour && 
            description == props.provider.providerServices[typeIndex].description && durationHour == expectedDuration)
            
            return true
        else 
            return false
    }


    useEffect(() => {
        let serviceDisplay: ServiceDisplay[] = []
        for (let i = 0; i < props.provider.providerServices.length; i++) {
            let new_category: boolean = true
            for (let j = 0; j < serviceDisplay.length; j++) {
                if (props.provider.providerServices[i].serviceType.serviceCategory.name === serviceDisplay[j].categoryName) {
                    serviceDisplay[j].services.push(props.provider.providerServices[i])
                    new_category = false
                }
            }
            if (new_category) {
                let display: ServiceDisplay = {
                    categoryName: props.provider.providerServices[i].serviceType.serviceCategory.name,
                    categoryDescription: props.provider.providerServices[i].serviceType.serviceCategory.description,
                    services: [props.provider.providerServices[i]]
                }
                serviceDisplay.push(display)
            }
        }
        if (serviceDisplay.length > 0) {
            setCategoryDisplay(serviceDisplay[0].categoryName)
        }
        setServiceDisplay(serviceDisplay)

    }, [reload]);

    useEffect(() => {


    }, [reload]);


    function handleDurationHourChange(event: any) {
        const inputValue = event.target.value;

        if (isNaN(inputValue)) {
            event.target.value = inputValue.slice(0, -1);
            return;
        }

        if (inputValue < 1) {
            event.target.value = '1';
        }


        if (!Number.isInteger(parseFloat(inputValue))) {
            event.target.value = Math.round(parseFloat(inputValue));
        }
        SetDurationHour(parseFloat(event.target.value));
    }

    function updateService(typeId: number, pricePerHour: number, expectedDuration: string) {
        let duration: Temporal.Duration
        let finalPrice: number
        if (price === 0) {
            finalPrice = pricePerHour
        }
        else {
            finalPrice = price
        }

        duration = Temporal.Duration.from({ hours: durationHour });

        axios.post(hostname + 'users/providers/' + props.provider.id + '/service', {
            pricePerHour: finalPrice,
            expectedDuration: duration,
            description: description,
            serviceTypeId: typeId
        }).then((response) => {
            let provider = props.provider

            let providerService = provider.providerServices

            for (let index = 0; index < providerService.length; index++) {
                if (providerService[index].serviceType.id === typeId) {
                    providerService[index] = {
                        ...providerService[index],
                        pricePerHour: finalPrice,
                        expectedDuration: duration.toString(),
                        description: description,
                    }
                }
            }

            provider = {
                ...provider,
                providerServices: providerService,
            };

            props.setProvider(provider)

            SetDurationHour(0);
            SetDescription("");
            SetPrice(0);
            setEditService("");
            setReload(reload + 1)

        }).catch((response) => {
            alert('Failed to update service')
            console.log(response)
        })
    }


    function removeService(type: IProviderService) {
        axios.delete(hostname + "users/providers/" + props.provider.id + "/service", {
            params: {
                typeId: type.serviceType.id
            }
        }).then((response) => {
            let provider: IProvider = props.provider


            const updatedProviderServices = provider.providerServices.filter(
                (providerService) => providerService.serviceType.id !== type.serviceType.id
            );

            provider = {
                ...provider,
                providerServices: updatedProviderServices,
            };
            props.setProvider(provider)
            setReload(reload + 1)

        }).catch((response) => {
            alert('Failed to remove service')
            console.log(response)
        })
    }

    function getDurationHour(expectedDuration: string) {
        const duration = Temporal.Duration.from(expectedDuration);
        return duration.hours
    }

    return (
        <>
            <div className='ServiceEdit'>
                {serviceDisplay.length !== 0 ?
                    <>
                        <div className='button-category'>
                            {serviceDisplay.map((category, index) => (
                                <>
                                    <button
                                        key={index}
                                        className={category.categoryName === categoryDisplay ? "selected" : ""}
                                        onClick={() => {
                                            setCategoryDisplay(category.categoryName);
                                            SetDurationHour(0);
                                            SetDescription("");
                                            setTypeIndex(index);
                                        }}
                                    >{category.categoryName}
                                    </button>

                                </>
                            ))}
                        </div>

                        {serviceDisplay.map((category, index) => (
                            <>
                                {category.categoryName === categoryDisplay && (
                                    <div className="service-category">
                                        <div className='services-info'>
                                            {category.services.map((service, index) => (

                                                <div className='service-info'>
                                                    <div className='service-name'>
                                                        <h3>{service.serviceType.name} </h3>
                                                    </div>
                                                    {editService !== service.serviceType.name ?
                                                        <>
                                                            <div className='info'>
                                                                <p className='price'>Price: {service.pricePerHour}€/h</p>
                                                                <p>Description</p>
                                                                <p>{service.description}  </p>
                                                                <p>Expected Duration: {durationToString(service.expectedDuration)}</p>
                                                            </div>
                                                            <div className='btn-edit-service'>
                                                                <button onClick={() => {
                                                                    setEditService(service.serviceType.name);
                                                                    SetDurationHour(getDurationHour(service.expectedDuration));
                                                                    SetDescription(service.description);
                                                                    SetPrice(service.pricePerHour)
                                                                }}>Edit Service</button>
                                                                <button onClick={() => { 
                                                                    let text = "Are you sure you want remove this service type?";
                                                                    if (window.confirm(text) == true) {
                                                                        removeService(service) 
                                                                    } 
                                                                    }}>Remove</button>
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                            <label className='price'>
                                                                Price:
                                                                <input

                                                                    type="number" min="1" step="any"
                                                                    name="price"
                                                                    value={price > -1 ? price : ''}
                                                                    onChange={(event) => SetPrice(parseFloat(event.target.value))}
                                                                    onBlur={() => {
                                                                        if (price > -1) {
                                                                            SetPrice(parseFloat(price.toFixed(2)));
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                            <label>
                                                                Description for the Service:
                                                                <textarea
                                                                    name="description"
                                                                    value={description}
                                                                    onChange={(event) => { SetDescription(event.target.value); }}
                                                                />
                                                            </label>
                                                            <label>
                                                                Expected Duration for Service:
                                                                <div className='service-duration'>
                                                                    Hours
                                                                    <input
                                                                        type="number"
                                                                        name="duration_hour"
                                                                        value={durationHour > -1 ? durationHour : ''}
                                                                        onChange={handleDurationHourChange}
                                                                    //onChange={(event) => SetDurationHour(parseFloat(event.target.value))}
                                                                    />
                                                                </div>
                                                            </label>
                                                            <div className='btn-update-service'>
                                                                <button onClick={() => {
                                                                    setEditService("");
                                                                    SetDurationHour(0);
                                                                    SetDescription("");
                                                                    SetPrice(0);
                                                                }}>Cancel</button>
                                                                {!compareData() ?
                                                                    <button className='save'
                                                                        onClick={() => {
                                                                            if (compareData() == false) {
                                                                                updateService(service.serviceType.id, service.pricePerHour, service.expectedDuration)
                                                                            }
                                                                        }}>
                                                                        Save changes
                                                                    </button>

                                                                    :

                                                                    <button className='notSave'
                                                                        disabled>
                                                                        Save changes
                                                                    </button>
                                                                }
                
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ))}

                    </>
                    :
                    <>
                    <div className='ServiceEdit'>
                        <p>You don't have any service yet</p>
                    </div>
                    </>}
            </div>
        </>
    );
}

export default ServiceEdit;
