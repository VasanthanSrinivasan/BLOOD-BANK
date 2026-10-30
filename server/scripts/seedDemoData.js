import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Donor from "../models/Donor.js";
import BloodInventory from "../models/BloodInventory.js";
import Hospital from "../models/Hospital.js";
import BloodRequest from "../models/BloodRequest.js";
import User from "../models/User.js";
import BloodBank from "../models/BloodBank.js";

const donors = [
  { donorId:"DNR-1001", name:"Arun Kumar", email:"arun.demo@example.com", phone:"9000001001", bloodGroup:"O+", age:28, city:"Chennai", lastDonationDate:"2026-06-12", availability:"Available" },
  { donorId:"DNR-1002", name:"Priya S", email:"priya.demo@example.com", phone:"9000001002", bloodGroup:"A+", age:25, city:"Coimbatore", lastDonationDate:"2026-04-08", availability:"Available" },
  { donorId:"DNR-1003", name:"Mohammed Rahim", email:"rahim.demo@example.com", phone:"9000001003", bloodGroup:"B+", age:34, city:"Salem", lastDonationDate:"2025-12-21", availability:"Unavailable" },
  { donorId:"DNR-1004", name:"Divya R", email:"divya.demo@example.com", phone:"9000001004", bloodGroup:"AB+", age:29, city:"Erode", lastDonationDate:"2026-02-15", availability:"Available" },
  { donorId:"DNR-1005", name:"Karthik M", email:"karthik.demo@example.com", phone:"9000001005", bloodGroup:"O-", age:31, city:"Tiruppur", lastDonationDate:"2026-05-02", availability:"Available" },
  { donorId:"DNR-1006", name:"Meena Lakshmi", email:"meena.demo@example.com", phone:"9000001006", bloodGroup:"B-", age:23, city:"Madurai", availability:"Unavailable" }
];
const inventory = [
  ["INV-01","A+",24,10],["INV-02","A-",8,10],["INV-03","B+",18,10],["INV-04","B-",6,8],
  ["INV-05","AB+",12,6],["INV-06","AB-",4,5],["INV-07","O+",32,12],["INV-08","O-",7,10]
].map(([inventoryId,group,units,minimum])=>({inventoryId,group,units,minimum,updated:new Date(),demoRecord:true}));
const hospitals = [
  ["HSP-101","Government General Hospital","Chennai","044-25305000","contact@ggh.demo.example","Active"],
  ["HSP-102","KMCH Hospital","Coimbatore","0422-4323800","help@kmch.demo.example","Active"],
  ["HSP-103","City Care Medical Centre","Salem","0427-2345678","care@citycare.demo.example","Active"],
  ["HSP-104","Sunrise Multispeciality","Madurai","0452-2678900","info@sunrise.demo.example","Pending"]
].map(([hospitalId,name,city,contact,email,status])=>({hospitalId,name,city,contact,email,status,demoRecord:true}));
const bloodBanks = [
  {bloodBankId:"BB-301",name:"LifeLine Central Blood Bank",city:"Chennai",address:"Demo Road, Chennai",contact:"044-20000001",email:"central.demo@example.com",status:"Active",demoRecord:true},
  {bloodBankId:"BB-302",name:"Coimbatore Community Blood Bank",city:"Coimbatore",address:"Demo Avenue, Coimbatore",contact:"0422-2000002",email:"coimbatore.demo@example.com",status:"Active",demoRecord:true},
  {bloodBankId:"BB-303",name:"Salem Regional Blood Centre",city:"Salem",address:"Demo Street, Salem",contact:"0427-2000003",email:"salem.demo@example.com",status:"Pending",demoRecord:true}
];
const requests = [
  ["REQ-2001","R. Suresh","Government General Hospital","O-",2,"Critical","Pending","2026-10-28"],
  ["REQ-2002","Anitha P","KMCH Hospital","A+",1,"High","Approved","2026-10-27"],
  ["REQ-2003","M. Joseph","City Care Medical Centre","B+",3,"Normal","Completed","2026-10-25"],
  ["REQ-2004","Kavitha S","Sunrise Multispeciality","AB+",1,"High","Pending","2026-10-28"],
  ["REQ-2005","Naveen K","KMCH Hospital","O+",2,"Normal","Rejected","2026-10-23"]
].map(([requestId,patient,hospital,group,units,priority,status,date])=>({requestId,patient,hospital,group,units,priority,status,date,demoRecord:true}));
const users = [
  {name:"Dr. Nandhini (Demo)",email:"nandhini.demo@example.com",role:"doctor",isActive:true},
  {name:"KMCH Blood Desk (Demo)",email:"blooddesk.demo@example.com",role:"hospital",isActive:true},
  {name:"Demo Patient",email:"patient.demo@example.com",role:"patient",isActive:false},
  {name:"Demo Staff",email:"staff.demo@example.com",role:"user",isActive:true}
];

async function upsertMany(Model, items, key) {
  for (const item of items) {
    await Model.updateOne({[key]:item[key]}, {$set:{...item, demoRecord:true}}, {upsert:true, runValidators:true});
  }
}
async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing in server/.env");
  await mongoose.connect(process.env.MONGODB_URI);
  await upsertMany(Donor, donors, "donorId");
  await upsertMany(BloodInventory, inventory, "group");
  await upsertMany(Hospital, hospitals, "hospitalId");
  await upsertMany(BloodBank, bloodBanks, "bloodBankId");
  await upsertMany(BloodRequest, requests, "requestId");
  const password = await bcrypt.hash("DemoOnly_Change123!", 12);
  for (const item of users) {
    await User.updateOne({email:item.email}, {$setOnInsert:{...item,password}}, {upsert:true, runValidators:true});
  }
  console.log("Demo seed complete:");
  console.log(`Donors: ${donors.length}; Blood inventory: ${inventory.length}; Hospitals: ${hospitals.length}; Blood banks: ${bloodBanks.length}; Blood requests: ${requests.length}; Demo users: ${users.length}`);
  console.log("Open MongoDB Atlas > Browse Collections > lifeline_blood_bank.");
}
main().catch(err=>{console.error("Demo seed failed:",err.message);process.exitCode=1;}).finally(async()=>{await mongoose.disconnect();});
