// import React, { useEffect, useState, useRef, Suspense } from 'react';
// import io from 'socket.io-client'
// import Peer from 'simple-peer'
import { Link } from 'react-router-dom'
import Nav from './Navbar'
import CardPost from './CardPost'
import CardRoom from './CardRoom'

const rooms = [
  "1","2","3","4"
]
const posts = [1,2,3,4,5,6,7,8,9,10,11,12]

function Home() {

  return(
    <>
      <Nav/>
      <div className="container" style={{minWidth:'95vw',minHeight:'80vh'}}>
        <div className="row">
          <div className="col-2 bg-info" style={{minHeight:'200px'}}>
            <div className="d-flex flex-column align-items-center" style={{marginTop:'20px',width:'100%',gap:'7px'}}>
              <Link to="/javascript" className="btn">Javascript</Link>
              <Link to="/python" className="btn">Python</Link>
              <Link to="java" className="btn">Java</Link>
              <Link to="/cpp" className="btn">C++</Link>
              <Link to="/cs" className="btn">C#</Link>
            </div>
          </div>
          <div className="col-7" style={{minHeight:'200px'}}>
            {
              posts.map(post => {
                return <CardPost key={post} postId={post}/>
              })
            }
          </div>
          <div className="col-3 bg-info" style={{minHeight:'200px',gap:'7px'}}>
            {
              rooms.map(room => {
                return <CardRoom key={room} roomId={room}/>
              })  
            }
          </div>
        </div>
      </div>
    </>
  )
}
  
export default Home;