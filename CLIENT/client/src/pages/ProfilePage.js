import React from 'react';
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { NavBar, ProfileCard, ProfileDetail, ProfileInfo, ProfileStats } from '../components'

const ProfilePage = () => {

  return(
    <div className="container">
    <div className="main-body">
    
         
          <NavBar />
          
    
          <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
              
              <ProfileCard />
              
              <ProfileInfo />
            </div>
            <div className="col-md-8">
              
              <ProfileDetail />   
              
              <div className="row gutters-sm">
                <div className="col-sm-6 mb-3">
                
                <ProfileStats />
                </div>
                <div className="col-sm-6 mb-3">
                  <ProfileStats />
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ProfilePage

