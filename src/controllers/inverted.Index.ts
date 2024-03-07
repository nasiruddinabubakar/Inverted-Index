import { invertedIndex } from '../types';
import { stopWords, testArr } from '../utils/filesArray';
import { PreProcessor } from './preProcesser';

export class InvertedIndex {
  lexicon: string[] | undefined;
  table: invertedIndex[] = [];
  constructor() {
    this.lexicon = [];
  }

  async BuildIndex() {
    await Promise.all(
        testArr.map(async (FileObject) => {
            const tokenizedArray = await PreProcessor.fileReader(
                FileObject.fileName
            );

            for (const word of tokenizedArray) {
                if (!this.lexicon?.includes(word) && !stopWords.includes(word)) {
                    this.lexicon?.push(word);
                }
            }

            for (const word of this.lexicon?.sort() || []) {
                let postings: number[] = [];

                if (!this.table.find((obj) => obj.word === word)) {
                    postings.push(FileObject.docID);
                    this.table.push({ word, postings });
                } else {
                    let index = this.table.findIndex((obj) => obj.word === word);
                    this.table[index].postings.push(FileObject.docID);
                }
            }
            this.lexicon?.splice(0,this.lexicon.length);
        })
    );

    return this.table;
}
async parseQuery(query: string) {
  // Tokenization
  const queryArr = query.split(' AND ');

  // Initialize docArr with all document IDs
  let docArr: number[] | null = null;

  // Parsing and Query Execution
  for (const word of queryArr) {
      const queryWord = PreProcessor.PreProcess(word);

      let index = this.table.findIndex((obj) => obj.word === queryWord);

      if (index !== -1) {
          const postings = this.table[index].postings;

          // If docArr is null (first iteration), initialize it with the postings
          if (docArr === null) {
              docArr = postings;
          } else {
              // Take the intersection of docArr and the postings
              docArr = docArr.filter(docId => postings.includes(docId));
          }
      } else {
          // If any word is not found in the index, return an empty array
          return [];
      }
  }

  // Convert docArr to an array and return
  return docArr === null ? [] : docArr;
}


  async returnIndex() {
    return this.table;
  }
}
