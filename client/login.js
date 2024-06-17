document.getElementById("loginForm").addEventListener("submit", (event) => login(event));

function login(event) {
    event.preventDefault();

    axios.post('http://localhost:5000/api/login', {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    })
        .then(res => {
            console.log(res)
            const user = {
                username: res.data.user.username,
                userId: res.data.user._id
            };
            localStorage.setItem("userOfMentalHealthSystem", JSON.stringify(user));
            document.getElementById("loginForm").submit();
        })
        .catch(error => {
            if (error.response) {
                if (error.response.status === 404) {
                    alert('User not found');
                } else if (error.response.status === 401) {
                    alert('Incorrect password');
                } else {
                    alert('There was an error!');
                }
            } else {
                alert('There was an error!');
            }
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        });
}
