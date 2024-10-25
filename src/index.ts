import { PluginConfigEditor, VcsPlugin, VcsUiApp } from '@vcmap/ui';
import { name, version, mapVersion } from '../package.json';
import WfsSearch, { PluginConfig } from './wfsSearch.js';
import getDefaultOptions from './defaultOptions.js';
import ConfigEditor from './ConfigEditor.vue';

export default function wfsSearchPlugin(
  config: PluginConfig,
): VcsPlugin<PluginConfig, Record<never, never>> {
  let app: VcsUiApp;
  return {
    get name(): string {
      return name;
    },
    get version(): string {
      return version;
    },
    get mapVersion(): string {
      return mapVersion;
    },
    initialize(vcsUiApp: VcsUiApp): void {
      app = vcsUiApp;
      vcsUiApp.search.add(new WfsSearch(vcsUiApp, config), name);
    },
    getDefaultOptions,
    toJSON(): PluginConfig {
      const defaultOptions = getDefaultOptions();
      const options: PluginConfig = {
        url: config.url,
        addressMapping: config.addressMapping,
        getFeatureOptions: config.getFeatureOptions,
        filterExpression: config.filterExpression,
        regEx: config.regEx,
        minToken: config.minToken,
      };
      if (
        config.isStoredQuery &&
        config.isStoredQuery !== defaultOptions.isStoredQuery
      ) {
        options.isStoredQuery = config.isStoredQuery;
      }
      return options;
    },
    i18n: {
      en: {
        searchWfs: {
          configEditor: {
            title: 'WFS Search Editor',
            regEx: 'Regular Expression',
            minToken: 'Minimum number of Token',
            filterExpression: 'Filter Expression',
            queryOptions: 'Query Options',
            storedQuery: 'Stored Query',
            addressMapping: 'Address Attribute Mapping',
            isRequired: 'Input is required',
          },
        },
      },
      de: {
        searchWfs: {
          configEditor: {
            title: 'WFS-Suche Editor',
            regEx: 'Regulärer Ausdruck',
            minToken: 'Mindestanzahl von Token',
            filterExpression: 'Filterausdruck',
            queryOptions: 'Abfrageoptionen',
            storedQuery: 'Vordefinierte  Anfrage',
            addressMapping: 'Adressattribute Abbildung',
            isRequired: 'Eingabe ist erforderlich',
          },
        },
      },
    },
    getConfigEditors(): PluginConfigEditor<object>[] {
      return [
        {
          component: ConfigEditor,
          title: 'searchWfs.configEditor.title',
          infoUrlCallback: app?.getHelpUrlCallback(
            '/components/plugins/searchToolConfig.html#id_searchWfsConfig',
            'app-configurator',
          ),
        },
      ];
    },
  };
}
