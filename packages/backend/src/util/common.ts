export const getDomainFromHostname = hostname =>
  hostname.split('.').slice(-2).join('.');

export const isProduction = process.env.NODE_ENV === 'production';
export const origin = new URL(process.env.ORIGIN_URL);

export const commonCookieOptions = {
  domain: getDomainFromHostname(origin.hostname),
  secure: isProduction,
};

/* eslint-disable-next-line dot-notation */
export const getCodeId = codeData => codeData['_id'].toString();
