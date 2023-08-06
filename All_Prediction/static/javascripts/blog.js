document.addEventListener("DOMContentLoaded", function () {
    const blogPosts = document.querySelectorAll(".blog-post");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
    const closeModal = document.getElementById("closeModal");

    blogPosts.forEach((post) => {
        post.addEventListener("click", function () {
            const title = post.querySelector("h2").textContent;
            const content = post.querySelector("p").textContent;
            modalTitle.textContent = title;
            modalContent.textContent = content;
            modal.style.display = "block";
        });
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});
