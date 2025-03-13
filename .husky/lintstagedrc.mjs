const config = {
  '*.{js,jsx,ts,tsx,vue}': ['eslint --fix'],
  '*.{json,md}': ['prettier --write'],
  '*.{css,scss,less,vue}': ['prettier --write'],
};

export default config;
