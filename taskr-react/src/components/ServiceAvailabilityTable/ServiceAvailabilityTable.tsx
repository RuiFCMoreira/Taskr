
import { Table } from 'react-bootstrap';  
import './ServiceAvailabilityTable.css'
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { hostname } from '../vars';
import { IAvailabilityInterval } from '../../interfaces/IAvailabilityInterval';



const ServiceAvailabilityTable = () => {

    const [activated,setActivated] = useState<Boolean[][]>([[]])
    const [reload, setRelaod] = useState(0)
    const [load,setLoad] = useState(false)
    const [providerId, setProviderId] = useState('-1')

    var hours = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4,5,6,7]

    function mapDaytoIndex(day:string){
        if(day == 'SUNDAY') return 0
        if(day == 'MONDAY') return 1
        if(day == 'TUESDAY') return 2
        if(day == 'WEDNESDAY') return 3
        if(day == 'THURSDAY') return 4
        if(day == 'FRIDAY') return 5
        if(day == 'SATURDAY') return 6

        return -1
    }

    function mapIndextoDay(day:number){
        if(day == 0) return'SUNDAY'
        if(day == 1) return 'MONDAY'
        if(day == 2) return 'TUESDAY'
        if(day == 3) return 'WEDNESDAY'
        if(day == 4) return 'THURSDAY'
        if(day == 5) return 'FRIDAY'
        if(day == 6) return 'SATURDAY'

        return "-1"
    }


    function mapIndextoHour(hour:number){
       return hours[hour]
    }

    function mapHourtoIndex(hour:number){
        
        return hours.indexOf(hour)
    }

    useEffect(()=>{
        const fetchData = async () => {
            
            try {
                const logged = window.localStorage.getItem("logged")
                
                var auxActivate = []

                for(let i = 0; i < 7; i++){
                    var hoursAux = []
                    for(let j = 0; j < 24; j++){
                        hoursAux.push(false)
                    }
                    auxActivate.push(hoursAux)
                }

                if(logged){

                    const json = JSON.parse(logged)
                    setProviderId(json.id)
                    const response = await axios.get(hostname + `users/providers/${json.id}/availability`)

                    const availabilities:IAvailabilityInterval[] = response.data

                    for(const availability of availabilities){

                        for(let i = Number(availability.startTime.toString().split(':')[0]); i < Number(availability.endTime.toString().split(':')[0]); i++){
                            auxActivate[mapDaytoIndex(availability.day)][mapHourtoIndex(i)] = true           
                        }
                    }
                    setActivated(auxActivate)
                    setLoad(true)
                }           
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        }

        fetchData()
        
        },[])



    useEffect(()=>{console.log('reloading css')},[reload])

    const changeActive = (row:number,column:number) => {

        var activatedAux = activated
        activatedAux[row][column] = !activatedAux[row][column]
        setActivated(activatedAux)
        setRelaod(reload + 1)

    }

    function getConsecutiveIntervals(arr:number[]) {
        const intervals = [];
        let start = arr[0];
        let end = arr[0];
      
        for (let i = 1; i < arr.length; i++) {
          if (arr[i] === end + 1) {
            end = arr[i];
          } else {
            intervals.push([start, end]);
            start = arr[i];
            end = arr[i];
          }
        }
      
        intervals.push([start, end]);
      
        return intervals;
      }

    const applyChanges = () => {

        var availabilities:IAvailabilityInterval[] = []

        var hoursPerDay = []

        for(const day of activated){
            var hours = []
            var counter = 0
            for(const hour of day){
                if(hour === true){
                    hours.push(mapIndextoHour(counter))
                }
                counter++

            }
            hoursPerDay.push(hours)
        }

        var j = 0
        for(const hs of hoursPerDay){
            if(hs.length > 0){
                for(const interval of getConsecutiveIntervals(hs)){
                    if(interval.length > 0){
                        console.log(interval)
                        availabilities.push({
                            day:mapIndextoDay(j),
                            startTime: Math.min(...interval) >= 10 ? `${Math.min(...interval)}:00:00` : `0${Math.min(...interval)}:00:00`,
                            endTime: Math.max(...interval) + 1 >= 10 ? `${Math.max(...interval) + 1}:00:00` : `0${Math.max(...interval) + 1}:00:00`
                        })
                    }   
                                    
                }
        }
        j++
    }

    axios.post(hostname + 'users/providers/' + providerId + '/availability', {
        "availabilities":availabilities
    }).then((response) => {
        alert('Updated availability')
        console.log(response.data)

    }).catch((response) => {
        alert('Failed to update availability')
        console.log(response)
    })
}

    return(

        <>
        <Navbar></Navbar>


        <div className='table-availability-container'>  

            <button className='availability-btn' onClick={()=>applyChanges()}>Apply Changes</button>
            
            <Table className='table-availability' bordered >  
            <thead>  
                <tr >  
                    <th style={{width:'200px'}}>Hour</th>  
                    <th style={{width:'150px'}}>Sunday</th>  
                    <th style={{width:'150px'}}>Monday</th>  
                    <th style={{width:'150px'}}>Tuesday</th> 
                    <th style={{width:'150px'}}>Wednesday</th>
                    <th style={{width:'150px'}}>Thursday</th>
                    <th style={{width:'150px'}}>Friday</th>
                    <th style={{width:'150px'}}>Saturday</th>
                </tr>  
            </thead>  
            <tbody>  
                {
                    hours.map((hour, index)=>{
                        return(
                            <tr> 
                                <th>{hour < 10 ? `0${hour}`: `${hour}`}:00h - {hour + 1 < 10 ? `0${hour + 1}`: `${(hour + 1)}`}:00h</th>
                                {load ? <th style={{backgroundColor:activated[0][index]? 'green' : 'white'}} onClick={()=>{changeActive(0,index)}}></th> : <th></th>} 
                                {load ? <th style={{backgroundColor:activated[1][index]? 'green' : 'white'}} onClick={()=>{changeActive(1,index)}}></th> : <th></th>}
                                {load ? <th style={{backgroundColor:activated[2][index]? 'green' : 'white'}} onClick={()=>{changeActive(2,index)}}></th> : <th></th>}
                                {load ? <th style={{backgroundColor:activated[3][index]? 'green' : 'white'}} onClick={()=>{changeActive(3,index)}}></th> : <th></th>}
                                {load ? <th style={{backgroundColor:activated[4][index]? 'green' : 'white'}} onClick={()=>{changeActive(4,index)}}></th> : <th></th>}
                                {load ? <th style={{backgroundColor:activated[5][index]? 'green' : 'white'}} onClick={()=>{changeActive(5,index)}}></th> : <th></th>}
                                {load ? <th style={{backgroundColor:activated[6][index]? 'green' : 'white'}} onClick={()=>{changeActive(6,index)}}></th> : <th></th>}
                            </tr>  
                        )
                    })
                }
                
            </tbody>  
            </Table>  
            

            
        </div>  

        <Footer></Footer>
        </>
    )

}


export default ServiceAvailabilityTable;