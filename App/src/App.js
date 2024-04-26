import Register from "./authentication/register";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./authentication/login";
/* Import Bootstrap CSS */
import "bootstrap/dist/css/bootstrap.min.css";
import User from "./Component/users";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<User />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
