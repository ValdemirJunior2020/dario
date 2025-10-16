// src/hooks/useJobs.js
/* eslint-disable */
import { useEffect, useMemo, useState } from "react";

const KEY = "contractor_jobs_v2"; // bumped key so old data doesn't break
const STATUSES = ["lead", "quoted", "approved", "rejected", "in_progress", "completed", "paid"];

function loadJobs() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function saveJobs(jobs) {
  try { localStorage.setItem(KEY, JSON.stringify(jobs)); } catch (e) {}
}

function now() { return new Date().toISOString(); }
function entry(action, actor, extra = {}) {
  return {
    id: "h" + Date.now() + Math.random().toString(36).slice(2, 6),
    ts: now(),
    action, // 'job.create','job.update','status.change','expense.add','expense.delete'
    actor: actor ? {
      username: actor.username,
      role: actor.role,
      displayName: actor.displayName,
    } : null,
    ...extra,
  };
}

export function useJobs() {
  const [jobs, setJobs] = useState(() => loadJobs());
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => saveJobs(jobs), [jobs]);

  const addJob = (job, actor = null) => {
    const id = "j" + Date.now();
    const fresh = {
      id,
      createdAt: now(),
      createdBy: actor ? actor.username : null,
      status: "lead",
      trade: "painting",
      estimate: { materials: 0, labor: 0, rentals: 0, subs: 0, misc: 0, totalBidToClient: 0 },
      expenses: [], // [{id,type,amount,date,vendor,note,addedBy,addedAt}]
      history: [entry("job.create", actor, { title: job?.title || "" })],
      ...job,
    };
    setJobs((prev) => [fresh, ...prev]);
    return id;
  };

  const updateJob = (jobId, patch, actor = null) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              ...patch,
              history: [
                entry("job.update", actor, { fieldsChanged: Object.keys(patch || {}) }),
                ...(j.history || []),
              ],
            }
          : j
      )
    );
  };

  const setStatus = (jobId, status, reasonIfRejected = "", actor = null) => {
    if (!STATUSES.includes(status)) return;
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status,
              reasonIfRejected,
              history: [
                entry("status.change", actor, { to: status, reasonIfRejected }),
                ...(j.history || []),
              ],
            }
          : j
      )
    );
  };

  const removeJob = (jobId, actor = null) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const addExpense = (jobId, exp, actor = null) => {
    const id = "e" + Date.now();
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        const newExp = { id, ...exp, addedBy: actor?.username || null, addedAt: now() };
        return {
          ...j,
          expenses: [newExp, ...(j.expenses || [])],
          history: [
            entry("expense.add", actor, { expenseId: id, type: exp.type, amount: Number(exp.amount || 0) }),
            ...(j.history || []),
          ],
        };
      })
    );
  };

  const deleteExpense = (jobId, expenseId, actor = null) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        const target = (j.expenses || []).find((e) => e.id === expenseId);
        return {
          ...j,
          expenses: (j.expenses || []).filter((e) => e.id !== expenseId),
          history: [
            entry("expense.delete", actor, { expenseId, type: target?.type, amount: target?.amount }),
            ...(j.history || []),
          ],
        };
      })
    );
  };

  const computed = useMemo(() => {
    return jobs.map((j) => {
      const expSum = (j.expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0);
      const bid = Number((j.estimate && j.estimate.totalBidToClient) || 0);
      const profit = bid - expSum;
      const marginPct = bid > 0 ? (profit / bid) * 100 : 0;
      return { ...j, expSum, profit, marginPct };
    });
  }, [jobs]);

  const filtered = useMemo(() => {
    let out = computed;
    if (filter !== "all") out = out.filter((j) => j.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (j) =>
          (j.title || "").toLowerCase().includes(q) ||
          (j.client || "").toLowerCase().includes(q) ||
          (j.trade || "").toLowerCase().includes(q)
      );
    }
    return out;
  }, [computed, filter, search]);

  return {
    jobs: filtered,
    allJobs: computed,
    addJob,
    updateJob,
    setStatus,
    removeJob,
    addExpense,
    deleteExpense,
    filter, setFilter,
    search, setSearch,
  };
}
