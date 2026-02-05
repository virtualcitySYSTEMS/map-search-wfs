import {
  BalloonFeatureInfoViewOptions,
  featureInfoViewSymbol,
  VcsUiApp,
} from '@vcmap/ui';
import { ResultItem, SearchImpl } from '@vcmap/ui/src/search/search';
import {
  mercatorProjection,
  Projection,
  ProjectionOptions,
  requestUrl,
  wgs84Projection,
} from '@vcmap/core';
import { WFS } from 'ol/format';
import UnderscoreTemplate from 'underscore.template';
import { WriteGetFeatureOptions } from 'ol/format/WFS';
import { getInitForUrl } from '@vcmap/core/dist/src/util/fetch';
import { AddressBalloonFeatureInfoViewOptions } from '@vcmap/ui/src/featureInfo/addressBalloonFeatureInfoView';
import { parseBoolean } from '@vcsuite/parsers';
import { is } from '@vcsuite/check';
import { getLogger } from '@vcsuite/logger';
import { name } from '../package.json';

export type PluginConfig = {
  url: string;
  addressMapping: AddressBalloonFeatureInfoViewOptions;
  getFeatureOptions: WriteGetFeatureOptions;
  filterExpression: string;
  isStoredQuery?: boolean;
  regEx: string;
  minToken: number;
  projection?: ProjectionOptions;
  displayNameTemplate?: string;
  featureInfoViewOptions?: BalloonFeatureInfoViewOptions &
    Record<string, unknown>;
};

class WfsSearch implements SearchImpl {
  app: VcsUiApp;

  url!: string;

  getFeatureOptions: WriteGetFeatureOptions;

  filterExpression!: (arg0: object) => string;

  displayNameTemplate: (arg0: object) => string;

  isStoredQuery?: boolean;

  regEx: string;

  minToken: number;

  projection: Projection;

  featureInfoViewOptions: BalloonFeatureInfoViewOptions;

  constructor(app: VcsUiApp, config: PluginConfig) {
    this.app = app;
    if (is(config.url, String)) {
      this.url = config.url.replace(/\/$/, '');
    } else {
      getLogger(name).error('Please provide an url');
    }

    let featureInfoViewOptions: BalloonFeatureInfoViewOptions;
    if (config.featureInfoViewOptions) {
      featureInfoViewOptions = {
        name: 'WfsSearchBalloon',
        balloonSubtitle: '',
        ...config.featureInfoViewOptions,
      };
    } else {
      featureInfoViewOptions = {
        type: 'AddressBalloonFeatureInfoView',
        name: 'WfsSearchBalloon',
        balloonSubtitle: '',
        ...config.addressMapping,
      };
    }
    this.featureInfoViewOptions = featureInfoViewOptions;

    this.getFeatureOptions = config.getFeatureOptions;
    if (is(config.filterExpression, String)) {
      this.filterExpression = UnderscoreTemplate(config.filterExpression);
    } else {
      getLogger(name).error('Please provide a filter expression');
    }
    if (is(config.displayNameTemplate, String)) {
      this.displayNameTemplate = UnderscoreTemplate(
        config.displayNameTemplate!,
      );
    } else {
      this.displayNameTemplate = UnderscoreTemplate(
        `<%= ${config.addressMapping.street} %> <%= ${
          config.addressMapping.number
        } %>, <%= ${config.addressMapping.zip} %> <%= ${
          config.addressMapping.city
        } %>`,
      );
    }
    this.isStoredQuery = parseBoolean(config.isStoredQuery, false);
    this.regEx = config.regEx;
    this.minToken = config.minToken;
    this.projection = new Projection(
      config.projection ?? wgs84Projection.toJSON(),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  get name(): string {
    return name;
  }

  async search(query: string): Promise<ResultItem[]> {
    const wfsFormat = new WFS();
    const postData = this.generateGetFeatureXMLString(query, wfsFormat);
    if (!postData) {
      return Promise.resolve([]);
    }
    const init = getInitForUrl(this.url);
    init.method = 'POST';
    init.body = postData;
    init.headers = {
      'Content-Type': 'application/text+xml',
    };
    return requestUrl(this.url, init)
      .then((response) => response.text())
      .then((data) => {
        return wfsFormat
          .readFeatures(data, {
            dataProjection: this.projection.proj,
            featureProjection: mercatorProjection.proj,
          })
          .map((feature) => {
            const displayName = this.displayNameTemplate(
              feature.getProperties(),
            );
            // @ts-expect-error not properly exported from the ui
            feature[featureInfoViewSymbol] =
              this.app.featureInfoClassRegistry.createFromTypeOptions(
                this.featureInfoViewOptions,
              );
            return {
              title: displayName,
              feature,
            };
          });
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  generateGetFeatureXMLString(query: string, wfsFormat: WFS): string | null {
    const token = query.match(new RegExp(this.regEx, 'u'));
    if (!token || token.length < this.minToken + 1) {
      return null;
    }
    const xmlParser = new DOMParser();
    const filterXMLString = this.filterExpression({ token });
    const featureRequestXMLNode: Element = wfsFormat.writeGetFeature(
      this.getFeatureOptions,
    ) as Element;
    const filterXMLDoc = xmlParser.parseFromString(filterXMLString, 'text/xml');
    const queryParent: Element =
      featureRequestXMLNode.getElementsByTagName('Query')[0];
    if (this.isStoredQuery) {
      const storedQueryElement = filterXMLDoc.documentElement;
      for (let index = 0; index < queryParent.attributes.length; index++) {
        storedQueryElement.attributes.setNamedItem(
          queryParent.attributes[index].cloneNode() as Attr,
        );
      }
      queryParent.parentNode!.replaceChild(storedQueryElement, queryParent);
    } else {
      queryParent.appendChild(filterXMLDoc.documentElement);
    }
    return new XMLSerializer().serializeToString(featureRequestXMLNode);
  }

  // eslint-disable-next-line class-methods-use-this
  abort(): void {}

  // eslint-disable-next-line class-methods-use-this
  destroy(): void {}
}

export default WfsSearch;
