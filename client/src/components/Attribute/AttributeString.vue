<template lang="pug">
  .a-string(v-if="readonly && value")
    .label(v-if="label") {{ label }}
    .value {{ value }}

  .a-string(v-else-if="!readonly")
    v-text-field(clearable
                :disabled="disabled"
                :hide-details="disabled"
                :label="label"
                :value="value"
                @focus.native="$event.target.select()"
                @input="onInput")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AttributeString extends Vue {
  @Prop({ default: '' })
  public label!: string;
  @Prop({ default: false })
  public readonly!: boolean;
  @Prop({ default: false })
  public disabled!: boolean;
  @Prop({ default: '' })
  public value!: string;

  // Methods
  private onInput(newValue: string) {
    this.$emit('input', newValue);
  }
}
</script>

<style lang="scss" scoped>
.a-string {
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
