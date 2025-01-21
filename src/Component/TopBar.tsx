import { Col, Container, Row } from "react-bootstrap";
import { MdOutlineEventNote } from "react-icons/md";
import UserIMG from "../assets/user.jpg";
import { SlLogout } from "react-icons/sl";
import { HiMiniQueueList } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { CiViewBoard } from "react-icons/ci";
import "./TopBar.css";

const TopBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("USER");
  let parsedToken;
  if (token !== null) {
    parsedToken = JSON.parse(token);
  } else {
    throw new Error("Token is null. Cannot parse.");
  }
  const userName = parsedToken?.userIsExist?.userName;
  const handleLogOut = () => {
    localStorage.removeItem("USER");
    navigate("/");
  };
  return (
    <Container>
      <Row
        className="d-flex justify-content-between align-items-center"
        xs="auto"
      >
        <Col className="d-flex align-items-center flex-row">
          <MdOutlineEventNote
            style={{
              color: "#2F2F2F",
              fontSize: "24px",
              marginTop: "5px",
              marginRight: "5px",
            }}
          />
          <p className="m-1" style={{ color: "#2F2F2F", fontSize: "24px" }}>
            TaskBuddy
          </p>
        </Col>
        <Col className="d-flex flex-column mt-0.5">
          <div className="d-flex flex-row">
            <div
              style={{
                width: "36px",
                height: "36px",
                overflow: "hidden",
                borderRadius: "50%",
              }}
            >
              <img
                src={UserIMG}
                alt="User"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <p
              className="fw-bold"
              style={{
                color: "#000000",
                fontSize: "16px",
                marginTop: "5px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              {userName}
            </p>
          </div>
        </Col>
      </Row>
      <Row
        className="d-flex d-none d-sm-flex justify-content-between align-items-center"
        xs="auto"
      >
        <Col className="d-flex flex-row">
          <div className="d-flex flex-row">
            <Link
              to="/list"
              className="d-flex flex-row nav-link align-items-center "
            >
              <HiMiniQueueList size={15} className="mt-1" />
              <p
                className="fw-semibold mb-0 mt-0 ms-1"
                style={{ fontSize: "16px" }}
              >
                List
              </p>
            </Link>
          </div>
          <div className="d-flex flex-row ms-3">
            <Link
              to="/board"
              className="d-flex flex-row nav-link align-items-center "
            >
              <CiViewBoard size={15} className="mt-1" />
              <p
                className="fw-semibold mb-0 mt-0 ms-1"
                style={{ fontSize: "16px" }}
              >
                Board
              </p>
            </Link>
          </div>
        </Col>
        <Col>
          {" "}
          <button
            className="d-flex flex-row justify-content-center align-items-center d-none d-sm-flex"
            onClick={handleLogOut}
            style={{
              background: "#FFF9F9",
              fontWeight: "semibold",
              height: "40px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            <SlLogout
              size={15}
              style={{ color: "#000000", fontWeight: "semibold" }}
              className="me-2"
            />
            <p
              style={{
                color: "#000000",
                fontSize: "12px",
                fontWeight: "semibold",
                marginBottom: "0",
              }}
            >
              Logout
            </p>
          </button>
        </Col>
      </Row>
    </Container>
  );
};

export default TopBar;
