const STORAGE_KEY = 'physics-classroom-system:v2';
const LEGACY_STORAGE_KEY = 'physics-classroom-system:v1';
const ERROR_REASONS = [
  '审题', '概念', '公式', '计算', '单位', '步骤', '作图', '实验表述', '漏答', '不会', '时间不足',
  '读不懂题目', '题意理解偏差', '关键词没抓住', '条件漏看', '条件关系没理清', '图文信息对应不上', '不知道题目在问什么', '题目读完没有形成思路', '长题干容易乱', '信息提取不完整',
  '选择题判断错误', '只看一个选项就作答', '没有逐项验证', '选项比较不完整', '多选题漏选', '多选题错选', '不确定时随意猜', '排除法使用不当', '题干要求看反', '选择正确项 / 错误项看反', '绝对化词语没注意', '图像选项判断错误', '计算选项代入错误',
  '填空答案不完整', '一空多答漏写', '物理量漏写', '数值正确但单位遗漏', '单位与数值不匹配', '填空顺序写反', '结论方向写反', '关键词缺失', '物理术语填写错误', '符号填写错误', '公式填写不完整', '多空题漏空', '答案超过题目要求', '没按指定形式填写',
  '错别字', '物理名词写错', '符号写错', '公式字母写错', '下标写错', '正负号写错', '数字抄错', '条件抄错', '答案写反', '表述不完整', '语言不规范', '口头会但写不完整', '字迹潦草', '卷面不整洁',
  '抄错数字', '代错数据', '公式变形错误', '中间过程跳步', '结果未化简', '小数点错误', '科学计数法错误', '比例关系错误', '未检查结果是否合理', '过程正确但答案写错',
  '漏箭头', '漏标注', '方向画反', '力的作用点错误', '力臂垂足漏画', '垂足画错', '多画垂足', '光线方向错误', '虚线实线错误', '电路连接错误', '电表位置错误', '量程选择错误', '滑动变阻器接线错误', '图画得过于随意',
  '实验步骤顺序错误', '控制变量不完整', '实验目的不清楚', '现象与结论混淆', '结论缺少条件', '不会分析表格', '不会分析图像', '数据处理错误', '实验器材作用不清楚', '操作注意事项遗漏',
  '不检查', '检查后能发现错误', '容易漏题', '容易漏小问', '只写答案不写过程', '依赖口算', '草稿较乱', '做题顺序不合理', '遇到不会会空着', '愿意订正', '订正较认真', '订正后能理解', '同类题仍会重复错', '其他'
];
const PERFORMANCE_TAGS = ['主动回应', '主动表达', '愿意参与讨论', '补充同学思路', '被点名后能回应', '需要点名提醒', '有自己的想法', '表达完整', '回答简短', '害羞慢热', '注意力飘', '有精神', '状态不错', '进入状态快', '后半段状态下降', '打瞌睡', '明显犯困', '今天比较疲惫', '注意力不集中', '容易走神', '需要多次提醒', '状态慢热', '情绪低落', '做题有点急', '做题比较稳', '节奏偏慢', '节奏偏快', '能坚持完成', '容易放弃', '遇到难题愿意继续想'];

const ERROR_REASON_CATEGORIES = [
  { key: 'common', label: '常用', items: [] },
  { key: 'reading', label: '审题理解', items: ['审题', '条件漏看', '关键词没抓住', '读不懂题目', '题意理解偏差', '条件关系没理清', '图文信息对应不上', '不知道题目在问什么', '题目读完没有形成思路', '长题干容易乱', '信息提取不完整', '题干要求看反', '选择正确项 / 错误项看反'] },
  { key: 'concept', label: '概念公式', items: ['概念', '概念混淆', '公式', '公式选择错误', '公式变形错误', '公式字母写错', '下标写错', '比例关系错误', '不会', '知识点不熟练'] },
  { key: 'calculation', label: '计算过程', items: ['计算', '抄错数字', '代错数据', '单位', '单位换算错误', '小数点错误', '科学计数法错误', '正负号错误', '中间过程跳步', '结果未化简', '未检查结果是否合理', '过程正确但答案写错'] },
  { key: 'objective', label: '选择填空', items: ['选择题判断错误', '只看一个选项就作答', '没有逐项验证', '选项比较不完整', '多选题漏选', '多选题错选', '不确定时随意猜', '排除法使用不当', '题干要求看反', '选择正确项 / 错误项看反', '绝对化词语没注意', '图像选项判断错误', '计算选项代入错误', '填空答案不完整', '一空多答漏写', '物理量漏写', '数值正确但单位遗漏', '单位与数值不匹配', '填空顺序写反', '结论方向写反', '关键词缺失', '物理术语填写错误', '符号填写错误', '公式填写不完整', '多空题漏空', '答案超过题目要求', '没按指定形式填写'] },
  { key: 'writing', label: '书写表达', items: ['错别字', '物理名词写错', '表述不完整', '语言不规范', '口头会但写不完整', '漏答', '容易漏小问', '关键词缺失', '符号写错', '答案写反', '字迹潦草', '卷面不整洁'] },
  { key: 'experiment', label: '作图实验', items: ['作图', '漏箭头', '漏标注', '方向画反', '力的作用点错误', '力臂垂足漏画', '垂足画错', '多画垂足', '光线方向错误', '虚线实线错误', '电路连接错误', '电表位置错误', '量程选择错误', '滑动变阻器接线错误', '图画得过于随意', '实验步骤顺序错误', '控制变量不完整', '实验目的不清楚', '现象与结论混淆', '结论缺少条件', '不会分析表格', '不会分析图像', '数据处理错误', '实验器材作用不清楚', '操作注意事项遗漏'] },
  { key: 'habit', label: '学习习惯', items: ['不检查', '检查后能发现错误', '容易漏题', '容易漏小问', '只写答案不写过程', '依赖口算', '草稿较乱', '做题顺序不合理', '遇到不会会空着', '愿意订正', '订正较认真', '订正后能理解', '同类题重复错', '做题有点急', '节奏偏慢', '容易放弃'] },
  { key: 'more', label: '更多', items: [] },
];
const QUESTION_TYPE_RECOMMENDATIONS = {
  choice: ['题干要求看反', '没有逐项验证', '只看一个选项就作答', '多选题漏选', '多选题错选', '绝对化词语没注意', '图像选项判断错误', '计算选项代入错误'],
  blank: ['填空答案不完整', '一空多答漏写', '多空题漏空', '关键词缺失', '数值正确但单位遗漏', '填空顺序写反', '没按指定形式填写', '物理术语填写错误'],
  calculation: ['公式选择错误', '代错数据', '单位', '公式变形错误', '小数点错误', '中间过程跳步', '未检查结果是否合理'],
  drawing: ['漏箭头', '漏标注', '方向画反', '力的作用点错误', '力臂垂足漏画', '垂足画错', '多画垂足', '虚线实线错误'],
  experiment: ['实验步骤顺序错误', '控制变量不完整', '现象与结论混淆', '结论缺少条件', '不会分析表格', '不会分析图像', '数据处理错误'],
};
const PERFORMANCE_GROUPS = [
  { key: 'participation', label: '课堂参与', items: ['主动回应', '主动表达', '愿意参与讨论', '补充同学思路', '被点名后能回应', '需要点名提醒'] },
  { key: 'thinking', label: '思考表达', items: ['有自己的想法', '表达完整', '回答简短', '害羞慢热', '遇到难题愿意继续想', '容易放弃'] },
  { key: 'energy', label: '精神状态', items: ['有精神', '状态不错', '进入状态快', '状态慢热', '后半段状态下降', '打瞌睡', '明显犯困', '今天比较疲惫', '情绪低落'] },
  { key: 'focus', label: '专注节奏', items: ['注意力飘', '注意力不集中', '容易走神', '需要多次提醒', '做题有点急', '做题比较稳', '节奏偏慢', '节奏偏快', '能坚持完成'] },
];
const RECENT_REASON_LIMIT = 40;

const STATUS_OPTIONS = [
  { key: 'correct', label: '√', text: '独立' },
  { key: 'hint', label: '△', text: '提示' },
  { key: 'wrong', label: '×', text: '错误' },
  { key: 'unfinished', label: '—', text: '未完成' },
];
const FEEDBACK_MODES = [
  { key: 'concise', label: '简洁版', rows: 5 },
  { key: 'natural', label: '自然详细版', rows: 7 },
  { key: 'professional', label: '专业版', rows: 9 },
];
const DEFAULT_FEEDBACK_MODE = 'natural';
function normalizeFeedbackMode(mode) { return mode === 'detailed' ? 'natural' : (FEEDBACK_MODES.some(item => item.key === mode) ? mode : DEFAULT_FEEDBACK_MODE); }

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
  return { gradeId: grade?.id || '', classId: klass?.id || '', lessonId: lesson?.id || '', moduleId: module?.id || '', studentIndex, managerOpen: Boolean(candidate.managerOpen), performanceOpen: Boolean(candidate.performanceOpen), feedbackOpen: Boolean(candidate.feedbackOpen), activeReasonCategories: candidate.activeReasonCategories || {}, activePerformanceGroup: candidate.activePerformanceGroup || '', recentReasons: Array.isArray(candidate.recentReasons) ? candidate.recentReasons.slice(0, RECENT_REASON_LIMIT) : [] };
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
  const rawRecord = appData.records[recordKey] || {};
  const feedbackMode = normalizeFeedbackMode(rawRecord.feedbackMode);
  const legacyMode = normalizeFeedbackMode(rawRecord.feedbackMode || 'natural');
  const feedbackDrafts = { ...(rawRecord.feedbackDrafts || {}) };
  if (rawRecord.feedbackDraft && !feedbackDrafts[legacyMode]) feedbackDrafts[legacyMode] = rawRecord.feedbackDraft;
  const record = { questions: {}, moduleUnassigned: {}, performance: [], note: '', ...rawRecord, feedbackMode, feedbackDrafts, feedbackDraft: feedbackDrafts[feedbackMode] || '' };
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

function unique(list) { return [...new Set((list || []).filter(Boolean))]; }
function questionTypeKey(question) {
  const raw = typeof question === 'object' ? (question.type || question.questionType || question.name || question.title || '') : question;
  const text = String(raw || '').toLowerCase();
  if (/选择|choice|single|multiple|多选/.test(text)) return 'choice';
  if (/填空|blank|fill/.test(text)) return 'blank';
  if (/计算|calc|应用/.test(text)) return 'calculation';
  if (/作图|画图|drawing|diagram/.test(text)) return 'drawing';
  if (/实验|experiment|lab/.test(text)) return 'experiment';
  return '';
}
function questionTitle(question) { return typeof question === 'object' ? (question.title || question.name || question.text || '未命名题目') : question; }
function questionReasonStats(record, studentId, moduleId) {
  const studentCounts = {}; const moduleCounts = {};
  Object.entries(appData.records || {}).forEach(([key, rec]) => {
    Object.entries(rec.questions || {}).forEach(([id, q]) => (q.reasons || []).forEach(reason => {
      if (key.endsWith(`:${studentId}`)) studentCounts[reason] = (studentCounts[reason] || 0) + 1;
      if (id.startsWith(`${moduleId}-`)) moduleCounts[reason] = (moduleCounts[reason] || 0) + 1;
    }));
  });
  return { studentCounts, moduleCounts };
}
function orderedReasons(items, selected, question, record, moduleId) {
  const { student } = current();
  const { studentCounts, moduleCounts } = questionReasonStats(record, student?.id || '', moduleId);
  const recommended = QUESTION_TYPE_RECOMMENDATIONS[questionTypeKey(question)] || [];
  const recent = state.recentReasons || [];
  return unique([...(selected || []), ...recommended, ...recent, ...items]).sort((a, b) =>
    (selected.includes(b) - selected.includes(a)) ||
    ((studentCounts[b] || 0) - (studentCounts[a] || 0)) ||
    ((moduleCounts[b] || 0) - (moduleCounts[a] || 0)) ||
    (recommended.includes(b) - recommended.includes(a)) ||
    (recent.indexOf(a) === -1 ? 99 : recent.indexOf(a)) - (recent.indexOf(b) === -1 ? 99 : recent.indexOf(b))
  );
}
function categoryReasons(category, selected, question, record, moduleId) {
  const categorized = new Set(ERROR_REASON_CATEGORIES.filter(c => !['common', 'more'].includes(c.key)).flatMap(c => c.items));
  if (category.key === 'common') return orderedReasons(unique([...(state.recentReasons || []), ...(QUESTION_TYPE_RECOMMENDATIONS[questionTypeKey(question)] || []), ...selected]), selected, question, record, moduleId).slice(0, 6);
  if (category.key === 'more') return orderedReasons(ERROR_REASONS.filter(r => !categorized.has(r)).concat(['其他']), selected, question, record, moduleId);
  return orderedReasons(category.items, selected, question, record, moduleId);
}
function selectedChips(items, attr) { return items.length ? items.map(item => `<button class="selected-chip" ${attr}="${escapeHtml(item)}">${escapeHtml(item)} ×</button>`).join('') : '<span class="empty-summary">未选择</span>'; }
function rememberReason(reason) { state.recentReasons = unique([reason, ...(state.recentReasons || [])]).slice(0, RECENT_REASON_LIMIT); }
function dedupeFeedbackReasons(reasons) {
  const groups = [['审题', '条件漏看', '关键词没抓住'], ['计算', '代错数据', '抄错数字'], ['单位', '数值正确但单位遗漏', '单位换算错误'], ['漏答', '容易漏小问', '多空题漏空'], ['表述不完整', '关键词缺失', '口头会但写不完整']];
  const drop = new Set();
  groups.forEach(group => {
    const chosen = group.filter(r => reasons.includes(r));
    chosen.slice(0, -1).forEach(r => drop.add(r));
  });
  return reasons.filter(r => !drop.has(r));
}

function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
function selectHtml(label, id, value, options) { return `<label><span>${label}</span><select id="${id}" ${options.length ? '' : 'disabled'}>${options.map(o => `<option value="${escapeHtml(o.value)}" ${String(o.value) === String(value) ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join('')}</select></label>`; }
function pick(list, salt = '') {
  if (!list.length) return '';
  const seed = `${Date.now()}-${Math.random()}-${salt}`;
  let hash = 0;
  for (const char of seed) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  return list[Math.abs(hash) % list.length];
}
const PHRASES = {
  good: ['今天整体表现挺不错的', '今天这一讲完成得比较顺', '这节课跟得比较稳', '今天大部分内容都能跟上'],
  steady: ['今天整体完成情况比较稳定', '这节课整体跟得还可以', '今天课堂节奏基本能跟上'],
  weak: ['今天这一块掌握得还不够扎实', '目前理解还不够稳定', '这部分知识点需要再重新梳理'],
  independent: ['大部分题目都能够独立完成', '基础题掌握得比较扎实', '今天做题思路整体比较清楚'],
  hint: ['有几道题提醒一下之后就能反应过来', '提示后能够继续完成，说明知识点基本会，只是还不够熟练'],
};
const REASON_META = {
  审题: ['有时题目条件看得不够完整', '做题前先圈出关键词和限定条件'], 概念: ['个别概念还需要再区分一下', '课后结合例题把概念重新梳理一遍'], 公式: ['公式使用还需要再熟练一些', '先写原式，再代入对应数据'], 计算: ['思路是对的，但计算过程不够细', '把中间过程写清楚，最后再核对一次'], 单位: ['单位有时容易漏或没有统一', '数值、单位和物理量要一起检查'], 步骤: ['思路有，但过程写得太跳', '关键计算尽量分步写'], 作图: ['作图还不够规范', '按“作用点、方向、箭头、标注”逐项检查'], 实验表述: ['实验题表述还不够完整', '按“条件＋现象＋结论”的结构表达'], 漏答: ['个别小问没有全部答完整', '完成后逐问核对，避免漏题漏小问'], 不会: ['目前有些题还找不到入手点', '先写已知条件和可能用到的公式'], 时间不足: ['后面还要注意做题节奏', '先做确定会的题，再处理难题'], 其他: ['个别地方还需要再巩固一下', '课后把今天的问题题再独立做一次'],
  读不懂题目: ['主要卡在题意理解上，题目读完后还没有完全抓住在问什么', '先找“已知什么、求什么、限制条件是什么”'], 题意理解偏差: ['个别题目理解方向有偏差，导致后面的思路走错', '先用自己的话说清楚题目到底在问什么'], 关键词没抓住: ['题目中的关键词没有及时抓住', '圈出“始终、至少、可能、不变、最大、最小”等限定词'], 条件漏看: ['有时会漏掉题目中的关键条件', '做完后检查是否有某个条件完全没有使用'], 条件关系没理清: ['条件之间的关系还没有完全理顺', '分句标出每个条件，再整理它们的关系'], 图文信息对应不上: ['图和文字条件之间还不能很好对应', '图文题先把图中的量和文字条件逐一对应'], 不知道题目在问什么: ['题目读完后还不能准确判断考查点', '先看问题，再回头找相关条件'], 题目读完没有形成思路: ['读完题以后暂时还找不到入手点', '读完题后先确认考查的知识点'], 长题干容易乱: ['遇到较长题干时，信息容易混在一起', '长题干可以分句读，每读一句标一个关键信息'], 信息提取不完整: ['题目中的有效信息提取还不够完整', '先列已知、所求和限制条件'],
  选择题判断错误: ['这道选择题主要是选项判断不够完整', '每个选项都要单独判断'], 只看一个选项就作答: ['做选择题时有些着急，没有把所有选项看完', '必须把所有选项看完后再作答'], 没有逐项验证: ['选项没有逐个验证，容易被看起来正确的表述干扰', '每个选项都要单独验证'], 选项比较不完整: ['选项之间比较还不够完整', '逐项比较条件、单位和结论'], 多选题漏选: ['多选题判断基本正确，但有符合条件的选项漏掉了', '多选题完成后再次核对是否漏选'], 多选题错选: ['多选题中有选项判断不准确', '多选题要逐项写出保留或排除依据'], 不确定时随意猜: ['不确定时容易凭感觉作答', '优先使用排除法，排除依据要明确'], 排除法使用不当: ['排除法依据还不够准确', '排除前先看清每个选项对应条件'], 题干要求看反: ['题干要求容易看反', '先看清题目要求选“正确”还是“错误”'], '选择正确项 / 错误项看反': ['把选择正确项和错误项看反了', '下笔前先圈出“正确的是”或“错误的是”'], 绝对化词语没注意: ['选项中的绝对化词语没有仔细判断', '对“一定、可能、任何、始终、只要”等词语重点判断'], 图像选项判断错误: ['图像选项中的变化关系还没有看准确', '图像选项先看横轴、纵轴、单位和变化趋势'], 计算选项代入错误: ['方法正确，但代入选项数据时出了小问题', '计算类选项可以先估算数量级'],
  填空答案不完整: ['知道大致意思，但填空答案没有写完整', '写完后重新读一遍完整句子'], 一空多答漏写: ['一空需要填写多个内容，作答时漏掉了一项', '看清一空是填一个内容还是多个内容'], 物理量漏写: ['数值有了，但没有说明对应的物理量', '数值、单位、物理量要一起检查'], 数值正确但单位遗漏: ['数值计算正确，但单位漏写', '填完后逐空核对单位'], 单位与数值不匹配: ['单位与数值没有对应好', '先统一单位再代入和填写'], 填空顺序写反: ['两个空对应的内容顺序写反了', '多空题填写后检查前后顺序是否对应'], 结论方向写反: ['大小关系或先后关系填写反了', '结论类填空要回看谁大、谁小、谁先、谁后'], 关键词缺失: ['答案意思接近，但缺少得分所需的关键词', '专业术语要写准确'], 物理术语填写错误: ['物理术语填写还不够准确', '常用物理名词单独整理成易错词表'], 符号填写错误: ['个别物理符号填写错误', '写完后检查字母、下标和符号'], 公式填写不完整: ['公式填写不够完整', '公式要写全字母和必要条件'], 多空题漏空: ['多空题中有一处没有填写', '填完后逐空核对，确认没有漏空'], 答案超过题目要求: ['答案超出了题目要求的范围', '按题目指定形式和数量填写'], 没按指定形式填写: ['题目要求的填写形式没有完全符合', '严格按“序号、符号、名称或数值”的要求填写'],
  错别字: ['个别物理术语中出现了错别字', '常用物理名词可以整理成易错词表'], 物理名词写错: ['物理名词的书写还不够准确', '写完后重点检查专业术语'], 符号写错: ['个别物理符号写错，影响答案规范性', '重点检查字母、下标和符号'], 公式字母写错: ['公式中的字母有时会写混', '公式字母要和物理量一一对应'], 下标写错: ['下标容易漏写或写错', '写完后检查字母和下标'], 正负号写错: ['正负号处理时容易出小错误', '计算过程中单独核对正负号'], 数字抄错: ['有一题思路没问题，主要是数字抄错了', '代入前和题目数据核对一次'], 条件抄错: ['题目条件抄写时出现了错误', '抄条件后回看原题核对'], 答案写反: ['结论方向写反，最后需要再核对', '落笔前回看题目问法'], 表述不完整: ['知道意思，但答案写得不够完整', '用“条件＋现象＋结论”的完整结构'], 语言不规范: ['表达意思基本正确，但物理语言还不够规范', '尽量使用标准物理术语'], 口头会但写不完整: ['口头能说出来，写到卷面上容易漏关键点', '口头说完后再练习完整写到纸面上'], 字迹潦草: ['今天书写稍微有些潦草，影响检查', '计算过程分行写，减少涂改'], 卷面不整洁: ['卷面还可以再整理得清楚一些', '一道题使用固定区域，不同题分隔清楚'],
  抄错数字: ['原题数据抄错了', '代入前要再和题目核对一次'], 代错数据: ['公式和思路正确，但代入数据时出了小问题', '先写清每个量对应的数值'], 公式变形错误: ['原公式会用，但变形还不够熟练', '先写原式，再逐步变形'], 中间过程跳步: ['中间步骤省略较多，容易出现失误', '关键计算尽量分步写'], 结果未化简: ['最后的结果没有按要求化简', '完成后再看一下答案形式'], 小数点错误: ['主要错在小数点位置', '算完后估算数量级是否合理'], 科学计数法错误: ['科学计数法的书写需要再规范', '注意有效数字和指数位置'], 比例关系错误: ['比例关系没有完全列对', '先明确谁和谁成正比或反比'], 未检查结果是否合理: ['算完后没有结合实际范围判断结果', '完成后检查结果是否合理'], 过程正确但答案写错: ['前面过程基本正确，最后答案书写出了问题', '落笔前再核对最终答案'],
  漏箭头: ['作图时箭头漏画', '作图完成后检查箭头和方向'], 漏标注: ['作图标注不完整', '按“作用点、方向、箭头、标注”检查'], 方向画反: ['图中的方向画反了', '先判断物理方向再落笔'], 力的作用点错误: ['力的作用点找得不准确', '先确定受力物体和作用点'], 力臂垂足漏画: ['力臂垂足漏画，作图还不够规范', '按“支点—作用线—垂线”的顺序检查'], 垂足画错: ['垂足位置画错了', '从支点向力的作用线作垂线'], 多画垂足: ['同一条作用线画了多余垂足', '一条作用线只对应一条正确力臂'], 光线方向错误: ['光线方向判断错误', '检查箭头是否沿光的传播方向'], 虚线实线错误: ['虚线、实线使用不够规范', '辅助线和实际光线要区分清楚'], 电路连接错误: ['电路连接还不够准确', '沿电流路径完整检查一遍'], 电表位置错误: ['电表位置判断错误', '电流表串联，电压表并联'], 量程选择错误: ['电表量程选择不准确', '选择量程前先估计被测量大小'], 滑动变阻器接线错误: ['滑动变阻器接线错误', '重点检查是否“一上一下”接线'], 图画得过于随意: ['图画得过于随意，规范性还要加强', '辅助线、箭头和标注都要按规范画'],
  实验步骤顺序错误: ['实验步骤顺序还没有理清', '按“准备—操作—记录—分析”梳理步骤'], 控制变量不完整: ['控制变量不完整', '每次只改变一个因素，其他条件保持不变'], 实验目的不清楚: ['实验目的还不够清楚', '先明确实验要验证什么'], 现象与结论混淆: ['现象和结论容易混淆', '现象是看到的内容，结论是分析得到的内容'], 结论缺少条件: ['实验结论缺少适用条件', '结论前要写清适用条件'], 不会分析表格: ['表格数据分析还不熟练', '先找变化量，再比较相同条件的数据'], 不会分析图像: ['实验图像分析还不熟练', '先看横轴、纵轴、单位、起点和趋势'], 数据处理错误: ['实验数据处理出现错误', '计算平均值或比例前先统一单位'], 实验器材作用不清楚: ['实验器材作用还不清楚', '明确器材“测什么”或“起什么作用”'], 操作注意事项遗漏: ['操作注意事项回答有遗漏', '结合误差、安全和实验条件回答'],
  不检查: ['做完后检查意识还不够', '每节课至少留最后两分钟按“条件、单位、符号、答案”检查'], 检查后能发现错误: ['检查后能发现错误，说明有自查能力', '后面要把检查变成主动习惯'], 容易漏题: ['做题时容易漏题', '开始前先数清题目数量，完成一题做一个标记'], 容易漏小问: ['小问容易漏掉', '完成一问做一个标记'], 只写答案不写过程: ['有时只写答案，过程不够完整', '计算题保留公式、代入和结果'], 依赖口算: ['复杂计算时比较依赖口算', '复杂计算尽量落笔，写出中间结果'], 草稿较乱: ['草稿较乱，影响回查', '一道题使用固定区域，不同题分隔清楚'], 做题顺序不合理: ['做题顺序还可以再调整', '先做确定会的，一题卡太久先跳过'], 遇到不会会空着: ['遇到不会的题容易直接空着', '先写已知条件、公式或第一步'], 愿意订正: ['订正态度不错，愿意把问题改回来', '订正后再独立做一道同类题'], 订正较认真: ['订正比较认真', '订正时写清原来错在哪里'], 订正后能理解: ['订正以后能够说清楚问题所在', '隔一天再独立重做一遍'], 同类题仍会重复错: ['同类题还会重复出错', '订正后再做一道同类题，隔一天重做']
};
const TAG_SENTENCES = {
  主动回应: '今天课堂回应比较积极', 主动表达: '愿意主动说出自己的想法', 愿意参与讨论: '今天参与讨论的状态不错', 补充同学思路: '能够在同学回答后补充自己的理解', 被点名后能回应: '点到以后能够跟上', 需要点名提醒: '有时需要点一下才能重新进入状态', 有自己的想法: '能看出来他有自己的思路', 表达完整: '回答问题时思路比较完整', 回答简短: '思路有，但表达还可以再完整一些', 害羞慢热: '前面稍微慢热一些，后面状态逐渐起来', 注意力飘: '中间有一小段注意力不太集中', 有精神: '今天整体很有精神，进入课堂也比较快', 状态不错: '今天整体课堂状态不错，做题比较投入', 进入状态快: '今天进入状态比较快', 后半段状态下降: '前半段状态不错，后半段专注度有一点下降', 打瞌睡: '今天中间有一段明显犯困，注意力受到了一些影响', 明显犯困: '今天精神状态一般，有几次需要提醒才能重新跟上', 今天比较疲惫: '今天看起来有些疲惫，不过提醒后仍能继续完成', 注意力不集中: '中间有一小段注意力不太集中', 容易走神: '做题时偶尔会走神，思路容易被打断', 需要多次提醒: '今天有几次需要提醒后才能重新进入状态', 状态慢热: '前面稍微慢热一些，后面状态逐渐起来', 情绪低落: '今天情绪状态偏低一些，课堂中尽量保持了跟进', 做题有点急: '今天做题速度比较快，但有些细节因此没有看清', 做题比较稳: '今天做题节奏比较稳，过程也比较清楚', 节奏偏慢: '今天做题节奏稍慢，不过思路基本能够跟上', 节奏偏快: '今天整体反应较快，但要注意不要因为快而漏条件', 能坚持完成: '今天遇到任务基本能坚持完成', 容易放弃: '遇到稍难的题时容易停下来，需要再多坚持一下', 遇到难题愿意继续想: '今天遇到难题时愿意继续尝试，这一点很好'
};
const STATUS_TEXT = { hint: '提醒后能够反应过来', wrong: '需要订正', unfinished: '未完成或缺席' };
const REASON_GROUPS = [['审题', '条件漏看', '关键词没抓住', '题干要求看反', '选择正确项 / 错误项看反'], ['读不懂题目', '不知道题目在问什么', '题目读完没有形成思路'], ['数字抄错', '抄错数字', '条件抄错'], ['计算', '代错数据', '计算选项代入错误', '小数点错误'], ['填空答案不完整', '表述不完整', '口头会但写不完整'], ['作图', '力臂垂足漏画', '垂足画错', '多画垂足']];
function reasonMeta(reason) { const meta = REASON_META[reason] || REASON_META.其他; return { text: meta[0], advice: meta[1] }; }
function polishNote(note) {
  const text = note.trim().replace(/[。；;\s]+$/g, '');
  if (!text) return '';
  if (/^另外/.test(text)) return text;
  if (/今天|这道|有一题|第\s*\d+\s*题|力臂|垂足|单位|公式|计算|图|实验|选择|填空/.test(text)) return text;
  return `另外，${text}`;
}
function noteForQuestion(note, number) {
  if (!note) return '';
  const escaped = String(number).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = note.match(new RegExp(`第\\s*${escaped}\\s*题([^。；;\n]*)`));
  return match ? match[1].trim() : '';
}
function problemQuestions(lesson, record) {
  const note = record.note || '';
  return lesson.modules.flatMap(module => module.questions.map((title, index) => {
    const id = qid(module.id, index); const q = record.questions[id];
    if (!q || q.unassigned || record.moduleUnassigned[module.id] || !['hint', 'wrong', 'unfinished'].includes(q.status)) return null;
    const reasons = q.reasons || []; const matchedNote = noteForQuestion(note, index + 1);
    const reason = reasons[0] || (q.status === 'unfinished' ? '时间不足' : '其他');
    return { id, moduleName: module.name, number: index + 1, title, status: q.status, reasons, reason, matchedNote, group: REASON_GROUPS.findIndex(g => reasons.some(r => g.includes(r))), score: (matchedNote ? 80 : 0) + (reasons.length ? 40 : 0) + (q.status === 'wrong' ? 30 : q.status === 'hint' ? 15 : 0) };
  }).filter(Boolean)).sort((a, b) => b.score - a.score);
}
function representativeQuestions(lesson, record) {
  const picked = []; const usedGroups = new Set();
  problemQuestions(lesson, record).forEach(item => {
    const group = item.group >= 0 ? item.group : `r:${item.reason}`;
    if (picked.length >= 3 || usedGroups.has(group)) return;
    picked.push(item); usedGroups.add(group);
  });
  return picked;
}
function questionDetail(item) {
  const meta = reasonMeta(item.reason);
  const error = item.matchedNote || meta.text;
  return `${item.moduleName}·第${item.number}题：${STATUS_TEXT[item.status]}，${error}。${meta.advice}。`;
}
function summarizeQuestions(lesson, record) {
  const counts = { correct: 0, hint: 0, wrong: 0, unfinished: 0 };
  const reasons = new Set();
  lesson.modules.forEach(m => m.questions.forEach((_, i) => {
    const q = record.questions[qid(m.id, i)];
    if (!q || q.status === 'blank' || q.unassigned || record.moduleUnassigned[m.id]) return;
    counts[q.status] = (counts[q.status] || 0) + 1;
    (q.reasons || []).forEach(reason => reasons.add(reason));
  }));
  return { counts, reasons: dedupeFeedbackReasons([...reasons]) };
}
function feedbackAdvice(record, reps, reasons) {
  const tags = record.performance || [];
  const statusAdvice = {
    打瞌睡: '今晚尽量早点休息，先保证第二天的课堂状态', 明显犯困: '今天精神状态一般，回去先保证休息，不建议熬夜补题', 今天比较疲惫: '近期如果经常犯困，建议家长关注一下作息', 注意力不集中: '做题时每完成一小题就简单核对一次，帮助重新集中注意力', 容易走神: '后面可以提醒他把注意力重新放回题目条件和当前步骤', 后半段状态下降: '后续要注意保持整节课的专注，不要前紧后松', 做题有点急: '做题前先把题目条件圈出来，再开始下笔', 节奏偏快: '每道题完成后留几秒检查条件、单位和结论', 节奏偏慢: '先完成确定会做的题，再处理难题', 容易放弃: '遇到难题先写已知条件和可能用到的公式，不要直接空着'
  };
  const list = tags.map(t => statusAdvice[t]).filter(Boolean);
  reps.forEach(r => list.push(reasonMeta(r.reason).advice));
  reasons.forEach(r => list.push(reasonMeta(r).advice));
  return [...new Set(list)].slice(0, 2);
}
function hasProblemText(text) { return /(错|漏|急|慢|不够|需要|注意|提醒|问题|失误|不会|未完成|犯困|走神)/.test(text); }
function sentence(text) { const value = String(text || '').trim().replace(/[。；;\s]+$/g, ''); return value ? `${value}。` : ''; }
function currentFeedbackDraft(record) { return (record.feedbackDrafts || {})[record.feedbackMode] || ''; }
function draftBadge(record, mode) { return (record.feedbackDrafts || {})[mode] ? '<em>已有草稿</em>' : ''; }
function feedbackContext() {
  const { lesson, record, student } = current();
  const { counts, reasons } = summarizeQuestions(lesson, record);
  const attempted = counts.correct + counts.hint + counts.wrong + counts.unfinished;
  const good = counts.correct >= Math.max(1, counts.hint + counts.wrong);
  const weak = counts.wrong > counts.correct && attempted > 0;
  const opening = pick(weak ? PHRASES.weak : good ? PHRASES.good : PHRASES.steady, student?.id || 'student');
  const statusParts = (record.performance || []).map(tag => TAG_SENTENCES[tag]).filter(Boolean).slice(0, 2);
  const reps = representativeQuestions(lesson, record);
  const advice = feedbackAdvice(record, reps, reasons);
  const note = polishNote(record.note || '');
  return { lesson, record, student, counts, reasons, attempted, good, weak, opening, statusParts, reps, advice, note };
}
function naturalQuestionLine(item, includeAdvice = false) {
  const meta = reasonMeta(item.reason);
  const error = item.matchedNote || meta.text;
  const tail = item.status === 'hint' ? '，稍微点一下思路就能接上' : '';
  return `${item.moduleName}第${item.number}题主要是${error}${tail}${includeAdvice ? `，${meta.advice}` : ''}`;
}
function generateConciseFeedback(ctx) {
  const parts = [ctx.opening];
  if (ctx.statusParts[0]) parts.push(ctx.statusParts[0]);
  if (ctx.counts.hint > 0) parts.push('有几道题提醒后能够反应过来');
  if (ctx.note && hasProblemText(ctx.note)) parts.push(ctx.note);
  else if (ctx.reps[0]) parts.push(reasonMeta(ctx.reps[0].reason).text);
  else if (ctx.reasons[0]) parts.push(reasonMeta(ctx.reasons[0]).text);
  const advice = ctx.advice[0] || (ctx.attempted ? '后面做题再慢一点，把条件看完整就可以了' : '后面继续保持课堂跟进和及时反馈');
  parts.push(advice);
  let body = sentence([...new Set(parts.filter(Boolean))].slice(0, 4).join('，'));
  if (body.length > 90) body = sentence(body.slice(0, 87));
  return body;
}
function generateNaturalFeedback(ctx) {
  const first = [ctx.opening];
  if (ctx.counts.correct > 0 && ctx.good) first.push(pick(PHRASES.independent, 'ind'));
  if (ctx.counts.hint > 0) first.push('有些题提醒后能够反应过来');
  if (!ctx.attempted) first.push('今天记录不多，先从课堂状态看整体还能跟着走');
  if (ctx.statusParts[0]) first.push(ctx.statusParts[0]);
  if (ctx.note && !/第\s*\d+\s*题/.test(ctx.note)) first.push(ctx.note);
  const repLines = ctx.reps.slice(0, 3).map((item, index) => naturalQuestionLine(item, index === ctx.reps.length - 1));
  const second = [];
  if (repLines.length) second.push(`${repLines.join('；')}。`);
  if (ctx.advice.length) second.push(`后面${ctx.advice.join('，')}就可以了。`);
  return [sentence(first.join('，')), second.join('')].filter(Boolean).join('\n');
}
function generateProfessionalFeedback(ctx) {
  const sections = [];
  const classParts = [ctx.opening];
  if (ctx.statusParts.length) classParts.push(...ctx.statusParts);
  if (ctx.counts.correct > 0 && ctx.good) classParts.push('大部分题目能够独立完成');
  if (ctx.counts.hint > 0) classParts.push('个别题目稍微点一下思路就能接上');
  if (!ctx.attempted) classParts.push('今天题目记录不多，先以课堂状态和备注为主');
  if (ctx.note && !/第\s*\d+\s*题/.test(ctx.note)) classParts.push(ctx.note);
  sections.push(`课堂情况：\n${sentence(classParts.join('，'))}`);
  if (ctx.reps.length) {
    const items = ctx.reps.slice(0, 3).map(item => {
      const meta = reasonMeta(item.reason);
      const error = item.matchedNote || meta.text;
      return `- ${item.moduleName}·第${item.number}题：${STATUS_TEXT[item.status]}，${error}。`;
    });
    sections.push(`重点题目：\n${items.join('\n')}`);
  }
  if (ctx.advice.length) sections.push(`后续建议：\n${ctx.advice.slice(0, 2).join('；')}。`);
  return sections.join('\n\n');
}
function generateFeedback(mode = current().record.feedbackMode || DEFAULT_FEEDBACK_MODE) {
  const ctx = feedbackContext();
  if (!ctx.student) return '';
  const normalizedMode = normalizeFeedbackMode(mode);
  if (normalizedMode === 'concise') return generateConciseFeedback(ctx);
  if (normalizedMode === 'professional') return generateProfessionalFeedback(ctx);
  return generateNaturalFeedback(ctx);
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
  const feedbackMarked = Object.values(record.feedbackDrafts || {}).some(Boolean);
  document.querySelector('#app').innerHTML = `<div class="sticky-summary"><strong>${escapeHtml(klass?.name || '未选班级')}</strong><span>${escapeHtml(student?.name || '未选学生')}</span><span>${escapeHtml(lesson?.name || '未选讲次')}</span><span>${escapeHtml(module?.name || '未选模块')}</span><b>${prog.done}/${prog.total}</b></div><header class="hero"><div><p class="eyebrow">本地原型 · 自动保存</p><h1>物理课堂登记</h1></div><button class="manage-toggle" data-action="toggle-manager">${state.managerOpen ? '收起管理' : '管理'}</button></header>${state.managerOpen ? rosterManagerHtml(grade, klass) : ''}<section class="card selectors"><div class="current-student"><span>当前学生</span><strong>${escapeHtml(student?.name || '请先添加学生')}</strong><em>${studentLabel}</em></div>${selectHtml('年级', 'grade', state.gradeId, appData.roster.map(g => ({ value: g.id, label: g.name })))}${selectHtml('班级', 'class', state.classId, (grade?.classes || []).map(c => ({ value: c.id, label: c.name })))}${selectHtml('讲次', 'lesson', state.lessonId, appData.lessons.map(l => ({ value: l.id, label: l.name })))}${selectHtml('模块', 'module', state.moduleId, (lesson?.modules || []).map(m => ({ value: m.id, label: m.name })))}${selectHtml('快速跳转', 'student', state.studentIndex, (klass?.students || []).map((s, index) => ({ value: index, label: s.name })))}</section>${!student ? '<section class="card empty">请点击“管理”新增年级、班级和学生。</section>' : `<section class="card student-switch"><button data-action="prev-student">上一位</button><div><strong>${escapeHtml(student.name)}</strong><span>第 ${studentLabel} 位</span></div><button data-action="next-student">下一位</button></section><section class="card module-head"><button data-action="prev-module">上一个模块</button><div><h2>${escapeHtml(module.name)}</h2><p>${escapeHtml(lesson.name)}</p></div><button data-action="next-module">下一个模块</button><label class="switch"><input id="module-unassigned" type="checkbox" ${record.moduleUnassigned[module.id] ? 'checked' : ''}> 模块未布置</label></section><section class="question-list">${module.questions.map((question, index) => questionHtml(module, question, index, record)).join('')}</section><section class="card collapse"><button class="collapse-title" data-action="toggle-performance"><span>课堂表现 ${perfMarked ? '<em>已记录</em>' : ''}</span><b>${state.performanceOpen ? '收起' : '展开'}</b></button>${state.performanceOpen ? `<div class="selected-summary"><strong>已选：</strong>${selectedChips(record.performance || [], 'data-tag')}</div><div class="category-scroll hint-scroll">${PERFORMANCE_GROUPS.map(group => `<button data-perf-group="${group.key}" class="${state.activePerformanceGroup === group.key ? 'active' : ''}">${group.label}</button>`).join('')}</div>${state.activePerformanceGroup ? `<div class="tag-grid compact-grid">${(PERFORMANCE_GROUPS.find(g => g.key === state.activePerformanceGroup)?.items || []).map(tag => `<button data-tag="${tag}" class="${record.performance.includes(tag) ? 'active' : ''}">${tag}</button>`).join('')}</div>` : ''}<label class="note-label">自由备注<input id="note" value="${escapeHtml(record.note)}" placeholder="例如：力臂漏画垂足，公式写对但计算错。"></label>` : ''}</section><section class="card feedback collapse"><button class="collapse-title" data-action="toggle-feedback"><span>家长反馈 ${feedbackMarked ? '<em>已有草稿</em>' : ''}</span><b>${state.feedbackOpen ? '收起' : '展开'}</b></button>${state.feedbackOpen ? `<div class="feedback-toolbar"><div class="mode-switch">${FEEDBACK_MODES.map(item => `<button data-mode="${item.key}" class="${record.feedbackMode === item.key ? 'active' : ''}">${item.label}${draftBadge(record, item.key)}</button>`).join('')}</div><div class="feedback-actions"><button data-action="generate-feedback">重新生成</button><button data-action="copy-feedback">一键复制</button></div></div><textarea id="feedback-draft" rows="${(FEEDBACK_MODES.find(item => item.key === record.feedbackMode) || FEEDBACK_MODES[1]).rows}" placeholder="点击重新生成当前版本草稿，可继续手动编辑；系统不会自动发送。">${escapeHtml(currentFeedbackDraft(record))}</textarea><p id="copy-tip" class="copy-tip"></p>` : ''}</section><nav class="bottom-actions"><button data-action="prev-student">上一位</button><button data-action="next-student">下一位</button><button data-action="open-performance">课堂表现</button><button data-action="open-feedback-generate">生成反馈</button></nav>`}`;
  bindEvents();
}

function questionHtml(module, questionItem, index, record) {
  const id = qid(module.id, index);
  const question = record.questions[id] || { status: 'blank', reasons: [], unassigned: false };
  const disabled = record.moduleUnassigned[module.id] || question.unassigned;
  const reasons = question.reasons || [];
  const activeKey = (state.activeReasonCategories || {})[id] || '';
  const activeCategory = ERROR_REASON_CATEGORIES.find(c => c.key === activeKey);
  const detailReasons = activeCategory ? categoryReasons(activeCategory, reasons, questionItem, record, module.id) : [];
  const reasonsHtml = (question.status === 'hint' || question.status === 'wrong') && !disabled ? `<div class="reasons"><div class="selected-summary"><strong>已选：</strong>${selectedChips(reasons, 'data-reason-remove')}</div><button class="edit-reasons" data-reason-edit="${id}">修改错因</button><div class="category-scroll hint-scroll" aria-label="错因分类，横向滑动查看更多">${ERROR_REASON_CATEGORIES.map(category => `<button data-reason-category="${id}:${category.key}" class="${activeKey === category.key ? 'active' : ''}">${category.label}</button>`).join('')}</div>${activeCategory ? `<div class="reason-detail"><p>${activeCategory.label} · 可多选</p><div class="compact-grid">${detailReasons.map(reason => `<button data-reason="${id}:${reason}" class="${reasons.includes(reason) ? 'active' : ''}">${escapeHtml(reason)}</button>`).join('')}</div></div>` : ''}</div>` : '';
  return `<article class="card question ${disabled ? 'muted' : ''}"><div class="question-title"><h3>${index + 1}. ${escapeHtml(questionTitle(questionItem))}</h3><label><input data-unassigned="${id}" type="checkbox" ${question.unassigned ? 'checked' : ''}> 未布置</label></div><div class="status-grid">${STATUS_OPTIONS.map(opt => `<button data-status="${id}:${opt.key}" ${disabled ? 'disabled' : ''} class="${question.status === opt.key ? `picked ${opt.key}` : ''}"><b>${opt.label}</b><span>${opt.text}</span></button>`).join('')}<button class="clear-status" data-status="${id}:blank" ${disabled ? 'disabled' : ''}>清除</button></div>${reasonsHtml}</article>`;
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
  document.querySelectorAll('[data-status]').forEach(button => button.onclick = () => {
    const [id, status] = button.dataset.status.split(':');
    const q = current().record.questions[id] || {};
    const currentStatus = q.status || 'blank';
    const nextStatus = currentStatus === status ? 'blank' : status;
    let reasons = q.reasons || [];
    if (reasons.length && ['correct', 'unfinished', 'blank'].includes(nextStatus) && !window.confirm('是否同时清除已选错因？\n选择“取消”会仅恢复为空白/切换状态并保留错因。')) reasons = q.reasons || [];
    else if (['correct', 'unfinished', 'blank'].includes(nextStatus)) reasons = [];
    patchQuestion(id, { status: nextStatus, reasons });
  });
  document.querySelectorAll('[data-reason]').forEach(button => button.onclick = () => { const [id, reason] = button.dataset.reason.split(':'); const reasons = current().record.questions[id]?.reasons || []; const next = reasons.includes(reason) ? reasons.filter(item => item !== reason) : [...reasons, reason]; if (!reasons.includes(reason)) { rememberReason(reason); state.activeReasonCategories = { ...(state.activeReasonCategories || {}), [id]: '' }; } patchQuestion(id, { reasons: next }); });
  document.querySelectorAll('[data-reason-remove]').forEach(button => button.onclick = () => { const reason = button.dataset.reasonRemove; const article = button.closest('.question'); const id = article?.querySelector('[data-status]')?.dataset.status.split(':')[0]; const reasons = current().record.questions[id]?.reasons || []; patchQuestion(id, { reasons: reasons.filter(item => item !== reason) }); });
  document.querySelectorAll('[data-reason-category]').forEach(button => button.onclick = () => { const [id, key] = button.dataset.reasonCategory.split(':'); const active = (state.activeReasonCategories || {})[id]; state.activeReasonCategories = { ...(state.activeReasonCategories || {}), [id]: active === key ? '' : key }; persist(); render(); });
  document.querySelectorAll('[data-reason-edit]').forEach(button => button.onclick = () => { const id = button.dataset.reasonEdit; state.activeReasonCategories = { ...(state.activeReasonCategories || {}), [id]: (state.activeReasonCategories || {})[id] || 'common' }; persist(); render(); });
  document.querySelectorAll('[data-tag]').forEach(button => button.onclick = () => { const tag = button.dataset.tag; updateRecord(record => ({ ...record, performance: record.performance.includes(tag) ? record.performance.filter(item => item !== tag) : [...record.performance, tag] })); });
  document.querySelectorAll('[data-perf-group]').forEach(button => button.onclick = () => { state.activePerformanceGroup = state.activePerformanceGroup === button.dataset.perfGroup ? '' : button.dataset.perfGroup; persist(); render(); });
  document.querySelector('#note')?.addEventListener('input', e => updateRecord(record => ({ ...record, note: e.target.value }), false));
  document.querySelector('#feedback-draft')?.addEventListener('input', e => updateRecord(record => ({ ...record, feedbackDraft: e.target.value, feedbackDrafts: { ...(record.feedbackDrafts || {}), [record.feedbackMode]: e.target.value } }), false));
  document.querySelectorAll('[data-mode]').forEach(button => button.onclick = () => updateRecord(record => ({ ...record, feedbackMode: normalizeFeedbackMode(button.dataset.mode), feedbackDraft: (record.feedbackDrafts || {})[normalizeFeedbackMode(button.dataset.mode)] || '' })));
  document.querySelectorAll('[data-action]').forEach(button => button.onclick = () => handleAction(button.dataset.action));
}
function handleAction(action) {
  const grade = activeGrade(); const klass = activeClass();

  if (action === 'toggle-manager') { state.managerOpen = !state.managerOpen; persist(); render(); return; }
  if (action === 'toggle-performance') { state.performanceOpen = !state.performanceOpen; persist(); render(); return; }
  if (action === 'toggle-feedback') { state.feedbackOpen = !state.feedbackOpen; persist(); render(); return; }
  if (action === 'open-performance') { state.performanceOpen = true; persist(); render(); document.querySelector('.collapse-title[data-action="toggle-performance"]')?.scrollIntoView({ block: 'center' }); return; }
  if (action === 'open-feedback-generate') { state.feedbackOpen = true; updateRecord(record => ({ ...record, feedbackMode: normalizeFeedbackMode(record.feedbackMode), feedbackDraft: (record.feedbackDrafts || {})[normalizeFeedbackMode(record.feedbackMode)] || '' })); return; }
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
  if (action === 'generate-feedback') { updateRecord(record => { const mode = normalizeFeedbackMode(record.feedbackMode); const draft = generateFeedback(mode); return { ...record, feedbackMode: mode, feedbackDraft: draft, feedbackDrafts: { ...(record.feedbackDrafts || {}), [mode]: draft } }; }); return; }
  if (action === 'copy-feedback') { navigator.clipboard.writeText(document.querySelector('#feedback-draft').value); document.querySelector('#copy-tip').textContent = '已复制到剪贴板，不会自动发送。'; return; }
  saveRoster();
}

// --- Real classroom session model (v3 compatible layer) ---
const PRIMARY_TYPES = ['未分类', '选择题', '填空题', '计算题', '作图题', '实验题', '简答题', '综合题', '判断题', '其他'];
const TYPE_TAGS = ['单选','多选','填空','计算','作图','实验','图像分析','表格分析','读数','单位换算','概念辨析','信息提取','长题干','多步骤','开放表达','规范表述','电路连接','力学作图','光路作图','实验结论','控制变量','数据处理'];
const INCOMPLETE_STATUSES = ['尚未检查','本节未讲到','已布置但未完成','缺席未检查','本题未布置','下次继续'];
const EXPERIMENT_EFFECTS = ['效果很好','基本成功','现象不明显','操作时间过长','学生观察不到','器材故障','临时改为口头讲解','本节未做完','下节继续'];
const TEACHING_PACES = ['进度正好','内容偏多','内容偏少','前面讲得过慢','后面时间不够','练习时间不足','讲解时间不足','实验耗时超出预期','学生提问较多','需要拆成两节课','下次可以加快','下次需要放慢'];
const HANDOUT_ISSUES = ['题目太多','题目太少','难度跳跃太大','题目顺序不合理','某题表述不清','图片不清楚','留白不足','计算空间不足','实验步骤不完整','缺少易错提醒','缺少过渡题','重复题较多','需要补充例题','需要删减内容','需要调整版式'];
const NEXT_TASKS = ['继续未讲完内容','复测本节易错点','补做实验','更换实验器材','补充讲义','重讲知识点','检查订正','发补充资料','准备课后测','联系个别家长','个别学生单独检查'];
const HOMEWORK_TYPES = ['讲义题目','当前 session 题目','其他讲次题目','课后测','补充练习','错题订正','背诵或默写','实验观察任务','自定义作业'];
const HOMEWORK_STATUS = ['按时完成','补做完成','部分完成','未完成','未带','忘记带','漏做','请假未检查','作业未布置','选做未完成','暂未检查'];
const HOMEWORK_QUALITY = ['完成较好','正确率不错','有少量错误','错误较多','书写认真','书写一般','书写潦草','过程完整','过程不完整','疑似只写答案','订正认真','订正不完整','需要重新完成'];
const HOMEWORK_ISSUES = ['漏题','漏小问','空题较多','只写答案','计算过程不完整','单位遗漏','订正未完成','订正后仍不理解','错题没有标记','字迹潦草','卷面不整洁','完成时间过长','明显赶作业','疑似照抄','同类题重复错','基础题错误较多','难题有尝试','选做题完成较好'];
const CORRECTION_STATUS = ['无需订正','已要求订正','已完成订正','订正不完整','订正后已理解','订正后仍需讲解','下节课复查','已复查通过'];
const AUTO_BACKUP_KEY = 'physics-classroom-system:auto-backups';
const SESSION_MIGRATION = 'session-v1';
let undoSnapshot = null;

function normalizeQuestionItem(q) { return typeof q === 'object' ? { title: questionTitle(q), primaryType: q.primaryType || q.type || '未分类', typeTags: Array.isArray(q.typeTags) ? q.typeTags : [] } : { title: String(q || '未命名题目'), primaryType: '未分类', typeTags: [] }; }
function ensureQuestionObjects() { (appData.lessons || []).forEach(l => (l.modules || []).forEach(m => { m.questions = (m.questions || []).map(normalizeQuestionItem); })); }
function createAutoBackup(reason) { try { const list = JSON.parse(localStorage.getItem(AUTO_BACKUP_KEY) || '[]'); list.unshift({ id: uid('backup'), reason, createdAt: new Date().toISOString(), data: clone(appData) }); localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(list.slice(0, 3))); return true; } catch { alert('自动备份失败，已取消本次可能破坏数据的操作。'); return false; } }
function restoreLatestBackup() { const list = JSON.parse(localStorage.getItem(AUTO_BACKUP_KEY) || '[]'); if (!list.length) return alert('暂无自动备份。'); if (!confirm(`恢复最近备份？\n${list[0].reason} · ${list[0].createdAt}`)) return; appData = list[0].data; state = normalizeState(appData.ui || {}); persist(); render(); }
function sessionItemFromQuestion(lesson, module, question, index, sourceType = '讲义题目', sourceSessionId = '', continuationType = '') { const normalized = normalizeQuestionItem(question); return { sessionItemId: uid('si'), questionId: qid(module.id, index), lessonId: lesson.id, lessonName: lesson.name, moduleId: module.id, moduleName: module.name, questionIndex: index + 1, questionName: normalized.title, primaryType: normalized.primaryType || '未分类', typeTags: normalized.typeTags || [], sourceType, sessionOrder: 0, sourceSessionId, continuationType }; }
function emptyReview() { return { experimentUsed: false, experimentNames: '', equipmentUsed: '', equipmentMissing: '', equipmentIssues: '', equipmentNextTime: '', experimentEffect: '', teachingPace: '', handoutIssues: [], handoutLinks: '', nextLessonTasks: [], teacherReflection: '', reviewUpdatedAt: '' }; }
function emptySessionRecord() { return { questions: {}, performance: [], note: '', feedbackMode: DEFAULT_FEEDBACK_MODE, feedbackDrafts: {}, homeworkNotes: '' }; }
function createSession({ classId, sessionDate, sessionName, plannedContent = '', lessonObjectives = '', selectedQuestions = [] }) { const now = new Date().toISOString(); const s = { sessionId: uid('session'), classId, sessionDate, sessionName: sessionName || '新课堂', status: '进行中', createdAt: now, updatedAt: now, selectedQuestions: selectedQuestions.map((q, i) => ({ ...q, sessionOrder: i + 1 })), studentRecords: {}, plannedContent, lessonObjectives, actualContent: '', postClassReview: emptyReview(), homeworkAssigned: [], homeworkChecks: {}, feedbackDrafts: {} }; appData.sessions.unshift(s); return s; }
function ensureStudentRecord(session, studentId) { session.studentRecords[studentId] ||= emptySessionRecord(); return session.studentRecords[studentId]; }
function normalizeSessions() { appData.sessions ||= []; ensureQuestionObjects(); if (appData.migrations?.[SESSION_MIGRATION]) return; if (!createAutoBackup('旧数据迁移为历史兼容 session')) return; const oldRecords = appData.records || {}; Object.entries(oldRecords).forEach(([key, rec]) => { const [classId, lessonId, studentId] = key.split(':'); const lesson = appData.lessons.find(l => l.id === lessonId); if (!lesson || !classId || !studentId) return; const selected = lesson.modules.flatMap(m => (m.questions || []).map((q, i) => sessionItemFromQuestion(lesson, m, q, i, '历史兼容'))); const s = createSession({ classId, sessionDate: (rec.updatedAt || rec.createdAt || new Date().toISOString()).slice(0,10), sessionName: `历史兼容 session｜${lesson.name}`, selectedQuestions: selected }); s.status = '已结束'; s.studentRecords[studentId] = { questions: clone(rec.questions || {}), moduleUnassigned: clone(rec.moduleUnassigned || {}), performance: clone(rec.performance || []), note: rec.note || '', feedbackMode: normalizeFeedbackMode(rec.feedbackMode), feedbackDrafts: clone(rec.feedbackDrafts || (rec.feedbackDraft ? { [normalizeFeedbackMode(rec.feedbackMode)]: rec.feedbackDraft } : {})), homeworkNotes: '' }; }); appData.migrations = { ...(appData.migrations || {}), [SESSION_MIGRATION]: new Date().toISOString() }; persist(); }
normalizeSessions();
state.sessionId ||= appData.sessions.find(s => s.status === '进行中' && s.classId === state.classId)?.sessionId || appData.sessions[0]?.sessionId || '';

function currentSession() { return appData.sessions.find(s => s.sessionId === state.sessionId) || appData.sessions[0] || null; }
function sessionProgress(session) { const students = activeClass()?.students || []; let done = 0, total = 0, blank = 0, notReached = 0, cont = 0; students.forEach(st => { const rec = session.studentRecords[st.id] || {}; (session.selectedQuestions || []).forEach(item => { const q = rec.questions?.[item.sessionItemId]; if (q?.unassigned) return; total++; if (q?.incompleteStatus === '本节未讲到') notReached++; if (q?.continueNext || q?.incompleteStatus === '下次继续') cont++; if (q?.status && q.status !== 'blank') done++; else blank++; }); }); return { done, total, blank, notReached, cont }; }
function itemRecord(rec, item) { return { status: 'blank', reasons: [], unassigned: false, incompleteStatus: '', note: '', ...(rec.questions?.[item.sessionItemId] || {}) }; }
function suggestedReasonsFor(item, selected, rec) { const fake = { primaryType: item.primaryType, typeTags: item.typeTags, title: item.questionName }; return orderedReasons(ERROR_REASONS, selected || [], fake, rec || {}, item.moduleId).slice(0, item.primaryType === '综合题' ? 16 : 12); }
function addSelectionToSession(session, lessonIds) { const existing = new Set(session.selectedQuestions.map(i => i.questionId)); lessonIds.forEach(id => { const lesson = appData.lessons.find(l => l.id === id); lesson?.modules.forEach(m => m.questions.forEach((q, i) => { const item = sessionItemFromQuestion(lesson, m, q, i, '按讲次选择'); if (!existing.has(item.questionId)) { session.selectedQuestions.push({ ...item, sessionOrder: session.selectedQuestions.length + 1 }); existing.add(item.questionId); } })); }); session.updatedAt = new Date().toISOString(); }
function continuationItems(classId) { const sessions = appData.sessions.filter(s => s.classId === classId).sort((a,b) => String(b.sessionDate).localeCompare(String(a.sessionDate))); const last = sessions[0]; if (!last) return []; const students = (activeClass()?.students || []).map(s => s.id); return (last.selectedQuestions || []).filter(item => students.some(sid => { const q = last.studentRecords?.[sid]?.questions?.[item.sessionItemId]; return !q || !q.status || q.status === 'blank' || ['本节未讲到','下次继续','已布置但未完成','尚未检查'].includes(q.incompleteStatus) || q.continueNext; })).map(item => ({ ...item, sessionItemId: uid('si'), sourceType: '承接上节课', sourceSessionId: last.sessionId, continuationType: '继续上节课' })); }
function moduleItems(session, moduleId) { return session.selectedQuestions.filter(i => i.moduleId === moduleId); }
function applyModuleAllCorrect(session, studentId, moduleId, mode = 'blank') { const rec = ensureStudentRecord(session, studentId); undoSnapshot = clone(session); moduleItems(session, moduleId).forEach(item => { const q = itemRecord(rec, item); const protectedState = q.unassigned || ['本题未布置','本节未讲到','缺席未检查'].includes(q.incompleteStatus); if (protectedState) return; if (mode === 'overwrite' || !q.status || q.status === 'blank') rec.questions[item.sessionItemId] = { ...q, status: 'correct', reasons: mode === 'overwrite' ? [] : q.reasons }; }); session.updatedAt = new Date().toISOString(); persist(); render(); alert('已完成“本模块全对”，可撤销最近一次操作。'); }
function clearModule(session, studentId, moduleId) { if (!createAutoBackup('清空模块')) return; if (!confirm('确认清空当前学生当前模块的状态、错因和题目备注？')) return; const rec = ensureStudentRecord(session, studentId); undoSnapshot = clone(session); moduleItems(session, moduleId).forEach(item => { const q = itemRecord(rec, item); rec.questions[item.sessionItemId] = { ...q, status: 'blank', reasons: [], note: '' }; }); persist(); render(); }
function renderTagChecks(name, values, picked = []) { return `<div class="tag-grid compact-grid">${values.map(v => `<label class="check-chip"><input type="checkbox" name="${name}" value="${escapeHtml(v)}" ${picked.includes(v) ? 'checked' : ''}>${escapeHtml(v)}</label>`).join('')}</div>`; }

render = function() {
  const { grade, klass, student } = current(); const session = currentSession(); const rec = session && student ? ensureStudentRecord(session, student.id) : null; const prog = session ? sessionProgress(session) : {done:0,total:0,blank:0};
  document.querySelector('#app').innerHTML = `<div class="sticky-summary"><strong>${escapeHtml(klass?.name || '未选班级')}</strong><span>${escapeHtml(session?.sessionName || '未选课堂')}</span><span>${escapeHtml(session?.sessionDate || '')}</span><span>${escapeHtml(student?.name || '未选学生')}</span><b>${prog.done}/${prog.total}</b></div><header class="hero"><div><p class="eyebrow">真实课堂 session · localStorage 自动保存</p><h1>物理课堂登记</h1></div><button class="manage-toggle" data-action="toggle-manager">${state.managerOpen ? '收起管理' : '班级与学生管理'}</button></header><section class="card home-actions"><button data-action="continue-current">继续当前课堂</button><button data-action="new-session">新建课堂</button><button data-action="continue-last">继续上节课</button><button data-action="show-history">课堂历史</button><button data-action="restore-backup">恢复最近备份</button><button data-action="undo-last">撤销最近批量操作</button></section>${state.managerOpen ? rosterManagerHtml(grade, klass) : ''}<section class="card selectors">${selectHtml('年级', 'grade', state.gradeId, appData.roster.map(g => ({value:g.id,label:g.name})))}${selectHtml('班级','class',state.classId,(grade?.classes||[]).map(c=>({value:c.id,label:c.name})))}${selectHtml('课堂','session',session?.sessionId||'',(appData.sessions||[]).filter(s=>!state.classId||s.classId===state.classId).map(s=>({value:s.sessionId,label:`${s.sessionDate} ${s.sessionName}（${s.status}）`})))}${selectHtml('学生','student',state.studentIndex,(klass?.students||[]).map((s,i)=>({value:i,label:s.name})))}</section>${state.historyOpen ? historyHtml() : ''}${session && student ? sessionHtml(session, student, rec) : '<section class="card empty">请先新建课堂并添加学生。</section>'}`;
  bindEvents(); bindSessionEvents();
};
function sessionHtml(session, student, rec) { const grouped = [...new Set(session.selectedQuestions.map(i=>i.moduleId))]; const readOnly = session.status === '已结束' && !state.editHistory; return `<section class="card session-head"><div><h2>${escapeHtml(session.sessionName)}</h2><p>${escapeHtml(session.sessionDate)} · ${escapeHtml(session.status)} · 当前学生：${escapeHtml(student.name)}</p><p>${escapeHtml(session.plannedContent || '未填写本节计划')}｜目标：${escapeHtml(session.lessonObjectives || '未填写')}</p></div><div><button data-action="add-questions">课堂中途追加题目</button><button data-action="finish-session">结束课堂</button>${readOnly ? '<button data-action="edit-history">编辑历史记录</button>' : ''}</div></section><section class="question-list">${grouped.map(mid => moduleSessionHtml(session, student, rec, mid, readOnly)).join('')}</section>${reviewHtml(session)}${homeworkHtml(session)}<section class="card collapse"><button class="collapse-title" data-action="toggle-performance"><span>课堂表现</span><b>${state.performanceOpen?'收起':'展开'}</b></button>${state.performanceOpen ? `<div class="selected-summary"><strong>已选：</strong>${selectedChips(rec.performance||[], 'data-tag')}</div><div class="tag-grid compact-grid">${PERFORMANCE_TAGS.slice(0,18).map(t=>`<button data-tag="${t}" class="${(rec.performance||[]).includes(t)?'active':''}">${t}</button>`).join('')}</div><label class="note-label">自由备注<input id="note" value="${escapeHtml(rec.note||'')}"></label>`:''}</section><section class="card feedback"><button data-action="generate-feedback">生成家长反馈</button><label><input id="include-homework" type="checkbox" ${rec.includeHomework?'checked':''}> 加入作业情况（自然表达）</label><textarea id="feedback-draft" rows="6">${escapeHtml((rec.feedbackDrafts||{})[rec.feedbackMode||DEFAULT_FEEDBACK_MODE]||'')}</textarea></section><nav class="bottom-actions"><button data-action="prev-student">上一位</button><button data-action="next-student">下一位</button><button data-action="finish-session">结束课堂</button></nav>`; }
function moduleSessionHtml(session, student, rec, moduleId, readOnly) { const items = moduleItems(session,moduleId); const moduleName = items[0]?.moduleName || '模块'; const hasRecords = items.some(i => { const q=itemRecord(rec,i); return q.status && q.status !== 'blank'; }); return `<section class="card module-head"><div><h2>${escapeHtml(moduleName)}</h2><p>来源：${escapeHtml(items[0]?.lessonName || '')}</p></div><button data-module-all="${moduleId}" ${readOnly?'disabled':''}>本模块全对</button><button data-module-clear="${moduleId}" ${readOnly?'disabled':''}>清空本模块</button></section>${items.map((item,idx)=>sessionQuestionHtml(item, rec, idx, readOnly)).join('')}`; }
function sessionQuestionHtml(item, rec, idx, readOnly) { const q = itemRecord(rec,item); const disabled = readOnly || q.unassigned || ['本题未布置','本节未讲到','缺席未检查'].includes(q.incompleteStatus); const reasons = q.reasons || []; const suggested = suggestedReasonsFor(item,reasons,rec); return `<article class="card question"><div class="question-title"><h3>${item.sessionOrder}. ${escapeHtml(item.questionName)}</h3><label><input data-session-unassigned="${item.sessionItemId}" type="checkbox" ${q.unassigned?'checked':''} ${readOnly?'disabled':''}> 本题未布置</label></div><p class="source-line">来源：${escapeHtml(item.lessonName)}｜${escapeHtml(item.moduleName)}｜原第${item.questionIndex}题 ${item.sourceType==='承接上节课'?'｜来源：承接上节课':''}</p><p class="type-line">${escapeHtml(item.primaryType || '未分类')} ${((item.typeTags||[]).map(t=>`<em>${escapeHtml(t)}</em>`).join(''))}</p><div class="status-grid">${STATUS_OPTIONS.map(o=>`<button data-session-status="${item.sessionItemId}:${o.key}" ${disabled?'disabled':''} class="${q.status===o.key?`picked ${o.key}`:''}"><b>${o.label}</b><span>${o.text}</span></button>`).join('')}<button data-session-status="${item.sessionItemId}:blank" ${disabled?'disabled':''}>清除</button></div><div class="inline-form"><select data-incomplete="${item.sessionItemId}" ${readOnly?'disabled':''}><option value="">未完成状态...</option>${INCOMPLETE_STATUSES.map(s=>`<option ${q.incompleteStatus===s?'selected':''}>${s}</option>`).join('')}</select><label><input data-continue-next="${item.sessionItemId}" type="checkbox" ${q.continueNext?'checked':''} ${readOnly?'disabled':''}> 加入下节待续</label></div>${['hint','wrong'].includes(q.status) && !disabled ? `<details><summary>错因推荐（按题型排序）</summary><div class="compact-grid">${suggested.map(r=>`<button data-session-reason="${item.sessionItemId}:${r}" class="${reasons.includes(r)?'active':''}">${escapeHtml(r)}</button>`).join('')}</div></details>`:''}<input class="question-note" data-question-note="${item.sessionItemId}" value="${escapeHtml(q.note||'')}" placeholder="题目备注" ${readOnly?'disabled':''}></article>`; }
function reviewHtml(session) { const r = session.postClassReview || emptyReview(); const hasLab = session.selectedQuestions.some(i => ['实验题','作图题'].includes(i.primaryType) || (i.typeTags||[]).includes('实验')); return `<section class="card review"><h2>课后复盘与实验器材</h2>${hasLab?'<p class="warn">本节包含实验或演示内容，是否记录器材和实验效果？（可跳过）</p>':''}<label><input id="experimentUsed" type="checkbox" ${r.experimentUsed?'checked':''}> 本节有实验或演示</label><input id="experimentNames" value="${escapeHtml(r.experimentNames||'')}" placeholder="实验或演示内容"><input id="equipmentUsed" value="${escapeHtml(r.equipmentUsed||'')}" placeholder="使用的实验器材"><input id="equipmentMissing" value="${escapeHtml(r.equipmentMissing||'')}" placeholder="缺少/故障器材"><select id="experimentEffect"><option value="">实验效果</option>${EXPERIMENT_EFFECTS.map(x=>`<option ${r.experimentEffect===x?'selected':''}>${x}</option>`).join('')}</select><details><summary>更多复盘</summary><select id="teachingPace"><option value="">课堂节奏</option>${TEACHING_PACES.map(x=>`<option ${r.teachingPace===x?'selected':''}>${x}</option>`).join('')}</select><p>讲义问题</p>${renderTagChecks('handoutIssues', HANDOUT_ISSUES, r.handoutIssues||[])}<input id="handoutLinks" value="${escapeHtml(r.handoutLinks||'')}" placeholder="关联讲次/模块/题号"><p>下节待办</p>${renderTagChecks('nextLessonTasks', NEXT_TASKS, r.nextLessonTasks||[])}<textarea id="teacherReflection" placeholder="教师自由复盘">${escapeHtml(r.teacherReflection||'')}</textarea></details></section>`; }
function homeworkHtml(session) { return `<section class="card homework"><h2>作业布置、完成情况和订正</h2><div class="inline-form"><input id="hw-title" placeholder="作业标题"><select id="hw-type">${HOMEWORK_TYPES.map(t=>`<option>${t}</option>`).join('')}</select><input id="hw-due" type="date"><button data-action="add-homework">新增作业</button><button data-action="class-hw-done">全班按时完成</button><button data-action="class-hw-pending">全班暂未检查</button></div>${(session.homeworkAssigned||[]).map(hw=>`<details class="hw-item"><summary>${escapeHtml(hw.title)} · ${escapeHtml(hw.sourceType)} · ${hw.required?'必做':'选做'}</summary><p>${escapeHtml(hw.description||'')}</p>${(activeClass()?.students||[]).map(st=>studentHomeworkHtml(session,hw,st)).join('')}</details>`).join('') || '<p class="empty-summary">暂无作业。</p>'}</section>`; }
function studentHomeworkHtml(session, hw, st) { const hc = session.homeworkChecks?.[st.id]?.[hw.homeworkItemId] || {}; return `<div class="homework-row"><strong>${escapeHtml(st.name)}</strong><select data-hw-status="${st.id}:${hw.homeworkItemId}">${HOMEWORK_STATUS.map(s=>`<option ${hc.completionStatus===s?'selected':''}>${s}</option>`).join('')}</select><select data-correction="${st.id}:${hw.homeworkItemId}"><option value="">订正状态</option>${CORRECTION_STATUS.map(s=>`<option ${hc.correctionStatus===s?'selected':''}>${s}</option>`).join('')}</select><input data-correction-note="${st.id}:${hw.homeworkItemId}" value="${escapeHtml(hc.correctionNote||'')}" placeholder="订正/复查备注"></div>`; }
function historyHtml() { return `<section class="card history"><h2>课堂历史</h2>${(appData.sessions||[]).map(s=>{ const lessons=[...new Set(s.selectedQuestions.map(i=>i.lessonName))].join('、'); return `<button class="history-row" data-open-session="${s.sessionId}"><span>${escapeHtml(s.sessionDate)}</span><strong>${escapeHtml(s.sessionName)}</strong><span>${escapeHtml(activeClass()?.name || s.classId)}</span><span>${escapeHtml(lessons)}</span><span>${s.selectedQuestions.length}题</span><span>${s.status}</span><span>${s.postClassReview?.reviewUpdatedAt?'有复盘':'无复盘'}</span><span>${s.homeworkAssigned?.length?'有作业':'无作业'}</span></button>`}).join('')}</section>`; }

function bindSessionEvents() { const session = currentSession(); const { student } = current(); if (!session) return; document.querySelector('#session')?.addEventListener('change', e=>{state.sessionId=e.target.value; persist(); render();}); document.querySelectorAll('[data-session-status]').forEach(b=>b.onclick=()=>{ const [id,status]=b.dataset.sessionStatus.split(':'); const rec=ensureStudentRecord(session,student.id); const q=rec.questions[id]||{status:'blank',reasons:[]}; rec.questions[id]={...q,status:q.status===status?'blank':status,reasons:['correct','unfinished','blank'].includes(status)?[]:(q.reasons||[])}; persist(); render(); }); document.querySelectorAll('[data-session-reason]').forEach(b=>b.onclick=()=>{ const [id,reason]=b.dataset.sessionReason.split(':'); const rec=ensureStudentRecord(session,student.id); const q=rec.questions[id]||{status:'wrong',reasons:[]}; q.reasons=q.reasons.includes(reason)?q.reasons.filter(r=>r!==reason):[...q.reasons,reason]; rec.questions[id]=q; persist(); render(); }); document.querySelectorAll('[data-session-unassigned]').forEach(i=>i.onchange=()=>{ const rec=ensureStudentRecord(session,student.id); const q=rec.questions[i.dataset.sessionUnassigned]||{}; rec.questions[i.dataset.sessionUnassigned]={...q,unassigned:i.checked,incompleteStatus:i.checked?'本题未布置':(q.incompleteStatus||'')}; persist(); render(); }); document.querySelectorAll('[data-incomplete]').forEach(i=>i.onchange=()=>{ const rec=ensureStudentRecord(session,student.id); const q=rec.questions[i.dataset.incomplete]||{}; rec.questions[i.dataset.incomplete]={...q,incompleteStatus:i.value}; persist(); }); document.querySelectorAll('[data-continue-next]').forEach(i=>i.onchange=()=>{ const rec=ensureStudentRecord(session,student.id); const q=rec.questions[i.dataset.continueNext]||{}; rec.questions[i.dataset.continueNext]={...q,continueNext:i.checked,incompleteStatus:i.checked?'下次继续':(q.incompleteStatus||'')}; persist(); }); document.querySelectorAll('[data-question-note]').forEach(i=>i.oninput=()=>{ const rec=ensureStudentRecord(session,student.id); const q=rec.questions[i.dataset.questionNote]||{}; rec.questions[i.dataset.questionNote]={...q,note:i.value}; persist(); }); document.querySelectorAll('[data-module-all]').forEach(b=>b.onclick=()=>{ const rec=ensureStudentRecord(session,student.id); const has=moduleItems(session,b.dataset.moduleAll).some(item=>{const q=itemRecord(rec,item); return q.status && q.status!=='blank'}); if (has && confirm('模块中已有记录。确定要覆盖可登记题目吗？取消则仅填写空白题。')) { if (createAutoBackup('批量覆盖题目状态')) applyModuleAllCorrect(session,student.id,b.dataset.moduleAll,'overwrite'); } else applyModuleAllCorrect(session,student.id,b.dataset.moduleAll,'blank'); }); document.querySelectorAll('[data-module-clear]').forEach(b=>b.onclick=()=>clearModule(session,student.id,b.dataset.moduleClear)); document.querySelectorAll('[data-open-session]').forEach(b=>b.onclick=()=>{state.sessionId=b.dataset.openSession; state.historyOpen=false; persist(); render();}); ['experimentUsed','experimentNames','equipmentUsed','equipmentMissing','experimentEffect','teachingPace','handoutLinks','teacherReflection'].forEach(id=>document.querySelector('#'+id)?.addEventListener('input', saveReview)); document.querySelectorAll('input[name="handoutIssues"],input[name="nextLessonTasks"]').forEach(i=>i.onchange=saveReview); document.querySelectorAll('[data-hw-status]').forEach(s=>s.onchange=()=>patchHomework(s.dataset.hwStatus,{completionStatus:s.value})); document.querySelectorAll('[data-correction]').forEach(s=>s.onchange=()=>patchHomework(s.dataset.correction,{correctionStatus:s.value})); document.querySelectorAll('[data-correction-note]').forEach(i=>i.oninput=()=>patchHomework(i.dataset.correctionNote,{correctionNote:i.value})); }
function saveReview() { const s=currentSession(); const checked=n=>[...document.querySelectorAll(`input[name="${n}"]:checked`)].map(i=>i.value); s.postClassReview={...(s.postClassReview||emptyReview()), experimentUsed:document.querySelector('#experimentUsed')?.checked||false, experimentNames:document.querySelector('#experimentNames')?.value||'', equipmentUsed:document.querySelector('#equipmentUsed')?.value||'', equipmentMissing:document.querySelector('#equipmentMissing')?.value||'', experimentEffect:document.querySelector('#experimentEffect')?.value||'', teachingPace:document.querySelector('#teachingPace')?.value||'', handoutIssues:checked('handoutIssues'), handoutLinks:document.querySelector('#handoutLinks')?.value||'', nextLessonTasks:checked('nextLessonTasks'), teacherReflection:document.querySelector('#teacherReflection')?.value||'', reviewUpdatedAt:new Date().toISOString()}; persist(); }
function patchHomework(key, patch) { const [sid,hid]=key.split(':'); const s=currentSession(); s.homeworkChecks[sid] ||= {}; s.homeworkChecks[sid][hid] = { completionStatus:'暂未检查', qualityTags:[], issueTags:[], correctionStatus:'', correctionNote:'', recheckDate:'', linkedNextSessionId:'', ...(s.homeworkChecks[sid][hid]||{}), ...patch }; persist(); }
const oldHandleAction = handleAction;
handleAction = function(action) { const grade=activeGrade(), klass=activeClass(), session=currentSession(), student=current().student; if (action==='new-session') { const name=prompt('本次课堂名称（可自由填写）','新课堂'); if (!name) return; const lessonIds=prompt('按讲次选择：输入讲次序号，多个用逗号，如 1,2；留空可自定义后追加','1') || ''; const selected=[]; lessonIds.split(',').map(x=>Number(x.trim())-1).filter(i=>i>=0).forEach(i=>{ const l=appData.lessons[i]; l?.modules.forEach(m=>m.questions.forEach((q,idx)=>selected.push(sessionItemFromQuestion(l,m,q,idx,'按讲次选择')))); }); const s=createSession({classId:state.classId, sessionDate:new Date().toISOString().slice(0,10), sessionName:name, plannedContent:prompt('本节计划','')||'', lessonObjectives:prompt('本节目标','')||'', selectedQuestions:selected}); state.sessionId=s.sessionId; persist(); render(); return; } if (action==='continue-current') { const s=appData.sessions.find(x=>x.classId===state.classId&&x.status==='进行中'); if (s) state.sessionId=s.sessionId; persist(); render(); return; } if (action==='continue-last') { const items=continuationItems(state.classId); const s=createSession({classId:state.classId, sessionDate:new Date().toISOString().slice(0,10), sessionName:prompt('新课堂名称','继续上节课')||'继续上节课', selectedQuestions:items}); state.sessionId=s.sessionId; persist(); render(); return; } if (action==='show-history') { state.historyOpen=!state.historyOpen; persist(); render(); return; } if (action==='restore-backup') return restoreLatestBackup(); if (action==='add-questions' && session) { const idx=Number(prompt('追加哪个讲次？输入序号，例如 2','2'))-1; if (idx>=0) addSelectionToSession(session,[appData.lessons[idx]?.id]); persist(); render(); return; } if (action==='finish-session' && session) { const p=sessionProgress(session); alert(`结束课堂汇总：共选择 ${session.selectedQuestions.length} 题；已登记 ${p.done}；尚未登记 ${p.blank}；本节未讲到 ${p.notReached}；下次继续 ${p.cont}。如有空白，请手动选择“尚未检查/本节未讲到/下次继续/保持原状”。`); if (confirm('确认结束课堂？历史 session 默认只读。')) { session.status='已结束'; session.updatedAt=new Date().toISOString(); persist(); render(); } return; } if (action==='edit-history') { state.editHistory=true; persist(); render(); return; } if (action==='add-homework' && session) { const hw={homeworkItemId:uid('hw'), title:document.querySelector('#hw-title').value||'自定义作业', sourceType:document.querySelector('#hw-type').value, lessonId:'', moduleId:'', questionIds:[], description:'', dueDate:document.querySelector('#hw-due').value||'', required:true, estimatedMinutes:'', createdFromSessionId:session.sessionId, createdAt:new Date().toISOString()}; session.homeworkAssigned.push(hw); persist(); render(); return; } if (action==='class-hw-done'||action==='class-hw-pending') { if (!createAutoBackup('批量覆盖作业状态')) return; const status=action==='class-hw-done'?'按时完成':'暂未检查'; session.homeworkAssigned.forEach(hw=>(klass?.students||[]).forEach(st=>patchHomework(`${st.id}:${hw.homeworkItemId}`,{completionStatus:status}))); render(); return; } if (action==='generate-feedback' && session && student) { const rec=ensureStudentRecord(session,student.id); const ctx=feedbackContext(); let draft=generateNaturalFeedback(ctx); if (rec.includeHomework || document.querySelector('#include-homework')?.checked) draft += '\n' + homeworkSentence(session,student.id); rec.feedbackDrafts[rec.feedbackMode||DEFAULT_FEEDBACK_MODE]=draft; persist(); render(); return; } if (action==='toggle-performance') { state.performanceOpen=!state.performanceOpen; persist(); render(); return; } return oldHandleAction(action); };
function homeworkSentence(session, studentId) { const checks=Object.values(session.homeworkChecks?.[studentId]||{}); if (!checks.length) return '本次作业情况暂未检查。'; const c=checks[0]; const map={按时完成:'今天作业按时完成了，整体习惯比较稳定。',部分完成:'作业目前只完成了一部分，剩余内容需要补上。',请假未检查:'本次作业因请假暂未检查，后面会再看一下。',未完成:'这次作业还没有完成，需要课后补上。'}; return map[c.completionStatus] || '这次作业完成情况已记录，后续会结合订正再跟进。'; }

render();

const oldRosterManagerHtml = rosterManagerHtml;
rosterManagerHtml = function(grade, klass) {
  const lesson = appData.lessons.find(l => l.id === state.lessonId) || appData.lessons[0];
  const module = lesson?.modules.find(m => m.id === state.moduleId) || lesson?.modules[0];
  const editor = `<section class="card"><h2>讲次、模块、题目与题型</h2>${selectHtml('讲次','lesson',lesson?.id||'',appData.lessons.map(l=>({value:l.id,label:l.name})))}${selectHtml('模块','module',module?.id||'',(lesson?.modules||[]).map(m=>({value:m.id,label:m.name})))}<div class="question-type-editor">${(module?.questions||[]).map((q,i)=>{ const nq=normalizeQuestionItem(q); return `<details><summary>原第${i+1}题：${escapeHtml(nq.title)} · ${escapeHtml(nq.primaryType)}</summary><input data-q-title="${i}" value="${escapeHtml(nq.title)}"><select data-q-primary="${i}">${PRIMARY_TYPES.map(t=>`<option ${nq.primaryType===t?'selected':''}>${t}</option>`).join('')}</select><details><summary>附加标签（手机端默认折叠）</summary>${renderTagChecks(`q-tags-${i}`, TYPE_TAGS, nq.typeTags)}</details></details>`}).join('')}</div><button data-action="save-question-types">保存题目题型</button></section>`;
  return oldRosterManagerHtml(grade, klass) + editor;
};
const newerHandleAction = handleAction;
handleAction = function(action) {
  if (action === 'import-json') { if (!createAutoBackup('导入 JSON')) return; try { const data = JSON.parse(document.querySelector('#json-box').value); appData = { ...defaultData(), ...data, roster: normalizeRoster(data.roster), records: data.records || {}, sessions: data.sessions || [] }; state = normalizeState(data.ui || {}); appData.migrations = data.migrations || {}; normalizeSessions(); persist(); render(); } catch { alert('JSON 格式不正确，未导入。'); } return; }
  if (action === 'save-question-types') { const lesson=appData.lessons.find(l=>l.id===state.lessonId); const module=lesson?.modules.find(m=>m.id===state.moduleId); if (module) { module.questions=module.questions.map((q,i)=>({ ...normalizeQuestionItem(q), title:document.querySelector(`[data-q-title="${i}"]`)?.value || questionTitle(q), primaryType:document.querySelector(`[data-q-primary="${i}"]`)?.value || '未分类', typeTags:[...document.querySelectorAll(`input[name="q-tags-${i}"]:checked`)].map(x=>x.value) })); persist(); render(); } return; }
  if (action === 'undo-last' && undoSnapshot) { const idx=appData.sessions.findIndex(s=>s.sessionId===undoSnapshot.sessionId); if (idx>=0) appData.sessions[idx]=undoSnapshot; undoSnapshot=null; persist(); render(); return; }
  return newerHandleAction(action);
};
render();

// --- Handout ownership classification (academic year / grade / period / course type) ---
const ACADEMIC_YEAR_DEFAULT = '未分类';
const GRADE_LEVELS = ['初二','初三','初一','中考复习','其他','未分类'];
const TEACHING_PERIODS = ['暑假','秋季','寒假','春季','中考复习','活动期','其他'];
const COURSE_TYPES = ['正课','复习课','专题课','活动课','补课','测试课','体验课','冲刺课','讲评课','其他'];
function defaultLessonClassification() { return { academicYear: ACADEMIC_YEAR_DEFAULT, gradeLevel: '未分类', teachingPeriod: '其他', courseType: '其他', subject: '物理', isActive: true, allowedYears: [], allowedGrades: [], allowedPeriods: [], allowedCourseTypes: [], crossYearAllowed: false, crossGradeAllowed: false, crossPeriodAllowed: false, crossCourseTypeAllowed: false }; }
function normalizeTeachingPeriod(value) { return value === '上学期' ? '秋季' : value === '下学期' ? '春季' : (TEACHING_PERIODS.includes(value) ? value : '其他'); }
function normalizeLessonClassification(lesson) { const base = defaultLessonClassification(); lesson.academicYear ||= base.academicYear; lesson.gradeLevel ||= base.gradeLevel; lesson.teachingPeriod = normalizeTeachingPeriod(lesson.teachingPeriod || lesson.term || base.teachingPeriod); lesson.courseType ||= base.courseType; lesson.subject ||= base.subject; if (lesson.isActive === undefined) lesson.isActive = true; lesson.allowedYears = Array.isArray(lesson.allowedYears) ? lesson.allowedYears : []; lesson.allowedGrades = Array.isArray(lesson.allowedGrades) ? lesson.allowedGrades : []; lesson.allowedPeriods = Array.isArray(lesson.allowedPeriods) ? lesson.allowedPeriods : []; lesson.allowedCourseTypes = Array.isArray(lesson.allowedCourseTypes) ? lesson.allowedCourseTypes : []; lesson.crossYearAllowed = Boolean(lesson.crossYearAllowed); lesson.crossGradeAllowed = Boolean(lesson.crossGradeAllowed); lesson.crossPeriodAllowed = Boolean(lesson.crossPeriodAllowed); lesson.crossCourseTypeAllowed = Boolean(lesson.crossCourseTypeAllowed); return lesson; }
function normalizeClassClassification(klass) { klass.academicYear ||= ACADEMIC_YEAR_DEFAULT; klass.gradeLevel ||= '未分类'; klass.teachingPeriod = normalizeTeachingPeriod(klass.teachingPeriod || klass.term || '其他'); klass.courseType ||= '其他'; return klass; }
function ensureContentClassification() { (appData.lessons || []).forEach(normalizeLessonClassification); (appData.roster || []).forEach(g => (g.classes || []).forEach(normalizeClassClassification)); (appData.sessions || []).forEach(s => (s.selectedQuestions || []).forEach(item => { const lesson = appData.lessons.find(l => l.id === item.lessonId); if (lesson) { const snap = classificationSnapshot(lesson); ['academicYear','gradeLevel','teachingPeriod','courseType'].forEach(k => { if (!item[k]) item[k] = snap[k]; }); } })); }
function classificationSnapshot(source) { return { academicYear: source.academicYear || ACADEMIC_YEAR_DEFAULT, gradeLevel: source.gradeLevel || '未分类', teachingPeriod: normalizeTeachingPeriod(source.teachingPeriod || '其他'), courseType: source.courseType || '其他' }; }
function classificationLabel(source) { const c = classificationSnapshot(source); const year = c.academicYear === '未分类' ? '未分类年份' : (/^\d{4}-\d{4}$/.test(c.academicYear) ? c.academicYear.replace('-', '—') + '学年' : c.academicYear + '年'); return `${year}｜${c.gradeLevel}｜${c.teachingPeriod}｜${c.courseType}`; }
function classMaterialContext() { return classificationSnapshot(activeClass() || {}); }
function lessonMatchesClass(lesson, klass = activeClass()) { normalizeLessonClassification(lesson); const cls = classificationSnapshot(klass || {}); if (lesson.isActive === false) return false; const checks = [
  ['academicYear', 'allowedYears', 'crossYearAllowed'], ['gradeLevel', 'allowedGrades', 'crossGradeAllowed'], ['teachingPeriod', 'allowedPeriods', 'crossPeriodAllowed'], ['courseType', 'allowedCourseTypes', 'crossCourseTypeAllowed']
];
  return checks.every(([field, allowed, cross]) => lesson[field] === cls[field] || lesson[allowed]?.includes(cls[field]) || lesson[cross]);
}
function mismatchTags(lesson, klass = activeClass()) { const cls = classificationSnapshot(klass || {}); const tags = []; if (lesson.academicYear !== cls.academicYear && !lesson.crossYearAllowed && !lesson.allowedYears?.includes(cls.academicYear)) tags.push('跨年份'); if (lesson.gradeLevel !== cls.gradeLevel && !lesson.crossGradeAllowed && !lesson.allowedGrades?.includes(cls.gradeLevel)) tags.push('跨年级'); if (lesson.teachingPeriod !== cls.teachingPeriod && !lesson.crossPeriodAllowed && !lesson.allowedPeriods?.includes(cls.teachingPeriod)) tags.push('跨周期'); if (lesson.courseType !== cls.courseType && !lesson.crossCourseTypeAllowed && !lesson.allowedCourseTypes?.includes(cls.courseType)) tags.push('跨课程类型'); return tags; }
function selectableLessons() { const filters = state.materialFilters || {}; return (appData.lessons || []).filter(l => { normalizeLessonClassification(l); if (!filters.showInactive && l.isActive === false) return false; const cls = classificationSnapshot(activeClass() || {}); if (!filters.showUnclassified && ![cls.academicYear, cls.gradeLevel].includes('未分类') && [l.academicYear, l.gradeLevel].includes('未分类')) return false; if (filters.onlyApplicable !== false && !state.showOtherMaterials) return lessonMatchesClass(l); return (!filters.academicYear || l.academicYear === filters.academicYear) && (!filters.gradeLevel || l.gradeLevel === filters.gradeLevel) && (!filters.teachingPeriod || l.teachingPeriod === filters.teachingPeriod) && (!filters.courseType || l.courseType === filters.courseType); }); }
function lessonPromptList() { const lessons = selectableLessons(); const other = state.showOtherMaterials ? '\n提示：当前正在为 ' + classificationLabel(activeClass() || {}) + ' 班选择内容，其他年份、年级或课程类型资料可能不适合本班，请确认后使用。' : ''; return { lessons, text: lessons.map((l, i) => `${i + 1}. ${classificationLabel(l)} · ${l.name}${mismatchTags(l).length ? '（' + mismatchTags(l).join('、') + '）' : ''}`).join('\n') + other }; }
function confirmCrossRange(lessons) { const mismatched = lessons.filter(l => mismatchTags(l).length); if (!mismatched.length) return true; return confirm(mismatched.map(l => `所选内容属于 ${classificationLabel(l)}，当前班级为 ${classificationLabel(activeClass() || {})}，标记：${mismatchTags(l).join('、')}。是否继续加入？`).join('\n\n')); }
ensureContentClassification();
persist();

sessionItemFromQuestion = function(lesson, module, question, index, sourceType = '讲义题目', sourceSessionId = '', continuationType = '') { const normalized = normalizeQuestionItem(question); return { sessionItemId: uid('si'), questionId: qid(module.id, index), lessonId: lesson.id, lessonName: lesson.name, moduleId: module.id, moduleName: module.name, questionIndex: index + 1, questionName: normalized.title, primaryType: normalized.primaryType || '未分类', typeTags: normalized.typeTags || [], sourceType, sessionOrder: 0, sourceSessionId, continuationType, ...classificationSnapshot(lesson), crossRangeTags: mismatchTags(lesson) }; };
addSelectionToSession = function(session, lessonIds) { const lessons = lessonIds.map(id => appData.lessons.find(l => l.id === id)).filter(Boolean); if (!confirmCrossRange(lessons)) return; const existing = new Set(session.selectedQuestions.map(i => i.questionId)); lessons.forEach(lesson => lesson.modules?.forEach(m => m.questions.forEach((q, i) => { const item = sessionItemFromQuestion(lesson, m, q, i, '按讲次选择'); if (!existing.has(item.questionId)) { session.selectedQuestions.push({ ...item, sessionOrder: session.selectedQuestions.length + 1 }); existing.add(item.questionId); } }))); session.updatedAt = new Date().toISOString(); };
const classifiedRosterManagerHtml = rosterManagerHtml;
rosterManagerHtml = function(grade, klass) {
  const lesson = normalizeLessonClassification(appData.lessons.find(l => l.id === state.lessonId) || appData.lessons[0]);
  const classBlock = klass ? `<section class="card"><h2>班级归属分类</h2><div class="manage-grid"><label>年份/学年<input id="class-academic-year" value="${escapeHtml(klass.academicYear || '未分类')}"></label>${selectHtml('年级','class-grade-level',klass.gradeLevel || '未分类',GRADE_LEVELS.map(x=>({value:x,label:x})))}${selectHtml('教学周期','class-teaching-period',klass.teachingPeriod || '其他',TEACHING_PERIODS.map(x=>({value:x,label:x})))}${selectHtml('课程类型','class-course-type',klass.courseType || '其他',COURSE_TYPES.map(x=>({value:x,label:x})))}</div><button data-action="save-class-classification">保存班级分类</button></section>` : '';
  const lessonBlock = lesson ? `<section class="card"><h2>讲义归属分类</h2><p>${escapeHtml(classificationLabel(lesson))} · ${escapeHtml(lesson.name)}</p><div class="manage-grid"><label>年份/学年<input id="lesson-academic-year" value="${escapeHtml(lesson.academicYear || '未分类')}"></label>${selectHtml('年级','lesson-grade-level',lesson.gradeLevel || '未分类',GRADE_LEVELS.map(x=>({value:x,label:x})))}${selectHtml('教学周期','lesson-teaching-period',lesson.teachingPeriod || '其他',TEACHING_PERIODS.map(x=>({value:x,label:x})))}${selectHtml('课程类型','lesson-course-type',lesson.courseType || '其他',COURSE_TYPES.map(x=>({value:x,label:x})))}<label>学科<input id="lesson-subject" value="${escapeHtml(lesson.subject || '物理')}"></label><label class="switch"><input id="lesson-is-active" type="checkbox" ${lesson.isActive !== false ? 'checked' : ''}> 启用</label></div><details><summary>兼容范围</summary><input id="allowed-years" value="${escapeHtml((lesson.allowedYears||[]).join('、'))}" placeholder="允许年份，如 2026、2026-2027"><input id="allowed-grades" value="${escapeHtml((lesson.allowedGrades||[]).join('、'))}" placeholder="允许年级"><input id="allowed-periods" value="${escapeHtml((lesson.allowedPeriods||[]).join('、'))}" placeholder="允许周期"><input id="allowed-course-types" value="${escapeHtml((lesson.allowedCourseTypes||[]).join('、'))}" placeholder="允许课程类型"><label><input id="cross-year" type="checkbox" ${lesson.crossYearAllowed?'checked':''}> 允许跨年份</label><label><input id="cross-grade" type="checkbox" ${lesson.crossGradeAllowed?'checked':''}> 允许跨年级</label><label><input id="cross-period" type="checkbox" ${lesson.crossPeriodAllowed?'checked':''}> 允许跨周期</label><label><input id="cross-course-type" type="checkbox" ${lesson.crossCourseTypeAllowed?'checked':''}> 允许跨课程类型</label></details><button data-action="save-lesson-classification">保存讲义分类</button><button data-action="bulk-fill-classification">批量补充分类</button></section>` : '';
  const filterBlock = `<section class="card material-filter"><h2>选题筛选</h2><label class="switch"><input id="show-other-materials" type="checkbox" ${state.showOtherMaterials?'checked':''}> 显示其他年份、年级或课程资料</label>${state.showOtherMaterials ? `<p class="warn">当前正在为 ${escapeHtml(classificationLabel(activeClass() || {}))} 班选择内容，其他资料可能不适合本班，请确认后使用。</p>` : ''}<details><summary>紧凑筛选</summary><div class="manage-grid"><input id="filter-year" placeholder="年份" value="${escapeHtml(state.materialFilters?.academicYear || '')}">${selectHtml('年级','filter-grade',state.materialFilters?.gradeLevel || '',[{value:'',label:'当前/全部'},...GRADE_LEVELS.map(x=>({value:x,label:x}))])}${selectHtml('教学周期','filter-period',state.materialFilters?.teachingPeriod || '',[{value:'',label:'当前/全部'},...TEACHING_PERIODS.map(x=>({value:x,label:x}))])}${selectHtml('课程类型','filter-course-type',state.materialFilters?.courseType || '',[{value:'',label:'当前/全部'},...COURSE_TYPES.map(x=>({value:x,label:x}))])}<label><input id="filter-applicable" type="checkbox" ${state.materialFilters?.onlyApplicable !== false ? 'checked' : ''}> 只看当前适用</label><label><input id="filter-unclassified" type="checkbox" ${state.materialFilters?.showUnclassified?'checked':''}> 显示未分类</label><label><input id="filter-inactive" type="checkbox" ${state.materialFilters?.showInactive?'checked':''}> 显示已停用</label></div><button data-action="save-material-filter">应用筛选</button></details></section>`;
  return classifiedRosterManagerHtml(grade, klass) + classBlock + lessonBlock + filterBlock;
};
const classifiedHandleAction = handleAction;
handleAction = function(action) {
  if (action === 'save-class-classification') { const klass = activeClass(); if (klass) { klass.academicYear = document.querySelector('#class-academic-year')?.value.trim() || '未分类'; klass.gradeLevel = document.querySelector('#class-grade-level')?.value || '未分类'; klass.teachingPeriod = document.querySelector('#class-teaching-period')?.value || '其他'; klass.courseType = document.querySelector('#class-course-type')?.value || '其他'; persist(); render(); } return; }
  if (action === 'save-lesson-classification') { const lesson = appData.lessons.find(l => l.id === state.lessonId); if (lesson) { lesson.academicYear = document.querySelector('#lesson-academic-year')?.value.trim() || '未分类'; lesson.gradeLevel = document.querySelector('#lesson-grade-level')?.value || '未分类'; lesson.teachingPeriod = document.querySelector('#lesson-teaching-period')?.value || '其他'; lesson.courseType = document.querySelector('#lesson-course-type')?.value || '其他'; lesson.subject = document.querySelector('#lesson-subject')?.value || '物理'; lesson.isActive = document.querySelector('#lesson-is-active')?.checked; const split = id => (document.querySelector(id)?.value || '').split(/[、,，\s]+/).map(x=>x.trim()).filter(Boolean); lesson.allowedYears = split('#allowed-years'); lesson.allowedGrades = split('#allowed-grades'); lesson.allowedPeriods = split('#allowed-periods'); lesson.allowedCourseTypes = split('#allowed-course-types'); lesson.crossYearAllowed = document.querySelector('#cross-year')?.checked || false; lesson.crossGradeAllowed = document.querySelector('#cross-grade')?.checked || false; lesson.crossPeriodAllowed = document.querySelector('#cross-period')?.checked || false; lesson.crossCourseTypeAllowed = document.querySelector('#cross-course-type')?.checked || false; persist(); render(); } return; }
  if (action === 'bulk-fill-classification') { const lesson = appData.lessons.find(l => l.id === state.lessonId); if (!lesson || !confirm('将当前讲义分类补充到仍未分类的讲义？不会覆盖已有分类。')) return; appData.lessons.forEach(l => { if ((l.academicYear || '未分类') === '未分类') l.academicYear = lesson.academicYear; if ((l.gradeLevel || '未分类') === '未分类') l.gradeLevel = lesson.gradeLevel; if ((l.teachingPeriod || '其他') === '其他') l.teachingPeriod = lesson.teachingPeriod; if ((l.courseType || '其他') === '其他') l.courseType = lesson.courseType; l.subject ||= lesson.subject || '物理'; }); persist(); render(); return; }
  if (action === 'save-material-filter') { state.showOtherMaterials = document.querySelector('#show-other-materials')?.checked || false; state.materialFilters = { academicYear: document.querySelector('#filter-year')?.value.trim() || '', gradeLevel: document.querySelector('#filter-grade')?.value || '', teachingPeriod: document.querySelector('#filter-period')?.value || '', courseType: document.querySelector('#filter-course-type')?.value || '', onlyApplicable: document.querySelector('#filter-applicable')?.checked !== false, showUnclassified: document.querySelector('#filter-unclassified')?.checked || false, showInactive: document.querySelector('#filter-inactive')?.checked || false }; persist(); render(); return; }
  if (action === 'new-session') { const name=prompt('本次课堂名称（可自由填写）','新课堂'); if (!name) return; const list = lessonPromptList(); const raw=prompt(`按讲次选择：输入以下序号，多个用逗号；默认只显示匹配当前班级的讲义。\n${list.text}`, list.lessons.length ? '1' : '') || ''; const lessons=raw.split(',').map(x=>list.lessons[Number(x.trim())-1]).filter(Boolean); if (!confirmCrossRange(lessons)) return; const selected=[]; lessons.forEach(l=>l.modules?.forEach(m=>m.questions.forEach((q,idx)=>selected.push(sessionItemFromQuestion(l,m,q,idx,'按讲次选择'))))); const s=createSession({classId:state.classId, sessionDate:new Date().toISOString().slice(0,10), sessionName:name, plannedContent:prompt('本节计划','')||'', lessonObjectives:prompt('本节目标','')||'', selectedQuestions:selected}); state.sessionId=s.sessionId; persist(); render(); return; }
  if (action === 'add-questions') { const s=currentSession(); if (!s) return; const list=lessonPromptList(); const raw=prompt(`追加哪个讲次？输入以下序号，多个用逗号。\n${list.text}`, list.lessons.length ? '1' : '') || ''; addSelectionToSession(s, raw.split(',').map(x=>list.lessons[Number(x.trim())-1]?.id).filter(Boolean)); persist(); render(); return; }
  if (action === 'add-homework') { const session=currentSession(); if (!session) return; const list=lessonPromptList(); const sourceType=document.querySelector('#hw-type')?.value || '自定义作业'; let lessonId='', moduleId='', questionIds=[]; if (['讲义题目','其他讲次题目'].includes(sourceType) && list.lessons.length) { const idx=Number(prompt(`选择作业来源讲义序号：\n${list.text}`, '1'))-1; const lesson=list.lessons[idx]; if (lesson && !confirmCrossRange([lesson])) return; lessonId=lesson?.id || ''; questionIds=lesson?.modules?.flatMap(m=>m.questions.map((_,i)=>qid(m.id,i))) || []; } const hw={homeworkItemId:uid('hw'), title:document.querySelector('#hw-title')?.value||'自定义作业', sourceType, lessonId, moduleId, questionIds, description:'', dueDate:document.querySelector('#hw-due')?.value||'', required:true, estimatedMinutes:'', createdFromSessionId:session.sessionId, createdAt:new Date().toISOString(), classification: lessonId ? classificationSnapshot(appData.lessons.find(l=>l.id===lessonId)||{}) : classificationSnapshot(activeClass()||{})}; session.homeworkAssigned.push(hw); persist(); render(); return; }
  return classifiedHandleAction(action);
};
render();

// --- Same-handout historical teaching reminders ---
function ensureHistoricalTipFields() { (appData.sessions || []).forEach(s => { s.preparationNotes ||= ''; s.referencedSessionIds ||= []; s.historicalTeachingTips ||= []; s.historicalTipsReadAt ||= ''; s.dismissedHistoricalTipIds ||= []; }); }
function classById(classId) { for (const g of appData.roster || []) { const klass = (g.classes || []).find(c => c.id === classId); if (klass) return klass; } return null; }
function compatibleClassifications(a, b) { if (!a || !b) return false; if ((a.gradeLevel || '未分类') !== (b.gradeLevel || '未分类')) return false; const samePeriod = (a.teachingPeriod || '其他') === (b.teachingPeriod || '其他') || a.crossPeriodAllowed || b.crossPeriodAllowed || (a.allowedPeriods || []).includes(b.teachingPeriod) || (b.allowedPeriods || []).includes(a.teachingPeriod); const sameCourse = (a.courseType || '其他') === (b.courseType || '其他') || a.crossCourseTypeAllowed || b.crossCourseTypeAllowed || (a.allowedCourseTypes || []).includes(b.courseType) || (b.allowedCourseTypes || []).includes(a.courseType); return samePeriod && sameCourse; }
function sameContentMatch(candidate, targetItems) { const targetLessons = new Set(targetItems.map(i => i.lessonId)); const targetModules = new Set(targetItems.map(i => i.moduleId)); const targetQuestions = new Set(targetItems.map(i => i.questionId)); let score = 0; for (const item of candidate.selectedQuestions || []) { if (targetQuestions.has(item.questionId)) score += 5; else if (targetModules.has(item.moduleId)) score += 3; else if (targetLessons.has(item.lessonId)) score += 1; } return score; }
function versionNoteFor(candidate, targetItems) { const versions = new Set(targetItems.map(i => i.contentVersion || i.sourceVersion || '').filter(Boolean)); const oldVersions = new Set((candidate.selectedQuestions || []).map(i => i.contentVersion || i.sourceVersion || '').filter(Boolean)); if (!versions.size || !oldVersions.size) return ''; for (const v of versions) if (oldVersions.has(v)) return ''; return '检测到旧版本教学记录，仅供参考。'; }
function summarizeHistoricalSession(candidate, targetItems) {
  const counts = {}; const reasonCounts = {}; const doneOrders = [];
  Object.values(candidate.studentRecords || {}).forEach(rec => Object.entries(rec.questions || {}).forEach(([sid, q]) => {
    const item = (candidate.selectedQuestions || []).find(i => i.sessionItemId === sid); if (!item) return;
    if (['wrong','hint','unfinished'].includes(q.status)) counts[item.questionName || item.questionId] = (counts[item.questionName || item.questionId] || 0) + 1;
    (q.reasons || []).forEach(r => reasonCounts[r] = (reasonCounts[r] || 0) + 1);
    if (q.status && q.status !== 'blank') doneOrders.push(item.sessionOrder || 0);
  }));
  const review = candidate.postClassReview || {}; const topQuestions = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([name,count])=>`${name}：${count} 次问题记录`); const topReasons = Object.entries(reasonCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,count])=>`${name}（${count}）`);
  const lastOrder = Math.max(0, ...doneOrders); const lastItem = (candidate.selectedQuestions || []).find(i => i.sessionOrder === lastOrder);
  const versionNote = versionNoteFor(candidate, targetItems);
  const compact = [versionNote, lastItem ? `上次实际完成到：${lastItem.moduleName} · 原第${lastItem.questionIndex}题` : candidate.actualContent ? `实际内容：${candidate.actualContent}` : '', topQuestions[0] ? `高频易错题：${topQuestions.join('；')}` : '', topReasons[0] ? `高频错因：${topReasons.join('、')}` : '', (review.equipmentIssues || review.equipmentNextTime) ? `器材提醒：${[review.equipmentIssues, review.equipmentNextTime].filter(Boolean).join('；')}` : '', review.teachingPace ? `节奏提醒：${review.teachingPace}` : '', (review.nextLessonTasks || []).length ? `下次建议：${review.nextLessonTasks.slice(0,3).join('、')}` : ''].filter(Boolean).slice(0,5);
  return { tipId: `tip-${candidate.sessionId}`, sourceSessionId: candidate.sessionId, classId: candidate.classId, className: classById(candidate.classId)?.name || '其他班级', sessionDate: candidate.sessionDate || '', sessionName: candidate.sessionName || '', lessons: [...new Set((candidate.selectedQuestions || []).map(i => i.lessonName).filter(Boolean))], modules: [...new Set((candidate.selectedQuestions || []).map(i => i.moduleName).filter(Boolean))], compact, details: { topQuestions, topReasons, actualContent: candidate.actualContent || '', handoutIssues: review.handoutIssues || [], equipmentIssues: [review.equipmentIssues, review.equipmentNextTime].filter(Boolean), teachingPace: review.teachingPace || '', nextLessonTasks: review.nextLessonTasks || [], teacherReflection: review.teacherReflection || '', versionNote } };
}
function findHistoricalTeachingTips(session) {
  if (!session?.selectedQuestions?.length) return [];
  const currentClass = classById(session.classId); const cls = classificationSnapshot(currentClass || {});
  return (appData.sessions || []).filter(s => s.sessionId !== session.sessionId && s.classId !== session.classId && s.status === '已结束').map(s => {
    const score = sameContentMatch(s, session.selectedQuestions || []); if (!score) return null;
    const firstItem = (s.selectedQuestions || [])[0] || {}; const sourceCls = { ...classificationSnapshot(firstItem), allowedPeriods: firstItem.allowedPeriods || [], allowedCourseTypes: firstItem.allowedCourseTypes || [] };
    if (!compatibleClassifications({ ...sourceCls, gradeLevel: firstItem.gradeLevel || sourceCls.gradeLevel }, cls)) return null;
    const yearBonus = (firstItem.academicYear || '') === (cls.academicYear || '') ? 10 : 0; const periodBonus = (firstItem.teachingPeriod || '') === (cls.teachingPeriod || '') ? 6 : 0; const courseBonus = (firstItem.courseType || '') === (cls.courseType || '') ? 4 : 0; const versionPenalty = versionNoteFor(s, session.selectedQuestions) ? -3 : 0;
    return { score: score + yearBonus + periodBonus + courseBonus + versionPenalty, tip: summarizeHistoricalSession(s, session.selectedQuestions) };
  }).filter(Boolean).sort((a,b)=> b.score - a.score || String(b.tip.sessionDate).localeCompare(String(a.tip.sessionDate))).slice(0,3).map(x=>x.tip);
}
function refreshHistoricalTeachingTips(session) { ensureHistoricalTipFields(); if (!session) return; const dismissed = new Set(session.dismissedHistoricalTipIds || []); const tips = findHistoricalTeachingTips(session).filter(t => !dismissed.has(t.tipId)); session.historicalTeachingTips = tips; session.referencedSessionIds = [...new Set([...(session.referencedSessionIds || []), ...tips.map(t => t.sourceSessionId)])]; }
function historicalTipsHtml(session) { ensureHistoricalTipFields(); const tips = (session.historicalTeachingTips || []).filter(t => !(session.dismissedHistoricalTipIds || []).includes(t.tipId)); if (!tips.length || session.historicalTipsReadAt) return session.preparationNotes ? `<section class="card prep-notes"><h2>本节备课备注</h2><p>${escapeHtml(session.preparationNotes)}</p></section>` : ''; const tip = tips[0]; return `<section class="card historical-tip"><button class="collapse-title" data-action="mark-historical-read"><span>这部分内容此前在其他班级已有教学记录，是否查看往期复盘？</span><b>标记已读</b></button><p><strong>${escapeHtml(tip.className)}</strong> · ${escapeHtml(tip.sessionDate)} · ${escapeHtml(tip.sessionName)}</p><ul>${tip.compact.slice(0,5).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul><details><summary>查看详情</summary><p>涉及讲次：${escapeHtml(tip.lessons.join('、') || '未记录')}</p><p>涉及模块：${escapeHtml(tip.modules.join('、') || '未记录')}</p><p>讲义问题：${escapeHtml((tip.details.handoutIssues || []).join('、') || '未记录')}</p><p>器材问题：${escapeHtml((tip.details.equipmentIssues || []).join('；') || '未记录')}</p><p>教学节奏：${escapeHtml(tip.details.teachingPace || '未记录')}</p><p>教师复盘：${escapeHtml(tip.details.teacherReflection || '未记录')}</p></details><div class="inline-form"><button data-action="add-tip-to-prep" data-tip-id="${tip.tipId}">加入本节备课备注</button><button data-action="copy-tip-to-review" data-tip-id="${tip.tipId}">复制到本节课后复盘</button><button data-action="dismiss-tip" data-tip-id="${tip.tipId}">本次不再提醒</button><button data-action="dismiss-tip" data-tip-id="${tip.tipId}">忽略此条</button></div></section>`; }
function tipText(tip) { return [`往期教学参考：${tip.className} ${tip.sessionDate} ${tip.sessionName}`, ...(tip.compact || [])].join('\n'); }
ensureHistoricalTipFields();
const historicalCreateSession = createSession;
createSession = function(args) { const s = historicalCreateSession(args); ensureHistoricalTipFields(); refreshHistoricalTeachingTips(s); return s; };
const historicalSessionHtml = sessionHtml;
sessionHtml = function(session, student, rec) { return historicalTipsHtml(session) + historicalSessionHtml(session, student, rec); };
const historicalAddSelectionToSession = addSelectionToSession;
addSelectionToSession = function(session, lessonIds) { historicalAddSelectionToSession(session, lessonIds); refreshHistoricalTeachingTips(session); };
const historicalHandleAction = handleAction;
handleAction = function(action) {
  const session = currentSession();
  if (action === 'mark-historical-read' && session) { session.historicalTipsReadAt = new Date().toISOString(); persist(); render(); return; }
  const tipId = document.activeElement?.dataset?.tipId || (typeof event !== 'undefined' ? event?.target?.dataset?.tipId : ''); const tip = (session?.historicalTeachingTips || []).find(t => t.tipId === tipId);
  if (action === 'dismiss-tip' && session && tipId) { session.dismissedHistoricalTipIds = [...new Set([...(session.dismissedHistoricalTipIds || []), tipId])]; persist(); render(); return; }
  if (action === 'add-tip-to-prep' && session && tip) { session.preparationNotes = [session.preparationNotes || '', tipText(tip)].filter(Boolean).join('\n\n'); session.historicalTipsReadAt = new Date().toISOString(); persist(); render(); return; }
  if (action === 'copy-tip-to-review' && session && tip) { session.postClassReview ||= emptyReview(); session.postClassReview.teacherReflection = [session.postClassReview.teacherReflection || '', tipText(tip)].filter(Boolean).join('\n\n'); session.postClassReview.reviewUpdatedAt = new Date().toISOString(); persist(); render(); return; }
  return historicalHandleAction(action);
};
render();

// --- Classroom registration / teacher workspace reorganization ---
const classroomNormalizeState = normalizeState;
normalizeState = function(candidate = {}) {
  const base = classroomNormalizeState(candidate);
  return { ...base,
    sessionId: candidate.sessionId || base.sessionId || '',
    currentView: candidate.currentView === 'teacher' ? 'teacher' : 'classroom',
    activeModuleId: candidate.activeModuleId || '',
    expandedModuleIds: Array.isArray(candidate.expandedModuleIds) ? candidate.expandedModuleIds : [],
    activeTeacherPanel: candidate.activeTeacherPanel || 'feedback',
    activeFeedbackMode: normalizeFeedbackMode(candidate.activeFeedbackMode || DEFAULT_FEEDBACK_MODE),
    scrollToEmptySession: Boolean(candidate.scrollToEmptySession),
  };
};
state = normalizeState(state);

function classSessions(classId = state.classId) { return (appData.sessions || []).filter(s => s.classId === classId); }
function pickSafeSession(classId = state.classId) {
  const sessions = classSessions(classId).sort((a,b) => String(b.sessionDate || b.createdAt || '').localeCompare(String(a.sessionDate || a.createdAt || '')));
  return sessions.find(s => s.status === '进行中') || sessions[0] || null;
}
currentSession = function() {
  const safe = classSessions(state.classId).find(s => s.sessionId === state.sessionId) || pickSafeSession(state.classId);
  if (safe && state.sessionId !== safe.sessionId) state.sessionId = safe.sessionId;
  return safe;
};
function sessionModules(session, rec) {
  const byId = new Map();
  (session?.selectedQuestions || []).slice().sort((a,b)=>(a.sessionOrder||0)-(b.sessionOrder||0)).forEach(item => {
    if (!item?.moduleId) return;
    if (!byId.has(item.moduleId)) byId.set(item.moduleId, { moduleId:item.moduleId, moduleName:item.moduleName || '未命名模块', lessonName:item.lessonName || '未记录讲次', items:[] });
    byId.get(item.moduleId).items.push(item);
  });
  return [...byId.values()].filter(m => m.items.length).map(m => { const done = m.items.filter(i => { const q = itemRecord(rec || {}, i); return q.status && q.status !== 'blank'; }).length; return { ...m, done, total:m.items.length, blank:m.items.length-done }; });
}
function ensureActiveModule(session, rec) {
  const mods = sessionModules(session, rec); if (!mods.length) { state.activeModuleId = ''; return; }
  if (!mods.some(m => m.moduleId === state.activeModuleId)) state.activeModuleId = (mods.find(m => m.blank > 0) || mods[0]).moduleId;
  if (!state.expandedModuleIds?.length) state.expandedModuleIds = [state.activeModuleId];
}
function moduleProgressText(session, rec) { const m = sessionModules(session, rec).find(x => x.moduleId === state.activeModuleId); return m ? `${m.lessonName}｜${m.moduleName}｜${m.done} / ${m.total}题` : '请选择模块'; }
function studentSessionProgress(session, rec) { const items = session?.selectedQuestions || []; const done = items.filter(i => { const q = itemRecord(rec || {}, i); return q.status && q.status !== 'blank'; }).length; return { total:items.length, done, blank:Math.max(0, items.length - done) }; }
function homeworkSummaryHtml(session) { const students = activeClass()?.students || []; const checks = Object.values(session.homeworkChecks || {}).flatMap(v => Object.values(v || {})); const pending = checks.filter(c => !c.completionStatus || c.completionStatus === '暂未检查').length || Math.max(0, students.length * (session.homeworkAssigned?.length || 0) - checks.length); const correcting = checks.some(c => String(c.correctionStatus || '').includes('待') || String(c.correctionNote || '').includes('订正')); const recheck = checks.some(c => String(c.correctionStatus || '').includes('复查') || c.recheckDate); return `<section class="card compact-summary"><button class="collapse-title" data-action="open-teacher-homework"><span>作业简要摘要</span><b>进入工作台</b></button><p>上次作业待检查 ${pending} 人次｜本节已布置 ${session.homeworkAssigned?.length || 0} 项｜${correcting?'有待订正':'暂无待订正'}｜${recheck?'有待复查':'暂无待复查'}</p></section>`; }
function emptySessionHtml(hasBrokenData = false) { return `<section id="empty-session" class="card empty-state"><h2>${hasBrokenData?'本节课堂已有题目，但题目数据读取失败。请不要清空数据，可尝试恢复最近备份。':'本节课堂尚未添加题目，请先选择讲次、模块或单独题目。'}</h2><div class="home-actions"><button data-action="add-questions">添加课堂题目</button><button data-action="add-questions">按讲次添加</button><button data-action="continue-last">继续上节课</button><button data-action="add-questions">自定义选题</button></div></section>`; }
function moduleOverviewHtml(session, rec) { const mods = sessionModules(session, rec); return `<section id="module-overview" class="card"><h2>模块总览</h2><div class="module-tabs">${mods.map(m=>`<button data-jump-module="${escapeHtml(m.moduleId)}" class="${m.moduleId===state.activeModuleId?'active':''}"><strong>${escapeHtml(m.moduleName)}</strong><span>${escapeHtml(m.lessonName)}｜${m.total}题｜${m.done?`已登记${m.done}题`:'未开始'}</span></button>`).join('')}</div></section>`; }
function classroomModuleHtml(session, rec, mod, readOnly) { const open = (state.expandedModuleIds || []).includes(mod.moduleId); return `<section id="module-${escapeHtml(mod.moduleId)}" class="card classroom-module ${mod.moduleId===state.activeModuleId?'active':''}"><div class="module-card-head"><div><h2>${escapeHtml(mod.moduleName)}</h2><p>来源：${escapeHtml(mod.lessonName)}｜本次课堂 ${mod.total} 题｜当前学生：${mod.done} / ${mod.total}题已登记</p></div><div class="module-actions"><button data-module-all="${escapeHtml(mod.moduleId)}" ${readOnly?'disabled':''}>本模块全对</button><button data-module-clear="${escapeHtml(mod.moduleId)}" ${readOnly?'disabled':''}>清空本模块</button><button data-toggle-module="${escapeHtml(mod.moduleId)}">${open?'收起':'展开'}</button></div></div>${open ? `<div class="question-list">${mod.items.map((item,idx)=>sessionQuestionHtml(item, rec, idx, readOnly)).join('') || '<p class="empty-summary">该模块暂无可登记题目</p>'}</div>` : ''}</section>`; }
function classroomHtml(session, student, rec) { ensureActiveModule(session, rec); const readOnly = session.status === '已结束' && !state.editHistory; const prog = studentSessionProgress(session, rec); const mods = sessionModules(session, rec); const hasLab = (session.selectedQuestions||[]).some(i => ['实验题','作图题'].includes(i.primaryType) || (i.typeTags||[]).includes('实验')); return `<section class="card session-head"><div><h2>${escapeHtml(session.sessionName)}</h2><p>${escapeHtml(session.sessionDate)} · ${escapeHtml(session.status)} · 当前学生：${escapeHtml(student.name)}</p><p>课堂 → ${escapeHtml(mods[0]?.lessonName || '未选讲次')} → ${escapeHtml(state.activeModuleId ? (mods.find(m=>m.moduleId===state.activeModuleId)?.moduleName || '未选模块') : '未选模块')} → 题目</p></div><div><button data-action="scroll-questions">回到题目登记</button><button data-action="add-questions">添加课堂题目</button><button data-action="go-teacher">进入教师工作台</button><button data-action="finish-session">结束课堂</button>${readOnly ? '<button data-action="edit-history">编辑历史记录</button>' : ''}</div></section><section id="question-register" class="card question-register"><h2>题目情况登记</h2><p>本节共${prog.total}题｜已登记${prog.done}题｜未登记${prog.blank}题</p><progress max="${prog.total||1}" value="${prog.done}"></progress></section>${!prog.total ? emptySessionHtml(false) : `${moduleOverviewHtml(session, rec)}${mods.map(m=>classroomModuleHtml(session, rec, m, readOnly)).join('')}`}<section class="card collapse"><button class="collapse-title" data-action="toggle-performance"><span>课堂表现</span><b>${state.performanceOpen?'收起':'展开'}</b></button>${state.performanceOpen ? `<div class="selected-summary"><strong>已选：</strong>${selectedChips(rec.performance||[], 'data-tag')}</div><div class="tag-grid compact-grid">${PERFORMANCE_TAGS.slice(0,18).map(t=>`<button data-tag="${t}" class="${(rec.performance||[]).includes(t)?'active':''}">${t}</button>`).join('')}</div>`:''}</section><section class="card"><label class="note-label">学生自由备注<input id="note" value="${escapeHtml(rec.note||'')}"></label></section>${homeworkSummaryHtml(session)}${hasLab?'<section class="card warn">本节包含实验内容，课后可补充器材和实验效果。</section>':''}${(session.historicalTeachingTips||[]).length?'<section class="card compact-summary"><button class="collapse-title" data-action="open-teacher-history"><span>一期上过相同内容，有教学复盘可查看。</span><b>查看</b></button></section>':''}<section class="card"><button data-action="go-teacher">进入教师工作台</button></section><nav class="bottom-actions"><button data-action="prev-student">上一位</button><button data-action="next-student">下一位</button><button data-action="scroll-modules">模块</button><button data-action="toggle-performance">课堂表现</button><button data-action="go-teacher">教师工作台</button></nav>`; }
function feedbackPanelHtml(session, student, rec) { const mode = normalizeFeedbackMode(rec.feedbackMode || state.activeFeedbackMode); rec.feedbackDrafts ||= {}; return `<div class="feedback-toolbar"><div class="mode-switch">${FEEDBACK_MODES.map(item=>`<button data-mode="${item.key}" class="${mode===item.key?'active':''}">${item.label}${rec.feedbackDrafts[item.key]?'<em>已有草稿</em>':''}</button>`).join('')}</div><div class="feedback-actions"><button data-action="generate-feedback">重新生成</button><button data-action="copy-feedback">一键复制</button></div></div><label class="switch"><input id="include-homework" type="checkbox" ${rec.includeHomework?'checked':''}> 加入作业情况</label><textarea id="feedback-draft" rows="${(FEEDBACK_MODES.find(m=>m.key===mode)||FEEDBACK_MODES[1]).rows}" placeholder="手动编辑当前版本草稿，系统不会自动发送。">${escapeHtml(rec.feedbackDrafts[mode] || '')}</textarea><p id="copy-tip" class="copy-tip"></p>`; }
function teacherWorkspaceHtml(session, student, rec) { const panels = [{id:'feedback',title:'学生家长反馈',html:feedbackPanelHtml(session,student,rec)},{id:'homework',title:'作业布置与检查',html:homeworkHtml(session)},{id:'review',title:'课后复盘',html:reviewHtml(session)},{id:'equipment',title:'实验器材',html:reviewHtml(session)},{id:'handout',title:'讲义问题',html:`<div class="review"><p>讲义问题</p>${renderTagChecks('handoutIssues', HANDOUT_ISSUES, session.postClassReview?.handoutIssues||[])}<input id="handoutLinks" value="${escapeHtml(session.postClassReview?.handoutLinks||'')}" placeholder="关联讲次/模块/具体题号"></div>`},{id:'todo',title:'下节课待办',html:`<div class="review">${renderTagChecks('nextLessonTasks', NEXT_TASKS, session.postClassReview?.nextLessonTasks||[])}<textarea id="teacherReflection" placeholder="教师自由复盘">${escapeHtml(session.postClassReview?.teacherReflection||'')}</textarea></div>`},{id:'history',title:'同讲义历史提醒',html:historicalTipsHtml(session) || '<p class="empty-summary">暂无同讲义历史提醒。</p>'},{id:'class-history',title:'课堂历史信息',html:historyHtml()}]; return `<section class="card session-head"><div><h2>教师工作台｜${escapeHtml(session.sessionName)}</h2><p>${escapeHtml(activeClass()?.name || '')} · ${escapeHtml(session.sessionDate)} · 当前学生：${escapeHtml(student.name)}</p></div><button data-action="go-classroom">返回课堂登记</button></section>${panels.map(p=>`<section class="card teacher-panel"><button class="collapse-title" data-teacher-panel="${p.id}"><span>${p.title}</span><b>${(state.activeTeacherPanel||'feedback')===p.id?'收起':'展开'}</b></button>${(state.activeTeacherPanel||'feedback')===p.id?p.html:''}</section>`).join('')}<nav class="bottom-actions"><button data-action="go-classroom">课堂登记</button><button data-action="prev-student">上一位</button><button data-action="next-student">下一位</button><button data-action="open-teacher-homework">作业</button><button data-action="open-teacher-history">历史</button></nav>`; }

sessionHtml = function(session, student, rec) { return state.currentView === 'teacher' ? teacherWorkspaceHtml(session, student, rec) : classroomHtml(session, student, rec); };

const reorganizedRender = render;
render = function() { state = normalizeState(state); const safe = currentSession(); if (safe) state.sessionId = safe.sessionId; reorganizedRender(); const session = currentSession(); const { student } = current(); const rec = session && student ? ensureStudentRecord(session, student.id) : null; if (session && student && rec) { document.querySelector('.sticky-summary')?.replaceChildren(); document.querySelector('.sticky-summary').innerHTML = `<strong>${escapeHtml(activeClass()?.name || '未选班级')}</strong><span>${escapeHtml(session.sessionName || '未选课堂')}｜${escapeHtml(student.name)}</span><span>${escapeHtml(moduleProgressText(session, rec))}</span><b>${studentSessionProgress(session, rec).done}/${studentSessionProgress(session, rec).total}</b>`; } if (state.scrollToEmptySession) { state.scrollToEmptySession = false; persist(); setTimeout(()=>document.querySelector('#empty-session')?.scrollIntoView({block:'center'})); } bindReorganizedEvents(); };
function bindReorganizedEvents() {
  document.querySelectorAll('[data-jump-module]').forEach(b=>b.onclick=()=>{state.activeModuleId=b.dataset.jumpModule; state.expandedModuleIds=[...new Set([...(state.expandedModuleIds||[]), b.dataset.jumpModule])]; persist(); render(); setTimeout(()=>document.querySelector(`#module-${CSS.escape(b.dataset.jumpModule)}`)?.scrollIntoView({block:'start'}));});
  document.querySelectorAll('[data-toggle-module]').forEach(b=>b.onclick=()=>{ const id=b.dataset.toggleModule; const set=new Set(state.expandedModuleIds||[]); set.has(id)?set.delete(id):set.add(id); state.expandedModuleIds=[...set]; state.activeModuleId=id; persist(); render(); });
  document.querySelectorAll('[data-teacher-panel]').forEach(b=>b.onclick=()=>{state.activeTeacherPanel=state.activeTeacherPanel===b.dataset.teacherPanel?'':b.dataset.teacherPanel; persist(); render();});
}

const reorganizedHandleAction = handleAction;
handleAction = function(action) {
  const session = currentSession(); const { student } = current();
  if (action === 'go-teacher') { state.currentView='teacher'; state.activeTeacherPanel ||= 'feedback'; persist(); render(); return; }
  if (action === 'go-classroom') { state.currentView='classroom'; persist(); render(); return; }
  if (action === 'scroll-questions') { document.querySelector('#question-register')?.scrollIntoView({block:'start'}); return; }
  if (action === 'scroll-modules') { document.querySelector('#module-overview')?.scrollIntoView({block:'start'}); return; }
  if (action === 'open-teacher-homework') { state.currentView='teacher'; state.activeTeacherPanel='homework'; persist(); render(); return; }
  if (action === 'open-teacher-history') { state.currentView='teacher'; state.activeTeacherPanel='history'; persist(); render(); return; }
  if ((action === 'prev-student' || action === 'next-student') && session) { const count = activeClass()?.students.length || 0; if (count) state.studentIndex = (state.studentIndex + (action === 'next-student' ? 1 : count - 1)) % count; const st=activeClass()?.students[state.studentIndex]; const rec=st?ensureStudentRecord(session,st.id):null; state.expandedModuleIds=[]; ensureActiveModule(session, rec); persist(); render(); return; }
  if (action === 'generate-feedback' && session && student) { const rec=ensureStudentRecord(session, student.id); const mode=normalizeFeedbackMode(rec.feedbackMode || DEFAULT_FEEDBACK_MODE); let draft = generateSessionFeedbackByMode(mode, session, student, rec); if (rec.includeHomework || document.querySelector('#include-homework')?.checked) draft += `\n${homeworkSentence(session, student.id)}`; rec.feedbackMode=mode; rec.feedbackDrafts={...(rec.feedbackDrafts||{}), [mode]:draft}; rec.feedbackDraft=draft; persist(); render(); return; }
  if (action === 'copy-feedback') { const text=document.querySelector('#feedback-draft')?.value || ''; navigator.clipboard?.writeText(text); const tip=document.querySelector('#copy-tip'); if (tip) tip.textContent='已复制当前版本草稿。'; return; }
  if (action === 'new-session') { reorganizedHandleAction(action); state.currentView='classroom'; if (!(currentSession()?.selectedQuestions||[]).length) state.scrollToEmptySession=true; persist(); render(); return; }
  return reorganizedHandleAction(action);
};
function generateSessionFeedbackByMode(mode, session, student, rec) {
  const items = (session.selectedQuestions || []).map(i => ({ item:i, q:itemRecord(rec,i) })).filter(x => !x.q.unassigned && !['本题未布置','本节未讲到','缺席未检查','尚未登记'].includes(x.q.incompleteStatus));
  const issues = items.filter(x => ['hint','wrong','unfinished'].includes(x.q.status)).slice(0, mode==='concise'?1:3);
  const names = issues.map(x => `“${x.item.questionName}”`).join('、'); const perf=(rec.performance||[]).slice(0,2).join('、'); const note=rec.note?`，${rec.note}`:'';
  if (mode === 'concise') return `${student.name}今天整体${perf || '能跟上课堂'}。${names ? `${names}需要再巩固，` : ''}提示后能够继续完成，回家建议把相关步骤再顺一遍。`;
  if (mode === 'professional') return `课堂情况：${student.name}本节课整体状态${perf || '比较稳定'}${note}。\n重点题目：${names || '本节登记题目'}中暴露出审题和步骤表达需要继续稳定，遇到△题时提醒后能够反应过来，不属于完全不会。\n后续建议：课后优先复看代表题的关键条件，订正时把公式、代入和单位写完整。`;
  return `${student.name}今天这节课整体${perf || '跟得比较稳'}${note}。${names ? `像${names}这几题比较有代表性，主要是条件提取和过程表达还可以更细一点，` : ''}课堂上稍微点一下思路就能接上，说明基础不是空的。课后建议把同类型题再整理一遍，重点看自己是在哪一步卡住。`;
}

render();

const previousBindReorganizedEvents = bindReorganizedEvents;
bindReorganizedEvents = function() {
  previousBindReorganizedEvents();
  const session = currentSession(); const { student } = current(); if (!session || !student) return;
  document.querySelectorAll('[data-tag]').forEach(button => button.onclick = () => { const rec=ensureStudentRecord(session, student.id); const tag=button.dataset.tag; rec.performance = (rec.performance||[]).includes(tag) ? rec.performance.filter(x=>x!==tag) : [...(rec.performance||[]), tag]; persist(); render(); });
  document.querySelector('#note')?.addEventListener('input', e => { const rec=ensureStudentRecord(session, student.id); rec.note=e.target.value; persist(); });
  document.querySelector('#feedback-draft')?.addEventListener('input', e => { const rec=ensureStudentRecord(session, student.id); const mode=normalizeFeedbackMode(rec.feedbackMode || DEFAULT_FEEDBACK_MODE); rec.feedbackDraft=e.target.value; rec.feedbackDrafts={...(rec.feedbackDrafts||{}), [mode]:e.target.value}; persist(); });
  document.querySelectorAll('[data-mode]').forEach(button => button.onclick = () => { const rec=ensureStudentRecord(session, student.id); const mode=normalizeFeedbackMode(button.dataset.mode); rec.feedbackMode=mode; rec.feedbackDraft=(rec.feedbackDrafts||{})[mode] || ''; state.activeFeedbackMode=mode; persist(); render(); });
  document.querySelector('#include-homework')?.addEventListener('change', e => { const rec=ensureStudentRecord(session, student.id); rec.includeHomework=e.target.checked; persist(); });
};
render();
