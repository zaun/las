
<template lang="pug">
  AttributeOptions(v-else-if="template === 'options'"
                  :label="label"
                  :disabled="disabled"
                  :readonly="readonly"
                  :items="items"
                  :multi="true"
                  :value="value"
                  @input="onInput")
</template>

<script lang="ts">
import AttributeOptions from '@/components/AttributeOptions.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    AttributeOptions,
  },
})
export default class AttributeUSArmedForces extends Vue {
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

  private items = [
    'Army',
    'Marine Corps',
    'Navy',
    'Air Force',
    'Coast Guard',
    'Army National Guard',
    'Army Reserve',
    'Marine Corps Reserve',
    'Navy Reserve',
    'Air National Guard',
    'Air Force Reserve',
    'Coast Guard Reserve'
  ]

  // Methods
  private onInput(newValue: string) {
    this.$emit('input', newValue);
  }
};
</script>

<style lang="scss" scoped>
</style>
