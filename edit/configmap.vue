<script>
import CreateEditView from '@/mixins/create-edit-view';
import CruResource from '@/components/CruResource';
import NameNsDescription from '@/components/form/NameNsDescription';
import KeyValue from '@/components/form/KeyValue';
import Labels from '@/components/form/Labels';
import Tab from '@/components/Tabbed/Tab';
import Tabbed from '@/components/Tabbed';

export default {
  name: 'CruConfigMap',

  components: {
    CruResource,
    NameNsDescription,
    KeyValue,
    Labels,
    Tab,
    Tabbed
  },

  mixins: [CreateEditView],
};
</script>

<template>
  <CruResource
    :done-route="doneRoute"
    :mode="mode"
    :resource="value"
    :subtypes="[]"
    :validation-passed="true"
    :errors="errors"
    @error="e=>errors = e"
    @finish="save"
    @cancel="done"
  >
    <NameNsDescription
      v-if="!isView"
      :value="value"
      :mode="mode"
      :register-before-hook="registerBeforeHook"
    />

    <div class="spacer"></div>

    <Tabbed :side-tabs="true">
      <Tab name="data" :label="t('configmap.tabs.data.label')" :weight="2">
        <KeyValue
          key="data"
          v-model="value.data"
          :mode="mode"
          :protip="t('configmapPage.data.protip')"
          :initial-empty-row="true"
        />
      </Tab>
      <Tab name="binary-data" :label="t('configmap.tabs.binaryData.label')" :weight="1">
        <KeyValue
          key="binaryData"
          v-model="value.binaryData"
          :protip="false"
          :mode="mode"
          :add-allowed="false"
          :read-accept="'*'"
          :read-multiple="true"
          :value-binary="true"
          :value-base64="true"
          :value-can-be-empty="true"
          :initial-empty-row="true"
        />
      </Tab>
      <Tab
        v-if="!isView"
        name="labels-and-annotations"
        :label="t('generic.labelsAndAnnotations')"
        :weight="-1"
      >
        <Labels
          default-container-class="labels-and-annotations-container"
          :value="value"
          :mode="mode"
          :display-side-by-side="false"
        />
      </Tab>
    </Tabbed>
  </CruResource>
</template>
