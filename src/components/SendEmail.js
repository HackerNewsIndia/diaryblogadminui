import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import jwt_decode from "jwt-decode";

const SendEmail = ({ exportedHtmlData, emailPreviewClose }) => {
  const [recipients, setRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recipientAdded, setRecipientAdded] = useState(false);
  const [recipientAdding, setRecipientAdding] = useState(false);
  const [blogSpaceData, setBlogSpaceData] = useState([]);
  const [emailSubject, setEmailSubject] = useState("");

  const handleRecipientChange = (e) => {
    setRecipientInput(e.target.value);
    setRecipientAdding(true);
    setErrorMessage("");
  };
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }

    // Decode the JWT token to get the user_id
    const decodedToken = jwt_decode(token);
    const user = decodedToken.user;
    const userId = user.id;

    fetch(
      `https://diaryblogapi2.onrender.com/api/diaryblog_space/user/${userId}`,
      {
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
        console.log("Fetched data:", data);
        setBlogSpaceData(data);
        // setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
        setError(error.message);
      });
  }, [token]);

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
      if (emailSubject.length >= 10) {
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
                email_subject: emailSubject,
              }),
            }
          );

          if (response.ok) {
            setEmailSent(true);
            const responseData = await response.json();
            setSuccessMessage(
              responseData.message || "Email sent successfully."
            );
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
        setErrorMessage(`Subject should contain minimum 10 characters.`);
      }
    } else {
      setErrorMessage(
        `Add recipient in input & press "Enter" and then click "Send Email".`
      );
    }
  };

  const handleBlogSpace = async (blogSpace) => {
    try {
      if (!blogSpace._id) {
        console.log("blogSpaceId is null or undefined");
        return;
      }

      const response = await fetch(
        `https://diaryblogapi2.onrender.com/api/followers/${blogSpace._id}/followers`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch followers");
      }
      const data = await response.json();
      console.log("followersData:", data);
      if (Array.isArray(data)) {
        const emails = data.map((follower) => follower.email);
        setRecipients(emails);
        setRecipientAdded(true);
        console.log("Fetched followers:", emails);
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
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
            className="flex flex-col items-center w-full mt-4 space-y-2"
            id="emailForm"
          >
            <div className="flex flex-col">
              {/* <label className="mb-1">Enter email subject</label> */}
              <input
                className="mb-2 px-1 py-2 border-2 border-slate-800 rounded"
                onChange={(e) => setEmailSubject(e.target.value)}
                value={emailSubject}
                placeholder=" Enter email subject"
              />
            </div>
            <div>
              <select
                className="flex-row border-2 border-slate-800 px-3 py-2 md:px-1 md:py-0 lg:px-1 lg:py-0 rounded"
                onChange={(e) => handleBlogSpace(blogSpaceData[e.target.value])}
              >
                <option className="text-gray-400">Select Follow Space</option>
                {blogSpaceData.map((blogSpace, index) => (
                  <option key={index} value={index} className="px-2 py-1">
                    {blogSpace.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2 flex-grow flex flex-wrap items-center justify-center">
              <div
                className="w-full overflow-auto border-2 border-gray-500 rounded-md text-center px-2 py-1"
                style={{
                  maxHeight: "90px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                {recipients.length > 0 ? (
                  <table className="w-full">
                    <tbody>
                      {recipients.map((recipient, index) => (
                        <tr key={index}>
                          <td className="bg-gray-300 px-3 py-1 rounded-l-md">
                            {recipient}
                          </td>
                          <td className="bg-gray-300 px-3 py-1 rounded-r-md">
                            <button
                              type="button"
                              onClick={() => removeRecipient(index)}
                              className="text-white"
                            >
                              &#10005;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm py-2">No recipients added</p>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-full  flex flex-col md:flex-row lg:flex-row items-center">
                <div className="flex flex-start">
                  <button
                    className=" flex flex-row items-center bg-indigo-600 text-white rounded-lg px-2 py-1 space-x-2"
                    onClick={emailPreviewClose}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <p className="sm:hidden">Back</p>
                  </button>
                </div>
                <div className="w-full flex items-center justify-center space-x-2">
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
