const cosineSimilarity = (a: number[], b: number[]) => {
  const dotProduct = a.reduce((acc, cur, i) => acc + cur * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((acc, cur) => acc + cur * cur, 0));
  const magnitudeB = Math.sqrt(b.reduce((acc, cur) => acc + cur * cur, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

export default cosineSimilarity;
