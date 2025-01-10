import React from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { MdOutlineEventNote } from "react-icons/md";
import Cover from "../assets/coverImg.png";
import axios from "axios";
const Login: React.FC = () => {
  const navigate = useNavigate();

  const [formValue, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ target }: any) => {
    const { name, value } = target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  console.log(formValue);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://thealterofficebackend.onrender.com/user/login",
        formValue
      );
      if (res.data.statusCode === 200) {
        localStorage.setItem(
          "USER",
          JSON.stringify(res.data.data)
        );
        navigate("/home");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <Container
      fluid
      className=" vh-100 d-flex justify-content-center align-items-center"
      style={{ overflow: "hidden", position: "relative" }}
    >
      <Row className="w-100">
        <Col
          lg={4}
          className="d-flex flex-column justify-content-center align-items-center text-white"
        >
          <div
            className="d-flex justify-content-start flex-column text-center "
            style={{ width: "320px" }}
          >
            <div className="d-flex flex-row  align-items-center text-center">
              <MdOutlineEventNote
                size={26}
                style={{ color: "#7B1984" }}
                className="me-2"
              />
              <h3
                className="fw-bold"
                style={{ fontSize: "26px", color: "#7B1984", margin: 0 }}
              >
                TaskBuddy
              </h3>
            </div>

            <div className="mt-3">
              <p
                className="fw-medium text-a"
                style={{ fontSize: "11px", color: "black" }}
              >
                Streamline your workflow and track progress effortlessly with
                our all-in-one task management app.
              </p>
            </div>
            <div>
              <div className="p-4 shadow-sm border rounded">
                <div>
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <p className="h5">Login</p>
                    </div>

                    <div className="mb-3">
                      <Form.Control
                        type="email"
                        id="email"
                        name="email"
                        onChange={handleChange}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Control
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                      />
                    </div>

                    <p style={{ color: "black" }}>
                      For testing email: admin@gmail.com, password: 12345
                    </p>

                    {/* Button placed inside the form to trigger submit */}
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 mt-2"
                    >
                      Login
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
            {/* <Button
              className="d-flex align-items-center justify-content-center  mt-3"
              style={{
                height: "60px",
                backgroundColor: "#292929",
                borderRadius: "20px",
                border: "none",
              }}
            >
              <FaGoogle className="me-2" style={{ fontSize: "22px" }} />
              Continue with Google
            </Button> */}
          </div>
        </Col>

        <Col
          lg={8}
          className="d-none d-lg-flex justify-content-start"
          style={{
            overflow: "hidden",
            marginTop: "250px",
          }}
        >
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              width: "834.37px",
              height: "834.37px",
              borderRadius: "50%",
              border: "0.73px solid #7B1984",
              position: "relative",
            }}
          >
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                width: "705.61px",
                height: "705.61px",
                borderRadius: "50%",
                border: "0.73px solid #7B1984",
              }}
            >
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: "560.85px",
                  height: "560.85px",
                  borderRadius: "50%",
                  border: "0.73px solid #7B1984",
                }}
              >
                <img
                  src={Cover}
                  alt="Inner Circle"
                  style={{
                    width: "100%",
                    height: "100%",

                    position: "relative",
                  }}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
