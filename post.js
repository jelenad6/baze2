document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form');
    const usernameInput = document.getElementById('username');
    const commentInput = document.getElementById('comment');
    const commentsList = document.getElementById('comments-list');

    // Event listener for form submission
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const username = usernameInput.value;
        const comment = commentInput.value;

        // Add the comment to the comments list
        const newComment = document.createElement('li');
        newComment.innerHTML = `<strong>${username}</strong>: ${comment}`;
        commentsList.appendChild(newComment);

        // Clear the form inputs
        usernameInput.value = '';
        commentInput.value = '';

        // You can send the comment data to the server here using fetch() or another method
        // Example:
        // await fetch('/api/comments', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ username, comment })
        // });
    });
});