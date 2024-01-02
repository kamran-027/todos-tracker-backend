const zod = require("zod");

const createTodo = zod.object({
  title: zod.string(),
  description: zod.string(),
});

const updateTodo = zod.object({
  id: zod.string(),
});

const userDetails = zod.object({
  username: zod.string().min(4),
  password: zod.string().min(4),
});

module.exports = {
  createTodo: createTodo,
  updateTodo: updateTodo,
  userDetails: userDetails,
};
