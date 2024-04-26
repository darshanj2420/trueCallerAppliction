import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const authentication = JSON.parse(localStorage.getItem("Token"));
  const [userData, setUserData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { name, phoneNumber, password } = userData;
  const onSubmit = async () => {
    
    try {
      await axios
        .post("http://localhost:3001/register", { name, phoneNumber, password })
        .then((response) => {
          console.log("response", response);
        });
        navigate("/login");
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.msg, {
        position: toast.POSITION?.TOP_RIGHT,
      });
    }
    setUserData({
      name: "",
      phoneNumber: "",
      password: "",
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (!authentication) {
        navigate("/");
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
          navigate("/users");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        navigate("/");
      }
    };

    verifyToken();
  }, [authentication, navigate]);

  return (
   <>
    <section
      className="vh-100 bg-image"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">
                    Create an account
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div data-mdb-input-init className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example1cg">
                        Your Name
                      </label>
                      <input
                        type="text"
                        {...register("name", {
                          required: "Required",
                          minLength: {
                            value: 3,
                            message: "Name should have at least 3 characters",
                          },
                          maxLength: {
                            value: 50,
                            message: "Name should not exceed 50 characters",
                          },
                          pattern: {
                            value: /^[a-zA-Z\s]*$/,
                            message: "Only alphabets are allowed",
                          },
                        })}
                        id="form3Example1cg"
                        className="form-control form-control-lg"
                        name="name"
                        value={name}
                        onChange={handleChange}
                      />

                      <span className="text-danger">
                        {errors.name && errors.name.message}
                      </span>
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example3cg">
                        Your Number
                      </label>
                      <input
                        type="text"
                        {...register("phoneNumber", {
                          required: "Required",
                          minLength: {
                            value: 10,
                            message:
                              "Phone phoneNumber should have at least 10 digits",
                          },
                          maxLength: {
                            value: 10,
                            message:
                              "Phone phoneNumber should not exceed 10 digits",
                          },
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Please enter a valid phone number",
                          },
                        })}
                        id="form3Example3cg"
                        className="form-control form-control-lg"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={handleChange}
                      />
                      <span className="text-danger">
                        {errors.phoneNumber && errors.phoneNumber.message}
                      </span>
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example4cg">
                        Password
                      </label>
                      <input
                        type="password"
                        {...register("password", {
                          required: "Required",
                          pattern: {
                            value:
                              /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                            message:
                              "Password requirements: 8-20 characters, 1 number, 1 letter, 1 symbol.",
                          },
                        })}
                        id="form3Example4cg"
                        className="form-control form-control-lg"
                        name="password"
                        value={password}
                        onChange={handleChange}
                      />
                      <span className="text-danger">
                        {errors.password && errors.password.message}
                      </span>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        data-mdb-button-init
                        data-mdb-ripple-init
                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Register
                      </button>
                    </div>

                    <p className="text-center text-muted mt-5 mb-0">
                      Have already an account?{" "}
                      <a href="/login" className="fw-bold text-body">
                        <u>Login here</u>
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <ToastContainer />
   </>
  );
};

export default Register;
