/* ==========================================================================
   FitNova — Javascript Logic & Interactive Engine
   ========================================================================== */

// --- MOUSE CURSOR SYSTEM ---
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  if (cursor) {
    cursor.style.left = e.clientX - 6 + 'px';
    cursor.style.top = e.clientY - 6 + 'px';
  }
});

function refreshCursorListeners() {
  if (!cursor) return;
  document.querySelectorAll('a, button, input, select, .auth-tab, .diet-card-btn, .workout-card-btn, .diet-water-glass, .workout-chk-wrapper input, .diet-checkbox-wrapper input').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2.2)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
  });
}
refreshCursorListeners();

// --- CARD ANIMATION INTERSECTION OBSERVER ---
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.05 });

function observeElements() {
  document.querySelectorAll('.program-card, .trainer-card, .pricing-card, .stat-item, .workout-step-card, .gym-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
    observer.observe(el);
  });
}
observeElements();

// --- INTERACTIVE AUTHENTICATION MODAL FUNCTIONS ---
function openAuthModal(e, tab) {
  if (e) e.preventDefault();
  const modal = document.getElementById('authOverlay');
  if (modal) {
    modal.classList.add('active');
    switchAuthTab(tab);
  }
}
function toggleAuthModal() {
  const modal = document.getElementById('authOverlay');
  if (modal) modal.classList.toggle('active');
}
function closeAuthModal(e) {
  if (e && e.target.id === 'authOverlay') toggleAuthModal();
}
function switchAuthTab(type) {
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const formLogin = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');
  const formForgot = document.getElementById('form-forgot');

  if (tabLogin) tabLogin.classList.toggle('active', type === 'login');
  if (tabSignup) tabSignup.classList.toggle('active', type === 'signup');
  if (formLogin) formLogin.classList.toggle('active', type === 'login');
  if (formSignup) formSignup.classList.toggle('active', type === 'signup');
  if (formForgot) formForgot.classList.toggle('active', type === 'forgot');
}
function handleAuthSubmit(e) {
  e.preventDefault();
  alert('Welcome athlete! You have successfully signed into the platform.');
  toggleAuthModal();
}
function handleForgotPassword(e) {
  e.preventDefault();
  const emailInput = e.target.querySelector('input[type="email"]');
  const email = emailInput ? emailInput.value : '';
  alert('A password reset link has been dispatched to ' + email + '.');
  switchAuthTab('login');
  e.target.reset();
}

// --- INTERACTIVE CHATBOT FUNCTIONS ---
function toggleBotWindow() {
  const windowEl = document.getElementById('botWindow');
  if (windowEl) {
    windowEl.classList.toggle('active');
  }
}
function sendBotMessage() {
  const input = document.getElementById('botInput');
  if (!input) return;
  const msgText = input.value.trim();
  if (!msgText) return;

  appendBubble(msgText, 'user');
  input.value = '';

  setTimeout(() => {
    let response = "Consistency is the key to mastering fitness. Explore our Interactive Workout Generator or calculate your metrics in the Health Dashboard!";
    const lower = msgText.toLowerCase();
    if (lower.includes('price') || lower.includes('membership') || lower.includes('cost') || lower.includes('plan')) {
      response = "Our Digital subscription tiers start at Free (Basic), ₹2,499/mo for Pro Digital access, up to our ₹5,999/mo customized 1:1 VIP Coaching track.";
    } else if (lower.includes('program') || lower.includes('workout') || lower.includes('exercise')) {
      response = "We offer tailored pathways like Home Calisthenics, Strength & Power, HIIT Blaze, Mindful Yoga, and Stress Relief. Try the Workout Generator below to build a routine right now!";
    } else if (lower.includes('diet') || lower.includes('nutrition') || lower.includes('recipe') || lower.includes('eat')) {
      response = "Our Diet Planner generates custom daily plans based on your TDEE. We support Vegan, Vegetarian, Balanced, and Keto meals complete with step-by-step recipes.";
    } else if (lower.includes('mindful') || lower.includes('breath') || lower.includes('meditate') || lower.includes('sleep')) {
      response = "Try our new Mindfulness section! It includes a guided breathing bubble set to the 4-7-8 rhythm to instantly lower stress and calm your nervous system.";
    }
    appendBubble(response, 'bot');
  }, 700);
}
function appendBubble(text, side) {
  const container = document.getElementById('botMessages');
  if (!container) return;
  const bubble = document.createElement('div');
  bubble.className = `msg-bubble ${side}`;
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

// --- UNIFIED HEALTH DASHBOARD ENGINE (BMI, BMR, TDEE) ---
let activeDashboardTab = 'bmi';
let activeUnit = 'metric';

function setDashboardTab(tabName) {
  activeDashboardTab = tabName;
  document.getElementById('tab-btn-bmi').classList.toggle('active', tabName === 'bmi');
  document.getElementById('tab-btn-bmr').classList.toggle('active', tabName === 'bmr');
  
  // Update fields display
  const genderField = document.getElementById('dash-field-gender');
  const ageField = document.getElementById('dash-field-age');
  const activityField = document.getElementById('dash-field-activity');
  
  if (tabName === 'bmi') {
    genderField.style.display = 'none';
    ageField.style.display = 'none';
    activityField.style.display = 'none';
    document.getElementById('dash-calc-btn-text').textContent = 'Calculate BMI';
  } else {
    genderField.style.display = 'block';
    ageField.style.display = 'block';
    activityField.style.display = 'block';
    document.getElementById('dash-calc-btn-text').textContent = 'Calculate BMR & TDEE';
  }
  resetDashboardResult();
}

function setUnit(unit) {
  activeUnit = unit;
  document.getElementById('btn-metric').classList.toggle('active', unit === 'metric');
  document.getElementById('btn-imperial').classList.toggle('active', unit === 'imperial');
  
  const heightInput = document.getElementById('dash-height');
  const weightInput = document.getElementById('dash-weight');
  const heightUnitLbl = document.getElementById('height-unit-label');
  const weightUnitLbl = document.getElementById('weight-unit-label');
  
  if (unit === 'metric') {
    heightInput.placeholder = '175';
    weightInput.placeholder = '70';
    heightUnitLbl.textContent = 'centimetres (cm)';
    weightUnitLbl.textContent = 'kilograms (kg)';
  } else {
    heightInput.placeholder = '69';
    weightInput.placeholder = '154';
    heightUnitLbl.textContent = 'inches (in)';
    weightUnitLbl.textContent = 'pounds (lbs)';
  }
  heightInput.value = '';
  weightInput.value = '';
  resetDashboardResult();
}

function resetDashboardResult() {
  document.getElementById('dash-placeholder').style.display = 'block';
  document.getElementById('dash-output-block').style.display = 'none';
  document.getElementById('dash-result-box').classList.remove('show');
  
  // Reset row highlight
  ['row-under', 'row-normal', 'row-over', 'row-obese'].forEach(id => {
    const row = document.getElementById(id);
    if (row) row.classList.remove('active-row');
  });
}

function calculateDashboard() {
  const hInput = document.getElementById('dash-height');
  const wInput = document.getElementById('dash-weight');
  const h = parseFloat(hInput.value);
  const w = parseFloat(wInput.value);
  
  if (!h || !w || h <= 0 || w <= 0) {
    hInput.style.borderColor = '#ff4500';
    wInput.style.borderColor = '#ff4500';
    setTimeout(() => {
      hInput.style.borderColor = '';
      wInput.style.borderColor = '';
    }, 1000);
    return;
  }
  
  // BMI calculation
  let bmi = (activeUnit === 'metric') ? w / ((h / 100) * (h / 100)) : (703 * w) / (h * h);
  bmi = Math.round(bmi * 10) / 10;
  
  // Weight sync to other tool
  let weightKg = (activeUnit === 'metric') ? w : w * 0.453592;
  let heightCm = (activeUnit === 'metric') ? h : h * 2.54;
  
  // Sync to diet planner inputs
  const dietW = document.getElementById('diet-weight');
  const dietH = document.getElementById('diet-height');
  if (dietW) dietW.value = Math.round(weightKg);
  if (dietH) dietH.value = Math.round(heightCm);
  
  if (activeDashboardTab === 'bmi') {
    // Render BMI results
    let category, color, advice, rowId, needlePct;
    if (bmi < 18.5) {
      category = 'Underweight';
      color = '#38bdf8';
      rowId = 'row-under';
      needlePct = Math.max(2, (bmi / 18.5) * 20);
      advice = 'Your BMI suggests you may be underweight. Focus on nutrient-dense meals and strength training to build muscle.';
    } else if (bmi < 25) {
      category = 'Normal Weight';
      color = '#34d399';
      rowId = 'row-normal';
      needlePct = 20 + ((bmi - 18.5) / 6.4) * 30;
      advice = 'Great job — you are in the healthy range! Keep up your active lifestyle, balanced workouts, and consistent nutrition.';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = '#fbbf24';
      rowId = 'row-over';
      needlePct = 50 + ((bmi - 25) / 5) * 25;
      advice = 'You are in the overweight range. Clean up your nutrition intake and increase daily physical activity with HIIT or strength sessions.';
    } else {
      category = 'Obese';
      color = '#ef4444';
      rowId = 'row-obese';
      needlePct = Math.min(98, 75 + ((bmi - 30) / 10) * 23);
      advice = 'Your BMI is in the obese range. We suggest focusing on dietary portion controls, active step targets, and structured workouts.';
    }
    
    document.getElementById('dash-placeholder').style.display = 'none';
    document.getElementById('dash-output-block').style.display = 'block';
    document.getElementById('dash-result-box').classList.add('show');
    
    document.getElementById('dash-number').textContent = bmi.toFixed(1);
    document.getElementById('dash-number').style.color = color;
    document.getElementById('dash-category').textContent = category;
    document.getElementById('dash-category').style.color = color;
    document.getElementById('dash-advice').textContent = advice;
    
    // Position Needle
    setTimeout(() => {
      const needle = document.getElementById('dash-needle');
      if (needle) needle.style.left = needlePct + '%';
    }, 100);
    
    // Highlight table rows
    ['row-under', 'row-normal', 'row-over', 'row-obese'].forEach(id => {
      const r = document.getElementById(id);
      if (r) r.classList.remove('active-row');
    });
    const activeRow = document.getElementById(rowId);
    if (activeRow) activeRow.classList.add('active-row');
    
    // Hide BMR metric summary row
    document.getElementById('dash-bmr-metrics').style.display = 'none';
    document.getElementById('dash-scale-container').style.display = 'block';
    document.getElementById('dash-table-container').style.display = 'block';
    
  } else {
    // Render BMR & TDEE results
    const ageInput = document.getElementById('dash-age');
    const age = parseInt(ageInput.value || 25);
    const gender = document.getElementById('dash-gender').value;
    const activity = parseFloat(document.getElementById('dash-activity').value || 1.4);
    
    // Mifflin-St Jeor Formula
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    
    bmr = Math.round(bmr);
    const tdee = Math.round(bmr * activity);
    const water = Math.round(weightKg * 35); // ml rule: 35ml per kg of bodyweight
    
    document.getElementById('dash-placeholder').style.display = 'none';
    document.getElementById('dash-output-block').style.display = 'block';
    document.getElementById('dash-result-box').classList.add('show');
    
    document.getElementById('dash-number').textContent = tdee;
    document.getElementById('dash-number').style.color = 'var(--fire)';
    document.getElementById('dash-category').textContent = 'Daily TDEE Target (Calories)';
    document.getElementById('dash-category').style.color = 'var(--white)';
    
    document.getElementById('dash-advice').textContent = `Your Basal Metabolic Rate (BMR) is ${bmr} kcal. To maintain your weight at this activity scale, you require ${tdee} calories daily. Water hydration target is ${water} ml.`;
    
    // Populating sub metrics
    document.getElementById('val-bmr').textContent = bmr + ' kcal';
    document.getElementById('val-tdee').textContent = tdee + ' kcal';
    document.getElementById('val-water').textContent = (water / 1000).toFixed(1) + ' L';
    
    document.getElementById('dash-bmr-metrics').style.display = 'grid';
    document.getElementById('dash-scale-container').style.display = 'none';
    document.getElementById('dash-table-container').style.display = 'none';
  }
}

// --- DYNAMIC WORKOUT GENERATOR ---
let selectedWorkoutGoal = 'lose';
let selectedWorkoutEquipment = 'bodyweight';
let selectedWorkoutLevel = 'beginner';

function selectWorkoutGoal(goal) {
  selectedWorkoutGoal = goal;
  document.querySelectorAll('#workout-goal-select .workout-card-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`#workout-goal-select .workout-card-btn[data-goal="${goal}"]`).classList.add('active');
}

function selectWorkoutEquipment(eq) {
  selectedWorkoutEquipment = eq;
  document.querySelectorAll('#workout-eq-select .workout-card-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`#workout-eq-select .workout-card-btn[data-eq="${eq}"]`).classList.add('active');
}

const exercisesDatabase = {
  warmup: [
    { name: "Arm Circles & Shoulder rolls", desc: "Loosen joints in shoulders and upper back", time: "1 min", reps: "Continuous" },
    { name: "Dynamic Bodyweight Lunges", desc: "Warm up legs, hips, and core muscles", time: "1.5 min", reps: "8 per leg" },
    { name: "Jumping Jacks", desc: "Raise core body temperature and heart rate", time: "1 min", reps: "Continuous" },
    { name: "Cat-Cow Stretch & Wrist Prep", desc: "Mobilize spine and prep joints for load", time: "1.5 min", reps: "10 flexions" }
  ],
  cooldown: [
    { name: "Child's Pose Deep Breathing", desc: "Slow heart rate down and stretch lower back", time: "2 min", reps: "Hold" },
    { name: "Standing Hamstring Reach", desc: "Lengthen posterior chain", time: "1.5 min", reps: "Hold 45s per side" },
    { name: "Cobra stretch to Hip Flexor stretch", desc: "Stretches chest, abdominals, and hips", time: "2 min", reps: "Hold" }
  ],
  movements: {
    bodyweight: {
      lose: {
        beginner: [
          { name: "Air Squats", desc: "Stand with feet shoulder-width, lower hips past knees. Keep chest tall.", specs: "3 sets x 15 reps (Rest: 45s)" },
          { name: "Incline Push Ups", desc: "Place hands on elevated surface like table or stairs. Maintain rigid body.", specs: "3 sets x 10 reps (Rest: 60s)" },
          { name: "Reverse Lunges", desc: "Step back, drop rear knee to 1 inch above floor. Return to start.", specs: "3 sets x 12 reps (Rest: 45s)" },
          { name: "Plank Hold", desc: "Rest on elbows and toes. Engage core, glutes, and thighs. Do not let hips sag.", specs: "3 sets x 30 sec (Rest: 45s)" }
        ],
        intermediate: [
          { name: "Jump Squats", desc: "Squat down, explode vertically. Soft landing, absorb impact.", specs: "4 sets x 12 reps (Rest: 45s)" },
          { name: "Standard Floor Push Ups", desc: "Keep elbows tucked at 45-degree angle. Touch chest to floor.", specs: "4 sets x 12 reps (Rest: 60s)" },
          { name: "Bicycle Crunches", desc: "Elbow to opposite knee. Control rotation, squeeze core.", specs: "3 sets x 20 reps (Rest: 45s)" },
          { name: "Burpees", desc: "Drop to pushup, snap feet in, jump vertically. Complete movement.", specs: "4 sets x 10 reps (Rest: 60s)" }
        ],
        advanced: [
          { name: "Pistol Squats (Single Leg)", desc: "Balance on one leg, extend other out, perform full deep squat.", specs: "4 sets x 6 per leg (Rest: 60s)" },
          { name: "Decline Push Ups", desc: "Feet elevated on chair/sofa, hands on floor. Target upper chest.", specs: "4 sets x 15 reps (Rest: 60s)" },
          { name: "Jump Lunges", desc: "Split squat setup, jump up and switch legs in mid-air.", specs: "4 sets x 16 reps (Rest: 45s)" },
          { name: "Hanging Leg Raises", desc: "Hang from bar, raise toes to touch the bar without swinging.", specs: "4 sets x 12 reps (Rest: 60s)" }
        ]
      },
      gain: {
        beginner: [
          { name: "Tempo Air Squats", desc: "Perform squats with a 3-second descent. Build time under tension.", specs: "4 sets x 12 reps (Rest: 60s)" },
          { name: "Push Ups", desc: "Standard chest-to-floor push ups. Keep body in linear alignment.", specs: "3 sets x 12 reps (Rest: 60s)" },
          { name: "Glute Bridges", desc: "Lie on back, drive hips upward by squeezing glutes at peak.", specs: "3 sets x 15 reps (Rest: 45s)" },
          { name: "Plank Pulls", desc: "Get in plank, drag imaginary light weight under chest side to side.", specs: "3 sets x 16 reps (Rest: 45s)" }
        ],
        intermediate: [
          { name: "Bulgarian Split Squats", desc: "Elevate back leg on bench. Squat deep on front leg.", specs: "4 sets x 10 per leg (Rest: 60s)" },
          { name: "Diamond Push Ups", desc: "Form diamond shape with index fingers and thumbs. Targets triceps.", specs: "4 sets x 10 reps (Rest: 60s)" },
          { name: "Pull Ups", desc: "Pull chin over bar. Hang fully at bottom, do not swing legs.", specs: "4 sets x 8 reps (Rest: 90s)" },
          { name: "Hollow Body Hold", desc: "Lie on back, lift shoulder blades and feet off floor. Press low back flat.", specs: "3 sets x 40 sec (Rest: 45s)" }
        ],
        advanced: [
          { name: "Handstand Push Ups", desc: "Kick up against wall. Lower head to floor, push out to lockout.", specs: "4 sets x 8 reps (Rest: 90s)" },
          { name: "Archer Push Ups", desc: "Slide body to one side, extending opposite arm fully outward.", specs: "4 sets x 10 reps (Rest: 60s)" },
          { name: "Towel Chin-Ups", desc: "Hang towels over bar, grip towels, pull chest to hands to build grip.", specs: "4 sets x 8 reps (Rest: 90s)" },
          { name: "Single Leg Calf Raises", desc: "Raise on step. Complete stretch at bottom, squeeze at peak.", specs: "4 sets x 20 per leg (Rest: 45s)" }
        ]
      },
      endurance: {
        beginner: [
          { name: "Mountain Climbers", desc: "Drive knees to chest rapidly in pushup stance.", specs: "4 sets x 30 sec (Rest: 30s)" },
          { name: "Plank Jacks", desc: "Get on elbows, hop feet outward and inward continuously.", specs: "3 sets x 30 sec (Rest: 30s)" },
          { name: "High Knees", desc: "Run in place driving knees up to hip height rapidly.", specs: "3 sets x 40 sec (Rest: 30s)" },
          { name: "Bodyweight Squats", desc: "Perform continuous air squats at a steady aerobic pace.", specs: "3 sets x 20 reps (Rest: 45s)" }
        ],
        intermediate: [
          { name: "Burpees", desc: "Drop, touch chest, jump up. Keep a steady cyclical rhythm.", specs: "4 sets x 12 reps (Rest: 45s)" },
          { name: "Plank Shoulder Taps", desc: "Pushup stance. Tap opposite shoulder. Minimize hip swaying.", specs: "3 sets x 30 reps (Rest: 30s)" },
          { name: "Jump Squats", desc: "Explosive squats. Focus on cardiovascular speed.", specs: "4 sets x 15 reps (Rest: 45s)" },
          { name: "Flutter Kicks", desc: "Lie down, kick legs up and down. Keep abs locked.", specs: "3 sets x 45 sec (Rest: 30s)" }
        ],
        advanced: [
          { name: "Advanced Burpee Broad Jumps", desc: "Perform burpee, then jump forward as far as possible.", specs: "4 sets x 10 reps (Rest: 60s)" },
          { name: "Spiderman Push Ups", desc: "Bring knee to elbow at the bottom of the push up phase.", specs: "4 sets x 12 reps (Rest: 45s)" },
          { name: "Jump Lunges", desc: "Switch lunges in mid-air continuously without stopping.", specs: "4 sets x 20 reps (Rest: 45s)" },
          { name: "V-Ups", desc: "Fold body in half, touch hands to toes at peak. Keep legs straight.", specs: "4 sets x 15 reps (Rest: 45s)" }
        ]
      },
      mobility: {
        beginner: [
          { name: "World's Greatest Stretch", desc: "Deep lunge, rotate chest and reach hand to sky.", specs: "3 sets x 5 per side (Rest: 30s)" },
          { name: "Cossack Squats", desc: "Wide stance, shift weight to one side squatting deep. Keep other leg straight.", specs: "3 sets x 8 per leg (Rest: 30s)" },
          { name: "Downward Facing Dog", desc: "Press hips up, heels to floor, chest toward knees.", specs: "3 sets x 45 sec (Rest: 30s)" },
          { name: "Prone Y-T-W Raises", desc: "Lie face down, lift arms in Y, T, and W patterns to activate shoulders.", specs: "3 sets x 12 reps (Rest: 30s)" }
        ],
        intermediate: [
          { name: "90-90 Hip Switch", desc: "Sit on floor, knees bent at 90 degrees. Rotate hips side to side.", specs: "3 sets x 10 reps (Rest: 30s)" },
          { name: "Deep Squat Hold", desc: "Squat to bottom, press elbows against knees, pry hips open.", specs: "3 sets x 60 sec (Rest: 30s)" },
          { name: "Pigeon Stretch", desc: "Fold leg forward, sit hips back to target deep glutes.", specs: "3 sets x 45s per leg (Rest: 30s)" },
          { name: "Scapular Wall Slides", desc: "Lean back on wall, slide arms up and down keeping elbows contact.", specs: "3 sets x 12 reps (Rest: 30s)" }
        ],
        advanced: [
          { name: "Bridge Hold Walkouts", desc: "Push into wheel bridge, slowly walk feet out and back.", specs: "3 sets x 3 reps (Rest: 60s)" },
          { name: "Deep Cossack Squats (Weighted/Flow)", desc: "Glide side to side dynamically at lowest hip level.", specs: "3 sets x 12 reps (Rest: 30s)" },
          { name: "Jefferson Curls (Light load)", desc: "Roll spine down vertebrae by vertebrae, hang, slowly pull up.", specs: "3 sets x 8 reps (Rest: 45s)" },
          { name: "Advanced Shoulder Pass-Throughs", desc: "Use stick or band, rotate arms over head and back with narrow grip.", specs: "3 sets x 12 reps (Rest: 30s)" }
        ]
      }
    },
    minimal: {
      lose: {
        beginner: [
          { name: "Dumbbell Goblet Squat", desc: "Hold one dumbbell vertically at chest, squat down.", specs: "3 sets x 12 reps (Rest: 45s)" },
          { name: "Dumbbell Floor Press", desc: "Lie on floor, press dumbbells up. Elbows touch floor at bottom.", specs: "3 sets x 10 reps (Rest: 60s)" },
          { name: "Dumbbell Bent-Over Row", desc: "Hinge at hips, pull dumbbells to rib cage, squeeze back.", specs: "3 sets x 12 reps (Rest: 45s)" },
          { name: "Dumbbell Farmers Walk", desc: "Hold heavy dumbbells, walk tall with good posture.", specs: "3 sets x 40 sec (Rest: 45s)" }
        ],
        intermediate: [
          { name: "Dumbbell Thrusters", desc: "Squat down, explode up pressing dumbbells overhead.", specs: "4 sets x 10 reps (Rest: 60s)" },
          { name: "Dumbbell Romanian Deadlifts", desc: "Hinge hips back, lower weights down shins. Keep back flat.", specs: "4 sets x 12 reps (Rest: 60s)" },
          { name: "Dumbbell Renegade Rows", desc: "Plank stance on weights. Row one dumbbell up, alternate sides.", specs: "3 sets x 16 reps (Rest: 60s)" },
          { name: "Dumbbell Russian Twists", desc: "Sit, float feet, rotate dumbbell side to side under control.", specs: "3 sets x 20 reps (Rest: 45s)" }
        ],
        advanced: [
          { name: "Dumbbell Clean and Press", desc: "Pull dumbbells from shin to shoulder, then drive overhead.", specs: "4 sets x 10 reps (Rest: 60s)" },
          { name: "Dumbbell Walking Lunges", desc: "Hold weights at sides, step forward into lunges continuously.", specs: "4 sets x 20 steps (Rest: 45s)" },
          { name: "Dumbbell Devil Press", desc: "Perform burpee on dumbbells, then swing weights overhead.", specs: "4 sets x 8 reps (Rest: 90s)" },
          { name: "Dumbbell Plank Pull-Throughs", desc: "Plank stance, reach under body and drag dumbbell across.", specs: "4 sets x 12 reps (Rest: 45s)" }
        ]
      },
      gain: {
        beginner: [
          { name: "Dumbbell Goblet Squats", desc: "Squat down with weight at chest. 3-sec slow descent.", specs: "4 sets x 10 reps (Rest: 60s)" },
          { name: "Dumbbell Floor Press", desc: "Lie on back, press weights. Focus on squeezing chest.", specs: "3 sets x 12 reps (Rest: 60s)" },
          { name: "Dumbbell Romanian Deadlift", desc: "Targets hamstrings and glutes. Move slowly.", specs: "3 sets x 12 reps (Rest: 60s)" },
          { name: "Dumbbell Overhead Shoulder Press", desc: "Stand tall, press dumbbells from shoulder level to lockout.", specs: "3 sets x 10 reps (Rest: 60s)" }
        ],
        intermediate: [
          { name: "Dumbbell Bulgarian Split Squats", desc: "Elevate back foot, squat with dumbbells at sides.", specs: "4 sets x 10 per leg (Rest: 60s)" },
          { name: "Dumbbell Incline Bench Press", desc: "Bench at 30 degrees. Press weights, stretch chest at bottom.", specs: "4 sets x 10 reps (Rest: 75s)" },
          { name: "Dumbbell Incline Rows", desc: "Lie chest down on incline bench, row dumbbells upward.", specs: "4 sets x 12 reps (Rest: 60s)" },
          { name: "Dumbbell Hammer Curls to Triceps Kickbacks", desc: "Biceps curl, then bend over and kick weights back.", specs: "3 sets x 12 reps (Rest: 60s)" }
        ],
        advanced: [
          { name: "Dumbbell Snatch (Alternating)", desc: "Pull dumbbell from floor, explode using hips to drive it overhead.", specs: "4 sets x 10 per arm (Rest: 60s)" },
          { name: "Dumbbell Goblet Cyclist Squats", desc: "Elevate heels on board, hold weight at chest, squat very deep.", specs: "4 sets x 15 reps (Rest: 60s)" },
          { name: "Weighted Chest Dips", desc: "Place dumbbell between feet, perform dips on parallel bars.", specs: "4 sets x 8 reps (Rest: 90s)" },
          { name: "Dumbbell Meadows Row", desc: "Row one side of barbell or heavy dumbbell with pronated grip.", specs: "4 sets x 10 per arm (Rest: 60s)" }
        ]
      },
      endurance: {
        beginner: [
          { name: "Light Dumbbell Squat to Press", desc: "Clean squat, press light weights overhead continuously.", specs: "3 sets x 15 reps (Rest: 30s)" },
          { name: "Light Dumbbell Rows", desc: "Hinge back, row weights at a rapid cardiovascular pace.", specs: "3 sets x 15 reps (Rest: 30s)" },
          { name: "Dumbbell Suitcase Carry", desc: "Carry one dumbbell on one side. Walk briskly, switch sides.", specs: "3 sets x 40s per side (Rest: 30s)" },
          { name: "High Knees", desc: "Hold light dumbbells at chest, run in place rapidly.", specs: "3 sets x 30 sec (Rest: 30s)" }
        ],
        intermediate: [
          { name: "Dumbbell Man Makers", desc: "Pushup, row left, row right, hop feet in, clean and thruster.", specs: "4 sets x 6 reps (Rest: 75s)" },
          { name: "Dumbbell Swings (Kettlebell Style)", desc: "Hold one dumbbell head, swing between legs up to eye level.", specs: "4 sets x 20 reps (Rest: 45s)" },
          { name: "Dumbbell Goblet Lunges (Alternating)", desc: "Hold weight at chest, perform stepping lunges rapidly.", specs: "4 sets x 18 reps (Rest: 45s)" },
          { name: "Dumbbell Plank Hops", desc: "Hold dumbbells, hop feet in and out in pushup stance.", specs: "3 sets x 30 sec (Rest: 30s)" }
        ],
        advanced: [
          { name: "Double Dumbbell Snatch to Overhead Lunge", desc: "Snatch two dumbbells overhead, perform backward lunges.", specs: "4 sets x 8 reps (Rest: 60s)" },
          { name: "Dumbbell Devil Press", desc: "Chest to floor burpee on dumbbells, swing up to overhead lock.", specs: "4 sets x 10 reps (Rest: 75s)" },
          { name: "Dumbbell Goblet Squat Jumps", desc: "Hold light dumbbell at chest, perform jumping squats.", specs: "4 sets x 15 reps (Rest: 45s)" },
          { name: "Dumbbell Woodchoppers", desc: "Rotate dumbbell diagonally from knee to opposite shoulder.", specs: "4 sets x 12 per side (Rest: 30s)" }
        ]
      },
      mobility: {
        beginner: [
          { name: "Dumbbell Goblet squat prying", desc: "Sit in deep squat with light dumbbell, press knees with elbows.", specs: "3 sets x 5 reps (Rest: 30s)" },
          { name: "Light Dumbbell Arm Bars", desc: "Lie on back, press light dumbbell, rotate body while locking arm.", specs: "3 sets x 5 per side (Rest: 45s)" },
          { name: "Dumbbell Halo", desc: "Hold dumbbell upside down, rotate it around head to warm up neck/shoulders.", specs: "3 sets x 10 reps (Rest: 30s)" },
          { name: "Standing Toe Touch (Plate/Dumbbell Assist)", desc: "Stand on elevated step, slowly reach down with light weight.", specs: "3 sets x 10 reps (Rest: 30s)" }
        ],
        intermediate: [
          { name: "Light Dumbbell Windmills", desc: "Hold dumbbell overhead, hinge hips, slide other hand to foot.", specs: "3 sets x 6 per side (Rest: 45s)" },
          { name: "Dumbbell Overhead Squat (Very Light)", desc: "Press light weights overhead, squat deep. Stabilizes shoulders.", specs: "3 sets x 8 reps (Rest: 60s)" },
          { name: "Active Chest Openers with dumbbells", desc: "Lie on bench, perform wide light flyes, hold bottom stretch.", specs: "3 sets x 10 reps (Rest: 45s)" },
          { name: "Kneeling Thoracic Rotations", desc: "Hold light dumbbell close, rotate chest up while kneeling.", specs: "3 sets x 8 per side (Rest: 30s)" }
        ],
        advanced: [
          { name: "Heavy Dumbbell Windmills", desc: "Unlock deep hip and shoulder mobility with higher loads.", specs: "3 sets x 5 per side (Rest: 60s)" },
          { name: "Turkish Get-Ups", desc: "Move from lying down to standing up keeping weight locked overhead.", specs: "3 sets x 3 per arm (Rest: 90s)" },
          { name: "Dumbbell Overhead Lunge (Walking)", desc: "Walk forward in lunges with dumbbells locked straight overhead.", specs: "3 sets x 12 steps (Rest: 60s)" },
          { name: "Deep Jefferson Curls (Weighted)", desc: "Stand on box, roll spine down holding dumbbells past feet.", specs: "3 sets x 8 reps (Rest: 60s)" }
        ]
      }
    },
    gym: {
      lose: {
        beginner: [
          { name: "Barbell Back Squats", desc: "Bar on back, squat down till thighs are parallel. Keep core tight.", specs: "3 sets x 10 reps (Rest: 60s)" },
          { name: "Lat Pulldown (Machine)", desc: "Pull bar to upper chest. Squeeze shoulder blades at bottom.", specs: "3 sets x 12 reps (Rest: 45s)" },
          { name: "Leg Press Machine", desc: "Press footplate away. Do not lock knees at top of movement.", specs: "3 sets x 12 reps (Rest: 60s)" },
          { name: "Treadmill Walk (Incline)", desc: "Walk on treadmill at 8% incline, active fat burning zone.", specs: "1 set x 10 min (Rest: None)" }
        ],
        intermediate: [
          { name: "Barbell Deadlifts", desc: "Pull bar from floor, lock out hips at top. Keep spine neutral.", specs: "4 sets x 8 reps (Rest: 90s)" },
          { name: "Barbell Bench Press", desc: "Touch chest, press up. Focus on chest contraction.", specs: "4 sets x 10 reps (Rest: 75s)" },
          { name: "Seated Cable Rows", desc: "Pull handle to belly button, extend arms fully to stretch lat muscles.", specs: "4 sets x 12 reps (Rest: 60s)" },
          { name: "Hanging Leg Raises", desc: "Hang from pullup bar, lift toes to bar, control swing.", specs: "3 sets x 12 reps (Rest: 45s)" }
        ],
        advanced: [
          { name: "Front Squats", desc: "Bar resting on front shoulders. Keep elbows high, squat deep.", specs: "4 sets x 6 reps (Rest: 90s)" },
          { name: "Barbell Overhead Press", desc: "Press bar overhead from collarbone to lockout. Engage core.", specs: "4 sets x 8 reps (Rest: 75s)" },
          { name: "Weighted Pull Ups", desc: "Attach weight plate to dip belt, perform strict chin-overs.", specs: "4 sets x 6 reps (Rest: 90s)" },
          { name: "Prowler Sled Push", desc: "Load sled with heavy plates, push 30m down turf track.", specs: "4 sets x 30 meters (Rest: 60s)" }
        ]
      },
      gain: {
        beginner: [
          { name: "Barbell Back Squat", desc: "Squat down with barbell on upper back trap shelf.", specs: "4 sets x 8 reps (Rest: 90s)" },
          { name: "Barbell Bench Press", desc: "Touch barbell to chest, press to lock out. Target mid-chest.", specs: "4 sets x 8 reps (Rest: 90s)" },
          { name: "Barbell Row", desc: "Pull barbell to mid-section keeping torso at 45 degrees.", specs: "3 sets x 10 reps (Rest: 75s)" },
          { name: "Dumbbell Overhead Shoulder Press", desc: "Sit on bench with dumbbells, press vertically.", specs: "3 sets x 10 reps (Rest: 75s)" }
        ],
        intermediate: [
          { name: "Barbell Deadlift", desc: "Lift barbell from floor. Squeeze glutes and lock out hips.", specs: "4 sets x 5 reps (Rest: 2 min)" },
          { name: "Incline Barbell Bench Press", desc: "Targets upper pectorals. 30-degree incline.", specs: "4 sets x 8 reps (Rest: 90s)" },
          { name: "Leg Press Machine", desc: "Load plates, lower knees to 90 degrees, press up.", specs: "4 sets x 10 reps (Rest: 90s)" },
          { name: "EZ-Bar Bicep Curls to Skull Crushers", desc: "Superset: Stand and curl, then lie on bench and extend triceps.", specs: "3 sets x 12 reps (Rest: 75s)" }
        ],
        advanced: [
          { name: "Barbell Squats (Heavy)", desc: "High intensity squats. Focus on absolute power.", specs: "5 sets x 5 reps (Rest: 2.5 min)" },
          { name: "Barbell Deadlift (Heavy)", desc: "Absolute strength. Pull with perfect flat back form.", specs: "5 sets x 3 reps (Rest: 3 min)" },
          { name: "Weighted Chest Dips", desc: "Heavy dips on parallel bars with weight plates on belt.", specs: "4 sets x 8 reps (Rest: 90s)" },
          { name: "Barbell Romanian Deadlift", desc: "Hinge at hips, load hamstrings. Squeeze glutes to stand.", specs: "4 sets x 10 reps (Rest: 90s)" }
        ]
      },
      endurance: {
        beginner: [
          { name: "Light Barbell Thrusters", desc: "Squat and press light empty barbell continuously.", specs: "3 sets x 15 reps (Rest: 45s)" },
          { name: "Cable Pulldowns", desc: "Perform pulldowns rapidly at a cardiovascular pace.", specs: "3 sets x 15 reps (Rest: 30s)" },
          { name: "Rowing Machine (Ergometer)", desc: "Steady row. Drive with legs, pull with back.", specs: "1 set x 10 min (Rest: None)" },
          { name: "Dumbbell Farmers Walk", desc: "Walk briskly carrying moderate weights in hands.", specs: "3 sets x 60 sec (Rest: 45s)" }
        ],
        intermediate: [
          { name: "Barbell Clean and Press", desc: "Clean empty bar to shoulders, press. Cycle rapidly.", specs: "4 sets x 12 reps (Rest: 60s)" },
          { name: "Kettlebell Swings", desc: "Hinge hips, drive kettlebell to shoulder height.", specs: "4 sets x 20 reps (Rest: 45s)" },
          { name: "Assault Air Bike", desc: "Intense pedal and push/pull handles for calorie burn.", specs: "4 sets x 45 sec (Rest: 45s)" },
          { name: "Medicine Ball Slams", desc: "Lift ball overhead, slam into floor with full force.", specs: "4 sets x 15 reps (Rest: 30s)" }
        ],
        advanced: [
          { name: "Barbell Snatch (Olympic)", desc: "Explosive pull from floor to overhead lock in one motion.", specs: "5 sets x 5 reps (Rest: 90s)" },
          { name: "Prowler Sled Push-Pull", desc: "Push sled 30m, then pull it back using a heavy rope.", specs: "4 sets x 60 meters (Rest: 75s)" },
          { name: "Weighted Box Jumps", desc: "Hold dumbbells or wear vest, jump onto 24-inch box.", specs: "4 sets x 10 reps (Rest: 60s)" },
          { name: "Battle Ropes", desc: "Create waves with heavy ropes in half-squat stance.", specs: "4 sets x 40 sec (Rest: 30s)" }
        ]
      },
      mobility: {
        beginner: [
          { name: "Barbell squat prying (Empty Bar)", desc: "Hold empty bar, sit in deep squat, shift ankle weight.", specs: "3 sets x 5 reps (Rest: 45s)" },
          { name: "Swiss Ball back stretch", desc: "Lie face up on Swiss ball, extend arms and stretch spine.", specs: "3 sets x 60 sec (Rest: 30s)" },
          { name: "Band Pull-Aparts", desc: "Hold resistance band, pull arms apart to engage mid-back.", specs: "3 sets x 15 reps (Rest: 30s)" },
          { name: "Kettlebell Goblet Lunge with twist", desc: "Lunge forward with light kettlebell, rotate torso over leg.", specs: "3 sets x 10 reps (Rest: 30s)" }
        ],
        intermediate: [
          { name: "Kettlebell Windmills", desc: "Rotate hip, lock kettlebell straight up, touch floor.", specs: "3 sets x 6 per side (Rest: 45s)" },
          { name: "Barbell Overhead Squat (Empty Bar)", desc: "Bar locked straight overhead, perform full squat.", specs: "3 sets x 8 reps (Rest: 60s)" },
          { name: "Band Dislocates", desc: "Hold band wide, rotate straight arms over head to lower back.", specs: "3 sets x 12 reps (Rest: 30s)" },
          { name: "Cable Face Pulls with external rotation", desc: "Pull cable rope to forehead, rotate elbows high at end.", specs: "3 sets x 12 reps (Rest: 45s)" }
        ],
        advanced: [
          { name: "Heavy Kettlebell Windmills", desc: "Unlock deep core stability and shoulder packing under load.", specs: "3 sets x 5 per side (Rest: 60s)" },
          { name: "Turkish Get-Ups (Barbell or heavy KB)", desc: "Perform full get-ups under heavy load to build stability.", specs: "3 sets x 2 per side (Rest: 90s)" },
          { name: "Barbell Overhead Lunge (Walking)", desc: "Lunge forward holding loaded barbell overhead.", specs: "3 sets x 12 steps (Rest: 60s)" },
          { name: "Weighted Hanging Decompression", desc: "Hang from pullup bar with weight belt, breathe deeply.", specs: "3 sets x 60 sec (Rest: 45s)" }
        ]
      }
    }
  }
};

function generateWorkout() {
  const goal = selectedWorkoutGoal;
  const eq = selectedWorkoutEquipment;
  const level = document.getElementById('workout-level').value;
  const dur = parseInt(document.getElementById('workout-duration').value);
  
  const moveDb = exercisesDatabase.movements[eq][goal][level];
  const warmup = exercisesDatabase.warmup;
  const cooldown = exercisesDatabase.cooldown;
  
  let routine = [];
  
  // Warmup step
  const activeWarm = warmup[Math.floor(Math.random() * warmup.length)];
  routine.push({
    num: "01",
    tag: "Warm-Up",
    name: activeWarm.name,
    desc: activeWarm.desc,
    specs: `${activeWarm.reps} | Time: ${activeWarm.time}`
  });
  
  // Movement steps
  moveDb.forEach((mov, index) => {
    routine.push({
      num: `0${index + 2}`,
      tag: "Main Exercise",
      name: mov.name,
      desc: mov.desc,
      specs: mov.specs
    });
  });
  
  // Cooldown step
  const activeCool = cooldown[Math.floor(Math.random() * cooldown.length)];
  routine.push({
    num: `0${moveDb.length + 2}`,
    tag: "Cool-Down & Stretch",
    name: activeCool.name,
    desc: activeCool.desc,
    specs: `${activeCool.reps} | Time: ${activeCool.time}`
  });
  
  // Update HTML UI
  document.getElementById('workout-placeholder').style.display = 'none';
  const outBlock = document.getElementById('workout-output');
  outBlock.style.display = 'block';
  document.getElementById('workout-result-box').classList.add('has-content');
  
  // Populate summaries
  let goalLbl = "Fat Loss";
  if (goal === 'gain') goalLbl = "Muscle Building";
  else if (goal === 'endurance') goalLbl = "Endurance Blaze";
  else if (goal === 'mobility') goalLbl = "Mobility Flow";
  
  let eqLbl = "Bodyweight Focus";
  if (eq === 'minimal') eqLbl = "Dumbbells Only";
  else if (eq === 'gym') eqLbl = "Full Gym Access";
  
  document.getElementById('workout-title-display').textContent = `Custom ${goalLbl}`;
  document.getElementById('workout-desc-display').textContent = `Targeted routine optimized for your ${level} fitness level. Check items as you train.`;
  
  document.getElementById('workout-time-target').textContent = dur + 'm';
  document.getElementById('workout-eq-target').textContent = eq === 'bodyweight' ? 'None' : (eq === 'minimal' ? 'DBs' : 'Gym');
  document.getElementById('workout-ex-target').textContent = routine.length;
  
  // Render step cards
  const listContainer = document.getElementById('workout-list');
  listContainer.innerHTML = '';
  
  routine.forEach((step, idx) => {
    const card = document.createElement('div');
    card.className = 'workout-step-card';
    card.innerHTML = `
      <div class="workout-chk-wrapper">
        <input type="checkbox" id="work-chk-${idx}" onchange="toggleWorkoutStep(${idx}, this.checked)">
        <div class="workout-chk-custom"></div>
      </div>
      <div class="workout-step-info">
        <div class="workout-step-num">${step.tag} — ${step.num}</div>
        <div class="workout-step-name" id="work-name-${idx}">${step.name}</div>
        <div class="workout-step-details">${step.desc}</div>
        <div class="workout-step-specs"><span>⚙️ Setup: <strong>${step.specs}</strong></span></div>
      </div>
    `;
    listContainer.appendChild(card);
  });
  
  // Reset logged count
  document.getElementById('workout-logged-target').textContent = "0";
  
  refreshCursorListeners();
  observeElements();
}

function toggleWorkoutStep(idx, isChecked) {
  const cards = document.querySelectorAll('#workout-list .workout-step-card');
  if (cards[idx]) {
    cards[idx].classList.toggle('completed', isChecked);
  }
  
  // Count checked items
  const checkboxes = document.querySelectorAll('#workout-list input[type="checkbox"]');
  let checkedCount = 0;
  checkboxes.forEach(chk => {
    if (chk.checked) checkedCount++;
  });
  
  document.getElementById('workout-logged-target').textContent = checkedCount;
}

// --- DYNAMIC DIET PLANNER & RECIPE MODAL ENGINE ---
// Expanded Recipe Database
const recipesDatabase = {
  // Vegetarian (veg) Recipes
  "Oatmeal with Almond Milk, Chia Seeds & Berries": {
    time: "10 min",
    serves: "1",
    ingredients: [
      "1/2 cup Rolled Oats",
      "1 cup Almond Milk (unsweetened)",
      "1 tbsp Chia Seeds",
      "1/2 cup Fresh Mixed Berries",
      "1 tsp Honey or Maple Syrup",
      "Pinch of Cinnamon"
    ],
    steps: [
      "In a small saucepan, combine the rolled oats and almond milk.",
      "Bring to a gentle simmer over medium heat, stirring occasionally for 5-6 minutes until oats are soft.",
      "Remove from heat and stir in the chia seeds and cinnamon.",
      "Pour into a bowl, top with fresh berries, and drizzle with honey or maple syrup before serving."
    ]
  },
  "Vegetarian Tofu Scramble with Spinach & Tomatoes": {
    time: "15 min",
    serves: "1",
    ingredients: [
      "150g Firm Tofu (drained and crumbled)",
      "1 cup Fresh Spinach (chopped)",
      "1/2 cup Cherry Tomatoes (halved)",
      "1/4 tsp Turmeric Powder",
      "1/4 tsp Black Pepper & Salt",
      "1 tsp Olive Oil"
    ],
    steps: [
      "Heat olive oil in a non-stick skillet over medium heat.",
      "Add crumbled tofu, turmeric, salt, and black pepper. Sauté for 5 minutes, breaking up tofu with a spatula.",
      "Add halved cherry tomatoes and chopped spinach. Sauté for another 3 minutes until spinach is wilted.",
      "Serve hot with a slice of whole grain toast if desired."
    ]
  },
  "Moong Dal Cheela (Lentil Crepes) with Mint Chutney": {
    time: "20 min",
    serves: "2",
    ingredients: [
      "1 cup Yellow Moong Dal (soaked for 3 hours and blended into paste)",
      "1/2 tsp Ginger-Green Chili paste",
      "1/4 tsp Turmeric & Asafoetida",
      "1/2 cup Mint & Coriander leaves",
      "1 tsp Oil for cooking"
    ],
    steps: [
      "Blend soaked dal with ginger, green chili, and water into a smooth batter.",
      "Mix in salt, turmeric, and asafoetida. Whisk the batter well.",
      "Heat a flat non-stick pan, ladle batter, and spread in circular motion to form a thin crepe.",
      "Drizzle drops of oil at edges, flip when golden brown, and cook other side. Serve with fresh mint chutney."
    ]
  },
  "Quinoa Salad with Roasted Chickpeas & Cucumber": {
    time: "25 min",
    serves: "2",
    ingredients: [
      "1 cup Quinoa (cooked)",
      "1/2 cup Chickpeas (boiled/roasted)",
      "1 English Cucumber (diced)",
      "1/2 cup Bell Peppers & Parsley",
      "1 tbsp Olive Oil & Lemon juice"
    ],
    steps: [
      "In a large bowl, toss the cooked quinoa, diced cucumber, and bell peppers together.",
      "Add roasted chickpeas (spiced with cumin and paprika) to the bowl.",
      "Drizzle olive oil, fresh lemon juice, salt, and pepper over the salad.",
      "Toss gently and garnish with chopped fresh parsley. Serve chilled."
    ]
  },
  // Vegan Recipes
  "Tofu Scramble with Spinach, Bell Peppers & Nutritional Yeast": {
    time: "15 min",
    serves: "1",
    ingredients: [
      "150g Firm Tofu (crumbled)",
      "1/2 Bell Pepper (diced)",
      "1 cup Spinach leaves",
      "1 tbsp Nutritional Yeast",
      "1/4 tsp Turmeric & Garlic Powder",
      "1 tsp Coconut Oil"
    ],
    steps: [
      "Heat coconut oil in a pan. Sauté diced bell peppers for 3 minutes.",
      "Add crumbled tofu, turmeric, garlic powder, and nutritional yeast. Stir well.",
      "Cook for 5-6 minutes until tofu is lightly golden.",
      "Fold in fresh spinach leaves, cooking until wilted. Serve immediately."
    ]
  },
  "Tempeh Stir-fry with Cauliflower Rice & Sesame Sauce": {
    time: "20 min",
    serves: "1",
    ingredients: [
      "120g Tempeh (cubed)",
      "2 cups Cauliflower Rice",
      "1 cup Stir-fry Veggies (Broccoli, Snap Peas, Carrots)",
      "1 tbsp Soy Sauce (or Tamari)",
      "1 tsp Sesame Oil & Sesame seeds"
    ],
    steps: [
      "Sauté tempeh cubes in sesame oil until crispy on all sides.",
      "Add stir-fry vegetables to the pan, cooking for 5 minutes until tender-crisp.",
      "Stir in soy sauce, tossing to coat the tempeh and vegetables.",
      "Serve over hot steamed cauliflower rice, garnished with toasted sesame seeds."
    ]
  },
  // Balanced Recipes
  "Egg White Omelet with Spinach, Feta & Whole Wheat Toast": {
    time: "12 min",
    serves: "1",
    ingredients: [
      "4 Egg Whites",
      "1 cup Baby Spinach",
      "30g Feta Cheese (crumbled)",
      "1 slice Whole Wheat Bread (toasted)",
      "1 tsp Butter"
    ],
    steps: [
      "Whisk egg whites with salt and pepper until frothy.",
      "Melt butter in a pan, add spinach, and cook for 1 minute.",
      "Pour egg whites over spinach, cook until edges set, then sprinkle crumbled feta cheese.",
      "Fold the omelet in half, cook for 1 more minute, and serve with toasted whole wheat bread."
    ]
  },
  "Grilled Chicken Breast Salad with Vinaigrette Dressing": {
    time: "25 min",
    serves: "1",
    ingredients: [
      "150g Chicken Breast (seasoned)",
      "3 cups Mixed Salad Greens",
      "1/2 Avocado (sliced)",
      "1 tbsp Olive Oil",
      "1 tbsp Balsamic Vinegar",
      "1 tsp Dijon Mustard"
    ],
    steps: [
      "Grill seasoned chicken breast for 6-7 minutes per side until cooked through. Let rest, then slice.",
      "Place mixed greens and sliced avocado in a salad bowl.",
      "In a small jar, shake olive oil, balsamic vinegar, mustard, salt, and pepper to emulsify.",
      "Top greens with sliced chicken, drizzle with vinaigrette dressing, and toss."
    ]
  },
  // Keto Recipes
  "Bacon & Eggs (3 eggs) fried in Butter with Avocado": {
    time: "15 min",
    serves: "1",
    ingredients: [
      "3 Large Eggs",
      "3 Slices Bacon",
      "1 tbsp Butter",
      "1/2 Avocado (sliced)"
    ],
    steps: [
      "Fry bacon slices in a skillet over medium heat until crispy. Set aside, leaving fat in pan.",
      "Melt butter in the same pan, crack in the eggs, and fry to your liking (sunny-side up or scrambled).",
      "Plate the eggs and crispy bacon.",
      "Serve with fresh avocado slices seasoned with sea salt."
    ]
  },
  "Ribeye Steak with Garlic Butter Mushrooms": {
    time: "20 min",
    serves: "1",
    ingredients: [
      "220g Ribeye Steak",
      "1 cup Button Mushrooms (sliced)",
      "2 tbsp Butter",
      "2 cloves Garlic (minced)",
      "1 sprig Fresh Rosemary"
    ],
    steps: [
      "Sear seasoned ribeye in a smoking hot skillet with butter and rosemary for 3-4 minutes per side (medium-rare). Let rest.",
      "In the same pan, toss sliced mushrooms and minced garlic in the remaining steak juices and butter.",
      "Sauté mushrooms for 5 minutes until golden brown.",
      "Serve the steak topped with garlic butter mushrooms."
    ]
  }
};

// Open Recipe Modal function
function openRecipeModal(recipeName) {
  const modal = document.getElementById('recipeOverlay');
  if (!modal) return;
  
  // Default recipe data structure if not found in database
  const recipe = recipesDatabase[recipeName] || {
    time: "15 min",
    serves: "1",
    ingredients: ["Fresh Whole Foods", "Water & Herbs", "Calculated Macros"],
    steps: [
      "Gather ingredients and wash thoroughly.",
      "Cook at medium heat for 10-12 minutes.",
      "Season with herbs and enjoy fresh."
    ]
  };
  
  // Set content in Modal
  document.getElementById('rec-title').textContent = recipeName;
  document.getElementById('rec-time').textContent = recipe.time;
  document.getElementById('rec-serves').textContent = recipe.serves;
  
  // Compute macros of selected meal
  let mealInfo = null;
  if (generatedDietPlan) {
    generatedDietPlan.meals.forEach(m => {
      m.items.forEach(it => {
        if (it.name === recipeName) mealInfo = it;
      });
    });
  }
  
  if (mealInfo) {
    document.getElementById('rec-cal').textContent = mealInfo.cal + ' kcal';
    document.getElementById('rec-p').textContent = mealInfo.p + 'g';
    document.getElementById('rec-c').textContent = mealInfo.c + 'g';
    document.getElementById('rec-f').textContent = mealInfo.f + 'g';
    document.getElementById('rec-macros-row').style.display = 'flex';
  } else {
    document.getElementById('rec-macros-row').style.display = 'none';
  }
  
  // Populating ingredients
  const ingList = document.getElementById('rec-ing-list');
  ingList.innerHTML = '';
  recipe.ingredients.forEach(ing => {
    const li = document.createElement('li');
    li.textContent = ing;
    ingList.appendChild(li);
  });
  
  // Populating steps
  const stepsList = document.getElementById('rec-steps-list');
  stepsList.innerHTML = '';
  recipe.steps.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    stepsList.appendChild(li);
  });
  
  modal.classList.add('active');
  refreshCursorListeners();
}

function closeRecipeModal() {
  const modal = document.getElementById('recipeOverlay');
  if (modal) modal.classList.remove('active');
}

// --- MINDFULNESS GUIDED BREATHING ENGINE ---
let breathingInterval = null;
let breathingPhase = 'idle'; // idle, inhale, hold, exhale
let breathingSeconds = 0;
let breathingTotalCycles = 0;

function toggleBreathing() {
  const btn = document.getElementById('breath-control-btn');
  const container = document.getElementById('breathing-container');
  const label = document.getElementById('breath-state-label');
  const timer = document.getElementById('breath-timer-val');
  
  if (breathingInterval) {
    // Stop breathing loop
    clearInterval(breathingInterval);
    breathingInterval = null;
    breathingPhase = 'idle';
    container.className = 'breathing-container';
    label.textContent = 'Ready';
    timer.textContent = 'Press Start';
    btn.textContent = 'Start Guided Breathing';
    breathingTotalCycles = 0;
  } else {
    // Start breathing loop (4s Inhale, 7s Hold, 8s Exhale)
    btn.textContent = 'Stop Session';
    breathingTotalCycles = 0;
    runBreathingCycle();
  }
}

function runBreathingCycle() {
  const container = document.getElementById('breathing-container');
  const label = document.getElementById('breath-state-label');
  const timer = document.getElementById('breath-timer-val');
  
  // Set Phase: Inhale
  breathingPhase = 'inhale';
  breathingSeconds = 4;
  container.className = 'breathing-container inhale';
  label.textContent = 'Inhale Deeply';
  timer.textContent = breathingSeconds + 's';
  
  if (breathingInterval) clearInterval(breathingInterval);
  
  breathingInterval = setInterval(() => {
    breathingSeconds--;
    timer.textContent = breathingSeconds + 's';
    
    if (breathingSeconds <= 0) {
      if (breathingPhase === 'inhale') {
        // Transition to Hold
        breathingPhase = 'hold';
        breathingSeconds = 7;
        container.className = 'breathing-container hold';
        label.textContent = 'Hold Breath';
        timer.textContent = breathingSeconds + 's';
      } else if (breathingPhase === 'hold') {
        // Transition to Exhale
        breathingPhase = 'exhale';
        breathingSeconds = 8;
        container.className = 'breathing-container exhale';
        label.textContent = 'Exhale Slowly';
        timer.textContent = breathingSeconds + 's';
      } else if (breathingPhase === 'exhale') {
        // Increment cycles and restart
        breathingTotalCycles++;
        if (breathingTotalCycles >= 6) { // 6 complete cycles is about 2 minutes
          // Stop session naturally
          toggleBreathing();
          alert('Great job! You have completed a 2-minute mindful breathing session. Your nervous system is now calibrated.');
        } else {
          // Restart loop
          runBreathingCycle();
        }
      }
    }
  }, 1000);
}

// --- OVERPASS GEOLOCATION MAP FINDER ---
let userLat = null, userLng = null;
let allPlaces = [];
let currentFilter = 'all';

function locateUser() {
  const btn = document.getElementById('locate-btn');
  const txt = document.getElementById('locate-text');
  const status = document.getElementById('gyms-status');
  
  if (!navigator.geolocation) {
    status.textContent = 'Geolocation not supported by your browser.';
    return;
  }
  
  btn.classList.add('loading');
  txt.textContent = 'Locating you...';
  status.textContent = '';
  
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      txt.textContent = 'Location found!';
      status.textContent = 'Retrieving fitness locations in your area...';
      document.getElementById('gyms-filter').style.display = 'flex';
      fetchNearbyPlaces();
    },
    function (err) {
      btn.classList.remove('loading');
      txt.textContent = 'Use My Location';
      status.textContent = 'Could not get your location. Try enabling location services.';
    },
    { timeout: 8000 }
  );
}

function fetchNearbyPlaces() {
  const radius = 3000;
  const q = '[out:json][timeout:25];('
    + 'node["leisure"="fitness_centre"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + 'node["sport"="yoga"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + 'node["leisure"="sports_centre"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + 'node["leisure"="swimming_pool"]["access"!="private"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + 'node["leisure"="park"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + 'node["sport"="running"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + 'node["highway"="cycleway"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + 'node["sport"="cycling"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + 'way["leisure"="fitness_centre"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + 'way["leisure"="sports_centre"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + 'way["leisure"="park"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + 'way["highway"="cycleway"](around:' + radius + ',' + userLat + ',' + userLng + ');'
    + ');out center 25;';
    
  fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: 'data=' + encodeURIComponent(q) })
    .then(r => r.json())
    .then(data => processPlaces(data.elements))
    .catch(() => {
      document.getElementById('gyms-status').textContent = 'Could not load fitness locations from Overpass API. Try again.';
    });
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getPlaceType(tags) {
  if (!tags) return 'gym';
  if (tags.leisure === 'fitness_centre') return 'gym';
  if (tags.sport === 'yoga') return 'yoga';
  if (tags.leisure === 'swimming_pool') return 'pool';
  if (tags.leisure === 'park') return 'park';
  if (tags.leisure === 'sports_centre') return 'sport';
  if (tags.sport === 'running') return 'running';
  if (tags.highway === 'cycleway' || tags.sport === 'cycling') return 'cycling';
  return 'gym';
}

function getTypeLabel(t) {
  return {
    gym: 'Fitness Centre',
    yoga: 'Yoga Studio',
    pool: 'Swimming Pool',
    park: 'Active Park',
    sport: 'Sports Arena',
    running: 'Running Track',
    cycling: 'Cycling Path'
  }[t] || 'Fitness Space';
}

function processPlaces(elements) {
  allPlaces = elements
    .filter(e => e.tags && e.tags.name)
    .map(e => {
      const lat = e.lat || (e.center && e.center.lat);
      const lon = e.lon || (e.center && e.center.lon);
      return {
        name: e.tags.name,
        addr: e.tags['addr:street'] || e.tags['addr:full'] || '',
        lat: lat,
        lon: lon,
        dist: haversine(userLat, userLng, lat, lon),
        type: getPlaceType(e.tags),
        tags: e.tags
      };
    })
    .filter(p => p.lat && p.dist < 5)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 18);
    
  document.getElementById('gyms-status').textContent = allPlaces.length 
    ? `${allPlaces.length} active wellness locations found within 5km.` 
    : 'No fitness spots discovered in your immediate area.';
  renderPlacesCards();
}

function filterGyms(type, btn) {
  currentFilter = type;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderPlacesCards();
}

function renderPlacesCards() {
  const grid = document.getElementById('gyms-grid');
  grid.querySelectorAll('.gym-card').forEach(c => c.remove());
  
  const filtered = currentFilter === 'all' 
    ? allPlaces 
    : allPlaces.filter(p => p.type === currentFilter);
    
  const empty = document.getElementById('gyms-empty');
  if (!filtered.length) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  
  filtered.forEach((p, i) => {
    const dist = p.dist < 1 ? Math.round(p.dist * 1000) + ' m' : p.dist.toFixed(1) + ' km';
    const url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.name + ' ' + p.addr);
    const rating = (4.0 + Math.random() * 0.9).toFixed(1);
    const card = document.createElement('div');
    card.className = 'gym-card visible';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.4s ease ' + (i * 0.05) + 's, transform 0.4s ease ' + (i * 0.05) + 's';
    
    card.innerHTML = `
      <div class="gym-card-type">${getTypeLabel(p.type)}</div>
      <div class="gym-card-name">${p.name}</div>
      <div class="gym-card-addr">${p.addr || 'Nearby location'}</div>
      <div class="gym-card-meta">
        <span class="gym-rating">★ ${rating}</span>
        <span>${p.tags.opening_hours || 'Hours vary'}</span>
        <span class="gym-dist">${dist}</span>
      </div>
      <a href="${url}" target="_blank" class="gyms-map-link">View on Google Maps →</a>
    `;
    grid.appendChild(card);
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 60 + i * 50);
  });
  
  refreshCursorListeners();
  observeElements();
}