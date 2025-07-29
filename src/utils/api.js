let apiUrl;

if (typeof window !== 'undefined') {
  const host = window.location.hostname;
  if (host === 'www.personalmindmap.com' || host === 'personalmindmap.com') {
    apiUrl = process.env.NEXT_PUBLIC_API_URL_PROD;
  } else if (host === 'dev.personalmindmap.com' || host === 'www.dev.personalmindmap.com') {
    apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV;
  } else if (host === 'localhost' || host === '127.0.0.1') {
    apiUrl = process.env.NEXT_PUBLIC_API_URL_LOCAL;
  } else {
    apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV;
  }
} else {
  apiUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PROD
      : process.env.NEXT_PUBLIC_API_URL_LOCAL;
}

export { apiUrl };