import {
  AddressBalloonFeatureInfoView,
  featureInfoViewSymbol,
  VcsUiApp,
} from '@vcmap/ui';
import { ResultItem, SearchImpl } from '@vcmap/ui/src/search/search';
import { mercatorProjection, requestUrl, wgs84Projection } from '@vcmap/core';
import { WFS } from 'ol/format';
import UnderscoreTemplate from 'underscore.template';
import { WriteGetFeatureOptions } from 'ol/format/WFS';
import { getInitForUrl } from '@vcmap/core/dist/src/util/fetch';
import { AddressBalloonFeatureInfoViewOptions } from '@vcmap/ui/src/featureInfo/addressBalloonFeatureInfoView';
import { parseBoolean } from '@vcsuite/parsers';
import { name } from '../package.json';

export type PluginConfig = {
  url: string;
  addressMapping: AddressBalloonFeatureInfoViewOptions;
  getFeatureOptions: WriteGetFeatureOptions;
  filterExpression: string;
  isStoredQuery?: boolean;
  regEx: string;
  minToken: number;
};

class WfsSearch implements SearchImpl {
  app: VcsUiApp;

  url: string;

  addressMapping: AddressBalloonFeatureInfoViewOptions;

  getFeatureOptions: WriteGetFeatureOptions;

  filterExpression: (arg0: object) => string;

  isStoredQuery?: boolean;

  regEx: string;

  minToken: number;

  constructor(app: VcsUiApp, config: PluginConfig) {
    this.app = app;
    this.url = config.url.replace(/\/$/, '');
    this.addressMapping = Object.assign(
      AddressBalloonFeatureInfoView.getDefaultOptions(),
      config.addressMapping,
    );
    this.getFeatureOptions = config.getFeatureOptions;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.filterExpression = UnderscoreTemplate(config.filterExpression);
    this.isStoredQuery = parseBoolean(config.isStoredQuery, false);
    this.regEx = config.regEx;
    this.minToken = config.minToken;
  }

  // eslint-disable-next-line class-methods-use-this
  get name(): string {
    return name;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore, need fix of the returned type in core api
  async search(query: string): Array<ResultItem> {
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
            dataProjection: wgs84Projection.proj,
            featureProjection: mercatorProjection.proj,
          })
          .map((feature) => {
            const displayName = `${feature.get(this.addressMapping.street!)} ${feature.get(
              this.addressMapping.number!,
            )}, ${feature.get(
              this.addressMapping.zip!,
            )} ${feature.get(this.addressMapping.city!)}`;
            // eslint-disable-next-line
            // @ts-ignore
            feature[featureInfoViewSymbol] = new AddressBalloonFeatureInfoView({
              type: 'AddressBalloonFeatureInfoView',
              name: 'WfsSearchBalloon',
              balloonSubtitle: '',
              ...this.addressMapping,
            } as AddressBalloonFeatureInfoViewOptions);
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
    const token = query.match(new RegExp(this.regEx));
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
