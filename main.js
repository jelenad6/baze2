document.addEventListener('DOMContentLoaded', async () => {
  // Header background change
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('shadow', window.scrollY > 0);
  });

  const filterButtons = document.querySelectorAll('.filter-item');
  const postContainer = document.querySelector('#post-container');
  const titleInput = document.getElementById('title-input');
  const dateInput = document.getElementById('date-input');
  const searchButton = document.getElementById('search-button');

  async function fetchAndDisplayPosts(category = 'all', title = '', date = '') {
    try {
      

      let url = '/posts';

      if (category !== 'all') {
        url += `?category=${category}`;
      }

      if (title) {
        url += `${url.includes('?') ? '&' : '?'}title=${encodeURIComponent(title)}`;
      }

      if (date) {
        
        url += `${url.includes('?') ? '&' : '?'}date=${date}`;
      }

      const response = await fetch(url);
      const posts = await response.json();
      

      postContainer.innerHTML = generatePosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  try {
    // Fetch and display all posts initially
    await fetchAndDisplayPosts();

    filterButtons.forEach(item => {
      item.addEventListener('click', async () => {
        const value = item.dataset.filter;

        // Fetch and display posts based on the selected category
        await fetchAndDisplayPosts(value);

        filterButtons.forEach(button => button.classList.remove('active-filter'));
        item.classList.add('active-filter');
      });
    });

    searchButton.addEventListener('click', async () => {
      const title = titleInput.value.trim();
      const date = dateInput.value.trim();

      // Fetch and display posts based on search parameters
      await fetchAndDisplayPosts('all', title, date);
    });
  } catch (error) {
    console.error('An error occurred during initialization:', error);
  }
});


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
