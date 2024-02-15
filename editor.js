document.addEventListener("DOMContentLoaded", () => {
  // Fetch drafts awaiting approval
  fetchDrafts();
});

async function fetchDrafts() {
  try {
      const response = await fetch("/drafts"); // Fetch all drafts from the database
      const drafts = await response.json(); // Parse the JSON response

      const draftList = document.getElementById("draftList");
      draftList.innerHTML = ""; // Clear previous list

      drafts.forEach((draft) => {
          const listItem = document.createElement("li");

          const title = document.createElement("h3");
          title.textContent = draft.title;

          const author = document.createElement("p");
          author.textContent = `Author: ${draft.authorName}`;

          const description = document.createElement("p");
          description.textContent = `Description: ${draft.description}`;

          const date = document.createElement("p"); // Create a paragraph element for date
           date.textContent = `Date: ${draft.date}`; // Assign draft date to the paragraph

          const image = document.createElement("img");
          image.src = draft.image;
          image.alt = "Post Image";
          image.classList.add("post-img");
          image.style.width = "300px";
          image.style.height = "200px";
          image.style.objectFit = "cover";
          image.style.objectPosition = "center";
          image.style.borderRadius = "0.5rem";

          const buttonContainer = document.createElement("div");
          buttonContainer.classList.add("button-container");

          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.className = "edit-btn";
          editButton.addEventListener("click", () => editDraft(draft));

          const rejectButton = document.createElement("button");
          rejectButton.textContent = "Reject";
          rejectButton.className = "reject-btn";
          rejectButton.addEventListener("click", () => updateDraftStatus(draft._id, "rejected"));

          const publishButton = document.createElement("button");
          publishButton.textContent = "Publish";
          publishButton.className = "publish-btn";
          publishButton.addEventListener("click", () => updateDraftStatus(draft._id, "published"));

          buttonContainer.appendChild(editButton);
          buttonContainer.appendChild(rejectButton);
          buttonContainer.appendChild(publishButton);

          listItem.appendChild(title);
          listItem.appendChild(author);
          listItem.appendChild(description);
          listItem.appendChild(image);
          listItem.appendChild(buttonContainer);
          draftList.appendChild(listItem);
          listItem.appendChild(date);
      });
  } catch (error) {
      console.error("Error fetching drafts:", error);
  }
}

async function updateDraftStatus(draftId, status) {
  try {
      const response = await fetch(`/drafts/${draftId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
      });

      if (!response.ok) {
          throw new Error("Failed to update draft status");
      }

      alert(`Draft ${status} successfully`);
      fetchDrafts(); // Refresh the draft list
  } catch (error) {
      console.error("Error updating draft status:", error);
  }
}

function editDraft(draft) {
  const editForm = document.createElement("form");
  editForm.innerHTML = `
      <label for="editTitle">Title:</label>
      <input type="text" id="editTitle" value="${draft.title}" required><br><br>
      <label for="editDescription">Description:</label><br>
      <textarea id="editDescription" rows="4" required>${draft.description}</textarea><br><br>
      <button type="submit">Save Changes</button>
  `;

  editForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const editedTitle = document.getElementById("editTitle").value;
      const editedDescription = document.getElementById("editDescription").value;

      // Update the draft with the edited title and description
      try {
          const response = await fetch(`/drafts/${draft._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  title: editedTitle,
                  description: editedDescription,
              }),
          });

          if (!response.ok) {
              throw new Error("Failed to update draft");
          }

          alert("Draft updated successfully");
          fetchDrafts(); // Refresh the draft list
      } catch (error) {
          console.error("Error updating draft:", error);
      }
  });

  // Clear previous content and append the edit form
  const draftList = document.getElementById("draftList");
  draftList.innerHTML = "";
  draftList.appendChild(editForm);
}
