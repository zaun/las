<template lang="pug">
  v-dialog(v-model="value", persistent, width=450)
    v-card
      v-toolbar(dense card text :color="themeColor + ' accent-2'")
        v-toolbar-title {{ title }}
      v-divider
      v-card-text.body-1 There are unsaved changes. Closing the document without saving
        | will cause all changes to be lost. Do you wish to continue without saving?
      v-divider
      v-card-actions
        v-spacer
        v-btn(@click="doNo") NO
        v-btn(@click="doYes") YES
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DialogDirty extends Vue {
  @Prop({ default: '' })
  public value!: boolean;

  // Computed Properties
  private get themeColor() {
    return this.$store.getters['session/themeColor'];
  }

  private get isDocumentPage() {
    return this.$store.state.route.name === 'document';
  }

  private get isTemplatePage() {
    return this.$store.state.route.name === 'template';
  }

  private get title() {
    if (this.isDocumentPage) {
      return 'Close document without saving?';
    } else if (this.isTemplatePage) {
      return 'Close template without saving?';
    }
  }

  // Methods
  private doNo() {
    this.$emit('input', false);
  }

  private doYes() {
    this.$store.dispatch('session/cancelEdit').then(() => {
      this.$emit('input', false);
    });
  }
}
</script>

<style lang="scss" scoped>
</style>
