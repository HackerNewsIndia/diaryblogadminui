import React, { useState, useRef } from "react";
import EmailEditor from "react-email-editor";
import SendEmail from "./SendEmail";

const EmailTemplateEditor = () => {
  const editorRef = useRef(null);

  const [exportedHtmlData, setExportedHtmlData] = useState("");
  const [exportedHtml, setExportedHtml] = useState(false);

  const onLoad = () => {
    if (editorRef.current && editorRef.current.editor) {
      const editorInstance = editorRef.current.editor;

      // Define saveDesign function
      const saveDesign = () => {
        editorInstance.saveDesign((design) => {
          console.log("saveDesign", design);
        });
      };

      // Define exportHtml function
      const exportHtml = () => {
        editorInstance.exportHtml((data) => {
          const { design, html } = data;
          setExportedHtmlData(html);
          //   setExportedHtml(true);
          console.log("exportHtml", html);
        });
      };

      // Call the saveDesign and exportHtml functions when editor is fully loaded
      saveDesign();
      exportHtml();
    } else {
      console.error("Editor instance is not available.");
    }
  };

  console.log(exportedHtmlData);

  return (
    <>
      {exportedHtmlData != "" && exportedHtmlData != undefined ? (
        <SendEmail exportedHtmlData={exportedHtmlData} />
      ) : (
        // <p>Loading...</p>
        <div className="flex flex-col">
          <EmailEditor
            ref={editorRef}
            onLoad={onLoad}
            // minHeight={500}
            // style={{ height: "1000px" }}
          />
          <div className="flex items-center my-4 mx-auto">
            {/* <button onClick={() => onLoad()}>Save Design</button> */}
            <button
              className="bg-blue-500 text-white rounded-lg px-2 py-1"
              onClick={() => onLoad()}
            >
              Save and Export HTML
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailTemplateEditor;
