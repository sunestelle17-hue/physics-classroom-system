const STORAGE_KEY = 'physics-classroom-system:v2';
const LEGACY_STORAGE_KEY = 'physics-classroom-system:v1';
const ERROR_REASONS = ['审题', '概念', '公式', '计算', '单位', '步骤', '作图', '实验表述', '漏答', '不会', '时间不足', '其他'];
const PERFORMANCE_TAGS = ['主动回应', '主动表达', '愿意参与讨论', '补充同学思路', '被点名后能回应', '需要点名提醒', '有自己的想法', '表达完整', '回答简短', '害羞慢热', '注意力飘'];
const STATUS_OPTIONS = [
  { key: 'correct', label: '√', text: '独立正确' },
  { key: 'hint', label: '△', text: '提示后正确' },
  { key: 'wrong', label: '×', text: '错误/不会' },
  { key: 'unfinished', label: '—', text: '未完成/缺席' },
  { key: 'blank', label: '空白', text: '尚未检查' },
];
const EMPTY_DATA = { grades: [], lessons: [
  { id: 'lesson-01', name: '第 1 讲：运动和速度', modules: [
    { id: 'm-basic', name: '基础概念', questions: ['匀速直线运动判断', '速度公式应用', '单位换算'] },
    { id: 'm-chart', name: '图像分析', questions: ['s-t 图像读数', 'v-t 图像比较', '综合描述'] },
  ] },
  { id: 'lesson-02', name: '第 2 讲：力与平衡', modules: [
    { id: 'm-force', name: '受力分析', questions: ['画受力示意图', '判断相互作用力', '平衡力辨析'] },
    { id: 'm-calc', name: '计算应用', questions: ['重力计算', '摩擦力分析', '实验结论表达'] },
  ] },
] };
const DEMO_ROSTER = [
  { id: 'g7', name: '七年级', classes: [
    { id: 'g7c1', name: '七年级 1 班', students: [{ id: 's-a', name: '学生 A' }, { id: 's-b', name: '学生 B' }, { id: 's-c', name: '学生 C' }, { id: 's-d', name: '学生 D' }] },
    { id: 'g7c2', name: '七年级 2 班', students: [{ id: 's-e', name: '学生 E' }, { id: 's-f', name: '学生 F' }, { id: 's-g', name: '学生 G' }] },
  ] },
  { id: 'g8', name: '八年级', classes: [
    { id: 'g8c1', name: '八年级 1 班', students: [{ id: 's-h', name: '学生 H' }, { id: 's-i', name: '学生 I' }, { id: 's-j', name: '学生 J' }, { id: 's-k', name: '学生 K' }] },
    { id: 'g8c2', name: '八年级 2 班', students: [{ id: 's-l', name: '学生 L' }, { id: 's-m', name: '学生 M' }, { id: 's-n', name: '学生 N' }] },
  ] },
];

let appData = loadData();
let state = normalizeState(appData.ui || {});

function uid(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function defaultData() { return { roster: clone(DEMO_ROSTER), lessons: clone(EMPTY_DATA.lessons), records: {}, ui: {} }; }
function normalizeStudent(student) { return typeof student === 'string' ? { id: uid('student'), name: student } : { id: student.id || uid('student'), name: student.name || '未命名学生' }; }
function normalizeRoster(roster) {
  return (roster || []).map(grade => ({ id: grade.id || uid('grade'), name: grade.name || '未命名年级', classes: (grade.classes || []).map(klass => ({ id: klass.id || uid('class'), name: klass.name || '未命名班级', students: (klass.students || []).map(normalizeStudent) })) }));
}
function loadData() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed) return { ...defaultData(), ...parsed, roster: normalizeRoster(parsed.roster), records: parsed.records || {} };
  } catch { /* ignore broken local data */ }
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
    if (legacy) return { ...defaultData(), records: legacy };
  } catch { /* ignore broken legacy data */ }
  return defaultData();
}
function persist() { appData.ui = state; localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); }
function normalizeState(candidate = {}) {
  const roster = appData?.roster || [];
  const grade = roster.find(g => g.id === candidate.gradeId) || roster[0];
  const klass = grade?.classes.find(c => c.id === candidate.classId) || grade?.classes[0];
  const lesson = appData?.lessons.find(l => l.id === candidate.lessonId) || appData?.lessons[0];
  const module = lesson?.modules.find(m => m.id === candidate.moduleId) || lesson?.modules[0];
  const studentIndex = Math.min(Number(candidate.studentIndex) || 0, Math.max((klass?.students.length || 1) - 1, 0));
  return { gradeId: grade?.id || '', classId: klass?.id || '', lessonId: lesson?.id || '', moduleId: module?.id || '', studentIndex };
}
function qid(moduleId, index) { return `${moduleId}-q${index + 1}`; }
function current() {
  state = normalizeState(state);
  const grade = appData.roster.find(g => g.id === state.gradeId);
  const klass = grade?.classes.find(c => c.id === state.classId);
  const lesson = appData.lessons.find(l => l.id === state.lessonId) || appData.lessons[0];
  const module = lesson?.modules.find(m => m.id === state.moduleId) || lesson?.modules[0];
  const student = klass?.students[state.studentIndex];
  const recordKey = klass && lesson && student ? `${klass.id}:${lesson.id}:${student.id}` : '';
  const record = appData.records[recordKey] || { questions: {}, moduleUnassigned: {}, performance: [], note: '', feedbackDraft: '' };
  return { grade, klass, lesson, module, student, recordKey, record };
}
function updateRecord(updater, shouldRender = true) {
  const { recordKey, record } = current();
  if (!recordKey) return;
  appData.records = { ...appData.records, [recordKey]: updater(record) };
  persist();
  if (shouldRender) render();
}
function patchQuestion(questionId, patch) {
  updateRecord(record => ({ ...record, questions: { ...record.questions, [questionId]: { status: 'blank', reasons: [], unassigned: false, ...(record.questions[questionId] || {}), ...patch } } }));
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
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
function selectHtml(label, id, value, options) { return `<label><span>${label}</span><select id="${id}" ${options.length ? '' : 'disabled'}>${options.map(o => `<option value="${escapeHtml(o.value)}" ${String(o.value) === String(value) ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join('')}</select></label>`; }
function summarizeQuestions(lesson, record) {
  const counts = { correct: 0, hint: 0, wrong: 0, unfinished: 0 };
  const reasons = new Set();
  lesson.modules.forEach(m => m.questions.forEach((_, i) => {
    const q = record.questions[qid(m.id, i)];
    if (!q || q.status === 'blank' || q.unassigned || record.moduleUnassigned[m.id]) return;
    counts[q.status] = (counts[q.status] || 0) + 1;
    (q.reasons || []).forEach(reason => reasons.add(reason));
  }));
  return { counts, reasons: [...reasons] };
}
function generateFeedback() {
  const { lesson, record, student } = current();
  if (!student) return '';
  const { counts, reasons } = summarizeQuestions(lesson, record);
  const parts = [`${student.name}今天课堂整体${counts.correct >= counts.wrong + counts.hint ? '比较稳定' : '还需要继续巩固'}。`];
  if (counts.correct) parts.push(`已能独立完成 ${counts.correct} 题`);
  if (counts.hint) parts.push(`${counts.hint} 题在提示后完成`);
  if (counts.wrong) parts.push(`${counts.wrong} 题需要课后订正`);
  if (counts.unfinished) parts.push(`${counts.unfinished} 题未完成或缺席`);
  const detail = parts.length > 1 ? `${parts.shift()}${parts.join('，')}。` : parts[0];
  const reasonText = reasons.length ? `主要关注${reasons.slice(0, 4).join('、')}。` : '';
  const tagText = record.performance.length ? `课堂表现：${record.performance.slice(0, 4).join('、')}。` : '';
  const noteText = record.note ? `补充：${record.note}` : '';
  return [detail, reasonText, tagText, noteText].filter(Boolean).join('');
}
function rosterManagerHtml(grade, klass) {
  return `<section class="card manager"><div class="section-title"><div><h2>班级与学生管理</h2><p>姓名只保存在本机浏览器 localStorage，可 JSON 导入/导出。</p></div><div class="manager-actions"><button data-action="export-json">导出 JSON</button><button data-action="import-json">导入 JSON</button><button class="danger" data-action="clear-demo">清空演示数据</button></div></div><div class="manage-grid"><div><h3>年级</h3><div class="inline-form"><input id="grade-name" value="${escapeHtml(grade?.name || '')}" placeholder="年级名称"><button data-action="save-grade">保存</button><button data-action="add-grade">新增</button><button class="danger" data-action="delete-grade">删除</button></div></div><div><h3>班级</h3><div class="inline-form"><input id="class-name" value="${escapeHtml(klass?.name || '')}" placeholder="班级名称"><button data-action="save-class">保存</button><button data-action="add-class">新增</button><button class="danger" data-action="delete-class">删除</button></div></div><div><h3>学生</h3><div class="inline-form"><input id="student-name" value="${escapeHtml(klass?.students[state.studentIndex]?.name || '')}" placeholder="学生姓名"><button data-action="save-student">保存</button><button data-action="add-student">新增</button><button class="danger" data-action="delete-student">删除</button></div><textarea id="bulk-students" rows="4" placeholder="每行一个姓名，批量添加到当前班级"></textarea><button data-action="bulk-add">批量添加学生</button></div></div><textarea id="json-box" class="json-box" rows="5" placeholder="导出的 JSON 会出现在这里；也可粘贴 JSON 后点击导入。"></textarea></section>`;
}
function render() {
  const { grade, klass, lesson, module, student, record } = current();
  const prog = lesson ? progress(lesson, record) : { done: 0, total: 0 };
  document.querySelector('#app').innerHTML = `<header class="hero"><div><p class="eyebrow">本地原型 · 自动保存</p><h1>物理课堂登记</h1></div><div class="progress"><strong>${prog.done}</strong>/<span>${prog.total}</span></div></header>${rosterManagerHtml(grade, klass)}<section class="card selectors">${selectHtml('年级', 'grade', state.gradeId, appData.roster.map(g => ({ value: g.id, label: g.name })))}${selectHtml('班级', 'class', state.classId, (grade?.classes || []).map(c => ({ value: c.id, label: c.name })))}${selectHtml('讲次', 'lesson', state.lessonId, appData.lessons.map(l => ({ value: l.id, label: l.name })))}${selectHtml('模块', 'module', state.moduleId, (lesson?.modules || []).map(m => ({ value: m.id, label: m.name })))}${selectHtml('学生', 'student', state.studentIndex, (klass?.students || []).map((s, index) => ({ value: index, label: s.name })))}</section>${!student ? '<section class="card empty">请先新增年级、班级和学生。</section>' : `<section class="student-bar">${klass.students.map((s, index) => `<button data-student="${index}" class="${index === state.studentIndex ? 'active' : ''}">${escapeHtml(s.name)}</button>`).join('')}</section><section class="card module-head"><div><h2>${escapeHtml(module.name)}</h2><p>${escapeHtml(student.name)} · ${escapeHtml(lesson.name)}</p></div><label class="switch"><input id="module-unassigned" type="checkbox" ${record.moduleUnassigned[module.id] ? 'checked' : ''}> 整个模块未布置</label></section><section class="question-list">${module.questions.map((title, index) => questionHtml(module, title, index, record)).join('')}</section><section class="card"><h2>课堂表现标签</h2><div class="tag-grid">${PERFORMANCE_TAGS.map(tag => `<button data-tag="${tag}" class="${record.performance.includes(tag) ? 'active' : ''}">${tag}</button>`).join('')}</div><label class="note-label">自由备注<input id="note" value="${escapeHtml(record.note)}" placeholder="例如：今天速度公式掌握较好，单位换算还需提醒。"></label></section><section class="card feedback"><div class="section-title"><h2>家长反馈草稿</h2><div><button data-action="generate-feedback">生成草稿</button><button data-action="copy-feedback">一键复制</button></div></div><textarea id="feedback-draft" rows="5" placeholder="点击生成草稿，可继续手动编辑；系统不会自动发送。">${escapeHtml(record.feedbackDraft)}</textarea><p id="copy-tip" class="copy-tip"></p></section>`}`;
  bindEvents();
}
function questionHtml(module, title, index, record) {
  const id = qid(module.id, index); const question = record.questions[id] || { status: 'blank', reasons: [], unassigned: false }; const disabled = record.moduleUnassigned[module.id] || question.unassigned; const reasons = question.reasons || [];
  return `<article class="card question ${disabled ? 'muted' : ''}"><div class="question-title"><h3>${index + 1}. ${escapeHtml(title)}</h3><label><input data-unassigned="${id}" type="checkbox" ${question.unassigned ? 'checked' : ''}> 本题未布置</label></div><div class="status-grid">${STATUS_OPTIONS.map(opt => `<button data-status="${id}:${opt.key}" ${disabled ? 'disabled' : ''} class="${question.status === opt.key ? `picked ${opt.key}` : ''}"><b>${opt.label}</b><span>${opt.text}</span></button>`).join('')}</div>${(question.status === 'hint' || question.status === 'wrong') && !disabled ? `<div class="reasons"><p>错因（可多选，非必填）</p>${ERROR_REASONS.map(reason => `<button data-reason="${id}:${reason}" class="${reasons.includes(reason) ? 'active' : ''}">${reason}</button>`).join('')}</div>` : ''}</article>`;
}
function confirmTwice(message) { return window.confirm(`${message}\n\n第一次确认：是否继续？`) && window.confirm(`${message}\n\n第二次确认：此操作不可撤销。`); }
function activeGrade() { return appData.roster.find(g => g.id === state.gradeId); }
function activeClass() { return activeGrade()?.classes.find(c => c.id === state.classId); }
function saveRoster() { state = normalizeState(state); persist(); render(); }
function bindEvents() {
  document.querySelector('#grade').onchange = e => { const grade = appData.roster.find(g => g.id === e.target.value); state = { ...state, gradeId: grade.id, classId: grade.classes[0]?.id || '', studentIndex: 0 }; persist(); render(); };
  document.querySelector('#class').onchange = e => { state = { ...state, classId: e.target.value, studentIndex: 0 }; persist(); render(); };
  document.querySelector('#lesson').onchange = e => { const lesson = appData.lessons.find(l => l.id === e.target.value); state = { ...state, lessonId: lesson.id, moduleId: lesson.modules[0].id }; persist(); render(); };
  document.querySelector('#module').onchange = e => { state = { ...state, moduleId: e.target.value }; persist(); render(); };
  document.querySelector('#student').onchange = e => { state = { ...state, studentIndex: Number(e.target.value) }; persist(); render(); };
  document.querySelectorAll('[data-student]').forEach(button => button.onclick = () => { state = { ...state, studentIndex: Number(button.dataset.student) }; persist(); render(); });
  document.querySelector('#module-unassigned')?.addEventListener('change', e => updateRecord(record => ({ ...record, moduleUnassigned: { ...record.moduleUnassigned, [current().module.id]: e.target.checked } })));
  document.querySelectorAll('[data-unassigned]').forEach(input => input.onchange = () => patchQuestion(input.dataset.unassigned, { unassigned: input.checked }));
  document.querySelectorAll('[data-status]').forEach(button => button.onclick = () => { const [id, status] = button.dataset.status.split(':'); patchQuestion(id, { status }); });
  document.querySelectorAll('[data-reason]').forEach(button => button.onclick = () => { const [id, reason] = button.dataset.reason.split(':'); const reasons = current().record.questions[id]?.reasons || []; patchQuestion(id, { reasons: reasons.includes(reason) ? reasons.filter(item => item !== reason) : [...reasons, reason] }); });
  document.querySelectorAll('[data-tag]').forEach(button => button.onclick = () => { const tag = button.dataset.tag; updateRecord(record => ({ ...record, performance: record.performance.includes(tag) ? record.performance.filter(item => item !== tag) : [...record.performance, tag] })); });
  document.querySelector('#note')?.addEventListener('input', e => updateRecord(record => ({ ...record, note: e.target.value }), false));
  document.querySelector('#feedback-draft')?.addEventListener('input', e => updateRecord(record => ({ ...record, feedbackDraft: e.target.value }), false));
  document.querySelectorAll('[data-action]').forEach(button => button.onclick = () => handleAction(button.dataset.action));
}
function handleAction(action) {
  const grade = activeGrade(); const klass = activeClass();
  if (action === 'save-grade' && grade) grade.name = document.querySelector('#grade-name').value.trim() || grade.name;
  if (action === 'add-grade') { const g = { id: uid('grade'), name: document.querySelector('#grade-name').value.trim() || '新年级', classes: [] }; appData.roster.push(g); state.gradeId = g.id; state.classId = ''; }
  if (action === 'delete-grade' && grade && confirmTwice(`删除年级「${grade.name}」及其班级、学生？`)) appData.roster = appData.roster.filter(g => g.id !== grade.id);
  if (action === 'save-class' && klass) klass.name = document.querySelector('#class-name').value.trim() || klass.name;
  if (action === 'add-class' && grade) { const c = { id: uid('class'), name: document.querySelector('#class-name').value.trim() || '新班级', students: [] }; grade.classes.push(c); state.classId = c.id; state.studentIndex = 0; }
  if (action === 'delete-class' && grade && klass && confirmTwice(`删除班级「${klass.name}」及其学生？`)) grade.classes = grade.classes.filter(c => c.id !== klass.id);
  if (action === 'save-student' && klass?.students[state.studentIndex]) klass.students[state.studentIndex].name = document.querySelector('#student-name').value.trim() || klass.students[state.studentIndex].name;
  if (action === 'add-student' && klass) { klass.students.push({ id: uid('student'), name: document.querySelector('#student-name').value.trim() || '新学生' }); state.studentIndex = klass.students.length - 1; }
  if (action === 'delete-student' && klass?.students[state.studentIndex] && confirmTwice(`删除学生「${klass.students[state.studentIndex].name}」？`)) klass.students.splice(state.studentIndex, 1);
  if (action === 'bulk-add' && klass) { document.querySelector('#bulk-students').value.split('\n').map(n => n.trim()).filter(Boolean).forEach(name => klass.students.push({ id: uid('student'), name })); }
  if (action === 'export-json') { document.querySelector('#json-box').value = JSON.stringify(appData, null, 2); return; }
  if (action === 'import-json') { try { const data = JSON.parse(document.querySelector('#json-box').value); appData = { ...defaultData(), ...data, roster: normalizeRoster(data.roster), records: data.records || {} }; state = normalizeState(data.ui || {}); } catch { alert('JSON 格式不正确，未导入。'); return; } }
  if (action === 'clear-demo' && confirmTwice('清空演示年级、班级、学生和课堂登记数据？')) { appData = { ...defaultData(), roster: [], records: {} }; state = normalizeState({}); }
  if (action === 'generate-feedback') { updateRecord(record => ({ ...record, feedbackDraft: generateFeedback() })); return; }
  if (action === 'copy-feedback') { navigator.clipboard.writeText(document.querySelector('#feedback-draft').value); document.querySelector('#copy-tip').textContent = '已复制到剪贴板，不会自动发送。'; return; }
  saveRoster();
}
render();
