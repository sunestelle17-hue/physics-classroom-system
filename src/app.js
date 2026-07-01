const STORAGE_KEY = 'physics-classroom-system:v2';
const LEGACY_STORAGE_KEY = 'physics-classroom-system:v1';
const ERROR_REASONS = ['审题', '概念', '公式', '计算', '单位', '步骤', '作图', '实验表述', '漏答', '不会', '时间不足', '其他'];
const PERFORMANCE_TAGS = ['主动回应', '主动表达', '愿意参与讨论', '补充同学思路', '被点名后能回应', '需要点名提醒', '有自己的想法', '表达完整', '回答简短', '害羞慢热', '注意力飘'];
const STATUS_OPTIONS = [
  { key: 'correct', label: '√', text: '独立' },
  { key: 'hint', label: '△', text: '提示' },
  { key: 'wrong', label: '×', text: '错误' },
  { key: 'unfinished', label: '—', text: '未完成' },
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
  return { gradeId: grade?.id || '', classId: klass?.id || '', lessonId: lesson?.id || '', moduleId: module?.id || '', studentIndex, managerOpen: Boolean(candidate.managerOpen), performanceOpen: Boolean(candidate.performanceOpen), feedbackOpen: Boolean(candidate.feedbackOpen) };
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
function pick(list, salt = '') {
  if (!list.length) return '';
  const seed = `${Date.now()}-${Math.random()}-${salt}`;
  let hash = 0;
  for (const char of seed) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  return list[Math.abs(hash) % list.length];
}
const PHRASES = {
  good: ['今天整体表现挺不错的', '今天课堂状态很好', '今天这一讲完成得比较顺', '今天整体掌握情况不错', '这节课跟得比较稳', '今天做题的正确率还是不错的', '今天大部分内容都能跟上', '这节课整体完成情况比较好', '今天进入状态挺快的', '今天思路比较清楚', '今天整体反应还是比较快的'],
  steady: ['今天整体完成情况比较稳定', '这节课整体跟得还可以', '今天课堂节奏基本能跟上', '今天这一讲整体完成得可以'],
  weak: ['今天这一块掌握得还不够扎实', '目前理解还不够稳定', '这部分知识点需要再重新梳理', '这类题单独做时还有困难'],
  independent: ['大部分题目都能够独立完成', '基础题掌握得比较扎实', '今天做题的独立性不错', '常规题目基本能够自己处理', '题目拿到以后基本知道从哪里入手', '今天做题思路整体比较清楚', '完成题目时不太依赖提示'],
  hint: ['有几道题提醒一下之后就能反应过来', '稍微点一下思路就能接上', '提示后能够很快调整过来', '个别题目需要提醒，但提醒后可以继续完成', '有些地方不是不会，而是第一下没有想到', '说明知识点基本是会的，只是还不够熟练'],
  endingsLight: ['后面做题时再细致一些就可以了', '这个地方再注意一下，问题不大', '这些小细节后面慢慢改掉就好', '只要把细节再稳一点，正确率还会更高', '这一块再巩固一下就更稳了'],
  endingsCheck: ['下次我再检查一下这一部分', '后面上课我会再问一下这几个点', '这一块我后面还会再带着过一遍', '后面我再看看他能不能独立做出来'],
  endingsEncourage: ['整体还是不错的，继续保持', '今天状态挺好，希望后面继续保持', '思路是有的，再自信一点会更好', '继续保持现在这个课堂状态'],
  endingsReview: ['课后把今天错的几道再看一下', '回去把相关公式和错题再过一遍', '把今天提示过的题再独立做一次会更好', '课后重点复习一下今天容易混淆的概念'],
};
const REASON_PHRASES = {
  审题: ['审题时还需要再细一点', '有时题目条件看得不够完整', '个别题目不是不会，而是条件漏看了', '题目里的关键词还需要再抓准'],
  计算: ['计算上有一点小失误', '思路是对的，但计算过程不够细', '个别题目最后错在计算', '公式和思路没有问题，主要是计算细节'],
  单位: ['单位有时容易漏', '结果写出来后还要记得补单位', '个别题目错在单位没有统一', '计算前先把单位统一，会更稳一些'],
  公式: ['公式使用还需要再熟练一些', '能想到相关公式，但代入时不够熟练', '公式本身会用，但变形还需要练习', '后面需要把这几个常用公式再过一遍'],
  概念: ['个别概念还需要再区分一下', '基本意思知道，但表述还不够准确', '概念理解还需要再扎实一点', '需要再结合例子把概念理顺'],
  作图: ['作图还不够规范', '图能画出来，但细节需要再标准一些', '作图时位置和方向还需要再准确一点', '这类题要注意辅助线、箭头和标注'],
  实验表述: ['实验题表述还不够完整', '知道结论，但语言组织不够严谨', '回答实验题时要注意把依据写完整', '口头能说出来，写到卷面上还需要更完整'],
  步骤: ['解题步骤还需要再完整一些', '思路有，但过程写得太跳', '中间步骤省得太多，容易丢分', '解题过程还需要再规范一些'],
  漏答: ['有时会漏掉步骤或结论', '个别小问没有全部答完整', '有些失分不是不会，而是没有答全', '需要养成逐问核对的习惯'],
  不会: ['这一部分还需要重新巩固', '有些题目还找不到入手点', '目前还比较依赖提示', '后面需要通过几道针对题再练一下'],
  时间不足: ['后面还要注意做题节奏', '时间分配上可以再稳一点'],
  其他: ['个别地方还需要再巩固一下', '细节上还可以再稳一点'],
};
const TAG_SENTENCES = {
  主动回应: '今天课堂回应比较积极', 主动表达: '愿意主动说出自己的想法', 愿意参与讨论: '今天参与讨论的状态不错', 补充同学思路: '能够在同学回答后补充自己的理解', 被点名后能回应: '点到以后能够跟上', 需要点名提醒: '有时需要点一下才能重新进入状态', 有自己的想法: '能看出来他有自己的思路', 表达完整: '回答问题时思路比较完整', 回答简短: '思路有，但表达还可以再完整一些', 害羞慢热: '前面稍微慢热一些，后面状态逐渐起来', 注意力飘: '中间有一小段注意力不太集中'
};
function polishNote(note) {
  const text = note.trim().replace(/[。；;\s]+$/g, '');
  if (!text) return '';
  if (/今天|这道|有一题|力臂|垂足|展开式|单位|公式|计算|图/.test(text)) return text;
  return `另外，${text}`;
}
function generateFeedback() {
  const { lesson, record, student } = current();
  if (!student) return '';
  const { counts, reasons } = summarizeQuestions(lesson, record);
  const attempted = counts.correct + counts.hint + counts.wrong + counts.unfinished;
  const lines = [];
  const good = counts.correct >= Math.max(1, counts.hint + counts.wrong);
  const weak = counts.wrong > counts.correct && attempted > 0;
  const opening = pick(weak ? PHRASES.weak : good ? PHRASES.good : PHRASES.steady, student.id);
  const mastery = [];
  if (counts.correct > 0 && good) mastery.push(pick(PHRASES.independent, 'ind'));
  if (counts.hint > 0) mastery.push(pick(PHRASES.hint, 'hint'));
  if (!attempted) mastery.push('今天记录不多，先从课堂状态看，整体还能跟着走');
  lines.push([opening, ...mastery.slice(0, attempted < 3 ? 1 : 2)].join('，') + '。');
  const details = [];
  const note = polishNote(record.note || '');
  if (note) details.push(note);
  reasons.slice(0, note ? 1 : 2).forEach(reason => details.push(pick(REASON_PHRASES[reason] || REASON_PHRASES.其他, reason)));
  (record.performance || []).slice(0, details.length ? 1 : 2).forEach(tag => TAG_SENTENCES[tag] && details.push(TAG_SENTENCES[tag]));
  if (details.length) lines.push(details.slice(0, attempted < 3 ? 2 : 3).join('，') + '。');
  const endingPool = weak || reasons.includes('不会') ? PHRASES.endingsCheck : reasons.length ? PHRASES.endingsReview.concat(PHRASES.endingsLight) : PHRASES.endingsEncourage;
  if (attempted || reasons.length || record.note) lines[lines.length - 1] += pick(endingPool, 'end') + '。';
  return lines.join(lines.join('').length > 95 ? '\n' : '');
}

function rosterManagerHtml(grade, klass) {
  return `<section class="card manager"><div class="section-title"><div><h2>班级与学生管理</h2><p>姓名只保存在本机浏览器 localStorage，可 JSON 导入/导出。</p></div><div class="manager-actions"><button data-action="export-json">导出 JSON</button><button data-action="import-json">导入 JSON</button><button class="danger" data-action="clear-demo">清空演示数据</button></div></div><div class="manage-grid"><div><h3>年级</h3><div class="inline-form"><input id="grade-name" value="${escapeHtml(grade?.name || '')}" placeholder="年级名称"><button data-action="save-grade">保存</button><button data-action="add-grade">新增</button><button class="danger" data-action="delete-grade">删除</button></div></div><div><h3>班级</h3><div class="inline-form"><input id="class-name" value="${escapeHtml(klass?.name || '')}" placeholder="班级名称"><button data-action="save-class">保存</button><button data-action="add-class">新增</button><button class="danger" data-action="delete-class">删除</button></div></div><div><h3>学生</h3><div class="inline-form"><input id="student-name" value="${escapeHtml(klass?.students[state.studentIndex]?.name || '')}" placeholder="学生姓名"><button data-action="save-student">保存</button><button data-action="add-student">新增</button><button class="danger" data-action="delete-student">删除</button></div><textarea id="bulk-students" rows="4" placeholder="每行一个姓名，批量添加到当前班级"></textarea><button data-action="bulk-add">批量添加学生</button></div></div><textarea id="json-box" class="json-box" rows="5" placeholder="导出的 JSON 会出现在这里；也可粘贴 JSON 后点击导入。"></textarea></section>`;
}
function render() {
  const { grade, klass, lesson, module, student, record } = current();
  const prog = lesson ? progress(lesson, record) : { done: 0, total: 0 };
  const studentCount = klass?.students.length || 0;
  const studentLabel = student ? `${state.studentIndex + 1} / ${studentCount}` : '0 / 0';
  const perfMarked = (record.performance || []).length || record.note;
  const feedbackMarked = record.feedbackDraft;
  document.querySelector('#app').innerHTML = `<div class="sticky-summary"><strong>${escapeHtml(klass?.name || '未选班级')}</strong><span>${escapeHtml(student?.name || '未选学生')}</span><span>${escapeHtml(lesson?.name || '未选讲次')}</span><span>${escapeHtml(module?.name || '未选模块')}</span><b>${prog.done}/${prog.total}</b></div><header class="hero"><div><p class="eyebrow">本地原型 · 自动保存</p><h1>物理课堂登记</h1></div><button class="manage-toggle" data-action="toggle-manager">${state.managerOpen ? '收起管理' : '管理'}</button></header>${state.managerOpen ? rosterManagerHtml(grade, klass) : ''}<section class="card selectors"><div class="current-student"><span>当前学生</span><strong>${escapeHtml(student?.name || '请先添加学生')}</strong><em>${studentLabel}</em></div>${selectHtml('年级', 'grade', state.gradeId, appData.roster.map(g => ({ value: g.id, label: g.name })))}${selectHtml('班级', 'class', state.classId, (grade?.classes || []).map(c => ({ value: c.id, label: c.name })))}${selectHtml('讲次', 'lesson', state.lessonId, appData.lessons.map(l => ({ value: l.id, label: l.name })))}${selectHtml('模块', 'module', state.moduleId, (lesson?.modules || []).map(m => ({ value: m.id, label: m.name })))}${selectHtml('快速跳转', 'student', state.studentIndex, (klass?.students || []).map((s, index) => ({ value: index, label: s.name })))}</section>${!student ? '<section class="card empty">请点击“管理”新增年级、班级和学生。</section>' : `<section class="card student-switch"><button data-action="prev-student">上一位</button><div><strong>${escapeHtml(student.name)}</strong><span>第 ${studentLabel} 位</span></div><button data-action="next-student">下一位</button></section><section class="card module-head"><button data-action="prev-module">上一个模块</button><div><h2>${escapeHtml(module.name)}</h2><p>${escapeHtml(lesson.name)}</p></div><button data-action="next-module">下一个模块</button><label class="switch"><input id="module-unassigned" type="checkbox" ${record.moduleUnassigned[module.id] ? 'checked' : ''}> 模块未布置</label></section><section class="question-list">${module.questions.map((title, index) => questionHtml(module, title, index, record)).join('')}</section><section class="card collapse"><button class="collapse-title" data-action="toggle-performance"><span>课堂表现 ${perfMarked ? '<em>已记录</em>' : ''}</span><b>${state.performanceOpen ? '收起' : '展开'}</b></button>${state.performanceOpen ? `<div class="tag-grid">${PERFORMANCE_TAGS.map(tag => `<button data-tag="${tag}" class="${record.performance.includes(tag) ? 'active' : ''}">${tag}</button>`).join('')}</div><label class="note-label">自由备注<input id="note" value="${escapeHtml(record.note)}" placeholder="例如：力臂漏画垂足，公式写对但计算错。"></label>` : ''}</section><section class="card feedback collapse"><button class="collapse-title" data-action="toggle-feedback"><span>家长反馈 ${feedbackMarked ? '<em>已有草稿</em>' : ''}</span><b>${state.feedbackOpen ? '收起' : '展开'}</b></button>${state.feedbackOpen ? `<div class="feedback-actions"><button data-action="generate-feedback">生成草稿</button><button data-action="copy-feedback">一键复制</button></div><textarea id="feedback-draft" rows="5" placeholder="点击生成草稿，可继续手动编辑；系统不会自动发送。">${escapeHtml(record.feedbackDraft)}</textarea><p id="copy-tip" class="copy-tip"></p>` : ''}</section><nav class="bottom-actions"><button data-action="prev-student">上一位</button><button data-action="next-student">下一位</button><button data-action="open-performance">课堂表现</button><button data-action="open-feedback-generate">生成反馈</button></nav>`}`;
  bindEvents();
}

function questionHtml(module, title, index, record) {
  const id = qid(module.id, index); const question = record.questions[id] || { status: 'blank', reasons: [], unassigned: false }; const disabled = record.moduleUnassigned[module.id] || question.unassigned; const reasons = question.reasons || [];
  return `<article class="card question ${disabled ? 'muted' : ''}"><div class="question-title"><h3>${index + 1}. ${escapeHtml(title)}</h3><label><input data-unassigned="${id}" type="checkbox" ${question.unassigned ? 'checked' : ''}> 未布置</label></div><div class="status-grid">${STATUS_OPTIONS.map(opt => `<button data-status="${id}:${opt.key}" ${disabled ? 'disabled' : ''} class="${question.status === opt.key ? `picked ${opt.key}` : ''}"><b>${opt.label}</b><span>${opt.text}</span></button>`).join('')}<button class="clear-status" data-status="${id}:blank" ${disabled ? 'disabled' : ''}>清除</button></div>${(question.status === 'hint' || question.status === 'wrong') && !disabled ? `<div class="reasons"><p>错因（可多选）</p>${ERROR_REASONS.map(reason => `<button data-reason="${id}:${reason}" class="${reasons.includes(reason) ? 'active' : ''}">${reason}</button>`).join('')}</div>` : ''}</article>`;
}

function confirmTwice(message) { return window.confirm(`${message}\n\n第一次确认：是否继续？`) && window.confirm(`${message}\n\n第二次确认：此操作不可撤销。`); }
function activeGrade() { return appData.roster.find(g => g.id === state.gradeId); }
function activeClass() { return activeGrade()?.classes.find(c => c.id === state.classId); }
function saveRoster() { state = normalizeState(state); persist(); render(); }
function bindEvents() {
  if (document.querySelector('#grade')) document.querySelector('#grade').onchange = e => { const grade = appData.roster.find(g => g.id === e.target.value); state = { ...state, gradeId: grade.id, classId: grade.classes[0]?.id || '', studentIndex: 0 }; persist(); render(); };
  if (document.querySelector('#class')) document.querySelector('#class').onchange = e => { state = { ...state, classId: e.target.value, studentIndex: 0 }; persist(); render(); };
  if (document.querySelector('#lesson')) document.querySelector('#lesson').onchange = e => { const lesson = appData.lessons.find(l => l.id === e.target.value); state = { ...state, lessonId: lesson.id, moduleId: lesson.modules[0].id }; persist(); render(); };
  if (document.querySelector('#module')) document.querySelector('#module').onchange = e => { state = { ...state, moduleId: e.target.value }; persist(); render(); };
  if (document.querySelector('#student')) document.querySelector('#student').onchange = e => { state = { ...state, studentIndex: Number(e.target.value) }; persist(); render(); };
  document.querySelectorAll('[data-student]').forEach(button => button.onclick = () => { state = { ...state, studentIndex: Number(button.dataset.student) }; persist(); render(); });
  document.querySelector('#module-unassigned')?.addEventListener('change', e => updateRecord(record => ({ ...record, moduleUnassigned: { ...record.moduleUnassigned, [current().module.id]: e.target.checked } })));
  document.querySelectorAll('[data-unassigned]').forEach(input => input.onchange = () => patchQuestion(input.dataset.unassigned, { unassigned: input.checked }));
  document.querySelectorAll('[data-status]').forEach(button => button.onclick = () => { const [id, status] = button.dataset.status.split(':'); const currentStatus = current().record.questions[id]?.status || 'blank'; patchQuestion(id, { status: currentStatus === status ? 'blank' : status, reasons: status === 'correct' || status === 'unfinished' || status === 'blank' ? [] : (current().record.questions[id]?.reasons || []) }); });
  document.querySelectorAll('[data-reason]').forEach(button => button.onclick = () => { const [id, reason] = button.dataset.reason.split(':'); const reasons = current().record.questions[id]?.reasons || []; patchQuestion(id, { reasons: reasons.includes(reason) ? reasons.filter(item => item !== reason) : [...reasons, reason] }); });
  document.querySelectorAll('[data-tag]').forEach(button => button.onclick = () => { const tag = button.dataset.tag; updateRecord(record => ({ ...record, performance: record.performance.includes(tag) ? record.performance.filter(item => item !== tag) : [...record.performance, tag] })); });
  document.querySelector('#note')?.addEventListener('input', e => updateRecord(record => ({ ...record, note: e.target.value }), false));
  document.querySelector('#feedback-draft')?.addEventListener('input', e => updateRecord(record => ({ ...record, feedbackDraft: e.target.value }), false));
  document.querySelectorAll('[data-action]').forEach(button => button.onclick = () => handleAction(button.dataset.action));
}
function handleAction(action) {
  const grade = activeGrade(); const klass = activeClass();

  if (action === 'toggle-manager') { state.managerOpen = !state.managerOpen; persist(); render(); return; }
  if (action === 'toggle-performance') { state.performanceOpen = !state.performanceOpen; persist(); render(); return; }
  if (action === 'toggle-feedback') { state.feedbackOpen = !state.feedbackOpen; persist(); render(); return; }
  if (action === 'open-performance') { state.performanceOpen = true; persist(); render(); document.querySelector('.collapse-title[data-action="toggle-performance"]')?.scrollIntoView({ block: 'center' }); return; }
  if (action === 'open-feedback-generate') { state.feedbackOpen = true; updateRecord(record => ({ ...record, feedbackDraft: generateFeedback() })); return; }
  if (action === 'prev-student' || action === 'next-student') { const count = activeClass()?.students.length || 0; if (count) state.studentIndex = (state.studentIndex + (action === 'next-student' ? 1 : count - 1)) % count; persist(); render(); return; }
  if (action === 'prev-module' || action === 'next-module') { const lesson = current().lesson; const modules = lesson?.modules || []; const idx = modules.findIndex(m => m.id === state.moduleId); if (idx >= 0) state.moduleId = modules[(idx + (action === 'next-module' ? 1 : modules.length - 1)) % modules.length].id; persist(); render(); return; }

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
