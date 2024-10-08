import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Rightbar from "../components/Rightbar";
import axios from "axios";
import { FaHeart, FaEllipsisH, FaTrash, FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const POSTS_API_URL = "https://67036af4bd7c8c1ccd4156a5.mockapi.io/posts";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState("posts");
  const [menuOpenPostId, setMenuOpenPostId] = useState(null);
  const [isRightbarOpen, setIsRightbarOpen] = useState(false);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setProfile(storedUserData);
    }

    const likedPostIds = JSON.parse(localStorage.getItem("likedPosts")) || [];

    const fetchPosts = async () => {
      try {
        const response = await axios.get(POSTS_API_URL);
        const allPosts = response.data;

        const userRelatedPosts = allPosts.filter(
          (post) => post.username === storedUserData?.username
        );

        const liked = allPosts.filter((post) => likedPostIds.includes(post.id));

        setUserPosts(userRelatedPosts);
        setLikedPosts(liked);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const toggleLike = (postId) => {
    const isLiked = likedPosts.find((post) => post.id === postId);
    const postIndexInUserPosts = userPosts.findIndex(
      (post) => post.id === postId
    );

    if (isLiked) {
      setLikedPosts((prevLiked) =>
        prevLiked.filter((post) => post.id !== postId)
      );
      axios.put(`${POSTS_API_URL}/${postId}`, { likes: isLiked.likes - 1 });

      if (postIndexInUserPosts !== -1) {
        const updatedUserPosts = [...userPosts];
        updatedUserPosts[postIndexInUserPosts].likes = Math.max(
          0,
          updatedUserPosts[postIndexInUserPosts].likes - 1
        );
        setUserPosts(updatedUserPosts);
      }
    } else {
      const likedPost = userPosts.find((post) => post.id === postId);
      setLikedPosts((prevLiked) => [...prevLiked, likedPost]);
      axios.put(`${POSTS_API_URL}/${postId}`, { likes: likedPost.likes + 1 });

      if (postIndexInUserPosts !== -1) {
        const updatedUserPosts = [...userPosts];
        updatedUserPosts[postIndexInUserPosts].likes += 1;
        setUserPosts(updatedUserPosts);
      }
    }

    const updatedLikedPosts = isLiked
      ? likedPosts.filter((post) => post.id !== postId)
      : [...likedPosts, userPosts.find((post) => post.id === postId)];

    setLikedPosts(updatedLikedPosts);
    localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));
  };

  const onDelete = (postId) => {
    axios.delete(`${POSTS_API_URL}/${postId}`).then(() => {
      setUserPosts(userPosts.filter((post) => post.id !== postId));

      MySwal.fire({
        title: "Deleted!",
        text: "Your post has been deleted.",
        icon: "success",
        background: "#000",
        color: "#fff",
        confirmButtonText: '<span style="color: black">OK</span>',
        customClass: {
          popup: "custom-swal-bg",
          confirmButton: "bg-white text-black",
        },
      });
    });
  };

  const handleDelete = (postId) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      background: "#000",
      color: "#fff",
      confirmButtonText: '<span style="color: black">Yes, delete it!</span>',
      cancelButtonText: '<span style="color: black">Cancel</span>',
      customClass: {
        popup: "custom-swal-bg",
        confirmButton: "bg-white text-black",
        cancelButton: "bg-white text-black",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(postId);
      }
    });
  };

  const toggleRightbar = () => {
    setIsRightbarOpen(!isRightbarOpen);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 h-screen bg-black text-white">
      <div className="block md:hidden flex items-center h-[50px] border-b border-gray-700 bg-black fixed top-0 w-full z-50 p-3 py-7">
        <Link to="/homepage" className="text-white mr-4">
          {" "}
          <FaArrowLeft size={20} />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold leading-none">{profile?.name}</h1>
          <p className="text-gray-500 text-sm">{userPosts.length} posts</p>
        </div>
      </div>

      <div className="col-span-1 bg-black text-white hidden lg:block">
        <Sidebar />
      </div>

      <div className="overflow-y-auto col-span-1 lg:col-span-3 bg-black border-l border-r border-gray-700">
        <div className="relative">
          <img
            src="https://www.bates.edu/wordpress/files/2016/07/color-gray1.jpg"
            alt="Profile Background"
            className="w-full h-40 object-cover"
          />
          <div className="relative p-4">
            <img
              src={
                profile?.profileImage ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/813px-Unknown_person.jpg"
              }
              alt="Profile"
              className="rounded-full border-4 border-black w-32 h-32 absolute -top-16 left-6"
            />
            <button className="absolute right-6 top-6 bg-white text-black px-4 py-2 rounded-full font-semibold">
              Edit profile
            </button>
          </div>
        </div>

        <div className="px-6">
          <div className="mt-14">
            <h2 className="text-2xl font-bold">{profile?.name}</h2>
            <p className="text-gray-400">@{profile?.username}</p>
          </div>

          <div className="flex items-center space-x-2 mt-5">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1bwzh9t r-1gs4q39"
              height="25"
              fill="white"
            >
              <g>
                <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path>
              </g>
            </svg>
            <p>Kingdom of Saudi Arabia</p>
          </div>

          <div className="flex space-x-4 mt-4">
            <span>
              <strong>0</strong> Following
            </span>
            <span>
              <strong>0</strong> Followers
            </span>
          </div>
        </div>

        <div className="flex justify-center border-b border-gray-700 mt-4">
          <button
            className={`w-1/2 p-2 text-center font-semibold ${
              selectedTab === "posts"
                ? "text-white border-b-2 border-blue-400"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedTab("posts")}
          >
            Posts
          </button>
          <button
            className={`w-1/2 p-2 text-center font-semibold ${
              selectedTab === "likes"
                ? "text-white border-b-2 border-blue-400"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedTab("likes")}
          >
            Likes
          </button>
        </div>

        <div className="p-6">
          {selectedTab === "posts" ? (
            <>
              {userPosts.length > 0 ? (
                userPosts.map((post) => {
                  const timeAgo = calculateTimeDifference(post.createdAt);
                  return (
                    <div
                      key={post.id}
                      className="flex items-start space-x-4 mb-4 w-full"
                    >
                      <img
                        src={post.profileImage}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="w-full relative">
                        <div className="flex justify-between items-center">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-white">
                                {post.name}
                              </h3>
                              <p className="text-gray-500">@{post.username}</p>
                            </div>

                            <p className="text-gray-400 text-sm ml-2">
                              · {timeAgo}
                            </p>
                          </div>

                          <div className="relative">
                            <button
                              className="text-gray-500 hover:text-gray-300"
                              onClick={() =>
                                setMenuOpenPostId(
                                  menuOpenPostId === post.id ? null : post.id
                                )
                              }
                            >
                              <FaEllipsisH />
                            </button>

                            {menuOpenPostId === post.id && (
                              <div className="absolute right-0 mt-2 w-28 bg-black text-white rounded-lg shadow-lg">
                                <button
                                  className="flex items-center space-x-2 px-4 py-2 text-red-500 hover:bg-gray-700 w-full"
                                  onClick={() => handleDelete(post.id)}
                                >
                                  <FaTrash />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="mt-2">{post.content}</p>
                        <div className="flex space-x-4 text-gray-500 mt-2">
                          <button
                            className={`flex items-center space-x-1 ${
                              likedPosts.some(
                                (likedPost) => likedPost.id === post.id
                              )
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                            onClick={() => toggleLike(post.id)}
                          >
                            <FaHeart />
                            <span>{post.likes}</span>
                          </button>
                        </div>

                        <hr className="border-gray-700 my-4 w-full" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No posts to show.</p>
              )}
            </>
          ) : (
            <>
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start space-x-4 mb-4 w-full"
                  >
                    <img
                      src={post.profileImage}
                      alt="Profile"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="w-full relative">
                      <div className="flex justify-between items-center">
                        <p className="text-white">
                          {post.name}{" "}
                          <span className="ml-2 text-gray-400">
                            @{post.username}
                          </span>
                        </p>

                        <div className="relative">
                          <button
                            className="text-gray-500 hover:text-gray-300"
                            onClick={() =>
                              setMenuOpenPostId(
                                menuOpenPostId === post.id ? null : post.id
                              )
                            }
                          >
                            <FaEllipsisH />
                          </button>

                          {menuOpenPostId === post.id && (
                            <div className="absolute right-0 mt-2 w-28 bg-black text-white rounded-lg shadow-lg">
                              <button
                                className="flex items-center space-x-2 px-4 py-2 text-red-500 hover:bg-gray-700 w-full"
                                onClick={() => handleDelete(post.id)}
                              >
                                <FaTrash />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="mt-2">{post.content}</p>
                      <div className="flex space-x-4 text-gray-500 mt-2">
                        <button
                          className="flex items-center space-x-1 text-red-500"
                          onClick={() => toggleLike(post.id)}
                        >
                          <FaHeart />
                          <span>{post.likes}</span>
                        </button>
                      </div>
                      <hr className="border-gray-700 my-4 w-full" />
                    </div>
                  </div>
                ))
              ) : (
                <p>No liked posts to show.</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="col-span-1 bg-black border-l border-gray-700 hidden lg:block">
        <Rightbar />
      </div>

      {isRightbarOpen && (
        <div className="fixed inset-0 bg-black z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <button
              onClick={toggleRightbar}
              className="text-white px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700"
            >
              Back
            </button>
            <h2 className="text-white text-lg">Explore</h2>
          </div>
          <div className="p-4">
            <Rightbar />
          </div>
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
          onClick={toggleRightbar}
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
            class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
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
            class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-lrsllp r-1nao33i r-lwhw9o r-cnnz9e"
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
            class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
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
            class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
          >
            <g>
              <path d="M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z"></path>
            </g>
          </svg>
        </Link>
      </nav>
    </div>
  );
}
