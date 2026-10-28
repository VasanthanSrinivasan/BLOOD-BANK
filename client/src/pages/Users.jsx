// import { useEffect, useState } from "react";
// import { ShieldCheck, UserCheck, UserX } from "lucide-react";
// import api, { errorMessage } from "../services/api";
// import { Alert, Loading, PageHeading, StatusBadge } from "../components/UI";
// export default function Users() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const load = async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get("/auth/users");
//       setItems(data);
//     } catch (e) {
//       setError(errorMessage(e));
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     load();
//   }, []);
//   const toggle = async (user) => {
//     try {
//       await api.patch(`/auth/users/${user._id}/active`, {
//         active: !user.active,
//       });
//       setSuccess(
//         `${user.name} account ${user.active ? "deactivated" : "activated"}.`,
//       );
//       load();
//     } catch (e) {
//       setError(errorMessage(e));
//     }
//   };
//   return (
//     <>
//       <PageHeading
//         title="Staff accounts"
//         subtitle="Review team access and activate or deactivate staff accounts."
//       />
//       <Alert type="success">{success}</Alert>
//       <Alert>{error}</Alert>
//       <div className="notice-card notice-warning mb-3">
//         <ShieldCheck size={20} />
//         <div>
//           <strong>Account creation</strong>
//           <p>
//             Use the registration page only to initialize the first admin. After
//             that, create staff accounts through the admin-authorized API or an
//             admin account creation form.
//           </p>
//         </div>
//       </div>
//       <div className="data-card">
//         <div className="table-responsive">
//           <table className="table custom-table">
//             <thead>
//               <tr>
//                 <th>USER</th>
//                 <th>EMAIL</th>
//                 <th>ROLE</th>
//                 <th>STATUS</th>
//                 <th>CREATED</th>
//                 <th>ACTION</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="6">
//                     <Loading />
//                   </td>
//                 </tr>
//               ) : (
//                 items.map((x) => (
//                   <tr key={x._id}>
//                     <td>
//                       <strong>{x.name}</strong>
//                     </td>
//                     <td>{x.email}</td>
//                     <td>
//                       <span className="role-pill">{x.role}</span>
//                     </td>
//                     <td>
//                       <StatusBadge status={x.active ? "Active" : "Inactive"} />
//                     </td>
//                     <td>{new Date(x.createdAt).toLocaleDateString()}</td>
//                     <td>
//                       <button
//                         className={`btn btn-sm ${x.active ? "btn-outline-danger" : "btn-outline-success"}`}
//                         onClick={() => toggle(x)}
//                       >
//                         {x.active ? (
//                           <>
//                             <UserX size={14} /> Deactivate
//                           </>
//                         ) : (
//                           <>
//                             <UserCheck size={14} /> Activate
//                           </>
//                         )}
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }

import { useEffect, useState } from 'react';
import { ShieldCheck, UserCheck, UserX, UserPlus } from 'lucide-react';
import api, { errorMessage } from '../services/api';
import {
  Alert,
  Loading,
  PageHeading,
  StatusBadge,
} from '../components/UI';

const initialForm = {
  name: '',
  email: '',
  password: '',
};

export default function Users() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(initialForm);

  async function loadUsers() {
    setLoading(true);

    try {
      const { data } = await api.get('/auth/users');
      setItems(data);
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleCreateStaff(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (name.length < 2) {
      setError('Name must contain at least 2 characters.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setSaving(true);

    try {
      // The existing backend assigns the staff role
      // because the current admin is authenticated.
      await api.post('/auth/register', {
        name,
        email,
        password: form.password,
      });

      setForm(initialForm);
      setSuccess(`Staff account for ${name} created successfully.`);

      await loadUsers();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggleUser(user) {
    setError('');
    setSuccess('');

    try {
      await api.patch(`/auth/users/${user._id}/active`, {
        active: !user.active,
      });

      setSuccess(
        `${user.name} account ${
          user.active ? 'deactivated' : 'activated'
        } successfully.`
      );

      await loadUsers();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <>
      <PageHeading
        title="Staff Accounts"
        subtitle="Create team accounts and manage access permissions."
      />

      <Alert type="success">{success}</Alert>
      <Alert>{error}</Alert>

      <div className="notice-card notice-warning mb-3">
        <ShieldCheck size={20} />
        <div>
          <strong>Administrator controls</strong>
          <p>
            Only administrators can create, activate, or
            deactivate staff accounts. Staff accounts cannot
            create other accounts.
          </p>
        </div>
      </div>

      {/* Create staff form */}
      <div className="data-card p-4 mb-4">
        <h3 className="h5 mb-3">
          <UserPlus size={20} className="me-2" />
          Create Staff Account
        </h3>

        <form onSubmit={handleCreateStaff}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="staff-name">
                Full name
              </label>
              <input
                id="staff-name"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                minLength={2}
                maxLength={80}
                autoComplete="name"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="staff-email">
                Email address
              </label>
              <input
                id="staff-email"
                className="form-control"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="staff@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="staff-password">
                Temporary password
              </label>
              <input
                id="staff-password"
                className="form-control"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom mt-3"
            disabled={saving}
          >
            <UserPlus size={17} className="me-2" />
            {saving ? 'Creating account...' : 'Create Staff'}
          </button>
        </form>
      </div>

      {/* Existing staff table */}
      <div className="data-card">
        <div className="p-3 border-bottom">
          <h3 className="h5 mb-0">All User Accounts</h3>
        </div>

        <div className="table-responsive">
          <table className="table custom-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>CREATED</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <Loading />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No user accounts found.
                  </td>
                </tr>
              ) : (
                items.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <strong>{user.name}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="role-pill">
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <StatusBadge
                        status={user.active ? 'Active' : 'Inactive'}
                      />
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm ${
                          user.active
                            ? 'btn-outline-danger'
                            : 'btn-outline-success'
                        }`}
                        onClick={() => toggleUser(user)}
                      >
                        {user.active ? (
                          <>
                            <UserX size={14} /> Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} /> Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
