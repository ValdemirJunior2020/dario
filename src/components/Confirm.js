// src/components/Confirm.js
import { Modal, Button } from "react-bootstrap";

export default function Confirm({ show, onClose, onConfirm, title="Confirm", body="Are you sure?" }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton><Modal.Title className="h6">{title}</Modal.Title></Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Yes</Button>
      </Modal.Footer>
    </Modal>
  );
}
