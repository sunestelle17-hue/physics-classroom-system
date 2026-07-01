const STORAGE_KEY = 'physics-classroom-system:v1';
const ERROR_REASONS = ['审题', '概念', '公式', '计算', '单位', '步骤', '作图', '实验表述', '漏答', '不会', '时间不足', '其他'];
const PERFORMANCE_TAGS = ['主动回应', '主动表达', '愿意参与讨论', '补充同学思路', '被点名后能回应', '需要点名提醒', '有自己的想法', '表达完整', '回答简短', '害羞慢热', '注意力飘'];
const STATUS_OPTIONS = [
  { key: 'correct', label: '√', text: '独立正确' },
  { key: 'hint', label: '△', text: '提示后正确' },
  { key: 'wrong', label: '×', text: '错误/不会' },
  { key: 'unfinished', label: '—', text: '未完成/缺席' },
  { key: 'blank', label: '空白', text: '尚未检查' },
];
const DEMO_DATA = {
  grades: [
    { id: 'g7', name: '七年级', classes: [
      { id: 'g7c1', name: '七年级 1 班', students: ['学生 A', '学生 B', '学生 C', '学生 D'] },
      { id: 'g7c2', name: '七年级 2 班', students: ['学生 E', '学生 F', '学生 G'] },
    ] },
    { id: 'g8', name: '八年级', classes: [
      { id: 'g8c1', name: '八年级 1 班', students: ['学生 H', '学生 I', '学生 J', '学生 K'] },
      { id: 'g8c2', name: '八年级 2 班', students: ['学生 L', '学生 M', '学生 N'] },
    ] },
  ],
  lessons: [
    { id: 'lesson-01', name: '第 1 讲：运动和速度', modules: [
      { id: 'm-basic', name: '基础概念', questions: ['匀速直线运动判断', '速度公式应用', '单位换算'] },
      { id: 'm-chart', name: '图像分析', questions: ['s-t 图像读数', 'v-t 图像比较', '综合描述'] },
    ] },
    { id: 'lesson-02', name: '第 2 讲：力与平衡', modules: [
      { id: 'm-force', name: '受力分析', questions: ['画受力示意图', '判断相互作用力', '平衡力辨析'] },
      { id: 'm-calc', name: '计算应用', questions: ['重力计算', '摩擦力分析', '实验结论表达'] },
    ] },
  ],
};
let state = { gradeId: 'g7', classId: 'g7c1', lessonId: 'lesson-01', moduleId: 'm-basic', studentIndex: 0 };
let saved = loadSaved();

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }
function updateRecordSilently(updater) {
  const { recordKey, record } = current();
  saved = { ...saved, [recordKey]: updater(record) };
  persist();
}
function qid(moduleId, index) { return `${moduleId}-q${index + 1}`; }
function current() {
  const grade = DEMO_DATA.grades.find(g => g.id === state.gradeId) || DEMO_DATA.grades[0];
  const klass = grade.classes.find(c => c.id === state.classId) || grade.classes[0];
  const lesson = DEMO_DATA.lessons.find(l => l.id === state.lessonId) || DEMO_DATA.lessons[0];
  const module = lesson.modules.find(m => m.id === state.moduleId) || lesson.modules[0];
  const studentName = klass.students[state.studentIndex] || klass.students[0];
  const recordKey = `${klass.id}:${lesson.id}:${studentName}`;
  const record = saved[recordKey] || { questions: {}, moduleUnassigned: {}, performance: [], note: '' };
  return { grade, klass, lesson, module, studentName, recordKey, record };
}
function updateRecord(updater) {
  const { recordKey, record } = current();
  saved = { ...saved, [recordKey]: updater(record) };
  persist();
  render();
}
function patchQuestion(questionId, patch) {
  updateRecord(record => ({
    ...record,
    questions: { ...record.questions, [questionId]: { status: 'blank', reasons: [], unassigned: false, ...(record.questions[questionId] || {}), ...patch } },
  }));
}
function progress(lesson, record) {
  return lesson.modules.flatMap(m => m.questions.map((_, index) => ({ id: qid(m.id, index), moduleId: m.id }))).reduce((acc, item) => {
    const question = record.questions[item.id];
    if (record.moduleUnassigned[item.moduleId] || question?.unassigned) return acc;
    acc.total += 1;
    if (question?.status && question.status !== 'blank') acc.done += 1;
    return acc;
  }, { done: 0, total: 0 });
}
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}
function selectHtml(label, id, value, options) {
  return `<label><span>${label}</span><select id="${id}">${options.map(o => `<option value="${escapeHtml(o.value)}" ${String(o.value) === String(value) ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join('')}</select></label>`;
}
function render() {
  const { grade, klass, lesson, module, studentName, record } = current();
  const prog = progress(lesson, record);
  document.querySelector('#app').innerHTML = `
    <header class="hero"><div><p class="eyebrow">本地原型 · 自动保存</p><h1>物理课堂登记</h1></div><div class="progress"><strong>${prog.done}</strong>/<span>${prog.total}</span></div></header>
    <section class="card selectors">
      ${selectHtml('年级', 'grade', state.gradeId, DEMO_DATA.grades.map(g => ({ value: g.id, label: g.name })))}
      ${selectHtml('班级', 'class', state.classId, grade.classes.map(c => ({ value: c.id, label: c.name })))}
      ${selectHtml('讲次', 'lesson', state.lessonId, DEMO_DATA.lessons.map(l => ({ value: l.id, label: l.name })))}
      ${selectHtml('模块', 'module', state.moduleId, lesson.modules.map(m => ({ value: m.id, label: m.name })))}
      ${selectHtml('学生', 'student', state.studentIndex, klass.students.map((name, index) => ({ value: index, label: name })))}
    </section>
    <section class="student-bar">${klass.students.map((name, index) => `<button data-student="${index}" class="${index === state.studentIndex ? 'active' : ''}">${name}</button>`).join('')}</section>
    <section class="card module-head"><div><h2>${module.name}</h2><p>${studentName} · ${lesson.name}</p></div><label class="switch"><input id="module-unassigned" type="checkbox" ${record.moduleUnassigned[module.id] ? 'checked' : ''}> 整个模块未布置</label></section>
    <section class="question-list">${module.questions.map((title, index) => questionHtml(module, title, index, record)).join('')}</section>
    <section class="card"><h2>课堂表现标签</h2><div class="tag-grid">${PERFORMANCE_TAGS.map(tag => `<button data-tag="${tag}" class="${record.performance.includes(tag) ? 'active' : ''}">${tag}</button>`).join('')}</div><label class="note-label">自由备注<input id="note" value="${escapeHtml(record.note)}" placeholder="例如：今天速度公式掌握较好，单位换算还需提醒。"></label></section>`;
  bindEvents();
}
function questionHtml(module, title, index, record) {
  const id = qid(module.id, index);
  const question = record.questions[id] || { status: 'blank', reasons: [], unassigned: false };
  const disabled = record.moduleUnassigned[module.id] || question.unassigned;
  const reasons = question.reasons || [];
  return `<article class="card question ${disabled ? 'muted' : ''}"><div class="question-title"><h3>${index + 1}. ${title}</h3><label><input data-unassigned="${id}" type="checkbox" ${question.unassigned ? 'checked' : ''}> 本题未布置</label></div><div class="status-grid">${STATUS_OPTIONS.map(opt => `<button data-status="${id}:${opt.key}" ${disabled ? 'disabled' : ''} class="${question.status === opt.key ? `picked ${opt.key}` : ''}"><b>${opt.label}</b><span>${opt.text}</span></button>`).join('')}</div>${(question.status === 'hint' || question.status === 'wrong') && !disabled ? `<div class="reasons"><p>错因（可多选，非必填）</p>${ERROR_REASONS.map(reason => `<button data-reason="${id}:${reason}" class="${reasons.includes(reason) ? 'active' : ''}">${reason}</button>`).join('')}</div>` : ''}</article>`;
}
function bindEvents() {
  document.querySelector('#grade').onchange = event => { const grade = DEMO_DATA.grades.find(g => g.id === event.target.value); state = { ...state, gradeId: grade.id, classId: grade.classes[0].id, studentIndex: 0 }; render(); };
  document.querySelector('#class').onchange = event => { state = { ...state, classId: event.target.value, studentIndex: 0 }; render(); };
  document.querySelector('#lesson').onchange = event => { const lesson = DEMO_DATA.lessons.find(l => l.id === event.target.value); state = { ...state, lessonId: lesson.id, moduleId: lesson.modules[0].id }; render(); };
  document.querySelector('#module').onchange = event => { state = { ...state, moduleId: event.target.value }; render(); };
  document.querySelector('#student').onchange = event => { state = { ...state, studentIndex: Number(event.target.value) }; render(); };
  document.querySelectorAll('[data-student]').forEach(button => button.onclick = () => { state = { ...state, studentIndex: Number(button.dataset.student) }; render(); });
  document.querySelector('#module-unassigned').onchange = event => updateRecord(record => ({ ...record, moduleUnassigned: { ...record.moduleUnassigned, [current().module.id]: event.target.checked } }));
  document.querySelectorAll('[data-unassigned]').forEach(input => input.onchange = () => patchQuestion(input.dataset.unassigned, { unassigned: input.checked }));
  document.querySelectorAll('[data-status]').forEach(button => button.onclick = () => { const [id, status] = button.dataset.status.split(':'); patchQuestion(id, { status }); });
  document.querySelectorAll('[data-reason]').forEach(button => button.onclick = () => { const [id, reason] = button.dataset.reason.split(':'); const reasons = current().record.questions[id]?.reasons || []; patchQuestion(id, { reasons: reasons.includes(reason) ? reasons.filter(item => item !== reason) : [...reasons, reason] }); });
  document.querySelectorAll('[data-tag]').forEach(button => button.onclick = () => { const tag = button.dataset.tag; updateRecord(record => ({ ...record, performance: record.performance.includes(tag) ? record.performance.filter(item => item !== tag) : [...record.performance, tag] })); });
  document.querySelector('#note').oninput = event => updateRecordSilently(record => ({ ...record, note: event.target.value }));
}
render();
