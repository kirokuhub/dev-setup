function getUrl(
  path: string = "",
  middle: string = "",
  prefix: string = "",
): string {
  return `${prefix}${middle}${path}`;
}

export default getUrl;
