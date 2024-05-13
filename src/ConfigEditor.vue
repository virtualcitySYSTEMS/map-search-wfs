<template>
  <AbstractConfigEditor @submit="apply" v-bind="{ ...$attrs, ...$props }">
    <v-container class="py-0 px-1">
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="url" dense required> url </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="url"
            clearable
            dense
            v-model.trim="localConfig.url"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="regEx" dense required>
            {{ $t('searchWfs.configEditor.regEx') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="regEx"
            clearable
            dense
            v-model.trim="localConfig.regEx"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="minToken" dense required>{{
            $t('searchWfs.configEditor.minToken')
          }}</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="minToken"
            clearable
            dense
            type="number"
            v-model.number="localConfig.minToken"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="filterExpression" dense required>
            {{ $t('searchWfs.configEditor.filterExpression') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="filterExpression"
            clearable
            dense
            v-model.trim="localConfig.filterExpression"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-switch
          html-for="isStoredQuery"
          v-model="localConfig.isStoredQuery"
          :label="$t('searchWfs.configEditor.storedQuery')"
        />
      </v-row>
    </v-container>
    <VcsFormSection
      :expandable="true"
      heading="searchWfs.configEditor.queryOptions"
    >
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="featureNS" dense required>featureNS</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="featureNS"
            clearable
            dense
            v-model.trim="localConfig.getFeatureOptions.featureNS"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="featurePrefix" dense required
            >featurePrefix</VcsLabel
          >
        </v-col>
        <v-col>
          <VcsTextField
            id="featurePrefix"
            clearable
            dense
            v-model.trim="localConfig.getFeatureOptions.featurePrefix"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="featureTypes" dense required
            >featureTypes</VcsLabel
          >
        </v-col>
        <v-col>
          <VcsChipArrayInput
            id="featureTypes"
            dense
            v-model="localConfig.getFeatureOptions.featureTypes"
            column
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="maxFeatures" dense required>maxFeatures</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="maxFeatures"
            clearable
            dense
            type="number"
            v-model.number="localConfig.getFeatureOptions.maxFeatures"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="geometryName" dense required
            >geometryName</VcsLabel
          >
        </v-col>
        <v-col>
          <VcsTextField
            id="geometryName"
            clearable
            dense
            v-model.trim="localConfig.getFeatureOptions.geometryName"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="srsName" dense required>srsName</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="srsName"
            clearable
            dense
            v-model.trim="localConfig.getFeatureOptions.srsName"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
    </VcsFormSection>
    <VcsFormSection
      :expandable="true"
      heading="searchWfs.configEditor.addressMapping"
    >
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="addressName" dense>addressName</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="addressName"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.addressName"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="street" dense>street</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="street"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.street"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="number" dense>number</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="number"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.number"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="city" dense>city</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="city"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.city"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="zip" dense>zip</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="zip"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.zip"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="country" dense>country</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="country"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.country"
          />
        </v-col>
      </v-row>
    </VcsFormSection>
  </AbstractConfigEditor>
</template>
<script lang="ts">
  import { VContainer, VRow, VCol, VSwitch } from 'vuetify/lib';
  import {
    VcsLabel,
    VcsTextField,
    AbstractConfigEditor,
    VcsFormSection,
    VcsChipArrayInput,
  } from '@vcmap/ui';
  import { ref, defineComponent, PropType } from 'vue';
  import { PluginConfig } from './wfsSearch.js';
  import getDefaultOptions from './defaultOptions.js';

  function isRequired(value: string): boolean | string {
    return value !== '' || 'searchWfs.configEditor.isRequired';
  }

  export default defineComponent({
    name: 'WfsSearchEditor',
    title: 'WFS Search Editor',
    components: {
      VcsChipArrayInput,
      VcsFormSection,
      VContainer,
      VRow,
      VCol,
      VSwitch,
      AbstractConfigEditor,
      VcsLabel,
      VcsTextField,
    },
    props: {
      getConfig: {
        type: Function as PropType<() => Promise<PluginConfig>>,
        required: true,
      },
      setConfig: {
        type: Function,
        required: true,
      },
    },
    setup(props) {
      const localConfig = ref(getDefaultOptions());
      props
        .getConfig()
        .then((config: PluginConfig) => {
          Object.assign(localConfig.value, config);
        }) // eslint-disable-next-line no-console
        .catch((err) => console.error(err));

      const apply = async (): Promise<void> => {
        await props.setConfig(localConfig.value);
      };

      return {
        apply,
        isRequired,
        localConfig,
      };
    },
  });
</script>
<style scoped></style>
