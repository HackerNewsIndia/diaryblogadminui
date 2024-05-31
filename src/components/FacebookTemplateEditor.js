import React from "react";
import { BeatLoader } from "react-spinners";
import FacebookLogin from "react-facebook-login";

const FacebookTemplateEditor = () => {
  const responseFacebook = (response) => {
    console.log(response);
    if (response.accessToken) {
      console.log("Access Token: ", response.accessToken);
      // Handle the access token, e.g., send it to your server for authentication
    } else {
      console.error("Login failed");
    }
  };
  const componentClicked = (data) => {
    console.log("data:", data);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {/* <p className="text-xl text-gray-400 m-4">Development in progress...</p>
        <div className="flex justify-center items-center py-5">
          <BeatLoader color="hsla(168, 4%, 75%, 1)" />
        </div> */}
        <h2>Facebook Login</h2>
        <FacebookLogin
          appId="980404056807763"
          autoLoad={true}
          fields="name,email,picture"
          scope="public_profile,email,pages_show_list,manage_pages"
          callback={responseFacebook}
          onClick={componentClicked}
        />
      </div>
    </>
  );
};

export default FacebookTemplateEditor;
