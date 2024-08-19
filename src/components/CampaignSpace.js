import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import EmailTemplateEditor from "./EmailTemplateEditor";
import FacebookTemplateEditor from "./FacebookTemplateEditor";
import LinkedInTemplateEditor from "./LinkedInTemplateEditor"; // Assuming you have a LinkedIn template editor component

const CampaignSpace = ({ onCampaignClose, marketSpace }) => {
  const [isEmailTabActive, setIsEmailTabActive] = useState(true);
  const [isFacebookTabActive, setIsFacebookTabActive] = useState(false);
  const [isLinkedInTabActive, setIsLinkedInTabActive] = useState(false);

  return (
    <>
      <div className="flex flex-col mx-2 my-1 mb-4">
        <div className="flex flex-row">
          {/* <button className="px-2 py-2" onClick={onCampaignClose}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button> */}
          <div className="flex items-center mx-auto overflow-x-auto overflow-y-hidden sm:justify-center flex-nowrap">
            <button
              className={`flex items-center flex-shrink-0 px-4 py-2 space-x-2 ${
                isEmailTabActive ? "bg-blue-500 rounded-lg text-white" : ""
              }`}
              onClick={() => {
                setIsEmailTabActive(true);
                setIsFacebookTabActive(false);
                setIsLinkedInTabActive(false);
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
                setIsFacebookTabActive(true);
                setIsLinkedInTabActive(false);
              }}
            >
              <FontAwesomeIcon icon={faFacebook} />
              <span>Facebook</span>
            </button>
            <button
              className={`flex items-center flex-shrink-0 px-4 py-2 space-x-2 ${
                isLinkedInTabActive ? "bg-blue-500 rounded-lg text-white" : ""
              }`}
              onClick={() => {
                setIsEmailTabActive(false);
                setIsFacebookTabActive(false);
                setIsLinkedInTabActive(true);
              }}
            >
              <FontAwesomeIcon icon={faLinkedin} />
              <span>LinkedIn</span>
            </button>
          </div>
        </div>
      </div>
      <div className="w-2/3 mx-5 my-1 p-1 px-5">
        {isEmailTabActive && (
          <EmailTemplateEditor
            marketSpace={marketSpace}
            onCampaignClose={onCampaignClose}
          />
        )}
        {isFacebookTabActive && <FacebookTemplateEditor />}
        {isLinkedInTabActive && <LinkedInTemplateEditor />}
      </div>
    </>
  );
};

export default CampaignSpace;
