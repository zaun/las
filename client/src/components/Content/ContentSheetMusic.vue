<template lang="pug">
  .c-sheetmusic.avoid-break(v-if="readonly && value")
    .title.font-weight-bold(v-if="header == 1") {{ label }}
    .subheading.font-weight-bold(v-if="header == 2") {{ label }}
    div(ref="music")

  .c-sheetmusic(v-else-if="!readonly")
    v-textarea(auto-grow
                :disabled="disabled"
                :hide-details="disabled"
                :label="label"
                :value="value"
                @input="onInput")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import abcjs from "abcjs";

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
  
  @Watch('value', { immediate: true })
  private onValueUpdate(a, b) {
    if (this.readonly) {
      abcjs.renderAbc(this.$refs.music, this.value, {});
    }
  }

  @Watch('readonly', { immediate: true })
  private onReadonlyUpdate() {
    if (this.readonly) {
      setTimeout(() => {
        abcjs.renderAbc(this.$refs.music, this.value, {});
      });
    }
  }

  // Methods
  private onInput(newValue: string) {
    this.$emit('input', newValue);
  }

  private mounted() {
    if (this.readonly) {
      abcjs.renderAbc(this.$refs.music, this.value, {});
    }
  }
};
</script>

<style lang="scss" scoped>
.c-sheetmusic {
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
