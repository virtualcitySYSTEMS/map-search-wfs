<template>
  <AbstractConfigEditor @submit="apply">
    <v-container class="py-0 px-1">
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="url" required>URL</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="url"
            clearable
            v-model.trim="localConfig.url"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="regEx" required>{{
            $t('searchWfs.configEditor.regEx')
          }}</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="regEx"
            clearable
            v-model.trim="localConfig.regEx"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="minToken" required>{{
            $t('searchWfs.configEditor.minToken')
          }}</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="minToken"
            clearable
            type="number"
            v-model.number="localConfig.minToken"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="filterExpression" required>{{
            $t('searchWfs.configEditor.filterExpression')
          }}</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextArea
            id="filterExpression"
            clearable
            v-model.trim="localConfig.filterExpression"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-switch
          class="pl-1"
          html-for="isStoredQuery"
          v-model="localConfig.isStoredQuery"
          :label="$t('searchWfs.configEditor.storedQuery')"
        />
      </v-row>
      <v-row no-gutters>
        <vcs-projection v-model="localConfig.projection" />
      </v-row>
    </v-container>
    <VcsFormSection
      :expandable="true"
      start-open
      heading="searchWfs.configEditor.queryOptions"
    >
      <v-container class="py-0 px-1">
        <v-row no-gutters>
          <v-col>
            <VcsLabel html-for="featureNS" required>featureNS</VcsLabel>
          </v-col>
          <v-col>
            <VcsTextField
              id="featureNS"
              clearable
              v-model.trim="localConfig.getFeatureOptions.featureNS"
              :rules="[isRequired]"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <VcsLabel html-for="featurePrefix" required>featurePrefix</VcsLabel>
          </v-col>
          <v-col>
            <VcsTextField
              id="featurePrefix"
              clearable
              v-model.trim="localConfig.getFeatureOptions.featurePrefix"
              :rules="[isRequired]"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <VcsLabel html-for="featureTypes" required>featureTypes</VcsLabel>
          </v-col>
          <v-col>
            <VcsChipArrayInput
              id="featureTypes"
              v-model="localConfig.getFeatureOptions.featureTypes"
              column
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <VcsLabel html-for="maxFeatures" required>maxFeatures</VcsLabel>
          </v-col>
          <v-col>
            <VcsTextField
              id="maxFeatures"
              clearable
              type="number"
              v-model.number="localConfig.getFeatureOptions.maxFeatures"
              :rules="[isRequired]"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <VcsLabel html-for="geometryName" required>geometryName</VcsLabel>
          </v-col>
          <v-col>
            <VcsTextField
              id="geometryName"
              clearable
              v-model.trim="localConfig.getFeatureOptions.geometryName"
              :rules="[isRequired]"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <VcsLabel html-for="srsName" required>srsName</VcsLabel>
          </v-col>
          <v-col>
            <VcsTextField
              id="srsName"
              clearable
              v-model.trim="localConfig.getFeatureOptions.srsName"
              :rules="[isRequired]"
            />
          </v-col>
        </v-row>
      </v-container>
    </VcsFormSection>
    <VcsFormSection
      :expandable="true"
      heading="searchWfs.configEditor.addressMapping"
    >
      <v-container class="py-0 px-1">
        <v-row no-gutters>
          <v-col>
            <VcsLabel html-for="displayNameTemplate">{{
              $t('searchWfs.configEditor.displayNameTemplate')
            }}</VcsLabel>
          </v-col>
          <v-col>
            <vcs-text-field
              id="displayNameTemplate"
              v-model="localConfig.displayNameTemplate"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <VcsLabel html-for="balloonType">{{
              $t('searchWfs.configEditor.balloonType')
            }}</VcsLabel>
          </v-col>
          <v-col>
            <vcs-select
              id="balloonType"
              v-model="balloonType"
              :items="[
                { value: 'address', title: 'searchWfs.configEditor.address' },
                { value: 'markdown', title: 'searchWfs.configEditor.markdown' },
              ]"
            />
          </v-col>
        </v-row>
        <template v-if="balloonType === 'address'">
          <v-row no-gutters>
            <v-col>
              <VcsLabel html-for="addressName">addressName</VcsLabel>
            </v-col>
            <v-col>
              <VcsTextField
                id="addressName"
                clearable
                v-model.trim="localConfig.addressMapping.addressName"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <VcsLabel html-for="street">street</VcsLabel>
            </v-col>
            <v-col>
              <VcsTextField
                id="street"
                clearable
                v-model.trim="localConfig.addressMapping.street"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <VcsLabel html-for="number">number</VcsLabel>
            </v-col>
            <v-col>
              <VcsTextField
                id="number"
                clearable
                v-model.trim="localConfig.addressMapping.number"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <VcsLabel html-for="city">city</VcsLabel>
            </v-col>
            <v-col>
              <VcsTextField
                id="city"
                clearable
                v-model.trim="localConfig.addressMapping.city"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <VcsLabel html-for="zip">zip</VcsLabel>
            </v-col>
            <v-col>
              <VcsTextField
                id="zip"
                clearable
                v-model.trim="localConfig.addressMapping.zip"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <VcsLabel html-for="country">country</VcsLabel>
            </v-col>
            <v-col>
              <VcsTextField
                id="country"
                clearable
                v-model.trim="localConfig.addressMapping.country"
              />
            </v-col>
          </v-row>
        </template>
        <template v-if="balloonType === 'markdown'">
          <v-row no-gutters>
            <v-col>
              <VcsLabel html-for="template" required>{{
                $t('searchWfs.configEditor.markdownTemplate')
              }}</VcsLabel>
            </v-col>
            <v-col>
              <VcsTextArea
                id="template"
                clearable
                v-model.trim="localConfig.featureInfoViewOptions!.template"
                :rules="[isRequired]"
              />
            </v-col>
          </v-row>
        </template>
      </v-container>
    </VcsFormSection>
  </AbstractConfigEditor>
</template>

<script lang="ts">
  import { VContainer, VRow, VCol, VSwitch } from 'vuetify/components';
  import {
    VcsLabel,
    VcsTextField,
    AbstractConfigEditor,
    VcsFormSection,
    VcsChipArrayInput,
    VcsTextArea,
    VcsProjection,
    VcsSelect,
  } from '@vcmap/ui';
  import { ref, defineComponent, PropType, watch } from 'vue';
  import { PluginConfig } from './wfsSearch.js';
  import { getMergedDefaultOptions } from './defaultOptions.js';

  type BalloonType = 'address' | 'markdown';

  function isRequired(value: string): boolean | string {
    return value !== '' || 'searchWfs.configEditor.isRequired';
  }

  export default defineComponent({
    name: 'WfsSearchEditor',
    components: {
      VcsTextArea,
      VcsChipArrayInput,
      VcsFormSection,
      VContainer,
      VRow,
      VCol,
      VSwitch,
      AbstractConfigEditor,
      VcsLabel,
      VcsTextField,
      VcsProjection,
      VcsSelect,
    },
    props: {
      getConfig: {
        type: Function as PropType<() => PluginConfig>,
        required: true,
      },
      setConfig: {
        type: Function as PropType<(config: object | undefined) => void>,
        required: true,
      },
    },
    setup(props) {
      const localConfig = ref(getMergedDefaultOptions(props.getConfig()));

      const balloonType = ref<BalloonType>(
        localConfig.value.featureInfoViewOptions?.type ===
          'MarkdownBalloonFeatureInfoView'
          ? 'markdown'
          : 'address',
      );
      watch(
        balloonType,
        () => {
          if (balloonType.value === 'address') {
            localConfig.value.featureInfoViewOptions = undefined;
          } else {
            localConfig.value.featureInfoViewOptions = {
              type: 'MarkdownBalloonFeatureInfoView',
              template: '',
            };
          }
        },
        { flush: 'sync' },
      );
      const apply = (): void => {
        props.setConfig(localConfig.value);
      };

      return {
        apply,
        isRequired,
        localConfig,
        balloonType,
      };
    },
  });
</script>

<style scoped></style>
