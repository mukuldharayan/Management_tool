import React, { useState, useEffect, forwardRef } from "react";
import { Table, Button, Row, Col, Form, Modal, Pagination} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getProjects, createProject, updateProject, deleteProject, getTasks, createTask, updateTask, deleteTask } from '../../api/api';

interface Project {
  _id?: string;
  title: string;
  description: string;
  status: string;
}

interface Task {
  _id?: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate?: string;
}

const CustomDateInput = forwardRef(({ value, onClick }: any, ref: any) => (
  <div style={{ position: "relative", display: "inline-block", width: 150 }}>
    <input
      type="text"
      onClick={onClick}
      ref={ref}
      value={value || ""}
      readOnly
      placeholder="dd/mm/yy"
      style={{
        width: "100%",
        padding: "6px 32px 6px 10px",
        fontSize: 14,
        borderRadius: 4,
        border: "1px solid #ced4da",
        backgroundColor: "white",
        color: "#212529",
        cursor: "pointer",
        userSelect: "none",
      }}
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      style={{
        position: "absolute",
        right: 8,
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        color: "#495057",
      }}
    >
      <path d="M14 3h-1V1.5a.5.5 0 0 0-1 0V3H4V1.5a.5.5 0 0 0-1 0V3H2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM1 7v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7H1zm3-4h8a1 1 0 0 1 1 1v1H3V4a1 1 0 0 1 1-1z" />
    </svg>
  </div>
));
CustomDateInput.displayName = "CustomDateInput";

const ProjectsDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showProjectForm, setShowProjectForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    status: "active",
  });

  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormData, setTaskFormData] = useState<Task>({
    title: "",
    description: "",
    status: "todo",
    dueDate: undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
const projectsPerPage = 10;

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [showProjectDeleteModal, setShowProjectDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [showTaskDeleteModal, setShowTaskDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showUpdateConfirmModal, setShowUpdateConfirmModal] = useState(false);
  const [pendingFormSubmitEvent, setPendingFormSubmitEvent] = useState<React.FormEvent | null>(null);

  const [showTaskUpdateConfirmModal, setShowTaskUpdateConfirmModal] = useState(false);
  const [pendingTaskSubmitEvent, setPendingTaskSubmitEvent] = useState<React.FormEvent | null>(null);

  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('');


  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data.Projects);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProjectClick = () => {
    setFormData({ title: "", description: "", status: "active" });
    setShowProjectForm(true);
  };

  const handleEditProject = (proj: Project) => {
    setFormData(proj);
    setShowProjectForm(true);
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData._id) {
      setPendingFormSubmitEvent(e);
      setShowUpdateConfirmModal(true);
    } else {
      submitProjectForm();
    }
  };

  const submitProjectForm = async () => {
    try {
      if (formData._id) {
        await updateProject(formData._id, {
          title: formData.title,
          description: formData.description,
          status: formData.status,
        });
      } else {
        await createProject({
          title: formData.title,
          description: formData.description,
          status: formData.status,
        });
      }
      await fetchProjects();
      setFormData({ title: "", description: "", status: "active" });
      setShowProjectForm(false);
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setShowUpdateConfirmModal(false);
      setPendingFormSubmitEvent(null);
    }
  };

  const handleConfirmUpdate = () => {
    submitProjectForm();
  };

  const handleCancelUpdate = () => {
    setShowUpdateConfirmModal(false);
    setPendingFormSubmitEvent(null);
  };

  const fetchTasks = async (projectId: string, statusFilter: string = '') => {
    setTasksLoading(true);
    try {
      const response = await getTasks(projectId, statusFilter);
      setTasks(response.data.Task || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };
  
  

  const handleProjectClick = (projectId: string) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
      setTasks([]);
    } else {
      setExpandedProjectId(projectId);
      fetchTasks(projectId);
    }
  };

  const handleDeleteProjectClick = (proj: Project) => {
    setProjectToDelete(proj);
    setShowProjectDeleteModal(true);
  };
  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete?._id) return;
    try {
      await deleteProject(projectToDelete._id);
      await fetchProjects();
      if (expandedProjectId === projectToDelete._id) {
        setExpandedProjectId(null);
        setTasks([]);
      }
      setShowProjectDeleteModal(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTaskId) {
      setPendingTaskSubmitEvent(e);
      setShowTaskUpdateConfirmModal(true);
    } else {
      submitTaskForm();
    }
  };

  const submitTaskForm = async () => {
    try {
      if (editingTaskId) {
        await updateTask(editingTaskId, {
          ...taskFormData,
          dueDate: taskFormData.dueDate
            ? new Date(taskFormData.dueDate).toISOString()
            : undefined,
        });
      } else if (expandedProjectId) {
        await createTask(expandedProjectId, {
          ...taskFormData,
          dueDate: taskFormData.dueDate
            ? new Date(taskFormData.dueDate).toISOString()
            : undefined,
        });
      }
      setShowTaskForm(false);
      setTaskFormData({
        title: "",
        description: "",
        status: "todo",
        dueDate: undefined,
      });
      setEditingTaskId(null);
      if (expandedProjectId) {
        fetchTasks(expandedProjectId);
      }
    } catch (error) {
      console.error("Failed to save task", error);
    } finally {
      setShowTaskUpdateConfirmModal(false);
      setPendingTaskSubmitEvent(null);
    }
  };

  const handleDeleteTaskClick = (task: Task) => {
    setTaskToDelete(task);
    setShowTaskDeleteModal(true);
  };
  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete?._id) return;
    try {
      await deleteTask(taskToDelete._id);
      if (expandedProjectId) {
        fetchTasks(expandedProjectId);
      }
      setShowTaskDeleteModal(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    window.location.href = "/login";
  };
  const indexOfLastProject = currentPage * projectsPerPage;
const indexOfFirstProject = indexOfLastProject - projectsPerPage;
const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

const totalPages = Math.ceil(projects.length / projectsPerPage);

const paginate = (pageNumber: number) => {
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    setCurrentPage(pageNumber);
  }
};

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          backgroundColor: "#1d2127",
          color: "#fff",
          padding: 25,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4 className="mb-4">Menu</h4>
        <div
          style={{ padding: 8, borderRadius: 4, cursor: "pointer" }}
          onClick={() => {
            setExpandedProjectId(null);
            setTasks([]);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Projects
        </div>
        <div
          style={{
            color: "red",
            cursor: "pointer",
            padding: 8,
            borderRadius: 4,
            userSelect: "none",
            marginTop: 12,
          }}
          onClick={handleLogoutClick}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7a1f1f")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Logout
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flexGrow: 1,
          padding: "40px",
          backgroundColor: "#f8f9fa",
          overflowX: "auto",
          maxWidth: "calc(100% - 220px)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold display-6">Project's Dashboard</h1>
          <Button variant="success" onClick={handleAddProjectClick}>
            + Add Project
          </Button>
        </div>

        {/* Add/Edit Project Form */}
        {showProjectForm && (
          <Form
            onSubmit={handleProjectSubmit}
            className="mb-4 border p-4 rounded bg-white shadow-sm"
            style={{ maxWidth: "100%" }}
          >
            <Row className="g-3">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Project Name"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </Col>
              <Col md={2}>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Col>
              <Col xs="auto">
                <Button type="submit" variant="primary">
                  {formData._id ? "Update" : "Save"}
                </Button>
              </Col>
              <Col xs="auto">
                <Button variant="secondary" onClick={() => setShowProjectForm(false)}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        )}

        {/* Projects Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table
            bordered
            hover
            responsive
            className="shadow-sm bg-white rounded w-100"
            style={{ minWidth: "1250px" }}
          >
            <thead className="table-dark">
              <tr>
                <th className="py-3">S.No</th>
                <th className="py-3">Project Name</th>
                <th className="py-3">Description</th>
                <th className="py-3">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
  {currentProjects.length > 0 ? (
    currentProjects.map((proj, index) => (
      <React.Fragment key={proj._id || index}>
        <tr
          style={{ cursor: "pointer" }}
          onClick={() => handleProjectClick(proj._id!)}
        >
          <td>{indexOfFirstProject + index + 1}</td> 
          <td>{proj.title}</td>
          <td>{proj.description}</td>
          <td style={{ color: "black" }}>{proj.status}</td>

                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleEditProject(proj);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleDeleteProjectClick(proj);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>

                    {expandedProjectId === proj._id && (
                      <tr>
                        <td colSpan={5}>
                          <div
                            style={{
                              padding: "10px",
                              backgroundColor: "#f9f9f9",
                              borderRadius: "5px",
                            }}
                          >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>Tasks</h5>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Form.Select
                            size="sm"
                            value={taskStatusFilter}
                            onChange={(e) => {
                              const selectedStatus = e.target.value;
                              setTaskStatusFilter(selectedStatus);
                              if (expandedProjectId) {
                                fetchTasks(expandedProjectId, selectedStatus);
                              }
                            }}
                            style={{ width: '160px' }}
                          >
                            <option value="">All Status</option>
                            <option value="todo">Todo</option>
                            <option value="in-progress">In-Progress</option>
                            <option value="done">Done</option>
                          </Form.Select>
                          <Button
                            size="sm"
                            onClick={() => {
                              setShowTaskForm(true);
                              setTaskFormData({
                                title: "",
                                description: "",
                                status: "todo",
                                dueDate: undefined,
                              });
                              setEditingTaskId(null);
                            }}
                          >
                            + Add Task
                          </Button>
                        </div>
                      </div>


                            {tasksLoading ? (
                              <p>Loading tasks...</p>
                            ) : (
                              <Table bordered size="sm">
                                <thead>
                                  <tr>
                                    <th>S.No</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {tasks.length === 0 ? (
                                    <tr>
                                      <td colSpan={6} className="text-center">
                                        No tasks found.
                                      </td>
                                    </tr>
                                  ) : (
                                    tasks.map((task, idx) => (
                                      <tr key={task._id}>
                                        <td>{idx + 1}</td>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td style={{ color: "black" }}>{task.status}</td>
                                        <td>
                                          {task.dueDate
                                            ? new Date(task.dueDate).toLocaleDateString("en-GB")
                                            : "-"}
                                        </td>
                                        <td>
                                          <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="me-2"
                                            onClick={() => {
                                              setTaskFormData({
                                                ...task,
                                                dueDate: task.dueDate ? task.dueDate : undefined,
                                              });
                                              setEditingTaskId(task._id || null);
                                              setShowTaskForm(true);
                                            }}
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => handleDeleteTaskClick(task)}
                                          >
                                            Delete
                                          </Button>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </Table>
                            )}
                            

                            {/* Task Add/Edit Form Modal */}
                            <Modal show={showTaskForm} onHide={() => setShowTaskForm(false)}>
                              <Modal.Header closeButton>
                                <Modal.Title>{editingTaskId ? "Edit Task" : "Add Task"}</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form onSubmit={handleTaskSubmit}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={taskFormData.title}
                                      onChange={(e) =>
                                        setTaskFormData({
                                          ...taskFormData,
                                          title: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={taskFormData.description}
                                      onChange={(e) =>
                                        setTaskFormData({
                                          ...taskFormData,
                                          description: e.target.value,
                                        })
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                      value={taskFormData.status}
                                      onChange={(e) =>
                                        setTaskFormData({
                                          ...taskFormData,
                                          status: e.target.value as "todo" | "in-progress" | "done",
                                        })
                                      }
                                    >
                                      <option value="todo">Todo</option>
                                      <option value="in-progress">In-Progress</option>
                                      <option value="done">Done</option>
                                    </Form.Select>
                                  </Form.Group>
                                  <Form.Group className="mb-4">
                                    <Form.Label>Due Date</Form.Label>
                                    <br />
                                    <DatePicker
                                      selected={
                                        taskFormData.dueDate
                                          ? new Date(taskFormData.dueDate)
                                          : null
                                      }
                                      onChange={(date) =>
                                        setTaskFormData({
                                          ...taskFormData,
                                          dueDate: date ? date.toISOString() : undefined,
                                        })
                                      }
                                      dateFormat="dd/MM/yy"
                                      customInput={<CustomDateInput />}
                                      placeholderText="dd/mm/yy"
                                      isClearable
                                    />
                                  </Form.Group>
                                  <Button type="submit" variant="primary" className="me-2">
                                    {editingTaskId ? "Update" : "Add"}
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    onClick={() => {
                                      setShowTaskForm(false);
                                      setEditingTaskId(null);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Form>
                              </Modal.Body>
                            </Modal>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
        
        <div className="d-flex justify-content-center p-3">
    <Pagination>
      <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />

      {Array.from({ length: totalPages }, (_, i) => (
        <Pagination.Item
          key={i + 1}
          active={i + 1 === currentPage}
          onClick={() => paginate(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}

      <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  </div>

        {/* Confirm modals for project delete */}
        <Modal show={showProjectDeleteModal} onHide={() => setShowProjectDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete project{" "}
            <strong>{projectToDelete?.title}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProjectDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDeleteProject}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirm modals for task delete */}
        <Modal show={showTaskDeleteModal} onHide={() => setShowTaskDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTaskDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDeleteTask}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirm Update Modal for project */}
        <Modal show={showUpdateConfirmModal} onHide={handleCancelUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Update</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to update this project?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelUpdate}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmUpdate}>
              Yes, Update
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirm Update Modal for task */}
        <Modal
          show={showTaskUpdateConfirmModal}
          onHide={() => setShowTaskUpdateConfirmModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Update</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to update this task?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowTaskUpdateConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={submitTaskForm}>
              Yes, Update
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Logout Confirm Modal */}
        <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to logout?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmLogout}>
              Logout
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ProjectsDashboard;
