import React from 'react'

const ProfileCard = () => {

return (
  <div className="card">
    <div className="card-body">
      <div className="d-flex flex-column align-items-center text-center">
        <img src="https://i.imgur.com/dvdLhcu.jpg" alt="Admin" className="rounded-circle" width="150" />
        <div className="mt-3">
          <h4>Spiderman</h4>
          <p className="text-secondary mb-1">Full Stack Developer</p>
          <p className="text-muted font-size-sm">Bay Area, San Francisco, CA</p>
          <button className="btn btn-primary">Follow</button>
          <button className="btn btn-outline-primary">Message</button>
        </div>
      </div>
    </div>
  </div>
)
}
export default ProfileCard