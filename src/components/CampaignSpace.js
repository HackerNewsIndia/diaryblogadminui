import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import EmailTemplateEditor from "./EmailTemplateEditor";
import FacebookTemplateEditor from "./FacebookTemplateEditor";

const CampaignSpace = ({ onCampaignClose }) => {
  const [isEmailTabActive, setIsEmailTabActive] = useState(true);
  const [isFacebookTabActive, SetIsFacebookTabActive] = useState(false);
  return (
    <>
      <div className="flex flex-col mx-2 my-1 mb-4">
        <div className="flex flex-row">
          <button className="px-2 py-2" onClick={onCampaignClose}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="flex items-center mx-auto overflow-x-auto overflow-y-hidden sm:justify-center flex-nowrap">
            <button
              className={`flex items-center flex-shrink-0 px-4 py-2 space-x-2  ${
                isEmailTabActive ? "bg-blue-500 rounded-lg text-white" : ""
              }`}
              onClick={() => {
                setIsEmailTabActive(true);
                SetIsFacebookTabActive(false);
              }}
            >
              <FontAwesomeIcon icon={faEnvelope} />
              <span>Email</span>
            </button>
            <button
              className={`flex items-center flex-shrink-0 px-4 py-2 space-x-2 ${
                isFacebookTabActive ? "bg-blue-500 rounded-lg text-white" : ""
              }`}
              onClick={() => {
                setIsEmailTabActive(false);
                SetIsFacebookTabActive(true);
              }}
            >
              <FontAwesomeIcon icon={faFacebook} />
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mx-2 my-1 p-1">
        {isEmailTabActive && <EmailTemplateEditor />}
        {isFacebookTabActive && <FacebookTemplateEditor />}
      </div>
    </>
  );
};

export default CampaignSpace;
