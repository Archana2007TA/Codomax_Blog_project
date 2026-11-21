const SUPABASE_URL = "https://uwuroygqsvocxvyxxqhl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_icKmCStwdzrQ8aQmsg6CwA_eIUJUUOg";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const currentUser = session ? session.user : null;
    const navLinks = document.getElementById("nav-links");

    if (navLinks) {
        if (currentUser) {
            const displayName = currentUser.user_metadata?.username || currentUser.email;
            navLinks.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="dashboard.html">Dashboard</a></li>
                <li><button id="logout-btn" class="btn-logout">Logout (${displayName})</button></li>
            `;
            document.getElementById("logout-btn").addEventListener("click", async () => {
                await supabaseClient.auth.signOut();
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
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById("username");
            const username = usernameInput ? usernameInput.value.trim() : "";
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!email || !password || (usernameInput && !username)) {
                alert("Please fill in all fields.");
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters long.");
                return;
            }

            const { error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: { data: { username } }
            });

            if (error) {
                alert("Registration failed: " + error.message);
                return;
            }

            alert("Registration successful! Please log in.");
            window.location.href = "login.html";
        });
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

            if (error) {
                alert("Login failed: " + error.message);
                return;
            }

            window.location.href = "dashboard.html";
        });
    }

    const homeContainer = document.getElementById("blog-container");
    if (homeContainer) {
        const { data: blogs, error } = await supabaseClient
            .from("blogs")
            .select("*")
            .order("id", { ascending: false });

        homeContainer.innerHTML = "";

        if (error) {
            homeContainer.innerHTML = `<p>Error loading blogs: ${error.message}</p>`;
        } else if (!blogs || blogs.length === 0) {
            homeContainer.innerHTML = "<p style='color: var(--text-secondary);'>No posts published yet.</p>";
        } else {
            blogs.forEach(blog => {
                const authorName = blog.author || "Author";
                const initials = authorName.slice(0, 2).toUpperCase();
                const card = document.createElement("article");
                card.className = "blog-card";

                const topDiv = document.createElement("div");
                topDiv.innerHTML = `<span class="badge">${blog.category || "General"}</span><h3>${blog.title}</h3>`;

                const p = document.createElement("p");
                p.textContent = blog.content;
                topDiv.appendChild(p);

                const footerDiv = document.createElement("div");
                footerDiv.className = "card-footer";
                footerDiv.innerHTML = `
                    <div class="author-info">
                        <div class="avatar">${initials}</div>
                        <div class="author-details">
                            <span class="author-name">${authorName}</span>
                            <span class="post-date">${blog.date || "2026"}</span>
                        </div>
                    </div>
                    <a href="post.html?id=${blog.id}" class="read-more-btn">Read Article &rarr;</a>
                `;

                card.appendChild(topDiv);
                card.appendChild(footerDiv);
                homeContainer.appendChild(card);
            });
        }
    }

    const singlePostContainer = document.getElementById("single-post-container");
    if (singlePostContainer) {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get("id");

        if (!postId) {
            document.getElementById("post-title").textContent = "No Post Selected";
        } else {
            const { data: blog, error } = await supabaseClient
                .from("blogs")
                .select("*")
                .eq("id", postId)
                .single();

            if (error || !blog) {
                document.getElementById("post-title").textContent = "Post Not Found";
            } else {
                document.getElementById("post-category").textContent = blog.category;
                document.getElementById("post-title").textContent = blog.title;
                document.getElementById("post-meta").textContent = `Published by ${blog.author} • ${blog.date}`;
                document.getElementById("post-content").textContent = blog.content;
            }
        }
    }

    const createBlogForm = document.getElementById("create-blog-form");
    const userBlogContainer = document.getElementById("user-blog-container");

    if (createBlogForm && userBlogContainer) {
        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }

        const authorName = currentUser.user_metadata?.username || currentUser.email;
        document.getElementById("welcome-user").textContent = `Welcome back, ${authorName}`;

        const renderDashboardBlogs = async () => {
            const { data: myBlogs, error } = await supabaseClient
                .from("blogs")
                .select("*")
                .eq("author", authorName)
                .order("id", { ascending: false });

            userBlogContainer.innerHTML = "";

            if (error) {
                userBlogContainer.innerHTML = `<p style='color: var(--text-secondary);'>Error: ${error.message}</p>`;
                return;
            }

            if (!myBlogs || myBlogs.length === 0) {
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
                button.addEventListener("click", async (e) => {
                    const postId = Number(e.target.getAttribute("data-id"));
                    const { error: deleteError } = await supabaseClient
                        .from("blogs")
                        .delete()
                        .eq("id", postId);

                    if (deleteError) {
                        alert("Could not delete post: " + deleteError.message);
                        return;
                    }

                    renderDashboardBlogs();
                });
            });
        };

        renderDashboardBlogs();

        createBlogForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const title = document.getElementById("blog-title").value.trim();
            const category = document.getElementById("blog-category").value;
            const content = document.getElementById("blog-content").value.trim();

            const { error: insertError } = await supabaseClient
                .from("blogs")
                .insert([{
                    title,
                    category,
                    author: authorName,
                    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    content
                }]);

            if (insertError) {
                alert("Error publishing post: " + insertError.message);
                return;
            }

            createBlogForm.reset();
            renderDashboardBlogs();
        });
    }
});