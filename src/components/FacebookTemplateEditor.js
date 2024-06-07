import React from "react";
import { BeatLoader } from "react-spinners";

const FacebookTemplateEditor = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xl text-gray-400 m-4">Development in progress...</p>
        <div className="flex justify-center items-center py-5">
          <BeatLoader color="hsla(168, 4%, 75%, 1)" />
        </div>
      </div>
    </>
  );
};

export default FacebookTemplateEditor;
