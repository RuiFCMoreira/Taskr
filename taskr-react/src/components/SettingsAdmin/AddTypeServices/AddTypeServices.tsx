import './AddTypeServices.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { hostname } from '../../vars'
import { IServiceCategoryTypes } from '../../../interfaces/IServiceCategoryTypes';
import { readImage } from '../../../utils';
import { IServiceType } from '../../../interfaces/IServiceType';
import { type } from 'os';
import { Fade } from 'react-bootstrap';

const AddTypeServices = () => {

    const [serviceCategoryTypes, setServiceCategoryTypes] = useState<IServiceCategoryTypes[]>([])
    const [categoryNameSelected, setCategoryNameSelected] = useState<string>("")
    const [categorySelectedIdx, setCategorySelectedIdx] = useState(0)
    const [serviceTypeNameSelected, setTypeServiceNameSelected] = useState<string>("")
    const [serviceTypeSelectedIdx, setTypeServiceSelectedIdx] = useState(0)

    const [description, setDescription] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [image, setImage] = useState<any | null>(null)

    const [menuEdit,setMenuEdit] = useState(false)


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

    }, [load]);



    function compareData() {
        var typeService = serviceCategoryTypes[categorySelectedIdx].types[serviceTypeSelectedIdx]
        if (name != typeService.name || description != typeService.description || image != null) 
            return false
        else 
            return true
    }

    const handleSubmitNewService = async() => {
        if (name != "" && description != "" && image != null){
            readImage(image[0]).then((photoReaded) => {
                axios.post(hostname + 'categories/'+categoryNameSelected,{
                    name:name,
                    description:description,
                    photo:photoReaded
                })
                .then((response) => {
                    if (typeof photoReaded == "string"){
                        var newType : IServiceType= {
                            id:response.data.id,
                            name:name,
                            description:description,
                            image:photoReaded,
                            serviceCategory: response.data.serviceCategory
                        }
                        let newServiceCategoryTypes = serviceCategoryTypes
                        newServiceCategoryTypes[categorySelectedIdx].types.push(newType)
                        setServiceCategoryTypes(newServiceCategoryTypes)
                    }
                    setName("")
                    setDescription("")
                    setImage(null)
                }).catch((response)=> {
                    alert('Failed to add new Type Service!')

                })
            })
        }
        else {
            alert("Please fill all fields")
        }
    }

    const handleDeleteService = async(nameCategory:string,nameService:string,idxCategory:number,idxServiceType:number) => {
        axios.delete(hostname + 'categories/'+nameCategory+'?typeId='+serviceCategoryTypes[idxCategory].types[idxServiceType].id)
        .then((response) => {
            var newServiceCategoryTypes = [...serviceCategoryTypes]
            newServiceCategoryTypes[idxCategory].types.splice(idxServiceType,1)
            setServiceCategoryTypes(newServiceCategoryTypes)
            setTypeServiceSelectedIdx(-2)

        }).catch((response)=> {
            alert('Failed to remove Service Type!')
        })
    }

    const handleEditService = async(nameCategory:string,nameService:string,idxCategory:number,idxServiceType:number) => {

        var newTypeService = serviceCategoryTypes[idxCategory].types[idxServiceType]
        var nameAux : string | null = null
        if (name != newTypeService.name){
            nameAux = name
        }
        var descriptionAux: string | null  = null
        if (description != newTypeService.description){
            descriptionAux = description
        }
        var photoAux : string | null  = null
        if (image!=null){
            readImage(image[0]).then((photoReaded) => {
                if (typeof photoReaded == "string")
                    photoAux =photoReaded
            })
        }

        axios.post(hostname + 'categories/'+nameCategory+'/'+serviceCategoryTypes[idxCategory].types[idxServiceType].id,{
            name: nameAux,
            image: photoAux,
            description: descriptionAux
        })
        .then((response) => {
            if (nameAux != null)
                newTypeService.name = nameAux
            if (descriptionAux != null)
                newTypeService.description = descriptionAux
            if (photoAux != null)
                newTypeService.image = photoAux

            let newServiceCategoryTypes = serviceCategoryTypes
            newServiceCategoryTypes[idxCategory].types[idxServiceType] = newTypeService
            setServiceCategoryTypes(newServiceCategoryTypes)
            setTypeServiceNameSelected(name)
            setName("")
            setDescription("")
            setImage(null)
            setMenuEdit(false)
        }).catch((response)=> {
            alert('Failed to edit Service!')
        })
    }


    return (
        <div className='AddTypeServices'>
            <div className='addTypeServicesHeader'>
                <p>Management Type Services</p>
            </div>
            <div className='addTypeServicesContent'>
                {serviceCategoryTypes.length !== 0 ?
                    <>
                        <div className='category-title'>
                            <h3>Categories</h3>
                        </div>
                        <div className='button-category'>
                            {serviceCategoryTypes.map((category, index) => (
                                <>
                                    <button
                                        key={index}
                                        className={category.name === categoryNameSelected ? "selected" : ""}
                                        onClick={() => {
                                            setCategoryNameSelected(category.name)
                                            setCategorySelectedIdx(index)
                                            setTypeServiceNameSelected("")
                                            setTypeServiceSelectedIdx(0)
                                            setMenuEdit(false)
                                        }}
                                    >{category.name}
                                    </button>
                                </>
                            ))}
                        </div>
                        <div className='category-types'>
                            {serviceCategoryTypes.map((category, index) => (
                                <>
                                    {category.name === categoryNameSelected && (
                                        <div className='service-types-left'>
                                            <div className="service-category">
                                                {category.types.map((type, index) => (

                                                    <div className={serviceTypeNameSelected === type.name ? "service-info selected" : "service-info"}>
                                                        <button className={serviceTypeNameSelected === type.name ? "service-info selected" : "service-info"}
                                                            onClick={() => {
                                                                setTypeServiceNameSelected(type.name)
                                                                setTypeServiceSelectedIdx(index)
                                                                setMenuEdit(false)
                                                            }}>{type.name} </button>
                                                    </div>


                                                ))}
                                            </div>

                                            <div className={serviceTypeNameSelected === "addTypeService" ? "add-service" : "add-service"}>
                                                        <button className={serviceTypeNameSelected === "addTypeService"? "add-service" : "add-service"}
                                                            onClick={() => {
                                                                setTypeServiceNameSelected("addTypeService")
                                                                setTypeServiceSelectedIdx(-1)
                                                            }}>Add Type Service</button>
                                            </div>
                                            
                                            
                                            
                                        </div>
                                    )}
                                </>
                            ))}
                            <div className='service-description'>
                                {serviceTypeSelectedIdx == -2 && (<></>)}
                                {serviceTypeNameSelected !== "" && serviceTypeSelectedIdx != -1 && serviceTypeSelectedIdx != -2 && !menuEdit && (
                                    <>  
                                        <div className='details-service'>
                                            <div className='line'>
                                                {serviceCategoryTypes[categorySelectedIdx].types[serviceTypeSelectedIdx] != undefined && (
                                                     <img src={serviceCategoryTypes[categorySelectedIdx].types[serviceTypeSelectedIdx]?.image}></img>
                                                )}
                                               
                                                <h4>Description</h4>
                                            </div>
                                            <p>{serviceCategoryTypes[categorySelectedIdx].types[serviceTypeSelectedIdx].description}</p>
                                        </div>
                                        <div className='gestor-service'>
                                                        <button onClick={() => { 
                                                            let text = "Are you sure you want delete this service?";
                                                            if (window.confirm(text) == true) {
                                                                handleDeleteService(categoryNameSelected,serviceTypeNameSelected,categorySelectedIdx,serviceTypeSelectedIdx) 
                                                                } 
                                                            }}> 
                                                            Delete Service
                                                        </button>
                                                        <button onClick={() => { 
                                                            setName(serviceTypeNameSelected)
                                                            setDescription(serviceCategoryTypes[categorySelectedIdx].types[serviceTypeSelectedIdx].description)
                                                            setMenuEdit(true)
                                                        }}> Edit Service</button>
                                        </div> 
                                    </>
                                )}
                                {serviceTypeNameSelected !== "" && serviceTypeSelectedIdx != -1 && serviceTypeSelectedIdx != -2 && menuEdit && (
                                    <>  
                                        <div className='addTypeServiceForm'>
                                            <div className='line'>
                                                <h5>Name:</h5>
                                                <input type="text"
                                                    required
                                                    placeholder="Name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                ></input>
                                            </div>
                                            <div className='line'>
                                                <h5>Image:</h5>
                                                <input type="file"
                                                    name="file"
                                                    onChange={e => {
                                                        setImage(e.target.files)
                                                    }
                                                    } />
                                            </div>
                                            <div className='line'>
                                                <h5>Description:</h5>
                                                <textarea 
                                                    className='description'
                                                    required
                                                    placeholder="Description"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className='gestor-service-edit'>
                                                        <button onClick={() => { 
                                                            setName("")
                                                            setDescription("")
                                                            setImage(null)
                                                            setMenuEdit(false)
                                                            }}> 
                                                            Back
                                                        </button>
                                                        {compareData() ? 
                                                        <button disabled> Save Changes</button>
                                                        :
                                                        <button onClick={() => {
                                                            handleEditService(categoryNameSelected,serviceTypeNameSelected,categorySelectedIdx,serviceTypeSelectedIdx)}}> 
                                                            Save Changes
                                                        </button>
                                                        }
                                                        
                                        </div> 
                                    </>
                                )}
                                {serviceTypeNameSelected !== "" && serviceTypeSelectedIdx == -1 && (
                                <>
                                    <div className='addTypeServiceForm'>
                                        <div className='line'>
                                            <h5>Name:</h5>
                                            <input type="text"
                                                required
                                                placeholder="Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            ></input>
                                        </div>
                                        <div className='line'>
                                            <h5>Image:</h5>
                                            <input type="file"
                                                name="file"
                                                onChange={e => {
                                                    setImage(e.target.files)
                                                }
                                                } />
                                        </div>
                                        <div className='line'>
                                            <h5>Description:</h5>
                                            <input type="text"
                                                className='description'
                                                required
                                                placeholder="Description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            ></input>
                                        </div>
                                    </div>
                                    <div className='buttonSubmitService'>
                                        <button onClick={() => { handleSubmitNewService() }} >Submit Type Service</button>
                                    </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                    :
                    <>
                    </>}
            </div>
        </div>
    )
}

export default AddTypeServices