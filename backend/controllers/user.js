import db from "../database/db.js";
import bcrypt from "bcryptjs";

/* ----------------------------- GET test message ---------------------------- */
export const getData = (req, res) => {
  res.send("Hello, this is the data you requested! using getData controller");
};

/* ----------------------------- Add new user ----------------------------- */
export const addUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Adding user:", { name, email });

  // Check required fields
  if (!name || !email || !password) {
    console.log("Missing fields");
    return res.send({ message: "All fields are required" });
  }

  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const q1 = `INSERT INTO  user (name, email, password) VALUES (?, ?, ?)`;
    db.query(q1, [name, email, hashPassword], (err, result) => {
      if (err) {
        console.log("Insert error:", err);
        return res.send({ message: "Error inserting data", err });
      }
      console.log("Insert success:", result);
      return res.send({ message: "Data inserted successfully", result });
    });
  } catch (err) {
    return res.send({ message: "Error hassing password", err });
  }
};

/* ----------------------------- Delete user ----------------------------- */
export const deleteUser = (req, res) => {
  const { id } = req.params;
  console.log("Deleting user with ID:", id);

  const q = `DELETE FROM user WHERE id = ?`;
  db.query(q, [id], (err, result) => {
    if (err) {
      console.log("Delete error:", err);
      return res.json({ message: "Error in deleting data", err });
    }
    if (result.affectedRows === 0) {
      console.log("No user found to delete");
      return res.json({ message: "User not found or already deleted" });
    }
    console.log("Delete success:", result);
    return res.json({ message: "Data deleted successfully", result });
  });
};

/* ----------------------------- Update user ----------------------------- */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  console.log("Updating user:", { id, name, email });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const q = `UPDATE user SET name = ? , email = ? , password = ? WHERE id = ?`;
    db.query(q, [name, email, hashPassword, id], (err, result) => {
      if (err) {
        console.log("Update error:", err);
        return res.send({ message: "Error in updating data", err });
      }
      console.log("Update success:", result);
      return res.send({ message: "Data updated successfully", result });
    });
  } catch (err) {
    return res.send({ message: "Error hashing password", err });
  }
};

/* ----------------------------- Show all users ----------------------------- */
export const showAllUser = (req, res) => {
  console.log("Fetching all users");
  const q2 = `SELECT * FROM user`;
  db.query(q2, (err, result) => {
    if (err) {
      console.log("Fetch error:", err);
      return res.send({ message: "Error in fetching and selecting data", err });
    }
    console.log("Fetch success:", result.length, "users found");
    return res.send({ message: "Data fetched successfully", result });
  });
};

/* ----------------------------- Show one user ----------------------------- */
export const getOneUser = (req, res) => {
  const { id } = req.params;
  console.log("Fetching user with ID:", id);

  db.query("SELECT * FROM user WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log("Fetch single user error:", err);
      return res.send({ message: "Error", err });
    }
    if (result.length === 0) {
      console.log("User not found");
      return res.send({ message: "User not found" });
    }
    console.log("User found:", result[0]);
    res.send({ message: "User found", user: result[0] });
  });
};
