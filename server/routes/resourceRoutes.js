import { Router } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { protect, allowRoles } from "../middleware/auth.js";
import Donor from "../models/Donor.js";
import Hospital from "../models/Hospital.js";
import BloodInventory from "../models/BloodInventory.js";
import BloodRequest from "../models/BloodRequest.js";
import BloodBank from "../models/BloodBank.js";
import User from "../models/User.js";

const router = Router();
router.use(protect);
const adminOnly = allowRoles("admin");
function canWrite(resource, role) {
  if (role === "admin") return true;
  if (resource === "requests") return ["doctor", "hospital", "hospital_staff", "patient"].includes(role);
  // Inventory currently uses a shared, globally unique blood-group schema; only admins may mutate it.
  if (resource === "inventory") return false;
  return false;
}
function writeAccess(req, res, next) {
  if (!configs[req.params.resource]) return res.status(404).json({ message: "Resource not found" });
  if (!canWrite(req.params.resource, req.user.role)) return res.status(403).json({ message: "Not permitted" });
  next();
}
const configs = {
  hospitals: { model: Hospital, fields: ["hospitalId","name","city","contact","email","status"], roles: ["admin"] },
  inventory: { model: BloodInventory, fields: ["inventoryId","group","units","minimum"], roles: ["admin","hospital","hospital_staff","doctor","donor","patient","user"] },
  requests: { model: BloodRequest, fields: ["requestId","patient","hospital","group","units","priority","status","date"], roles: ["admin","hospital","hospital_staff","doctor","patient"] },
  bloodbanks: { model: BloodBank, fields: ["bloodBankId","name","city","address","contact","email","status"], roles: ["admin","hospital","hospital_staff"] },
  users: { model: User, fields: ["name","email","role","hospitalId","isActive"], roles: ["admin"] }
};
function pick(body, fields) { return Object.fromEntries(fields.filter(k => body[k] !== undefined).map(k => [k, body[k]])); }
router.get("/:resource", async (req,res,next) => { try {
 const resource=req.params.resource; const cfg=configs[resource];
 if(!cfg) return res.status(404).json({message:"Resource not found"});
 if(!cfg.roles.includes(req.user.role)) return res.status(403).json({message:"Not permitted"});
 let filter={};
 // Requests are private to their creator unless an administrator is viewing them.
 if(resource === "requests" && req.user.role !== "admin") filter={ requestedBy: req.user._id };
 const data=await cfg.model.find(filter).sort({createdAt:-1}).limit(500).lean();
 if(resource === "users") data.forEach(x=>delete x.password);
 res.json({success:true,data});
 } catch(e){next(e);} });
router.post("/:resource", writeAccess, async(req,res,next)=>{ try { const cfg=configs[req.params.resource]; if(!cfg) return res.status(404).json({message:"Resource not found"}); let input=pick(req.body,cfg.fields); if(req.params.resource === "requests" && req.user.role !== "admin") { input.requestedBy=req.user._id; input.status="Pending"; } if(req.params.resource === "users"){
 if(!req.body.password || String(req.body.password).length<12) return res.status(400).json({message:"User password must be at least 12 characters"});
 input.email=String(input.email || "").trim().toLowerCase();
 if(["hospital","hospital_staff","doctor"].includes(input.role)) {
   if(!input.hospitalId || !mongoose.isValidObjectId(input.hospitalId)) return res.status(400).json({message:"A valid MongoDB Hospital _id is required for this role"});
   const linkedHospital=await Hospital.findById(input.hospitalId);
   if(!linkedHospital) return res.status(400).json({message:"Linked hospital was not found"});
 }
 input.password=await bcrypt.hash(req.body.password,12); input.isActive=req.body.isActive ?? true;
 } const doc=await cfg.model.create(input); const result=doc.toObject(); delete result.password; res.status(201).json({success:true,data:result}); }catch(e){next(e);} });
router.patch("/:resource/:id", writeAccess, async(req,res,next)=>{try{const cfg=configs[req.params.resource];if(!cfg)return res.status(404).json({message:"Resource not found"});if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:"Invalid record ID"});const input=pick(req.body,cfg.fields);if(req.params.resource === "requests" && req.user.role !== "admin") { const existing=await cfg.model.findById(req.params.id); if(!existing || String(existing.requestedBy)!==String(req.user._id)) return res.status(403).json({message:"You can only update your own requests"}); delete input.status; delete input.hospital; delete input.requestId; }if(req.params.resource === "users") {
 if(input.email) input.email=String(input.email).trim().toLowerCase();
 if(["hospital","hospital_staff","doctor"].includes(input.role || "") || input.hospitalId) {
   const targetRole=input.role || (await User.findById(req.params.id))?.role;
   const hospitalId=input.hospitalId || (await User.findById(req.params.id))?.hospitalId;
   if(["hospital","hospital_staff","doctor"].includes(targetRole)) {
     if(!hospitalId || !mongoose.isValidObjectId(hospitalId) || !await Hospital.exists({_id:hospitalId})) return res.status(400).json({message:"A valid linked hospital is required for this role"});
     input.hospitalId=hospitalId;
   }
 }
 if(req.body.password){if(String(req.body.password).length<12)return res.status(400).json({message:"Password must be at least 12 characters"});input.password=await bcrypt.hash(req.body.password,12);}
 }const doc=await cfg.model.findByIdAndUpdate(req.params.id,{$set:input},{new:true,runValidators:true}).select("-password");if(!doc)return res.status(404).json({message:"Record not found"});res.json({success:true,data:doc});}catch(e){next(e);}});
router.patch("/:resource/:id/status", adminOnly, async(req,res,next)=>{try{const cfg=configs[req.params.resource];if(!cfg)return res.status(404).json({message:"Resource not found"});if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:"Invalid record ID"});const doc=await cfg.model.findById(req.params.id);if(!doc)return res.status(404).json({message:"Record not found"});if(req.params.resource === "users"){doc.isActive=!doc.isActive;}else if("status" in doc){doc.status=doc.status === "Active" ? "Inactive" : "Active";}else if(req.params.resource === "inventory"){return res.status(400).json({message:"Inventory has no active status"});}else{return res.status(400).json({message:"This record has no status field"});}await doc.save();const result=doc.toObject();delete result.password;res.json({success:true,data:result});}catch(e){next(e);}});
router.delete("/:resource/:id", adminOnly, async(req,res,next)=>{try{const cfg=configs[req.params.resource];if(!cfg)return res.status(404).json({message:"Resource not found"});if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:"Invalid record ID"});if(req.params.resource === "requests" && req.user.role !== "admin") { const existing=await cfg.model.findById(req.params.id); if(!existing || String(existing.requestedBy)!==String(req.user._id)) return res.status(403).json({message:"You can only delete your own requests"}); }const doc=await cfg.model.findByIdAndDelete(req.params.id);if(!doc)return res.status(404).json({message:"Record not found"});res.json({success:true,message:"Record deleted"});}catch(e){next(e);}});
export default router;
