import { Navbar, Container, Button } from "react-bootstrap";

export default function Topbar({ onLogout }) {
  return (
    <Navbar bg="light" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand className="fw-semibold">Contractor HQ</Navbar.Brand>
        <Button variant="outline-danger" size="sm" onClick={onLogout}>
          Logout
        </Button>
      </Container>
    </Navbar>
  );
}
