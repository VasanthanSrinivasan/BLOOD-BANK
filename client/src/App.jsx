// // import { Routes, Route, Navigate } from "react-router-dom";
// // import Login from "./pages/Login";
// // import Dashboard from "./pages/Dashboard";
// // import RoleDashboard from "./pages/RoleDashboard";
// // import Unauthorized from "./pages/Unauthorized";
// // import ProtectedRoute from "./components/ProtectedRoute";
// // import Donors from "./pages/Donors";
// // import SamplePage from "./pages/SamplePage";
// // import RoleResource from "./pages/RoleResource";
// // import "./pages/Admin.css";
// // import "./Donors.css";
// // import "./index.css";

// // export default function App() {
// //   return <Routes>
// //     <Route path="/login" element={<Login />} />
// //     <Route path="/unauthorized" element={<Unauthorized />} />
// //     <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
// //       <Route path="/admin" element={<Dashboard role="admin" />} />
// //       <Route path="/admin/donors" element={<Donors />} />
// //       <Route path="/admin/inventory" element={<SamplePage />} />
// //       <Route path="/admin/hospitals" element={<SamplePage />} />
// //       <Route path="/admin/bloodbanks" element={<SamplePage />} />
// //       <Route path="/admin/requests" element={<SamplePage />} />
// //       <Route path="/admin/users" element={<SamplePage />} />
// //       <Route path="/admin/reports" element={<SamplePage />} />
// //       <Route path="/admin/settings" element={<SamplePage />} />
// //     </Route>
// //     <Route element={<ProtectedRoute allowedRoles={["hospital"]} />}><Route path="/hospital" element={<RoleDashboard role="hospital" />} /><Route path="/hospital/requests" element={<RoleResource />} /><Route path="/hospital/inventory" element={<RoleResource />} /></Route>
// //     <Route element={<ProtectedRoute allowedRoles={["hospital_staff"]} />}><Route path="/hospital-staff" element={<RoleDashboard role="hospital_staff" />} /><Route path="/hospital-staff/requests" element={<RoleResource />} /><Route path="/hospital-staff/inventory" element={<RoleResource />} /></Route>
// //     <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}><Route path="/doctor" element={<RoleDashboard role="doctor" />} /><Route path="/doctor/requests" element={<RoleResource />} /><Route path="/doctor/inventory" element={<RoleResource />} /></Route>
// //     <Route element={<ProtectedRoute allowedRoles={["donor"]} />}><Route path="/donor" element={<RoleDashboard role="donor" />} /><Route path="/donor/inventory" element={<RoleResource />} /></Route>
// //     <Route element={<ProtectedRoute allowedRoles={["patient"]} />}><Route path="/patient" element={<RoleDashboard role="patient" />} /><Route path="/patient/requests" element={<RoleResource />} /><Route path="/patient/inventory" element={<RoleResource />} /></Route>
// //     <Route element={<ProtectedRoute allowedRoles={["user"]} />}><Route path="/user" element={<RoleDashboard role="user" />} /><Route path="/user/inventory" element={<RoleResource />} /></Route>
// //     <Route path="/" element={<Navigate to="/login" replace />} />
// //     <Route path="*" element={<Navigate to="/login" replace />} />
// //   </Routes>;
// // }



// import { Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import RoleDashboard from "./pages/RoleDashboard";
// import Unauthorized from "./pages/Unauthorized";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Donors from "./pages/Donors";
// import SamplePage from "./pages/SamplePage";
// import RoleResource from "./pages/RoleResource";

// import "./pages/Admin.css";
// import "./Donors.css";
// import "./index.css";

// export default function App() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/unauthorized" element={<Unauthorized />} />

//       {/* Admin Routes */}
//       <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
//         <Route
//           path="/admin"
//           element={<Dashboard role="admin" />}
//         />
//         <Route path="/admin/donors" element={<Donors />} />
//         <Route path="/admin/inventory" element={<SamplePage />} />
//         <Route path="/admin/hospitals" element={<SamplePage />} />
//         <Route path="/admin/bloodbanks" element={<SamplePage />} />
//         <Route path="/admin/requests" element={<SamplePage />} />
//         <Route path="/admin/users" element={<SamplePage />} />
//         <Route path="/admin/reports" element={<SamplePage />} />
//         <Route path="/admin/settings" element={<SamplePage />} />
//       </Route>

//       {/* Hospital Routes */}
//       <Route element={<ProtectedRoute allowedRoles={["hospital"]} />}>
//         <Route
//           path="/hospital"
//           element={<RoleDashboard role="hospital" />}
//         />
//         <Route path="/hospital/requests" element={<RoleResource />} />
//         <Route path="/hospital/inventory" element={<RoleResource />} />
//       </Route>

//       {/* Hospital Staff Routes */}
//       <Route
//         element={<ProtectedRoute allowedRoles={["hospital_staff"]} />}
//       >
//         <Route
//           path="/hospital-staff"
//           element={<RoleDashboard role="hospital_staff" />}
//         />
//         <Route
//           path="/hospital-staff/requests"
//           element={<RoleResource />}
//         />
//         <Route
//           path="/hospital-staff/inventory"
//           element={<RoleResource />}
//         />
//       </Route>

//       {/* Blood Bank Staff Routes */}
//       <Route
//         element={<ProtectedRoute allowedRoles={["blood_bank_staff"]} />}
//       >
//         <Route
//           path="/blood-bank-staff"
//           element={<RoleDashboard role="blood_bank_staff" />}
//         />
//         <Route
//           path="/blood-bank-staff/requests"
//           element={<RoleResource />}
//         />
//         <Route
//           path="/blood-bank-staff/inventory"
//           element={<RoleResource />}
//         />
//       </Route>

//       {/* Doctor Routes */}
//       <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
//         <Route
//           path="/doctor"
//           element={<RoleDashboard role="doctor" />}
//         />
//         <Route path="/doctor/requests" element={<RoleResource />} />
//         <Route path="/doctor/inventory" element={<RoleResource />} />
//       </Route>

//       {/* Donor Routes */}
//       <Route element={<ProtectedRoute allowedRoles={["donor"]} />}>
//         <Route
//           path="/donor"
//           element={<RoleDashboard role="donor" />}
//         />
//         <Route path="/donor/inventory" element={<RoleResource />} />
//       </Route>

//       {/* Patient Routes */}
//       <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
//         <Route
//           path="/patient"
//           element={<RoleDashboard role="patient" />}
//         />
//         <Route path="/patient/requests" element={<RoleResource />} />
//         <Route path="/patient/inventory" element={<RoleResource />} />
//       </Route>

//       {/* General User Routes */}
//       <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
//         <Route
//           path="/user"
//           element={<RoleDashboard role="user" />}
//         />
//         <Route path="/user/inventory" element={<RoleResource />} />
//       </Route>

//       {/* Default Routes */}
//       <Route path="/" element={<Navigate to="/login" replace />} />
//       <Route path="*" element={<Navigate to="/login" replace />} />
//     </Routes>
//   );
// }

import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoleDashboard from "./pages/RoleDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import Donors from "./pages/Donors";
import SamplePage from "./pages/SamplePage";
import RoleResource from "./pages/RoleResource";

import "./pages/Admin.css";
import "./Donors.css";
import "./index.css";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route
          path="/admin"
          element={<Dashboard role="admin" />}
        />

        <Route path="/admin/donors" element={<Donors />} />
        <Route path="/admin/inventory" element={<SamplePage />} />
        <Route path="/admin/hospitals" element={<SamplePage />} />
        <Route path="/admin/bloodbanks" element={<SamplePage />} />
        <Route path="/admin/requests" element={<SamplePage />} />
        <Route path="/admin/users" element={<SamplePage />} />
        <Route path="/admin/reports" element={<SamplePage />} />
        <Route path="/admin/settings" element={<SamplePage />} />
      </Route>

      {/* Hospital Routes */}
      <Route element={<ProtectedRoute allowedRoles={["hospital"]} />}>
        <Route
          path="/hospital"
          element={<RoleDashboard role="hospital" />}
        />
        <Route
          path="/hospital/requests"
          element={<RoleResource />}
        />
        <Route
          path="/hospital/inventory"
          element={<RoleResource />}
        />
      </Route>

      {/* Hospital Staff Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["hospital_staff"]} />
        }
      >
        <Route
          path="/hospital-staff"
          element={<RoleDashboard role="hospital_staff" />}
        />
        <Route
          path="/hospital-staff/requests"
          element={<RoleResource />}
        />
        <Route
          path="/hospital-staff/inventory"
          element={<RoleResource />}
        />
      </Route>

      {/* Blood Bank Staff Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["blood_bank_staff"]} />
        }
      >
        <Route
          path="/blood-bank-staff"
          element={<RoleDashboard role="blood_bank_staff" />}
        />
        <Route
          path="/blood-bank-staff/requests"
          element={<RoleResource />}
        />
        <Route
          path="/blood-bank-staff/inventory"
          element={<RoleResource />}
        />
      </Route>

      {/* Doctor Routes */}
      <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
        <Route
          path="/doctor"
          element={<RoleDashboard role="doctor" />}
        />
        <Route
          path="/doctor/requests"
          element={<RoleResource />}
        />
        <Route
          path="/doctor/inventory"
          element={<RoleResource />}
        />
      </Route>

      {/* Donor Routes */}
      <Route element={<ProtectedRoute allowedRoles={["donor"]} />}>
        <Route
          path="/donor"
          element={<RoleDashboard role="donor" />}
        />
        <Route
          path="/donor/inventory"
          element={<RoleResource />}
        />
      </Route>

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
        <Route
          path="/patient"
          element={<RoleDashboard role="patient" />}
        />
        <Route
          path="/patient/requests"
          element={<RoleResource />}
        />
        <Route
          path="/patient/inventory"
          element={<RoleResource />}
        />
      </Route>

      {/* General User Routes */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route
          path="/user"
          element={<RoleDashboard role="user" />}
        />
        <Route
          path="/user/inventory"
          element={<RoleResource />}
        />
      </Route>

      {/* Default Routes */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}
