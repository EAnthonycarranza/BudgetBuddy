-- Drop the tables if they exist (Optional: Useful for testing and reseeding)
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- Create the 'users' table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'posts' table
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the 'comments' table
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comment_text TEXT NOT NULL,
  user_id INT,
  post_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Sample users
INSERT INTO users (username, email, password)
VALUES
  ('user1', 'user1@example.com', 'password1'),
  ('user2', 'user2@example.com', 'password2'),
  ('user3', 'user3@example.com', 'password3');

-- Sample posts
INSERT INTO posts (title, content, user_id)
VALUES
  ('Post 1', 'Content of Post 1', 1),
  ('Post 2', 'Content of Post 2', 1),
  ('Post 3', 'Content of Post 3', 2),
  ('Post 4', 'Content of Post 4', 3);

-- Sample comments
INSERT INTO comments (comment_text, user_id, post_id)
VALUES
  ('Comment 1 on Post 1', 2, 1),
  ('Comment 2 on Post 1', 3, 1),
  ('Comment 1 on Post 2', 1, 2),
  ('Comment 1 on Post 3', 2, 3),
  ('Comment 1 on Post 4', 3, 4),
  ('Comment 2 on Post 4', 1, 4);
