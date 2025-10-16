import { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const empty = {
  title:"", client:"", trade:"painting", status:"lead",
  estimate:{ materials:0, labor:0, rentals:0, subs:0, misc:0, totalBidToClient:0 },
  schedule:{ start:"", end:"" }, notes:""
};

export default function JobForm({ show, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || empty);

  const set = (path, value) => {
    setForm(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let cur = clone;
      for (let i=0;i<keys.length-1;i++) cur = cur[keys[i]];
      cur[keys[keys.length-1]] = value;
      return clone;
    });
  };

  const submit = (e) => { e.preventDefault(); onSave(form); };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title className="h6">{initial ? "Edit Job" : "Add Job"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control value={form.title} onChange={e=>set("title", e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Client</Form.Label>
            <Form.Control value={form.client} onChange={e=>set("client", e.target.value)} required />
          </Form.Group>

          <Row className="mb-2">
            <Col>
              <Form.Label>Trade</Form.Label>
              <Form.Select value={form.trade} onChange={e=>set("trade", e.target.value)}>
                <option value="painting">Painting</option>
                <option value="stucco">Stucco</option>
                <option value="drywall">Drywall</option>
                <option value="other">Other</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Status</Form.Label>
              <Form.Select value={form.status} onChange={e=>set("status", e.target.value)}>
                <option>lead</option><option>quoted</option><option>approved</option>
                <option>rejected</option><option>in_progress</option>
                <option>completed</option><option>paid</option>
              </Form.Select>
            </Col>
          </Row>

          <div className="small text-muted mt-2 mb-1">Estimate</div>
          <Row xs={2} className="g-2">
            {["materials","labor","rentals","subs","misc"].map(k=>(
              <Col key={k}>
                <Form.Control type="number" min="0" step="0.01" placeholder={k}
                  value={form.estimate[k]} onChange={e=>set(`estimate.${k}`, Number(e.target.value || 0))}/>
              </Col>
            ))}
            <Col xs={12}>
              <Form.Control className="mt-1" type="number" min="0" step="0.01"
                placeholder="Total bid to client"
                value={form.estimate.totalBidToClient}
                onChange={e=>set("estimate.totalBidToClient", Number(e.target.value || 0))}
              />
            </Col>
          </Row>

          <div className="small text-muted mt-3 mb-1">Schedule</div>
          <Row className="g-2">
            <Col><Form.Control type="date" value={form.schedule.start} onChange={e=>set("schedule.start", e.target.value)} /></Col>
            <Col><Form.Control type="date" value={form.schedule.end} onChange={e=>set("schedule.end", e.target.value)} /></Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.notes} onChange={e=>set("notes", e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
