import { wgs84Projection } from '@vcmap/core';
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
    regEx: "^([\\p{L}0-9'\\.\\-\\s]+?),*\\s*([0-9\\-]+\\s*[a-zA-Z]{0,1})?$",
    minToken: 1,
    projection: wgs84Projection.toJSON(),
  };
}

export function getMergedDefaultOptions(
  config?: Partial<PluginConfig>,
): PluginConfig {
  const mergedConfig = getDefaultOptions();
  if (!config) {
    return mergedConfig;
  }

  Object.entries(config).forEach(([key, value]) => {
    if (value) {
      if (typeof value === 'object') {
        // @ts-expect-error -- dynamic key access
        mergedConfig[key] = { ...mergedConfig[key], ...value };
      } else {
        // @ts-expect-error -- dynamic key access
        mergedConfig[key] = value;
      }
    }
  });

  return mergedConfig;
}
