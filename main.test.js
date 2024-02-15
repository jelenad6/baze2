// likeDislike.test.js
const { JSDOM } = require('jsdom');

// Mock the window object
const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.window = window;
global.document = window.document;



const { likePost, dislikePost } = require('./main.js'); 

describe('likePost function', () => {
  test('it should send a POST request to like a post and update the like count in the DOM', async () => {
    // Mock fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ likes: 10 }), // Mock the response from the server
      })
    );

    // Create a mock post element with an id
    const mockPostId = '65cbca81712a012e7afdce4a';
    document.body.innerHTML = `<div id="post-${mockPostId}">
      <span class="like-count">5</span>
    </div>`;

    // Call the likePost function
    await likePost(mockPostId);

    // Check if the fetch function was called with the correct URL and method
    expect(fetch).toHaveBeenCalledWith(`/posts/like/${mockPostId}`, { method: 'POST' });

    // Check if the like count in the DOM has been updated
    expect(document.querySelector(`#post-${mockPostId} .like-count`).textContent).toBe('10');
  });
});

describe('dislikePost function', () => {
  test('it should send a POST request to dislike a post and update the dislike count in the DOM', async () => {
    // Mock fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ dislikes: 8 }), // Mock the response from the server
      })
    );

    // Create a mock post element with an id
    const mockPostId = 'mock-post-id';
    document.body.innerHTML = `<div id="post-${mockPostId}">
      <span class="dislike-count">3</span>
    </div>`;

    // Call the dislikePost function
    await dislikePost(mockPostId);

    // Check if the fetch function was called with the correct URL and method
    expect(fetch).toHaveBeenCalledWith(`/posts/dislike/${mockPostId}`, { method: 'POST' });

    // Check if the dislike count in the DOM has been updated
    expect(document.querySelector(`#post-${mockPostId} .dislike-count`).textContent).toBe('8');
  });
});


/* // Import the function or module you need to test
const { updateDraftStatus } = require('./editor.js');

describe('Publish Draft Test', () => {
  // Mock fetch function
  beforeEach(() => {
    jest.resetAllMocks(); // Reset mock function calls before each test
  });

  test('Update Draft Status to Published', async () => {
    const mockDraftId = '65cbca81712a012e7afdce4a'; // Mock draft ID
    const mockResponse = { message: 'Draft published successfully' };

    // Mock the fetch function to return a successful response
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    // Call the function to update draft status to 'published'
    const result = await updateDraftStatus(mockDraftId, 'published');

    // Verify that the fetch function was called with the correct arguments
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`/drafts/${mockDraftId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'published' })
    });

    // Verify the function returns the success message
    expect(result).toEqual(mockResponse);
  });

  // Add more tests as needed for error cases, edge cases, etc.
});
 */