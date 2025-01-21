import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import CreateTask from "../Component/CreateTask";
import TopBar from "../Component/TopBar";

import axios from "axios";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { BsThreeDots } from "react-icons/bs";
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

const List = () => {
  const [show, setShow] = useState<boolean>(false);
  const [editShow, setEditShow] = useState<boolean>(false);

  const [todoData, setToDData] = useState<any[]>([]);
  const [mobileView, setMobileView] = useState<boolean>(
    window.innerWidth <= 768
  );
  const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({
    TODO: true,
    "IN-PROGRESS": true,
    COMPLETED: true,
  });

  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [sortBy, setSortBy] = useState<string>("dueDate");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

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
  const handleShow = () => {
    setShow(true);
  };

  const handleEditClose = () => setEditShow(false);
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

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSection = (section: string) => {
    setIsExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSortChange = (field: string, order: string) => {
    setSortOrder(order);
    setSortBy(field);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleCategoryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategoryFilter(e.target.value);
  };

  const renderTasks = (status: string) => {
    const filteredTasks = todoData.filter((task: Task) => {
      const isStatusMatch = task.status === status;
      const isSearchMatch = task.task_name.toLowerCase().includes(searchTerm);
      const isCategoryMatch = task.category.includes(categoryFilter);
      return isStatusMatch && isSearchMatch && isCategoryMatch;
    });

    const sortedTasks = filteredTasks.sort((a, b) => {
      const fieldA =
        sortBy === "due_date" ? new Date(a.due_date) : a[sortBy as keyof Task];
      const fieldB =
        sortBy === "due_date" ? new Date(b.due_date) : b[sortBy as keyof Task];
      return sortOrder === "asc"
        ? fieldA > fieldB
          ? 1
          : -1
        : fieldA < fieldB
        ? 1
        : -1;
    });

    return (
      <tbody>
        {sortedTasks.map((task) => {
          const { task_name, due_date, status, category, _id } = task;
          const formattedDueDate = new Date(due_date).toLocaleDateString(
            "en-US",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }
          );

          return (
            <tr key={_id}>
              {task.status === "COMPLETED" ? (
                <td
                  className="p-2 "
                  style={{ textDecoration: "line-through" }}
                >
                  {task_name}
                </td>
              ) : (
                <td className="p-2">{task_name}</td>
              )}
              {!mobileView && (
                <>
                  <td className="p-2">{formattedDueDate}</td>
                  <td className="p-2">{status}</td>
                  <td className="p-2">{category}</td>
                  <td className="p-2">
                    <UncontrolledDropdown className="float-end">
                      <DropdownToggle className="arrow-none" color="white">
                        <BsThreeDots />
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem onClick={() => handleEditShow(task)}>
                          Edit
                        </DropdownItem>
                        <DropdownItem onClick={() => handleDelete(_id)}>
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    );
  };

  const tableSection = () => (
    <div className="table-responsive">
      <table className="table" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Task Name</th>
            {!mobileView && (
              <>
                <th
                  onClick={() =>
                    handleSortChange(
                      "due_date",
                      sortOrder === "asc" ? "desc" : "asc"
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  Due Date
                  <span className="ml-0" style={{ float: "right" }}>
                    {sortOrder === "asc" ? (
                      <IoIosArrowDropupCircle />
                    ) : (
                      <IoIosArrowDropdownCircle />
                    )}
                  </span>
                </th>
                <th>Status</th>
                <th>Category</th>
                <th>Actions</th>
              </>
            )}
          </tr>
        </thead>

        <tr>
          <td
            colSpan={mobileView ? 1 : 5}
            className="card-header"
            style={{
              backgroundColor: "#FAC3FF",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "10px",
              padding: "5px",
            }}
            onClick={() => toggleSection("TODO")}
          >
            {`TO-DO `}
            <span style={{ float: "right" }}>
              {isExpanded.TODO ? (
                <IoIosArrowDropupCircle />
              ) : (
                <IoIosArrowDropdownCircle />
              )}
            </span>
          </td>
        </tr>
        {isExpanded.TODO && renderTasks("TO-DO")}

        <tr>
          <td
            colSpan={mobileView ? 1 : 5}
            style={{
              backgroundColor: "#85D9F1",
              fontWeight: "bold",
              cursor: "pointer",
              padding: "5px",
              borderRadius: "10px",
            }}
            onClick={() => toggleSection("IN-PROGRESS")}
          >
            IN-PROGRESS{" "}
            <span style={{ float: "right" }}>
              {isExpanded["IN-PROGRESS"] ? (
                <IoIosArrowDropupCircle />
              ) : (
                <IoIosArrowDropdownCircle />
              )}
            </span>
          </td>
        </tr>
        {isExpanded["IN-PROGRESS"] && renderTasks("IN-PROGRESS")}

        <tr>
          <td
            colSpan={mobileView ? 1 : 5}
            className="card-header"
            style={{
              backgroundColor: "#CEFFCC",
              fontWeight: "bold",
              cursor: "pointer",
              padding: "5px",
              borderRadius: "10px",
              marginTop: "50px",
            }}
            onClick={() => toggleSection("COMPLETED")}
          >
            COMPLETED{" "}
            <span style={{ float: "right" }}>
              {isExpanded.COMPLETED ? (
                <IoIosArrowDropupCircle />
              ) : (
                <IoIosArrowDropdownCircle />
              )}
            </span>
          </td>
        </tr>
        {isExpanded.COMPLETED && renderTasks("COMPLETED")}
      </table>
    </div>
  );
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
                  onChange={handleCategoryFilterChange}
                >
                  <option value="">All Categories</option>
                  <option>Work</option>
                  <option>Personal</option>
                </select>
              </div>
            </div>
          </div>
        </Col>
        <Col
          lg={4}
          className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-between mt-2 mt-lg-0"
        >
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control mb-3 ps-3"
            style={{
              height: "42px",
              width: "200px",
              borderRadius: "20px",
              border: "1px solid black",
            }}
          />
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
        </Col>
      </Row>
      <Row className="mt-2">{tableSection()}</Row>
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

export default List;
