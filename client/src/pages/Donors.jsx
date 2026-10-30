
import { useEffect, useState } from "react";
import { donorAPI } from "../services/api";
import { sampleDonors } from "../sampleData";
import {
  Users, Plus, Search, Pencil, Trash2, RefreshCw, X
} from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  bloodGroup: "O+",
  age: 18,
  city: "",
  lastDonationDate: "",
  availability: "Available",
};

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadDonors() {
    setLoading(true);
    setError("");

    try {
      const response = await donorAPI.list({
        search,
        limit: 100,
      });
      setDonors(response.data.data || []);
    } catch (err) {
      setDonors(sampleDonors.filter((donor) =>
        `${donor.name} ${donor.donorId} ${donor.city} ${donor.bloodGroup}`
          .toLowerCase().includes(search.toLowerCase())
      ));
      setError("Showing sample donor records because the API is unavailable. Add/edit/delete requires a running backend and MongoDB.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadDonors, 300);
    return () => clearTimeout(timer);
  }, [search]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm });
    setError("");
    setShowForm(true);
  }

  function openEdit(donor) {
    setEditing(donor._id);
    setForm({
      ...emptyForm,
      ...donor,
      lastDonationDate: donor.lastDonationDate
        ? donor.lastDonationDate.slice(0, 10)
        : "",
    });
    setError("");
    setShowForm(true);
  }

  async function saveDonor(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        lastDonationDate: form.lastDonationDate || null,
      };

      if (editing) {
        await donorAPI.update(editing, payload);
        setSuccess("Donor updated successfully.");
      } else {
        await donorAPI.create(payload);
        setSuccess("Donor registered successfully.");
      }

      setShowForm(false);
      setEditing(null);
      setForm({ ...emptyForm });
      await loadDonors();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save donor."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteDonor(donor) {
    if (!window.confirm(`Delete donor ${donor.name}?`)) return;

    setError("");
    setSuccess("");

    try {
      await donorAPI.remove(donor._id);
      setSuccess("Donor deleted successfully.");
      await loadDonors();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete donor."
      );
    }
  }

  const availableCount = donors.filter(
    (donor) => donor.availability === "Available"
  ).length;

  return (
    <main className="donors-page">
      <header className="donors-heading">
        <div>
          <p className="donors-eyebrow">LIFELINE / MANAGEMENT</p>
          <h1>Donor Management</h1>
          <p>Register, search and manage donor records.</p>
        </div>

        <button className="donors-primary" onClick={openCreate}>
          <Plus size={18} /> Add Donor
        </button>
      </header>

      <section className="donors-stats">
        <article>
          <Users size={22} />
          <span>Total donors</span>
          <strong>{donors.length}</strong>
        </article>
        <article>
          <span>Administratively available</span>
          <strong>{availableCount}</strong>
        </article>
        <article>
          <span>Blood groups represented</span>
          <strong>
            {new Set(donors.map((d) => d.bloodGroup)).size} / 8
          </strong>
        </article>
      </section>

      <section className="donors-panel">
        <div className="donors-toolbar">
          <label className="donors-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, donor ID or city..."
            />
          </label>
          <button className="donors-secondary" onClick={loadDonors}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {error && <p className="donors-message error">{error}</p>}
        {success && <p className="donors-message success">{success}</p>}

        {showForm && (
          <form className="donors-form" onSubmit={saveDonor}>
            <div className="donors-form-heading">
              <h2>{editing ? "Edit donor" : "Register donor"}</h2>
              <button
                type="button"
                className="donors-icon-button"
                aria-label="Close form"
                onClick={() => setShowForm(false)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="donors-form-grid">
              <label>
                Full name
                <input
                  required maxLength={100}
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </label>

              <label>
                Email
                <input
                  type="email" maxLength={254}
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </label>

              <label>
                Phone
                <input
                  required maxLength={25}
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </label>

              <label>
                Blood group
                <select
                  value={form.bloodGroup}
                  onChange={(e) =>
                    setForm({ ...form, bloodGroup: e.target.value })
                  }
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group}>{group}</option>
                    )
                  )}
                </select>
              </label>

              <label>
                Age
                <input
                  type="number" min="18" max="100" required
                  value={form.age}
                  onChange={(e) =>
                    setForm({ ...form, age: e.target.value })
                  }
                />
              </label>

              <label>
                City
                <input
                  required maxLength={100}
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                />
              </label>

              <label>
                Last donation date
                <input
                  type="date"
                  value={form.lastDonationDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lastDonationDate: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Administrative status
                <select
                  value={form.availability}
                  onChange={(e) =>
                    setForm({ ...form, availability: e.target.value })
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </label>
            </div>

            <div className="donors-form-actions">
              <button
                type="button"
                className="donors-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button className="donors-primary" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : "Register Donor"}
              </button>
            </div>
          </form>
        )}

        <div className="donors-table-wrap">
          <table className="donors-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Blood Group</th>
                <th>Phone</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Loading donors...</td></tr>
              ) : donors.length === 0 ? (
                <tr><td colSpan="6">No donor records found.</td></tr>
              ) : donors.map((donor) => (
                <tr key={donor._id}>
                  <td>
                    <strong>{donor.name}</strong>
                    <small>{donor.donorId}</small>
                  </td>
                  <td><span className="donors-blood">{donor.bloodGroup}</span></td>
                  <td>{donor.phone}</td>
                  <td>{donor.city}</td>
                  <td>
                    <span className={
                      donor.availability === "Available"
                        ? "donors-status active"
                        : "donors-status inactive"
                    }>
                      {donor.availability}
                    </span>
                  </td>
                  <td>
                    <div className="donors-actions">
                      <button
                        aria-label={`Edit ${donor.name}`}
                        onClick={() => openEdit(donor)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="delete"
                        aria-label={`Delete ${donor.name}`}
                        onClick={() => deleteDonor(donor)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
