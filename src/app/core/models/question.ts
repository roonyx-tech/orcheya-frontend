import { Alias, Model } from 'tsmodels';
import { Answer } from './answer';

export class Question extends Model {
  @Alias() public title: string;
  @Alias() public id: number;
  @Alias('section_id') public sectionId: number;
  @Alias('answer', Answer) public answer: Answer;
  @Alias('_destroy') public isDestroy: string;

  // for adding/editing
  @Alias('answer_attributes', Answer) public answerAttributes?: Answer;

  constructor(question?: any) {
    super();

    if (question) {
      this._fromJSON(question);
    }
  }
}
