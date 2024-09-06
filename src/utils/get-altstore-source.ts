import type { AltstoreSourceData } from '../types/altstore-source';

export default async () => {
  const res = await fetch(
    'https://content-download-egs.distro.on.epicgames.com/iOS/altstore/source.json',
  );

  if (!res.ok) {
    console.log('failed fetching altstore source', res.status, res.statusText, await res.text());

    return {
      success: false as const,
    };
  }

  const data = <AltstoreSourceData>(await res.json());

  // sorting ...
  data.apps.sort((a, b) => a.bundleIdentifier.localeCompare(b.bundleIdentifier));
  data.apps.forEach((app) => {
    app.versions.sort((a, b) => {
      if (a.date !== b.date) {
        return Date.parse(b.date) - Date.parse(a.date);
      }

      return b.version.localeCompare(a.version);
    });
  });

  return {
    success: true as const,
    data,
  };
};
