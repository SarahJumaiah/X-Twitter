import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Rightbar from "../components/Rightbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeart, FaUserAlt, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Homepage() {
  const [userProfile, setUserProfile] = useState({});
  const [userInput, setUserInput] = useState({
    content: "",
    id: "",
  });
  const [list, setList] = useState([]);
  const [liked, setLiked] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("foryou");
  const [showRightbar, setShowRightbar] = useState(false);

  const API = "https://67036af4bd7c8c1ccd4156a5.mockapi.io/posts";

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserProfile(storedUserData);
    }

    axios.get(API).then((res) => {
      setList(res.data);
    });

    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    setLiked(likedPosts);
  }, []);

  const handleTweets = () => {
    if (userInput.content.trim()) {
      const newPost = {
        content: userInput.content,
        username: userProfile.username,
        name: userProfile.name,
        profileImage: userProfile.profileImage,
        likes: 0,
        createdAt: new Date().toISOString(),
      };

      axios
        .post(API, newPost)
        .then((res) => {
          setList([...list, res.data]);
          setUserInput({ content: "", id: "" });
        })
        .catch((error) => console.error("Error posting tweet:", error));
    } else {
        MySwal.fire({
            title: "Error",
            text: "Please enter some content before posting.",
            icon: "warning",
            background: "#000",
            color: "#fff", 
            confirmButtonText: '<span style="color: black">OK</span>',
            customClass: {
              popup: "custom-swal-bg", 
              confirmButton: "bg-white text-black", 
            },
          });
              }
  };

  const calculateTimeDifference = (createdAt) => {
    const postTime = new Date(createdAt);
    const currentTime = new Date();
    const timeDifferenceInSeconds = Math.floor((currentTime - postTime) / 1000);

    if (timeDifferenceInSeconds < 60) {
      return timeDifferenceInSeconds === 1
        ? `${timeDifferenceInSeconds} second ago`
        : `${timeDifferenceInSeconds} seconds ago`;
    }

    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);

    if (timeDifferenceInMinutes < 60) {
      return timeDifferenceInMinutes === 1
        ? `${timeDifferenceInMinutes} minute ago`
        : `${timeDifferenceInMinutes} minutes ago`;
    }

    const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);

    if (timeDifferenceInHours < 24) {
      return timeDifferenceInHours === 1
        ? `${timeDifferenceInHours} hour ago`
        : `${timeDifferenceInHours} hours ago`;
    }

    const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

    return timeDifferenceInDays === 1
      ? `${timeDifferenceInDays} day ago`
      : `${timeDifferenceInDays} days ago`;
  };

  const toggleLike = (id, currentLikes) => {
    const isLiked = liked.includes(id);
    let newLikes;

    if (isLiked) {
      newLikes = currentLikes > 0 ? currentLikes - 1 : 0;
    } else {
      newLikes = currentLikes + 1;
    }

    axios
      .put(`${API}/${id}`, { likes: newLikes })
      .then((res) => {
        const updatedList = list.map((item) =>
          item.id === id ? { ...item, likes: res.data.likes } : item
        );
        setList(updatedList);

        const updatedLikedPosts = isLiked
          ? liked.filter((likedId) => likedId !== id)
          : [...liked, id];

        setLiked(updatedLikedPosts);
        localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));
      })
      .catch((error) => console.error("Error updating likes:", error));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleExploreClick = () => {
    setShowRightbar(!showRightbar);
  };

  return (
    <div className="relative">
      <div className="absolute top-3 left-3 cursor-pointer md:hidden">
        <img
          src={userProfile.profileImage || "default_image_url"}
          alt="Profile"
          className="w-9 h-9 rounded-full"
          onClick={toggleSidebar}
        />
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="grid grid-cols-1 lg:grid-cols-5 h-screen bg-black text-white">
        <div className="col-span-1 bg-black text-white hidden lg:block">
          <Sidebar />
        </div>

        <div className="col-span-5 lg:col-span-3 bg-black border-l border-r border-gray-700">
          <div className="flex justify-center mt-4 md:hidden">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-6 h-6"
              fill="white"
            >
              <g>
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  fill="white"
                ></path>
              </g>
            </svg>
          </div>
          <div className="flex justify-center border-b border-gray-700">
            <button
              className={`w-1/2 p-4 text-center font-semibold ${
                activeTab === "foryou"
                  ? "text-white border-b-4 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => handleTabChange("foryou")}
            >
              For You
            </button>
            <button
              className={`w-1/2 p-4 text-center font-semibold ${
                activeTab === "following"
                  ? "text-white border-b-4 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => handleTabChange("following")}
            >
              Following
            </button>
          </div>

          <div className="p-4 flex items-start bg-black border-b border-gray-700">
            <img
              className="w-12 h-12 rounded-full mr-4"
              src={userProfile.profileImage}
              alt="Profile"
            />
            <div className="w-full">
              <textarea
                className="w-full h-20 resize-none rounded-lg p-2 bg-black text-white focus:outline-none"
                placeholder={`What's happening, ${userProfile.name}?`}
                value={userInput.content}
                onChange={(e) =>
                  setUserInput({ ...userInput, content: e.target.value })
                }
              />
              <hr className="border-gray-700 mb-3" />
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button className="text-blue-500 hover:text-blue-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                      fill="currentColor"
                    >
                      <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                    </svg>
                  </button>
                  <button className="text-blue-500 hover:text-blue-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"></path>
                    </svg>
                  </button>
                  <button className="text-blue-500 hover:text-blue-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2zM7 7c0 .552-.45 1-1 1s-1-.448-1-1 .45-1 1-1 1 .448 1 1z"></path>
                    </svg>
                  </button>

                  <button className="text-blue-500 hover:text-blue-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z" />
                    </svg>
                  </button>

                  <button className="text-blue-500 hover:text-blue-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"></path>
                    </svg>
                  </button>

                  <button className="text-blue-500 hover:text-blue-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path>
                    </svg>
                  </button>
                </div>
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                  onClick={handleTweets}
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">
            {list.length > 0 ? (
              list.map((item) => {
                const isLiked = liked.includes(item.id);
                const timeAgo = calculateTimeDifference(item.createdAt);
                return (
                  <div key={item.id}>
                    <div className="flex items-start p-4 mb-4 rounded-lg shadow-md">
                      <img
                        className="w-12 h-12 rounded-full mr-4"
                        src={item.profileImage}
                        alt="Profile"
                      />
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-white">
                                {item.name}
                              </h3>
                              <p className="text-gray-500">@{item.username}</p>
                            </div>

                            <p className="text-gray-400 text-sm ml-2">
                              · {timeAgo}
                            </p>
                          </div>
                          <button className="text-gray-400 hover:text-gray-200">
                            <i className="fas fa-ellipsis-h"></i>
                          </button>
                        </div>
                        <p className="mt-2 text-white">{item.content}</p>
                        <div className="flex space-x-4 mt-4 text-gray-400">
                          <button
                            className={`flex items-center space-x-1 ${
                              isLiked ? "text-red-500" : "text-gray-500"
                            }`}
                            onClick={() => toggleLike(item.id, item.likes)}
                          >
                            <FaHeart />
                            <span className="ml-1">{item.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <hr className="border-gray-700 my-4" />
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">No posts to show.</p>
            )}
          </div>
        </div>

        <div className="col-span-1 bg-black border-l border-gray-700 hidden lg:block">
          <Rightbar />
        </div>
        {showRightbar && (
          <div className="col-span-1 bg-black border-l border-gray-700 block lg:hidden">
            <Rightbar />
          </div>
        )}

        <nav className="fixed bottom-0 w-full flex justify-around py-4 border-t border-gray-700 bg-black block lg:hidden">
          <Link
            to="/homepage"
            className="flex items-center justify-center space-x-2"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="25"
              fill="white"
              className="icon"
            >
              <g>
                <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"></path>
              </g>
            </svg>
          </Link>

          <button
            onClick={handleExploreClick}
            className="flex items-center justify-center space-x-2"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="25"
              fill="white"
              className="icon"
            >
              <g>
                <path d="M10.25 4.25c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.971 0-9-4.029-9-9z"></path>
              </g>
            </svg>
          </button>

          <Link
            to="/homepage"
            className="flex items-center justify-center space-x-2"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="25"
              fill="white"
              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
            >
              <g>
                <g clip-path="url(#7-clip0_2592_269)" clip-rule="evenodd">
                  <path d="M18 4.1H6c-1.05 0-1.9.85-1.9 1.9v12c0 1.05.85 1.9 1.9 1.9h12c1.05 0 1.9-.85 1.9-1.9V6c0-1.05-.85-1.9-1.9-1.9zM6 2h12c2.21 0 4 1.79 4 4v12c0 2.21-1.79 4-4 4H6c-2.21 0-4-1.79-4-4V6c0-2.21 1.79-4 4-4z"></path>
                  <path d="M6.68 17.8l8.108-11.58h2.532L9.21 17.8H6.68z"></path>
                </g>
                <defs>
                  <clipPath id="7-clip0_2592_269">
                    <rect height="20" rx="1" width="20" x="2" y="2"></rect>
                  </clipPath>
                </defs>
              </g>
            </svg>
          </Link>

          <Link
            to="/homepage"
            className="flex items-center justify-center space-x-2"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="25"
              fill="white"
              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-lrsllp r-1nao33i r-lwhw9o r-cnnz9e"
            >
              <g>
                <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"></path>
              </g>
            </svg>
          </Link>

          <Link
            to="/homepage"
            className="flex items-center justify-center space-x-2"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="25"
              fill="white"
              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
            >
              <g>
                <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
              </g>
            </svg>
          </Link>

          <Link
            to="/homepage"
            className="flex items-center justify-center space-x-2"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="25"
              fill="white"
              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
            >
              <g>
                <path d="M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z"></path>
              </g>
            </svg>
          </Link>
        </nav>
      </div>
    </div>
  );
}
