export const environment = {
  production: false,
  BGA_BASE: 'https://api.boardgameatlas.com/api',
  BGA_CLIENT_ID: import.meta.env['NG_APP_BGA_CLIENT_ID'] || ''
};