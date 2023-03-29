const { buildSchema } = require("graphql");
const { Page, User, Tag } = require("../models");
const sequelize = require("../db");

const schema = buildSchema(`
scalar DateTime

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
    createdAt: DateTime!
    updatedAt: DateTime!
    authorId: ID!
    author: User
    tags: [Tag]
}

type Tag {
  name: String!
  createdAt: DateTime!
  pageCount: Int!
}

type Query {
    getUsers: [User!]
    getUser(id: ID!): User!
    getPages: [Page!]
    getPage(slug: String!): Page!
    getTags: [Tag!]
    getSearchResults(query: String!): [Page!]
}

type Mutation {
    createUser(name: String!, email: String!): User
    deleteUser(id: ID!): User

    createPage(title: String!, content: String!, name: String!, email: String!, tags: String!): Page
    deletePage(id: ID!): Page
    updatePage(slug: String!, title: String, content: String, tags: String): Page
}
`);

const root = {
//Queries *******************************************************
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

  getSearchResults: async (params) => {
    try {
      const pages = await Page.findByTag(params.query);
      return pages;
    } catch (err) {
      return err
    }
  },

  getTags : async () => {
    try {
      const tags = await sequelize.sequelize.query(
        'SELECT tags.name, tags.createdAt, COUNT(page_tags.pageId) AS "pageCount" FROM "page_tags" \
        LEFT JOIN tags ON tags.id = page_tags.tagId \
        GROUP BY name \
        ORDER BY pageCount DESC, tags.createdAt DESC \
        LIMIT 3'
      );
      return tags[0];
    }catch (err) {
      return err;
    }
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
    try {
      const page = await Page.findOne({
        where: {
          slug: params.slug
        },
        include: [
          {
            model: Tag,
            through: { attributes: [] } // exclude join table data
          },
          {
            model: User,
            as: 'author'
          }
        ],
      });
      return page;
    }catch (err) {
      return err;
    }
  },
  //Mutation functions *****************************************
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
  },

  updatePage: async (params) => {
    try {
      const [updatedRowCount, updatedPages] = await Page.update({
        title: params.title,
        content: params.content
      }, {
        where: {
          slug: params.slug
        },
        returning: true
      });
  
      const tagArray = params.tags.split(' ');
      const tags = await Promise.all(tagArray.map(async (tagName) => {
        const [tag, wasCreated] = await Tag.findOrCreate({
          where: {
            name: tagName
          }
        });
        return tag;
      }));
  
      const selectedPage = await Page.findOne({
        where: {
          slug: params.slug
        }
      })
  
      await selectedPage.setTags(tags);
      return updatedPages[0]
    } catch (err) {
      return err;
    }
  }
};

module.exports = { schema, root }