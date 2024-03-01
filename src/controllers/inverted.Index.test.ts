import { InvertedIndex } from './inverted.Index';

describe('InvertedIndex', () => {
  let invertedIndex: InvertedIndex;

  beforeEach(() => {
    invertedIndex = new InvertedIndex();
  });

  it('should build the index correctly', async () => {
    const testArr = [
      { fileName: 'file1.txt', docID: 1 },
      { fileName: 'file2.txt', docID: 2 },
      { fileName: 'file3.txt', docID: 3 },
    ];

    const result = await invertedIndex.BuildIndex(testArr);

    expect(result).toEqual([
      { word: 'apple', postings: [1, 2] },
      { word: 'banana', postings: [1, 3] },
      { word: 'cat', postings: [2, 3] },
    ]);
  });

  it('should handle empty input array', async () => {
    const testArr = [];

    const result = await invertedIndex.BuildIndex(testArr);

    expect(result).toEqual([]);
  });

  // Add more test cases as needed
});