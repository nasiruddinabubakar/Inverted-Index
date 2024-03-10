import test from 'node:test';
import { Posting, invertedIndex, positionIndex } from '../types';
import { stopWords, testArr } from '../utils/filesArray';
import { PreProcessor } from './preProcesser';

export class InvertedIndex {
  lexicon: string[] | undefined;                        //temporary storage for the words
  table: invertedIndex[] = [];                //inverted index table

  index: Map<string, Posting[]>;            //position index

  constructor() {
    this.lexicon = [];
    this.index = new Map();
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
        this.lexicon?.splice(0, this.lexicon.length);
      })
    );

    return this.table;
  }

  async buildIndexFromFiles() {
    for (const document of testArr) {
      const processedWords = await PreProcessor.fileReader(document.fileName);
      this.addToIndex(processedWords, document.docID);
    }
    const sortedEntries = Array.from(this.index.entries());

    
    sortedEntries.sort((a, b) => {
    
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
    
      return b[1].length - a[1].length;
    });

    
     this.index = new Map(sortedEntries);
  return this.index;
    }

  addToIndex(words: string[], docID: number) {
    for (let position = 0; position < words.length; position++) {     // loop through the words and add to the index
      const word = words[position];
      if (word && word.length > 0) {          
        if (!this.index.has(word)) {
          this.index.set(word, []);               // if the word is not in the index, add it
        }
        const postings = this.index.get(word)!;
        const existingPosting = postings.find(      // if the word is already in the index, add the position to the posting
          (posting) => posting.docID === docID
        );
        if (existingPosting) {
          existingPosting.positions.push(position);
        } else {
          postings.push({ docID, positions: [position] });
        }
      }
    }
  }
  getPostings(word: string): Posting[] | undefined {
    return this.index.get(PreProcessor.PreProcess(word));
  }
  async returnIndex() {
    return this.table;
  }

  async runAndQuery(query: string) {
    const queryArr = query.split(' AND ');

    let docArr: number[] | null = null; 

    for (const word of queryArr) {
      const queryWord = PreProcessor.PreProcess(word);

      let index = this.table.findIndex((obj) => obj.word === queryWord);    // returns the index of the word in the table

      if (index !== -1) {
        const postings = this.table[index].postings;  

        if (docArr === null) {
          docArr = postings;
        } else {
          docArr = docArr.filter((docId) => postings.includes(docId));  // filter based on previoous arr because we need intersection
        }
      } else {
        return [];
      }
    }

    return docArr === null ? [] : docArr.sort();
  }
  async runOrQuery(query: string) {
    const queryArr = query.split(' OR ');

    let docArr: number[] = [];

    for (const word of queryArr) {
      const queryWord = PreProcessor.PreProcess(word);

      let index = this.table.findIndex((obj) => obj.word === queryWord);

      if (index !== -1) {
        const postings = this.table[index].postings;

        docArr = Array.from(new Set([...docArr, ...postings]));
      }
    }

    return docArr.sort();
  }
  // query methods
  async proximityQuery(
    term1: string,
    term2: string,
    proximity: number
  ): Promise<number[]> {
    const postings1 = this.getPostings(term1) || [];        // returns the postings for terms
    const postings2 = this.getPostings(term2) || [];

    const result: number[] = [];

    for (const posting1 of postings1) {
      for (const posting2 of postings2) {
        if (posting1.docID === posting2.docID) {
          if (
            this.isWithinProximity(
              posting1.positions,
              posting2.positions,
              proximity
            )
          ) {
            result.push(posting1.docID);
            console.log(result);
            break; // Break the inner loop since we've found a match in this document
          }
        }
      }
    }

    return result;
  }

  isWithinProximity(
    positions1: number[],
    positions2: number[],
    proximity: number
  ): boolean {

    for (const position1 of positions1) {
      for (const position2 of positions2) {

        if (Math.abs(position1 - position2) <= proximity) {
          return true;
        }
      }
    }
    return false;
  }
}
