import express from 'express';
import { addUser, deleteUser, updateUser, showAllUser, getOneUser } from '../controllers/user.js';
const route= express.Router();

// Define routes for user operations
route.post("/addUser", addUser)
route.delete("/deleteUser/:id", deleteUser)
route.put("/updateUser/:id", updateUser)
route.get("/showAllUser", showAllUser)
route.get("/getOneUser/:id", getOneUser)

export default route