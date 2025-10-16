import { Navbar, Container, Button, Badge } from "react-bootstrap";

export default function Topbar({ onLogout, user, isAdmin }) {
  return (
    <Navbar bg="light" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand className="fw-semibold">Contractor HQ</Navbar.Brand>
        <div className="d-flex align-items-center gap-2">
          {user && (
            <>
              <span className="small text-muted">Signed in as</span>
              <Badge bg={isAdmin ? "success" : "secondary"}>
                {user.displayName} • {isAdmin ? "admin" : "viewer"}
              </Badge>
            </>
          )}
          <Button variant="outline-danger" size="sm" onClick={onLogout}>Logout</Button>
        </div>
      </Container>
    </Navbar>
  );
}
