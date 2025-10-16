// src/pages/JobDetail.js
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Row, Col, Card, Table, Badge, Dropdown, ButtonGroup } from "react-bootstrap";
import { useJobs } from "../hooks/useJobs";
import { currency, fmtDateTime } from "../utils/format";
import ExpenseForm from "../components/ExpenseForm";
import JobForm from "../components/JobForm";
import Confirm from "../components/Confirm";
import StatusBadge from "../components/StatusBadge";

export default function JobDetail({ isAdmin, user }) {
  const { id } = useParams();
  const nav = useNavigate();
  const { allJobs, setStatus, addExpense, deleteExpense, updateJob, removeJob } = useJobs();

  const job = useMemo(() => allJobs.find((j) => j.id === id), [allJobs, id]);
  const [showExpense, setShowExpense] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  if (!job) {
    return (
      <Container className="py-3">
        <Button variant="link" onClick={() => nav(-1)}>&larr; Back</Button>
        <div className="text-danger">Job not found.</div>
      </Container>
    );
  }

  // Admin-only actions
  const approve  = () => isAdmin && setStatus(job.id, "approved", "", user);
  const reject   = () => {
    if (!isAdmin) return;
    const r = prompt("Reason for rejection? (optional)") || "";
    setStatus(job.id, "rejected", r, user);
  };
  const start    = () => isAdmin && setStatus(job.id, "in_progress", "", user);
  const complete = () => isAdmin && setStatus(job.id, "completed", "", user);
  const paid     = () => isAdmin && setStatus(job.id, "paid", "", user);

  return (
    <Container className="py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Button variant="link" onClick={() => nav(-1)}>&larr; Back</Button>
        <div className="d-flex gap-2">
          {isAdmin && <Button variant="outline-secondary" onClick={() => setShowEdit(true)}>Edit</Button>}
          {isAdmin && <Button variant="outline-danger" onClick={() => setConfirmDel(true)}>Delete</Button>}
        </div>
      </div>

      <Card className="shadow-sm mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mb-1">{job.title}</h5>
              <div className="small text-muted">
                {job.client} • <span className="text-capitalize">{job.trade}</span>
              </div>
            </div>
            <StatusBadge status={job.status} />
          </div>

          <Row className="mt-3 g-3 small">
            <Col>
              <div className="text-muted">Bid to Client</div>
              <div className="fw-semibold">{currency(job.estimate.totalBidToClient)}</div>
            </Col>
            <Col>
              <div className="text-muted">Expenses</div>
              <div className="fw-semibold">{currency(job.expSum)}</div>
            </Col>
            <Col>
              <div className="text-muted">Profit</div>
              <div className={`fw-semibold ${job.profit >= 0 ? "text-success" : "text-danger"}`}>
                {currency(job.profit)}
              </div>
            </Col>
            <Col>
              <div className="text-muted">Margin</div>
              <div className="fw-semibold">{job.marginPct.toFixed(1)}%</div>
            </Col>
          </Row>

          <div className="mt-3 d-flex gap-2 flex-wrap">
            <Button size="sm" onClick={approve} disabled={!isAdmin || job.status === "approved"}>Approve</Button>
            <Button size="sm" variant="outline-danger" onClick={reject} disabled={!isAdmin || job.status === "rejected"}>Reject</Button>
            <Button size="sm" variant="secondary" onClick={start} disabled={!isAdmin || job.status === "in_progress"}>Start</Button>
            <Button size="sm" variant="success" onClick={complete} disabled={!isAdmin || job.status === "completed"}>Complete</Button>
            <Button size="sm" variant="primary" onClick={paid} disabled={!isAdmin || job.status === "paid"}>Mark Paid</Button>

            <Dropdown as={ButtonGroup} size="sm">
              <Button onClick={() => isAdmin && setShowExpense(true)} disabled={!isAdmin}>Add Expense</Button>
              <Dropdown.Toggle split disabled={!isAdmin} />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShowExpense(true)}>Add Expense</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-3">
        <Card.Body>
          <h6 className="mb-2">Estimate</h6>
          <Row xs={2} className="g-2 small">
            {["materials","labor","rentals","subs","misc","totalBidToClient"].map((key) => (
              <Col key={key}>
                <div className="text-muted text-capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                <div className="fw-semibold">{currency(job.estimate[key])}</div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Expenses</h6>
            <Badge bg="secondary">{(job.expenses || []).length}</Badge>
          </div>
          <Table hover responsive size="sm" className="mb-0">
            <thead>
              <tr>
                <th>Date</th><th>Type</th><th>Vendor</th><th>Note</th>
                <th className="text-end">Amount</th><th></th>
              </tr>
            </thead>
            <tbody>
              {(job.expenses || []).map((e) => (
                <tr key={e.id}>
                  <td>{e.date || "-"}</td>
                  <td className="text-capitalize">{e.type}</td>
                  <td>{e.vendor || "-"}</td>
                  <td className="text-truncate" style={{ maxWidth: 180 }}>{e.note || "-"}</td>
                  <td className="text-end">{currency(e.amount)}</td>
                  <td className="text-end">
                    {isAdmin && (
                      <Button size="sm" variant="outline-danger" onClick={() => deleteExpense(job.id, e.id, user)}>
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {(!job.expenses || !job.expenses.length) && (
                <tr><td colSpan="6" className="text-muted text-center py-3">No expenses yet.</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Activity / History */}
      <Card className="shadow-sm">
        <Card.Body>
          <h6 className="mb-2">Activity</h6>
          <Table responsive size="sm" className="mb-0">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {(job.history || []).map((h) => (
                <tr key={h.id}>
                  <td>{fmtDateTime(h.ts)}</td>
                  <td>{h.actor?.displayName || h.actor?.username || "Unknown"}</td>
                  <td>{h.action}</td>
                  <td className="small text-muted">
                    {h.action === "status.change" && <>to <b>{h.to}</b>{h.reasonIfRejected ? ` (reason: ${h.reasonIfRejected})` : ""}</>}
                    {h.action === "expense.add" && <>+ {currency(h.amount)} <span className="text-capitalize">({h.type})</span></>}
                    {h.action === "expense.delete" && <>- {currency(h.amount || 0)} <span className="text-capitalize">({h.type || "-"})</span></>}
                    {h.action === "job.update" && <>fields: {Array.isArray(h.fieldsChanged) ? h.fieldsChanged.join(", ") : "-"}</>}
                    {h.action === "job.create" && <>created “{h.title || job.title}”</>}
                  </td>
                </tr>
              ))}
              {!(job.history || []).length && (
                <tr><td colSpan="4" className="text-muted text-center py-3">No activity yet.</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modals */}
      <ExpenseForm
        show={showExpense}
        onClose={() => setShowExpense(false)}
        onSave={(exp) => { if (isAdmin) { addExpense(job.id, exp, user); } setShowExpense(false); }}
      />
      {isAdmin && (
        <JobForm
          show={showEdit}
          initial={job}
          onClose={() => setShowEdit(false)}
          onSave={(form) => { updateJob(job.id, form, user); setShowEdit(false); }}
        />
      )}
      <Confirm
        show={confirmDel}
        onClose={() => setConfirmDel(false)}
        onConfirm={() => { removeJob(job.id, user); setConfirmDel(false); nav("/"); }}
        title="Delete Job?"
        body="This will permanently remove the job and its expenses."
      />
    </Container>
  );
}
