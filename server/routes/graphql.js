const { buildSchema } = require("graphql")
const { Page, User } = require("../models");

const schema = buildSchema(`
type User {
    id: ID!
    name: String!
    email: String!
}

type Page {
    id: ID!
    title: String!
    slug: String!
    content: String!
    status: String!
    createdAt: String!
    updatedAt: String!
    authorId: ID!
    author: User
}

type Query {
    getUsers: [User!]
    getSingleUser(id: ID!): User!
    getPages: [Page!]
    getSinglePage(id: ID!): Page!
}

type Mutation {
    createUser(name: String!, email: String!): User
}
`);

const root = {
//bulk get
  getUsers : async () => {
    users = await User.findAll();
    return users;
  },
  getPages : async () => {
    pages = await Page.findAll({
        include: {
            model: User,
            as: "author"
        }
    });
    return pages;
  },
//single get
  getUser : async (params) => {
    user = await User.findByPk(params.id);
    return user;
  },
  getPage : async (params) => {
    page = await Page.findByPk(params.id, {
        include: {
            model: User,
            as: "author"
        }
    });
    return page;
  },
  //Mutation functions
  createUser: async (params) => {
    if (params.name.length < 2) throw new Error("invalid parameters")

    newUser = await User.create(params);
    return newUser;
  }
};

module.exports = { schema, root }