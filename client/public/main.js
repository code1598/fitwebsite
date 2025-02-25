// Mobile Menu Toggle
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

// Close menu when clicking on a link
navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});


// Auth Modal Functionality
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const authModal = document.getElementById("auth-modal");
const authTabs = document.querySelectorAll(".auth-tab");
const authForms = document.querySelectorAll(".auth-form");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Tab switching
authTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const targetForm = tab.dataset.tab;

    authTabs.forEach(t => t.classList.remove("active"));
    authForms.forEach(f => f.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(`${targetForm}-form`).classList.add("active");
  });
});

// Form submissions
loginForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password'),
      }),
    });

    if (response.ok) {
      authModal.style.display = "none";
      window.location.reload();
    } else {
      alert('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login.');
  }
};

registerForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password'),
      }),
    });

    if (response.ok) {
      authModal.style.display = "none";
      window.location.reload();
    } else {
      alert('Registration failed. Username might be taken.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration.');
  }
};

loginBtn.onclick = () => {
  authModal.style.display = "block";
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
};

registerBtn.onclick = () => {
  authModal.style.display = "block";
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
};


// BMI Calculator Modal
const bmiModal = document.getElementById("bmi-modal");
const bmiForm = document.getElementById("bmiForm");
const bmiResult = document.getElementById("bmi-result");
const bmiCalculatorBtn = document.getElementById("bmi-calculator-btn");

bmiCalculatorBtn.onclick = () => {
  bmiModal.style.display = "block";
};

bmiForm.onsubmit = async (e) => {
  e.preventDefault();
  const height = Number(e.target.height.value) / 100; // Convert to meters
  const weight = Number(e.target.weight.value);

  if (height > 0 && weight > 0) {
    const bmi = weight / (height * height);
    const bmiValue = bmi.toFixed(1);

    let category, className;
    if (bmi < 18.5) {
      category = "Underweight";
      className = "bmi-warning";
    } else if (bmi < 25) {
      category = "Normal weight";
      className = "bmi-normal";
    } else if (bmi < 30) {
      category = "Overweight";
      className = "bmi-warning";
    } else {
      category = "Obese";
      className = "bmi-danger";
    }

    bmiResult.textContent = `Your BMI is ${bmiValue} (${category})`;
    bmiResult.className = className;

    // If user is logged in, save BMI data
    try {
      const response = await fetch('/api/user/stats', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          height: height * 100, // Convert back to cm for storage
          weight: weight
        }),
      });
      if (!response.ok) {
        console.log('Failed to save BMI data');
      }
    } catch (error) {
      console.error('Error saving BMI data:', error);
    }
  }
};

// Close modals when clicking outside
window.onclick = (event) => {
  if (event.target === bmiModal) {
    bmiModal.style.display = "none";
  }
  if (event.target === authModal) {
    authModal.style.display = "none";
  }
};

// Close button functionality
document.querySelectorAll(".close").forEach(closeBtn => {
  closeBtn.onclick = function() {
    this.closest(".modal").style.display = "none";
  };
});

// Update UI based on authentication state
function updateUIForLoggedInUser() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    // Add logout button
    const logoutBtn = document.createElement('li');
    logoutBtn.innerHTML = '<a href="#" id="logout-btn">LOGOUT</a>';
    document.getElementById('nav-links').appendChild(logoutBtn);

    logoutBtn.onclick = async () => {
      try {
        await fetch('/api/logout', { method: 'POST' });
        localStorage.removeItem('user');
        location.reload();
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
  }
}

// Check authentication state on page load
updateUIForLoggedInUser();

// ScrollReveal animations
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__content h1", scrollRevealOption);
ScrollReveal().reveal(".header__content h2", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content p", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__btn", {
  ...scrollRevealOption,
  delay: 1500,
});

ScrollReveal().reveal(".about__card", {
  duration: 1000,
  interval: 500,
});

ScrollReveal().reveal(".session__card", {
  ...scrollRevealOption,
  interval: 500,
});

// Add program content data
const programContent = {
  strength: {
    title: "Strength Training Program",
    exercises: [
      {
        name: "Bench Press",
        sets: "4 sets",
        reps: "8-12 reps",
        description: "Compound exercise targeting chest, shoulders, and triceps"
      },
      {
        name: "Deadlift",
        sets: "4 sets",
        reps: "6-8 reps",
        description: "Full body exercise focusing on back and legs"
      },
      {
        name: "Squats",
        sets: "4 sets",
        reps: "8-12 reps",
        description: "Lower body compound exercise"
      }
    ]
  },
  cardio: {
    title: "Cardio Fitness Program",
    exercises: [
      {
        name: "HIIT Intervals",
        sets: "5 rounds",
        reps: "30 sec work/30 sec rest",
        description: "High-intensity cardio intervals"
      },
      {
        name: "Running",
        sets: "1 set",
        reps: "30 minutes",
        description: "Steady-state cardio training"
      },
      {
        name: "Jump Rope",
        sets: "3 sets",
        reps: "2 minutes each",
        description: "High-intensity cardio conditioning"
      }
    ]
  },
  flexibility: {
    title: "Flexibility Training Program",
    exercises: [
      {
        name: "Dynamic Stretching",
        sets: "2 rounds",
        reps: "10 reps each",
        description: "Full body mobility warm-up"
      },
      {
        name: "Yoga Flow",
        sets: "1 set",
        reps: "20 minutes",
        description: "Flexibility and balance training"
      },
      {
        name: "Static Stretching",
        sets: "1 set",
        reps: "30 sec holds",
        description: "Post-workout flexibility routine"
      }
    ]
  },
  "weight-loss": {
    title: "Weight Loss Program",
    exercises: [
      {
        name: "Circuit Training",
        sets: "3 rounds",
        reps: "45 sec work/15 sec rest",
        description: "Full body circuit for fat loss"
      },
      {
        name: "Metabolic Conditioning",
        sets: "4 sets",
        reps: "10-15 reps each",
        description: "High-intensity fat burning workout"
      },
      {
        name: "Cardio Intervals",
        sets: "6 rounds",
        reps: "1 min work/30 sec rest",
        description: "Interval training for weight loss"
      }
    ]
  }
};

// Add click handlers for program buttons
document.querySelectorAll('.view-program').forEach(button => {
  button.addEventListener('click', () => {
    const programType = button.dataset.program;
    const program = programContent[programType];

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>${program.title}</h2>
        <div class="program-exercises">
          ${program.exercises.map(exercise => `
            <div class="exercise-item">
              <h3>${exercise.name}</h3>
              <p><strong>Sets:</strong> ${exercise.sets}</p>
              <p><strong>Reps:</strong> ${exercise.reps}</p>
              <p>${exercise.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Add modal to page
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Add close functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      modal.remove();
    };

    // Close on outside click
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
        modal.remove();
      }
    };
  });
});