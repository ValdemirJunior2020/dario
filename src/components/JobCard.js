import { Card, Dropdown, ButtonGroup } from "react-bootstrap";
import { currency } from "../utils/format";
import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";

export default function JobCard({ job, onEdit, onDelete }) {
  const nav = useNavigate();
  const open = () => nav(`/job/${job.id}`);

  return (
    <Card className="shadow-sm" style={{ cursor: "pointer" }}>
      <Card.Body onClick={open}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="h6 mb-1">{job.title}</Card.Title>
            <div className="small text-muted">{job.client}</div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <StatusBadge status={job.status} />
            {(onEdit || onDelete) && (
              <Dropdown as={ButtonGroup} onClick={(e) => e.stopPropagation()}>
                <Dropdown.Toggle size="sm" variant="outline-secondary">⋮</Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  {onEdit && <Dropdown.Item onClick={() => onEdit(job)}>Edit</Dropdown.Item>}
                  {onDelete && (
                    <Dropdown.Item className="text-danger" onClick={() => onDelete(job)}>
                      Delete
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>

        <div className="d-flex gap-3 mt-3 small">
          <div>
            <div className="text-muted">Trade</div>
            <div className="fw-semibold text-capitalize">{job.trade}</div>
          </div>
          <div>
            <div className="text-muted">Bid</div>
            <div className="fw-semibold">{currency(job?.estimate?.totalBidToClient || 0)}</div>
          </div>
          <div>
            <div className="text-muted">Profit</div>
            <div className={`fw-semibold ${job.profit >= 0 ? "text-success" : "text-danger"}`}>
              {currency(job.profit)}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
