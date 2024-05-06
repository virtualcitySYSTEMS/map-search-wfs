import { PluginConfig } from './wfsSearch.js';

export default function getDefaultOptions(): PluginConfig {
  return {
    url: './search-wfs',
    addressMapping: {
      city: 'ort',
      street: 'strasse',
      number: 'hnr',
      zip: 'plz',
    },
    getFeatureOptions: {
      featureNS: '',
      featurePrefix: '',
      featureTypes: [],
      maxFeatures: 10,
      geometryName: 'geom',
      srsName: 'urn:ogc:def:crs:EPSG::4326',
    },
    filterExpression: '',
    regEx: '([a-zA-ZßäöüÄÖÜ\\.\\-\\s]+)\\s*([0-9]+\\s*[a-zA-Z]*)?',
    minToken: 1,
  };
}
