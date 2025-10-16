/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
import { getFirebase } from "../firebase";

const STATUSES = ["lead", "quoted", "approved", "rejected", "in_progress", "completed", "paid"];

function now() { return new Date().toISOString(); }
function entry(action, actor, extra = {}) {
  return {
    id: "h" + Date.now() + Math.random().toString(36).slice(2, 6),
    ts: now(),
    action,
    actor: actor ? {
      username: actor.username,
      role: actor.role,
      displayName: actor.displayName,
    } : null,
    ...extra,
  };
}

export function useJobsFirestore() {
  const { db } = getFirebase();
  const [rawJobs, setRawJobs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // subscribe
  useEffect(() => {
    const { collection, onSnapshot, query, orderBy } = require("firebase/firestore");
    const ref = collection(db, "jobs");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRawJobs(arr);
    });
    return () => unsub();
  }, [db]);

  // helpers
  const recalc = (j) => {
    const expSum = (j.expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0);
    const bid = Number(j?.estimate?.totalBidToClient || 0);
    const profit = bid - expSum;
    const marginPct = bid > 0 ? (profit / bid) * 100 : 0;
    return { ...j, expSum, profit, marginPct };
  };

  // CRUD
  const addJob = async (job, actor = null) => {
    const { collection, addDoc, serverTimestamp } = require("firebase/firestore");
    const ref = collection(db, "jobs");
    const doc = {
      createdAt: now(), // keeping ISO for sorting same as local
      createdBy: actor ? actor.username : null,
      status: "lead",
      trade: "painting",
      estimate: { materials: 0, labor: 0, rentals: 0, subs: 0, misc: 0, totalBidToClient: 0 },
      expenses: [],
      history: [entry("job.create", actor, { title: job?.title || "" })],
      ...job,
    };
    const res = await addDoc(ref, doc);
    return res.id;
  };

  const updateJob = async (jobId, patch, actor = null) => {
    const { doc, updateDoc, arrayUnion } = require("firebase/firestore");
    const ref = doc(db, "jobs", jobId);
    const historyItem = entry("job.update", actor, { fieldsChanged: Object.keys(patch || {}) });
    await updateDoc(ref, {
      ...patch,
      history: arrayUnion(historyItem),
    });
  };

  const setStatus = async (jobId, status, reasonIfRejected = "", actor = null) => {
    if (!STATUSES.includes(status)) return;
    const { doc, updateDoc, arrayUnion } = require("firebase/firestore");
    const ref = doc(db, "jobs", jobId);
    const historyItem = entry("status.change", actor, { to: status, reasonIfRejected });
    await updateDoc(ref, { status, reasonIfRejected, history: arrayUnion(historyItem) });
  };

  const removeJob = async (jobId) => {
    const { doc, deleteDoc } = require("firebase/firestore");
    await deleteDoc(doc(db, "jobs", jobId));
  };

  const addExpense = async (jobId, exp, actor = null) => {
    const { doc, updateDoc, getDoc } = require("firebase/firestore");
    const ref = doc(db, "jobs", jobId);
    const snap = await getDoc(ref);
    const j = snap.data() || {};
    const id = "e" + Date.now();
    const newExp = { id, ...exp, addedBy: actor?.username || null, addedAt: now() };
    const expenses = [newExp, ...(j.expenses || [])];
    const historyItem = entry("expense.add", actor, { expenseId: id, type: exp.type, amount: Number(exp.amount || 0) });
    await updateDoc(ref, { expenses, history: [...(j.history || []), historyItem] });
  };

  const deleteExpense = async (jobId, expenseId, actor = null) => {
    const { doc, updateDoc, getDoc } = require("firebase/firestore");
    const ref = doc(db, "jobs", jobId);
    const snap = await getDoc(ref);
    const j = snap.data() || {};
    const target = (j.expenses || []).find((e) => e.id === expenseId);
    const expenses = (j.expenses || []).filter((e) => e.id !== expenseId);
    const historyItem = entry("expense.delete", actor, { expenseId, type: target?.type, amount: target?.amount });
    await updateDoc(ref, { expenses, history: [...(j.history || []), historyItem] });
  };

  // computed & filtered
  const computed = useMemo(() => rawJobs.map(recalc), [rawJobs]);
  const jobs = useMemo(() => {
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
    jobs,
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
