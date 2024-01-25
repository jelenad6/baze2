// Filter
document.addEventListener('DOMContentLoaded', () => {
  const filterItems = document.querySelectorAll('.filter-item');
  const postBoxes = document.querySelectorAll('.post-box');

  filterItems.forEach(item => {
    item.addEventListener('click', () => {
      const value = item.dataset.filter;

      if (value === 'all') {
        postBoxes.forEach(box => box.style.display = 'block');
      } else {
        postBoxes.forEach(box => {
          if (box.classList.contains(value)) {
            box.style.display = 'block';
          } else {
            box.style.display = 'none';
          }
        });
      }

      filterItems.forEach(button => button.classList.remove('active-filter'));
      item.classList.add('active-filter');
    });
  });
});

// Header background change
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('shadow', window.scrollY > 0);
});

const posts = [
  {
    image: "./assets/post-1.jpg",
    category: "Mobile",
    title: "How To Create Best UX Design With Adobe",
    date: "12 Feb 2022",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos in, fugit officia aut corrupti ipsam nulla ipsum dolores neque veniam eveniet. Temporibus saepe magni labore!",
    authorProfile: "./assets/profile-1.jpg",
    authorName: "Marques Brown",
  },
  {
    image: "./assets/post-2.jpg",
    category: "Design",
    title: "How To Create Best UX Design With Adobe",
    date: "12 Feb 2022",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos in, fugit officia aut corrupti ipsam nulla ipsum dolores neque veniam eveniet. Temporibus saepe magni labore!",
    authorProfile: "./assets/profile-2.jpg",
    authorName: "Marques Brown",
  },
  {
    image: "./assets/post-3.jpg",
    category: "Tech",
    title: "How To Create Best UX Design With Adobe",
    date: "12 Feb 2022",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos in, fugit officia aut corrupti ipsam nulla ipsum dolores neque veniam eveniet. Temporibus saepe magni labore!",
    authorProfile: "./assets/profile-3.jpg",
    authorName: "Marques Brown",
  },
  {
    image: "./assets/post-4.jpg",
    category: "Mobile",
    title: "How To Create Best UX Design With Adobe",
    date: "12 Feb 2022",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos in, fugit officia aut corrupti ipsam nulla ipsum dolores neque veniam eveniet. Temporibus saepe magni labore!",
    authorProfile: "./assets/profile-1.jpg",
    authorName: "Marques Brown",
  },
  {
    image: "./assets/post-5.jpg",
    category: "Design",
    title: "How To Create Best UX Design With Adobe",
    date: "12 Feb 2022",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos in, fugit officia aut corrupti ipsam nulla ipsum dolores neque veniam eveniet. Temporibus saepe magni labore!",
    authorProfile: "./assets/profile-2.jpg",
    authorName: "Marques Brown",
  },
  {
    image: "./assets/post-6.jpg",
    category: "Tech",
    title: "How To Create Best UX Design With Adobe",
    date: "12 Feb 2022",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos in, fugit officia aut corrupti ipsam nulla ipsum dolores neque veniam eveniet. Temporibus saepe magni labore!",
    authorProfile: "./assets/profile-3.jpg",
    authorName: "Marques Brown",
  },
  {
    image: "./assets/post-7.jpg",
    category: "Mobile",
    title: "How To Create Best UX Design With Adobe",
    date: "12 Feb 2022",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos in, fugit officia aut corrupti ipsam nulla ipsum dolores neque veniam eveniet. Temporibus saepe magni labore!",
    authorProfile: "./assets/profile-1.jpg",
    authorName: "Marques Brown",
  },
  {
    image: "./assets/post-8.jpg",
    category: "Design",
    title: "How To Create Best UX Design With Adobe",
    date: "12 Feb 2022",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos in, fugit officia aut corrupti ipsam nulla ipsum dolores neque veniam eveniet. Temporibus saepe magni labore!",
    authorProfile: "./assets/profile-2.jpg",
    authorName: "Marques Brown",
  },
  {
    image: "./assets/post-9.jpg",
    category: "Tech",
    title: "How To Create Best UX Design With Adobe",
    date: "12 Feb 2022",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos in, fugit officia aut corrupti ipsam nulla ipsum dolores neque veniam eveniet. Temporibus saepe magni labore!",
    authorProfile: "./assets/profile-3.jpg",
    authorName: "Marques Brown",
  },
];

function generatePost(post) {
  return `
    <div class="post-box ${post.category.toLowerCase()}">
      <img src="${post.image}" alt="${post.title}" class="post-img" />
      <h2 class="category">${post.category}</h2>
      <a href="post-page.html" class="post-title">${post.title}</a>
      <span class="post-date">${post.date}</span>
      <p class="post-description">
        ${post.description}
      </p>
      <!--Profile-->
      <div class="profile">
        <img src="${post.authorProfile}" alt="" class="profile-img" />
        <span class="profile-name">${post.authorName}</span>
      </div>
    </div>
  `;
}

function generatePosts(posts) {
  return posts.reduce((html, post) => html + generatePost(post), '');
}

const postContainer = document.querySelector('#post-container');
postContainer.innerHTML = generatePosts(posts);

// Add event listeners to filter buttons
const filterButtons = document.querySelectorAll('.filter-item');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filterValue = button.dataset.filter;

    if (filterValue === 'all') {
      postContainer.innerHTML = generatePosts(posts);
    } else {
      const filteredPosts = posts.filter(post => post.category.toLowerCase() === filterValue);
      postContainer.innerHTML = generatePosts(filteredPosts);
    }

    filterButtons.forEach(button => button.classList.remove('active-filter'));
    button.classList.add('active-filter');
  });
});
