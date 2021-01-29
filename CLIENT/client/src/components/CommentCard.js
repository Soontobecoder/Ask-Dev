import { Modal, Form, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "../config/axios";

export default function CommentCard(props) {
  const [show, setShow] = useState(false);
  const [showDeleteModal, setDeleteModalShow] = useState(false);
  const [comment, setComment] = useState("");
  const [hideBtn] = useState(localStorage.getItem('nickname') === props.name ? false : true)

  function handleClose(status) {
    if (status === "save-edit") {
      axios({
        method: "PUT",
        url: `/answers/${props.PostId}/${props.AnswerId}`,
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
        data: {
          description: comment,
        },
      })
        .then((_) => {
          setShow(false);
          props.refetch();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setShow(false);
    }
  }

  function handleShow(e) {
    e.preventDefault();
    axios
      .get(`/answers/${props.PostId}/${props.AnswerId}`)
      .then(({ data }) => {
        setComment(data);
        setShow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleChange(e) {
    setComment(e.target.value);
  }

  function handleCloseDelModal(status) {
    setDeleteModalShow(false);
    if (status === "yes") {
      console.log("masukk delete");
      axios({
        method: "DELETE",
        url: `/answers/${props.PostId}/${props.AnswerId}`,
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      })
        .then((_) => {
          setShow(false);
          props.refetch();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleShowDelModal() {
    setDeleteModalShow(true);
  }

  return (
    <>
      <div className="col-12 mt-2">
        <div className="card border-dark mb-3" style={{ maxWidth: "100rem" }}>
          <div className="card-header">{props.name}</div>

          <a href="#delete" hidden={hideBtn} onClick={handleShowDelModal}>
            <i
              className="fa fa-trash-o"
              style={{
                fontSize: "24px",
                position: "absolute",
                right: "70px",
                top: "8px",
              }}
            ></i>
          </a>
          <Modal centered show={showDeleteModal} onHide={handleCloseDelModal}>
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "red" }}>Notifications!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are You Sure?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDelModal}>
                No
              </Button>
              <Button
                variant="primary"
                onClick={() => handleCloseDelModal("yes")}
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
          <a href="#edit" hidden={hideBtn} onClick={handleShow}>
            <i
              className="fa fa-pencil-square-o"
              style={{
                fontSize: "24px",
                position: "absolute",
                right: "16px",
                top: "10px",
              }}
            ></i>
          </a>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Edit Your Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="comment"
                    value={comment.description}
                    onChange={handleChange}
                    placeholder="Input Title"
                  />
                </Form.Group>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => handleClose("close")}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleClose("save-edit")}
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>
          <div className="card-body text-dark">
            <h5 className="card-title">{props.role}</h5>
            {/* <p className="card-text">{props.comment}</p> */}
            <div dangerouslySetInnerHTML={ { __html: props.comment } }></div>
          </div>
        </div>
      </div>
    </>
  );
}
