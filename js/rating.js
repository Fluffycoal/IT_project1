 document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');

    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        highlightStars(star.dataset.value);
      });
      star.addEventListener('mouseout', () => {
        highlightStars(ratingInput.value);
      });
      star.addEventListener('click', () => {
        ratingInput.value = star.dataset.value;
        highlightStars(star.dataset.value);
      });
    });

    function highlightStars(rating) {
      stars.forEach(star => {
        if (parseInt(star.dataset.value) <= rating) {
          star.classList.add('selected');
        } else {
          star.classList.remove('selected');
        }
      });
    }
  });