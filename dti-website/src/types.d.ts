interface Project {
  readonly active?: boolean;
  readonly teamId: string;
  readonly card: string;
  readonly name: string;
  readonly features: readonly {
    readonly title: string;
    readonly image?: string;
    readonly description: string;
  }[];
  readonly header: string;
  readonly subheader: string;
  readonly hero: {
    readonly header: string;
    readonly subheader: string;
    readonly image?: string;
  };
  readonly website?: string;
  readonly website_title?: string;
  readonly appstore?: string;
  readonly playstore?: string;
  readonly github?: string;
  readonly ios_github?: string;
  readonly android_github?: string;
  readonly heroStartingColor: string;
  readonly heroEndingColor: string;
  readonly heroUseDarkText: boolean;
}
