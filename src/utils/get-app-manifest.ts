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

  // sorting ...
  data.variants.sort((a, b) => a.assetPath.localeCompare(b.assetPath));
  data.variants.forEach((variant) => {
    variant.installTargets.sort((a, b) => {
      if (a.device !== b.device) {
        return a.device.localeCompare(b.device);
      }

      return a.os.localeCompare(b.device);
    });
  });

  data.deltas.sort((a, b) => a.assetPath.localeCompare(b.assetPath));
  data.deltas.forEach((variant) => {
    variant.sourceVariant.installTargets.sort((a, b) => {
      if (a.device !== b.device) {
        return a.device.localeCompare(b.device);
      }

      return a.os.localeCompare(b.device);
    });
  });

  return {
    success: true as const,
    data,
  };
};
