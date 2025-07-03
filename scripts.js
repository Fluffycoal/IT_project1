function scrollCarousel(direction) {
  const container = document.getElementById('popularCarousel');
  const scrollAmount = 150; // adjust as needed
  container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}