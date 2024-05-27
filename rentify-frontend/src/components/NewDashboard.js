import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";
import "boxicons";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests
import RemoteJobPosts from "./RemoteJobPosts";
import NonRemoteJobPosts from "./NonRemoteJobPosts";
import AppliedJobs from "./AppliedJobs";
import PostedJobs from "./PostedJobs";
import OngoingJobs from "./OngoingJobs";
import RatingsView from "./RatingsView";

function Sidebar({
  handleLogout,
  toggleRemoteJobs,
  toggleDashboard,
  toggleNonRemoteJobs,
  togglePostedJobs,
  toggleAppliedJobs,
  toggleOngoingJobs,
  toggleRatings,
}) {
  return (
    <section id="sidebar">
      <a href="#" className="brand">
        <img src={require("./img/logo.png")} id="logo" alt="Logo" />
        <span className="text">SkillMarket</span>
      </a>
      <ul className="side-menu top">
        <li className="active">
          <a href="#" onClick={toggleDashboard}>
            <i className="bx bxs-dashboard"></i>
            <span className="text">Dashboard</span>
          </a>
        </li>
        <Link to="#" onClick={toggleRemoteJobs}>
          <li>
            <a href="#">
              <i className="bx bx-laptop"></i>
              <span className="text">Remote Jobs</span>
            </a>
          </li>
        </Link>
        <Link to="#" onClick={toggleNonRemoteJobs}>
          <li>
            <a href="#">
              <i className="bx bx-building-house"></i>
              <span className="text">Non-Remote Jobs</span>
            </a>
          </li>
        </Link>

        <li>
          <a href="#" onClick={togglePostedJobs}>
            <i className="bx bxs-book"></i>
            <span className="text">Posted Jobs</span>
          </a>
        </li>
        <li>
          <a href="#" onClick={toggleAppliedJobs}>
            <i className="bx bxs-edit"></i>
            <span className="text">Applied Jobs</span>
          </a>
        </li>

        <li>
          <a href="#" onClick={toggleOngoingJobs}>
            <i className="bx bxs-message-dots"></i>
            <span className="text">Ongoing Jobs</span>
          </a>
        </li>
        <li>
          <a href="#" onClick={toggleRatings}>
            <i className="bx bxs-medal"></i>
            <span className="text">Ratings & Reviews</span>
          </a>
        </li>
      </ul>
      <ul className="side-menu">
        <li>
          <a href="#">
            <i className="bx bxs-bell"></i>
            <span className="text">Notifications</span>
          </a>
        </li>
        <li>
          <a className="logout" onClick={handleLogout}>
            <i className="bx bxs-log-out-circle"></i>
            <span className="text">Logout</span>
          </a>
        </li>
      </ul>
    </section>
  );
}

function Navbar({
  handleLogout,
  handleBellIconClick,
  notifications,
  count,
  showNotifications,
  handleCloseButtonClick,
  username,
}) {
  return (
    <section id="dashcont">
      <nav>
        <i className="bx bx-menu"></i>
        {/* <form action="#">
            <div className="form-input">
              <input type="search" placeholder="Search..." />
              <button type="submit" className="search-btn">
                <i className="bx bx-search"></i>
              </button>
            </div>
          </form> */}
        <input type="checkbox" id="switch-mode" hidden />
        <label htmlFor="switch-mode" className="switch-mode"></label>
        <div>
          <div className="notification-container">
            <a href="#" className="notification" onClick={handleBellIconClick}>
              <i className="bx bxs-bell"></i>
              <span className="num">{count}</span>
            </a>
          </div>
          {showNotifications && (
            <div className="notification-window">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button
                  className="close-button"
                  onClick={handleCloseButtonClick}
                >
                  <i className="bx bx-x"></i>
                </button>
              </div>
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.created_at}>
                    <p>{notification.message}</p>
                    <p>Created at: {notification.created_at}</p>
                  </li>
                ))}
              </ul>
              <p>Total notifications: {count}</p>
            </div>
          )}
        </div>
        <Link
          to={{
            pathname: "/profile",
            state: { username: username },
          }}
          className="profile"
        >
          <img src={require("./img/profile.png")} alt="Profile" /> {username}
        </Link>
      </nav>
    </section>
  );
}

function Main({ jobCount, jobs, connections, userProfilesCount }) {
  return (
    <main>
      <ul className="box-info">
        <Link to="/all_jobs">
          <li>
            <i className="bx bxs-calendar"></i>
            <span className="text">
              <h3>{jobCount}</h3>
              <p>Job Posts</p>
            </span>
          </li>
        </Link>
        <Link to="/all_users">
          <li>
            <i className="bx bxs-group"></i>
            <span className="text">
              <h3>{userProfilesCount}</h3>
              <p>User Profiles</p>
            </span>
          </li>
        </Link>
      </ul>

      <div className="details">
        {/* Recent Orders */}
        <div className="recentOrders">
          <div className="cardHeader">
            <h2>Activity</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Work</th>
                <th>Approval Status</th>
                <th>Work Status</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job.job_name}>
                  <td>{job.user_name}</td>
                  <td>{job.job_name}</td>
                  <td>
                    <span className={`status ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status ${
                        job.work_status ? job.work_status.toLowerCase() : ""
                      }`}
                    >
                      {job.work_status || ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Customers */}
        <div className="recentCustomers">
          <div className="cardHeader">
            <h2>Connections</h2>
            {/* <a href="#" className="btn">
              View All
            </a> */}
          </div>

          <table>
            <tbody>
              {connections.map((connection, index) => (
                <tr key={index}>
                  <td width="60px">
                    <div className="imgBx">
                      <img src={require("./img/profile.png")} alt="" />
                    </div>
                  </td>
                  <td>
                    <h4>
                      {connection.name} <br />{" "}
                      <span>{connection.location}</span>
                    </h4>
                  </td>
                  {/* <td className="options">
                      <div
                        className="three-dots"
                        onClick={() => togglePopup(this)}
                      >
                        ...
                      </div>
                      <div className="popup">
                        <a href="#">Remove</a>
                      </div>
                    </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
function NewDashboard({ history }) {
  const [username, setUsername] = useState("");
  const [jobCount, setJobCount] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [connections, setConnections] = useState([]);
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfilesCount, setUserProfiles] = useState([]);
  const [showRemoteJobs, setShowRemoteJobs] = useState(false);
  const [showNonRemoteJobs, setShowNonRemoteJobs] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showPostedJobs, setShowPostedJobs] = useState(false);
  const [showAppliedJobs, setShowAppliedJobs] = useState(false);
  const [showOngoingJobs, setShowOngoingJobs] = useState(false);
  const [showRatings, setShowRatings] = useState(false);
  const togglePopup = (button) => {
    const popups = document.querySelectorAll(".popup");
    popups.forEach((popup) => {
      popup.style.display = "none";
    });

    const popup = button.nextElementSibling;
    popup.style.display = popup.style.display === "block" ? "none" : "block";
  };
  const toggleRemoteJobs = () => {
    setShowRemoteJobs(true);
    setShowDashboard(false);
    setShowNonRemoteJobs(false);
    setShowAppliedJobs(false);
    setShowPostedJobs(false);
    setShowRatings(false);
    setShowOngoingJobs(false);
  };
  const toggleDashboard = () => {
    setShowDashboard(true);
    setShowRemoteJobs(false);
    setShowNonRemoteJobs(false);
    setShowAppliedJobs(false);
    setShowPostedJobs(false);
    setShowRatings(false);
    setShowOngoingJobs(false);
  };
  const toggleNonRemoteJobs = () => {
    setShowNonRemoteJobs(true);
    setShowRemoteJobs(false);
    setShowDashboard(false);
    setShowAppliedJobs(false);
    setShowPostedJobs(false);
    setShowRatings(false);
    setShowOngoingJobs(false);
  };
  const togglePostedJobs = () => {
    setShowPostedJobs(true);
    setShowNonRemoteJobs(false);
    setShowRemoteJobs(false);
    setShowDashboard(false);
    setShowAppliedJobs(false);
    setShowRatings(false);
    setShowOngoingJobs(false);
  };

  const toggleAppliedJobs = () => {
    setShowAppliedJobs(true);
    setShowPostedJobs(false);
    setShowNonRemoteJobs(false);
    setShowRemoteJobs(false);
    setShowDashboard(false);
    setShowRatings(false);
    setShowOngoingJobs(false);
  };
  const toggleOngoingJobs = () => {
    setShowOngoingJobs(true);
    setShowRatings(false);
    setShowPostedJobs(false);
    setShowNonRemoteJobs(false);
    setShowRemoteJobs(false);
    setShowDashboard(false);
    setShowAppliedJobs(false);
  };

  const toggleRatings = () => {
    setShowRatings(true);
    setShowOngoingJobs(false);
    setShowAppliedJobs(false);
    setShowPostedJobs(false);
    setShowNonRemoteJobs(false);
    setShowRemoteJobs(false);
    setShowDashboard(false);
  };

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const response = await fetch(
        `http://localhost:8000/api/user/${userId}/notifications/`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setNotifications(data.notifications);
      setCount(data.notifications_count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");

      if (!token || !userId) {
        // Token or user ID not found in local storage, redirect to login page
        history.push("/login");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8000/api/validate_token/",
          {
            token,
            user_id: userId,
          }
        );
        console.log("response", response.status);
        if (response.status === 200) {
          // Token validation successful, continue with dashboard rendering
          console.log("Token validated successfully");
          setUsername(localStorage.getItem("username"));
        }
      } catch (error) {
        // Error occurred while validating token
        console.error("Error validating token:", error);
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        history.push("/login");
        alert("Your session has expired.Please login.");
      }
    };
    validateToken();
    // fetchCSRFToken();
    const link = document.createElement("link");
    link.href = "https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css";
    link.rel = "stylesheet";

    // Append the link element to the document head
    document.head.appendChild(link);

    const allSideMenu = document.querySelectorAll(
      "#sidebar .side-menu.top li a"
    );

    const handleMenuClick = (e) => {
      const li = e.target.parentElement;
      allSideMenu.forEach((i) => {
        i.parentElement.classList.remove("active");
      });
      li.classList.add("active");
    };

    allSideMenu.forEach((item) => {
      item.addEventListener("click", handleMenuClick);
    });

    // TOGGLE SIDEBAR
    const menuBar = document.querySelector("#content nav .bx.bx-menu");
    const sidebar = document.getElementById("sidebar");

    const handleMenuBarClick = () => {
      sidebar.classList.toggle("hide");
    };

    menuBar.addEventListener("click", handleMenuBarClick);

    // const searchButton = document.querySelector(
    //   "#content nav form .form-input button"
    // );
    // const searchButtonIcon = document.querySelector(
    //   "#content nav form .form-input button .bx"
    // );
    // const searchForm = document.querySelector("#content nav form");

    // const handleSearchButtonClick = (e) => {
    //   if (window.innerWidth < 576) {
    //     e.preventDefault();
    //     searchForm.classList.toggle("show");
    //     if (searchForm.classList.contains("show")) {
    //       searchButtonIcon.classList.replace("bx-search", "bx-x");
    //     } else {
    //       searchButtonIcon.classList.replace("bx-x", "bx-search");
    //     }
    //   }
    // };

    // searchButton.addEventListener("click", handleSearchButtonClick);

    // const handleResize = () => {
    //   if (window.innerWidth > 576) {
    //     searchButtonIcon.classList.replace("bx-x", "bx-search");
    //     searchForm.classList.remove("show");
    //   }
    // };

    // window.addEventListener("resize", handleResize);

    const switchMode = document.getElementById("switch-mode");

    const handleSwitchModeChange = () => {
      if (switchMode.checked) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    };
    switchMode.addEventListener("change", handleSwitchModeChange);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/count_jobs/"
        );
        setJobCount(response.data);
      } catch (error) {
        console.error("Error fetching job count:", error);
      }
    };

    fetchData();
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/get_jobs_for_user/",
          {
            params: {
              user_id: localStorage.getItem("user_id"),
            },
          }
        );
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();

    const fetchConnections = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const url = `http://localhost:8000/api/get_connection_names?user_id=${userId}`;
        const response = await fetch(url);
        const data = await response.json();

        // Check if data is an array
        if (Array.isArray(data)) {
          setConnections(data);
        } else if (typeof data === "object" && data !== null) {
          // If data is a single object, convert it to an array with one element
          setConnections([data]);
        } else {
          // Handle other cases where data is not in the expected format
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };
    fetchConnections();

    fetchNotifications();

    const fetchUserProfiles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/all_users/"
        );
        setUserProfiles(response.data.count); // Accessing the 'users' array from the response data
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchUserProfiles();
    // Cleanup function
    return () => {
      document.head.removeChild(link);

      allSideMenu.forEach((item) =>
        item.removeEventListener("click", handleMenuClick)
      );
      menuBar.removeEventListener("click", handleMenuBarClick);
      // searchButton.removeEventListener("click", handleSearchButtonClick);
      // window.removeEventListener("resize", handleResize);
      switchMode.removeEventListener("change", handleSwitchModeChange);
    };
  }, []);
  const handleBellIconClick = () => {
    // Call fetchNotifications to refresh notifications
    fetchNotifications();
    setShowNotifications(true); // Show the notification window

    // Show a small window type below with notifications that came
    // You can implement your notification display logic here
  };
  const handleCloseButtonClick = () => {
    setShowNotifications(false); // Hide the notification window
  };
  console.log(username);
  const handleLogout = async () => {
    try {
      // Clear local storage or perform any other cleanup
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");

      // Redirect to the login page or any other page
      history.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle error response or display error message to the user
    }
  };
  return (
    <section id="content">
      <Sidebar
        handleLogout={handleLogout}
        toggleRemoteJobs={toggleRemoteJobs}
        toggleDashboard={toggleDashboard}
        toggleNonRemoteJobs={toggleNonRemoteJobs}
        toggleAppliedJobs={toggleAppliedJobs}
        togglePostedJobs={togglePostedJobs}
        toggleOngoingJobs={toggleOngoingJobs}
        toggleRatings={toggleRatings}
      />
      {/* NAVBAR */}
      <section id="dashcont">
        <Navbar
          handleLogout={handleLogout}
          handleBellIconClick={handleBellIconClick}
          notifications={notifications}
          count={count}
          showNotifications={showNotifications}
          handleCloseButtonClick={handleCloseButtonClick}
          username={username}
        />{" "}
        {/* NAVBAR */}
        {/* MAIN */}
        {showDashboard && (
          <Main
            jobCount={jobCount}
            jobs={jobs}
            connections={connections}
            userProfilesCount={userProfilesCount}
          />
        )}
        {showRemoteJobs && <RemoteJobPosts />}
        {showNonRemoteJobs && <NonRemoteJobPosts />}
        {showAppliedJobs && <AppliedJobs />}
        {showPostedJobs && <PostedJobs />}
        {showOngoingJobs && <OngoingJobs />}
        {showRatings && <RatingsView />}
        {/* MAIN */}
      </section>
    </section>
  );
}

export default NewDashboard;
