<template lang="pug">
  .c-text.avoid-break(v-if="readonly && value")
    .title.font-weight-bold(v-if="header == 1") {{ label }}
    .subheading.font-weight-bold(v-if="header == 2") {{ label }}
    div.body-1(v-html="clean(value)")

  .c-text(v-else-if="!readonly")
    .title.font-weight-bold(v-if="header == 1") {{ label }}
    .subheading.font-weight-bold(v-if="header == 2") {{ label }}
    v-textarea(auto-grow
                :disabled="disabled"
                :hide-details="disabled"
                :value="value"
                @input="onInput")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ContentText extends Vue {
  @Prop({ default: '' })
  public label!: string;
  @Prop({ default: false })
  public readonly!: boolean;
  @Prop({ default: 1 })
  public header!: number;
  @Prop({ default: false })
  public disabled!: boolean;
  @Prop()
  public value!: string;

  // Computed Properties
  private clean(value: string) {
    return `<p>${value}</p>`.replace(new RegExp('\n\n', 'g'), '</p><p>')
                            .replace(new RegExp('(?!</p>)\n', 'g'), '<br />\n');
  }

  // Methods
  private onInput(newValue: string) {
    this.$emit('input', newValue);
  }
};
</script>

<style lang="scss" scoped>
.c-text {
  position: relative;
  margin-top: 6px;
  margin-bottom: 4px;
  .title {
    border-bottom: 1px solid #bbb
  }
  .label {
    color: rgba(0,0,0,0.54);
    background-color: transparent;
    cursor: default;
    white-space: nowrap;
    pointer-events: none;
    font-size: 12px;
    height: 12px;
    line-height: 12px;
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
