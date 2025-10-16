import { Container, Row, Col } from "react-bootstrap";
import JobCard from "../components/JobCard";

// Mock jobs so the app runs immediately.
// We'll replace this with Firestore later.
const jobs = [
  {
    id: "j1",
    title: "Exterior repaint — 1411 16th Ave N",
    client: "Michael",
    trade: "painting",
    status: "approved",
    totalBidToClient: 5200,
    expenses: 1736.42,
    profit: 5200 - 1736.42
  },
  {
    id: "j2",
    title: "Stucco repair — 22 Palm Way",
    client: "Darlene Koch",
    trade: "stucco",
    status: "quoted",
    totalBidToClient: 3400,
    expenses: 0,
    profit: 0
  },
  {
    id: "j3",
    title: "Drywall & texture — Apt 3B",
    client: "Jill M.",
    trade: "drywall",
    status: "in_progress",
    totalBidToClient: 2800,
    expenses: 1100,
    profit: 1700
  }
];

export default function JobsBoard() {
  return (
    <Container className="py-3">
      <h5 className="mb-3">Jobs</h5>
      <Row xs={1} className="g-3">
        {jobs.map((job) => (
          <Col key={job.id}>
            <JobCard job={job} onClick={() => alert(`Open job: ${job.title}`)} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
