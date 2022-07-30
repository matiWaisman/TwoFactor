import { Route, Routes, Navigate } from "react-router-dom";
import LoggedIn from "./components/loggedIn";
import Login from "./components/login";
import Register from "./components/register";
import PageFooter from "./components/pageFooter";
import "./App.css";
import VerifyEmail from "./components/verifyEmail";

function App() {
  const user = localStorage.getItem("token");
  return (
    <div className="App">
      <Routes>
        {user && <Route path="/" exact element={<LoggedIn />} />}
        <Route path="/register" exact element={<Register />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/users/:id/verify/:token" element={<VerifyEmail />} />
      </Routes>
      <PageFooter />
    </div>
  );
}

export default App;
