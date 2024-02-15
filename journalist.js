document.addEventListener('DOMContentLoaded', async () => {
    const postForm = document.getElementById('postForm');
    const authorNameSelect = document.getElementById('authorName');

    // Fetch journalist names
    try {
        const response = await fetch('/admin/userList?role=journalist');
        const journalists = await response.json();

        journalists.forEach(journalist => {
            const option = document.createElement('option');
            option.value = journalist.username;
            option.textContent = journalist.username;
            authorNameSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching journalist names:', error);
    }

    // Handle form submission
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const image = document.getElementById('image').value;
        const category = document.getElementById('category').value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const authorProfile = document.getElementById('authorProfile').value;
        const authorName = authorNameSelect.value;
        const date = document.getElementById('date').value;

        const postData = {
            image: `./assets/${image}`,
            category,
            title,
            description,
            authorProfile: `./assets/${authorProfile}`,
            authorName,
            date
        };

        try {
            const response = await fetch('/drafts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                console.log('Post saved as draft successfully');
                alert('Post saved as draft successfully');
            } else {
                console.error('Failed to save post as draft');
            }
        } catch (error) {
            console.error('Error saving post as draft:', error);
        }
    });
});
