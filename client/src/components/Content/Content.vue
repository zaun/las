<template lang="pug">
  ContentDatatable(v-if="template === 'datatable'"
              :label="label"
              :disabled="disabled"
              :readonly="readonly"
              :value="value"
              :header="header"
              :cols="data ? data.cols || [] : []"
              @input="onInput")
    
  ContentGraph(v-else-if="template === 'graph'"
              :label="label"
              :disabled="disabled"
              :readonly="readonly"
              :value="value"
              :header="header"
              @input="onInput")
    
  ContentSheetMusic(v-else-if="template === 'sheetmusic'"
              :label="label"
              :disabled="disabled"
              :readonly="readonly"
              :value="value"
              :header="header"
              @input="onInput")
    
  ContentText(v-else-if="template === 'text'"
              :label="label"
              :disabled="disabled"
              :readonly="readonly"
              :value="value"
              :header="header"
              @input="onInput")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ContentDatatable from '@/components/Content/ContentDatatable.vue';
import ContentGraph from '@/components/Content/ContentGraph.vue';
import ContentSheetMusic from '@/components/Content/ContentSheetMusic.vue';
import ContentText from '@/components/Content/ContentText.vue';

@Component({
  components: {
    ContentDatatable,
    ContentGraph,
    ContentSheetMusic,
    ContentText,
  },
})
export default class Content extends Vue {
  @Prop({ default: '' })
  public type!: string;
  @Prop({ default: '' })
  public label!: string;
  @Prop({ default: false })
  public readonly!: boolean;
  @Prop({ default: 1 })
  public header!: number;
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
