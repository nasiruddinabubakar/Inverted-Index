const fs = require('fs');
const readline = require('readline');
const { promisify } = require('util');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const porterStemmer = natural.PorterStemmer;
const readFile = promisify(fs.readFile);


export class PreProcessor {
  constructor() { }

  static PreProcess = (Word: string) => {
    // Remove punctuation, digits, and apply stemming
    const processedWord = Word
      .replace(/[^a-zA-Z]/g, '') // Remove non-alphabetic characters
      .toLowerCase(); // Convert to lowercase

      if (processedWord.length <= 2 || natural.stopwords.includes(processedWord) ) {
        return null; // Discard short words and common stop words
    }
    
    // Apply Porter Stemming
    const stemmedWord = porterStemmer.stem(processedWord);
    if (stemmedWord.length >= 13) return null; // Discard long words  
    return stemmedWord;
    // return porterStemmer.stem(processedWord);
  };

  static async fileReader(path: string) {
    const fileContent = await readFile(path, 'utf8');
    const lines = fileContent;
    const words = lines.split(' ');
    let processedWords: string[] = [];

    words.map((word: string) => {
      const temp = PreProcessor.PreProcess(word);
      if (!temp) {

      } else {
        processedWords.push(temp);
      }
    });
    return processedWords;
    // Do something with the processed words here
  }

  static queryPreProcess = (query: string) => {
    const words = query.split(' ');
    let processedWords: string[] = [];
    words.map((word: string) => {
      processedWords.push(PreProcessor.PreProcess(word));
    });
    return processedWords;
  };
}
