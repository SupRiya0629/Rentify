import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import VerifyOTPForm from "./components/VerifyOTPForm";
import ChangePasswordForm from "./components/ChangePassword";
import JobPostForm from "./components/JobPostForm";
import JobPost from "./components/AllJobPosts";
import PostedJobs from "./components/PostedJobs";
import ViewJob from "./components/ViewJob";
import ApplyJobDetails from "./components/ApplyJobDetails";
import AppliedJobs from "./components/AppliedJobs";
import JobApplications from "./components/JobApplications";
import RemoteJobPosts from "./components/RemoteJobPosts";
import NonRemoteJobPosts from "./components/NonRemoteJobPosts";
import OngoingJobs from "./components/OngoingJobs";
import RatingsView from "./components/RatingsView";
import UsersProfiles from "./components/UserProfiles";
import EditUser from "./components/EditUser";
import NewDashboard from "./components/NewDashboard";
function App() {
  return (
    <Router>
      <div>
        <Switch>
          {/* <Route path="/" exact component={Home} />
          <Route path="/team" component={Team} />
          <Route path="/contact" component={ContactForm} />
          <Route path="/JobSig" component={JobSig} />
          <Route path="/HS" component={HS} />
          <Route path="/remote" component={Remote} />
          <Route path="/nonremote" component={NonRemote} /> */}

          <Route path="/" exact component={HomePage} />
          <Route path="/login" component={LoginForm} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/new_dashboard" component={NewDashboard} />

          {/* <div className="edit_user"> */}
          <Route path="/profile" component={Profile} />
          {/* </div> */}

          <Route path="/forgot_password" component={ForgotPasswordForm} />
          <Route path="/verify_otp" component={VerifyOTPForm} />
          <Route path="/change_password" component={ChangePasswordForm} />
          <Route path="/post_job" component={JobPostForm} />
          <Route path="/all_jobs" component={JobPost} />
          <Route path="/posted_jobs" component={PostedJobs} />
          <Route
            path="/view_job/:job_id"
            render={(props) => <ViewJob job_id={props.match.params.job_id} />}
          />
          <Route
            path="/apply_job_details/:job_id"
            render={(props) => (
              <ApplyJobDetails job_id={props.match.params.job_id} />
            )}
          />
          <Route path="/applied_jobs" component={AppliedJobs} />
          <Route
            path="/get_user_by_job/:job_id"
            render={(props) => (
              <JobApplications job_id={props.match.params.job_id} />
            )}
          />
          <Route path="/all_remote_jobs" component={RemoteJobPosts} />
          <Route path="/all_non_remote_jobs" component={NonRemoteJobPosts} />
          <Route path="/ongoing_jobs" component={OngoingJobs} />
          <Route path="/ratings" component={RatingsView} />
          <Route path="/all_users" component={UsersProfiles} />
          <div className="edit_user">
            <Route path="/edit_user" component={EditUser} />
          </div>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
