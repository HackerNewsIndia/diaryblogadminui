import React, { useState, useEffect } from "react";

const DashboardContent = () => {
  
  const [latestPosts, setLatestPosts] = useState([]);

  const [engagement, setEngagement] = useState(null);


 const [mostViewedPosts, setMostViewedPosts] = useState([]);
 const [leastViewedPosts, setLeastViewedPosts] = useState([]);
 const [mostCommentedPosts, setMostCommentedPosts] = useState([]);
 const [mostSharedPosts, setMostSharedPosts] = useState([]);
 const [mostLovedPosts, setMostLovedPosts] = useState([]);
 const [leastCommentedPosts, setLeastCommentedPosts] = useState([]);
 const [leastSharedPosts, setLeastSharedPosts] = useState([]);
 const [leastLovedPosts, setLeastLovedPosts] = useState([]);
 const [error, setError] = useState(null);

 
//  const handleRefresh = async () => {
//   try {
//     await fetchData(); // Call fetchData function
//   } catch (error) {
//     setError(error.message);
//   }
// };

 
 useEffect(() => {
  const fetchEngagement = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage
      const response = await fetch('https://diaryblogapi2.onrender.com/api/engagement', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Engagement metrics:', data);
      setEngagement(data);
    } catch (error) {
      console.error('Failed to fetch engagement metrics:', error);
    }
  };

  fetchEngagement();
}, []);


useEffect(() => {
 // Fetch most and least viewed posts
 const fetchPostsAnalytics = async () => {
  try {
    const token = localStorage.getItem('token'); // Get the JWT token from localStorage
    const response = await fetch('https://diaryblogapi2.onrender.com/api/posts/analytics', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setMostViewedPosts(data.most_viewed_posts);
    setLeastViewedPosts(data.least_viewed_posts);
    setMostCommentedPosts(data.most_commented_posts);
                setMostSharedPosts(data.most_shared_posts);
                setMostLovedPosts(data.most_loved_posts);
                setLeastCommentedPosts(data.least_commented_posts);
                setLeastSharedPosts(data.least_shared_posts);
                setLeastLovedPosts(data.least_loved_posts);
                console.log('Fetched Data:', data);

  } catch (error) {
    setError(error.message);
  }
};

fetchPostsAnalytics();
}, []);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch("https://diaryblogapi2.onrender.com/api/latest_posts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch latest posts");
        }
        const data = await response.json();
        setLatestPosts(data);
      } catch (error) {
        console.error("Error fetching the latest posts:", error);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-200 max-w-md mt-10 rounded-md shadow-md">
      <div className="container p-2 md:p-6 mx-auto space-y-1 text-center">
        <section class="py-9 bg-gray-800 text-gray-100 sm:py-12">
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4">
            {engagement && (
              <>
                <div className=" flex overflow-hidden rounded-lg bg-gray-900 text-gray-100">
                  <div className="flex items-center justify-center px-2 md:px-4 bg-violet-400 text-gray-800 text-sm md:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M487.938,162.108l-224-128a16,16,0,0,0-15.876,0l-224,128a16,16,0,0,0,.382,28l224,120a16,16,0,0,0,15.112,0l224-120a16,16,0,0,0,.382-28ZM256,277.849,65.039,175.548,256,66.428l190.961,109.12Z"></path>
                      <path d="M263.711,394.02,480,275.061V238.539L256,361.74,32,238.539v36.522L248.289,394.02a16.005,16.005,0,0,0,15.422,0Z"></path>
                      <path d="M32,362.667,248.471,478.118a16,16,0,0,0,15.058,0L480,362.667V326.4L256,445.867,32,326.4Z"></path>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between flex-1 p-3">
                    <p className="text-2xl font-semibold">
                      {engagement.total_blog_spaces}
                    </p>
                    <p>Total Spaces</p>
                  </div>
                </div>

                <div className="flex overflow-hidden rounded-lg bg-gray-900 text-gray-100">
                  <div className="flex items-center justify-center px-2 md:px-4 bg-violet-400 text-gray-800 text-sm md:text-base">
                    {/* <div className="flex items-center justify-center px-4 bg-violet-400 text-gray-800"> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      class="w-6 h-6"
                    >
                      <path d="M462.541,316.3l-64.344-42.1,24.774-45.418A79.124,79.124,0,0,0,432.093,192V120A103.941,103.941,0,0,0,257.484,43.523L279.232,67a71.989,71.989,0,0,1,120.861,53v72a46.809,46.809,0,0,1-5.215,21.452L355.962,284.8l89.058,58.274a42.16,42.16,0,0,1,19.073,35.421V432h-72v32h104V378.494A74.061,74.061,0,0,0,462.541,316.3Z"></path>
                      <path d="M318.541,348.3l-64.343-42.1,24.773-45.418A79.124,79.124,0,0,0,288.093,224V152A104.212,104.212,0,0,0,184.04,47.866C126.723,47.866,80.093,94.581,80.093,152v72a78,78,0,0,0,9.015,36.775l24.908,45.664L50.047,348.3A74.022,74.022,0,0,0,16.5,410.4L16,496H352.093V410.494A74.061,74.061,0,0,0,318.541,348.3ZM320.093,464H48.186l.31-53.506a42.158,42.158,0,0,1,19.073-35.421l88.682-58.029L117.2,245.452A46.838,46.838,0,0,1,112.093,224V152a72,72,0,1,1,144,0v72a46.809,46.809,0,0,1-5.215,21.452L211.962,316.8l89.058,58.274a42.16,42.16,0,0,1,19.073,35.421Z"></path>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between flex-1 p-3">
                    <p className="text-2xl font-semibold">
                      {engagement.total_blog_posts}
                    </p>
                    <p>Total Post</p>
                  </div>
                </div>

                <div className="flex overflow-hidden rounded-lg bg-gray-900 text-gray-100">
                  <div className="flex items-center justify-center px-2 md:px-4 bg-violet-400 text-gray-800 text-sm md:text-base">
                    {/* <div className="flex items-center justify-center px-4 bg-violet-400 text-gray-800"> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <polygon points="328.375 384 332.073 458.999 256.211 406.28 179.924 459.049 183.625 384 151.586 384 146.064 496 182.756 496 256.169 445.22 329.242 496 365.936 496 360.414 384 328.375 384"></polygon>
                      <path d="M415.409,154.914l-2.194-48.054L372.7,80.933,346.768,40.414l-48.055-2.2L256,16.093,213.287,38.219l-48.055,2.2L139.3,80.933,98.785,106.86l-2.194,48.054L74.464,197.628l22.127,42.715,2.2,48.053L139.3,314.323l25.928,40.52,48.055,2.195L256,379.164l42.713-22.126,48.055-2.195,25.928-40.52L413.214,288.4l2.195-48.053,22.127-42.715Zm-31.646,76.949L382,270.377l-32.475,20.78-20.78,32.475-38.515,1.76L256,343.125l-34.234-17.733-38.515-1.76-20.78-32.475L130,270.377l-1.759-38.514L110.5,197.628,128.237,163.4,130,124.88,162.471,104.1l20.78-32.474,38.515-1.76L256,52.132l34.234,17.733,38.515,1.76,20.78,32.474L382,124.88l1.759,38.515L401.5,197.628Z"></path>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between flex-1 p-3">
                    <p className="text-2xl font-semibold">
                      {engagement.total_views}
                    </p>
                    <p>Total View</p>
                  </div>
                </div>

                <div className="flex overflow-hidden rounded-lg bg-gray-900 text-gray-100">
                  <div className="flex items-center justify-center px-2 md:px-4 bg-violet-400 text-gray-800 text-sm md:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M256.25,16A240,240,0,0,0,88,84.977V16H56V144H184V112H106.287A208,208,0,0,1,256.25,48C370.8,48,464,141.2,464,255.75S370.8,463.5,256.25,463.5,48.5,370.3,48.5,255.75h-32A239.75,239.75,0,0,0,425.779,425.279,239.75,239.75,0,0,0,256.25,16Z"></path>
                      <polygon points="240 111.951 239.465 288 368 288 368 256 271.563 256 272 112.049 240 111.951"></polygon>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between flex-1 p-3">
                    <p className="text-2xl font-semibold">
                      {engagement.total_followers}
                    </p>
                    <p>Total Followers</p>
                  </div>
                </div>

                <div className="flex overflow-hidden rounded-lg bg-gray-900 text-gray-100">
                  <div className="flex items-center justify-center px-2 md:px-4 bg-violet-400 text-gray-800 text-sm md:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M415.313,358.7c36.453-36.452,55.906-85.231,54.779-137.353-1.112-51.375-21.964-99.908-58.715-136.66L388.75,107.314A166.816,166.816,0,0,1,438.1,222.039c.937,43.313-15.191,83.81-45.463,114.083l-48.617,49.051.044-89.165-32-.016L311.992,440H456.063V408H366.449Z"></path>
                      <path d="M47.937,112h89.614L88.687,161.3c-36.453,36.451-55.906,85.231-54.779,137.352a198.676,198.676,0,0,0,58.715,136.66l22.627-22.627A166.818,166.818,0,0,1,65.9,297.962c-.937-43.314,15.191-83.811,45.463-114.083l48.617-49.051-.044,89.165,32,.015L192.008,80H47.937Z"></path>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between flex-1 p-3">
                    <p className="text-2xl font-semibold">
                      {engagement.total_comments}
                    </p>
                    <p>Total Comments</p>
                  </div>
                </div>

                <div className="flex overflow-hidden rounded-lg bg-gray-900 text-gray-100">
                  <div className="flex items-center justify-center px-2 md:px-4 bg-violet-400 text-gray-800 text-sm md:text-base">
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
                  </div>
                  <div className="flex items-center justify-between flex-1 p-3">
                    <p className="text-2xl font-semibold">
                      {engagement.total_shares}
                    </p>
                    <p>Total share</p>
                  </div>
                </div>

                <div className="flex overflow-hidden rounded-lg bg-gray-900 text-gray-100">
                  <div className="flex items-center justify-center px-2 md:px-4 bg-violet-400 text-gray-800 text-sm md:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between flex-1 p-3">
                    <p className="text-2xl font-semibold">
                      {engagement.total_love}
                    </p>
                    <p>Total love</p>
                  </div>
                </div>

                <div className="flex overflow-hidden rounded-lg bg-gray-900 text-gray-100">
                  <div className="flex items-center justify-center px-2 md:px-4 bg-violet-400 text-gray-800 text-sm md:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M416,180H320V340h96a20.023,20.023,0,0,0,20-20V200A20.023,20.023,0,0,0,416,180ZM404,308H352V212h52Z"></path>
                      <path d="M436.574,120H352V64H32V408a64.072,64.072,0,0,0,64,64H288a64.072,64.072,0,0,0,64-64v-8h84.574A59.493,59.493,0,0,0,496,340.574V179.426A59.493,59.493,0,0,0,436.574,120ZM464,340.574A27.457,27.457,0,0,1,436.574,368H320v40a32.036,32.036,0,0,1-32,32H96a32.036,32.036,0,0,1-32-32V96H320v56H436.574A27.457,27.457,0,0,1,464,179.426Z"></path>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between flex-1 p-3">
                    <p className="text-2xl font-semibold">2 m</p>
                    <p>Avg Time Spent</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <h1 class="text-3xl font-semibold leadi text-center">Top</h1>
      <section class="py-9 sm:py-12">
        <div class="flex flex-wrap items-stretch">
          <div class="flex w-full flex-col-reverse mx-auto lg:flex-row ">
            <div class="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 ">
              <div class="space-y-2">
                <h2 class="text-xl font-bold"> Most 3 Viewe</h2>

                <article>
                  <ul>
                    {mostViewedPosts.map((post) => (
                      <li key={post.title}>
                        <div class="flex items-center mt-8 space-x-4">
                          <img
                            src={
                              post.imageUrl ||
                              "https://source.unsplash.com/random/100x100/?5"
                            }
                            alt=""
                            class="w-20 mb-4 h-18 sm:h-22 "
                          />

                          <div>
                            <h2 class="text-xl md:text-xl font-bold">
                              {post.title.substring(0, 18)}{" "}
                            </h2>
                            <h3 class="text-sm font-medium">{post.category}</h3>
                            <time
                              datetime="2021-02-18"
                              class="text-sm dark:text-gray-400"
                            >
                              {post.createDate
                                ? new Date(post.createDate).toLocaleDateString()
                                : "Loading..."}
                            </time>
                          </div>
                        </div>
                        <div>
                          <div class="flex flex-wrap justify-between">
                            <div class="flex space-x-2 text-sm dark:text-gray-400">
                              <a
                                href={`https://diaryblog.connectingpeopletech.com/${post.blogSpace}/${post._id}/post`}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex items-center p-1 space-x-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                  >
                                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                  </svg>
                                </svg>
                                <span>View</span>
                              </a>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  class="w-4 h-4 mr-1"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>{post.views}</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of comments"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                                  <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                                </svg>
                                <span>{post.comments}</span>
                              </button>
                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of likes"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                                  <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                                </svg>
                                <span>{post.like}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>

            <div class="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 ">
              <div class="space-y-2">
                <h2 class="text-xl font-bold"> Most 3 Comments</h2>

                <article>
                  <ul>
                    {mostCommentedPosts.map((post) => (
                      <li key={post.title}>
                        <div class="flex items-center mt-8 space-x-4">
                          <img
                            src={
                              post.imageUrl ||
                              "https://source.unsplash.com/random/100x100/?5"
                            }
                            alt=""
                            class="w-20 mb-4 h-18 sm:h-22 "
                          />

                          <div>
                            <h2 class="text-xl font-bold">
                              {" "}
                              {post.title.substring(0, 18)}{" "}
                            </h2>
                            <h3 class="text-sm font-medium">{post.category}</h3>
                            <time
                              datetime="2021-02-18"
                              class="text-sm dark:text-gray-400"
                            >
                              {post.createDate
                                ? new Date(post.createDate).toLocaleDateString()
                                : "Loading..."}
                            </time>
                          </div>
                        </div>
                        <div>
                          <div class="flex flex-wrap justify-between">
                            <div class="flex space-x-2 text-sm dark:text-gray-400">
                              <button
                                aria-label="Share this post"
                                type="button"
                                class="flex items-center p-1 space-x-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                  >
                                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                  </svg>
                                </svg>
                                <span>view</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  class="w-4 h-4 mr-1"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>{post.views}</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of comments"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                                  <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                                </svg>
                                <span>{post.comments}</span>
                              </button>
                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of likes"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                                  <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                                </svg>
                                <span>{post.like}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>

            <div class="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 ">
              <div class="space-y-2">
                <h2 class="text-xl font-bold"> Most 3 Share</h2>

                <article>
                  <ul>
                    {mostSharedPosts.map((post) => (
                      <li key={post.title}>
                        <div class="flex items-center mt-8 space-x-4">
                          <img
                            src={
                              post.imageUrl ||
                              "https://source.unsplash.com/random/100x100/?5"
                            }
                            alt=""
                            class="w-20 mb-4 h-18 sm:h-22 "
                          />

                          <div>
                            <h2 class="text-xl font-bold">
                              {" "}
                              {post.title.substring(0, 18)}{" "}
                            </h2>
                            <h3 class="text-sm font-medium">{post.category}</h3>
                            <time
                              datetime="2021-02-18"
                              class="text-sm dark:text-gray-400"
                            >
                              {post.createDate
                                ? new Date(post.createDate).toLocaleDateString()
                                : "Loading..."}
                            </time>
                          </div>
                        </div>
                        <div>
                          <div class="flex flex-wrap justify-between">
                            <div class="flex space-x-2 text-sm dark:text-gray-400">
                              <button
                                aria-label="Share this post"
                                type="button"
                                class="flex items-center p-1 space-x-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                  >
                                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                  </svg>
                                </svg>
                                <span>view</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  class="w-4 h-4 mr-1"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>{post.views}</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of comments"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                                  <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                                </svg>
                                <span>{post.comments}</span>
                              </button>
                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of likes"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                                  <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                                </svg>
                                <span>{post.like}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>

            <div class="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 ">
              <div class="space-y-2">
                <h2 class="text-xl font-bold"> Most 3 Love</h2>

                <article>
                  <ul>
                    {mostLovedPosts.map((post) => (
                      <li key={post.title}>
                        <div class="flex items-center mt-8 space-x-4">
                          <img
                            src={
                              post.imageUrl ||
                              "https://source.unsplash.com/random/100x100/?5"
                            }
                            alt=""
                            class="w-20 mb-4 h-18 sm:h-22 "
                          />

                          <div>
                            <h2 class="text-xl font-bold">
                              {" "}
                              {post.title.substring(0, 18)}{" "}
                            </h2>
                            <h3 class="text-sm font-medium">{post.category}</h3>
                            <time
                              datetime="2021-02-18"
                              class="text-sm dark:text-gray-400"
                            >
                              {post.createDate
                                ? new Date(post.createDate).toLocaleDateString()
                                : "Loading..."}
                            </time>
                          </div>
                        </div>
                        <div>
                          <div class="flex flex-wrap justify-between">
                            <div class="flex space-x-2 text-sm dark:text-gray-400">
                              <button
                                aria-label="Share this post"
                                type="button"
                                class="flex items-center p-1 space-x-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                  >
                                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                  </svg>
                                </svg>
                                <span>view</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  class="w-4 h-4 mr-1"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>{post.views}</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of comments"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                                  <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                                </svg>
                                <span>{post.comments}</span>
                              </button>
                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of likes"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                                  <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                                </svg>
                                <span>{post.like}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <h1 class="text-3xl font-semibold leadi text-center">Least</h1>
      <section class="py-9 sm:py-12">
        <div class="flex flex-wrap items-stretch">
          <div class="flex w-full flex-col-reverse mx-auto lg:flex-row ">
            <div class="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 ">
              <div class="space-y-2">
                <h2 class="text-xl font-bold"> Least 3 Viewe</h2>

                <article>
                  <ul>
                    {leastViewedPosts.map((post) => (
                      <li key={post.title}>
                        <div class="flex items-center mt-8 space-x-4">
                          <img
                            src={
                              post.imageUrl ||
                              "https://source.unsplash.com/random/100x100/?5"
                            }
                            alt=""
                            class="w-20 mb-4 h-18 sm:h-22 "
                          />

                          <div>
                            <h2 class="text-xl font-bold">
                              {" "}
                              {post.title.substring(0, 18)}{" "}
                            </h2>
                            <h3 class="text-sm font-medium">{post.category}</h3>
                            <time
                              datetime="2021-02-18"
                              class="text-sm dark:text-gray-400"
                            >
                              {post.createDate
                                ? new Date(post.createDate).toLocaleDateString()
                                : "Loading..."}
                            </time>
                          </div>
                        </div>
                        <div>
                          <div class="flex flex-wrap justify-between">
                            <div class="flex space-x-2 text-sm dark:text-gray-400">
                              <button
                                aria-label="Share this post"
                                type="button"
                                class="flex items-center p-1 space-x-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                  >
                                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                  </svg>
                                </svg>
                                <span>view</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  class="w-4 h-4 mr-1"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>{post.views}</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of comments"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                                  <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                                </svg>
                                <span>{post.comments}</span>
                              </button>
                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of likes"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                                  <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                                </svg>
                                <span>{post.like}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>

            <div class="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 ">
              <div class="space-y-2">
                <h2 class="text-xl font-bold"> Least 3 Comments</h2>

                <article>
                  <ul>
                    {leastCommentedPosts.map((post) => (
                      <li key={post.title}>
                        <div class="flex items-center mt-8 space-x-4">
                          <img
                            src={
                              post.imageUrl ||
                              "https://source.unsplash.com/random/100x100/?5"
                            }
                            alt=""
                            class="w-20 mb-4 h-18 sm:h-22 "
                          />

                          <div>
                            <h2 class="text-xl font-bold">
                              {" "}
                              {post.title.substring(0, 18)}{" "}
                            </h2>
                            <h3 class="text-sm font-medium">{post.category}</h3>
                            <time
                              datetime="2021-02-18"
                              class="text-sm dark:text-gray-400"
                            >
                              {post.createDate
                                ? new Date(post.createDate).toLocaleDateString()
                                : "Loading..."}
                            </time>
                          </div>
                        </div>
                        <div>
                          <div class="flex flex-wrap justify-between">
                            <div class="flex space-x-2 text-sm dark:text-gray-400">
                              <button
                                aria-label="Share this post"
                                type="button"
                                class="flex items-center p-1 space-x-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                  >
                                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                  </svg>
                                  <span>view</span>
                                </svg>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  class="w-4 h-4 mr-1"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>{post.views}</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of comments"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                                  <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                                </svg>
                                <span>{post.comments}</span>
                              </button>
                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of likes"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                                  <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                                </svg>
                                <span>{post.like}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>

            <div class="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 ">
              <div class="space-y-2">
                <h2 class="text-xl font-bold"> Least 3 Share</h2>

                <article>
                  <ul>
                    {leastSharedPosts.map((post) => (
                      <li key={post.title}>
                        <div class="flex items-center mt-8 space-x-4">
                          <img
                            src={
                              post.imageUrl ||
                              "https://source.unsplash.com/random/100x100/?5"
                            }
                            alt=""
                            class="w-20 mb-4 h-18 sm:h-22 "
                          />

                          <div>
                            <h2 class="text-xl font-bold">
                              {" "}
                              {post.title.substring(0, 18)}{" "}
                            </h2>
                            <h3 class="text-sm font-medium">{post.category}</h3>
                            <time
                              datetime="2021-02-18"
                              class="text-sm dark:text-gray-400"
                            >
                              {post.createDate
                                ? new Date(post.createDate).toLocaleDateString()
                                : "Loading..."}
                            </time>
                          </div>
                        </div>
                        <div>
                          <div class="flex flex-wrap justify-between">
                            <div class="flex space-x-2 text-sm dark:text-gray-400">
                              <button
                                aria-label="Share this post"
                                type="button"
                                class="flex items-center p-1 space-x-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                  >
                                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                  </svg>
                                  <span>view</span>
                                </svg>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  class="w-4 h-4 mr-1"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>{post.views}</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of comments"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                                  <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                                </svg>
                                <span>{post.comments}</span>
                              </button>
                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of likes"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                                  <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                                </svg>
                                <span>{post.like}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>

            <div class="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 ">
              <div class="space-y-2">
                <h2 class="text-xl font-bold"> Least 3 Love</h2>

                <article>
                  <ul>
                    {leastLovedPosts.map((post) => (
                      <li key={post.title}>
                        <div class="flex items-center mt-8 space-x-4">
                          <img
                            src={
                              post.imageUrl ||
                              "https://source.unsplash.com/random/100x100/?5"
                            }
                            alt=""
                            class="w-20 mb-4 h-18 sm:h-22 "
                          />

                          <div>
                            <h2 class="text-xl font-bold">
                              {" "}
                              {post.title.substring(0, 18)}{" "}
                            </h2>
                            <h3 class="text-sm font-medium">{post.category}</h3>
                            <time
                              datetime="2021-02-18"
                              class="text-sm dark:text-gray-400"
                            >
                              {post.createDate
                                ? new Date(post.createDate).toLocaleDateString()
                                : "Loading..."}
                            </time>
                          </div>
                        </div>
                        <div>
                          <div class="flex flex-wrap justify-between">
                            <div class="flex space-x-2 text-sm dark:text-gray-400">
                              <button
                                aria-label="Share this post"
                                type="button"
                                class="flex items-center p-1 space-x-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                  >
                                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                  </svg>
                                  <span>view</span>
                                </svg>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  class="w-4 h-4 mr-1"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>{post.views}</span>
                              </button>

                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of comments"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                                  <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                                </svg>
                                <span>{post.comments}</span>
                              </button>
                              <button
                                type="button"
                                class="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of likes"
                                  class="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                                  <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                                </svg>
                                <span>{post.like}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-6 sm:py-12 dark:bg-gray-800 dark:text-gray-100">
        <div className="container p-6 mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Recently Posted</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
            {latestPosts.map((post) => (
              <article
                key={post._id}
                className="flex flex-col dark:bg-gray-900"
              >
                <img
                  src={
                    post.imageUrl ||
                    "https://source.unsplash.com/200x200/?fashion?1"
                  }
                  alt="image"
                  className="object-cover w-full h-52 dark:bg-gray-500"
                />
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="flex-1 py-2 text-lg font-semibold leadi">
                    {post.title}
                  </h3>
                  <div className="flex flex-wrap justify-between pt-3 space-x-2 text-xs dark:text-gray-400">
                    <span>
                      {" "}
                      {post.createDate
                        ? new Date(post.createDate).toLocaleDateString()
                        : "Loading..."}
                    </span>
                    <span>{post.views} views</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardContent;
