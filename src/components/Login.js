import { useState } from "react";
import { Form, Button, Card, InputGroup } from "react-bootstrap";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const res = onLogin(username, password); // <-- matches useLocalAuth.login
    if (!res.ok) setError(res.error || "Login failed");
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 p-3 bg-light">
      <Card style={{ maxWidth: 420, width: "100%" }} className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3 text-center">Contractor HQ — Sign In</h5>
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="Enter username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Form.Text className="text-muted">
                Users: <b>junior</b> (admin) or <b>dario</b> (viewer)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPwd((s) => !s)}
                  type="button"
                >
                  {showPwd ? "Hide" : "Show"}
                </Button>
              </InputGroup>
            </Form.Group>

            {error && <div className="text-danger mb-2">{error}</div>}

            <Button type="submit" className="w-100">Sign In</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
