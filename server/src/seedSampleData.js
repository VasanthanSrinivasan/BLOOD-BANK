
import 'dotenv/config';
import mongoose from 'mongoose';

import Donor from './models/Donor.js';
import Donation from './models/Donation.js';
import Inventory from './models/Inventory.js';
import BloodRequest from './models/BloodRequest.js';

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const sampleDonors = [
  {
    name: 'Arun Kumar',
    age: 28,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '9000000001',
    email: 'arun.sample@example.com',
    city: 'Chennai',
    notes: 'Sample donor record'
  },
  {
    name: 'Priya Devi',
    age: 25,
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '9000000002',
    email: 'priya.sample@example.com',
    city: 'Coimbatore',
    notes: 'Sample donor record'
  },
  {
    name: 'Karthik Raj',
    age: 32,
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '9000000003',
    email: 'karthik.sample@example.com',
    city: 'Madurai',
    notes: 'Sample donor record'
  },
  {
    name: 'Meena Lakshmi',
    age: 30,
    gender: 'Female',
    bloodGroup: 'AB+',
    phone: '9000000004',
    email: 'meena.sample@example.com',
    city: 'Salem',
    notes: 'Sample donor record'
  },
  {
    name: 'Suresh Babu',
    age: 35,
    gender: 'Male',
    bloodGroup: 'O-',
    phone: '9000000005',
    email: 'suresh.sample@example.com',
    city: 'Trichy',
    notes: 'Sample donor record'
  }
];

const sampleRequests = [
  {
    hospitalName: 'City Care Hospital',
    contactName: 'Dr. Ravi',
    phone: '9110000001',
    bloodGroup: 'O+',
    units: 2,
    requiredBy: daysFromNow(3),
    urgency: 'Urgent',
    status: 'Pending',
    notes: 'SAMPLE-REQUEST-01'
  },
  {
    hospitalName: 'Green Life Hospital',
    contactName: 'Dr. Nisha',
    phone: '9110000002',
    bloodGroup: 'A+',
    units: 1,
    requiredBy: daysFromNow(5),
    urgency: 'Routine',
    status: 'Pending',
    notes: 'SAMPLE-REQUEST-02'
  },
  {
    hospitalName: 'Sunrise Medical Centre',
    contactName: 'Dr. Kumar',
    phone: '9110000003',
    bloodGroup: 'B+',
    units: 2,
    requiredBy: daysFromNow(2),
    urgency: 'Emergency',
    status: 'Pending',
    notes: 'SAMPLE-REQUEST-03'
  },
  {
    hospitalName: 'Royal Multispeciality',
    contactName: 'Dr. Priya',
    phone: '9110000004',
    bloodGroup: 'AB+',
    units: 1,
    requiredBy: daysFromNow(7),
    urgency: 'Routine',
    status: 'Approved',
    notes: 'SAMPLE-REQUEST-04'
  },
  {
    hospitalName: 'Hope General Hospital',
    contactName: 'Dr. Anand',
    phone: '9110000005',
    bloodGroup: 'O-',
    units: 1,
    requiredBy: daysFromNow(1),
    urgency: 'Urgent',
    status: 'Pending',
    notes: 'SAMPLE-REQUEST-05'
  }
];

async function seedSampleData() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB.');

  // 1. Insert five donors without duplicating phone numbers.
  const donors = [];

  for (const data of sampleDonors) {
    let donor = await Donor.findOne({ phone: data.phone });

    if (!donor) {
      donor = await Donor.create(data);
      console.log('Created donor:', donor.name);
    } else {
      console.log('Donor already exists:', donor.name);
    }

    donors.push(donor);
  }

  // 2. Insert five donation records.
  // These dates are recent and each donation is marked Eligible.
  for (let i = 0; i < donors.length; i++) {
    const donor = donors[i];
    const donationDate = daysFromNow(-(i + 2));

    const exists = await Donation.findOne({
      donor: donor._id,
      notes: `SAMPLE-DONATION-0${i + 1}`
    });

    if (!exists) {
      await Donation.create({
        donor: donor._id,
        bloodGroup: donor.bloodGroup,
        units: 1,
        donationDate,
        screeningStatus: 'Eligible',
        notes: `SAMPLE-DONATION-0${i + 1}`
      });

      console.log('Created donation for:', donor.name);
    }
  }

  // 3. Insert five inventory batches.
  // All expiry dates are in the future.
  for (let i = 0; i < donors.length; i++) {
    const donor = donors[i];
    const collectionDate = daysFromNow(-(i + 2));
    const expiryDate = daysFromNow(35 - i);

    const exists = await Inventory.findOne({
      donor: donor._id,
      notes: `SAMPLE-STOCK-0${i + 1}`
    });

    if (!exists) {
      await Inventory.create({
        bloodGroup: donor.bloodGroup,
        units: i === 0 ? 5 : i === 1 ? 8 : i === 2 ? 12 : i === 3 ? 4 : 6,
        collectionDate,
        expiryDate,
        donor: donor._id,
        source: 'Donation',
        notes: `SAMPLE-STOCK-0${i + 1}`
      });

      console.log('Created stock batch:', donor.bloodGroup);
    }
  }

  // 4. Insert five hospital requests.
  for (const data of sampleRequests) {
    const exists = await BloodRequest.findOne({
      notes: data.notes
    });

    if (!exists) {
      await BloodRequest.create(data);
      console.log('Created hospital request:', data.hospitalName);
    }
  }

  console.log('\nSample data seeding completed.');
  console.log('Expected sample counts: 5 donors, 5 donations,');
  console.log('5 inventory batches, and 5 hospital requests.');
}

try {
  await seedSampleData();
} catch (error) {
  console.error('Sample data seeding failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
