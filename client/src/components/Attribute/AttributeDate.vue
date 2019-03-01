<template lang="pug">
  .a-date(v-if="readonly && value")
    .label(v-if="label") {{ label }}
    .value {{ formattedDate }}

  .a-date(v-else-if="!readonly")
    v-menu(v-model="showDate"
          :close-on-content-click="false"
          full-width
          max-width="290")
      v-text-field(slot="activator"
        :label="label"
        :value="formattedDate"
        clearable readonly)
      v-date-picker(v-model="date" @change="onInput" @input="onInput")
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AttributeDate extends Vue {
  @Prop({ default: '' })
  public label!: string;
  @Prop({ default: false })
  public readonly!: boolean;
  @Prop({ default: false })
  public disabled!: boolean;
  @Prop({ default: '' })
  public value!: string;

  private showDate: boolean = false;
  private date: string | null = null;

  // Computed Properties
  private get formattedDate() {
    if (this.value) {
      return moment(this.value, 'YYYY-MM-DD').format('MMMM Do YYYY');
    }
    return '';
  }

  // Methods
  private onInput(newValue: string) {
    console.log(newValue);
    this.$emit('input', newValue);
  }
}
</script>

<style lang="scss" scoped>
.a-date {
  position: relative;
  margin-top: 6px;
  margin-bottom: 4px;
  .label {
    color: rgba(0,0,0,0.54);
    background-color: transparent;
    cursor: default;
    white-space: nowrap;
    pointer-events: none;
    font-size: 14px;
    height: 14px;
    line-height: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .value {
    color: rgba(0,0,0,0.87);
    background-color: transparent;
    flex: 1 1 auto;
    line-height: 20px;
    padding: 5px 0 8px;
    max-width: 100%;
    min-width: 0px;
    width: 100%;
    max-height: 32px;
    font-size: 16px;
    text-align: left;
  }
}
</style>
