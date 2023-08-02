import React, { useState } from "react";
import FormService1 from "./FormService1";
import FormService2 from "./FormService2";
import FormServiceConfirm from "./FormServiceConfirm"
import NavbarForm from "./NavbarForm";
import Footer from "../Footer/Footer";
import './Form.css'
import { useParams, useSearchParams } from "react-router-dom";
import FormService3 from "./FormService3";
import { IProvider } from "../../interfaces/IProvider";


export interface FormProps{
    formData: {
        page : number
        adress : string
        numberDoor: string
        postalCode: string
        municipality: string
        district: string
        description: string
        nameProvider: string
        date : string
        startHour: string
        endHour : string
        pricePerHour : string
        yourDataCorrect : boolean
        typeServiceId: number
        providerReserved?: IProvider
        typeServiceName: string
    }
}

export interface CompleteFormState{
    page : number
    adress : string
    numberDoor: string
    postalCode: string
    municipality: string
    district: string
    description: string
    nameProvider: string
    date : string
    startHour: string
    endHour : string
    pricePerHour : string
    yourDataCorrect : boolean
    typeServiceId: number
    providerReserved?: IProvider
    typeServiceName: string
}

export interface FormDataProps extends FormProps{
    setFormData: React.Dispatch<React.SetStateAction<CompleteFormState>>
}

function MyForm() {
    
    //const {typeService} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const typeService = searchParams.get('typeService');
    const typeServiceInt = typeService !== null ? parseInt(typeService) : -1;
   
    const [formData, setFormData] = useState({
        page : 0,
        adress : "",
        numberDoor: "",
        postalCode: "",
        municipality: "",
        district: "",
        description: "",
        nameProvider: "",
        date : "",
        startHour: "",
        endHour : "",
        pricePerHour : "-",
        yourDataCorrect : false,
        typeServiceId: typeServiceInt,
        typeServiceName: "",
    }) 

    const formDisplay = () => {
        if(formData.page === 0){
            return <FormService1 formData={formData} setFormData={setFormData}/>
        } 
        else if (formData.page == 1) {
             return <FormService2 formData={formData} setFormData={setFormData}/>
        } 
        else if (formData.page == 2) {
            return  <FormService3 formData={formData} setFormData={setFormData}/>
       } 
       else {
            return  <FormServiceConfirm formData={formData} setFormData={setFormData}/> 
        }
    }

    return <div className="Form">
                <NavbarForm formData={formData} setFormData={setFormData}></NavbarForm>    
                {formDisplay()}
                <Footer></Footer>
            </div>
            
}

export default MyForm