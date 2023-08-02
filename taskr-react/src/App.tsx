  import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";


import HomePage from './components/HomePage/HomePage'
import SignUp from './components/SignUp/SignUp'
import SignUpTasker from "./components/SignUpTasker/SignUpTasker";
import Login from "./components/Login/Login"
import Profile from "./components/Profile/Profile"
import Form from './components/Form/Form'
import SelectAservice from "./components/SelectAservice/SelectAservice";
import Provider from "./components/Provider/Provider";
import  {ProtectedRoute} from "./ProtectedRoute/ProtectedRoute";
import ServiceAvailabilityTable from "./components/ServiceAvailabilityTable/ServiceAvailabilityTable"
import Tasks from "./components/Tasks/Tasks";
import SettingsAdmin from "./components/SettingsAdmin/SettingsAdmin";
import PaymentPage from "./components/PaymentPage/PaymentPage";
import ManageProviders from "./components/ManageProviders/ManageProviders";

  function App() {
     
       
    return (
      <BrowserRouter>
      <Routes>
        
        <Route path='/'  element={
        
            <>
              <HomePage/>
            </>
        } />

        <Route path='/signup' element={
          <SignUp/>
        }
        
        />

        <Route path='/beatasker' element={
          <SignUpTasker/>
        }
        
        />

      <Route path='/login' element={
          <Login/>
        }
        
        />

      <Route path='/profile/:menu'  element={
              
        
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
                
              
          } />

      <Route path='/profile'  element={
              
        
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
                
              
          } />

      <Route path='/settings' element={
                <ProtectedRoute>
                  <SettingsAdmin></SettingsAdmin>
                </ProtectedRoute>
                  
              }/>
        

      <Route path='/servicesavailabilitytable' element={
        <ProtectedRoute>
          <ServiceAvailabilityTable/>
        </ProtectedRoute>
          
      }/>
    
      <Route path='/tasks'  element={
              
        
              <ProtectedRoute>
                <Tasks/>
              </ProtectedRoute>
                
              
          } />

      <Route path='/manageProviders'  element={
              
        
              <ProtectedRoute>
                <ManageProviders/>
              </ProtectedRoute>
                
              
          } />

      <Route path='/form'  element={
              <>
                <ProtectedRoute>
                  <Form></Form>
                </ProtectedRoute>
              </>
                
          } />

        <Route path='/provider/:providerId' element={<Provider />} />


        <Route path='/pay/:id' element={

          <PaymentPage/>
        }/>

        <Route path='/category/:name' element={
          <SelectAservice/>
        }  
        />

        <Route path='*' element={
          <p>Not Found</p>
        }/>

      </Routes>
  
  </BrowserRouter>

    );
  }

  export default App;