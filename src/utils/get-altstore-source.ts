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

  // https://faq.altstore.io/distribute-your-apps/make-a-source#overview
  const data = <AltstoreSourceData>(await res.json());

  // sorting ...
  data.apps
    .sort((a, b) => a.bundleIdentifier.localeCompare(b.bundleIdentifier));

  return {
    success: true as const,
    data,
  };
};
