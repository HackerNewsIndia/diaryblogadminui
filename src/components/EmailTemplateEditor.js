import React, { useState, useRef, useEffect } from "react";
import EmailEditor from "react-email-editor";
import SendEmail from "./SendEmail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const EmailTemplateEditor = ({ marketSpace, onCampaignClose }) => {
  const editorRef = useRef(null);

  const [exportedHtmlData, setExportedHtmlData] = useState("");
  const [exportedHtml, setExportedHtml] = useState(false);
  const [templateData, setTemplateData] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [templateDesign, setTemplateDesign] = useState("");
  const [saveDesignActive, setSaveDesignActive] = useState(true);
  // const [exportHtmlActive, setExportHtmlActive] = useState(false);
  const [emailPreview, setEmailPreview] = useState(false);
  const [emailPreviewClicked, setEmailPreviewClicked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }

    const campaignSpaceId = marketSpace._id;

    fetch(
      `https://diaryblogapi2.onrender.com/api/get_digital_marketing_template?campaignSpace_id=${campaignSpaceId}`,
      // `http://127.0.0.1:5001/api/get_digital_marketing_template?campaignSpace_id=${campaignSpaceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("data:", data);
        setTemplateData(data);
        setExportedHtmlData(data.exportedHtmlData);
        setDataFetched(true);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [marketSpace]);

  useEffect(() => {
    if (dataFetched) {
      onLoad();
    }
  }, [dataFetched]);

  const onLoad = () => {
    if (editorRef.current && editorRef.current.editor) {
      const editorInstance = editorRef.current.editor;

      if (templateData.design) {
        editorInstance.loadDesign(templateData.design);
        setSaveDesignActive(false);
        setEmailPreview(true);
      } else {
        console.error("No exported HTML data found in templateData");
      }

      editorInstance.addEventListener("design:updated", () => {
        // Enable save button when changes are made
        setSaveDesignActive(true);
        setEmailPreview(false);
      });
    }
  };

  const handleSaveDesign = () => {
    if (editorRef.current && editorRef.current.editor) {
      const editorInstance = editorRef.current.editor;

      editorInstance.saveDesign((design) => {
        console.log("saveDesign", design);
        setTemplateDesign(design);
        editorInstance.exportHtml((data) => {
          const { html } = data;
          setExportedHtmlData(html);
          const token = localStorage.getItem("token");
          fetch(
            "https://diaryblogapi2.onrender.com/api/create_digital_marketing_template",
            // "http://127.0.0.1:5001/api/create_digital_marketing_template",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                exportedHtmlData: html, // Use updated HTML directly
                design: design, // Pass the saved design
                marketSpaceId: marketSpace._id,
              }),
            }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              // setHtmlexported(true);
              setEmailPreview(true);
              return response.json();
            })
            .then((data) => {
              console.log("Success:", data);
              // setExportHtmlActive(false);
              setEmailPreview(true);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
        console.log("TemplateDesign", templateDesign);
        setSaveDesignActive(false);
        // setExportHtmlActive(true);
      });
    } else {
      console.log("Editor instance not available");
    }
  };

  const handleEmailPreview = () => {
    setEmailPreviewClicked(true);
  };

  const emailPreviewClose = () => {
    setEmailPreviewClicked(false);
  };

  return (
    <>
      {exportedHtmlData !== "" &&
      exportedHtmlData !== undefined &&
      emailPreviewClicked == true ? (
        <SendEmail
          exportedHtmlData={exportedHtmlData}
          emailPreviewClose={emailPreviewClose}
        />
      ) : (
        <div className="flex flex-col">
          <EmailEditor ref={editorRef} onLoad={onLoad} mobile={true} />
          <div className="flex flex-row items-center my-4 justify-between">
            <div>
              <button
                className=" flex flex-row items-center bg-blue-500 text-white rounded-lg px-2 py-1 space-x-2"
                onClick={onCampaignClose}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <p className="sm:hidden">Back</p>
              </button>
            </div>
            <div className="flex flex-row items-center justify-center space-x-2">
              <button
                className={`bg-blue-500 text-white rounded-lg px-2 py-1 ${
                  saveDesignActive == false
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={saveDesignActive == false}
                onClick={() => handleSaveDesign()}
              >
                Save and Export
              </button>

              <button
                className={`bg-blue-500 text-white rounded-lg px-2 py-1 ${
                  emailPreview == false ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={emailPreview == false}
                onClick={() => handleEmailPreview()}
              >
                Email Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailTemplateEditor;
