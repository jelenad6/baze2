
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
});

const Post = mongoose.model('Post', postSchema);

const samplePosts = [

    {
      image: "./assets/post-1.jpg",
      category: "Mobile",
      title: "How To Create Best UX Design With Adobe",
      date: "22 Jun 2023",
      description: "Unlock the secrets of creating the best user experiences with Adobe. Learn valuable tips and techniques for designing mobile interfaces that captivate users.",
      authorProfile: "./assets/profile-1.jpg",
      authorName: "Marques Brown",
    },
    // Post 2
    {
      image: "./assets/post-2.jpg",
      category: "Design",
      title: "Crafting Eye-Catching Designs With Adobe Creative Suite",
      date: "15 Mar 2023",
      description: "Discover the art of crafting visually stunning designs using Adobe Creative Suite. Dive into the world of graphic design and unleash your creativity.",
      authorProfile: "./assets/profile-2.jpg",
      authorName: "Olivia Smith",
    },
    // Post 3
    {
      image: "./assets/post-3.jpg",
      category: "Tech",
      title: "The Future of Technology: Trends Shaping 2023",
      date: "28 May 2023",
      description: "Explore the latest technological trends that are shaping the future in 2023. From AI to blockchain, stay ahead of the curve in the rapidly evolving tech landscape.",
      authorProfile: "./assets/profile-3.jpg",
      authorName: "Mary Johnson",
    },
    // Post 4
    {
      image: "./assets/post-4.jpg",
      category: "Mobile",
      title: "Designing Mobile Apps for a Seamless User Experience",
      date: "2 Aug 2023",
      description: "Learn the essentials of designing mobile apps that provide a seamless user experience. Dive into the principles of mobile UI/UX and elevate your app design skills.",
      authorProfile: "./assets/profile-1.jpg",
      authorName: "Marques Brown",
    },
    // Post 5
    {
      image: "./assets/post-5.jpg",
      category: "Design",
      title: "Mastering Color Theory in Graphic Design",
      date: "11 Dec 2023",
      description: "Unlock the power of color in graphic design. Master color theory and learn how to use it effectively to create visually appealing and harmonious designs.",
      authorProfile: "./assets/profile-2.jpg",
      authorName: "Olivia Smith",
    },
    // Post 6
    {
      image: "./assets/post-6.jpg",
      category: "Tech",
      title: "Demystifying Quantum Computing: A Beginner's Guide",
      date: "15 Mar 2023",
      description: "Embark on a journey to understand the fundamentals of quantum computing. This beginner's guide will unravel the mysteries behind this revolutionary technology.",
      authorProfile: "./assets/profile-3.jpg",
      authorName: "Mary Johnson",
    },
    // Post 7
    {
      image: "./assets/post-7.jpg",
      category: "Mobile",
      title: "Optimizing Mobile Websites for Peak Performance",
      date: "28 May 2023",
      description: "Discover the best practices for optimizing mobile websites to achieve peak performance. Boost your website's speed and enhance the overall user experience.",
      authorProfile: "./assets/profile-1.jpg",
      authorName: "Marques Brown",
    },
    // Post 8
    {
      image: "./assets/post-8.jpg",
      category: "Design",
      title: "The Art of Minimalism in Graphic Design",
      date: "7 Nov 2023",
      description: "Explore the beauty of minimalism in graphic design. Learn how to create impactful and elegant designs by embracing simplicity and essential elements.",
      authorProfile: "./assets/profile-2.jpg",
      authorName: "Olivia Smith",
    },
    // Post 9
    {
      image: "./assets/post-9.jpg",
      category: "Tech",
      title: "The Rise of Augmented Reality: A Transformative Journey",
      date: "6 Oct 2023",
      description: "Dive into the transformative journey of augmented reality. Explore its rising impact on various industries and envision the future possibilities it brings.",
      authorProfile: "./assets/profile-3.jpg",
      authorName: "Mary Johnson",
    },
  ];
  


// Insert initial posts only if the collection is empty
Post.countDocuments({})
  .then(count => {
    if (count === 0) {
      return Post.insertMany(samplePosts);
    }
  })
  .then(() => console.log('Sample posts inserted successfully'))
  .catch((err) => console.error('Error inserting sample posts:', err));


const User = mongoose.model('User', {
  username: String,
  password: String,
  role: String,
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
    const { category } = req.query;
    console.log('Fetching posts for category:', category);

    const query = category ? { category } : {};
    console.log('Query:', query);

    const posts = await Post.find(query);
    console.log('Found posts:', posts);

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid username or password');
    }

    res.status(200).send('Login successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/posts', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const posts = await Post.find(query);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Serve the register.html file when the /signup route is accessed
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

// Serve the login.html file when the /login route is accessed
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
