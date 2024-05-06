export default {
  proxy: {
    '^/search-wfs': {
      target: 'https://dueren.gajamatrix.de/geoserver/dueren/wfs',
      changeOrigin: true,
      secure: false,
    },
  },
};
