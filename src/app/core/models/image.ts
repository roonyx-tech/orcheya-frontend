import { Alias, Model } from 'tsmodels';

interface Avatar {
  url: string;
}

export class Image extends Model {
  @Alias('medium') private innerMedium: Avatar;
  @Alias('small') private innerSmall: Avatar;
  @Alias('thumbnail') private innerThumbnail: Avatar;

  public get medium(): string {
    return this.innerMedium.url;
  }

  public get small(): string {
    return this.innerSmall.url;
  }

  public get thumbnail(): string {
    return this.innerThumbnail.url;
  }
}
