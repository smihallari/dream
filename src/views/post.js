router.get('/', async (req, res) => {
    try {
      // Fetch all posts along with the count of comments
      const posts = await Post.find().populate('comments').lean();
  
      // Map posts to include the number of comments
      const postsWithCounts = posts.map(post => ({
        ...post,
        commentsCount: post.comments.length
      }));
  
      res.render('posts', { posts: postsWithCounts });
    } catch (err) {
      console.error('Error fetching posts:', err);
      res.status(500).send('Server error');
    }
  });