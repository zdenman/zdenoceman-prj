function updateCountdown() {
    // const now = new Date().getTime();

    const now = new Date("2024-01-01").getTime();
  
    // Set the date for New Year's Day
    const newYear = new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0).getTime();
    // const now = newYear - 7200000; // 2 hours in milliseconds
    // Calculate the time remaining
    const timeRemaining = newYear - now;
  
    if(timeRemaining > 0){
      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
      minutes = (minutes < 10 ? "0" : "") + minutes;
      seconds = (seconds < 10 ? "0" : "") + seconds;
  
    let countdownHTML = "";

    if (days > 0) {
      countdownHTML += `${days}<span>d</span> `;
    }
    if (hours > 0 || days > 0) {
        countdownHTML += `${hours}<span>h</span> `;
      }
  
      countdownHTML += `${minutes}<span>min</span> ${seconds}<span>sec</span>`;

    // Display the countdown
    document.getElementById('countdown').innerHTML = countdownHTML;
     // Update every second
     setTimeout(updateCountdown, 1000);
    } else {
      // Stop the countdown and start fireworks
      const container = document.querySelector('.container');
      const fireworks = new Fireworks.default(container, {
        autoresize: true,
      opacity: 0.5,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.5,
      particles: 50,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 5,
      intensity: 30,
      flickering: 50,
      lineStyle: 'round',
      hue: {
        min: 0,
        max: 360
      },
      delay: {
        min: 30,
        max: 60
      },
      rocketsPoint: {
        min: 50,
        max: 50
      },
      lineWidth: {
        explosion: {
          min: 1,
          max: 3
        },
        trace: {
          min: 1,
          max: 2
        }
      },
      brightness: {
        min: 50,
        max: 80
      },
      decay: {
        min: 0.015,
        max: 0.03
      },
      mouse: {
        click: false,
        move: false,
        max: 1
      },
      boundaries: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight
      }});
      fireworks.start();
  
      document.getElementById('countdown').innerHTML = `Happy New Year 2024`;
    }
  }
  
  // Initial call to start the countdown
  updateCountdown();