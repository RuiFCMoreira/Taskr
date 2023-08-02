
import './AddServices.css';
import { useState, useEffect } from 'react';
import excluir from './icons/excluir.png'
import { IProvider } from '../../../interfaces/IProvider';
import { IProviderService } from '../../../interfaces/IProviderService';
import { IServiceCategory } from '../../../interfaces/IServiceCategory';
import { IServiceType } from '../../../interfaces/IServiceType';
import axios from 'axios';
import { hostname } from '../../vars';
import { Temporal } from '@js-temporal/polyfill';
import { IServiceCategoryTypes } from '../../../interfaces/IServiceCategoryTypes';



const AddServices = (props: {
    provider: IProvider, setProvider: React.Dispatch<React.SetStateAction<IProvider>>,
    serviceCategoryTypes: IServiceCategoryTypes[], setServiceCategoryTypes: React.Dispatch<React.SetStateAction<IServiceCategoryTypes[]>>
}) => {



    const [categoryDisplay, setCategoryDisplay] = useState<string>("")


    const [serviceMenu, setServiceMenu] = useState("");

    const [description, SetDescription] = useState('')
    const [price, SetPrice] = useState<number>(0)
    const [durationHour, SetDurationHour] = useState<number>(0)



    const [showRemove, setShowRemove] = useState<boolean>(false)

    const [serviceTypeData, SetServiceTypeData] = useState({
        id: 0,
        name: "",
        description: "",
        image: "",
    })

    const [categoryData, SetCategoryData] = useState({
        id: 0,
        name: "",
        description: "",
    })

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


    function hadleClickAddService() {

        let d = Temporal.Duration.from({ hours: durationHour }).toString();
        console.log()
        axios.post(hostname + 'users/providers/' + props.provider.id + '/service', {
            pricePerHour: price,
            expectedDuration: d,
            description: description,
            serviceTypeId: serviceTypeData.id
        }).then((response) => {
            let category: IServiceCategory = {
                id: categoryData.id,
                name: categoryData.name,
                description: ''
            }
            let serviceType: IServiceType = {
                id: serviceTypeData.id,
                name: serviceTypeData.name,
                description: serviceTypeData.description,
                image: serviceTypeData.image,
                serviceCategory: category
            }
            let service: IProviderService = {
                pricePerHour: price,
                expectedDuration: d,
                description: description,
                averageRating: 0,
                numberOfReviews: 0,
                numberOfCompletedTasks: 0,
                serviceType: serviceType
            }

            let provider = props.provider
            provider.providerServices.push(service)
            props.setProvider(provider)
            SetDescription("")
            SetPrice(0)
            SetDurationHour(0)
            setServiceMenu("")
            setShowRemove(true)

        }).catch((response) => {
            alert('Failed to add service ')
            console.log(response)
        })
    }


    function serviceInProvider(id: number) {
        if (props.provider.providerServices.length === 0) {
            return false
        }
        else {
            return props.provider.providerServices.some((service) => service.serviceType.id === id)
        }
    }


    function removeService() {

        axios.delete(hostname + "users/providers/" + props.provider.id + "/service", {
            params: {
                typeId: serviceTypeData.id
            }
        }).then((response) => {
            let provider: IProvider = props.provider
            const updatedProviderServices = provider.providerServices.filter(
                (providerService) => providerService.serviceType.id !== serviceTypeData.id
            );

            provider = {
                ...provider,
                providerServices: updatedProviderServices,
            };


            props.setProvider(provider)
            setShowRemove(false)

        }).catch((response) => {
            alert('Failed to remove service')
            console.log(response)
        })
    }


    return (
        <>
            <div className='AddServices'>
                {serviceMenu === "" && (<>
                    {props.serviceCategoryTypes.length !== 0 ?
                        <>
                            <div className='category-title'>
                                <h3>Categories</h3>
                            </div>
                            <div className='button-category'>
                                {props.serviceCategoryTypes.map((category, index) => (
                                    <>
                                        <button
                                            key={index}
                                            className={category.name === categoryDisplay ? "selected" : ""}
                                            onClick={() => {
                                                setCategoryDisplay(category.name);
                                                SetCategoryData({
                                                    id: category.id,
                                                    name: category.name,
                                                    description: category.description
                                                })
                                                SetServiceTypeData({ ...serviceTypeData, name: "" })

                                            }}
                                        >{category.name}
                                        </button>
                                    </>
                                ))}
                            </div>
                            <div className='category-types'>
                                {props.serviceCategoryTypes.map((category, index) => (
                                    <>

                                        {category.name === categoryDisplay && (
                                            <div className='service-types-left'>
                                                <div className="service-category">
                                                    {category.types.map((type, index) => (

                                                        <div className={serviceTypeData.name === type.name ? "service-info selected" : "service-info"}>
                                                            <button className={serviceTypeData.name === type.name ? "service-info selected" : "service-info"}
                                                                onClick={() => {
                                                                    SetServiceTypeData({ ...serviceTypeData, name: "" })
                                                                    setShowRemove(serviceInProvider(type.id));
                                                                    SetServiceTypeData({
                                                                        id: type.id,
                                                                        name: type.name,
                                                                        description: type.description,
                                                                        image: type.image,
                                                                    })
                                                                }}>{type.name} </button>
                                                        </div>


                                                    ))}
                                                </div>





                                            </div>
                                        )}

                                    </>
                                ))}
                                <div className='service-description'>
                                    {serviceTypeData.name !== "" && (
                                        <>
                                            <h4>Description</h4>
                                            <p className='overflow-description'>{serviceTypeData.description}</p>
                                            <div className='gestor-service'>
                                                {!showRemove ?
                                                    <button onClick={() => { setServiceMenu("AddService") }} >Add Service</button>
                                                    :
                                                    <button onClick={() => { removeService() }} >Remove Service</button>
                                                }

                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <p>You don't have any service yet</p>
                        </>}
                </>)}

                {serviceMenu === "AddService" && (<>
                    <div className='add-type-service'>

                        <h3>{serviceTypeData.name}</h3>
                        <label className='price'>
                            Price per Hour €:
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
                            Expected Duration for Service:
                            <div className='service-duration'>
                                Hours
                                <input
                                    type="number"
                                    name="duration_hour"
                                    value={durationHour > -1 ? durationHour : ''}
                                    onChange={handleDurationHourChange}

                                />
                            </div>

                        </label>

                        <label>
                            Description for the Service:
                            <textarea
                                name="description"
                                value={description}
                                onChange={(event) => { SetDescription(event.target.value); }}
                            />
                        </label>

                        <div className='btn-add-service'>
                            <button onClick={() => {
                                setServiceMenu("")
                                SetDescription("")
                                SetPrice(0)
                                SetDurationHour(0)
                            }}>Cancel</button>
                            <button onClick={() => { hadleClickAddService() }}>Add Service</button>
                        </div>
                    </div>
                </>
                )}
            </div>
        </>
    )



}

export default AddServices;
