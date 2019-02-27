<template lang="pug">
  v-dialog(v-model="value", persistent, width=450)
    v-card
      v-toolbar(dense card flat :color="themeColor + ' accent-2'")
        v-toolbar-title Library Access System Information
      v-divider
      v-card-text.body-1
        .title Libraries
        v-layout.py-1(row v-for="(item, index) in libraries" :key="index")
          v-flex.mr-2(xs1)
            v-img(:src='item.logo' contain height="2em")
          v-flex(xs6) {{ item.name }}
          v-flex(xs5) {{ item.version }}
      v-divider
      v-card-actions
        v-spacer
        v-btn(@click="doClose") Close
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DialogSystemInfo extends Vue {
  @Prop({ default: '' })
  public value!: boolean;

  private libraries = [];

  // Computed Properties
  private get themeColor() {
    return this.$store.getters['session/themeColor'];
  }

  // Methods
  private doClose() {
    this.$emit('input', false);
  }

  private created() {
    const deps = process.env.PACKAGE.dependencies;

    this.libraries.push({
      logo: require('../../assets/logos/vue.png'),
      name: 'Vue.JS', 
      version: deps.vue
    });
    this.libraries.push({
      logo: require('../../assets/logos/vuetify.svg'),
      name: 'Vuetify',
      version: deps.vuetify
    });
    this.libraries.push({
      logo: require('../../assets/logos/momentjs.svg'),
      name: 'Moment',
      version: deps.moment
    });
    this.libraries.push({
      name: 'Mermaid',
      version: deps.mermaid
    });
    this.libraries.push({
      name: 'ABC.js',
      version: deps.abcjs
    });
    this.libraries.push({
      logo: require('../../assets/logos/lodash.svg'),
      name: 'Lodash',
      version: deps.lodash
    });
    this.libraries.push({
      name: 'axios',
      version: deps.axios
    });
    this.libraries.push({
      logo: require('../../assets/logos/vue.png'),
      name: 'Vuex',
      version: deps.vuex
    });
    this.libraries.push({
      logo: require('../../assets/logos/vue.png'),
      name: 'vue-router',
      version: deps['vue-router']
    });

    this.libraries.sort((a: any, b: any) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
  }
};
</script>

<style lang="scss" scoped>
</style>
