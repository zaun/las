<template lang="pug">
  div(ref="graph")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import mermaid from 'mermaid';

@Component
export default class Mermaid extends Vue {
  @Prop()
  public value!: string;
  
  @Watch('value', { immediate: false })
  private onValueUpdate(n, o) {
    if (n !== o) {
      this.$refs.graph.innerHTML = '';
      mermaid.mermaidAPI.render('a', this.value, (svgCode: string) => {
        this.$refs.graph.innerHTML = svgCode;
      });
    }
  }

  private mounted() {
    if (!this.value) {
      return;
    }
    mermaid.mermaidAPI.render('a', this.value, (svgCode: string) => {
      this.$refs.graph.innerHTML = svgCode;
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
