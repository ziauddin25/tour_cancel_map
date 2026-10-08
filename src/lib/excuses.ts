export const TOUR_EXCUSES = [
  'ভাই, এই মাসে একটু খরচ বেশি।',
  'সবাই confirm করলে আমিও যাবো।',
  'পরীক্ষা শেষ হোক, তারপর।',
  'বৃষ্টি কমলে যাই।',
  'ঈদের পরে নিশ্চিত।',
  'ভাই, এবার আর cancel হবে না।',
  'বাসা থেকে permission পাই নাই।',
  'টিকিট পাই নাই।',
  'এই weekend অনেক কাজ।',
  'পরের মাসে গেলে বেশি ভালো হবে।',
];

export function generateExcuse() {
  return TOUR_EXCUSES[Math.floor(Math.random() * TOUR_EXCUSES.length)]
}
