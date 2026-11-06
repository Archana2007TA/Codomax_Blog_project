// Sample blog data to initialize local storage
const sampleBlogs = [
    { title: "Getting Started with HTML", content: "Learn semantic tags and document structures easily." },
    { title: "Understanding CSS Grid", content: "Build responsive layouts without complex floats." }
];

document.addEventListener("DOMContentLoaded", () => {
    // --- PART 1: Form Validation Logic ---
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

            alert("Validation successful! Proceeding to register...");
        });
    }

    // --- PART 2: Local Storage & Dynamic Rendering Logic ---
    if (!localStorage.getItem("blogs")) {
        localStorage.setItem("blogs", JSON.stringify(sampleBlogs));
    }

    const blogs = JSON.parse(localStorage.getItem("blogs"));
    const container = document.getElementById("blog-container");

    if (container) {
        container.innerHTML = "";
        blogs.forEach(blog => {
            const card = document.createElement("div");
            card.className = "blog-card";
            card.innerHTML = `
                <h3>${blog.title}</h3>
                <p>${blog.content}</p>
            `;
            container.appendChild(card);
        });
    }
});