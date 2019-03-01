<template lang="pug">
  v-dialog(v-model="value" persistent width=450)
    v-card(v-if="item")
      v-toolbar(dense card text :color="themeColor + ' accent-2'")
        v-toolbar-title {{ item.name || attributeName(item.type) }} Settings
      v-divider
      v-card-text.body-1(v-if="item.type === 'datatable'")
        .body-1 These are the data columns:
        v-layout(v-for="(col, index) in item.data.cols")
          v-flex(xs4)
            v-text-field(:value="col.title")
          v-flex.pl-2(xs3)
            v-text-field(:value="col.name" disabled)
          v-flex.pl-2(xs3)
            v-text-field(:value="col.type" disabled)
          v-flex.text-xs-center(xs2)
            v-btn(fab small @click="item.data.cols.splice(index, 1)")
              v-icon mdi-delete
        v-layout
          v-flex(xs4)
            v-text-field(v-model="tempValue.title" label="Title")
          v-flex.pl-2(xs3)
            v-text-field(v-model="tempValue.name" label="Data Name")
          v-flex.pl-2(xs3)
            v-select(v-model="tempValue.type" :items="['String', 'Number', 'Date']" label="Type")
          v-flex.text-xs-center(xs2)
            v-btn(fab small @click="addItem('cols', { title: tempValue.title, name: tempValue.name, type: tempValue.type })")
              v-icon mdi-plus
      v-divider
      v-card-actions
        v-spacer
        v-btn(@click="closeSectionOptions") Close
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DailogSectionOptions extends Vue {
  @Prop({ default: '' })
  public value!: boolean;
  @Prop()
  public item: any;

  tempValue = {};

  // Computed Properties
  private get themeColor() {
    return this.$store.getters['session/themeColor'];
  }

  // Methods
  private addItem(prop: string, value: any) {
    this.item.data[prop].push(value);
    this.tempValue = ''
  }

  private closeSectionOptions() {
    this.$emit('input', false);
    this.$emit('change');
  }
}
</script>

<style lang="scss" scoped>
</style>
