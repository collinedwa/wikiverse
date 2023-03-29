const { buildSchema } = require("graphql")
const { Page, User } = require("../models");

const schema = buildSchema(`
type User {
    id: ID!
    name: String!
    email: String!
    pages: [Page!]
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
    getUser(id: ID!): User!
    getPages: [Page!]
    getPage(id: ID!): Page!
}

type Mutation {
    createUser(name: String!, email: String!): User
    deleteUser(id: ID!): User

    createPage(title: String!, content: String!, name: String!, email: String!, tags: String!): Page
    deletePage(id: ID!): Page
}
`);

const root = {
//bulk get
  getUsers : async () => {
    users = await User.findAll({
      include: {
        model: Page,
        as: "pages"
      }
    });
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
    user = await User.findByPk(params.id, {
      include: {
        model: Page,
        as: "pages"
      }
    });
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
  //User
  createUser: async (params) => {
    if (params.name.length < 2) throw new Error("invalid parameters")
    try{
      newUser = await User.create(params);
      return newUser;
    }catch(err){
      return err;
    }
  },
  deleteUser : async (params) => {
    try{
      user = await User.findByPk(params.id);
      await user.destroy();
      return user;
    }catch(err){
      return err;
    }
  },
  //Page
  createPage: async (params) => {
    try {
      const [user, wasCreated] = await User.findOrCreate({
        where: {
          name: params.name,
          email: params.email
        }
      });
  
      const page = await Page.create(params);
  
      await page.setAuthor(user);
  
      if(params.tags) {
        const tagArray = params.tags.split(' ');
        const tags = [];
        for (let tagName of tagArray) {
          const [tag, wasCreated] = await Tag.findOrCreate({
            where: {
              name: tagName
            }
          });
          if (wasCreated) {
            tags.push(tag);
          }
        }
        await page.addTags(tags);
      }
  
      return page;
    } catch (error) {
      return error;
    }
  },
  deletePage: async (params) => {
    try{
      page = await Page.findByPk(params.id);
      await page.destroy();
      return page;
    }catch(err){
      return err;
    }
  }
};

module.exports = { schema, root }