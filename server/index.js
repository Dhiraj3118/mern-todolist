// declarations and imports
const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');


// connecting to database
mongoose.connect('mongodb://localhost/todo');

const Todo = mongoose.model('Todo', {
    text: String,
    complete: Boolean
});

// typedefs are for defining the input and output datatypes of queries and mutations. all the functioning is defined in resolvers

// Queries are for getting the data while mutations are for inserting, updating and deleting the data

// all other declarations are used as datatypes. 
const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]   
  }
  type Todo{
      id: ID!
      text: String!
      complete: Boolean!
  }
  type Mutation {
      createTodo(text: String!): Todo
      updateTodo(id: ID!, complete: Boolean!): Boolean
      removeTodo(id: ID!): Boolean
  }
  `;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    todos: () => Todo.find()
  },
  Mutation: {
      createTodo: async(_, { text }) => {
          const todo = new Todo({text, complete: false});
          await todo.save();
          return todo;
      },
      updateTodo: async(_, { id, complete }) => {
        await Todo.findByIdAndUpdate(id, {complete}, (err, docs) => {
          if(err)
          {
            return false;
          }
          else{
            return true;
          }
        });
      },
      removeTodo: async(_, { id }) => {
        await Todo.findByIdAndRemove(id);
        return true;
      }
  }
}


// creating a server
const server = new GraphQLServer({ typeDefs, resolvers });

// starting the connection and server
mongoose.connection.once("open", () => {
    server.start(() => console.log('Server is running on localhost:4000'));
})