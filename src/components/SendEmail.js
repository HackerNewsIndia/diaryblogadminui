import React, { useState } from "react";

const SendEmail = ({ exportedHtmlData }) => {
  const [recipients, setRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recipientAdded, setRecipientAdded] = useState(false);
  const [recipientAdding, setRecipientAdding] = useState(false);

  const handleRecipientChange = (e) => {
    setRecipientInput(e.target.value);
    setRecipientAdding(true);
    setErrorMessage("");
  };

  const handleRecipientKeyDown = (e) => {
    if (e.key === "Enter" && recipientInput.trim() !== "") {
      e.preventDefault();
      // Add recipient to the list
      setRecipients([recipientInput.trim(), ...recipients]);
      setRecipientAdded(true);
      setRecipientAdding(false);
      setRecipientInput("");
    }
  };

  const removeRecipient = (index) => {
    const updatedRecipients = [...recipients];
    updatedRecipients.splice(index, 1);
    setRecipients(updatedRecipients);
  };

  const handleSendEmail = async () => {
    if (recipientAdded == true) {
      try {
        setLoading(true);

        const response = await fetch(
          "https://diaryblogapi2.onrender.com/api/send_email_for_digital_marketing",
          // "http://127.0.0.1:5001/api/send_email_for_digital_marketing",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // post_title: postTitle,
              // post_description: markdownDescription,
              // post_imageUrl: postImageUrl,
              // blogId: blogId,
              // postId: postId,
              // // imageBase64: imageBase64,
              // username: username,
              // // blogSpaceImageUrl: blogSpaceImageUrl,
              // blogSpaceName: blogSpaceName,
              // userId: userId,
              // cacheKey: cacheKey,
              exportedHtmlData: exportedHtmlData,
              recipients: recipients,
            }),
          }
        );

        if (response.ok) {
          setEmailSent(true);
          const responseData = await response.json();
          setSuccessMessage(responseData.message || "Email sent successfully.");
        } else {
          throw new Error("Failed to send email.");
        }
      } catch (error) {
        setErrorMessage("Failed to send email. Please try again later.");
        console.error("Error sending email:", error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage(
        `Add recipient in input & press "Enter" and then click "Send Email".`
      );
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div
          dangerouslySetInnerHTML={{ __html: exportedHtmlData }}
          className="px-2 py-2"
          style={{ height: "400px", overflowY: "scroll" }}
        ></div>
        <div className="w-full flex flex-col items-center justify-center ">
          <form
            className="flex flex-col items-center w-full md:w-1/2 lg:w-1/2 mt-4 space-y-2"
            id="emailForm"
          >
            <div className="flex-grow flex flex-wrap">
              <div
                className="overflow-auto flex flex-row flex-grow flex-wrap border-2 border-gray-500 rounded-md items-center text-center justify-center"
                style={{
                  maxHeight: "90px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                {recipients.map((recipient, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-300 rounded-lg px-3 py-1 m-1 space-x-2"
                  >
                    <span className="text-sm">{recipient}</span>
                    <button
                      type="button"
                      onClick={() => removeRecipient(index)}
                      className="text-white ml-1"
                    >
                      &#10005;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className=" flex flex-col md:flex-row lg:flex-row items-center align-center justify-center space-x-2">
                <input
                  type="text"
                  id="emailInput"
                  className=" rounded-md py-2 px-3 border-1 border-b-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300"
                  placeholder="Enter email recipients"
                  value={recipientInput}
                  onChange={handleRecipientChange}
                  onKeyDown={handleRecipientKeyDown}
                />

                <button
                  onClick={handleSendEmail}
                  className=" ml-2 rounded-md bg-indigo-600 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="mr-2">Loading</span>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  ) : emailSent ? (
                    "Send Email"
                  ) : (
                    "Send Email"
                  )}
                </button>
              </div>
              {recipientAdding && (
                <p className="text-xs text-gray-400 m-2">
                  Press "Enter" to add recipient
                </p>
              )}
            </div>
          </form>
          {errorMessage && (
            <p className="mt-2" style={{ color: "red" }}>
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="mt-2" style={{ color: "green" }}>
              {successMessage}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default SendEmail;
