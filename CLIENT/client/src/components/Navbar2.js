import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'

export default function NavBar(){
  return (
    <>
    <Breadcrumb>
      <Breadcrumb.Item active>
        <Link className='navbar-brand' to='/'>Home</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item active>
        <Link to='/chat'>Chat page</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item active>
        <Link to= '/post/:id'>QuestionForum</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item active>
        <Link to= '/profile'>Profile Page</Link>
      </Breadcrumb.Item>
    </Breadcrumb>
    </>
  )
}