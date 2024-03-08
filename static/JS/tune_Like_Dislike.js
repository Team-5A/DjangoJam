// This file is used to handle the like and dislike functionality of the tunes
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelector('#like_btn').addEventListener('click', function () {
            const tuneId = this.getAttribute('data-tuneID');
            const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
            const tuneIdURL = `like/${tuneId}/`;
            fetch(tuneIdURL, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                }
            })
            .then(response => response.json())
            .then(data => {
                document.querySelector('#like_count').textContent = data.likes;
            })
            .catch(error => console.error('Error:', error));
        })

        document.querySelector('#dislike_btn').addEventListener('click', function () {
            const tuneId = this.getAttribute('data-tuneID');
            const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
            const tuneIdURL = `dislike/${tuneId}/`;
            fetch(tuneIdURL, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                }
            })
            .then(response => response.json())
            .then(data => {
                document.querySelector('#like_count').textContent = data.likes;
            })
            .catch(error => console.error('Error:', error));
        });
    });
