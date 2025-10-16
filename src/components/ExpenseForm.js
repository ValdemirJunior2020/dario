import { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const empty = { type:"materials", vendor:"", amount:0, date:"", note:"" };

export default function ExpenseForm({ show, onClose, onSave }) {
  const [form, setForm] = useState(empty);
  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, amount: Number(form.amount || 0) });
    setForm(empty);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={submit}>
        <Modal.Header closeButton><Modal.Title className="h6">Add Expense</Modal.Title></Modal.Header>
        <Modal.Body>
          <Row className="g-2">
            <Col xs={6}>
              <Form.Label>Type</Form.Label>
              <Form.Select value={form.type} onChange={e=>set("type", e.target.value)}>
                <option>materials</option><option>labor</option><option>rentals</option>
                <option>subs</option><option>misc</option>
              </Form.Select>
            </Col>
            <Col xs={6}>
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" min="0" step="0.01"
                value={form.amount} onChange={e=>set("amount", e.target.value)} required />
            </Col>
            <Col xs={6}>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={form.date} onChange={e=>set("date", e.target.value)} />
            </Col>
            <Col xs={6}>
              <Form.Label>Vendor</Form.Label>
              <Form.Control placeholder="Sherwin-Williams" value={form.vendor} onChange={e=>set("vendor", e.target.value)} />
            </Col>
            <Col xs={12}>
              <Form.Label>Note</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.note} onChange={e=>set("note", e.target.value)} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Expense</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
