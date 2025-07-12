import db from "../database/db.js";
import bcrypt from "bcryptjs";



/* ----------------------------- Test Route ----------------------------- */
export const getData = (req, res) => {
  res.send("Hello, this is the data you requested! using getData controller");
};

/* --------------------------- Get All Users ---------------------------- */
export const showAllUser = (req, res) => {
  const q = `SELECT * FROM user`;
  db.query(q, (err, result) => {
    if (err) return res.send({ message: "Sabaai user lana garda error aayo", err });
    return res.send({ message: "Users sabai aayeko cha", users: result, count: result.length });
  });
};

/* ---------------------------- Add User ----------------------------- */
export const addUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.send({ message: "Name, email, ra password chaiyo hai!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const q = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    db.query(q, [name, email, hashedPassword], (err, result) => {
      if (err) return res.send({ message: "Data insert garda error aayo", err });
      return res.send({ message: "User add bhayo", result });
    });
  } catch (err) {
    return res.send({ message: "Password hash garda error aayo", err });
  }
};

/* ---------------------------- Delete User ----------------------------- */
export const deleteUser = (req, res) => {
  const { id } = req.params;

  const checkQuery = "SELECT * FROM user WHERE id = ?";
  db.query(checkQuery, [id], (err, checkResult) => {
    if (err) return res.send({ message: "User khojdai error aayo", err });

    if (checkResult.length === 0) return res.send({ message: "User paena bhai" });

    const deleteQuery = "DELETE FROM user WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.send({ message: "User delete garda error aayo", err });
      return res.send({ message: "User hatayo", result });
    });
  });
};

/* ---------------------------- Update User ----------------------------- */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.send({ message: "Name, email, password sab chaiyo hai" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const checkQuery = "SELECT * FROM user WHERE id = ?";
    db.query(checkQuery, [id], (err, checkResult) => {
      if (err) return res.send({ message: "User khojdai error aayo", err });

      if (checkResult.length === 0) return res.send({ message: "User paena bhai" });

      const updateQuery = "UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?";
      db.query(updateQuery, [name, email, hashedPassword, id], (err, result) => {
        if (err) return res.send({ message: "User update garda error aayo", err });
        return res.send({ message: "User update bhayo", result, updatedUser: { id, name, email } });
      });
    });
  } catch (err) {
    return res.send({ message: "Password hash garda error aayo", err });
  }
};

/* ---------------------------- Get Single User ----------------------------- */
export const getOneUser = (req, res) => {
  const { id } = req.params;

  if (!id) return res.send({ message: "User ID chaiyo hai" });

  const query = "SELECT * FROM user WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.send({ message: "User khojdai error aayo", err });

    if (result.length === 0) return res.send({ message: "User paena bhai" });

    return res.send({ message: "User paayo", user: result[0] });
  });
};

/* ---------------------------- Login User ----------------------------- */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.send({ message: "Email ra password chaiyo hai" });

  try {
    const query = "SELECT * FROM user WHERE email = ?";
    db.query(query, [email], async (err, result) => {
      if (err) return res.send({ message: "User khojdai error aayo", err });

      if (result.length === 0) return res.send({ message: "User paena / email milena" });

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.send({ message: "Password milena" });

      return res.send({ message: "Login bhayo", user: { id: user.id, name: user.name, email: user.email } });
    });
  } catch (err) {
    return res.send({ message: "Password verify garda error aayo", err });
  }
};
