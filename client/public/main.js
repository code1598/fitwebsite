// Original JavaScript for menu and animations remains the same

// Auth Modal Functionality
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const authModal = document.getElementById("auth-modal");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const closeBtns = document.getElementsByClassName("close");

loginBtn.onclick = () => {
  authModal.style.display = "block";
  loginForm.style.display = "block";
  registerForm.style.display = "none";
}

registerBtn.onclick = () => {
  authModal.style.display = "block";
  loginForm.style.display = "none";
  registerForm.style.display = "block";
}

// Close modal functionality
Array.from(closeBtns).forEach(btn => {
  btn.onclick = function() {
    authModal.style.display = "none";
    bmiModal.style.display = "none";
  }
});

window.onclick = function(event) {
  if (event.target == authModal) {
    authModal.style.display = "none";
  }
  if (event.target == bmiModal) {
    bmiModal.style.display = "none";
  }
}

// Login Form Submission
document.getElementById("loginForm").onsubmit = async (e) => {
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
      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      authModal.style.display = "none";
      updateUIForLoggedInUser();
    } else {
      alert('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login.');
  }
};

// Register Form Submission
document.getElementById("registerForm").onsubmit = async (e) => {
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
      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      authModal.style.display = "none";
      updateUIForLoggedInUser();
    } else {
      alert('Registration failed. Username might be taken.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration.');
  }
};

// BMI Calculator Modal
const bmiModal = document.getElementById("bmi-modal");
const bmiResult = document.getElementById("bmi-result");

document.getElementById("bmiForm").onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const height = formData.get('height') / 100; // Convert cm to meters
  const weight = formData.get('weight');
  
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

  bmiResult.innerHTML = `Your BMI is ${bmiValue} (${category})`;
  bmiResult.className = className;

  // If user is logged in, save BMI data
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    try {
      await fetch('/api/user/stats', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          height: formData.get('height'),
          weight: formData.get('weight'),
        }),
      });
    } catch (error) {
      console.error('Error saving BMI data:', error);
    }
  }
};

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
