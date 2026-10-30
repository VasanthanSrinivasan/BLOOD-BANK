import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router=Router(); router.use(protect,allowRoles("admin"));
router.get("/",async(_req,res,next)=>{try{const users=await User.find().select("name email role isActive createdAt hospitalId").sort({createdAt:-1}).lean();res.json({success:true,data:users});}catch(e){next(e);}});
router.patch("/:id",async(req,res,next)=>{try{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:"Invalid user ID"});const allowed={};if(typeof req.body.isActive==="boolean")allowed.isActive=req.body.isActive;if(["admin","doctor","patient","user","hospital"].includes(req.body.role))allowed.role=req.body.role;if(req.params.id===req.user.id && allowed.isActive===false)return res.status(400).json({message:"You cannot deactivate your own account"});const user=await User.findByIdAndUpdate(req.params.id,{$set:allowed},{new:true,runValidators:true}).select("name email role isActive createdAt hospitalId").lean();if(!user)return res.status(404).json({message:"User not found"});res.json({success:true,data:user});}catch(e){next(e);}});
export default router;
