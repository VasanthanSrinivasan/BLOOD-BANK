# LifeLine - MongoDB Demo Data Seed

This project includes a repeatable seed script that inserts the sample records into MongoDB so they appear in Atlas Browse Collections. It does not delete existing records.

## Steps (PowerShell)

1. Open a terminal in `blood-bank-system/server`.
2. Ensure `server/.env` contains a working `MONGODB_URI=...` for the `lifeline_blood_bank` database. Do not share `.env` or commit it.
3. Install packages:
   ```powershell
   npm install
   ```
4. Insert sample records:
   ```powershell
   npm run seed-demo
   ```
5. Open MongoDB Atlas > Database > Browse Collections > `lifeline_blood_bank`, then refresh.

## Seeded collections

- `donors`: 6 demo donor profiles
- `bloodinventories`: 8 blood group stock records
- `hospitals`: 4 demo hospital records
- `bloodrequests`: 5 demo blood requests
- `users`: 4 demo staff/patient users (passwords are hashed)

The seed uses upserts and stable demo IDs, so re-running it updates the same demo records rather than creating duplicates. The records are clearly demo data and should not be treated as real donors or real blood stock.

Note: seeding records into MongoDB does not by itself connect the inventory/hospital/request/user pages to live APIs. Those pages in the current sample UI still display local demo arrays until their CRUD APIs are implemented and wired to the frontend.
