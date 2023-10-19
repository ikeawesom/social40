export default function generateID() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let randomWord = "";

  // Determine whether to include a dash (50% chance)
  const includeDash = Math.random() < 0.5;

  // Determine whether to include numbers (50% chance)
  const includeNumbers = Math.random() < 0.5;

  // Generate a random word with a length between 6 and 10 characters
  const maxLength = 10;
  const wordLength = Math.min(
    includeDash
      ? Math.floor(Math.random() * 5) + 6
      : Math.floor(Math.random() * 6) + 6,
    maxLength
  );

  for (let i = 0; i < wordLength; i++) {
    if (includeDash && i === Math.floor(wordLength / 2)) {
      randomWord += "-";
    } else if (includeNumbers && Math.random() < 0.5) {
      randomWord += Math.floor(Math.random() * 10);
    } else {
      const randomIndex = Math.floor(Math.random() * letters.length);
      randomWord += letters.charAt(randomIndex);
    }
  }

  return randomWord;
}
