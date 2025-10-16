// src/pages/JobsBoard.js
import { useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import Confirm from "../components/Confirm";
import { useJobs } from "../hooks/useJobs";

export default function JobsBoard({ isAdmin, user }) {
  const { jobs, addJob, updateJob, removeJob, filter, setFilter, search, setSearch } = useJobs();
  const [showAdd, setShowAdd] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [confirmDel, setConfirmDel] = useState({ show: false, job: null });

  const handleSaveNew = (form) => {
    addJob(form, user);           // log creator
    setShowAdd(false);
  };
  const handleSaveEdit = (form) => {
    if (!isAdmin) return;
    updateJob(editJob.id, form, user); // log editor
    setEditJob(null);
  };

  return (
    <Container className="py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0">Jobs</h5>
        {isAdmin && <Button onClick={() => setShowAdd(true)}>Add Job</Button>}
      </div>

      <Row className="g-2 mb-3">
        <Col xs={6}>
          <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="lead">Lead</option>
            <option value="quoted">Quoted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="paid">Paid</option>
          </Form.Select>
        </Col>
        <Col xs={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search title, client, trade"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setSearch("")}>Clear</Button>
          </InputGroup>
        </Col>
      </Row>

      <Row xs={1} className="g-3">
        {jobs.map((job) => (
          <Col key={job.id}>
            <JobCard
              job={job}
              onEdit={isAdmin ? (j) => setEditJob(j) : undefined}
              onDelete={isAdmin ? (j) => setConfirmDel({ show: true, job: j }) : undefined}
            />
          </Col>
        ))}
        {!jobs.length && (
          <Col className="text-center text-muted py-5">No jobs yet.{isAdmin ? " Add your first job." : ""}</Col>
        )}
      </Row>

      {/* Add */}
      {isAdmin && (
        <JobForm show={showAdd} onClose={() => setShowAdd(false)} onSave={handleSaveNew} />
      )}

      {/* Edit */}
      {isAdmin && editJob && (
        <JobForm
          show={true}
          initial={editJob}
          onClose={() => setEditJob(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete confirm */}
      <Confirm
        show={confirmDel.show}
        title="Delete Job?"
        body={`This will permanently remove "${confirmDel.job?.title}".`}
        onClose={() => setConfirmDel({ show: false, job: null })}
        onConfirm={() => {
          if (confirmDel.job) removeJob(confirmDel.job.id, user); // pass actor
          setConfirmDel({ show: false, job: null });
        }}
      />
    </Container>
  );
}
