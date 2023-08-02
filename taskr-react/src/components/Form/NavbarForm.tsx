import { FormDataProps } from './Form';
import './NavbarForm.css'
import logo from './icon/logo-black.png';



export default function NavbarForm({formData, setFormData}:FormDataProps){

    return (
      <nav className='navbarForm'>
        
        <a href='/'><img  className="logoForm" src={logo} alt="" /></a>

        <div className="progressBarDiv">
          <div className='progressBar'>
            <div className='step1'>
              <div className='step1bar'></div>
              <div className='step1Circle'>
                <div className='step1CircleText'>1</div>
              </div>
            </div>

            <div className='step2'>
              {formData.page === 0 ? 
                  <div className='step2bar'></div>
                  :
                  <div className='step2barFill'></div>
              }
              <div className='step2Circle'>
                <div className='step2CircleText'>2</div>
              </div>
            </div>

            <div className='step3'>
              {formData.page === 0 || formData.page === 1 ? 
                  <div className='step3bar'></div>
                  :
                  <div className='step3barFill'></div>
              }
            
              <div className='step3Circle'>
                <div className='step3CircleText'>3</div>
              </div>
            </div>

            <div className='step4'>
            {formData.page === 0 || formData.page === 1 || formData.page === 2 ? 
                  <div className='step4bar'></div>
                  :
                  <div className='step4barFill'></div>
              }
          
              <div className='step4Circle'>
                <div className='step4CircleText'>4</div>
              </div>
            </div>
          </div>

          <div className='stepsText'>
            <div className='step1Text'>Describe Task</div>
            <div className='step2Text'>Choose task provider</div>
            <div className='step3Text'>Choose date and time</div>
            <div className='step4Text'>Confirm</div>
          </div>
        </div>
       
      </nav>
      
    )
}
