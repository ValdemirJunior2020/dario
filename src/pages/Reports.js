// src/pages/Reports.js
import { Container, Row, Col, Card, Button, Table, Form } from "react-bootstrap";
import { useJobs } from "../hooks/useJobs";
import { currency } from "../utils/format";
import { exportJobsCSV } from "../utils/csv";
import { exportJobsPDF } from "../utils/pdf";  // ✅ now actively used
import { useMemo, useState } from "react";

function monthKey(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return "Unknown";
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

export default function Reports() {
  const { allJobs } = useJobs();
  const [tradeFilter, setTradeFilter] = useState("all");

  const jobs = useMemo(() => {
    return tradeFilter === "all" ? allJobs : allJobs.filter((j) => j.trade === tradeFilter);
  }, [allJobs, tradeFilter]);

  const byMonth = useMemo(() => {
    const map = {};
    for (const j of jobs) {
      const key = monthKey(j.createdAt || Date.now());
      if (!map[key]) map[key] = { bid: 0, expenses: 0, profit: 0, count: 0 };
      map[key].bid += Number(j.estimate?.totalBidToClient || 0);
      map[key].expenses += Number(j.expSum || 0);
      map[key].profit += Number(j.profit || 0);
      map[key].count += 1;
    }
    const rows = Object.entries(map).sort(([a], [b]) => (a > b ? -1 : 1));
    return rows;
  }, [jobs]);

  const byTrade = useMemo(() => {
    const map = {};
    for (const j of allJobs) {
      const t = j.trade || "other";
      if (!map[t]) map[t] = { bid: 0, expenses: 0, profit: 0, count: 0 };
      map[t].bid += Number(j.estimate?.totalBidToClient || 0);
      map[t].expenses += Number(j.expSum || 0);
      map[t].profit += Number(j.profit || 0);
      map[t].count += 1;
    }
    return Object.entries(map).sort((a, b) => b[1].profit - a[1].profit);
  }, [allJobs]);

  const totals = useMemo(() => {
    return {
      bid: jobs.reduce((s, j) => s + Number(j.estimate?.totalBidToClient || 0), 0),
      expenses: jobs.reduce((s, j) => s + Number(j.expSum || 0), 0),
      profit: jobs.reduce((s, j) => s + Number(j.profit || 0), 0),
      count: jobs.length,
    };
  }, [jobs]);

  return (
    <Container className="py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0">Reports</h5>
        <div className="d-flex gap-2">
          <Form.Select
            size="sm"
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
          >
            <option value="all">All trades</option>
            <option value="painting">Painting</option>
            <option value="stucco">Stucco</option>
            <option value="drywall">Drywall</option>
            <option value="other">Other</option>
          </Form.Select>

          {/* ✅ Buttons now include PDF export */}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => exportJobsPDF(jobs)}
          >
            Download PDF
          </Button>
          <Button size="sm" onClick={() => exportJobsCSV(jobs)}>
            Export CSV
          </Button>
        </div>
      </div>

      <Row className="g-3">
        <Col xs={12} md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="text-muted small">Total Bid</div>
              <div className="fs-5 fw-semibold">{currency(totals.bid)}</div>
              <div className="text-muted small mt-2">Total Expenses</div>
              <div className="fs-6 fw-semibold">{currency(totals.expenses)}</div>
              <div className="text-muted small mt-2">Total Profit</div>
              <div
                className={`fs-5 fw-semibold ${
                  totals.profit >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {currency(totals.profit)}
              </div>
              <div className="text-muted small mt-2">Jobs</div>
              <div className="fs-6 fw-semibold">{totals.count}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6 className="mb-2">Profit by Month</h6>
              <Table responsive hover size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th className="text-end">Bid</th>
                    <th className="text-end">Expenses</th>
                    <th className="text-end">Profit</th>
                    <th className="text-end">Jobs</th>
                  </tr>
                </thead>
                <tbody>
                  {byMonth.map(([m, v]) => (
                    <tr key={m}>
                      <td>{m}</td>
                      <td className="text-end">{currency(v.bid)}</td>
                      <td className="text-end">{currency(v.expenses)}</td>
                      <td
                        className={`text-end ${
                          v.profit >= 0 ? "text-success" : "text-danger"
                        }`}
                      >
                        {currency(v.profit)}
                      </td>
                      <td className="text-end">{v.count}</td>
                    </tr>
                  ))}
                  {!byMonth.length && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-3">
                        No data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6 className="mb-2">Jobs by Trade</h6>
              <Table responsive hover size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>Trade</th>
                    <th className="text-end">Bid</th>
                    <th className="text-end">Expenses</th>
                    <th className="text-end">Profit</th>
                    <th className="text-end">Jobs</th>
                  </tr>
                </thead>
                <tbody>
                  {byTrade.map(([t, v]) => (
                    <tr key={t}>
                      <td className="text-capitalize">{t}</td>
                      <td className="text-end">{currency(v.bid)}</td>
                      <td className="text-end">{currency(v.expenses)}</td>
                      <td
                        className={`text-end ${
                          v.profit >= 0 ? "text-success" : "text-danger"
                        }`}
                      >
                        {currency(v.profit)}
                      </td>
                      <td className="text-end">{v.count}</td>
                    </tr>
                  ))}
                  {!byTrade.length && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-3">
                        No data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
