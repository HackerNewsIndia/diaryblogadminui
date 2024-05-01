import React, { useState, useEffect } from "react";
import CreateDigitalCampaign from "./CreateDigitalCampaign";
import jwt_decode from "jwt-decode";
import { BeatLoader } from "react-spinners";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CampaignSpace from "./CampaignSpace";

const DigitalMarketingSpace = () => {
  const [loading, setLoading] = useState(true);
  const [createButtonClicked, setCreateButtonClicked] = useState(false);
  const [marketSpace, setMarketSpace] = useState("");
  const [error, setError] = useState("");
  const [marketSpaceData, setMarketSpaceData] = useState([]);
  const [viewButtonClicked, setViewButtonClicked] = useState(false);

  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    setCreateButtonClicked(true);
  };

  const handleEditMarketSpace = (marketSpace) => {
    setCreateButtonClicked(true);
    setMarketSpace(marketSpace);
  };

  const onClose = () => {
    setCreateButtonClicked(false);
    setMarketSpace("");
  };

  const onCampaignClose = () => {
    setViewButtonClicked(false);
  };

  const handleView = (marketSpace) => {
    setViewButtonClicked(true);
    setMarketSpace(marketSpace);
    // navigate(`/#/digital_marketing/${marketSpace.title}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }
    const decodedToken = jwt_decode(token);
    const user = decodedToken.user;
    const userId = user.id;
    fetch(
      // `http://127.0.0.1:5001/api/digital_marketing_space/${userId}`
      `https://diaryblogapi2.onrender.com/api/digital_marketing_space/${userId}`,
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
        setLoading(false);
        console.log("MarketSpace data:", data);
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.createDate);
          const dateB = new Date(b.createDate);
          return dateB - dateA;
        });
        setMarketSpaceData(sortedData);
      })
      .catch((error) => {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
        setError(error.message);
      });
  }, [createButtonClicked]);

  // useEffect(() => {
  //   if (
  //     marketSpaceData.length > 0 &&
  //     marketSpaceData[0].image_url &&
  //     marketSpaceData[0].image_url.length > 1
  //   ) {
  //     console.log("Setting up interval for sliding images...");
  //     const intervalId = setInterval(() => {
  //       setCurrentIndex((prevIndex) =>
  //         prevIndex === marketSpaceData[0].image_url.length - 1
  //           ? 0
  //           : prevIndex + 1
  //       );
  //     }, 5000);

  //     return () => {
  //       console.log("Clearing interval...");
  //       clearInterval(intervalId);
  //     };
  //   }
  // }, [currentIndex, marketSpaceData]);

  return (
    <div>
      {createButtonClicked == true && (
        <CreateDigitalCampaign onClose={onClose} marketSpace={marketSpace} />
      )}
      {viewButtonClicked == true && (
        <CampaignSpace
          onCampaignClose={onCampaignClose}
          marketSpace={marketSpace}
        />
      )}
      {createButtonClicked == false && viewButtonClicked == false && (
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-row mb-4 mx-auto">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded-md"
              onClick={handleCreateCampaign}
            >
              Create Digital Campaign
            </button>
          </div>
          {loading && (
            <div className="flex justify-center items-center py-5">
              <BeatLoader color="hsla(168, 4%, 75%, 1)" />
            </div>
          )}
          <div className="grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-2">
            {marketSpaceData.map((marketSpace, index) => (
              <article
                key={marketSpace._id || marketSpace.name}
                className=" flex flex-col rounded-md border-2 border-slate-500 p-2 mb-4"
              >
                <div className="flex flex-col text-left space-y-1">
                  <p>
                    <strong>Created Date:</strong>{" "}
                    {marketSpace.createDate
                      ? new Date(marketSpace.createDate).toLocaleDateString()
                      : "Loading..."}
                  </p>
                </div>
                <div className="relative flex items-center justify-center w-full dark:text-gray-900">
                  <div className="flex items-center justify-start w-full h-full gap-6 py-2 mx-auto overflow-auto lg:gap-8">
                    {/* {marketSpace.image_url &&
                      marketSpace.image_url.map((image, i) => (
                        <div
                          key={i}
                          className={`relative flex flex-shrink-0 w-full sm:w-auto ${
                            i === currentIndex ? "" : "hidden"
                          }`}
                          style={{
                            transition: "transform 0.5s ease",
                            transform: `translateX(${
                              i === currentIndex ? "0%" : "100%"
                            })`,
                          }}
                        >
                          <img
                            // className="object-cover object-center dark:bg-gray-500 h-96 aspect-square"
                            style={{
                              maxHeight: "200px",
                              width: "100%",
                              height: "auto",
                              objectFit: "cover",
                            }}
                            src={image}
                            alt={`Image ${i + 1}`}
                          />
                        </div>
                      ))} */}
                    <div
                      className={`relative flex flex-shrink-0 w-full sm:w-auto 
                          `}
                    >
                      <img
                        className="rounded-md"
                        style={{
                          maxHeight: "200px",
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                        src={marketSpace.image_url[0]}
                        alt={`Image`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-grow flex flex-col justify-between bg-white dark:bg-slate-800 p-6 pt-2 pb-2">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold leading-7 text-gray-900 dark:text-white ">
                      {marketSpace.title}
                    </h3>
                    {/* <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {marketSpace.campaignAbout}
                    </p> */}
                    <p className="pb-2">
                      <strong>category:</strong> {marketSpace.category}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <div className="flex space-x-2 text-sm dark:text-gray-400">
                      <button
                        aria-label="Share this post"
                        type="button"
                        className="flex items-center p-1 space-x-2 cursor-pointer hover:bg-slate-500 rounded"
                        onClick={() => handleView(marketSpace)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="w-4 h-4 fill-current dark:text-violet-400"
                        >
                          <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                        </svg>
                        <span className="whitespace-nowrap">View</span>
                      </button>
                    </div>

                    <button
                      aria-label="Edit post"
                      type="button"
                      className="flex   items-center justify-center p-1 space-x-2 cursor-pointer "
                      onClick={() => handleEditMarketSpace(marketSpace)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="w-4 h-4 fill-current dark:text-violet-400 hover:text-blue-500"
                      >
                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                      </svg>
                      <span>Edit</span>
                    </button>

                    <button
                      aria-label="Share post"
                      type="button"
                      className="flex items-center justify-center p-1 space-x-2 "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="w-4 h-4 fill-current dark:text-violet-400 hover:text-green-500"
                      >
                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                      </svg>
                      <span className="text-xs sm:text-sm">
                        {marketSpace.followers || 0} followers
                      </span>
                    </button>

                    {/* <a
                          href={`https://diaryblog.connectingpeopletech.com/${
                            marketSpace._id
                              ? encodeURIComponent(marketSpace._id)
                              : ""
                          }/viewposts`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 "
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                            />
                          </svg>
                        </a> */}

                    {/* <div className="flex  space-x-2 text-sm dark:text-gray-400 mt-2">
                          <span className="sr-only">Views</span>
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-block-400 hover:text-blue-500"
                          />
                          <p className="text-sm font-medium  leading-5 text-gray-500 dark:text-gray-400 ">
                            {marketSpace.views}
                          </p>
                        </div> */}

                    <div
                      aria-label="Total Posts"
                      type="button"
                      className="flex items-center justify-center p-1 space-x-2 "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="w-4 h-4 fill-current dark:text-violet-400 hover:text-pink-500"
                      >
                        <path d="M373.5 27.1C388.5 9.9 410.2 0 433 0c43.6 0 79 35.4 79 79c0 22.8-9.9 44.6-27.1 59.6L277.7 319l-10.3-10.3-64-64L193 234.3 373.5 27.1zM170.3 256.9l10.4 10.4 64 64 10.4 10.4-19.2 83.4c-3.9 17.1-16.9 30.7-33.8 35.4L24.4 510.3l95.4-95.4c2.6 .7 5.4 1.1 8.3 1.1c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32c0 2.9 .4 5.6 1.1 8.3L1.7 487.6 51.5 310c4.7-16.9 18.3-29.9 35.4-33.8l83.4-19.2z" />
                      </svg>

                      <span>{marketSpace.marketingPosts.length}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalMarketingSpace;
