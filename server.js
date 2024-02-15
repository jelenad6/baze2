
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;



// MongoDB connection
mongoose.connect('mongodb://localhost:27017/newspaperDB', { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
  image: String,
  category: String,
  title: String,
  date: String,
  description: String,
  authorProfile: String,
  authorName: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'approved', 'rejected', 'published'], default: 'draft' },
});

const Post = mongoose.model('Post', postSchema);

const samplePosts = [

    {
      image: "./assets/post-1.jpg",
      category: "Mobile",
      title: "How To Create Best UX Design With Adobe",
      date: "22 Jun, 2023",
      description: "Unlock the secrets of creating the best user experiences with Adobe. Learn valuable tips and techniques for designing mobile interfaces that captivate users.",
      authorProfile: "./assets/profile-1.jpg",
      authorName: "Marques Brown",
      status: "published",
    },
    // Post 2
    {
      image: "./assets/post-2.jpg",
      category: "Design",
      title: "Crafting Eye-Catching Designs With Adobe Creative Suite",
      date: "15 Mar, 2023",
      description: "Discover the art of crafting visually stunning designs using Adobe Creative Suite. Dive into the world of graphic design and unleash your creativity.",
      authorProfile: "./assets/profile-2.jpg",
      authorName: "Olivia Smith",
      status: "published",
    },
    // Post 3
    {
      image: "./assets/post-3.jpg",
      category: "Tech",
      title: "The Future of Technology: Trends Shaping 2023",
      date: "28 May, 2023",
      description: "Explore the latest technological trends that are shaping the future in 2023. From AI to blockchain, stay ahead of the curve in the rapidly evolving tech landscape.",
      authorProfile: "./assets/profile-3.jpg",
      authorName: "Mary Johnson",
      status: "published",
    },
    // Post 4
    {
      image: "./assets/post-4.jpg",
      category: "Mobile",
      title: "Designing Mobile Apps for a Seamless User Experience",
      date: "2 Aug, 2023",
      description: "Learn the essentials of designing mobile apps that provide a seamless user experience. Dive into the principles of mobile UI/UX and elevate your app design skills.",
      authorProfile: "./assets/profile-1.jpg",
      authorName: "Marques Brown",
      status: "published",
    },
    // Post 5
    {
      image: "./assets/post-5.jpg",
      category: "Design",
      title: "Mastering Color Theory in Graphic Design",
      date: "11 Dec, 2023",
      description: "Unlock the power of color in graphic design. Master color theory and learn how to use it effectively to create visually appealing and harmonious designs.",
      authorProfile: "./assets/profile-2.jpg",
      authorName: "Olivia Smith",
      status: "published",
    },
    // Post 6
    {
      image: "./assets/post-6.jpg",
      category: "Tech",
      title: "Demystifying Quantum Computing: A Beginner's Guide",
      date: "15 Mar, 2023",
      description: "Embark on a journey to understand the fundamentals of quantum computing. This beginner's guide will unravel the mysteries behind this revolutionary technology.",
      authorProfile: "./assets/profile-3.jpg",
      authorName: "Mary Johnson",
      status: "published",
    },
    // Post 7
    {
      image: "./assets/post-7.jpg",
      category: "Mobile",
      title: "Optimizing Mobile Websites for Peak Performance",
      date: "28 May, 2023",
      description: "Discover the best practices for optimizing mobile websites to achieve peak performance. Boost your website's speed and enhance the overall user experience.",
      authorProfile: "./assets/profile-1.jpg",
      authorName: "Marques Brown",
      status: "published",
    },
    // Post 8
    {
      image: "./assets/post-8.jpg",
      category: "Design",
      title: "The Art of Minimalism in Graphic Design",
      date: "7 Nov, 2023",
      description: "Explore the beauty of minimalism in graphic design. Learn how to create impactful and elegant designs by embracing simplicity and essential elements.",
      authorProfile: "./assets/profile-2.jpg",
      authorName: "Olivia Smith",
      status: "published",
    },
    // Post 9
    {
      image: "./assets/post-9.jpg",
      category: "Tech",
      title: "The Rise of Augmented Reality: A Transformative Journey",
      date: "6 Oct, 2023",
      description: "Dive into the transformative journey of augmented reality. Explore its rising impact on various industries and envision the future possibilities it brings.",
      authorProfile: "./assets/profile-3.jpg",
      authorName: "Mary Johnson",
      status: "published",
    },
  ];
  


// Insert initial posts only if the collection is empty
Post.countDocuments({})
  .then(count => {
    if (count === 0) {
      return Post.insertMany(samplePosts);
    }
  })
  //.then(() => console.log('Sample posts inserted successfully'))
  .catch((err) => console.error('Error inserting sample posts:', err));


const User = mongoose.model('User', {
  username: String,
  password: String,
  role: { type: String, enum: ['admin', 'user', 'journalist', 'editor'] }
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));  // Serve static files from the current directory

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/posts', async (req, res) => {
  try {
    const { category, title, date } = req.query;
    const query = {};

    // Add category to the query if provided
    if (category) {
      query.category = category;
    }

    // Add title to the query if provided
    if (title) {
      const titleRegex = new RegExp(title, 'i'); // Construct regex pattern with 'i' flag for case-insensitive search
      query.title = titleRegex; // Use regex pattern for case-insensitive search
    }

    // Add date to the query if provided
    if (date) {
      query.date = date;
    }

    // Fetch only published posts
    const publishedPosts = await Post.find({ status: 'published' });

    res.json(publishedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



// Handle user registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    console.log('Received registration request:', { username, password }); 
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with role 'user'
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'user' // Set default role to 'user'
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle admin registration of journalists and editors
app.post('/admin/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Ensure the role is either 'journalist' or 'editor'
    if (role !== 'journalist' && role !== 'editor') {
      return res.status(400).send('Invalid role');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the specified role
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch list of users registered by the admin

app.get('/admin/userList', async (req, res) => {
  try {
    const userList = await User.find({ role: { $in: ['journalist', 'editor'] }});
    res.json(userList);
  } catch (error) {
    console.error('Error fetching user list:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/admin/deleteUser/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);

    if (deletedUser) {
      console.log('User deleted successfully');
      res.status(200).send('User deleted successfully');
    } else {
      console.error('User not found');
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const role = user.role;
    console.log('User role:', role); // Add this line to log the user's role

    return res.status(200).json({ message: 'Login successful', role }); // Send role in the response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// DRAFTS / EDITOR / JOURNALISTS
app.post('/drafts', async (req, res) => {
  try {
    const { image, category, title, date, description, authorProfile, authorName } = req.body;

    // Create a new draft post
    const draftPost = new Post({
      image,
      category,
      title,
      date,
      description,
      authorProfile,
      authorName,
      status: 'draft' // Set the status to 'draft'
    });

    // Save the draft to the database
    await draftPost.save();

    res.status(201).json({ message: 'Draft created successfully', postId: draftPost._id });
  } catch (error) {
    console.error('Error creating draft:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Modify the existing endpoint to allow updating drafts
app.put('/drafts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { status, image, category, title, date, description, authorProfile, authorName } = req.body;

    // Update draft status if provided
    if (status) {
      // Update draft status directly
      const updatedPost = await Post.findByIdAndUpdate(postId, { status }, { new: true });
      if (!updatedPost) {
        return res.status(404).send('Draft not found');
      }
    }

    // If status is not provided or status is 'updated', update draft fields
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      image,
      category,
      title,
      date,
      description,
      authorProfile,
      authorName, 
      date
    }, { new: true });

    if (updatedPost) {
      res.status(200).json({ message: 'Draft updated successfully', post: updatedPost });
    } else {
      res.status(404).send('Draft not found');
    }
  } catch (error) {
    console.error('Error updating draft:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Like a post
app.post('/posts/like/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    // Find the post in the database and update the likes count
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } }, // Increment the likes count by 1
      { new: true }
    );
    res.json(updatedPost);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Dislike a post
app.post('/posts/dislike/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    // Find the post in the database and update the dislikes count
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { dislikes: 1 } }, // Increment the dislikes count by 1
      { new: true }
    );
    res.json(updatedPost);
  } catch (error) {
    console.error('Error disliking post:', error);
    res.status(500).send('Internal Server Error');
  }
});





// Serve the register.html file when the /signup route is accessed
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

// Serve the login.html file when the /login route is accessed
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');

  // Endpoint to fetch all drafts
app.get('/drafts', async (req, res) => {
  try {
    // Find all draft posts
    const drafts = await Post.find({ status: 'draft' });

    res.status(200).json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).send('Internal Server Error');
  }
});

});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
