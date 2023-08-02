import './CancelTask.css'
import { useNavigate } from 'react-router-dom';



const CancelTask = () => {
    
    const logged = window.localStorage.getItem("logged");
    var typeUser = "" 
    var id= ""
    if(logged){
        const json = JSON.parse(logged)    
        typeUser = json.type
        id = json.id
    }

    const navigate = useNavigate()


        return (
            <div className='CancelTask'>
                <div className='cancelTaskHeader'>
                    <p>Cancel Tasks</p>
                </div>
                <div className='cancelTaskContent'>
                    <p>To cancel a task, go to your pending tasks and you should be able to see the "Cancel task" button for each task. Select "Cancel Task" to cancel all appointments for the task.</p>
                    <button className='goToTasksButton'
                        onClick={() => { navigate("/tasks") }}>
                        Go To Pending Tasks
                    </button>
                </div>
            </div>
        )
}

export default CancelTask