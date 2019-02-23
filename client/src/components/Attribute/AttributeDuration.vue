<template lang="pug">
  .a-duration(v-if="readonly && displayValue")
    .label(v-if="label") {{ label }}
    .value {{ displayValue }}

  .a-duration(v-else-if="!readonly")
    .label {{ label }}
    v-container
      v-layout(row)
        v-flex
          v-text-field(ref="y"
                      :disabled="disabled"
                      :hide-details="disabled"
                      :messages="['Years']"
                      :rules="rules.y"
                      type="number"
                      :value="value.y"
                      @input="onInput('y', $event)")
        v-flex
          v-text-field(ref="d"
                      :disabled="disabled"
                      :hide-details="disabled"
                      :messages="['Days']"
                      :rules="rules.d"
                      type="number"
                      :value="value.d"
                      @input="onInput('d', $event)")
        v-flex
          v-text-field(ref="h"
                      :disabled="disabled"
                      :hide-details="disabled"
                      :messages="['Hours']"
                      :rules="rules.h"
                      type="number"
                      :value="value.h"
                      @input="onInput('h', $event)")
        v-flex
          v-text-field(ref="m"
                      :disabled="disabled"
                      :hide-details="disabled"
                      :messages="['Minutes']"
                      :rules="rules.m"
                      type="number"
                      :value="value.m"
                      @input="onInput('m', $event)")
        v-flex
          v-text-field(ref="s"
                      :disabled="disabled"
                      :hide-details="disabled"
                      :messages="['Seconds']"
                      :rules="rules.s"
                      type="number"
                      :value="value.s"
                      @input="onInput('s', $event)")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export interface DataValue {
  y: number;
  d: number;
  h: number;
  m: number;
  s: number;
  [key: string]: number;
}

@Component
export default class AttributeString extends Vue {
  @Prop({ default: '' })
  public label!: string;
  @Prop({ default: false })
  public readonly!: boolean;
  @Prop({ default: false })
  public disabled!: boolean;
  @Prop({ default: () => {
    return { y: 0, d: 0, h: 0, m: 0, s: 0 };
  }})
  public value!: DataValue;

  private hasErrors = false;
  private rules = {
    y: [
      (v: number) => v >= 0 || 'Zero or more',
    ],
    d: [
      (v: number) => v >= 0 || 'Zero or more',
      (v: number) => v <= 364 || '364 or less',
    ],
    h: [
      (v: number) => v >= 0 || 'Zero or more',
      (v: number) => v <= 23 || '23 or less',
    ],
    m: [
      (v: number) => v >= 0 || 'Zero or more',
      (v: number) => v <= 59 || '59 or less',
    ],
    s: [
      (v: number) => v >= 0 || 'Zero or more',
      (v: number) => v <= 59 || '59 or less',
    ],
  };

  // Computed Properties
  private get displayValue() {
    let val: string = '';

    if (this.value.y || val.length) {
      val += `${this.value.y}y `;
    }

    if (this.value.d || val.length) {
      val += `${this.value.d || 0}d `;
    }

    if (this.value.h || val.length) {
      val += `${this.value.h || 0}h `;
    }

    if (this.value.m || val.length) {
      val += `${this.value.m || 0}m `;
    }

    if (this.value.s || val.length) {
      val += `${this.value.s || 0}s `;
    }
    return val;
  }

  // Methods
  private onInput(prop: string, newValue: string) {
    let ret: DataValue = {
      y: this.value.y,
      d: this.value.d,
      h: this.value.h,
      m: this.value.m,
      s: this.value.s,
    };

    ret[prop] = parseInt(newValue);

    this.$emit('input', ret);
  }
};
</script>

<style lang="scss" scoped>
.a-duration {
  position: relative;
  margin-top: 6px;
  margin-bottom: 4px;

  .container {
    padding: 0px;
  }

  .v-text-field {
    padding-top: 0px;
    margin-top: 0px;
    margin-bottom: 6px;
  }
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
