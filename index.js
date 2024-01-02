const express = require("express");
const app = express();
const { createTodo, updateTodo, userDetails } = require("./types");
const { todo } = require("./db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const isValidUser = require("./middlewares/authCheck");

const port = 3000;

app.use(express.json());
app.use(cors());

app.post("/signin", function (req, res) {
  const userPayload = req.body.userDetails;
  const parsedUserPayload = userDetails.safeParse(userPayload);

  if (!parsedUserPayload.success) {
    res.status(411).json({
      err: "Inputs are not valid",
    });
    return;
  }

  const token = jwt.sign(
    {
      userDetails: userDetails,
    },
    process.env.jwtPass
  );

  res.status(200).json({ token: token });
});

app.get("/todos", isValidUser, async function (req, res) {
  const todos = await todo.find({});

  res.json({
    todos,
  });
});

app.post("/todo", isValidUser, async function (req, res) {
  const createPayload = req.body;
  const parsedPayload = createTodo.safeParse(createPayload);
  if (!parsedPayload.success) {
    res.status(411).json({
      msg: "You sent wrong inputs",
    });
    return;
  }
  await todo.create({
    title: createPayload.title,
    description: createPayload.description,
    completed: false,
  });

  res.json({
    msg: "Todo is created",
  });
});

app.put("/completed", isValidUser, async function (req, res) {
  const updatePayload = req.body;
  const parsedUpdatePayload = updateTodo.safeParse(updatePayload);
  if (!parsedUpdatePayload.success) {
    res.status(411).json({
      msg: "You sent wrong inputs",
    });
    return;
  }

  await todo.updateOne(
    {
      _id: updatePayload.id,
    },
    {
      completed: true,
    }
  );

  res.status(200).json({
    msg: "Todo marked as completed",
  });
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(501).json({
    err: "There is something up with server",
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
