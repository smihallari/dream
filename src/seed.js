const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");

const MONGO_URI = "mongodb://mongo:27017/dreamdb";

(async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // Create users
    const users = [];

    users.push({
        name: "firstName",
        surname: "lastName",
        username: "DreamAdmin",
        email: "admin@dreamcatchr.com",
        bio: "Dreamcatchr Admin",
        role: "admin",
        profilepic: "default",
        favorites: [],
        password: "abc123",
      });

    for (let i = 0; i < 12; i++) {
        users.push({
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${faker.number.int({ min: 1, max: 999 })}`,
        email: faker.internet.email(),
        bio: faker.lorem.sentence(),
        password: faker.internet.password(),
      });
    }
    const createdUsers = await User.insertMany(users);

    // Create posts
    const categories = [
      "Sweet Dreams",
      "Funny Dreams",
      "Flying Dreams",
      "Falling Dreams",
      "Nightmares",
      "Weird Dreams",
      "Undefined Dreams",
    ];

    const posts = [];
    for (let i = 0; i < 60; i++) {
      const author = faker.helpers.arrayElement(createdUsers);
      const likes = faker.helpers.shuffle(
        createdUsers.filter(u => u._id.toString() !== author._id.toString())
      ).slice(0, faker.number.int({ min: 5, max: 20 }));

      const inContest = faker.datatype.boolean() && i < 10;
      const contestVotes = inContest
        ? faker.helpers.shuffle(likes).slice(0, faker.number.int({ min: 1, max: likes.length - 1 }))
        : [];

      const isWinner = !inContest && faker.datatype.boolean() && i < 7;
      const winnerVotes = isWinner
        ? faker.number.int({ min: Math.ceil(likes.length * 0.7), max: Math.ceil(likes.length * 0.9) })
        : 0;

      posts.push({
        author: author._id,
        title: faker.lorem.words(3),
        content: faker.lorem.paragraphs(2),
        date: faker.date.between({ from: "2023-11-01", to: "2024-11-30" }),
        category: faker.helpers.arrayElement(categories),
        likes: likes.map(user => user._id),
        comments: [],
        commentsAllowed: true,
        inContest,
        isWinner,
        contestVotes: inContest || isWinner ? contestVotes.map(user => user._id) : [],
      });
    }
    const createdPosts = await Post.insertMany(posts);

    // Create comments
    const comments = [];
    for (const post of createdPosts) {
      const numComments = faker.number.int({ min: 0, max: 2 });
      for (let i = 0; i < numComments; i++) {
        const author = faker.helpers.arrayElement(
          createdUsers.filter(u => u._id.toString() !== post.author.toString())
        );
        comments.push({
          post: post._id,
          author: author._id,
          content: faker.lorem.sentence(),
          createdAt: faker.date.between({ from: post.date, to: new Date() }),
        });
      }
    }
    const createdComments = await Comment.insertMany(comments);

    // Link comments to posts
    for (const comment of createdComments) {
      await Post.findByIdAndUpdate(comment.post, { $push: { comments: comment._id } });
    }

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding database:", err);
    mongoose.connection.close();
  }
})();