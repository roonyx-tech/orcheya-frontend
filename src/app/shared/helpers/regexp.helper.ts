export class RegexpHelper {
  /* tslint:disable */
  private static regexps = {
    urlG: /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/g,
    protocolUrlG: /(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/g,
    slackUrlG: /(\<(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\|(.*?)\>)/g,
    slackUrl: /(\<(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\|(.*?)\>)/,
    slackUrlName: /\|(.*?)\>/,
  };
  /* tslint:enable */

  public static matchUrlsForSlack(str: string): string[] {
    return str.match(RegexpHelper.regexps.slackUrlG);
  }

  public static getReplacedSlackUrls(str: string, matches: string[]): string {
    let result = str;

    matches.forEach(match => {
      const url = match.match(RegexpHelper.regexps.protocolUrlG)[0];
      const name = RegexpHelper.regexps.slackUrlName.exec(match)
        ? RegexpHelper.regexps.slackUrlName.exec(match)[1]
        : url;

      const a = `<a href="${url}" target="_blank">${name}</a>`;
      result = result.replace(RegexpHelper.regexps.slackUrl, a);
    });

    return result;
  }
}
