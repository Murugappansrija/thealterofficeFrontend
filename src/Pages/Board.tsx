import { useEffect, useState } from "react";
import TopBar from "../Component/TopBar";
import { CardBody, Col, Container, Row } from "react-bootstrap";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import CreateTask from "../Component/CreateTask";
import EditTask from "../Component/EditTask";

interface Task {
  _id: string;
  task_name: string;
  due_date: string;
  status: string;
  category: string;
  createdBy: string;
  createdAt: string;
  description: string;
  updatedAt: string;
  attachment: string | null;
}

const Board = () => {
  const [toDoData, setToDData] = useState<Task[]>([]);
  const [show, setShow] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [editShow, setEditShow] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<Task>({
    _id: "",
    task_name: "",
    due_date: "",
    status: "",
    category: "",
    createdBy: "",
    createdAt: "",
    description: "",
    updatedAt: "",
    attachment: "",
  });

  const token = localStorage.getItem("USER");
  let parsedToken;
  if (token !== null) {
    parsedToken = JSON.parse(token);
  } else {
    throw new Error("Token is null. Cannot parse.");
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://thealterofficebackend.onrender.com/todo/get",
        {
          headers: {
            Authorization: parsedToken.token,
          },
        }
      );
      setToDData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEditClose = () => setEditShow(false);

  const handleEditShow = (task: Task) => {
    console.log(task);
    setEditTask(task);
    setEditShow(true);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(
        `https://thealterofficebackend.onrender.com/todo/delete/${taskId}`,
        {
          headers: {
            Authorization: parsedToken.token,
          },
        }
      );

      setToDData((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
      fetchData();
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  const filteredCards = toDoData
    .filter((card) => {
      const matchesCategory = selectedCategory
        ? card.category === selectedCategory
        : true;
      const matchesSearch = card.task_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.due_date.localeCompare(b.due_date);
      } else {
        return b.due_date.localeCompare(a.due_date);
      }
    });

  const groupedCards = {
    "TO-DO": filteredCards.filter((card) => card.status === "TO-DO"),
    "IN-PROGRESS": filteredCards.filter(
      (card) => card.status === "IN-PROGRESS"
    ),
    COMPLETED: filteredCards.filter((card) => card.status === "COMPLETED"),
  };

  return (
    <Container fluid>
      <Row>
        <TopBar />
      </Row>
      <Row xs="auto">
        <Col
          lg={8}
          className="d-flex flex-column flex-lg-row align-items-center justify-content-between"
        >
          <div className="d-flex flex-row align-items-center mb-2 mb-lg-0">
            <p
              className="fw-semibold mt-3 me-2"
              style={{ fontSize: "12px", color: "#000000", opacity: "60%" }}
            >
              Filter by:
            </p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex">
                <select
                  style={{ width: "120px", height: "30px" }}
                  className="me-2"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option>Work</option>
                  <option>Personal</option>
                  <option>Urgent</option>
                </select>
                <select
                  style={{ width: "90px", height: "30px" }}
                  className="me-2"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        </Col>
        <Col
          lg={4}
          className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-between mt-2 mt-lg-0"
        >
          <button
            style={{
              height: "42px",
              width: "100px",
              backgroundColor: "#7B1984",
              borderRadius: "20px",
              border: "none",
              color: "white",
            }}
            className="mb-2 mb-lg-0"
            onClick={handleShow}
          >
            Add Task
          </button>
          <input
            className="ps-3"
            placeholder="search"
            style={{
              height: "42px",
              width: "200px",
              borderRadius: "20px",
              border: "1px solid black",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        {["TO-DO", "IN-PROGRESS", "COMPLETED"].map((status) => (
          <Col key={status} lg={3}>
            <div className="card" style={{ backgroundColor: "#F1F1F1" }}>
              <div className="card-header">
                <p
                  className={`badge ${
                    status === "TO-DO"
                      ? "bg-warning"
                      : status === "COMPLETED"
                      ? "bg-success"
                      : "bg-primary"
                  }`}
                >
                  {status}
                </p>
              </div>
              <div>
                {groupedCards[
                  status as "TO-DO" | "IN-PROGRESS" | "COMPLETED"
                ].map((card) => (
                  <div key={card._id} className="pb-1 m-3 task-list">
                    <div className="card">
                      <CardBody
                        className="d-flex flex-column justify-content-between"
                        style={{ height: "100%" }}
                      >
                        <div className="d-flex flex-row justify-content-between align-items-center">
                          <p>{card.task_name}</p>
                          <UncontrolledDropdown className="float-end">
                            <DropdownToggle
                              className="arrow-none"
                              color="white"
                            >
                              <BsThreeDots />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                              <DropdownItem
                                onClick={() => handleEditShow(card)}
                              >
                                Edit
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => handleDelete(card._id)}
                              >
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                          <p className="text-muted">{card.category}</p>
                          <p className="text-muted">
                            {new Date(card?.due_date).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </CardBody>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <CreateTask
        show={show}
        handleClose={handleClose}
        type="CREATE"
        fetch={fetchData}
      />
      <EditTask
        show={editShow}
        handleClose={handleEditClose}
        type="EDIT"
        fetch={fetchData}
        editTask={editTask}
      />
    </Container>
  );
};

export default Board;
