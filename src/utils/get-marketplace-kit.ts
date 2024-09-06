export default async () => {
  const res = await fetch(
    'https://content-download-egs.distro.on.epicgames.com/.well-known/marketplace-kit',
  );

  if (!res.ok) {
    console.log('failed fetching marketplace kit', res.status, res.statusText, await res.text());

    return {
      success: false as const,
    };
  }

  const data = <object>(await res.json());

  return {
    success: true as const,
    data,
  };
};
