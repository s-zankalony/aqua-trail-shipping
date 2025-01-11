export function generateTimeBasedId(randomLength = 4) {
  const timestamp = Date.now().toString();
  const random = Array.from({ length: randomLength }, () =>
    Math.floor(Math.random() * 10)
  ).join('');

  return timestamp + random;
}
