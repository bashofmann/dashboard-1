import Vue from 'vue';
import {
  NAMESPACE, NAME, REPO, REPO_TYPE, CHART, VERSION, _VIEW
} from '@/config/query-params';
import { CATALOG } from '@/config/labels-annotations';

export default {
  showMasthead() {
    return (mode) => {
      return mode === _VIEW;
    };
  },

  applyDefaults() {
    return () => {
      Vue.set(this, 'disableOpenApiValidation', false);
      Vue.set(this, 'noHooks', false);
      Vue.set(this, 'skipCRDs', false);
      Vue.set(this, 'timeout', 300);
      Vue.set(this, 'wait', true);
    };
  },

  availableActions() {
    const out = this._standardActions;

    const upgrade = {
      action:     'goToUpgrade',
      enabled:    true,
      icon:       'icon icon-fw icon-edit',
      label:      'Upgrade',
    };

    out.unshift(upgrade);

    return out;
  },

  matchingChart() {
    const chart = this.spec?.chart;

    if ( !chart ) {
      return;
    }

    const chartName = chart.metadata?.name;
    const preferRepoType = chart.metadata?.annotations?.[CATALOG.SOURCE_REPO_TYPE];
    const preferRepoName = chart.metadata?.annotations?.[CATALOG.SOURCE_REPO_NAME];
    const match = this.$rootGetters['catalog/chart']({
      chartName, preferRepoType, preferRepoName
    });

    return match;
  },

  goToUpgrade() {
    return (moreQuery = {}) => {
      const match = this.matchingChart;
      const versionName = this.spec?.chart?.metadata?.version;
      const query = {
        [NAMESPACE]: this.metadata.namespace,
        [NAME]:      this.metadata.name,
        [VERSION]:   versionName,
      };

      if ( match ) {
        query[REPO] = match.repoName;
        query[REPO_TYPE] = match.repoType;
        query[CHART] = match.chartName;
      }

      this.currentRouter().push({
        name:   'c-cluster-apps-install',
        params: {
          product:   this.$rootGetters['productId'],
          cluster:   this.$rootGetters['clusterId'],
        },
        query,
      });
    };
  },

  details() {
    const t = this.$rootGetters['i18n/t'];

    const first = this.spec?.info?.firstDeployed;
    const last = this.spec?.info?.lastDeployed;

    if ( first && last && first !== last ) {
      return [
        {
          label:     t('model."catalog.cattle.io.app".lastDeployed'),
          formatter: 'LiveDate',
          content:   last,
        },
      ];
    }

    return [];
  },

  nameDisplay() {
    const out = this.spec?.name || this.metadata?.name || this.id || '';

    return out;
  },

  chartDisplay() {
    const meta = this.spec?.chart?.metadata;

    if ( meta ) {
      return `${ meta.name }:${ meta.version.startsWith('v') ? '' : 'v' }${ meta.version }`;
    } else {
      return '?';
    }
  },

  // upgrade() {
  //   return () => {
  //     debugger;
  //   };
  // },

  remove() {
    return (opt = {}) => {
      return this.doAction('uninstall', opt);
    };
  },

  canDelete() {
    return this.hasAction('uninstall');
  },

};
