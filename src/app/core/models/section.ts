import { Alias, Model } from 'tsmodels';
import { Question } from './question';

export class Section extends Model {
  @Alias() public id: string;
  @Alias() public title: string;
  @Alias() public image?;
  @Alias('questions', Question) public questions?: Array<Question>;

  // for adding/editing
  @Alias('questions_attributes', Question) public questionsAttributes?: Array<Question>;

  constructor(section?: any) {
    super();

    if (section) {
      this._fromJSON(section);
    }
  }
}
