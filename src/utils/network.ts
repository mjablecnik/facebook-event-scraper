import axios from 'axios';
import { FacebookCookies, ScrapeOptions } from '../types';

const formatCookies = (cookies: FacebookCookies | string): string => {
  if (typeof cookies === 'string') {
return cookies;
}
  return Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
};

export const fetchEvent = async (url: string, options?: ScrapeOptions) => {
  try {
    const { cookies, ...axiosOptions } = options || {};

    const headers: Record<string, string> = {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.6',
      'cache-control': 'max-age=0',
      // NOTE: Need these headers to get all the event data, some combo of the sec fetch headers
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'sec-gpc': '1',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
    };

    if (cookies) {
      headers.cookie = formatCookies(cookies);
    }

    const response = await axios.get(url, {
      headers,
      ...axiosOptions
    });

    return response.data;
  } catch (err: any) {
    // TODO: if in debug, print error: err.response?.data ?? err
    throw new Error(
      'Error fetching event, make sure your URL is correct and the event is accessible. For private events, provide Facebook cookies via the cookies option.'
    );
  }
};
