
<template lang="pug">
  AttributeOptions(v-else-if="template === 'options'"
                  :label="label"
                  :disabled="disabled"
                  :readonly="readonly"
                  :items="items"
                  :multi="false"
                  :value="value"
                  @input="onInput")
</template>

<script lang="ts">
import AttributeOptions from '@/components/Attribute/AttributeOptions.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import contries from '@/assets/contries.json';
import { map } from 'lodash';

@Component({
  components: {
    AttributeOptions,
  },
})
export default class AttributeCountry extends Vue {
  @Prop({ default: '' })
  public label!: string;
  @Prop({ default: false })
  public readonly!: boolean;
  @Prop({ default: false })
  public disabled!: boolean;
  @Prop({ default: false })
  public multi!: boolean;
  @Prop({ default: '' })
  public value!: string;

  private items = map(contries, (c) => c.name );

  // Methods
  private onInput(newValue: string) {
    this.$emit('input', newValue);
  }
};
</script>

<style lang="scss" scoped>
</style>
