import './FormService3.css'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Calendar from 'react-calendar';
import { useEffect, useState } from 'react'
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { FormDataProps } from './Form';
import { IOrder } from '../../interfaces/IOrder';
import { IAvailabilityInterval } from '../../interfaces/IAvailabilityInterval';
import axios from 'axios';
import { hostname } from '../vars';
import { IProviderService } from '../../interfaces/IProviderService';
import { Temporal } from '@js-temporal/polyfill';
import { IProvider } from '../../interfaces/IProvider';
import { addDays, startOfDay } from 'date-fns';
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface AvailabilitySlots {
    day: string
    startTime: string
    endTime: string
    status: number
}

function getServiceDuration(provider: IProvider, id: Number) {
    const providerServices: IProviderService[] = provider.providerServices
    for (var providerService of providerServices) {
        if (providerService.serviceType.id === id) {
            const d = Temporal.Duration.from(providerService.expectedDuration).round({ smallestUnit: 'hours', roundingMode: 'ceil'});
            return d.hours
        }
    }
    return Temporal.Duration.from('PT1H').hours
}

function hourToString(hour: number) {
    const hourString = hour.toString().padStart(2, '0');
    return `${hourString}:00`;
}


function formatDate(date: Date, hour: number) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hourM = hourToString(hour)
    return `${year}-${month}-${day}T${hourM}:00`;
}

function createAvailabilitySlots(startHour: number, duration: number, endHour: number, orders: IOrder[], weekDay: string, date: Date) {
    let availabilitySlots: AvailabilitySlots[] = []
    const weekDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    for (let hour = startHour; hour + duration <= endHour; hour += duration) {
        let display: AvailabilitySlots = {
            day: weekDay,
            startTime: hourToString(hour),
            endTime: hourToString(hour + duration),
            status: 0
        }

        for (let j = 0; j < orders.length; j++) {
            let dateOrder = orders[j].datehour.toString()
            let dateSlot = formatDate(date, hour)

            if (dateSlot === dateOrder) {
                display.status = 1
            }
        }
        availabilitySlots.push(display)
    }
    return availabilitySlots
}

export default function FormService3({ formData, setFormData }: FormDataProps) {
    const [valueCalendar, onChange] = useState<Value>(new Date());
    const [orders, setProviderOrders] = useState<IOrder[]>([]);
    const [availability, setProviderAvailability] = useState<IAvailabilityInterval[]>([]);
    const [availabilitySlots, setAvailabilitySlotsData] = useState<AvailabilitySlots[]>([]);
    const weekDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const [clickedSlot, setClickedSlot] = useState<boolean>(false);

    function onChangeCalendar(value: Value) {
        onChange(value)
        let day = value as Date
        let weekDay = weekDays[day.getDay()];
        let DisplayDataAux: AvailabilitySlots[] = []

        for (let i = 0; i < availability.length; i++) {

            const startHour = parseInt(availability[i].startTime.split(":")[0])
            const duration = formData.providerReserved ? getServiceDuration(formData.providerReserved, formData.typeServiceId) : 0;
            const endHour = parseInt(availability[i].endTime.split(":")[0])

            if (availability[i].day === weekDay && duration > 0) {
                const availabilitySlots = createAvailabilitySlots(startHour, duration, endHour, orders, weekDay, day);
                DisplayDataAux = DisplayDataAux.concat(availabilitySlots)
            }
        }
        setAvailabilitySlotsData(DisplayDataAux)
    }

    function setSelectedsFalse() {
        for (let i = 0; i < availabilitySlots.length; i++) {
            if (availabilitySlots[i].status == 2)
                availabilitySlots[i].status = 0
        }
        setAvailabilitySlotsData(availabilitySlots)
    }

    interface Tile {
        date: Date;
        view: string;
      }

    const tileClassName = ({ date, view }: Tile): string | null => {
        let availability:IAvailabilityInterval[] = []
        let daysAvailable:string[] = []
        
        const duration = formData.providerReserved ? getServiceDuration(formData.providerReserved, formData.typeServiceId) : 0;

        if(formData.providerReserved === undefined){
            availability = []
        }else{
            availability = formData.providerReserved?.availability
        }
        
        for (let index = 0; index < availability.length; index++) {
            const startHour = parseInt(availability[index].startTime.split(":")[0])
            const endHour = parseInt(availability[index].endTime.split(":")[0])
            if(!daysAvailable.includes(availability[index].day)){
                if(duration <= endHour-startHour)
                daysAvailable.push(availability[index].day)
            }
            
        }

        if (view === 'month' && daysAvailable.includes(weekDays[date.getDay()])) {
          
          return 'calendar-text-color highlight-monday';
        }
        return 'calendar-text-color';
      };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const pendingOrders = await axios.get(hostname + 'users/providers/' + formData.providerReserved?.id + "/orders", {
                    params: {
                        orderState: "pending",
                    }
                });

                const acceptedOrders = await axios.get(hostname + 'users/providers/' + formData.providerReserved?.id + "/orders", {
                    params: {
                        orderState: "accepted",
                    }
                });


                const combinedOrders = pendingOrders.data.concat(acceptedOrders.data);
                setProviderOrders(combinedOrders)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchOrders();
        setProviderAvailability(formData.providerReserved?.availability ? formData.providerReserved?.availability : [])
    }, []);

    return (
        <>
            <div className='container-calendar'>
                <div className='calendar'>
                    <h3>Calendar</h3>
                    <Calendar tileClassName={tileClassName} locale="en-EN" minDate={startOfDay(addDays(new Date(), 1))} onChange={(e) => onChangeCalendar(e)} value={valueCalendar} />
                </div>
                <div className='availability'>
                    <h3>Availability</h3>
                    <div className='availability-scroll'>
                    {availabilitySlots.map((slot, index) => (
                        
                            <button className={slot.status === 0 ? "single-availability free" : (slot.status === 1 ? "single-availability not-free" : "single-availability selected")}
                                onClick={() => {
                                    if(slot.status !== 1){
                                        setSelectedsFalse()
                                        slot.status = 2
                                        setFormData({ ...formData, date: format(valueCalendar as Date, 'yyyy-MM-dd'), startHour: slot.startTime, endHour: slot.endTime })
                                        setClickedSlot(true)
                                    }
                                }}>
                                {slot.startTime} - {slot.endTime}
                            </button>
                        
                    ))}
                    </div>
                </div>
            </div>
            <div className="formService3buttons">
               
                        <button
                            className="formService3prev"
                            disabled={formData.page == 0}
                            onClick={() => {
                                setFormData({ ...formData, page: formData.page - 1 })
                            }}>
                            Prev
                        </button>
                
                {!clickedSlot ?
                        <button
                            className={"formService3next"}
                            disabled
                            onClick={() => {
                                setFormData({ ...formData, page: formData.page + 1 })
                            }} >
                            Next
                        </button>
                        :
                        <button
                            className={"formService3next"}
                            onClick={() => {
                                setFormData({ ...formData, page: formData.page + 1 })
                            }} >
                            Next
                        </button>

                }
            </div>
        </>

    )
}
