import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Droplet,
  Hospital,
  ClipboardList,
  UserCog,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Landmark,
  Download,
} from "lucide-react";
import { resourceAPI, donorAPI } from "../services/api";
import { exportCSV, exportExcel, exportPDF } from "../utils/exportReports";
import "./Admin.css";
const links = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Donor Management", "/admin/donors", Users],
  ["Blood Inventory", "/admin/inventory", Droplet],
  ["Hospital Management", "/admin/hospitals", Hospital],
  ["Blood Banks", "/admin/bloodbanks", Landmark],
  ["Blood Requests", "/admin/requests", ClipboardList],
  ["User Management", "/admin/users", UserCog],
  ["Reports & Analytics", "/admin/reports", ChartNoAxesCombined],
  ["Settings", "/admin/settings", Settings],
];
const configs = {
  "/admin/inventory": {
    title: "Blood Inventory",
    resource: "inventory",
    desc: "Manage blood group stock",
    fields: [
      ["inventoryId", "Inventory ID", "text"],
      ["group", "Blood Group", "group"],
      ["units", "Units Available", "number"],
      ["minimum", "Minimum Stock", "number"],
    ],
    cols: [
      ["inventoryId", "Inventory ID"],
      ["group", "Blood Group"],
      ["units", "Units"],
      ["minimum", "Minimum"],
    ],
  },
  "/admin/hospitals": {
    title: "Hospital Management",
    resource: "hospitals",
    desc: "Manage hospital partners",
    fields: [
      ["hospitalId", "Hospital ID", "text"],
      ["name", "Hospital Name", "text"],
      ["city", "City", "text"],
      ["contact", "Contact", "text"],
      ["email", "Email", "email"],
      ["status", "Status", "status"],
    ],
    cols: [
      ["hospitalId", "Hospital ID"],
      ["name", "Hospital"],
      ["city", "City"],
      ["contact", "Contact"],
      ["email", "Email"],
      ["status", "Status"],
    ],
  },
  "/admin/bloodbanks": {
    title: "Blood Bank Management",
    resource: "bloodbanks",
    desc: "Manage registered blood banks",
    fields: [
      ["bloodBankId", "Blood Bank ID", "text"],
      ["name", "Blood Bank Name", "text"],
      ["city", "City", "text"],
      ["address", "Address", "text"],
      ["contact", "Contact", "text"],
      ["email", "Email", "email"],
      ["status", "Status", "status"],
    ],
    cols: [
      ["bloodBankId", "Bank ID"],
      ["name", "Blood Bank"],
      ["city", "City"],
      ["contact", "Contact"],
      ["email", "Email"],
      ["status", "Status"],
    ],
  },
  "/admin/requests": {
    title: "Blood Requests",
    resource: "requests",
    desc: "Track blood requests",
    fields: [
      ["requestId", "Request ID", "text"],
      ["patient", "Patient Name", "text"],
      ["hospital", "Hospital", "text"],
      ["group", "Blood Group", "group"],
      ["units", "Units", "number"],
      ["priority", "Priority", "priority"],
      ["status", "Status", "requestStatus"],
    ],
    cols: [
      ["requestId", "Request ID"],
      ["patient", "Patient"],
      ["hospital", "Hospital"],
      ["group", "Group"],
      ["units", "Units"],
      ["priority", "Priority"],
      ["status", "Status"],
    ],
  },
  "/admin/users": {
    title: "User Management",
    resource: "users",
    desc: "Manage system accounts. New user passwords must be at least 12 characters.",
    fields: [
      ["name", "Full Name", "text"],
      ["email", "Email", "email"],
      ["password", "Temporary Password (create only)", "password"],
      ["role", "Role", "role"],
      [
        "hospitalId",
        "Hospital MongoDB _id (required for hospital/staff/doctor)",
        "text",
      ],
    ],
    cols: [
      ["name", "Name"],
      ["email", "Email"],
      ["role", "Role"],
      ["isActive", "Status"],
    ],
  },
  "/admin/reports": {
    title: "Reports & Analytics",
    resource: "reports",
    desc: "Export live records returned by MongoDB",
    fields: [],
    cols: [],
  },
  "/admin/settings": {
    title: "Settings",
    resource: null,
    desc: "Application settings",
    fields: [],
    cols: [],
  },
};
const groupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
function valueOf(row, key) {
  if (key === "isActive") return row.isActive ? "Active" : "Inactive";
  const v = row[key];
  return v == null
    ? "—"
    : typeof v === "object"
      ? v.name || v._id || JSON.stringify(v)
      : String(v);
}
export default function SamplePage() {
  const navigate = useNavigate(),
    location = useLocation();
  const cfg = configs[location.pathname] || configs["/admin/inventory"];
  const [rows, setRows] = useState([]),
    [search, setSearch] = useState(""),
    [form, setForm] = useState({}),
    [editing, setEditing] = useState(null),
    [showForm, setShowForm] = useState(false),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        JSON.stringify(r).toLowerCase().includes(search.toLowerCase()),
      ),
    [rows, search],
  );
  async function load() {
    if (!cfg.resource || cfg.resource === "reports") return;
    setLoading(true);
    setError("");
    try {
      const res = await resourceAPI.list(cfg.resource);
      setRows(res.data.data || []);
    } catch (e) {
      setRows([]);
      setError(
        e.response?.data?.message ||
          "Could not load MongoDB records. Check backend, login token and permissions.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    setRows([]);
    setSearch("");
    setShowForm(false);
    load();
  }, [location.pathname]);
  function create() {
    setEditing(null);
    setForm({
      status: "Active",
      group: "O+",
      units: 1,
      minimum: 5,
      priority: "Normal",
      role: "doctor",
    });
    setShowForm(true);
    setError("");
  }
  function edit(row) {
    setEditing(row._id);
    const f = { ...row };
    delete f._id;
    delete f.__v;
    delete f.createdAt;
    delete f.updatedAt;
    delete f.demoRecord;
    delete f.isActive;
    delete f.password;
    if (f.date) f.date = String(f.date).slice(0, 10);
    setForm(f);
    setShowForm(true);
    setError("");
  }
  async function save(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form };
      if (payload.units !== undefined) payload.units = Number(payload.units);
      if (payload.minimum !== undefined)
        payload.minimum = Number(payload.minimum);
      if (cfg.resource === "users") {
        if (editing) delete payload.password;
        else if (!payload.password)
          throw new Error("Set a temporary password (minimum 12 characters)");
      }
      if (editing) await resourceAPI.update(cfg.resource, editing, payload);
      else await resourceAPI.create(cfg.resource, payload);
      setShowForm(false);
      setNotice("Saved to MongoDB successfully.");
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message || e.message || "Unable to save record",
      );
    }
  }
  async function remove(row) {
    if (
      !window.confirm(
        `Delete ${row.name || row.requestId || row.hospitalId || row._id}?`,
      )
    )
      return;
    try {
      await resourceAPI.remove(cfg.resource, row._id);
      setNotice("Record deleted from MongoDB.");
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Delete failed");
    }
  }
  async function toggle(row) {
    try {
      await resourceAPI.toggle(cfg.resource, row._id);
      setNotice("Status updated in MongoDB.");
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Status toggle failed");
    }
  }
  const reportRows = filtered.map((r) =>
    Object.fromEntries(
      Object.entries(r)
        .filter(([k]) => !["_id", "__v", "password"].includes(k))
        .map(([k, v]) => [
          k,
          typeof v === "object" && v !== null ? JSON.stringify(v) : v,
        ]),
    ),
  );
  const isReport = cfg.resource === "reports";
  const Icon = links.find((l) => l[1] === location.pathname)?.[2] || Settings;
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">
          <span className="brand-mark">♥</span>
          <div>
            <b>LifeLine</b>
            <small>Blood Bank System</small>
          </div>
        </div>
        <nav>
          {links.map(([label, path, I]) => (
            <button
              key={path}
              className={
                location.pathname === path ? "nav-link active" : "nav-link"
              }
              onClick={() => navigate(path)}
            >
              <I size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <button
          className="nav-link logout"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <main className="admin-main">
        <header className="admin-top">
          <div>
            <small>LIFELINE / MANAGEMENT</small>
            <h1>{cfg.title}</h1>
          </div>
          <span className="demo-pill">MONGODB CONNECTED DATA</span>
        </header>
        <section className="module-intro">
          <div className="module-icon">
            <Icon size={24} />
          </div>
          <div>
            <h2>{cfg.title}</h2>
            <p>{cfg.desc}</p>
          </div>
        </section>
        {error && <p className="donors-message error">{error}</p>}
        {notice && <p className="donors-message success">{notice}</p>}
        {cfg.resource && cfg.resource !== "reports" && (
          <>
            <div className="module-toolbar">
              <label className="module-search">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search records..."
                />
              </label>
              <span>{filtered.length} records</span>
              <button className="donors-secondary" onClick={load}>
                <RefreshCw size={15} /> Refresh
              </button>
              <button className="donors-primary" onClick={create}>
                <Plus size={16} /> Add New
              </button>
            </div>
            {showForm && (
              <form className="donors-form" onSubmit={save}>
                <div className="donors-form-heading">
                  <h2>{editing ? "Edit record" : "Add record"}</h2>
                  <button type="button" onClick={() => setShowForm(false)}>
                    Close
                  </button>
                </div>
                <div className="donors-form-grid">
                  {cfg.fields
                    .filter(([key]) => !(editing && key === "password"))
                    .map(([key, label, type]) => (
                      <label key={key}>
                        {label}
                        {type === "group" ||
                        type === "status" ||
                        type === "priority" ||
                        type === "requestStatus" ||
                        type === "role" ? (
                          <select
                            required={key !== "hospitalId"}
                            value={
                              form[key] ?? (type === "status" ? "Active" : "")
                            }
                            onChange={(e) =>
                              setForm({ ...form, [key]: e.target.value })
                            }
                          >
                            {(type === "group"
                              ? groupOptions
                              : type === "status"
                                ? ["Active", "Inactive", "Pending"]
                                : type === "priority"
                                  ? ["Critical", "High", "Normal"]
                                  : type === "requestStatus"
                                    ? [
                                        "Pending",
                                        "Approved",
                                        "Completed",
                                        "Rejected",
                                      ]
                                    : type === "role"
                                      ? [
                                          "admin",
                                          "doctor",
                                          "hospital",
                                          "hospital_staff",
                                          "blood_bank_staff",
                                          "donor",
                                          "patient",
                                          "user",
                                        ]
                                      : []
                            ).map((v) => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            required={!["hospitalId"].includes(key)}
                            type={type}
                            min={type === "number" ? 0 : undefined}
                            value={form[key] ?? ""}
                            onChange={(e) =>
                              setForm({ ...form, [key]: e.target.value })
                            }
                          />
                        )}
                      </label>
                    ))}
                </div>
                <div className="donors-form-actions">
                  <button
                    type="button"
                    className="donors-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button className="donors-primary">Save to MongoDB</button>
                </div>
              </form>
            )}
            <div className="module-table-wrap">
              <table className="module-table">
                <thead>
                  <tr>
                    {cfg.cols.map(([key, label]) => (
                      <th key={key}>{label}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={cfg.cols.length + 1}>
                        Loading MongoDB records...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={cfg.cols.length + 1}>
                        No records found in MongoDB. Use Add New or run npm run
                        seed-demo.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row, i) => (
                      <tr key={row._id || i}>
                        {cfg.cols.map(([key]) => (
                          <td key={key}>
                            {key === "status" || key === "isActive" ? (
                              <span className="status-pill">
                                {valueOf(row, key)}
                              </span>
                            ) : (
                              valueOf(row, key)
                            )}
                          </td>
                        ))}
                        <td>
                          <button
                            className="small-action"
                            onClick={() => edit(row)}
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          {cfg.resource !== "inventory" && (
                            <button
                              className="small-action"
                              onClick={() => toggle(row)}
                            >
                              {row.isActive === false ||
                              row.status === "Inactive"
                                ? "Activate"
                                : "Toggle status"}
                            </button>
                          )}
                          <button
                            className="small-action"
                            onClick={() => remove(row)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {isReport && (
          <>
            <div className="module-toolbar">
              <button
                className="donors-secondary"
                onClick={async () => {
                  try {
                    const [d, h, b, r, u, i] = await Promise.all([
                      donorAPI.list({ limit: 500 }),
                      resourceAPI.list("hospitals"),
                      resourceAPI.list("bloodbanks"),
                      resourceAPI.list("requests"),
                      resourceAPI.list("users"),
                      resourceAPI.list("inventory"),
                    ]);
                    const combined = [
                      ...(d.data.data || []).map((x) => ({
                        type: "Donor",
                        name: x.name,
                        bloodGroup: x.bloodGroup,
                        city: x.city,
                        status: x.availability,
                      })),
                      ...(h.data.data || []).map((x) => ({
                        type: "Hospital",
                        name: x.name,
                        city: x.city,
                        status: x.status,
                      })),
                      ...(b.data.data || []).map((x) => ({
                        type: "Blood Bank",
                        name: x.name,
                        city: x.city,
                        status: x.status,
                      })),
                      ...(r.data.data || []).map((x) => ({
                        type: "Blood Request",
                        name: x.patient,
                        hospital: x.hospital,
                        bloodGroup: x.group,
                        units: x.units,
                        status: x.status,
                      })),
                      ...(u.data.data || []).map((x) => ({
                        type: "User",
                        name: x.name,
                        email: x.email,
                        role: x.role,
                        status: x.isActive ? "Active" : "Inactive",
                      })),
                      ...(i.data.data || []).map((x) => ({
                        type: "Inventory",
                        bloodGroup: x.group,
                        units: x.units,
                        minimum: x.minimum,
                      })),
                    ];
                    setRows(combined);
                    setNotice("Report data loaded from MongoDB.");
                  } catch (e) {
                    setError(
                      e.response?.data?.message || "Could not load report data",
                    );
                  }
                }}
              >
                <RefreshCw size={15} /> Load live report data
              </button>
              <button
                className="donors-secondary"
                onClick={() => exportPDF(reportRows)}
              >
                <Download size={15} /> Export PDF
              </button>
              <button
                className="donors-secondary"
                onClick={() => exportExcel(reportRows)}
              >
                <Download size={15} /> Export Excel
              </button>
              <button
                className="donors-secondary"
                onClick={() => exportCSV(reportRows)}
              >
                <Download size={15} /> Export CSV
              </button>
            </div>
            <p>
              Load live report data first, then export. Export contains only
              records returned by authorized APIs.
            </p>
            <div className="module-table-wrap">
              <table className="module-table">
                <thead>
                  <tr>
                    {Object.keys(
                      reportRows[0] || {
                        type: "Type",
                        name: "Name",
                        status: "Status",
                      },
                    ).map((k) => (
                      <th key={k}>{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportRows.map((r, i) => (
                    <tr key={i}>
                      {Object.values(r).map((v, j) => (
                        <td key={j}>{String(v ?? "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {cfg.resource === null && (
          <div className="settings-grid">
            <article>
              <h3>MongoDB storage</h3>
              <p>Records are loaded through authenticated backend APIs.</p>
            </article>
            <article>
              <h3>Security</h3>
              <p>
                Keep server/.env private. Admin APIs require an authenticated
                admin account.
              </p>
            </article>
          </div>
        )}
        <p className="sample-footnote">
          Changes from these management pages call backend APIs and persist in
          MongoDB. Demo records must be seeded using the backend script.
        </p>
      </main>
    </div>
  );
}
