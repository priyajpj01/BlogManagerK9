const express = require("express");
const Blogs = require("../models/blogs");
const auth = require("../middleware/auth");
const db = require("../db/mongoose");
const ISODate = require("isodate");
const router = new express.Router();

// create blog API
router.post("/api/blogs", auth, async (req, res) => {
  var { title, content } = req.body;
  const isExisting = await Blogs.findOne({ title, content });
  if (isExisting) throw new Error(` Title and content are duplicate`);
  try {
    var blog = await new Blogs({
      title,
      content,
      author_id: req.user._id,
      author_name: req.user.name,
    });
    blog.save();
    console.log("blog saved");
    res.status(201).send({ message: "Blog created sucessfully", blog });
  } catch (e) {
    res.status(400).send(e);
  }
});

//-----------------------------------------------------------------------------------------------------
// GET /blogs?fromDate=""&toDate=""

// To fetch blogs between certain dates and find author's total viewers of all the blogs summed up,grouped by title
router.get("/api/blogs", auth, async (req, res) => {
  console.log("inside");
  try {
    Blogs.aggregate([
      {
        $match: {
          createdAt: {
            $gte: ISODate(req.query.fromDate),
            $lte: ISODate(req.query.toDate),
          },
        },
      },
      { $unwind: "$likes" },
      { $unwind: "$viewers" },
      { $project: { title: 1, viewers: 1, likes: 1 } },
      {
        $group: {
          _id: { title: "$title" },
          totalViews: { $sum: "$viewers" },
          totalLikes: { $sum: "$likes" },
        },
      },
      { $sort: { totalViews: -1 } },
      {
        $limit: 5,
      },
    ]).then(async (result) => {
      if (!result) return res.status(404).send();
      res.status(201).send(result);
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});


//----------------------------------------------------------------------------------------------------
// get all comments using $unwind
router.get("/api/getComments", auth, async (req, res) => {
  try {
    Blogs.aggregate([
      { $match: { title: req.query.title } },
      { $unwind: "$comments" },
      { $project: { comments: 1 }}
    ]).then(async (result) => {
      if (!result) return res.status(404).send();
      res.status(201).send(result);
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//----------------------------------------------------------------------------------------------------
//get comments count using $count

router.get("/api/getCount", auth, async (req, res) => {
    try {
      Blogs.aggregate([
        { $match: { title: req.query.title } },
        { $unwind: "$comments" },
        { $count: "Total comments are" },
      ]).then(async (result) => {
        if (!result) return res.status(404).send();
        res.status(201).send(result);
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  });

//----------------------------------------------------------------------------------------------------  
  // get ratings greator than 5
router.get("/api/getRatings", auth, async (req, res) => {
  try {
    Blogs.aggregate([
      {
        $match: {
          author_name: req.user.name,
          ratings: { $not: { $lte: 5 } },
        },
      },
    ]).then(async (result) => {
      if (!result) return res.status(404).send();
      res.status(201).send(result);
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});


//------------------------------------------------------------------------------------------------
// update blog API
router.patch("/api/blogs/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "content",
    "comments",
    "viewers",
    "ratings",
    "likes",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const blog = await Blogs.findOne({ _id: req.params.id });

    if (!blog) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      blog[update] = req.body[update];
    });
    req.body.likes.map((like) => {
      blog.likes = blog.likes.concat(like);
    });
    req.body.viewers.map((view) => {
      blog.viewers = blog.viewers.concat(view);
    });
    await blog.save();
    res.send(blog);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
