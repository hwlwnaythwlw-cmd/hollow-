const { getUser, updateUser } = require('../data/user');

const JOBS = {
  'الطب': {
    ranges: [
      { max: 15, amountRange: [1000, 3000], result: 'فشلت في العملية وخسرت' },
      { max: 20, amountRange: [500, 1000], result: 'وكانت خبرتك قليلة لذا حصلت على' },
      { max: 70, amountRange: [1500, 2500], result: 'نجحت في إتمام العملية وحصلت على' },
      { max: 100, amountRange: [2000, 3000], result: 'أنقذت حياة وحصلت على' }
    ],
    message: '🌝 | لقد عملت في مجال الطب '
  },
  'الطبخ': {
    ranges: [
      { max: 50, amountRange: [100, 2000], result: 'طبخت طبخة سيئة وخسرت' },
      { max: 100, amountRange: [2000, 3000], result: 'طبخت طبخة مميزة وحصلت على' }
    ],
    message: '🍞 | لقد عملت في مجال الطبخ '
  },
  'التجارة': {
    ranges: [
      { max: 10, amountRange: [1000, 2000], result: 'العصير وحصلت على' },
      { max: 30, amountRange: [2000, 2500], result: 'الفواكه وحصلت على' },
      { max: 50, amountRange: [2000, 2500], result: 'الحلويات وحصلت على' },
      { max: 70, amountRange: [3000, 4000], result: 'الملابس وحصلت على' },
      { max: 90, amountRange: [4000, 5000], result: 'المخدرات وحصلت على' },
      { max: 100, amountRange: [2000, 3000], result: 'الماكولات وحصلت على' }
    ],
    message: '💲 | لقد عملت في مجال التجارة '
  },
  'الدعارة': {
    ranges: [
      { max: 100, amountRange: [10000, 20000], result: 'نمت ليلة في الفراش وحصلت على' }
    ],
    message: '🌝 | لقد عملت في مجال الدعارة '
  },
  'البرمجة': {
    ranges: [
      { max: 30, amountRange: [1000, 4000], result: 'وتعرضت لاختراق وخسرت' },
      { max: 70, amountRange: [1000, 2500], result: 'وحصلت على' },
      { max: 100, amountRange: [7000, 10000], result: 'وأنشأت موقعًا ناجحًا وربحت' }
    ],
    message: '⚙️ | لقد عملت ك مبرمج '
  },
  'التدريس': {
    ranges: [
      { max: 30, amountRange: [1000, 2000], result: 'ولكن الطلاب لم يعجبهم عملك وخسرت' },
      { max: 70, amountRange: [1000, 2000], result: 'وحصلت على' },
      { max: 100, amountRange: [1000, 4000], result: 'وأصبحت أفضل مدرس وحصلت على' }
    ],
    message: '🎓 | لقد عملت ك مدرس '
  },
  'الشرطة': {
    ranges: [
      { max: 30, amountRange: [2000, 3000], result: 'وحاولت الإمساك بمجرم ولكن فشلت وخسرت' },
      { max: 70, amountRange: [2000, 4000], result: 'وأمسكت بسيارة مخالفة وحصلت على' },
      { max: 100, amountRange: [10000, 40000], result: 'وأمسكت بمجرم كبير وحصلت على' }
    ],
    message: '👮🏻‍♂️ | لقد عملت كشرطي '
  },
  'الطيران': {
    ranges: [
      { max: 30, amountRange: [5000, 7000], result: 'وسقطت الطائرة ولكن لحسن الحظ لم يمت أحد وخسرت' },
      { max: 100, amountRange: [8000, 10000], result: 'ونجحت في مهمتك وحصلت على' }
    ],
    message: '👨🏻‍✈️ | لقد عملت في مجال الطيران '
  },
  'التنظيف': {
    ranges: [
      { max: 50, amountRange: [500, 1000], result: 'وتعرضت لكثير من المتاعب وخسرت' },
      { max: 100, amountRange: [1000, 2000], result: 'وقمت بعملك بنجاح وحصلت على' }
    ],
    message: '🧹 | لقد عملت في مجال التنظيف '
  },
  'الزراعة': {
    ranges: [
      { max: 30, amountRange: [1000, 1500], result: 'وكان الموسم سيئًا وخسرت' },
      { max: 70, amountRange: [1500, 2500], result: 'وكان الموسم جيدًا وحصلت على' },
      { max: 100, amountRange: [2500, 3500], result: 'وكان الموسم ممتازًا وحصلت على' }
    ],
    message: '🌾 | لقد عملت في مجال الزراعة '
  }
};

const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomJobResult = (job) => {
  const ratio = Math.floor(Math.random() * 101);
  const range = job.ranges.find(r => ratio <= r.max);
  if (!range) return { amount: 0, resultMessage: 'ما لقيت شغل اليوم' };
  return {
    amount: getRandomAmount(range.amountRange[0], range.amountRange[1]),
    resultMessage: range.result
  };
};

const processJob = async (api, event, user) => {
  const today = new Date().toISOString().slice(0, 10); // تاريخ ثابت

  if (user.lastJobDay === today) {
    return api.sendMessage('⚠️ | تعال بكرة تشتغل تاني.', event.threadID, event.messageID);
  }

  const jobKeys = Object.keys(JOBS);
  const randomJobKey = jobKeys[Math.floor(Math.random() * jobKeys.length)];
  const job = JOBS[randomJobKey];

  const { amount, resultMessage } = getRandomJobResult(job);
  if (!amount) {
    return api.sendMessage('🌝 | ما لقيت ليك شغل اليوم.', event.threadID, event.messageID);
  }

  user.lastJobDay = today;
  user.money = user.money || 0;
  user.money += resultMessage.includes('خسرت') ? -amount : amount;

  await updateUser(user.id, user);

  const sign = resultMessage.includes('خسرت') ? '-' : '+';
  const finalMessage = `${job.message}\n${resultMessage} ${sign}${amount} جنيه.`;

  api.sendMessage(finalMessage, event.threadID, event.messageID);
};

module.exports = {
  name: 'عمل',
  otherName: ['شغل', 'job'],
  version: '1.0.3',
  info: 'قم بالعمل لكسب المال مرة واحدة يوميًا',
  rank: 0,
  usageCount: 0,
  updatedAt: '2025/10/28',

  run: async (api, event) => {
    const user = await getUser(event.senderID);
    if (!user) {
      return api.sendMessage('⚠️ | ما عندك حساب. استخدم "سجلني" أولاً.', event.threadID, event.messageID);
    }

    await processJob(api, event, user);
  }
};
