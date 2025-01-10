import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import CreateTask from "../Component/CreateTask";
import TopBar from "../Component/TopBar";
import { dummy } from "../Component/dummyData";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { BsThreeDots } from "react-icons/bs";

interface Task {
  task_name: string;
  due_date: string;
  status: string;
  category: string;
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
  const parsedToken = JSON.parse(token);
  console.log(parsedToken.token);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("https://thealterofficebackend.onrender.com/todo/get", {
        headers: {
          Authorization: parsedToken.token,
        },
      });
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
  const [editTask, setEditTask] = useState<Task | null>(null);

  const handleEditShow = (task: Task) => {
    console.log(task);
    setEditTask(task);
    setEditShow(true);
  };
  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(`https://thealterofficebackend.onrender.com/todo/delete/${taskId}`, {
        headers: {
          Authorization: parsedToken.token,
        },
      });

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
  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const tasksCopy = [...todoData]; 
    const [movedTask] = tasksCopy.splice(source.index, 1); 
    movedTask.status = destination.droppableId; 
    tasksCopy.splice(destination.index, 0, movedTask); 

  
    setTasks(tasksCopy); 
  };

  const renderTasks = (status: string) => {
    const filteredTasks = todoData
      .filter((task: Task) => task.status === status)
      .filter((task: Task) => task.task_name.toLowerCase().includes(searchTerm)) 
      .filter((task: Task) => task.category.includes(categoryFilter));

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
      <Droppable droppableId={status}>
        {(provided) => (
          <tbody {...provided.droppableProps} ref={provided.innerRef}>
            {sortedTasks.map((task, index) => (
              <Draggable
                key={task._id}
                draggableId={task._id.toString()}
                index={index}
              >
                {(provided) => (
                  <tr
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <td className="p-2">{task.task_name}</td>
                    {!mobileView && (
                      <>
                        <td className="p-2">
                          {new Date(task?.due_date).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="p-2">{task.status}</td>
                        <td className="p-2">{task.category}</td>
                        <td className="p-2">
                          <UncontrolledDropdown className="float-end">
                            <DropdownToggle
                              className="arrow-none"
                              color="white"
                            >
                              <BsThreeDots />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                              <DropdownItem
                                onClick={() => handleEditShow(task)}
                              >
                                Edit
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => handleDelete(task._id)}
                              >
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </>
                    )}
                  </tr>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </tbody>
        )}
      </Droppable>
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
                  <span className="ml-0" style={{ float: "right " }}>
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
        <DragDropContext onDragEnd={onDragEnd}>
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
        </DragDropContext>
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
            className="form-control mb-3"
            style={{ width: "200px" }}
          />
          <button
            style={{
              height: "42px",
              width: "150px",
              borderRadius: "8px",
              backgroundColor: "#ECF3FD",
            }}
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
      <CreateTask
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
