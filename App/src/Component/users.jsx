import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Component/users.css";
import contactPhoto from "../Images/contact.png";
import numberBlockPhoto from "../Images/numberBlock.png";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { PaginationItem } from "@mui/material";
import { useDebounce } from "use-debounce";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const User = () => {
  const [contact, setContact] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedValue] = useDebounce(contact, 500);
  const [showName, setShowName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Change this value to set items per page
  const authentication = JSON.parse(localStorage.getItem("Token"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/login");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const usersData = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${authentication}`);

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "GET",
        headers: myHeaders,
      });

      if (response.ok) {
        const data = await response.json();
        setContact(data);
      } else {
        console.error("Error fetching users data:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleInputChange = async (e) => {
    const { value } = e.target;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${authentication}`);

    try {
      const response = await fetch(
        `http://localhost:3001/contact/search?searchQuery=${value}`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setContact(data);
        console.log("search data:", data);
      } else {
        setContact([]);
        console.error("Error fetching users data:", response.statusText);
      }
      if (!value) {
        usersData();
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const totalPages = Math.ceil(contact.length / itemsPerPage);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleClick = (id) => {
    const getUser = contact.find((user) => user._id === id);
    setShowName(getUser);
    setIsModalOpen(true);
  };
  const handalBlock = async () => {
    const confirmationMessage = showName.isSpam
      ? "Are you sure to unblock this Number"
      : "Are you sure to block this Number";

    const result = window.confirm(confirmationMessage);
    const url = showName.isSpam
      ? `http://localhost:3001/contact/markNotSpam/${showName.phoneNumber}`
      : `http://localhost:3001/contact/markSpam/${showName.phoneNumber}`;

    if (result) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${authentication}`);

      try {
        const response = await fetch(url, {
          method: "put",
          headers: myHeaders,
        });

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data)) {
          } else if (data.contact) {
            // Update the contact in the list
            const updatedContacts = contact.map((c) =>
              c._id === data.contact._id ? data.contact : c
            );
            setContact(updatedContacts);
            setIsModalOpen(false);
          } else {
            console.error("Received unexpected data format:", data);
          }
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    } else {
      console.log("User chose not to block the number");
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (!authentication) {
        navigate("/login");
        return;
      }

      try {
        // Make a request to the server to verify the token
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${authentication}`);
        const response = await fetch("http://localhost:3001/verifyToken", {
          method: "post",
          headers: myHeaders,
        });
        if (response.ok) {
          // Token is valid, proceed to fetch user data
          usersData();
        } else {
          // Token is invalid, redirect to login page
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        // Handle error (e.g., network error), redirect to login page
        navigate("/login");
      }
    };

    verifyToken();
  }, [authentication, navigate]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(contact)
    ? contact.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  return (
    <div>
      <div className="d-flex mt-3">
        <h1 className="text-center text-primary w-100">
          Truecaller Application
        </h1>
        <button onClick={handleLogout} className="btn btn-danger mr-5">
          Logout
        </button>
      </div>
      <div className="text-center d-flex justify-content-center align-items-center mt-5">
        <div className="input-container">
          <img src={contactPhoto} alt="Search icon" className="search-icon" />
          <input
            type="text"
            className="text-center search-input"
            placeholder="Search numbers, name & more"
            onChange={handleInputChange}
          />
        </div>
      </div>
      {currentItems.map((data, index) => {
        const firstLetter = data.name.charAt(0).toUpperCase();
        return (
          <div key={index} className="text-center d-flex ml-5 mt-3">
            <div className="circle-icon">{firstLetter}</div>
            <h3 className="text-white">{data.name}</h3>
            <details
              className="ml-3 fs-3 text-danger"
              onClick={() => handleClick(data._id)}
            >
              <summary></summary>
            </details>
          </div>
        );
      })}
      <Dialog
        sx={{ maxWidth: "100vw", background: "white" }} // Set width to 100vw
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{ width: "30vw" }}>
          <DialogTitle id="alert-dialog-title">
            <h2 className="text-danger text-center">{showName.name}</h2>{" "}
          </DialogTitle>
          <h2 className="text-center">{showName.phoneNumber}</h2>
          <DialogContent className="d-flex justify-content-center">
            <div>
              <button className="btn btn-primary mr-3">📞</button>
              <h4 className="text-primary">Call</h4>
            </div>
            <div>
              <button
                className={`btn ${
                  showName.isSpam ? "btn-primary" : "btn-danger"
                } ml-3`}
                onClick={handalBlock}
              >
                <img
                  src={numberBlockPhoto}
                  alt="Search icon"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginTop: "3px",
                  }}
                />
              </button>
              <h4 className="text-danger">
                {showName.isSpam ? "Unblock" : "Block"}
              </h4>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {contact.length > 0 ? (
        <div className="d-flex justify-content-center mt-3">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChange}
              variant="outlined"
              shape="rounded"
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  style={
                    item.type === "page" && currentPage === item.page
                      ? { backgroundColor: "red", color: "white" }
                      : { backgroundColor: "grey", color: "white" }
                  }
                />
              )}
            />
          </Stack>
        </div>
      ) : (
        <h1 className="text-danger text-center">Contact is not found</h1>
      )}
    </div>
  );
};

export default User;
