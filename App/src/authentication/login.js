import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


const Login = () => {
  const navigate = useNavigate();
  const authentication = JSON.parse(localStorage.getItem("Token"));
  const [userDetail, setUserDetail] = useState({
    phoneNumber: "",
    password: "",
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const { phoneNumber, password } = userDetail;

  const onSubmit = async () => {
    try {
      const loginData = await axios.post("http://localhost:3001/login", {
        phoneNumber,
        password,
      });
      const token = loginData.data.token;
      if (token) {
        localStorage.setItem("Token", JSON.stringify(token));
        setUserDetail({
          phoneNumber: "",
          password: "",
        });
        navigate("/users");
      } else {
        // Handle case where token is not received
        console.error("Token not received");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg, {
        position: toast.POSITION?.TOP_RIGHT,
      });
    }
  };
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail({
      ...userDetail,
      [name]: value,
    });
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
          navigate("/users");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        navigate("/login");
      }
    };

    verifyToken();
  }, [authentication, navigate]);
  return (
    <>
      <section className="vh-100" style={{ backgroundColor: "#508bfc" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card shadow-2-strong"
                style={{ borderRadius: "1rem" }}
              >
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="card-body p-5 "
                >
                  <h3 className="mb-5 text-center">Sign in</h3>

                  <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" htmlFor="typeEmailX-2">
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
                      id="typeEmailX-2"
                      name="phoneNumber"
                      value={phoneNumber}
                      onChange={handleChange}
                      className="form-control form-control-lg"
                    />
                    <span className="text-danger">
                      {errors.phoneNumber && errors.phoneNumber.message}
                    </span>
                  </div>

                  <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" htmlFor="typePasswordX-2">
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
                      name="password"
                      value={password}
                      onChange={handleChange}
                      id="typePasswordX-2"
                      className="form-control form-control-lg"
                    />
                    <span className="text-danger">
                      {errors.password && errors.password.message}
                    </span>
                  </div>

                  {/* <!-- Checkbox --> */}
                  <div className="form-check d-flex justify-content-start mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="form1Example3"
                    />
                    <label className="form-check-label" htmlFor="form1Example3">
                      Remember password
                    </label>
                  </div>

                  <button
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-primary btn-lg btn-block"
                    type="submit"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default Login;
