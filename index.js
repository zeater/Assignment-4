const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const filePath = "./users.json";

function readUsers() {
  let data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data || "[]");
}

function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

//1-add user
app.post("/user", (req, res) => {
  let users = readUsers();
  let { name, age, email } = req.body;

  let exist = users.find(u => u.email === email);
  if (exist) {
    return res.json({ message: "email already exists" });
  }

  let newUser = {
    id: users.length + 1,
    name: name,
    age: age,
    email: email
  };

  users.push(newUser);
  writeUsers(users);

  res.json({ message: "user added successfully" });
});

//2-update user by id
app.patch("/user/:id", (req, res) => {
  let users = readUsers();
  let id = Number(req.params.id);

  let user = users.find(u => u.id === id);
  if (!user) {
    return res.json({ message: "user id not found" });
  }

  let { name, age, email } = req.body;

  if (name) user.name = name;
  if (age) user.age = age;
  if (email) user.email = email;

  writeUsers(users);
  res.json({ message: "user updated successfully" });
});

//3-delete user by id
app.delete("/user/:id", (req, res) => {
  let users = readUsers();
  let id = Number(req.params.id);

  let index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.json({ message: "user id not found" });
  }

  users.splice(index, 1);
  writeUsers(users);

  res.json({ message: "user deleted successfully" });
});

//4-get user by name
app.get("/user/getByName", (req, res) => {
  let users = readUsers();
  let name = req.query.name;

  let user = users.find(u => u.name === name);
  if (!user) {
    return res.json({ message: "user name not found" });
  }

  res.json(user);
});

//5-get all users
app.get("/user", (req, res) => {
  let users = readUsers();
  res.json(users);
});

//6-filter users by min age
app.get("/user/filter", (req, res) => {
  let users = readUsers();
  let minAge = Number(req.query.minAge);

  let result = users.filter(u => u.age >= minAge);
  if (result.length === 0) {
    return res.json({ message: "no user found" });
  }

  res.json(result);
});

//7-get user by id
app.get("/user/:id", (req, res) => {
  let users = readUsers();
  let id = Number(req.params.id);

  let user = users.find(u => u.id === id);
  if (!user) {
    return res.json({ message: "user not found" });
  }

  res.json(user);
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});