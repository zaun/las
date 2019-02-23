<template lang="pug">
  .spacer.my-3.pb-2.px-5(v-if="template === 'spacer'")
    v-divider

  AttributeArmedForces(v-else-if="template === 'aremedforces'"
                  :label="label"
                  :disabled="disabled"
                  :readonly="readonly"
                  :value="value"
                  @input="onInput")

  AttributeDate(v-else-if="template === 'date'"
                :label="label"
                :disabled="disabled"
                :readonly="readonly"
                :value="value"
                @input="onInput")

  AttributeDuration(v-else-if="template === 'duration'"
                    :label="label"
                    :disabled="disabled"
                    :readonly="readonly"
                    :value="value"
                    @input="onInput")

  AttributeName(v-else-if="template === 'name'"
                :label="label"
                :disabled="disabled"
                :readonly="readonly"
                :value="value"
                @input="onInput")

  AttributeNumber(v-else-if="template === 'number'"
                  :label="label"
                  :disabled="disabled"
                  :readonly="readonly"
                  :value="value"
                  @input="onInput")

  AttributeOptions(v-else-if="template === 'options'"
                  :label="label"
                  :disabled="disabled"
                  :readonly="readonly"
                  :items="data ? data.items || [] : []"
                  :multi="data ? data.multi : false"
                  :value="value"
                  @input="onInput")

  AttributeString(v-else-if="template === 'string'"
                  :label="label"
                  :disabled="disabled"
                  :readonly="readonly"
                  :value="value"
                  @input="onInput")

  .spacer(v-else) {{ template }}

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AttributeDate from '@/components/Attribute/AttributeDate.vue';
import AttributeDuration from '@/components/Attribute/AttributeDuration.vue';
import AttributeName from '@/components/Attribute/AttributeName.vue';
import AttributeOptions from '@/components/Attribute/AttributeOptions.vue';
import AttributeNumber from '@/components/Attribute/AttributeNumber.vue';
import AttributeString from '@/components/Attribute/AttributeString.vue';
import AttributeArmedForces from '@/components/Attribute/AttributeArmedForces.vue';

@Component({
  components: {
    AttributeDate,
    AttributeDuration,
    AttributeName,
    AttributeOptions,
    AttributeNumber,
    AttributeString,
    AttributeArmedForces
  },
})
export default class Attribute extends Vue {
  @Prop({ default: '' })
  public type!: string;
  @Prop({ default: '' })
  public label!: string;
  @Prop({ default: false })
  public readonly!: boolean;
  @Prop({ default: false })
  public disabled!: boolean;
  @Prop()
  public value!: any;
  @Prop()
  public data!: any;

  // Computed Properties
  private get template() {
    return this.type.toLowerCase();
  }

  // Methods
  private onInput(newValue: string) {
    this.$emit('input', newValue);
  }
}
</script>

<style lang="scss" scoped>
</style>
