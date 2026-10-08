import type { CancellationReason } from '@/types/tour'

export const cancellationReasons: CancellationReason[] = [
  { id: 'budget', label: '💸 ভাই, এই মাসে একটু খরচ বেশি।', labelEn: '💸 Bro, tight budget this month.' },
  { id: 'friends', label: '👥 সবাই confirm করলে আমিও যাবো।', labelEn: '👥 I will go if everyone confirms.' },
  { id: 'leave', label: '🏢 ভাই, এবার আর cancel হবে না।', labelEn: '🏢 Bro, it won\'t get cancelled this time.' }, // আইকন যোগ করা হয়েছে
  { id: 'family', label: '🏠 বাসা থেকে permission পাই নাই।', labelEn: '🏠 Didn\'t get permission from family.' },
  { id: 'weather', label: '🌧️ বৃষ্টি কমলে যাই।', labelEn: '🌧️ Let\'s go once the rain stops.' },
  { id: 'ticket', label: '🚌 টিকিট পাইনি', labelEn: '🚌 Didn\'t get the tickets.' },
  { id: 'illness', label: '🤒 ঈদের পরে নিশ্চিত।', labelEn: '🤒 Confirmed after Eid.' },
  { id: 'exam', label: '📚 পরীক্ষা শেষ হোক, তারপর।', labelEn: '📚 Let the exams finish first.' },
  { id: 'work', label: '💼 এই weekend অনেক কাজ।', labelEn: '💼 A lot of work this weekend.' },
  { id: 'sleep', label: '😴 ঘুম/আলসেমি', labelEn: '😴 Sleep / procrastination' },
  { id: 'next-month', label: '🤡 পরের মাসে গেলে বেশি ভালো হবে।', labelEn: '🤡 It would be better to go next month.' },
  { id: 'other', label: '✍️ অন্য কারণ', labelEn: '✍️ Other reason' },
];
