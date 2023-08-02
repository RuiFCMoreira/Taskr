import React, { ChangeEventHandler, useEffect, useState } from "react";
import { FormDataProps } from "./Form";
import './FormService1.css'
import axios from "axios";
import { hostname } from "../vars";
import { IDistrict } from "../../interfaces/IDistrict";
import {FormProps} from './Form'


export default function FormServiceLocal({formData, setFormData}:FormDataProps){
    
    const descriptionDefault : string= 'Summarize the task you need the task provider to do. \nInclude details and information that you find relevant for the task provider to know.'
    const [districts, setDistricts] = useState<IDistrict[]|[]>([])
    const [selDistrict, setSelDistrict] = useState<number>(0)
    const [load, setLoad] = useState(false)

    function isValidZipCode(zipCode:string) {
        
        const zipCodePattern: RegExp = /^\d+\-\d+?$/;

        
        return zipCodePattern.test(zipCode);
    }

    function isValidAdress(adress:string){
        const zipCodePattern: RegExp = /^[A-Za-z ]+\,[A-Za-z ]+$/;

        
        return zipCodePattern.test(adress);
    }

    function isValidDoorNumber(number:number){
        
        return number > 0
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
  }, []);

  const verifyForm1 = (formData:FormProps) => {
    
        if(formData.formData.adress == ""){
            alert('Please assign a Address')
            return false
        }else if(!isValidAdress(formData.formData.adress)){
            alert('Please assgin a valid Address')
            return false
        }
        
        if(formData.formData.district == ""){
           
            alert('Please assign a District')
            return false
        }
        if(formData.formData.postalCode == ""){
            alert('Please assign a Postal Code')
            return false
        }else if(!isValidZipCode(formData.formData.postalCode)){
            alert('Please assign a valid Postal Code')
            return false
        }



        if(formData.formData.numberDoor == ""){
            alert('Please assign a door number')
            return false
        }else if(!isValidDoorNumber(Number(formData.formData.numberDoor))){
            alert('Please assign a valid door number')
            return false

        }
        if(formData.formData.municipality == ""){
            alert('Please assign a Municipality')
            return false
        }
        if(formData.formData.description == ""){
            alert('Please assign a Description')
            return false
        }
        return true
        
  }





    return (
        <>
            <div className="TaskLocationDiv">
                <h2>Task Location</h2> 
                <div className="TaskLocationDiv1">
                    <input type="text"
                        required={true}
                        className="FormServiceAdress"
                        placeholder="Name of the street, Parish" 
                        autoFocus
                        id ="adress"
                        name="adress"
                        value={formData.adress}
                        onChange={(e) => setFormData({...formData, adress: e.target.value})}
                    />
                    <input type="number"
                        required={true}
                        className="FormServiceNumberDoor"
                        placeholder="Nº" 
                        autoFocus
                        id ="numberDoor"
                        name="numberDoor"
                        value={formData.numberDoor}
                        onChange={(e) => setFormData({...formData, numberDoor: e.target.value})}
                    />
                    <input type="text"
                        required={true}
                        className="FormServicePostalCode"
                        placeholder="***-***" 
                        autoFocus
                        id ="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    />
                </div>
        
                    <div className="dropdown-selection">
                        <select className="form-select" name="districtSelect" onChange={(e)=>{
                            
                            
                            const index = Number(e.target.value)
                                if (index != -1){
                                    setSelDistrict(Number(index))
                                    setFormData({...formData, district: districts[index].name.toString()})
                                }
                        }}>
                            <option selected value={-1}>Select a District</option>
                            {districts?.map((district,index)=>{
                                return(
                                    <option value={index} id={"district-"+district.name}>{district.name}</option>
                                )
                            })}
                        </select>

                        {load ? <select className="form-select" name="municipalitySelect" onChange={(e)=>{
                            
                            const index = Number(e.target.value)
                                if (index != -1){
                                    setFormData({...formData, municipality: districts[selDistrict].municipalities[index].name.toString()})
                                }
                            }}>
                            <option selected value={-1}>Select a Municipality</option>
                            {districts[selDistrict].municipalities.map((municipality,index)=>{
                                return(
                                    municipality.name != 'todos' ? <option value={index} id={"mun-"+municipality.name}>{municipality.name}</option> : <></>
                                )
                            })}
                        </select> : <></>}
                    </div>
                </div>
        
        <div className='TaskDescriptionDiv'>
            <h2>Task Description</h2>
            <input type="Description"
                className="FormServiceDescription"
                placeholder={descriptionDefault} 
                autoFocus
                id ="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
        </div>

        <div className="buttons">
            <button 
                className="formService1prev"
                disabled={formData.page == 0} 
                >
                    Prev
            </button>
            <button 
                className="formService1next"
                name="next"
                onClick={
                    () =>{  
                            if(verifyForm1({formData})){
                                setFormData({...formData, page: formData.page+1})
                            }
                            
                    } 
                } >
                     Next
            </button>
        </div>
    </>

    )
}