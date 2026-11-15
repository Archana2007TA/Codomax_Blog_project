const sampleBlogs = [
    {
        id: 1,
        title: "Getting Started with Semantic HTML5",
        category: "Web Development",
        author: "Adithya",
        date: "Nov 10, 2026",
        content: "Semantic HTML5 tags like &lt;header&gt;, &lt;main&gt;, &lt;article&gt;, and &lt;section&gt; give your web pages clear meaning for both browsers and screen readers. Instead of wrapping everything in generic &lt;div&gt; containers, using semantic structures improves SEO, accessibility, and code readability across large frontend projects."
    },
    {
        id: 2,
        title: "Mastering Responsive Layouts with CSS Grid",
        category: "CSS & Design",
        author: "Adithya",
        date: "Nov 12, 2026",
        content: "CSS Grid introduces a true two-dimensional layout system to the web. By combining grid-template-columns with repeat(auto-fill, minmax(320px, 1fr)), you can create fluid card grids that adapt seamlessly from desktop monitors to mobile screens without writing dozens of complex media queries."
    },
    {
        id: 3,
        title: "Client-Side State Management with LocalStorage",
        category: "JavaScript",
        author: "Codomax Team",
        date: "Nov 14, 2026",
        content: "Modern web applications often need to persist user sessions and dynamic content across page reloads. Using JSON.stringify() and JSON.parse() with the browser's localStorage API lets you build complete authentication flows and CRUD dashboards in pure vanilla JavaScript."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    let storedBlogs = JSON.parse(localStorage.getItem("blogs"));

    // Force update sample data if it has broken tags or missing fields
    if (!storedBlogs || storedBlogs.some(b => !b.category || !b.author || b.content.includes(",,,"))) {
        localStorage.setItem("blogs", JSON.stringify(sampleBlogs));
        storedBlogs = sampleBlogs;
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

            if (!username || !email || !password) {
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

        // Create reader modal dynamically
        const modal = document.createElement("div");
        modal.className = "modal-overlay";
        modal.innerHTML = `
            <div class="modal-box">
                <div class="modal-header">
                    <span class="badge" id="modal-category"></span>
                    <button class="close-modal" id="close-modal">&times;</button>
                </div>
                <h2 id="modal-title" style="margin-bottom: 0.5rem;"></h2>
                <p id="modal-meta" style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;"></p>
                <p id="modal-content" style="color: var(--text-secondary); line-height: 1.8; white-space: pre-line;"></p>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("close-modal").addEventListener("click", () => modal.classList.remove("active"));
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("active");
        });

        blogs.forEach(blog => {
            const initials = blog.author ? blog.author.slice(0, 2).toUpperCase() : "CB";
            const card = document.createElement("article");
            card.className = "blog-card";
            
            // Build card structure safely using textContent for paragraph text
            const topDiv = document.createElement("div");
            topDiv.innerHTML = `<span class="badge">${blog.category || "General"}</span><h3>${blog.title}</h3>`;
            
            const p = document.createElement("p");
            p.textContent = blog.content; // Safe from HTML tag stripping
            topDiv.appendChild(p);

            const footerDiv = document.createElement("div");
            footerDiv.className = "card-footer";
            footerDiv.innerHTML = `
                <div class="author-info">
                    <div class="avatar">${initials}</div>
                    <div class="author-details">
                        <span class="author-name">${blog.author || "Author"}</span>
                        <span class="post-date">${blog.date || "2026"}</span>
                    </div>
                </div>
                <button class="read-more-btn" data-id="${blog.id}">Read Article &rarr;</button>
            `;

            card.appendChild(topDiv);
            card.appendChild(footerDiv);
            homeContainer.appendChild(card);
        });

        document.querySelectorAll(".read-more-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = Number(e.target.getAttribute("data-id"));
                const post = blogs.find(b => b.id === id);
                if (post) {
                    document.getElementById("modal-category").textContent = post.category;
                    document.getElementById("modal-title").textContent = post.title;
                    document.getElementById("modal-meta").textContent = `Published by ${post.author} • ${post.date}`;
                    document.getElementById("modal-content").textContent = post.content;
                    modal.classList.add("active");
                }
            });
        });
    }

    const createBlogForm = document.getElementById("create-blog-form");
    const userBlogContainer = document.getElementById("user-blog-container");

    if (createBlogForm && userBlogContainer) {
        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }

        document.getElementById("welcome-user").textContent = `Welcome back, ${currentUser.username}`;

        const renderDashboardBlogs = () => {
            const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
            const myBlogs = blogs.filter(b => b.author === currentUser.username);
            userBlogContainer.innerHTML = "";

            if (myBlogs.length === 0) {
                userBlogContainer.innerHTML = "<p style='color: var(--text-secondary);'>You haven't published any posts yet. Write your first article above!</p>";
                return;
            }

            myBlogs.forEach(blog => {
                const card = document.createElement("article");
                card.className = "blog-card";
                
                const topDiv = document.createElement("div");
                topDiv.innerHTML = `<span class="badge">${blog.category}</span><h3>${blog.title}</h3>`;
                const p = document.createElement("p");
                p.textContent = blog.content;
                topDiv.appendChild(p);

                const footerDiv = document.createElement("div");
                footerDiv.className = "card-footer";
                footerDiv.innerHTML = `
                    <span class="post-date">${blog.date}</span>
                    <button class="btn btn-danger" data-id="${blog.id}">Delete Post</button>
                `;

                card.appendChild(topDiv);
                card.appendChild(footerDiv);
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