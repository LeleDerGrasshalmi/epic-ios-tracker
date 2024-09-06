export interface AltstoreSourceData {
  name: string;
  iconURL: string;
  website: string;
  identifier: string;
  tintColor: string;
  featuredApps: string[];
  apps: App[];
  news: unknown[];
}

export interface App {
  name: string;
  bundleIdentifier: string;
  developerName: string;
  subtitle: string;
  localizedDescription: string;
  _localizedDescriptions: LocalizedDescriptions;
  iconURL: string;
  tintColor: string;
  category: string;
  screenshots: Screenshot[];
  beta: boolean;
  versions: Version[];
  marketplaceID: string;
}

export interface LocalizedDescriptions {
  en: string;
  de: string;
  fr: string;
  ru: string;
  es: string;
  pl: string;
  it: string;
  tr: string;
}

export interface Screenshot {
  imageURL: string;
  width: number;
  height: number;
}

export interface Version {
  version: string;
  date: string;
  localizedDescription: string;
  downloadURL: string;
  size: number;
  minOSVersion: string;
  buildVersion: string;
}
