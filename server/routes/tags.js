const express = require("express");
const sequelize = require("../db")
const router = express.Router();
const { Page, Tag } = require("../models");

// GET /tags
router.get("/", async (req, res, next) => {
    //retrieves tags ordered by how many pages they're attached to + date created
    try {
      const tags = await sequelize.sequelize.query(
        'SELECT tags.name, tags.createdAt, COUNT(page_tags.pageId) AS "pageCount" FROM "page_tags" \
        LEFT JOIN tags ON tags.id = page_tags.tagId \
        GROUP BY name \
        ORDER BY pageCount DESC, tags.createdAt DESC \
        LIMIT 3'
      )
      res.send(tags);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;