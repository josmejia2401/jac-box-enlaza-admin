function simpleUAParser(userAgent) {
  try {
    console.log("aqui camos", userAgent);
    userAgent = userAgent || '';

    // Navegador
    let browser = 'Desconocido';
    if (/chrome|crios/i.test(userAgent)) {
      browser = 'Chrome';
    } else if (/firefox|fxios/i.test(userAgent)) {
      browser = 'Firefox';
    } else if (/safari/i.test(userAgent) && !/chrome|crios|android/i.test(userAgent)) {
      browser = 'Safari';
    } else if (/edg/i.test(userAgent)) {
      browser = 'Edge';
    } else if (/opera|opr\//i.test(userAgent)) {
      browser = 'Opera';
    } else if (/msie|trident/i.test(userAgent)) {
      browser = 'Internet Explorer';
    }

    // Sistema operativo
    let os = 'Desconocido';
    if (/android/i.test(userAgent)) {
      os = 'Android';
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      os = 'iOS';
    } else if (/windows nt/i.test(userAgent)) {
      os = 'Windows';
    } else if (/mac os x/i.test(userAgent)) {
      os = 'macOS';
    } else if (/linux/i.test(userAgent)) {
      os = 'Linux';
    }

    // Tipo de dispositivo
    let device = 'desktop';
    if (/tablet|ipad/i.test(userAgent)) {
      device = 'tablet';
    } else if (/mobi|android|touch|iphone|ipod/i.test(userAgent)) {
      device = 'mobile';
    }

    return { device, os, browser };
  } catch (err) {
    console.log(err);
  }
}

export default simpleUAParser;