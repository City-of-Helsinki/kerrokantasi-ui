const isExternalLink = (href) => {
  return (
    href &&
    (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) &&
    !href.includes('localhost') &&
    !href.includes('kerrokantasi')
  );
};

export default isExternalLink;
