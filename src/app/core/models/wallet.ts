import { Alias, Model } from 'tsmodels';
import { Relation } from './relation';

export class Wallet extends Model {
  @Alias() public id: number;
  @Alias() public coins: number;
  @Alias() public comment: string;
  @Alias() public value: number;
  @Alias('relation', Relation) public relation: Relation;
  @Alias('relation_type') public relationType: string;
}
