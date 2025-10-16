// src/components/StatusBadge.js
import { Badge } from "react-bootstrap";

const color = {
  lead:"secondary", quoted:"warning", approved:"primary", rejected:"danger",
  in_progress:"info", completed:"success", paid:"success"
};

export default function StatusBadge({ status }) {
  return <Badge bg={color[status] || "secondary"}>{status}</Badge>;
}
