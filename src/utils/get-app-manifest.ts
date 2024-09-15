import type { AppManifestData } from '../types/app-manifest';

export default async (baseDownloadURL: string, version: string) => {
  const res = await fetch(
    `${baseDownloadURL}manifest.json`,
  );

  if (!res.ok) {
    console.log('failed fetching manifest', version, res.status, res.statusText, await res.text());

    return {
      success: false as const,
    };
  }

  const data = <AppManifestData>(await res.json());
  const lastModified = res.headers.get('last-modified');

  return {
    success: true as const,
    data,
    date: lastModified ? new Date(lastModified).toISOString() : null,
  };
};
