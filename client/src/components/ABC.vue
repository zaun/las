<template lang="pug">
  div(ref="music")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import abcjs from 'abcjs';

@Component
export default class Mermaid extends Vue {
  @Prop()
  public value!: string;
  
  @Watch('value', { immediate: false })
  private onValueUpdate(n, o) {
    if (n !== o) {
      abcjs.renderAbc(this.$refs.music, this.value, {});
    }
  }

  private mounted() {
    if (!this.value) {
      return;
    }
    abcjs.renderAbc(this.$refs.music, this.value, {});
  }
};
</script>

<style lang="scss" scoped>
</style>
