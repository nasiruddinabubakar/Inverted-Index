const fs = require('fs');
const readline = require('readline');
const { promisify } = require('util');
const stemmer = require('porter-stemmer').stemmer;
const readFile = promisify(fs.readFile);


export class PreProcessor {
  constructor() {}

  static PreProcess = (Word: string) => {
    
    return stemmer(Word).toLowerCase(); 
  };

  static async fileReader(path: string) {
    const fileContent = await readFile(path, 'utf8');
    const lines = fileContent;
    const words = lines.split(' ');
    let processedWords: string[] = [];
    
    words.map((word:string) => {
        processedWords.push(PreProcessor.PreProcess(word));

    });
    return processedWords;
    // Do something with the processed words here
  }

  static queryPreProcess = (query: string) => {
    const words = query.split(' ');
    let processedWords: string[] = [];
    words.map((word:string) => {
        processedWords.push(PreProcessor.PreProcess(word));
    });
    return processedWords;
  };
}
