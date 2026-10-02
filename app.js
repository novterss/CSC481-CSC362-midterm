// RSU Midterm Exam Study Hub - Core Logic & Data

// Theme toggle
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeBtnText(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const target = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', target);
  localStorage.setItem('theme', target);
  updateThemeBtnText(target);
}

function updateThemeBtnText(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '☀️ โหมดสว่าง (Light Mode)' : '🌙 โหมดมืด (Dark Mode)';
  }
}

// Mobile Sidebar Controls
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent bg scroll on mobile
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

// Navigation Tab Switcher
function switchTab(tabId) {
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  // Update sections
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.style.display = sec.id === tabId ? 'block' : 'none';
  });

  // Auto-close sidebar on mobile/iPad after selecting a tab
  if (window.innerWidth <= 992) {
    closeSidebar();
  }

  // Scroll to top of main wrapper
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Critical Path Calculator Data & Logic
const cpmDataSets = {
  sheet1: {
    title: "แบบฝึกหัดที่ 1 (Activity A -> H จาก Critical Path.xlsx)",
    tasks: [
      { id: 'A', name: 'งาน A', pred: '-', dur: 3, es: 0, ef: 3, ls: 0, lf: 3, slack: 0, isCrit: true },
      { id: 'B', name: 'งาน B', pred: 'A', dur: 4, es: 3, ef: 7, ls: 5, lf: 9, slack: 2, isCrit: false },
      { id: 'C', name: 'งาน C', pred: 'A', dur: 6, es: 3, ef: 9, ls: 3, lf: 9, slack: 0, isCrit: true },
      { id: 'D', name: 'งาน D', pred: 'B', dur: 6, es: 7, ef: 13, ls: 9, lf: 15, slack: 2, isCrit: false },
      { id: 'E', name: 'งาน E', pred: 'B', dur: 4, es: 7, ef: 11, ls: 9, lf: 13, slack: 2, isCrit: false },
      { id: 'F', name: 'งาน F', pred: 'C', dur: 4, es: 9, ef: 13, ls: 9, lf: 13, slack: 0, isCrit: true },
      { id: 'G', name: 'งาน G', pred: 'D', dur: 6, es: 13, ef: 19, ls: 15, lf: 21, slack: 2, isCrit: false },
      { id: 'H', name: 'งาน H', pred: 'E, F', dur: 8, es: 13, ef: 21, ls: 13, lf: 21, slack: 0, isCrit: true }
    ],
    criticalPath: "A -> C -> F -> H",
    totalDuration: "21 วัน",
    explanation: "เส้นทาง A -> C -> F -> H รวมเวลา 3 + 6 + 4 + 8 = 21 วัน (ยาวที่สุดในทุกเส้นทาง และมี Slack = 0 ทุกงาน)"
  },
  sheet2: {
    title: "แบบฝึกหัดที่ 2 (Activity A -> G จาก Critical Path.xlsx)",
    tasks: [
      { id: 'A', name: 'งาน A', pred: '-', dur: 2, es: 0, ef: 2, ls: 13, lf: 15, slack: 13, isCrit: false },
      { id: 'B', name: 'งาน B', pred: '-', dur: 5, es: 0, ef: 5, ls: 0, lf: 5, slack: 0, isCrit: true },
      { id: 'C', name: 'งาน C', pred: '-', dur: 1, es: 0, ef: 1, ls: 11, lf: 12, slack: 11, isCrit: false },
      { id: 'D', name: 'งาน D', pred: 'B', dur: 10, es: 5, ef: 15, ls: 5, lf: 15, slack: 0, isCrit: true },
      { id: 'E', name: 'งาน E', pred: 'A, D', dur: 3, es: 15, ef: 18, ls: 15, lf: 18, slack: 0, isCrit: true },
      { id: 'F', name: 'งาน F', pred: 'C', dur: 6, es: 1, ef: 7, ls: 12, lf: 18, slack: 11, isCrit: false },
      { id: 'G', name: 'งาน G', pred: 'E, F', dur: 8, es: 18, ef: 26, ls: 18, lf: 26, slack: 0, isCrit: true }
    ],
    criticalPath: "B -> D -> E -> G",
    totalDuration: "26 วัน",
    explanation: "เส้นทาง B -> D -> E -> G รวมเวลา 5 + 10 + 3 + 8 = 26 วัน (สายงานวิกฤต มี Slack = 0 ทุกงาน)"
  }
};

function renderCpmTable(sheetKey) {
  const container = document.getElementById('cpmTableContainer');
  if (!container) return;

  const dataset = cpmDataSets[sheetKey];
  let rowsHtml = dataset.tasks.map(t => `
    <tr class="${t.isCrit ? 'critical-row' : ''}">
      <td><strong>${t.id}</strong></td>
      <td>${t.pred}</td>
      <td><strong>${t.dur}</strong></td>
      <td>${t.es}</td>
      <td>${t.ef}</td>
      <td>${t.ls}</td>
      <td>${t.lf}</td>
      <td><span style="color: ${t.slack === 0 ? '#ef4444' : '#10b981'}; font-weight: bold;">${t.slack}</span></td>
      <td>${t.isCrit ? '<span style="color:#ef4444; font-weight:bold;">⚡ วิกฤต (Critical)</span>' : '<span style="color:#94a3b8;">ยืดหยุ่นได้</span>'}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
      <h4 style="color: #c7d2fe; font-size: 1.05rem;">📌 ${dataset.title}</h4>
      <div style="display: flex; gap: 0.5rem;">
        <button class="filter-pill ${sheetKey === 'sheet1' ? 'active' : ''}" onclick="renderCpmTable('sheet1')">แบบฝึกหัดที่ 1 (A-H)</button>
        <button class="filter-pill ${sheetKey === 'sheet2' ? 'active' : ''}" onclick="renderCpmTable('sheet2')">แบบฝึกหัดที่ 2 (A-G)</button>
      </div>
    </div>

    <table class="cpm-table">
      <thead>
        <tr>
          <th>งาน (Activity)</th>
          <th>งานก่อนหน้า (Predecessor)</th>
          <th>เวลา (Duration)</th>
          <th>ES (เริ่มเร็วสุด)</th>
          <th>EF (เสร็จเร็วสุด)</th>
          <th>LS (เริ่มช้าสุด)</th>
          <th>LF (เสร็จช้าสุด)</th>
          <th>Slack (เวลาลอยตัว)</th>
          <th>สถานะ</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="callout danger" style="margin-top: 1.25rem;">
      <div style="font-weight: bold; font-size: 1rem; margin-bottom: 0.25rem;">
        🎯 สายงานวิกฤต (Critical Path): <span style="color: #ff4d4d; font-family: var(--font-code); font-size: 1.1rem;">${dataset.criticalPath}</span>
      </div>
      <div>⏱️ <strong>เวลารวมโครงการ:</strong> ${dataset.totalDuration}</div>
      <div style="margin-top: 0.35rem; font-size: 0.88rem; color: var(--text-secondary);">${dataset.explanation}</div>
    </div>
  `;
}

// Quizzes Data
const quizzes = {
  // CSC362 Quizzes
  csc362_norm: [
    {
      q: "1. จุดประสงค์หลักของ 1NF (First Normal Form) ในการทำ Normalization คืออะไร?",
      opts: [
        "A. สร้างแอตทริบิวต์ใหม่เพื่อเพิ่มความละเอียด",
        "B. กำจัด Multivalued attributes และ Repeating groups ให้ทุกช่องเป็นค่าเดี่ยว (Atomic)",
        "C. รวมข้อมูลทุกอย่างให้อยู่ในแถวเดียว",
        "D. ละเว้นกลุ่มข้อมูลที่ซ้ำซ้อน"
      ],
      ans: 1,
      exp: "หัวใจของ 1NF คือข้อมูลทุกช่องต้องเป็น Atomic Value (ค่าเดี่ยว ไม่เป็น Array/List) และไม่มีกลุ่มข้อมูลที่ซ้ำเป็นทอดๆ (Repeating Groups) พร้อมกำหนด Primary Key"
    },
    {
      q: "2. สัญญาณสำคัญที่บอกว่าเกิด Partial Dependency (ที่ต้องแก้ใน 2NF) คือข้อใด?",
      opts: [
        "A. แอตทริบิวต์ขึ้นกับ Primary Key มากกว่าหนึ่งตัว",
        "B. แอตทริบิวต์ขึ้นกับ Foreign Key",
        "C. แอตทริบิวต์ไม่ขึ้นกับคีย์หลักใดๆ เลย",
        "D. แอตทริบิวต์ไปขึ้นกับ 'ส่วนใดส่วนหนึ่ง' ของ Composite Primary Key"
      ],
      ans: 3,
      exp: "Partial Dependency เกิดขึ้นเมื่อ Primary Key เป็น Composite Key (มี 2 ตัวขึ้นไป) แล้วมีแอตทริบิวต์ธรรมดาแอบไปขึ้นตรงกับแค่ตัวใดตัวหนึ่ง ไม่ได้ขึ้นกับทั้งคู่"
    },
    {
      q: "3. ในการกำจัด Partial Dependency เพื่อให้ผ่าน 2NF ต้องดำเนินการอย่างไร?",
      opts: [
        "A. ลบคอลัมน์ที่เป็นคีย์ออก",
        "B. รวมคอลัมน์คีย์เข้าด้วยกัน",
        "C. แตกตารางใหม่ โดยดึงคีย์ส่วนนั้นพร้อมแอตทริบิวต์ที่ขึ้นตรงกับมันแยกไปสร้างตารางใหม่",
        "D. ละเว้นฟิลด์ที่ไม่เกี่ยวกับคีย์"
      ],
      ans: 2,
      exp: "แก้ 2NF ด้วยการ 'แตกตาราง (Split table)' โดยดึงคีย์ที่เป็นต้นเหตุและฟิลด์ที่ขึ้นกับมันออกไปเป็นตารางใหม่"
    },
    {
      q: "4. เป้าหมายหลักของ 3NF (Third Normal Form) คือข้อใด?",
      opts: [
        "A. เพิ่มความสัมพันธ์เพื่อความยืดหยุ่น",
        "B. กำจัด Transitive Dependency (ฟิลด์ธรรมดาขึ้นกับฟิลด์ธรรมดา)",
        "C. ละเว้นความสัมพันธ์แบบ 1 ต่อกลุ่ม",
        "D. รวมทุกตารางกลับมาเป็นตารางใหญ่ตารางเดียว"
      ],
      ans: 1,
      exp: "3NF มุ่งกำจัด Transitive Dependency (A -> B -> C) เพื่อไม่ให้ฟิลด์ที่ไม่ใช่คีย์ ไปขึ้นอยู่กับฟิลด์อื่นที่ไม่ใช่คีย์ด้วยกัน"
    },
    {
      q: "5. การจัดการกับ Transitive Dependency ใน 3NF ทำได้อย่างไร?",
      opts: [
        "A. แยกแอตทริบิวต์ที่ขึ้นต่อกันออกไปสร้างเป็นตารางใหม่ โดยให้ตัวกำหนดเป็น Primary Key",
        "B. รวมฟิลด์เข้าด้วยกันในตารางเดิม",
        "C. ปล่อยทิ้งไว้ถ้าข้อมูลมีขนาดเล็ก",
        "D. ลบฟิลด์ที่ซ้ำซ้อนทิ้งทั้งหมด"
      ],
      ans: 0,
      exp: "แยกตัวกำหนด (Determinant) และแอตทริบิวต์ที่พึ่งพามันออกไปเป็นตารางใหม่ และทิ้งตัวกำหนดไว้เป็น Foreign Key ในตารางเดิม"
    },
    {
      q: "6. ข้อใดคือความหมายของความสัมพันธ์แบบ 1 : M ในการแปลง ERD เป็นตาราง?",
      opts: [
        "A. ดึง PK ของฝั่ง Many ไปเป็น FK ในฝั่ง One",
        "B. ดึง PK ของฝั่ง One ไปเป็น FK ในฝั่ง Many",
        "C. ต้องสร้างตารางตรงกลาง (Bridge Table) เสมอ",
        "D. เอา PK ทั้งสองฝั่งมารวมกันเป็นตารางเดียว"
      ],
      ans: 1,
      exp: "กฎเหล็ก 1:M คือเอา Primary Key ของฝั่ง 1 ไปวางเป็น Foreign Key ในฝั่ง Many (เช่น เอา DeptNo ไปใส่ในตาราง Employee)"
    },
    {
      q: "7. เมื่อเจอความสัมพันธ์แบบ M : N (Many-to-Many) ใน ERD ต้องแปลงเป็น Relational Database อย่างไร?",
      opts: [
        "A. นำ PK ฝั่งไหนก็ได้ไปใส่ในอีกฝั่งหนึ่ง",
        "B. สร้างตารางตรงกลาง (Associative / Bridge Table) โดยนำ PK ของทั้งสองฝั่งมารวมเป็น Composite PK",
        "C. รวมทั้งสอง Entity เป็นตารางเดียว",
        "D. ไม่สามารถแปลงได้ใน Relational Database"
      ],
      ans: 1,
      exp: "M:N แปลงตรงๆ ไม่ได้ ต้องแตกเป็นตารางตรงกลาง (Bridge Table) ที่มี Composite Primary Key ที่ประกอบด้วย Foreign Key จากทั้งสองฝั่ง"
    }
  ],

  // CSC481 Quizzes
  csc481_review: [
    {
      q: "1. Which of the following is the first phase in the Systems Development Life Cycle (SDLC)?",
      opts: ["A) Design", "B) Planning", "C) Implementation", "D) Testing"],
      ans: 1,
      exp: "Planning เป็นขั้นตอนแรกของ SDLC เพื่อศึกษาความเป็นไปได้และวางขอบเขต (Planning -> Analysis -> Design -> Implementation -> Maintenance)"
    },
    {
      q: "2. A Gantt chart is primarily used for:",
      opts: ["A) Database design", "B) Showing logical data flows", "C) Tracking project schedules", "D) Measuring software performance"],
      ans: 2,
      exp: "Gantt Chart เป็นแผนภูมิแท่งแนวนอน ใช้ติดตามตารางเวลา ความคืบหน้า และระยะเวลาของงานแต่ละชิ้นในโครงการ"
    },
    {
      q: "3. Which of the following describes the role of a project manager?",
      opts: ["A) Write the source code", "B) Ensure project is completed on time and within budget", "C) Test the system before delivery", "D) Train end-users only"],
      ans: 1,
      exp: "บทบาทหลักของ PM คือควบคุมให้โปรเจกต์เสร็จตามข้อจำกัด Triple Constraints: ตรงเวลา (Time), ภายในงบประมาณ (Budget/Cost), และได้ขอบเขตครบ (Scope)"
    },
    {
      q: "4. A critical path in project management represents:",
      opts: [
        "A) The path with the least number of tasks",
        "B) The sequence of tasks that determines project duration",
        "C) The backup plan for project risks",
        "D) The most expensive project activities"
      ],
      ans: 1,
      exp: "Critical Path คือลำดับงานที่ยาวที่สุดในโครงการ ซึ่งเป็นตัวกำหนดว่าโครงการจะเสร็จเร็วสุดได้เมื่อใด งานบนสายนี้ห้ามดีเลย์เด็ดขาด (Slack = 0)"
    },
    {
      q: "5. Which project management tool is best for analyzing task dependencies?",
      opts: ["A) Gantt chart", "B) PERT/CPM chart", "C) Pie chart", "D) Flowchart"],
      ans: 1,
      exp: "PERT/CPM Network Diagram แสดงความสัมพันธ์ก่อน-หลัง (Dependencies) ของงานได้อย่างชัดเจนที่สุด"
    },
    {
      q: "6. What does scope creep mean in project management?",
      opts: [
        "A) A method to reduce project costs",
        "B) The uncontrolled expansion of project goals",
        "C) Delaying the project intentionally",
        "D) Improving system quality during testing"
      ],
      ans: 1,
      exp: "Scope Creep คือภาวะที่ขอบเขตงานถูกขอเพิ่มเรื่อยๆ อย่างไม่มีการควบคุม ทำให้เสี่ยงงบบานปลายและส่งงานช้า"
    },
    {
      q: "7. Which of the following is an example of a tangible benefit of a project?",
      opts: ["A) Increased employee satisfaction", "B) Improved company reputation", "C) Faster processing time", "D) Better customer goodwill"],
      ans: 2,
      exp: "Tangible Benefit คือผลประโยชน์ที่วัดค่าเป็นตัวเลข/เวลา/เงินได้ชัดเจน เช่น ลดเวลาประมวลผลลง 50% ส่วนชื่อเสียงหรือความพึงพอใจเป็น Intangible"
    },
    {
      q: "8. A project is considered successful if it:",
      opts: [
        "A) Uses the latest technology",
        "B) Meets requirements, is delivered on time, and within budget",
        "C) Involves the largest team",
        "D) Has the longest documentation"
      ],
      ans: 1,
      exp: "ความสำเร็จของโครงการวัดจาก Triple Constraint: บรรลุตาม Requirement, ส่งมอบตรงเวลา (On Time), ภายในงบ (Within Budget)"
    },
    {
      q: "9. Which document defines the scope, objectives, and participants of a project?",
      opts: ["A) Feasibility report", "B) Project charter", "C) User manual", "D) Test plan"],
      ans: 1,
      exp: "Project Charter คือเอกสารทางการที่แต่งตั้ง PM และกำหนดขอบเขต วัตถุประสงค์ เพื่อขออนุมัติเริ่มโครงการอย่างเป็นทางการ"
    },
    {
      q: "10. In a Data Flow Diagram (DFD), what is a 'Black Hole' error?",
      opts: [
        "A) A process with outputs but no inputs",
        "B) A process with inputs but no outputs",
        "C) A process with insufficient inputs to generate outputs",
        "D) Direct connection between two entities"
      ],
      ans: 1,
      exp: "Black Hole (หลุมดำ) คือ Process ที่มีแต่ข้อมูลไหลเข้า (Inputs) แต่ไม่มีข้อมูลไหลออก (Outputs) เลย ถือเป็นข้อผิดพลาดร้ายแรงของ DFD"
    }
  ]
};

function renderQuiz(quizKey, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const questions = quizzes[quizKey];
  container.innerHTML = questions.map((item, idx) => `
    <div class="quiz-card" id="${quizKey}-q-${idx}">
      <div class="quiz-question">${item.q}</div>
      <div class="quiz-options">
        ${item.opts.map((opt, optIdx) => `
          <button class="quiz-opt-btn" onclick="checkAnswer('${quizKey}', ${idx}, ${optIdx})">
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="${quizKey}-fb-${idx}"></div>
    </div>
  `).join('');
}

function checkAnswer(quizKey, qIdx, selectedOptIdx) {
  const card = document.getElementById(`${quizKey}-q-${qIdx}`);
  if (card.classList.contains('answered')) return; // already answered

  card.classList.add('answered');
  const question = quizzes[quizKey][qIdx];
  const isCorrect = selectedOptIdx === question.ans;
  const feedback = document.getElementById(`${quizKey}-fb-${qIdx}`);
  const buttons = card.querySelectorAll('.quiz-opt-btn');

  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === question.ans) {
      btn.classList.add('highlight-correct');
    }
    if (idx === selectedOptIdx) {
      btn.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
    }
  });

  if (isCorrect) {
    card.classList.add('answered-correct');
    feedback.className = 'quiz-feedback correct';
    feedback.innerHTML = `<strong>🎉 ถูกต้องยอดเยี่ยม!</strong><br>${question.exp}`;
  } else {
    card.classList.add('answered-incorrect');
    feedback.className = 'quiz-feedback incorrect';
    feedback.innerHTML = `<strong>❌ ยังไม่ถูกต้อง (คำตอบที่ถูกคือข้อที่ไฮไลต์สีเขียว)</strong><br>💡 <em>คำอธิบาย:</em> ${question.exp}`;
  }
}

// Interactive Normalization Step Highlighter
function showNormStep(stepNum) {
  document.querySelectorAll('.norm-step-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-step') === String(stepNum));
  });

  document.querySelectorAll('.norm-step-panel').forEach(panel => {
    panel.style.display = panel.getAttribute('data-step') === String(stepNum) ? 'block' : 'none';
  });
}

// Window init
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderCpmTable('sheet1');
  renderQuiz('csc362_norm', 'csc362QuizContainer');
  renderQuiz('csc481_review', 'csc481QuizContainer');

  // Nav click handlers
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Mobile menu triggers
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleSidebar);
  }

  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  const sidebarOverlay = document.getElementById('sidebarOverlay');
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }
});
