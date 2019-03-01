<template lang="pug">
  .c-sheetmusic.avoid-break(v-if="readonly && value")
    .title.font-weight-bold(v-if="header == 1") {{ label }}
    .subheading.font-weight-bold(v-if="header == 2") {{ label }}
    Mermaid(:value="value")

  .c-sheetmusic(v-else-if="!readonly")
    .title.font-weight-bold(v-if="header == 1") {{ label }}
    .subheading.font-weight-bold(v-if="header == 2") {{ label }}
    v-textarea(auto-grow
                :disabled="disabled"
                :hide-details="disabled"
                :value="value"
                @input="onInput")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import Mermaid from '@/components/Mermaid.vue';

@Component({
  components: {
    Mermaid,
  },
})
export default class ContentGraph extends Vue {
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

  // Methods
  private onInput(newValue: string) {
    this.$emit('input', newValue);
  }
}
</script>

<style lang="scss" scoped>
.c-sheetmusic {
  position: relative;
  margin-top: 6px;
  margin-bottom: 4px;
  .title {
    border-bottom: 1px solid #bbb;
    height: 30px;
  }
}
</style>
