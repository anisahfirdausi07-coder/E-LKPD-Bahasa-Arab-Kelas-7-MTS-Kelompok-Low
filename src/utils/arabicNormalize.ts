// Normalize Arabic text by removing harakat/diacritics and unifying Alef/Ta Marbutah forms
export function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Remove harakat & Quranic marks
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[.,،؟!؛:"'()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function checkKitabahAnswer(
  userInput: string,
  acceptedKeywords: string[],
  type: 'fill-blank' | 'picture-sentence',
): { isCorrect: boolean; feedbackIndo: string } {
  const trimmed = userInput.trim();
  if (!trimmed) {
    return {
      isCorrect: false,
      feedbackIndo: 'Kotak jawaban masih kosong. Silakan ketik atau pilih kata Arab terlebih dahulu!',
    };
  }

  const normalizedUser = normalizeArabic(trimmed);

  // Check if contains Arabic characters at all
  const hasArabic = /[\u0600-\u06FF]/.test(trimmed);
  if (!hasArabic) {
    return {
      isCorrect: false,
      feedbackIndo: 'Gunakan huruf Arab (أ، ب، ت...) ya! Kamu juga bisa menekan tombol kata bantuan di bawah kotak.',
    };
  }

  const matched = acceptedKeywords.some((kw) => {
    const normKw = normalizeArabic(kw);
    return normalizedUser === normKw || normalizedUser.includes(normKw);
  });

  if (matched) {
    return {
      isCorrect: true,
      feedbackIndo: 'Hebat! Penulisan kata/kalimat Bahasa Arabmu sudah tepat dan sesuai.',
    };
  }

  // For open-ended personal name / city fill-blank (when user writes any genuine Arabic word >= 2 chars)
  const isPersonalOpenBlank = acceptedKeywords.includes('احمد') || acceptedKeywords.includes('سورابايا');
  if (type === 'fill-blank' && isPersonalOpenBlank && normalizedUser.length >= 2) {
    return {
      isCorrect: true,
      feedbackIndo: 'Bagus sekali! Jawabanmu diterima karena menggunakan huruf Arab yang sesuai konteks.',
    };
  }

  return {
    isCorrect: false,
    feedbackIndo: 'Masih belum tepat. Perhatikan contoh jawaban benar dan coba perbaiki tulisanmu ya!',
  };
}
