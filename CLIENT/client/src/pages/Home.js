import { useLocation, NavLink } from "react-router-dom";
import { NavBar } from "../components";
import CardPost from "../components/CardPost";
import CardRoom from "../components/CardRoom";
import { useState, useEffect } from "react";
import axios from "../config/axios";
import LoadingSpin from "../components/LoadingSpin";
import Banner from '../components/Banner'

const rooms = ["1", "2", "3", "4","5"];
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Home() {
  const query = useQuery();
  const [init, setInit] = useState(true);
  const [loadingPost, setLoadingPost] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!init && query.get("category")) {
      setLoadingPost(true);
      setPosts([]);
      axios
        .get(`/post/category?name=${query.get("category")}`, {
          data: {
            category: query.get("category"),
          },
        })
        .then(({ data }) => {
          setPosts(data);
          setLoadingPost(false);
        })
        .catch((err) => console.log(err));
    } else if (!query.get("category") && !init) {
      setPosts([]);
      refetch()
    }
    // eslint-disable-next-line
  }, [query.get("category")]);
  useEffect(() => {
    refetch()
    // eslint-disable-next-line
  }, []);
  const refetch = () => {
    setLoadingPost(true)
    setPosts([]);
    axios
    .get(`/post`)
    .then(({ data }) => {
      setPosts(posts.concat(data));
      setLoadingPost(false);
      setInit(false);
    })
    .catch((err) => console.log(err));
  // eslint-disable-next-line
  }

  return (
    <>
      <NavBar refetch={refetch}/>
      <Banner/>
      <div
        className="container"
        style={{ minWidth: "95vw", minHeight: "80vh" }}
      >
        <div className="row">

          <div className="col-2 " style={{ minHeight: "200px" }}>
            <div
              className="d-flex flex-column align-items-center"
              style={{ marginTop: "63px", width: "100%", gap: "7px" }}
            >
               {/* <div className="row">
              <h2 className="display-4 ml-5">FORUM posting</h2>
            </div> */}
              <div className="card bg-light" style={{ width: "15rem", position:'-webkit-sticky', top:'0', position:'sticky' }}>
                <ul className="list-group list-group-flush">
                  <li>
                    <NavLink exact to="/" className="btn list-group-item">
                      Programming Language
                    </NavLink>
                  </li>
                  <hr style={{ marginTop: "-1em" }} />
                  <li>
                    <NavLink
                      to="?category=Javascript"
                      className="btn list-group-item"
                    >
                      Javascript
                    </NavLink>
                  </li>
                  <hr style={{ marginTop: "-1em" }} />
                  <li>
                    <NavLink
                      to="?category=Python"
                      className="btn list-group-item"
                    >
                      Python
                    </NavLink>
                  </li>
                  <hr style={{ marginTop: "-1em" }} />
                  <li>
                    <NavLink
                      to="?category=Java"
                      className="btn list-group-item"
                    >
                      Java
                    </NavLink>
                  </li>
                  <hr style={{ marginTop: "-1em" }} />
                  <li>
                    <NavLink to="?category=Cpp" className="btn list-group-item">
                      C++
                    </NavLink>
                  </li>
                  <hr style={{ marginTop: "-1em" }} />
                  <li>
                    <NavLink to="?category=Cs" className="btn list-group-item">
                      C#
                    </NavLink>
                  </li>

                </ul>
              </div>
            </div>
          </div>
          <div className="col-10">
            {/* <div className="row">
              <h2 className="display-4 ml-5">FORUM posting</h2>
            </div> */}
            <div className="row">
              <div className="col-9 mt-5" style={{ minHeight: "200px" }}>
                <div className="container">
                  <div className="row justify-content-center">
                    {loadingPost ? (
                      <LoadingSpin />
                    ) : (
                      posts.map((post) => {
                        return <CardPost key={post.id} post={post} />;
                      })
                    )}
                  </div>
                </div>
              </div>
              {/* <div className="row">
                <h2 className="display-4 ml-5">FORUM posting</h2>
              </div> */}
              <div className="col-3 mt-5" style={{ minHeight: "100%", gap: "7px"}}>
                <div className="row">
                  <h2 className="ml-5">Chat Rooms</h2>
                </div>
                {rooms.map((room) => {
                  return <CardRoom key={room} roomId={room} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
