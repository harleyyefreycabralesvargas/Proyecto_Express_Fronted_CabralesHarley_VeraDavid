document.addEventListener('DOMContentLoaded', function() {
    const locationText = document.querySelector('.location');
    const settingsIcon = document.querySelector('.settings');
    const dots = document.querySelectorAll('.pagination .dot');
    
    // Make location clickable
    locationText.addEventListener('click', function() {
      alert('Change location clicked');
    });
    
    // Make settings clickable
    settingsIcon.addEventListener('click', function() {
      alert('Settings clicked');
    });
    
    // Make dots clickable for pagination
    dots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        
        // You could add functionality to change the forecast days here
        alert(`Page ${index + 1} clicked`);
      });
    });
    
    // Update time
    function updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      document.querySelector('.status-bar .time').textContent = `${hours}:${minutes}`;
    }
    
    // Update time every minute
    updateTime();
    setInterval(updateTime, 60000);
  });