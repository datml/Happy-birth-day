// Select all puzzle pieces and the reset button
const pieces = document.querySelectorAll('.puzzle-piece');
const resetBtn = document.getElementById('reset-btn');

// Attach event listener to each puzzle piece
pieces.forEach(piece => {
  piece.addEventListener('click', function() {
    // Only reveal if this piece has not been revealed yet
    if (!this.classList.contains('revealed')) {
      const wish = this.getAttribute('data-wish');
      this.textContent = wish;
      this.classList.add('revealed');
    }
  });
});

// Reset functionality to restore the original state
resetBtn.addEventListener('click', function() {
  pieces.forEach(piece => {
    piece.classList.remove('revealed');
    piece.textContent = '?';
  });
});
