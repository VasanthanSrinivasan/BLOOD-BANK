# LifeLine role-based authentication update

## Implemented
- Public registration creates only `donor`, `patient`, or `user` accounts. Registration cannot grant `admin`, `hospital`, `hospital_staff`, or `doctor` privileges.
- Passwords are hashed with bcrypt; passwords must be at least 12 characters for registration/admin-created accounts.
- Login issues a signed JWT; authenticated API requests resolve the current user and active status from MongoDB.
- Client routes are guarded by role, with dashboards for admin, hospital, hospital staff, doctor, donor, patient, and user.
- Admin can create user accounts in User Management. Hospital, hospital_staff, and doctor accounts require a valid MongoDB Hospital `_id` in `hospitalId`.
- Non-admin blood requests are stamped with `requestedBy` server-side, forced to `Pending`, and only returned to their creator. Non-admin users cannot set request status or change the request ID/hospital while editing.
- Non-admin inventory access is read-only; inventory updates are admin-only because the existing inventory schema has one globally unique record per blood group.
- Existing admin CRUD, donor pages, sample-data seeding, and report export pages have been retained.

## Setup
1. Keep your existing `server/.env` private. Set `MONGODB_URI`, `JWT_SECRET`, `PORT`, and `CLIENT_URL`.
2. In `server`, run `npm install`, then `npm run seed-demo` if you need demo records, then `npm run dev`.
3. Create the initial administrator once, using `ADMIN_NAME`, `ADMIN_EMAIL`, and a 12+ character `ADMIN_PASSWORD` in `server/.env`, then run `npm run create-admin`.
4. In `client`, run `npm install` (not `npm ci` with an old lockfile), then `npm run dev`. The client needs `VITE_API_URL=http://localhost:5000/api` in `client/.env` if using the default API address.
5. Register public accounts from the Login page using Donor, Patient, or General User. Sign in with the same email/password. The correct dashboard is selected from the database role.
6. Create hospital records first in Admin > Hospital Management. Copy the hospital document's MongoDB `_id` (not its display hospitalId) into `hospitalId` when creating a hospital, hospital_staff, or doctor account.

## Important scope/production notes
- This is a development implementation, not a production-certified medical system. Run integration tests with your own MongoDB database before using it with real people or patient information.
- The current inventory schema is global (blood group is unique globally) rather than per hospital, so non-admin inventory changes are intentionally blocked. Hospital-specific inventory management requires a data migration and a hospital ownership field.
- Hospital/Staff/Doctor accounts are linked to a Hospital document through `hospitalId`, but all existing data models do not yet consistently include hospital ownership. Do not treat this as complete tenant isolation for every resource.
- Email verification, password reset, MFA, audit logging, and production deployment hardening are not included.
- The frontend build was not verified in this environment because dependency installation timed out. Run `npm install` and `npm run build` locally and report any build error for follow-up.
