// This file is used to handle the like and dislike functionality of the tunes
    document.addEventListener('DOMContentLoaded', function () {
        document.body.addEventListener('click', function (event) {
        // Check if the clicked element is a like button
        if (event.target && event.target.matches('.like_btn')) {
            const tuneId = event.target.getAttribute('data-tuneID');
            console.log(tuneId);
            const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
            const tuneIdURL = 'like/'+ tuneId + '/';
            console.log(tuneIdURL);
            fetch(tuneIdURL, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                }
            })
            .then(response => response.json())
            .then(data => {
                // Update the like count for the current tune item
                const likeCountElement = document.querySelector(`#like_count_${tuneId}`);
                if (likeCountElement) {
                    likeCountElement.textContent = data.likes;
                }
            })
                .catch(error => console.error('Error:', error));
        }});

        document.body.addEventListener('click', function (event) {
        if (event.target && event.target.matches('.dislike_btn')) {
            const tuneId = event.target.getAttribute('data-tuneID');
            const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
            const tuneIdURL = 'dislike/'+ tuneId + '/';
            fetch(tuneIdURL, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                }
            })
            .then(response => response.json())
            .then(data => {
                // Update the like count for the current tune item
                const likeCountElement = document.querySelector(`#like_count_${tuneId}`);
                if (likeCountElement) {
                    likeCountElement.textContent = data.likes;
                }
            })
            .catch(error => console.error('Error:', error));
        }});
    });
