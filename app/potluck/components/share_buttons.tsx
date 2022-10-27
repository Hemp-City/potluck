function isMobileOrTablet() {
    return /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);
  }
  
  function whatsappLink(url: string, { title, separator }: { title?: string; separator?: string }) {
    return (
      'https://' +
      (isMobileOrTablet() ? 'api' : 'web') +
      '.whatsapp.com/send' +
      objectToGetParams({
        text: title ? title + separator + url : url,
      })
    );
  }
  
  const WhatsappShareButton = createShareButton<{ title?: string; separator?: string }>(
    'whatsapp',
    whatsappLink,
    props => ({
      title: props.title,
      separator: props.separator || ' ',
    }),
    {
      windowWidth: 550,
      windowHeight: 400,
    },
  );

  function objectToGetParams(object: {
    [key: string]: string | number | undefined | null;
  }) {
    const params = Object.entries(object)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  
    return params.length > 0 ? `?${params.join('&')}` : '';
  }