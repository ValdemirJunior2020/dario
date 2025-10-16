import { Card, Badge } from "react-bootstrap";
import { currency } from "../utils/format";

const statusColor = {
  lead: "secondary",
  quoted: "warning",
  approved: "primary",
  rejected: "danger",
  in_progress: "info",
  completed: "success",
  paid: "success"
};

export default function JobCard({ job, onClick }) {
  return (
    <Card className="shadow-sm" onClick={onClick} style={{ cursor: "pointer" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="h6 mb-1">{job.title}</Card.Title>
            <div className="small text-muted">{job.client}</div>
          </div>
          <Badge bg={statusColor[job.status] || "secondary"}>{job.status}</Badge>
        </div>

        <div className="d-flex gap-3 mt-3 small">
          <div>
            <div className="text-muted">Trade</div>
            <div className="fw-semibold text-capitalize">{job.trade}</div>
          </div>
          <div>
            <div className="text-muted">Bid</div>
            <div className="fw-semibold">{currency(job.totalBidToClient)}</div>
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
