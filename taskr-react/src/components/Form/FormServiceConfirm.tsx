import { Link, useNavigate } from "react-router-dom";
import { FormDataProps } from "./Form";
import './FormServiceConfirm.css'
import axios from "axios";
import { hostname } from "../vars";
import { IProviderService } from "../../interfaces/IProviderService";
import calendar from './icon/calendar.png'
import time from './icon/time.png'


export default function FormServiceConfirm({ formData, setFormData }: FormDataProps) {

    const navigate = useNavigate()
    const street: string = formData.adress.split(",")[0]
    const parish: string = formData.adress.split(",")[1]
    const logged = window.localStorage.getItem("logged")
    const day = formData.date.split('-')[2]
    const month = formData.date.split('-')[1]

    let id = ""
    if (logged) {

        const json = JSON.parse(logged)
        id = json.id
    }

    function generateDate(date: string, startHour: string) {
        return `${date}T${startHour}`;
    }


    function handleConfirmClick() {
        axios.post(hostname + "orders", {
            providerId: formData.providerReserved?.id.toString(),
            description: formData.description,
            dateHour: generateDate(formData.date, formData.startHour),
            serviceTypeId: formData.typeServiceId,
            street: street + " " + formData.numberDoor + ", " + formData.postalCode,
            parish: parish,
            municipality: formData.municipality,
            district: formData.district,
            clientId: parseInt(id)
        }).then((response) => {
                alert('Added Order With Success')
                navigate("/")
            }).catch((response) => {
                alert('Failed to add order')
                console.log(response)
            })
    }

    var typeService = formData.typeServiceName;

    function getServicePrice(providerServices: IProviderService[], id: Number) {
        for (var providerService of providerServices) {
          if (providerService.serviceType.id === id) {
            return providerService.pricePerHour
          }
        }
        return '-'
    }

    return (
        <div className="confirm-container">
            <div className="formServiceConfirmDiv">
                <div className="typeService">
                    <h3>{typeService}</h3>
                </div>
                <div className="dateHourDescription">
                    <div className="row-confirm-row">
                            <img src={calendar}/>
                            <h5>{day + '/' + month}</h5>
                    </div>
                    
                    <div className="row-confirm-row">
                            <img src={time}/>
                            <h5>{formData.startHour}-{formData.endHour}</h5>
                    </div>
                    
                    
                </div>
               
               <div className="row-confirm">
                        <div className="providerDescription">

                                <h5>Professional:</h5>

                                <div className='reservation-confirm'>
                                    <div className="providerPhoto">
                                        <img src={formData.providerReserved?.photo} />
                                    </div>
                                    
                                    <Link to={'/provider/' + formData.providerReserved?.id} target="_blank" className='providerProfile'>View Profile</Link>
                                </div>

                                <div className='description-confirm'>
                                    <p className='nameProvider'>{formData.nameProvider}</p>
                                    <p className='preco'>{formData.pricePerHour} €/h</p>
                                </div>

                        </div>


                        <div className='right-column-confirm'>
                                
                                <div className="taskLocation">
                                    <h5>Location</h5>
                                    <div className="adress-confirm">
                                        <div className="row-confirm-row">
                                            <h6>Adress: </h6>
                                            <p> {formData.adress},{formData.numberDoor}, {formData.municipality}, {formData.district}</p>
                                        </div>
                                        <div className="row-confirm-row">
                                            <h6>Postal Code: </h6>
                                            <p>{formData.postalCode}</p>
                                        </div>
                                        
                                    </div>
                                    
                                    
                                </div>

                                <div className="taskDescription">
                                    <h5>Description</h5>
                                    <p>{formData.description}</p>
                                </div>
                        </div >

               </div>
                

                <div className="correctData">
                    <h6>Is all the data that you entered correct?</h6>
                    <input type="checkbox"
                        className="checkBox"
                        autoFocus
                        id="checkData"
                        checked={formData.yourDataCorrect}
                        onChange={(e) => setFormData({ ...formData, yourDataCorrect: !formData.yourDataCorrect })}
                    />

                </div>

                <div className="formService4buttons">
                    
                    <div className="left-btn-confirm">
                    <button
                        className="formService4edit"
                        onClick={
                            () => {
                                setFormData({ ...formData, page: formData.page - 1 })
                            }} >
                        Prev
                    </button>
                    </div>
                   
                    <div className="left-btn-confirm">
                        <button
                            className="formService4confirm"
                            disabled={!formData.yourDataCorrect}
                            onClick={
                                () => {
                                    handleConfirmClick();
                                }} >
                            Confirm
                        </button>
                    </div>
                   
                </div>
            </div>
        </div>
    )

}
