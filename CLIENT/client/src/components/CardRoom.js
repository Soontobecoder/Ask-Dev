import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {Button} from 'react-bootstrap'
import axios from '../config/axios'
export default function CardRoom(props) {
  const [isRoomFull,setIsRoomFull] = useState(false)
  const history = useHistory()
  const handleClick = () => {
    if(localStorage.getItem('access_token')){
      axios.get('/listRoom')
        .then(({data}) => {
          if(data[props.roomId]){
            if(Object.keys(data[props.roomId]).length === 2){
              setIsRoomFull(true)
            }else{
              history.push(`/room/${props.roomId}`)
            }
          }else{
            history.push(`/room/${props.roomId}`)
          }
        }).catch(err => console.log(err))
    }
  }

  useEffect(() => {
    axios.get('/listRoom')
      .then(({data}) => {
        if(data[props.roomId]){
          if(Object.keys(data[props.roomId]).length === 2){
            setIsRoomFull(true)
          }
        }
      })
      // eslint-disable-next-line
  },[])

  return (
    <div className="card mb-3 rounded" style={{width: "60%%", height: '80px'}} onClick={handleClick}>
      <div className="row g-0 justify-content-center">
        {/* <div className="col-md-3 ">
          <img src="https://cdn.iconscout.com/icon/free/png-512/account-profile-avatar-man-circle-round-user-30452.png" className='mt-3' alt="..." style={{width:'100px'}} />
          <span> </span>
          
        </div> */}
        <div className="col-md-8 p-0">
          <div className="d-flex flex-column card-body container p-0" style={{justifyContent:'center'}}>
            <h6 className="card-title" style={{textAlign:'center'}}>Room {props.roomId}</h6>
            {
              isRoomFull ? 
              <p className="card-text"><small className="text-muted">room is full</small></p>
              :
              <Button className="mb-12 rounded-pill" style={{width:"100%", justifyContent:'center'}}  onClick={handleClick} >Join</Button>
            }
            <span></span> 
            
          </div>
        </div>
      </div>
    </div>
    
    
  )
}
