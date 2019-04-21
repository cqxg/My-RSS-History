function selectReview(event) {
    const target = event.target.closest("input");
    if (target && this.contains(target)) {
        cleanSelection();
        const review = document.getElementById(`review-${target.value}`);
        review.style.display = "block";
        target.checked = true;
    }
}

function cleanSelection() {
    [].forEach.call(reviewsButtons.children, button => button.checked = false);
    [].forEach.call(reviewsContent.children, review => review.style.display = "none");
}

const reviewsButtons = document.getElementById("reviewsButtons");
const reviewsContent = document.getElementById("reviewsContent");

reviewsButtons.addEventListener('click', selectReview);