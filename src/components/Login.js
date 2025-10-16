import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hardcoded users (kept in code, not Firebase)
    const users = {
      junior: { role: "admin", password: "12345678" },
      dario: { role: "viewer", password: "123" },
    };

    const user = users[username.toLowerCase()];
    if (user && user.password === password) {
      onLogin(username, user.role);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <Card style={{ width: "22rem", padding: "1.5rem" }}>
        <h4 className="text-center mb-3">Contractor HQ — Sign In</h4>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              Admin: <strong>junior</strong> | Viewer: <strong>dario</strong>
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
          </Form.Group>

          {error && (
            <div className="alert alert-danger text-center py-1">{error}</div>
          )}

          <Button variant="primary" type="submit" className="w-100 mt-2">
            Sign In
          </Button>
        </Form>
      </Card>
    </div>
  );
}
