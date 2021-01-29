import React from "react";
import { GoogleLogin, /**GoogleLogout*/ } from "react-google-login";
import axios from '../config/axios'


const GoogleButton = (props) => {
  const ResponseGoogle = async (res) => {
    // console.log(res.getAuthResponse().id_token);
    // console.log(res.profileObj);
    try {
      const id_token = res.getAuthResponse().id_token
      const result = await axios({
        method: 'POST',
        data: {
          googleToken: id_token
        },
        url: `/user/googleLogin`
      })
      localStorage.setItem('access_token', result.data.access_token)
      localStorage.setItem('nickname', result.data.nickname)
      props.setIsLogin(true)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {/* <GoogleLogout
        clientId="859682134010-sgait0v7tvesgcq0voj0ntqi8km0j692.apps.googleusercontent.com"
        buttonText="Logout"
      /> */}
    <GoogleLogin
    clientId="859682134010-sgait0v7tvesgcq0voj0ntqi8km0j692.apps.googleusercontent.com"
    buttonText="Sign in"
    onSuccess={ResponseGoogle}
    onFailure={ResponseGoogle}
    cookiePolicy={'single_host_origin'}
    />
    </div>
  );
};
export default GoogleButton;
