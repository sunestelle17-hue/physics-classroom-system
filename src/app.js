const RECORDS_KEY = 'physics-classroom-system:records:v2';
const ROSTER_KEY = 'physics-classroom-system:roster:v2';
const ERROR_REASONS = ['审题', '概念', '公式', '计算', '单位', '步骤', '作图', '实验表述', '漏答', '不会', '时间不足', '其他'];
const PERFORMANCE_TAGS = ['主动回应', '主动表达', '愿意参与讨论', '补充同学思路', '被点名后能回应', '需要点名提醒', '有自己的想法', '表达完整', '回答简短', '害羞慢热', '注意力飘'];
const STATUS_OPTIONS = [
  { key: 'correct', label: '√', text: '独立正确' },
  { key: 'hint', label: '△', text: '提示后正确' },
  { key: 'wrong', label: '×', text: '错误/不会' },
  { key: 'unfinished', label: '—', text: '未完成/缺席' },
  { key: 'blank', label: '空白', text: '尚未检查' },
];
const DEMO_ROSTER = {
  grades: [
    { id: 'demo-g7', name: '七年级', demo: true, classes: [
      { id: 'demo-g7c1', name: '七年级 1 班', demo: true, students: demoStudents('demo-g7c1', ['学生 A', '学生 B', '学生 C', '学生 D']) },
      { id: 'demo-g7c2', name: '七年级 2 班', demo: true, students: demoStudents('demo-g7c2', ['学生 E', '学生 F', '学生 G']) },
    ] },
    { id: 'demo-g8', name: '八年级', demo: true, classes: [
      { id: 'demo-g8c1', name: '八年级 1 班', demo: true, students: demoStudents('demo-g8c1', ['学生 H', '学生 I', '学生 J', '学生 K']) },
      { id: 'demo-g8c2', name: '八年级 2 班', demo: true, students: demoStudents('demo-g8c2', ['学生 L', '学生 M', '学生 N']) },
    ] },
  ],
};
const LESSONS = [
  { id: 'lesson-01', name: '第 1 讲：运动和速度', modules: [
    { id: 'm-basic', name: '基础概念', questions: ['匀速直线运动判断', '速度公式应用', '单位换算'] },
    { id: 'm-chart', name: '图像分析', questions: ['s-t 图像读数', 'v-t 图像比较', '综合描述'] },
  ] },
  { id: 'lesson-02', name: '第 2 讲：力与平衡', modules: [
    { id: 'm-force', name: '受力分析', questions: ['画受力示意图', '判断相互作用力', '平衡力辨析'] },
    { id: 'm-calc', name: '计算应用', questions: ['重力计算', '摩擦力分析', '实验结论表达'] },
  ] },
];
let roster = loadRoster();
let records = loadJson(RECORDS_KEY, {});
let state = initialState();
let view = 'register';

function demoStudents(classId, names) { return names.map((name, index) => ({ id: `${classId}-s${index + 1}`, name, demo: true })); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function loadJson(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
function loadRoster() { return loadJson(ROSTER_KEY, clone(DEMO_ROSTER)); }
function saveRoster() { localStorage.setItem(ROSTER_KEY, JSON.stringify(roster)); }
function saveRecords() { localStorage.setItem(RECORDS_KEY, JSON.stringify(records)); }
function uid(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }
function qid(moduleId, index) { return `${moduleId}-q${index + 1}`; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
function initialState() {
  const grade = roster.grades[0];
  const klass = grade?.classes?.[0];
  return { gradeId: grade?.id || '', classId: klass?.id || '', lessonId: LESSONS[0].id, moduleId: LESSONS[0].modules[0].id, studentId: klass?.students?.[0]?.id || '' };
}
function current() {
  const grade = roster.grades.find(g => g.id === state.gradeId) || roster.grades[0];
  const klass = grade?.classes.find(c => c.id === state.classId) || grade?.classes[0];
  const lesson = LESSONS.find(l => l.id === state.lessonId) || LESSONS[0];
  const module = lesson.modules.find(m => m.id === state.moduleId) || lesson.modules[0];
  const student = klass?.students.find(s => s.id === state.studentId) || klass?.students[0];
  const recordKey = klass && student ? `${klass.id}:${lesson.id}:${student.id}` : '';
  const record = records[recordKey] || { questions: {}, moduleUnassigned: {}, performance: [], note: '', feedback: '' };
  return { grade, klass, lesson, module, student, recordKey, record };
}
function syncSelection() {
  const grade = roster.grades.find(g => g.id === state.gradeId) || roster.grades[0];
  const klass = grade?.classes.find(c => c.id === state.classId) || grade?.classes[0];
  const student = klass?.students.find(s => s.id === state.studentId) || klass?.students[0];
  state = { ...state, gradeId: grade?.id || '', classId: klass?.id || '', studentId: student?.id || '' };
}
function updateRecord(updater, shouldRender = true) {
  const { recordKey, record } = current();
  if (!recordKey) return;
  records = { ...records, [recordKey]: updater(record) };
  saveRecords();
  if (shouldRender) render();
}
function patchQuestion(questionId, patch) {
  updateRecord(record => ({ ...record, questions: { ...record.questions, [questionId]: { status: 'blank', reasons: [], unassigned: false, ...(record.questions[questionId] || {}), ...patch } } }));
}
function lessonQuestionRefs(lesson) {
  return lesson.modules.flatMap(module => module.questions.map((title, index) => ({ id: qid(module.id, index), moduleId: module.id, title })));
}
function progress(lesson, record) {
  return lessonQuestionRefs(lesson).reduce((acc, item) => {
    const question = record.questions[item.id];
    if (record.moduleUnassigned[item.moduleId] || question?.unassigned) return acc;
    acc.total += 1;
    if (question?.status && question.status !== 'blank') acc.done += 1;
    return acc;
  }, { done: 0, total: 0 });
}
function selectHtml(label, id, value, options) {
  return `<label><span>${label}</span><select id="${id}" ${options.length ? '' : 'disabled'}>${options.map(o => `<option value="${escapeHtml(o.value)}" ${String(o.value) === String(value) ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join('')}</select></label>`;
}
function render() {
  syncSelection();
  document.querySelector('#app').innerHTML = `<nav class="top-tabs"><button id="tab-register" class="${view === 'register' ? 'active' : ''}">课堂登记</button><button id="tab-manage" class="${view === 'manage' ? 'active' : ''}">管理</button></nav>${view === 'manage' ? manageHtml() : registerHtml()}`;
  bindSharedEvents();
  view === 'manage' ? bindManageEvents() : bindRegisterEvents();
}
function registerHtml() {
  const { grade, klass, lesson, module, student, record } = current();
  if (!grade || !klass || !student) return `<section class="card empty"><h1>暂无可登记学生</h1><p>请进入“管理”新增年级、班级和学生，或导入 JSON 数据。</p></section>`;
  const prog = progress(lesson, record);
  return `<header class="hero"><div><p class="eyebrow">本地原型 · 自动保存</p><h1>物理课堂登记</h1></div><div class="progress"><strong>${prog.done}</strong>/<span>${prog.total}</span></div></header>
    <section class="card selectors">
      ${selectHtml('年级', 'grade', state.gradeId, roster.grades.map(g => ({ value: g.id, label: g.name })))}
      ${selectHtml('班级', 'class', state.classId, grade.classes.map(c => ({ value: c.id, label: c.name })))}
      ${selectHtml('讲次', 'lesson', state.lessonId, LESSONS.map(l => ({ value: l.id, label: l.name })))}
      ${selectHtml('模块', 'module', state.moduleId, lesson.modules.map(m => ({ value: m.id, label: m.name })))}
      ${selectHtml('学生', 'student', state.studentId, klass.students.map(s => ({ value: s.id, label: s.name })))}
    </section>
    <section class="student-bar">${klass.students.map(s => `<button data-student="${s.id}" class="${s.id === state.studentId ? 'active' : ''}">${escapeHtml(s.name)}</button>`).join('')}</section>
    <section class="card module-head"><div><h2>${escapeHtml(module.name)}</h2><p>${escapeHtml(student.name)} · ${escapeHtml(lesson.name)}</p></div><label class="switch"><input id="module-unassigned" type="checkbox" ${record.moduleUnassigned[module.id] ? 'checked' : ''}> 整个模块未布置</label></section>
    <section class="question-list">${module.questions.map((title, index) => questionHtml(module, title, index, record)).join('')}</section>
    <section class="card"><h2>课堂表现标签</h2><div class="tag-grid">${PERFORMANCE_TAGS.map(tag => `<button data-tag="${tag}" class="${record.performance.includes(tag) ? 'active' : ''}">${tag}</button>`).join('')}</div><label class="note-label">自由备注<input id="note" value="${escapeHtml(record.note)}" placeholder="填写一行课堂备注"></label></section>
    <section class="card feedback-card"><div class="feedback-head"><div><h2>家长反馈草稿</h2><p>根据本节登记自动生成，可手动修改；不会自动发送。</p></div><button id="generate-feedback">生成草稿</button></div><textarea id="feedback" rows="6" placeholder="点击“生成草稿”，或直接输入要复制给家长的反馈。">${escapeHtml(record.feedback || '')}</textarea><button id="copy-feedback" class="copy-button">一键复制</button></section>`;
}

function generateFeedbackText(record, lesson, student) {
  const refs = lessonQuestionRefs(lesson).filter(item => !record.moduleUnassigned[item.moduleId] && !record.questions[item.id]?.unassigned);
  const counts = { correct: 0, hint: 0, wrong: 0, unfinished: 0, blank: 0 };
  const reasons = [];
  refs.forEach(item => {
    const question = record.questions[item.id] || { status: 'blank', reasons: [] };
    counts[question.status || 'blank'] = (counts[question.status || 'blank'] || 0) + 1;
    if (question.status === 'hint' || question.status === 'wrong') reasons.push(...(question.reasons || []));
  });
  const checked = refs.length - counts.blank;
  const done = counts.correct + counts.hint + counts.wrong + counts.unfinished;
  const strengths = [];
  if (counts.correct) strengths.push(`${counts.correct} 题能独立完成`);
  if (counts.hint) strengths.push(`${counts.hint} 题经提示后能修正`);
  const needs = [];
  if (counts.wrong) needs.push(`${counts.wrong} 题还需要回看订正`);
  if (counts.unfinished) needs.push(`${counts.unfinished} 题未完成或缺席`);
  const topReasons = [...new Set(reasons)].slice(0, 4);
  const performance = record.performance?.length ? `课堂表现：${record.performance.slice(0, 4).join('、')}。` : '';
  const note = record.note?.trim() ? `补充说明：${record.note.trim()}。` : '';
  const name = student?.name || '同学';
  const summary = checked ? `本节课已检查 ${done}/${refs.length} 题，${strengths.length ? strengths.join('，') : '完成情况已记录'}。` : `本节课题目暂未完成检查。`;
  const focus = needs.length || topReasons.length ? `后续建议重点关注：${[...needs, topReasons.length ? topReasons.join('、') : ''].filter(Boolean).join('；')}。` : '整体完成情况不错，建议继续保持课上思考和及时订正。';
  return `${name}家长您好，${summary}${performance}${focus}${note}`;
}
function copyText(value) {
  if (!value.trim()) return alert('暂无可复制的反馈内容。');
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value).then(() => alert('反馈草稿已复制。')).catch(() => fallbackCopy(value));
  } else {
    fallbackCopy(value);
  }
}
function fallbackCopy(value) {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
  alert('反馈草稿已复制。');
}

function questionHtml(module, title, index, record) {
  const id = qid(module.id, index);
  const question = record.questions[id] || { status: 'blank', reasons: [], unassigned: false };
  const disabled = record.moduleUnassigned[module.id] || question.unassigned;
  const reasons = question.reasons || [];
  return `<article class="card question ${disabled ? 'muted' : ''}"><div class="question-title"><h3>${index + 1}. ${escapeHtml(title)}</h3><label><input data-unassigned="${id}" type="checkbox" ${question.unassigned ? 'checked' : ''}> 本题未布置</label></div><div class="status-grid">${STATUS_OPTIONS.map(opt => `<button data-status="${id}:${opt.key}" ${disabled ? 'disabled' : ''} class="${question.status === opt.key ? `picked ${opt.key}` : ''}"><b>${opt.label}</b><span>${opt.text}</span></button>`).join('')}</div>${(question.status === 'hint' || question.status === 'wrong') && !disabled ? `<div class="reasons"><p>错因（可多选，非必填）</p>${ERROR_REASONS.map(reason => `<button data-reason="${id}:${reason}" class="${reasons.includes(reason) ? 'active' : ''}">${reason}</button>`).join('')}</div>` : ''}</article>`;
}
function manageHtml() {
  const { grade, klass } = current();
  return `<header class="hero manage-hero"><div><p class="eyebrow">仅保存在本机浏览器</p><h1>班级与学生管理</h1></div></header>
    <section class="card manage-grid">
      <form id="grade-form"><h2>年级</h2><input name="gradeName" placeholder="新增年级名称" required><button type="submit">新增年级</button></form>
      <form id="class-form"><h2>班级</h2>${selectHtml('所属年级', 'class-grade', grade?.id || '', roster.grades.map(g => ({ value: g.id, label: g.name })))}<input name="className" placeholder="新增班级名称" required><button type="submit">新增班级</button></form>
      <form id="student-form"><h2>学生</h2>${selectHtml('所属年级', 'student-grade', grade?.id || '', roster.grades.map(g => ({ value: g.id, label: g.name })))}${selectHtml('所属班级', 'student-class', klass?.id || '', (grade?.classes || []).map(c => ({ value: c.id, label: c.name })))}<textarea name="studentNames" rows="6" placeholder="粘贴学生姓名：每行一个" required></textarea><button type="submit">批量添加学生</button></form>
    </section>
    <section class="card"><h2>现有数据</h2>${rosterListHtml()}</section>
    <section class="card danger-zone"><h2>数据工具</h2><div class="tool-row"><button id="export-json">导出 JSON</button><label class="file-button">导入 JSON<input id="import-json" type="file" accept="application/json"></label></div><button id="clear-demo" class="danger">清空演示数据</button><p>真实姓名只会保存在本机浏览器 localStorage 中；导出文件由你自行保管。</p></section>`;
}
function rosterListHtml() {
  if (!roster.grades.length) return '<p class="muted-text">暂无年级。请先新增年级。</p>';
  return roster.grades.map(g => `<div class="roster-grade"><div class="row-title"><input data-edit-grade="${g.id}" value="${escapeHtml(g.name)}"><button data-delete-grade="${g.id}" class="danger small">删除年级</button></div>${g.classes.map(c => `<div class="roster-class"><div class="row-title"><input data-edit-class="${g.id}:${c.id}" value="${escapeHtml(c.name)}"><button data-delete-class="${g.id}:${c.id}" class="danger small">删除班级</button></div><div class="student-list">${c.students.map(s => `<div class="student-item"><input data-edit-student="${g.id}:${c.id}:${s.id}" value="${escapeHtml(s.name)}"><button data-delete-student="${g.id}:${c.id}:${s.id}" class="danger small">删除</button></div>`).join('') || '<p class="muted-text">暂无学生</p>'}</div></div>`).join('') || '<p class="muted-text">暂无班级</p>'}</div>`).join('');
}
function bindSharedEvents() {
  document.querySelector('#tab-register').onclick = () => { view = 'register'; render(); };
  document.querySelector('#tab-manage').onclick = () => { view = 'manage'; render(); };
}
function bindRegisterEvents() {
  const { grade, lesson } = current();
  if (!grade) return;
  document.querySelector('#grade').onchange = event => { const nextGrade = roster.grades.find(g => g.id === event.target.value); const nextClass = nextGrade.classes[0]; state = { ...state, gradeId: nextGrade.id, classId: nextClass?.id || '', studentId: nextClass?.students[0]?.id || '' }; render(); };
  document.querySelector('#class').onchange = event => { const nextClass = grade.classes.find(c => c.id === event.target.value); state = { ...state, classId: nextClass.id, studentId: nextClass.students[0]?.id || '' }; render(); };
  document.querySelector('#lesson').onchange = event => { const nextLesson = LESSONS.find(l => l.id === event.target.value); state = { ...state, lessonId: nextLesson.id, moduleId: nextLesson.modules[0].id }; render(); };
  document.querySelector('#module').onchange = event => { state = { ...state, moduleId: event.target.value }; render(); };
  document.querySelector('#student').onchange = event => { state = { ...state, studentId: event.target.value }; render(); };
  document.querySelectorAll('[data-student]').forEach(button => button.onclick = () => { state = { ...state, studentId: button.dataset.student }; render(); });
  document.querySelector('#module-unassigned').onchange = event => updateRecord(record => ({ ...record, moduleUnassigned: { ...record.moduleUnassigned, [current().module.id]: event.target.checked } }));
  document.querySelectorAll('[data-unassigned]').forEach(input => input.onchange = () => patchQuestion(input.dataset.unassigned, { unassigned: input.checked }));
  document.querySelectorAll('[data-status]').forEach(button => button.onclick = () => { const [id, status] = button.dataset.status.split(':'); patchQuestion(id, { status }); });
  document.querySelectorAll('[data-reason]').forEach(button => button.onclick = () => { const [id, reason] = button.dataset.reason.split(':'); const reasons = current().record.questions[id]?.reasons || []; patchQuestion(id, { reasons: reasons.includes(reason) ? reasons.filter(item => item !== reason) : [...reasons, reason] }); });
  document.querySelectorAll('[data-tag]').forEach(button => button.onclick = () => { const tag = button.dataset.tag; updateRecord(record => ({ ...record, performance: record.performance.includes(tag) ? record.performance.filter(item => item !== tag) : [...record.performance, tag] })); });
  document.querySelector('#note').oninput = event => updateRecord(record => ({ ...record, note: event.target.value }), false);
  document.querySelector('#feedback').oninput = event => updateRecord(record => ({ ...record, feedback: event.target.value }), false);
  document.querySelector('#generate-feedback').onclick = () => updateRecord(record => ({ ...record, feedback: generateFeedbackText(record, current().lesson, current().student) }));
  document.querySelector('#copy-feedback').onclick = () => copyText(document.querySelector('#feedback').value);
}
function bindManageEvents() {
  document.querySelector('#grade-form').onsubmit = event => { event.preventDefault(); const name = event.target.gradeName.value.trim(); if (!name) return; roster.grades.push({ id: uid('grade'), name, classes: [] }); saveRoster(); state.gradeId = roster.grades.at(-1).id; event.target.reset(); render(); };
  document.querySelector('#class-form').onsubmit = event => { event.preventDefault(); const name = event.target.className.value.trim(); const grade = roster.grades.find(g => g.id === document.querySelector('#class-grade').value); if (!name || !grade) return; grade.classes.push({ id: uid('class'), name, students: [] }); saveRoster(); state = { ...state, gradeId: grade.id, classId: grade.classes.at(-1).id, studentId: '' }; render(); };
  document.querySelector('#student-grade').onchange = event => { state.gradeId = event.target.value; state.classId = roster.grades.find(g => g.id === state.gradeId)?.classes[0]?.id || ''; render(); };
  document.querySelector('#student-class').onchange = event => { state.classId = event.target.value; render(); };
  document.querySelector('#student-form').onsubmit = event => { event.preventDefault(); const grade = roster.grades.find(g => g.id === document.querySelector('#student-grade').value); const klass = grade?.classes.find(c => c.id === document.querySelector('#student-class').value); if (!klass) return; const names = event.target.studentNames.value.split(/\r?\n/).map(name => name.trim()).filter(Boolean); names.forEach(name => klass.students.push({ id: uid('student'), name })); saveRoster(); state = { ...state, gradeId: grade.id, classId: klass.id, studentId: klass.students.at(-1)?.id || state.studentId }; render(); };
  document.querySelectorAll('[data-edit-grade]').forEach(input => input.onchange = () => { const grade = roster.grades.find(g => g.id === input.dataset.editGrade); if (grade && input.value.trim()) grade.name = input.value.trim(); saveRoster(); render(); });
  document.querySelectorAll('[data-edit-class]').forEach(input => input.onchange = () => { const [gid, cid] = input.dataset.editClass.split(':'); const klass = roster.grades.find(g => g.id === gid)?.classes.find(c => c.id === cid); if (klass && input.value.trim()) klass.name = input.value.trim(); saveRoster(); render(); });
  document.querySelectorAll('[data-edit-student]').forEach(input => input.onchange = () => { const [gid, cid, sid] = input.dataset.editStudent.split(':'); const student = roster.grades.find(g => g.id === gid)?.classes.find(c => c.id === cid)?.students.find(s => s.id === sid); if (student && input.value.trim()) student.name = input.value.trim(); saveRoster(); render(); });
  document.querySelectorAll('[data-delete-student]').forEach(button => button.onclick = () => deleteStudent(button.dataset.deleteStudent));
  document.querySelectorAll('[data-delete-class]').forEach(button => button.onclick = () => deleteClass(button.dataset.deleteClass));
  document.querySelectorAll('[data-delete-grade]').forEach(button => button.onclick = () => deleteGrade(button.dataset.deleteGrade));
  document.querySelector('#clear-demo').onclick = clearDemoData;
  document.querySelector('#export-json').onclick = exportJson;
  document.querySelector('#import-json').onchange = importJson;
}
function deleteStudent(path) {
  if (!confirm('确认删除这个学生吗？该操作不会删除已经导出的 JSON 文件。')) return;
  const [gid, cid, sid] = path.split(':');
  const klass = roster.grades.find(g => g.id === gid)?.classes.find(c => c.id === cid);
  if (!klass) return;
  klass.students = klass.students.filter(s => s.id !== sid);
  saveRoster(); syncSelection(); render();
}
function deleteClass(path) {
  if (!confirm('确认删除这个班级及其学生吗？')) return;
  const [gid, cid] = path.split(':');
  const grade = roster.grades.find(g => g.id === gid);
  if (!grade) return;
  grade.classes = grade.classes.filter(c => c.id !== cid);
  saveRoster(); syncSelection(); render();
}
function deleteGrade(id) {
  if (!confirm('确认删除这个年级及其全部班级、学生吗？')) return;
  roster.grades = roster.grades.filter(g => g.id !== id);
  saveRoster(); syncSelection(); render();
}
function clearDemoData() {
  if (!confirm('确认清空所有演示年级、演示班级和演示学生吗？真实本地数据会保留。')) return;
  roster.grades = roster.grades.map(grade => {
    const classes = grade.classes.map(klass => {
      const students = klass.students.filter(student => !student.demo);
      return { ...klass, demo: klass.demo && students.length ? false : klass.demo, students };
    }).filter(klass => !klass.demo);
    return { ...grade, demo: grade.demo && classes.length ? false : grade.demo, classes };
  }).filter(grade => !grade.demo);
  saveRoster(); syncSelection(); render();
}
function exportJson() {
  const blob = new Blob([JSON.stringify({ roster, records, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `physics-classroom-data-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}
function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.roster?.grades || !Array.isArray(data.roster.grades)) throw new Error('invalid roster');
      roster = data.roster;
      records = data.records || {};
      saveRoster(); saveRecords(); state = initialState(); render();
    } catch {
      alert('导入失败：请选择由本系统导出的 JSON 文件。');
    }
  };
  reader.readAsText(file);
}
render();
