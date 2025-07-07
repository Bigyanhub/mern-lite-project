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
    return res.status(400).json({ message: "All fields are required" });
  }
  
  const q1 = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
  db.query(q1, [name, email, password], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error inserting data", err });
    }
    // After successful insert, send response
    return res.status(201).json({ message: "Data inserted successfully", result });
  });
};

//For deleting a user from the database use deleteUser function
export const deleteUser = (req, res) => {
  const { id } = req.params;

  // First check if user exists
  const checkQuery = "SELECT * FROM user WHERE id = ?";
  db.query(checkQuery, [id], (err, checkResult) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error checking user", err });
    }
    
    if (checkResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // User exists, proceed with deletion
    const deleteQuery = "DELETE FROM user WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error deleting data", err });
      }
      
      return res.status(200).json({ message: "User deleted successfully", result });
    });
  });
};

//For updating a user in the database use updateUser function
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // First check if user exists
  const checkQuery = "SELECT * FROM user WHERE id = ?";
  db.query(checkQuery, [id], (err, checkResult) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error checking user", err });
    }
    
    if (checkResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // User exists, proceed with update
    const updateQuery = "UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?";
    db.query(updateQuery, [name, email, password, id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error updating data", err });
      }
      
      return res.status(200).json({ 
        message: "User updated successfully", 
        result,
        updatedUser: { id, name, email }
      });
    });
  });
};

// For showing all users from the database use showAllUsers function
export const showAllUser = (req, res) => {
  const q2 = "SELECT * FROM user";
  db.query(q2, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching data", err });
    }
    
    return res.status(200).json({ 
      message: "Data fetched successfully", 
      result,
      count: result.length
    });
  });
};

// For showing a single user from the database use getOneUser function
export const getOneUser = (req, res) => {
  const { id } = req.params;
  
  // Validate ID parameter
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  
  const query = "SELECT * FROM user WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching user", err });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({ 
      message: "User found successfully", 
      user: result[0] 
    });
  });
};