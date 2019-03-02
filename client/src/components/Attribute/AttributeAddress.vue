<template lang="pug">
  .a-name(v-if="readonly && displayName")
    .label(v-if="label") {{ label }}
    .value(v-html="displayName")

  .a-name(v-else-if="!readonly")
    .label {{ label }}
    //- v-text-field(ref="line1" clearable
    //-             :disabled="disabled"
    //-             :hide-details="disabled"
    //-             :messages="['Line 1']"
    //-             :value="value.line1"
    //-             @focus.native="$event.target.select()"
    //-             @input="onInput('line1', $event)")
    //- v-text-field(ref="line2" clearable
    //-             :disabled="disabled"
    //-             :hide-details="disabled"
    //-             :messages="['Line 2']"
    //-             :value="value.line2"
    //-             @focus.native="$event.target.select()"
    //-             @input="onInput('line2', $event)")
    v-text-field(ref="city" clearable
                :disabled="disabled"
                :hide-details="disabled"
                :messages="['City']"
                :value="value.city"
                @focus.native="$event.target.select()"
                @input="onInput('city', $event)")
    v-text-field(ref="state" clearable
                :disabled="disabled"
                :hide-details="disabled"
                :messages="['State or Province']"
                :value="value.state"
                @focus.native="$event.target.select()"
                @input="onInput('state', $event)")
    v-text-field(ref="postal" clearable
                :disabled="disabled"
                :hide-details="disabled"
                :messages="['Postal Code']"
                :value="value.postal"
                @focus.native="$event.target.select()"
                @input="onInput('postal', $event)")
    AttributeCountry(label="Country"
                      :value="value.country"
                      @input="onInput('country', $event)")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AttributeCountry from '@/components/Attribute/AttributeCountry.vue';

export interface DataValue {
  given: string;
  family: string;
  middle1: string;
  middle2: string;
  suffix: string;
  nickname: string;
  [key: string]: string;
}

@Component({
  components: {
    AttributeCountry
  }
})
export default class AttributeAddress extends Vue {
  @Prop({ default: '' })
  public label!: string;
  @Prop({ default: false })
  public readonly!: boolean;
  @Prop({ default: false })
  public disabled!: boolean;
  @Prop({ default: () => {
    return {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal: '',
      country: '',
    };
  }})
  public value!: DataValue;

  // Computed Properties
  private get displayName() {
    let name = '';
    if (this.value.line1) {
      name += this.value.line1;
    }
    if (this.value.line2) {
      name += name.length ? '<br />' : '';
      name += this.value.line2;
    }
    if (this.value.city) {
      name += name.length ? '<br />' : '';
      name += this.value.city;
    }
    if (this.value.state) {
      name += this.value.city ? ', ' : '';
      name += this.value.state;
    }
    if (this.value.postal) {
      name += this.value.state ? ', ' : '';
      name += this.value.postal;
    }
    if (this.value.country) {
      name += name.length ? '<br />' : '';
      name += this.value.country;
    }
    return name;
  }

  // Methods
  private onInput(key: string, newValue: string) {
    if (key != 'country' && !this.$refs[key].validate(true)) {
      return;
    }
    const ret: DataValue = {
      line1: this.value.line1,
      line2: this.value.line2,
      city: this.value.city,
      state: this.value.state,
      postal: this.value.postal,
      country: this.value.country,
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
    min-height: 32px;
    font-size: 16px;
    text-align: left;
  }
}
</style>
