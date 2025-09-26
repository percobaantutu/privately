import "./App.css";
import React, { useContext } from "react"; // <-- Import useContext
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
// ... (all your other page imports)
import ResetPassword from "./pages/ResetPassword";
import { AppContext } from "./context/AppContext"; // <-- Import AppContext

function App() {
  const location = useLocation();
  const { loading } = useContext(AppContext); // <-- Get the loading state

  const isTeacherDashboard = location.pathname.startsWith("/teacher/dashboard");

  // If the initial session check is happening, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Once loading is false, render the app
  return (
    <>
      <ToastContainer />
      {isTeacherDashboard ? (
        <div className="px-2">
          <Navbar isTeacherView={true} />
          <Routes>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />}>
              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="availability" element={<Availability />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="guide" element={<TutorGuide />} />
            </Route>
          </Routes>
        </div>
      ) : (
        <div className="mx-4 sm:mx-[10%]">
          <Navbar isTeacherView={false} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-appointments" element={<MySessions />} />
            <Route path="/messages" element={<Message />} />
            <Route path="/messages/:conversationId" element={<Message />} />
            <Route path="/my-disputes" element={<MyDisputes />} />
            <Route path="/session/:teacherId" element={<Session />} />
            <Route path="/teachers/:speciality" element={<Teachers />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/teacher/register" element={<TeacherRegister />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
