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
render();
