const appJson = require('./app.json');

function normalizeBaseUrl(value) {
  if (!value) return undefined;
  const trimmed = String(value).trim().replace(/\/+$/, '');
  if (!trimmed) return undefined;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

const fromEnv = process.env.EXPO_BASE_URL;
const baseUrl = normalizeBaseUrl(fromEnv);

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    ...appJson.expo,
    experiments: {
      ...appJson.expo.experiments,
      ...(baseUrl ? { baseUrl } : {}),
    },
  },
};
