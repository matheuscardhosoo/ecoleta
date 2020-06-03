import express, { response } from "express";

const app = express();
app.use(express.json())

const users = [
  {
    name: "Flavia",
    email: "flavia@email.com",
  },
  {
    name: "Matheus",
    email: "matheus@email.com",
  },
];

app.get("/users", (request, response) => {
  const search = String(request.query.search);
  const filteredUsers = search
    ? users.filter((user) => user.name.includes(search))
    : users;
  response.json(filteredUsers);
});

app.post("/users", (request, response) => {
  const data = request.body;
  const user = {
    name: data.name,
    email: data.email,
  };

  return response.json(user);
});

app.get("/users/:id", (request, response) => {
  const id = Number(request.params.id);
  response.json({
    id: id,
    name: "Matheus",
    email: "matheus@email.com"
  });
});

app.listen(3333);
