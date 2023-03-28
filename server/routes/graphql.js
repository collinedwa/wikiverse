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
    author: User!
}

type Query {
    getUsers: [User!]
    getSingleUser(id: ID!): User!
    getPages: [Page!]
    getSinglePage(id: ID!): Page!
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
  getSingleUser : async (params) => {
    user = await User.findByPk(params.id);
    return user;
  },
  getSinglePage : async (params) => {
    page = await Page.findByPk(params.id, {
        include: {
            model: User,
            as: "author"
        }
    });
    return page;
  }
};

module.exports = { schema, root }