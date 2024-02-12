document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('registerUserBtn');
    const userList = document.getElementById('userList');

    registerBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value; // Get the selected role

        try {
            const response = await fetch('/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }) // Include the role in the request body
            });

            if (response.ok) {
                console.log(`${role} registered successfully`);
                fetchUserList();
            } else {
                console.error(`${role} registration failed`);
            }
        } catch (error) {
            console.error(`Error registering ${role}:`, error);
        }
    });

   // Fetch and Display User List

   async function fetchUserList() {
     try {
       const response = await fetch('/admin/userList');
       const userListData = await response.json();
   
       // Clear existing list items
       userList.innerHTML = '';
   
       // Populate user list
       userListData.forEach(user => {
         const listItem = document.createElement('li');
         listItem.textContent = `${user.username} (${user.role})`;
   
         const deleteButton = document.createElement('button');
         deleteButton.textContent = 'Delete';
         deleteButton.style.float = 'right'; // Align button to the right
         deleteButton.style.marginLeft = '10px'; // Add margin for spacing between username and button
         deleteButton.style.fontSize = '12px'; // Make font size smaller
         deleteButton.style.padding = '3px 6px'; // Add padding to reduce button size
         deleteButton.style.maxWidth = '50px'; // Limit button width
         deleteButton.addEventListener('click', async () => {
           try {
             const deleteResponse = await fetch(`/admin/deleteUser/${user._id}`, {
               method: 'DELETE'
             });
             if (deleteResponse.ok) {
               console.log('User deleted successfully');
               // Optionally, refresh the user list
               fetchUserList();
             } else {
               console.error('Failed to delete user');
             }
           } catch (error) {
             console.error('Error deleting user:', error);
           }
         });
   
         listItem.appendChild(deleteButton);
         userList.appendChild(listItem);
       });
     } catch (error) {
       console.error('Error fetching user list:', error);
     }
   }
   
   // Initial fetch of user list
   fetchUserList();
});