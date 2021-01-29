import { Button, Nav, Modal, Form } from 'react-bootstrap'
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ResponseGoogle } from "../components";
import GitHubLogin from "react-github-login";
import axios from "../config/axios";
import { CKEditor } from '@ckeditor/ckeditor5-react'
// import Editor from '../ckeditor5/src/ckeditor'
import Editor from '@ckeditor/ckeditor5-build-classic'


export default function NavBar(props) {
  const [isLogin,setIsLogin] = useState(false)
  const [show, setShow] = useState(false);
  const [inputModal, setInputModal] = useState({
    question: '',
    description: '',
    category:'Javascript'
  })

  const onSuccess = (res) => {
    console.log(res.code);
    axios
      .get(`/user/oauth-callback?code=${res.code}`)
      .then(({ data }) => {
        console.log(data);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("nickname", data.nickname);
        setIsLogin(true)
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFailure = (response) => console.error(response);

  function handleChange(e) {
    setInputModal({ ...inputModal, [e.target.name]: e.target.value });
  }
  function handleChangeEditor (e) {
    console.log(e)
  }

  function handleClose(status) {
    setShow(false);

    if (status === 'save-post'){
      axios({
        method: "POST",
        url: `/post`,
        data: {
          question: inputModal.question,
          description: inputModal.description,
          category: inputModal.category,
        },
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      })
        .then((_) => {
          props.refetch()
          console.log("berhasil");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  function handleShow() {
    setShow(true);
  } 
  useEffect(()=>{
    if(localStorage.getItem('access_token')){
      setIsLogin(true)
    }
    // Editor.builtinPlugins.map( plugin => console.log(plugin.pluginName) );
  },[])
  const logout = () => {
    localStorage.clear()
    setIsLogin(false)
  }


  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#3399FF", display:'flex', justifyContent:'space-between' }}
    >
      {/* <div> */}
        <div>
          <NavLink
            exact
            to="/"
            activeStyle={{ fontWeight: "bold" }}
            className="btn navbar-brand"
          >
            Home
          </NavLink>
          <Button variant="" onClick={handleShow}>
            Ask Question
          </Button>

          <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>AskDev</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                name="question"
                value={inputModal.question}
                onChange={handleChange}
                placeholder="Input Question"
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">

                <Form.Label>Description</Form.Label>
                {/* <Form.Control as="textarea" name="description" value={inputModal.description} onChange={handleChange} placeholder="Input Description" /> */}
                {/* <Editor editorState={editorState} onChange={setEditorState}/>
                 */}
                 <CKEditor
                  config={{placeholder: "Overview ..."}} 
                  editor={ Editor }
                  data={inputModal.description}
                  onReady={ editor => {
                      // You can store the "editor" and use when it is needed.
                      console.log( 'Editor is ready to use!', editor );
                  } }
                  onChange={ ( event, editor ) => {
                      const data = editor.getData();
                      setInputModal({...inputModal,description:data})
                      console.log( { event, editor, data } );
                  } }
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Select category</Form.Label>

              <Form.Control as="select" custom name="category" onChange={handleChange}>
                
                <option value="Javascript">Javascript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="C#">C#</option>
              </Form.Control>
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => handleClose("close")}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleClose("save-post")}
              >
                Post
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
        </div>
        <div>
          <h2 
          // style={{fontWeight:'bold',marginLeft:'25rem',marginRight:'auto'}}
          >AskDev</h2>
        </div>
        <div style={{display:'flex', alignItems:'center'}}>
          {
            isLogin ?
            <>
              <h6>Hi, {localStorage.getItem('nickname')}</h6>
              <button onClick={logout} className="btn">logout</button>
            </>
            :
            <>
              <h4 style={{height:'20px',fontSize:'1rem'}}>Login With:</h4> 
              <Nav.Link>
              <ResponseGoogle setIsLogin={setIsLogin} style={{height:'auto'}} />
              </Nav.Link>
              <div className="align-items-center row github-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-github"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                <GitHubLogin
                  clientId="07b7bf9b0666de61261d"
                  buttonText="Github"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  valid={true}
                  className="btn"
                  redirectUri="http://localhost:3000"
                />
              </div>
            </>
          }
        </div>
      {/* </div> */}


            {/* <Nav.Link href="/github">
              <Button variant="dark" style={{ height: "44px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-github"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                github
              </Button>
            </Nav.Link> */}
        </nav>

  );
}
