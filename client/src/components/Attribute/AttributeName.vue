<template lang="pug">
  .a-name(v-if="readonly && displayName")
    .label(v-if="label") {{ label }}
    .value {{ displayName }}

  .a-name(v-else-if="!readonly")
    .label {{ label }}
    v-text-field(ref="given" clearable
                :disabled="disabled"
                :hide-details="disabled"
                :messages="['Given Name']"
                :value="value.given"
                @focus.native="$event.target.select()"
                @input="onInput('given', $event)")
    v-text-field(ref="middle1" clearable
                :disabled="disabled"
                :hide-details="disabled"
                :messages="['First Middle Name']"
                :value="value.middle1"
                @focus.native="$event.target.select()"
                @input="onInput('middle1', $event)")
    v-text-field(ref="middle2" clearable
                :disabled="disabled"
                :hide-details="disabled"
                :messages="['Second Middle Name']"
                :value="value.middle2"
                @focus.native="$event.target.select()"
                @input="onInput('middle2', $event)")
    v-layout
      v-flex(xs9)
        v-text-field(ref="family" clearable
                    :disabled="disabled"
                    :hide-details="disabled"
                    :messages="['Family Name']"
                    :value="value.family"
                    @focus.native="$event.target.select()"
                    @input="onInput('family', $event)")
      v-flex(xs3)
        v-combobox(ref="suffix" clearable
              :value="value.suffix"
              :items="suffixItems"
              :messages="['Suffix']"
              @input="onInput('suffix', $event)")
    v-text-field(ref="nickname" clearable
                :disabled="disabled"
                :hide-details="disabled"
                :messages="['Nickname']"
                :value="value.nickname"
                @focus.native="$event.target.select()"
                @input="onInput('nickname', $event)")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export interface DataValue {
  given: string;
  family: string;
  middle1: string;
  middle2: string;
  suffix: string;
  nickname: string;
  [key: string]: string;
}

@Component
export default class AttributeName extends Vue {
  @Prop({ default: '' })
  public label!: string;
  @Prop({ default: false })
  public readonly!: boolean;
  @Prop({ default: false })
  public disabled!: boolean;
  @Prop({ default: () => {
    return {
      given: '',
      family: '',
      middle1: '',
      middle2: '',
      suffix: '',
      nickname: '',
    };
  }})
  public value!: DataValue;

  private suffixItems: string[] = [
    'Jr.',
    'Sr.',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
  ];

  // Computed Properties
  private get displayName() {
    let name = '';
    if (this.value.given) {
      name += this.value.given;
    }
    if (this.value.middle1) {
      name += name.length ? ' ' : '';
      name += this.value.middle1;
    }
    if (this.value.middle2) {
      name += name.length ? ' ' : '';
      name += this.value.middle2;
    }
    if (this.value.nickname) {
      name += name.length ? ' ' : '';
      name += '"' + this.value.nickname + '"';
    }
    if (this.value.family) {
      name += name.length ? ' ' : '';
      name += this.value.family;
    }
    if (this.value.suffix) {
      name += name.length ? ' ' : '';
      name += this.value.suffix;
    }
    return name;
  }

  // Methods
  private onInput(key: string, newValue: string) {
    if (!this.$refs[key].validate(true)) {
      return;
    }
    const ret: DataValue = {
      given: this.value.given,
      family: this.value.family,
      middle1: this.value.middle1,
      middle2: this.value.middle2,
      suffix: this.value.suffix,
      nickname: this.value.nickname,
    };
    ret[key] = newValue;
    this.$emit('input', ret);
  }
}
</script>

<style lang="scss" scoped>
.a-name {
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
