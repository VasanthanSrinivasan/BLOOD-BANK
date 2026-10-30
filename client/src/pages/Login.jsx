// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { authAPI } from "../services/api";
// import { useAuth } from "../context/AuthContext";

// const roleRoutes = {
//   admin: "/admin",
//   hospital: "/hospital",
//   hospital_staff: "/hospital-staff",
//   doctor: "/doctor",
//   donor: "/donor",
//   patient: "/patient",
//   user: "/user",
//   blood_bank_staff: "/blood-bank-staff",
// };

// export default function Login() {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();
//   const [mode, setMode] = useState("login");
//   const [name, setName] = useState("");
//   const [role, setRole] = useState("donor");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setNotice("");
//     setLoading(true);
//     try {
//       if (mode === "register") {
//         await authAPI.register({
//           name: name.trim(),
//           email: email.trim().toLowerCase(),
//           password,
//           role,
//         });
//         setNotice(
//           "Account created. You can now sign in with your email and password.",
//         );
//         setMode("login");
//         setPassword("");
//         return;
//       }
//       const response = await authAPI.login({
//         email: email.trim().toLowerCase(),
//         password,
//       });
//       const { token, user } = response.data;
//       if (!token || !user) throw new Error("Login response was incomplete");
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       setUser(user);
//       navigate(roleRoutes[user.role] || "/unauthorized", { replace: true });
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || "Request failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="login-page">
//       <form className="login-card" onSubmit={handleSubmit}>
//         <h1>♥ LifeLine</h1>
//         <p>Blood Bank Management System</p>
//         <div style={{ display: "flex", gap: 8, margin: "18px 0" }}>
//           <button
//             type="button"
//             className="primary-button"
//             style={{ flex: 1, opacity: mode === "login" ? 1 : 0.65 }}
//             onClick={() => {
//               setMode("login");
//               setError("");
//               setNotice("");
//             }}
//           >
//             Login
//           </button>
//           <button
//             type="button"
//             className="primary-button"
//             style={{ flex: 1, opacity: mode === "register" ? 1 : 0.65 }}
//             onClick={() => {
//               setMode("register");
//               setError("");
//               setNotice("");
//             }}
//           >
//             Register
//           </button>
//         </div>
//         {mode === "register" && (
//           <>
//             <label>
//               Full name
//               <input
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 minLength={2}
//                 maxLength={100}
//                 autoComplete="name"
//                 required
//               />
//             </label>
//             <label>
//               Account type
//               <select value={role} onChange={(e) => setRole(e.target.value)}>
//                 <option value="donor">Donor</option>
//                 <option value="patient">Patient</option>
//                 <option value="user">General User</option>
//               </select>
//             </label>
//             <p style={{ fontSize: 12, color: "#666" }}>
//               Hospital, hospital staff, doctor and admin accounts must be
//               created by an authorized administrator.
//             </p>
//           </>
//         )}
//         {notice && (
//           <p role="status" style={{ color: "#147d48" }}>
//             {notice}
//           </p>
//         )}
//         {error && (
//           <p className="error-message" role="alert">
//             {error}
//           </p>
//         )}
//         <label>
//           Email
//           <input
//             type="email"
//             required
//             autoComplete="username"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>
//         <label>
//           Password
//           <input
//             type="password"
//             required
//             minLength={mode === "register" ? 12 : 1}
//             maxLength={128}
//             autoComplete={
//               mode === "register" ? "new-password" : "current-password"
//             }
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           {mode === "register" && <small>Use at least 12 characters.</small>}
//         </label>
//         <button type="submit" disabled={loading} className="primary-button">
//           {loading
//             ? "Please wait..."
//             : mode === "register"
//               ? "Create account"
//               : "Login"}
//         </button>
//       </form>
//     </main>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const roleRoutes = {
  admin: "/admin",
  hospital: "/hospital",
  hospital_staff: "/hospital-staff",
  blood_bank_staff: "/blood-bank-staff",
  doctor: "/doctor",
  donor: "/donor",
  patient: "/patient",
  user: "/user",
};

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [role, setRole] = useState("donor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setNotice("");
    setLoading(true);

    try {
      if (mode === "register") {
        await authAPI.register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        });

        setNotice(
          "Account created. You can now sign in with your email and password."
        );

        setMode("login");
        setPassword("");
        return;
      }

      const response = await authAPI.login({
        email: email.trim().toLowerCase(),
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Login response was incomplete");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      navigate(roleRoutes[user.role] || "/unauthorized", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Request failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>♥ LifeLine</h1>
        <p>Blood Bank Management System</p>

        <div
          style={{
            display: "flex",
            gap: 8,
            margin: "18px 0",
          }}
        >
          <button
            type="button"
            className="primary-button"
            style={{
              flex: 1,
              opacity: mode === "login" ? 1 : 0.65,
            }}
            onClick={() => {
              setMode("login");
              setError("");
              setNotice("");
            }}
          >
            Login
          </button>

          <button
            type="button"
            className="primary-button"
            style={{
              flex: 1,
              opacity: mode === "register" ? 1 : 0.65,
            }}
            onClick={() => {
              setMode("register");
              setError("");
              setNotice("");
            }}
          >
            Register
          </button>
        </div>

        {mode === "register" && (
          <>
            <label>
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={2}
                maxLength={100}
                autoComplete="name"
                required
              />
            </label>

            <label>
              Account type
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="donor">Donor</option>
                <option value="patient">Patient</option>
                <option value="user">General User</option>
              </select>
            </label>

            <p style={{ fontSize: 12, color: "#666" }}>
              Hospital, Hospital Staff, Blood Bank Staff, Doctor
              and Admin accounts must be created by an
              authorized administrator.
            </p>
          </>
        )}

        {notice && (
          <p role="status" style={{ color: "#147d48" }}>
            {notice}
          </p>
        )}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <label>
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            minLength={mode === "register" ? 12 : 1}
            maxLength={128}
            autoComplete={
              mode === "register"
                ? "new-password"
                : "current-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === "register" && (
            <small>Use at least 12 characters.</small>
          )}
        </label>

        <button
          type="submit"
          disabled={loading}
          className="primary-button"
        >
          {loading
            ? "Please wait..."
            : mode === "register"
              ? "Create account"
              : "Login"}
        </button>
      </form>
    </main>
  );
}
