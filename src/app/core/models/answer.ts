import { Alias, Model } from 'tsmodels';

export class Answer extends Model {
  @Alias() public content: string;
  @Alias('question_id') public sectionId: number;

  constructor(answer?: any) {
    super();

    if (answer) {
      this._fromJSON(answer);
    }
  }
}
