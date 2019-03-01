
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
import AttributeOptions from '@/components/Attribute/AttributeOptions.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    AttributeOptions,
  },
})
export default class AttributeArmedForces extends Vue {
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
    'U.S. Army',
    'U.S. Marine Corps',
    'U.S. Navy',
    'U.S. Air Force',
    'U.S. Coast Guard',
    'U.S. Army National Guard',
    'U.S. Army Reserve',
    'U.S. Marine Corps Reserve',
    'U.S. Navy Reserve',
    'U.S. Air National Guard',
    'U.S. Air Force Reserve',
    'U.S. Coast Guard Reserve',
  ];

  // Methods
  private onInput(newValue: string) {
    this.$emit('input', newValue);
  }
}
</script>

<style lang="scss" scoped>
</style>
