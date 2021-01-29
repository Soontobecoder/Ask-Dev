import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer from "peerjs";
import { ChatBubbles, NavBar } from "../components";
import LoadingSpin from "./LoadingSpin";

// const chats = [
//   {
//     owner: 'me',
//     message: 'hello'
//   },
//   {
//     owner: 'him',
//     message: 'world'
//   },
//   {
//     owner: 'me',
//     message: '?'
//   },
//   {
//     owner: 'him',
//     message: '?'
//   }
// ]

function Room() {
  const params = useParams();
  const videoRef = useRef();
  const partnerVideoRef = useRef();
  const socketRef = useRef();
  const ownPeerId = useRef();
  const otherUserId = useRef();
  const [ownVideoStart, setOwnVideoStart] = useState(false);
  const [partnerVideoStart, setPartnerVideoStart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [allChat, setAllChat] = useState([]);
  // const allChat = useRef([])
  // const socket = io('http://localhost:3005')

  const peer = new Peer(undefined);
  const peers = {};
  const [input, setInput] = useState("");

  const handleNewChat = (message) => {
    // let newBubbleChat = {
    //   owner: 'him',
    //   message: message
    // }
    // let newArr = allChat.concat(newBubbleChat) // [...allChat,newBubbleChat]
    // console.log(allChat,newArr,'<<< handle');
    setAllChat(message);
  };

  const forceStopSharing = () => {
    // console.log('masuk force stop');
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        // console.log('masuk force own video')
        videoRef.current.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
        // socketRef.current.emit('stop-sharing',params.id)
        setOwnVideoStart(false);
      }
    }
    if (partnerVideoRef.current) {
      if (partnerVideoRef.current.srcObject) {
        // console.log('masuk force partner video')
        partnerVideoRef.current.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
        // socketRef.current.emit('stop-sharing',params.id)
        setPartnerVideoStart(false);
      }
    }
  };

  // useEffect(()=>{
  //   console.log(allChat,'<<< dari use effect')
  // },[allChat])

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3005");
    socketRef.current.on("user-connected", (userId) => {
      otherUserId.current = userId;
      socketRef.current.emit("give-my-id", {
        ownPeerId: ownPeerId.current,
        roomId: params.id,
      });
    });
    socketRef.current.on("receive-chat", (message) => {
      // console.log(message);
      // console.log(allChat, '<<< dari receive');
      handleNewChat(message);
    });
    socketRef.current.on("listUser", (payload) => {
      console.log(payload);
    });
    socketRef.current.on("user-disconnect", (userId) => {
      if (peers[userId]) peers[userId].close();
      // console.log(userId, "<<< userId");
    });
    socketRef.current.on("stop-sharing", () => {
      // console.log('masuk stop sharing');
      forceStopSharing();
      // partnerVideoRef.current.srcObject.getTracks().forEach(track => {
      //   track.stop()
      // })
      // partnerVideoRef.current.srcObject = null
      // setPartnerVideoStart(false)
    });
    socketRef.current.on("give-other-id", (otherId) => {
      otherUserId.current = otherId;
    });

    peer.on("open", (id) => {
      ownPeerId.current = id;
      let nickname = localStorage.getItem("nickname");
      socketRef.current.emit("join-room", params.id, id, nickname);
      setIsLoading(false);
    });
    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        // navigator.mediaDevices.getDisplayMedia({video:false,audio:false})
        .then((stream) => {
          videoRef.current.srcObject = stream;
          return navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
        })
        .then((audioStream) => {
          let audioTrack = audioStream.getAudioTracks()[0];
          videoRef.current.srcObject.addTrack(audioTrack);
          // console.log(videoRef.current.srcObject.getTracks());
          videoRef.current.srcObject.getTracks()[0].onended = () => {
            // videoRef.current.srcObject.getTracks().forEach(track => {
            //   track.stop()
            // })
            forceStopSharing();
            if (videoRef.current) {
              videoRef.current.srcObject = null;
            }
            socketRef.current.emit("stop-sharing", params.id);
            // setOwnVideoStart(false)
          };
          call.answer(videoRef.current.srcObject);
          call.on("stream", (otherVideoStream) => {
            partnerVideoRef.current.srcObject = otherVideoStream;
            setPartnerVideoStart(true);
          });
        });
    });

    return () => {
      // console.log('cleanup function');
      socketRef.current.emit("stop-sharing", params.id);
      socketRef.current.emit("leave-room", {
        roomId: params.id,
        name: localStorage.getItem("nickname"),
      });
      forceStopSharing();
      socketRef.current.disconnect();
    };

    // eslint-disable-next-line
  }, []);

  function handleChange(e) {
    setInput(e.target.value);
  }

  const startSharing = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setOwnVideoStart(true);
        return navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
      })
      .then((audioStream) => {
        let audioTrack = audioStream.getAudioTracks()[0];
        videoRef.current.srcObject.addTrack(audioTrack);
        videoRef.current.srcObject.getVideoTracks()[0].onended = () => {
          // videoRef.current.srcObject.getTracks().forEach(track => {
          //   track.stop()
          // })
          forceStopSharing();
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }

          socketRef.current.emit("stop-sharing", params.id);
          // setOwnVideoStart(false)
        };
        if (otherUserId.current) {
          connectToNewuser();
        }
      })
      .catch((err) => console.log(err));
  };

  function send() {
    let newBubble = {
      id: allChat.length + 1,
      owner: localStorage.getItem("nickname"),
      message: input,
    };
    let newObj = {
      roomId: params.id,
      message: [...allChat, newBubble],
    };
    socketRef.current.emit("send-chat", newObj);
    setAllChat([...allChat, newBubble]);
    // allChat.current = [...allChat.current,newBubble]
    setTimeout(() => {
      let elemenchat = document.getElementById("chat-container")
      elemenchat.scrollTop = elemenchat.scrollHeight
    },100)
    setInput("");
  }

  const connectToNewuser = () => {
    let userId = otherUserId.current;
    let stream = videoRef.current.srcObject;
    const call = peer.call(userId, stream);
    call.on("stream", (userVideoStream) => {
      partnerVideoRef.current.srcObject = userVideoStream;
    });
    call.on("close", () => {
      partnerVideoRef.current.srcObject = null;
    });
    peers[userId] = call;
  };

  if (isLoading)
    return (
      <div className="row justify-content-center">
        <LoadingSpin />
      </div>
    );
  return (
    <>
      <NavBar />

      <div className="container-fluid">
        <div className="ml-3" style={{minHeight:'100vh'}}>
          <div className="row mt-1" style={{height:'100vh'}} >
            <div className="col-3">
              <div className="mb-3" style={{ maxWidth: "540px" }}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png"
                      style={{ width: "90px" }}
                      alt="..."
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                    <h2> {"Discussion Room " + params.id} </h2>
                    </div>
                  </div>

                </div>
              </div>
              <div className="row" id="chat-container" style={{height:'23rem',overflow:'auto'}}>
                <ul>
                  {allChat.map((chat) => {
                    let owner =
                      localStorage.getItem("nickname") === chat.owner
                        ? "me"
                        : "him";
                    return (
                      <ChatBubbles
                        nameUser={chat.owner}
                        key={chat.id}
                        typer={owner}
                        msg={chat.message}
                      />
                    );
                  })}
                </ul>
              </div>
              <div className="footer mt-auto py-3 bg-light">
                <div className="container-fluid">
                  <div className="row align-items-center">
                    <div className="form-floating">
                      <form className="row"
                        onSubmit={(e) => {
                          e.preventDefault();
                          send();
                        }}
                      >
                        <div className="row d-flex flex-nowrap">
                            <input
                              autoComplete="off"
                              value={input}
                              onChange={handleChange}
                              className="form-control ml-3"
                              placeholder="Message"
                              id="floatingTextarea2"
                              style={{ height: "40px",width:'15rem' }}
                            ></input>
                          <button
                            type="submit"
                            // onClick={send}
                            className="btn btn-primary ml-2"
                          >
                            Send
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9 rounded" style={{paddingTop:'20px', marginBottom:'100px'}}>
              <div
                className="row justify-content-center align-items-center"
                style={{ height: "100%", backgroundColor:'grey' }}
              >
                <button
                  className="btn btn-primary"
                  hidden={ownVideoStart || partnerVideoStart}
                  onClick={startSharing}
                >
                  Start screen sharing
                </button>
                <button hidden
                  onClick={() => {
                    console.log(ownPeerId);
                    console.log(otherUserId);
                    // console.log(ownVideoStart)
                    // console.log(partnerVideoStart)
                    // console.log(videoRef.current.srcObject)
                    // console.log(partnerVideoRef.current.srcObject)
                  }}
                >
                  test
                </button>
                <video
                  ref={videoRef}
                  hidden={!ownVideoStart}
                  style={{
                    height: "90%",
                    width: "90%"
                  }}
                  muted
                  autoPlay
                ></video>
                <video
                  ref={partnerVideoRef}
                  hidden={!partnerVideoStart}
                  style={{
                    height: "90%",
                    width: "90%"
                  }}
                  autoPlay
                ></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Room;
