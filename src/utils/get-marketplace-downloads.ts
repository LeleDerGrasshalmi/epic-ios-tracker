import { IOSMarketplaceUpdateData } from "../types/ios-marketplace-service";

export default async (appleItemIds: string[]) => {
  const res = await fetch(
    'https://ios-marketplace-public-service-prod.ol.epicgames.com/ios-marketplace/api/public/v1/marketplace/update',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apps: appleItemIds.map((appleItemId) => ({
          appleItemId,
          appleVersionId: '0'
        })),
        platform: 'iOS',
        osVersion: '17.4'
      }),
    },
  );

  if (!res.ok) {
    console.log('failed fetching marketplace updates', res.status, res.statusText, await res.text());

    return {
      success: false as const,
    };
  }

  const data = <IOSMarketplaceUpdateData>(await res.json());

  return {
    success: true as const,
    data,
  };
};
