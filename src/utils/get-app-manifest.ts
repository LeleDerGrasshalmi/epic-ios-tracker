import type { Version } from '../types/altstore-source';
import type { AppManifestData } from '../types/app-manifest';

export default async (version: Version) => {
  const res = await fetch(
    `${version.downloadURL}manifest.json`,
  );

  if (!res.ok) {
    console.log('failed fetching manifest', version.version, res.status, res.statusText, await res.text());

    return {
      success: false as const,
    };
  }

  const data = <AppManifestData>(await res.json());

  return {
    success: true as const,
    data,
  };
};
