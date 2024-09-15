export default (url: string) => url.endsWith('/')
  ? url
  : `${url}/`;
