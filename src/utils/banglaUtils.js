// Utility to convert English numbers to Bangla digits
export const toBanglaDigit = (number) => {
    if (number === undefined || number === null) return '';
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return number.toString().replace(/\d/g, (d) => banglaDigits[d]);
};

// Utility to translate weather conditions
export const translateWeather = (condition) => {
    const map = {
        "Clear": "রৌদ্রোজ্জ্বল",
        "Sunny": "রৌদ্রোজ্জ্বল",
        "Clouds": "মেঘলা",
        "Cloudy": "মেঘলা",
        "Rain": "বৃষ্টি",
        "Thunderstorm": "ঝড়-বৃষ্টি",
        "Drizzle": "গুড়ি গুড়ি বৃষ্টি",
        "Fog": "কুয়াশা"
    };
    return map[condition] || condition;
};

// Utility to format date to Bangla day name (e.g., "সোম")
export const getBanglaDay = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
    return days[date.getDay()];
};
