const sampleBlogs = [
    {
        id: 1,
        title: "Getting Started with HTML",
        category: "Web Development",
        author: "Admin",
        date: "Nov 10, 2026",
        content: "Learn semantic tags and document structures easily to build accessible websites."
    },
    {
        id: 2,
        title: "Understanding CSS Grid",
        category: "CSS & Design",
        author: "Admin",
        date: "Nov 12, 2026",
        content: "Build responsive two-dimensional layouts cleanly without relying on complex floats."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("blogs")) {
        localStorage.setItem("blogs", JSON.stringify(sampleBlogs));
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const navLinks = document.getElementById("nav-links");

    if (navLinks) {
        if (currentUser) {
            navLinks.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="dashboard.html">Dashboard</a></li>
                <li><button id="logout-btn" class="btn-logout">Logout (${currentUser.username})</button></li>
            `;
            document.getElementById("logout-btn").addEventListener("click", () => {
                localStorage.removeItem("currentUser");
                window.location.href = "login.html";
            });
        } else {
            navLinks.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="login.html">Login</a></li>
                <li><a href="register.html">Register</a></li>
            `;
        }
    }

    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (username === "" || email === "" || password === "") {
                alert("Please fill in all fields.");
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters long.");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some(user => user.email === email)) {
                alert("An account with this email already exists.");
                return;
            }

            users.push({ username, email, password });
            localStorage.setItem("users", JSON.stringify(users));

            alert("Registration successful! Please log in.");
            window.location.href = "login.html";
        });
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const validUser = users.find(u => u.email === email && u.password === password);

            if (validUser) {
                localStorage.setItem("currentUser", JSON.stringify(validUser));
                window.location.href = "dashboard.html";
            } else {
                alert("Invalid email or password.");
            }
        });
    }

    const homeContainer = document.getElementById("blog-container");
    if (homeContainer) {
        const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
        homeContainer.innerHTML = "";

        blogs.forEach(blog => {
            const card = document.createElement("div");
            card.className = "blog-card";
            card.innerHTML = `
                <div>
                    <span class="badge">${blog.category || "General"}</span>
                    <h3>${blog.title}</h3>
                    <div class="blog-meta">By ${blog.author || "Author"} • ${blog.date || "2026"}</div>
                    <p>${blog.content}</p>
                </div>
            `;
            homeContainer.appendChild(card);
        });
    }

    const createBlogForm = document.getElementById("create-blog-form");
    const userBlogContainer = document.getElementById("user-blog-container");

    if (createBlogForm && userBlogContainer) {
        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }

        document.getElementById("welcome-user").textContent = `Welcome, ${currentUser.username}`;

        const renderDashboardBlogs = () => {
            const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
            const myBlogs = blogs.filter(b => b.author === currentUser.username);
            userBlogContainer.innerHTML = "";

            if (myBlogs.length === 0) {
                userBlogContainer.innerHTML = "<p>You haven't published any posts yet. Write your first one above!</p>";
                return;
            }

            myBlogs.forEach(blog => {
                const card = document.createElement("div");
                card.className = "blog-card";
                card.innerHTML = `
                    <div>
                        <span class="badge">${blog.category}</span>
                        <h3>${blog.title}</h3>
                        <div class="blog-meta">${blog.date}</div>
                        <p>${blog.content}</p>
                    </div>
                    <button class="btn btn-danger" data-id="${blog.id}">Delete Post</button>
                `;
                userBlogContainer.appendChild(card);
            });

            document.querySelectorAll(".btn-danger").forEach(button => {
                button.addEventListener("click", (e) => {
                    const postId = Number(e.target.getAttribute("data-id"));
                    const updatedBlogs = blogs.filter(b => b.id !== postId);
                    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
                    renderDashboardBlogs();
                });
            });
        };

        renderDashboardBlogs();

        createBlogForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const title = document.getElementById("blog-title").value.trim();
            const category = document.getElementById("blog-category").value;
            const content = document.getElementById("blog-content").value.trim();

            const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
            const newPost = {
                id: Date.now(),
                title,
                category,
                author: currentUser.username,
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                content
            };

            blogs.unshift(newPost);
            localStorage.setItem("blogs", JSON.stringify(blogs));

            createBlogForm.reset();
            renderDashboardBlogs();
        });
    }
});