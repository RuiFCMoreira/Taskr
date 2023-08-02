import { IServiceArea } from '../../interfaces/IServiceArea';
import './ServiceArea.css';
import { useEffect, useState } from 'react';
import excluir from './icons/excluir.png'
import { IDistrict } from '../../interfaces/IDistrict';
import axios from 'axios';
import { hostname } from '../vars';
import { IProvider } from '../../interfaces/IProvider';

const ServiceArea = (props: { provider: IProvider, setProvider: React.Dispatch<React.SetStateAction<IProvider>> }) => {


    const [districts, setDistricts] = useState<IDistrict[] | []>([])
    const [selDistrict, setSelDistrict] = useState<number>(0)
    const [updateProviderArea, setUpdateProviderArea] = useState<IServiceArea>(
        {
            district: {
                id: -1,
                name: "",
                municipalities: []
            },

            municipality: {
                id: -1,
                name: ""
            }
        }
    )
    const [load, setLoad] = useState(false)




    function updateProvider() {

        if (updateProviderArea.municipality?.name != "" && updateProviderArea.district?.name != "") {
            props.setProvider({ ...props.provider, providerServiceAreas: [...props.provider.providerServiceAreas, updateProviderArea] })

            if(updateProviderArea.municipality?.name === "todos"){
                removeServiceDistrict(updateProviderArea.district?.name)
            }

            axios.post(hostname + 'users/providers/' + props.provider.id + '/area', {
                municipality: updateProviderArea.municipality?.name,
                district: updateProviderArea.district?.name
            }).then((response) => {
                alert('Area added')
                console.log(response.data)

            }).catch((response) => {
                alert('Failed to add area')
                console.log(response)
            })
        }
    }

    async function removeServiceDistrict(district: String|undefined) {
        let providerArea: IServiceArea[] = props.provider.providerServiceAreas;
        let promises = [];
        const url = hostname + 'users/providers/' + props.provider.id + '/area';
        let finalAreas = [];

        for (var area of providerArea) {
            if (area.district?.name === district && area.municipality?.name !== "todos" ) {
                let promise = axios.delete(url, {
                    params: {
                        district: area.district?.name,
                        municipality: area.municipality?.name
                    }
                });
                promises.push(promise);
            } else {
                finalAreas.push(area);
            }
        }
        try {
            await Promise.all(promises);
        } catch (error) {
            console.error(error);

        }
        finalAreas.push(updateProviderArea)
        
        props.setProvider({ ...props.provider, providerServiceAreas: finalAreas })
    }


    function serviceAreaExist(district: String | undefined, municipality: string | undefined) {
        let providerArea: IServiceArea[] = props.provider.providerServiceAreas

        for (var area of providerArea) {
            if ((area.district?.name === district && area.municipality?.name === municipality) || (area.district?.name === district && "todos" === area.municipality?.name)) {
                return true
            }
        }
        return false
    }

    function removeArea(index: number) {
        var newServiceAreas = props.provider.providerServiceAreas
        const serviceArea = newServiceAreas[index]
        newServiceAreas.splice(index, 1)
        props.setProvider({ ...props.provider, providerServiceAreas: newServiceAreas })

        axios.delete(hostname + 'users/providers/' + props.provider.id + '/area', {
            params: {
                district: serviceArea.district?.name,
                municipality: serviceArea.municipality?.name

            }
        }).then((response) => {
            console.log(response.data)

        }).catch((response) => {
            alert('Failed to remove area')
            console.log(response.body)
        })

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(hostname + 'districts')
                setDistricts(response.data);
                setLoad(true)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [])

    return (
        <>
            <div className='ServiceArea'>
                <div className='add-new-area'>
                    <h3 className='titulo'>Add New Area</h3>
                    <div className='add-area'>

                        <div className="dropdown-selection">
                            <select className="form-select-service" onChange={(e) => {
                                const index = Number(e.target.value)
                                if (index != -1) {
                                    setSelDistrict(Number(index))
                                    setUpdateProviderArea({ ...updateProviderArea, district: districts[index] })
                                }
                            }}>
                                <option selected value={-1}>Select a District</option>
                                {districts?.map((district, index) => {
                                    return (
                                        <option value={index}>{district.name}</option>
                                    )
                                })}
                            </select>

                            {load ? <select className="form-select-service" onChange={(e) => {

                                const index = Number(e.target.value)
                                if (index != -1) {
                                    setUpdateProviderArea({ ...updateProviderArea, municipality: districts[selDistrict].municipalities[index] })
                                }
                            }}>
                                <option selected value={-1}>Select a Municipality</option>
                                {districts[selDistrict].municipalities.map((municipality, index) => {
                                    return (
                                        <option value={index}>{municipality.name}</option>
                                    )
                                })}
                            </select> : <></>}
                        </div>
                        <div className="input-group">
                            <div className={(updateProviderArea.district?.name === "" || updateProviderArea.municipality?.name === "" || serviceAreaExist(updateProviderArea.district?.name, updateProviderArea.municipality?.name)) ? "add-area-button block" : 'add-area-button good'} >
                                <button onClick={() => {
                                    if ((updateProviderArea.district?.name !== "" && updateProviderArea.municipality?.name !== "" && !serviceAreaExist(updateProviderArea.district?.name, updateProviderArea.municipality?.name)))
                                        updateProvider()
                                }}
                                    className='add-area'>Add Area</button>
                            </div>
                        </div>
                    </div>


                </div>
                <div className='areas-section'>
                    <h3 className='titulo'>Areas of Service</h3>
                    <div className='areas-view'>
                        {props.provider.providerServiceAreas.length > 0 && (props.provider.providerServiceAreas.map((area, index) => (
                            <>
                                <div className='area'>
                                    <p>
                                        {area.district?.name} - {area.municipality?.name}
                                        <img className="-" src={excluir} alt=""
                                            onClick={e =>
                                                removeArea(index)
                                            } />
                                    </p>

                                </div>
                            </>
                        )))}
                        {props.provider.providerServiceAreas.length === 0 && (<>There is no service area assignment</>)}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ServiceArea;
