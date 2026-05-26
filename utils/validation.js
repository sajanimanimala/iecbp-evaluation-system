export const isGarbageInput = (answer) => {
    if (!answer) return false;

    const text = answer.trim().toLowerCase();
    const words = text.split(/\s+/);
    const compactText = text.replace(/\s+/g, "");

    // 1. Symbols only
    if (/^[^a-z0-9]+$/i.test(compactText)) {
        return true;
    }

    // 2. Numbers only
    if (/^\d+$/.test(compactText)) {
        return true;
    }

    // 3. Same char repeated
    if (/^(.)\1{5,}$/.test(compactText)) {
        return true;
    }

    // 4. Same word repeated
    const uniqueWords = new Set(words);
    if (words.length >= 4 && uniqueWords.size <= Math.ceil(words.length * 0.4)) {
        return true;
    }

    // 5. Keyboard smash patterns
    const keyboardSmashPatterns = [
        "qwerty",
        "asdf",
        "zxcv",
        "poiuy",
        "lkjh",
        "mnbv"
    ];

    for (const pattern of keyboardSmashPatterns) {
        if (compactText.includes(pattern)) {
            return true;
        }
    }

    // 6. Random gibberish words
    let gibberishCount = 0;

    for (const word of words) {
        if (word.length >= 5) {
            const vowels = word.match(/[aeiou]/g) || [];
            const vowelRatio = vowels.length / word.length;

            if (
                /^[a-z]+$/.test(word) &&
                vowelRatio < 0.2
            ) {
                gibberishCount++;
            }
        }
    }

    if (gibberishCount >= 2) {
        return true;
    }

    // 7. Too many weird symbols mixed
    const weirdChars = compactText.match(/[^a-z0-9]/gi) || [];
    if (weirdChars.length > compactText.length * 0.3) {
        return true;
    }

    // 8. Tiny unique character variety
    const uniqueChars = new Set(compactText);
    if (compactText.length >= 10 && uniqueChars.size <= 3) {
        return true;
    }

    // 9. Fake laugh/spam
    if (
        /(ha){4,}|(he){4,}|(hi){4,}|(lol){3,}/.test(text)
    ) {
        return true;
    }

    // 10. Too many ultra-short nonsense words
    const tinyWords = words.filter(w => w.length <= 2);
    if (words.length >= 8 && tinyWords.length > words.length * 0.6) {
        return true;
    }

    return false;
};