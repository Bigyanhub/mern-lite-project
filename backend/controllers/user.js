import db from "../database/db.js";

//This one is just for testing GET request
export const getData = (req, res) => {
  res.send("Hello, this is the data you requested! using getData controller");
};


// For inserting a new user into the database use addUser function and path /addUser
export const addUser = (req, res) => {
  const { name, email, password } = req.body;
  // Check if all required fields are provided
  if (!name || !email || !password) {
    return res.send({ message: "All fields are required" });
  }
  const q1 = `INSERT INTO  user (name, email, password) VALUES (?, ?, ?)`;
  db.query(q1, [name, email, password], (err, result) => {
    if (err) {
      return res.send({ message: "Error inserting data", err });
    }
    // After successful insert, send response
    return res.send({ message: "Data inserted successfully", result });
  });
};


//For deleting a user from the database use deleteUser function
export const deleteUser = (req, res) => {
  const { id } = req.params;
  
  const q = `DELETE FROM user WHERE id = ?`;
  db.query(q, [id], (err, result) => {
    if (err) {
      return res.json({ message: "Error in deleting data", err });
    }
    
    if (result.affectedRows === 0) {
      return res.json({ message: "User not found or already deleted" });
    }
    
    return res.json({ message: "Data deleted successfully", result });
  });
};


//For updating a user in the database use updateUser function
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const q = `UPDATE user SET name = ? , email = ? , password = ? WHERE id = ?`;
  db.query(q, [name, email, password, id], (err, result) => {
    if (err) {
      return res.send({ message: "Error in updating data", err });
    }
    return res.send({ message: "Data updated successfully", result });
  });
};


// For showing all users from the database use showAllUsers function
export const showAllUser = (req, res) => {
  const q2 = `SELECT * FROM user`;
  db.query(q2, (err, result) => {
    if (err) {
      return res.send({ message: "Error in fetching and selecting data", err });
    }
    return res.send({ message: "Data fetched successfully", result });
  });
};

// For showing a single user from the database use getOneUser function

export const getOneUser = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM user WHERE id = ?", [id], (err, result) => {
    if (err) return res.send({ message: "Error", err });
    if (result.length === 0) return res.send({ message: "User not found" });
    res.send({ message: "User found", user: result[0] });
  });
};
