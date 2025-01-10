import axios from "axios";
import { useState } from "react";
import { Col, Row, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup"; 

interface CreateTaskProps {
  show: boolean;
  type: string;
  handleClose: () => void;
  fetch: () => void;
  editTask: object;
}

const CreateTask: React.FC<CreateTaskProps> = ({
  show,
  handleClose,
  type,
  fetch,
  editTask,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("USER");
  const parsedToken = JSON.parse(token);
  const user_id = parsedToken?.userIsExist?._id;

  const initialValues = {
    task_name: type === "EDIT" && editTask ? editTask.task_name : "",
    description: type === "EDIT" && editTask ? editTask.description : "",
    due_date:
      type === "EDIT" && editTask
        ? new Date(editTask?.due_date).toISOString().slice(0, 10)
        : "",
    status: type === "EDIT" && editTask ? editTask.status : "TO-DO",
    category: type === "EDIT" && editTask ? editTask.category : "",
    createdBy: user_id,
    attachment: null,
  };

  const validationSchema = Yup.object({
    task_name: Yup.string().required("Task title is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    due_date: Yup.date().required("Due date is required"),
    status: Yup.string().required("Status is required"),
  });

  const handleFileChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (target.files && target.files[0]) {
    }
  };
console.log(editTask?._id)
  const handleSubmit = async (values: any) => {
    try {
      const res = await axios.post("https://thealterofficebackend.onrender.com/todo/add", values, {
        headers: {
          Authorization: parsedToken.token,
        },
      });

      if (res.status === 201) {
        handleClose();
        fetch();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = async (values: any) => {
    try {
      const res = await axios.put(`https://thealterofficebackend.onrender.com/todo/edit/${editTask?._id}`, values, {
        headers: {
          Authorization: parsedToken.token,
        },
      });

      if (res.status === 200) {
        handleClose();
        fetch();
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Modal show={show} onHide={handleClose} centered size="xl">
      <Modal.Header
        className="card-header d-flex justify-content-between align-items-center"
        closeButton
      >
        <Modal.Title style={{ fontSize: "24px", fontWeight: "semi-bold" }}>
          {type}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="d-flex flex-row align-items-stretch">
          <Col lg={8} className="d-flex flex-column">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={type === "EDIT" ? handleEdit : handleSubmit}
              >
              {({ setFieldValue, values, errors, touched }) => (
                <Form >
                  {/* Task Title */}
                  <Field
                    name="task_name"
                    placeholder="Task Title"
                    required
                    style={{
                      fontSize: "14px",
                      fontWeight: "semi-bold",
                      width: "100%",
                      backgroundColor: "#f9f9f9",
                      color: "#555",
                      padding: "10px",
                      paddingLeft: "20px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <ErrorMessage
                    name="task_name"
                    component="div"
                    style={{ color: "red" }}
                  />

                  {/* Description */}
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Description"
                    required
                    style={{
                      width: "100%",
                      height: "130px",
                      marginTop: "20px",
                      backgroundColor: "#f9f9f9",
                      color: "#555",
                      border: "1px solid #ccc",
                      paddingLeft: "10px",
                    }}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    style={{ color: "red" }}
                  />

                  {/* Category Buttons */}
                  <div className="d-flex flex-column flex-sm-row justify-content-sm-between mt-3">
                    <div className="mt-2">
                      <p
                        className="m-0 fw-semibold"
                        style={{ fontSize: "12px", opacity: "60%" }}
                      >
                        Task Category*
                      </p>
                      <div className="m-0 d-flex flex-row">
                        <button
                          type="button"
                          onClick={() => setFieldValue("category", "Work")}
                          style={{
                            width: "80px",
                            height: "30px",
                            marginTop: "5px",
                            border: "none",
                            borderRadius: "20px",
                            marginRight: "10px",
                            backgroundColor:
                              values.category === "Work"
                                ? "#7B1984"
                                : "#f9f9f9",
                            color:
                              values.category === "Work" ? "white" : "#555",
                          }}
                        >
                          Work
                        </button>
                        <button
                          type="button"
                          onClick={() => setFieldValue("category", "Personal")}
                          style={{
                            width: "80px",
                            height: "30px",
                            marginTop: "5px",
                            border: "none",
                            borderRadius: "20px",
                            backgroundColor:
                              values.category === "Personal"
                                ? "#7B1984"
                                : "#f9f9f9",
                            color:
                              values.category === "Personal" ? "white" : "#555",
                          }}
                        >
                          Personal
                        </button>
                      </div>
                      <ErrorMessage
                        name="category"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>

                    {/* Due Date */}
                    <div className="mt-2">
                      <p
                        className="m-0 fw-semibold"
                        style={{ fontSize: "12px", opacity: "60%" }}
                      >
                        Due on*
                      </p>
                      <Field
                        type="date"
                        name="due_date"
                        required
                        style={{
                          width: "200px",
                          height: "32px",
                          marginTop: "5px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          marginRight: "10px",
                          backgroundColor: "#f9f9f9",
                          color: "#555",
                          paddingLeft: "10px",
                        }}
                      />
                      <ErrorMessage
                        name="due_date"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>

                    {/* Status */}
                    <div className="mt-2">
                      <p
                        className="m-0 fw-semibold"
                        style={{ fontSize: "12px", opacity: "60%" }}
                      >
                        Task Status*
                      </p>
                      <Field
                        as="select"
                        name="status"
                        required
                        style={{
                          width: "200px",
                          height: "32px",
                          marginTop: "5px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          marginRight: "10px",
                          backgroundColor: "#f9f9f9",
                          color: "#555",
                          paddingLeft: "10px",
                        }}
                      >
                        <option value="TO-DO">ToDO</option>
                        <option value="IN-PROGRESS">In-Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </Field>
                      <ErrorMessage
                        name="status"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  </div>

                  {/* Attachment */}
                  <div className="mt-3">
                    <p
                      className="m-0 fw-semibold mb-2"
                      style={{ fontSize: "12px", opacity: "60%" }}
                    >
                      Attachment
                    </p>
                    <div style={{ width: "100%" }}>
                      <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        name="attachment"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="fileInput"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "40px",
                          lineHeight: "40px",
                          textAlign: "center",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          cursor: "pointer",
                          backgroundColor: "#f9f9f9",
                          color: "#555",
                        }}
                      >
                        {"Drop your files here or Update"}
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 d-flex justify-content-end">
                    <button
                      className="fw-semibold"
                      style={{
                        fontSize: "14px",
                        borderRadius: "20px",
                        height: "40px",
                        width: "100px",
                        border: "none",
                        marginRight: "20px",
                      }}
                      onClick={handleClose}
                    >
                      Close
                    </button>
                    <button
                      className="fw-semibold"
                      style={{
                        fontSize: "14px",
                        borderRadius: "20px",
                        height: "40px",
                        width: "120px",
                        border: "none",
                        backgroundColor: "#7B1984",
                        color: "white",
                      }}
                      type="submit"
                    >
                      {type === "EDIT" ? "Edit" : "Save"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
          {type === "EDIT" && (
            <Col lg={4}>
              <div className="card h-100">
                <div className="card-header">Activity</div>
                <div
                  className="card-body d-flex flex-row justify-content-between"
                  style={{ backgroundColor: "#F1F1F1" }}
                >
                  <p style={{ fontSize: "10px", color: "#1E212A" }}>
                    {` You created this task `}
                  </p>
                  <p style={{ fontSize: "10px" }}>{editTask?.createdAt} </p>
                </div>
                {editTask?.updatedAt && (
                  <div
                    className="card-body d-flex flex-row justify-content-between"
                    style={{ backgroundColor: "#F1F1F1" }}
                  >
                    <p style={{ fontSize: "10px", color: "#1E212A" }}>
                      {` You Update this task `}
                    </p>
                    <p style={{ fontSize: "10px" }}>{editTask?.updatedAt} </p>
                  </div>
                )}
              </div>
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTask;
