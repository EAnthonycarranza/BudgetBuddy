const router = require('express').Router();
const { Post, User, Comment } = require('../Models');

// Route for the login page
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect to the main page
  if (req.session.logged_in) {
    return res.redirect('/');
  }
  // Render the login page template
  res.render('login');
});

// Route for the signup page
router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect to the main page
  if (req.session.logged_in) {
    return res.redirect('/');
  }
  // Render the signup page template
  res.render('signup');
});

// Route for handling login form submission
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by their username in the database
    const user = await User.findOne({ where: { username } });

    // If the user is not found or the password is incorrect, render the login page with an error message
    if (!user || !user.checkPassword(password)) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    // Set the session to indicate the user is logged in
    req.session.logged_in = true;
    req.session.user_id = user.id;
    req.session.username = user.username;

    // Redirect to the main page after successful login
    res.redirect('/');

  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for handling logout
router.get('/logout', (req, res) => {
  // Clear the user's session to log them out
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      // Redirect to the login page after successful logout
      res.redirect('/login'); // Replace '/login' with the path to your login page
    }
  });
});

// Route for the dashboard page
router.get('/dashboard', async (req, res) => {
  try {
    // Fetch the user's posts from the database
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id, // Get posts for the currently logged-in user
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [User]
        }
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('dashboard', { 
      posts, 
      logged_in: true, // Set the logged_in variable to true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for handling the "Create New Post" form
router.get('/new-post', (req, res) => {
  // Check if the user is logged in
  if (!req.session.logged_in) {
    // If the user is not logged in, redirect them to the login page
    return res.redirect('/login');
  }

  // Render the "new-post" template to create a new post
  res.render('new-post', { logged_in: req.session.logged_in });
});

// Route for handling the comment form submission
router.post('/post/:id/comment', async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment_text } = req.body;
    const userId = req.session.user_id;

    // Check if the post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Insert the new comment into the 'comments' table, including the post_id and user_id
    const newComment = await Comment.create({
      comment_text,
      post_id: postId,
      user_id: userId,
    });

    // Redirect back to the post page after successfully submitting the comment
    res.redirect(`/post/${postId}?newComment=true`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for rendering an individual post with its comments
router.get('/post/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // Fetch the post from the database, including its comments and the associated users
    const postData = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    if (!postData) {
      // If the post is not found, you can redirect to a 404 page or handle it accordingly
      return res.status(404).render('404', { title: 'Post Not Found' });
    }

    // Extract the post and comments data from the result
    const post = postData.get({ plain: true });

    // Fetch the new comment, if it exists (from the query parameter)
    const newComment = req.query.newComment === 'true';

    // Render the individual post template with the data, including the newComment
    res.render('comments', { 
      post,
      newComment,
      user: req.session.user_id ? { username: req.session.username } : null,
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for handling the "Create New Post" form submission
router.post('/new-post', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Insert the new post into the 'posts' table, including the user_id of the creator
    const newPost = await Post.create({
      title,
      content,
      user_id: req.session.user_id,
    });

    // Redirect to the dashboard page after successfully creating a new post
    res.redirect('/dashboard');

  } catch (err) {
    res.status(500).json(err);
  }
});


// Route for handling signup form submission
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Insert the new user into the 'users' table
    const newUser = await User.create({
      username,
      email,
      password,
    });

    // Set the session to indicate the user is logged in
    req.session.logged_in = true;
    req.session.user_id = newUser.id;
    req.session.username = newUser.username;

    // Add success message to session to display on successful signup
    req.session.successMsg = 'Signup successful! Welcome to Tech Blog.';

    // Redirect to the main page after successful sign-up
    res.redirect('/');

  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for the main page (homepage)
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [User]
        }
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in,
      user: req.session.user_id ? { username: req.session.username } : null,
      // Add success message to display on successful login or signup
      successMsg: req.session.successMsg,
    });

    // Clear success message from session after rendering
    delete req.session.successMsg;
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
