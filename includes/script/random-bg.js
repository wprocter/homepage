// This script sets a random image (named 1.jpg, 2.jpg, etc.) from the includes/bg folder as the page background.

// Total images in includes/bg named sequentially (1.jpg, 2.jpg, ... n.jpg)
const imageCount = 7; // <-- Update this number to match your total files in includes/bg
const extension = 'jpg';

document.addEventListener('DOMContentLoaded', function() {
  // Pick a random number between 1 and imageCount
  const randomIndex = Math.floor(Math.random() * imageCount) + 1;
  const imageUrl = `includes/bg/${randomIndex}.${extension}`;

  // Apply as background
  document.body.style.backgroundImage = `url('${imageUrl}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center center';
  document.body.style.backgroundRepeat = 'no-repeat';
});
