<template lang="pug">
  v-dialog(v-model="value" persistent width=450)
    v-card(v-if="item")
      v-toolbar(dense card text :color="themeColor + ' accent-2'")
        v-toolbar-title {{ item.name || attributeName(item.type) }} Settings
      v-divider
      v-card-text.body-1(v-if="item.type === 'options'")
        .body-1 These are the options the user can shoose from:
        v-layout(v-for="(option, index) in item.data.options")
          v-flex(xs10)
            v-text-field(:value="option" disabled)
          v-flex.text-xs-center(xs2)
            v-btn(fab small @click="item.data.options.splice(index, 1)")
              v-icon mdi-delete
        v-layout
          v-flex(xs10)
            v-text-field(v-model="tempValue")
          v-flex.text-xs-center(xs2)
            v-btn(fab small @click="addItem('options', tempValue)")
              v-icon mdi-plus
        v-layout
          v-flex(xs11)
            v-checkbox(:input-value="item.data.multi" @click.stop="item.data.multi = !item.data.multi" label="Can select multiple items" hide-details)
      v-divider
      v-card-actions
        v-spacer
        v-btn(@click="closeAttributeOptions") Close
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DailogAttributeOptions extends Vue {
  @Prop({ default: '' })
  public value!: boolean;
  @Prop()
  public item: any;

  tempValue = '';

  // Computed Properties
  private get themeColor() {
    return this.$store.getters['session/themeColor'];
  }

  // Methods
  private addItem(prop: string, value: any) {
    this.item.data[prop].push(value);
    this.tempValue = ''
  }

  private closeAttributeOptions() {
    this.$emit('input', false);
    this.$emit('change');
  }
}
</script>

<style lang="scss" scoped>
</style>
