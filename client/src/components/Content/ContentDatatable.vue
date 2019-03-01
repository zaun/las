<template lang="pug">
  .c-datatable.avoid-break(v-if="readonly && data.length")
    .title.font-weight-bold(v-if="header == 1") {{ label }}
      .float-right
        v-btn(small fab text @click="exportData")
          v-icon mdi-json
    .subheading.font-weight-bold(v-if="header == 2") {{ label }}
    v-data-table(:headers="headers" :items="data" :hide-actions="data.length < 10")
      template(slot="footer")
        td(v-for="col in cols")
      template(slot="items" slot-scope="props")
        td(v-for="col in cols")
          Attribute(:type="col.type" v-model="props.item[col.name ? col.name : col.title.toLowerCase()]" :readonly="true")
          //- span {{ props.item[col.name ? col.name : col.title.toLowerCase()] }}

  .c-datatable.edit(v-else-if="!readonly")
    .title.font-weight-bold(v-if="header == 1") {{ label }}
    .subheading.font-weight-bold(v-if="header == 2") {{ label }}
    v-data-table(:headers="headers" :items="data" :hide-actions="data.length < 10")
      template(slot="items" slot-scope="props")
        td.px-2(v-for="col in cols")
          Attribute(:type="col.type" v-model="props.item[col.name ? col.name : col.title.toLowerCase()]" @input="onInput" :readonly="false")
      template(slot="footer")
        td.px-2(v-for="col in cols")
          Attribute(:type="col.type" :label="col.title" v-model="newItem[col.name ? col.name : col.title.toLowerCase()]" :readonly="false")
        td.px-2.col-actions
          v-btn(small text fab @click="addRow")
            v-icon mdi-plus-circle-outline
</template>

<script lang="ts">
import { cloneDeep, map } from 'lodash';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import Attribute from '@/components/Attribute/Attribute.vue';

@Component({
  components: {
    Attribute,
  },
})
export default class ContentDatatable extends Vue {

  // Computed Properties
  private get headers() {
    const headers =  map(this.cols, (i) => {
      return {
        text: i.title,
        value: i.name ? i.name : i.title.toLowerCase(),
        class: `col-${i.type.toLowerCase()}`,
      };
    });
    if (!this.readonly) {
      headers.push({
        text: '',
        value: '',
        class: 'col-actions',
      });
    }
    return headers;
  }
  @Prop({ default: '' })
  public label!: string;
  @Prop({ default: false })
  public readonly!: boolean;
  @Prop({ default: 1 })
  public header!: number;
  @Prop({ default: false })
  public disabled!: boolean;
  @Prop({ default: () => [] })
  public cols!: object[];
  @Prop({ default: () => [] })
  public value!: object[];

  private newItem = {};
  private data: object[] = [];

  @Watch('value')
  public onChildChanged2() {
    this.updateData();
  }


  private saveAs = function(filename: string, data: string) {
    const blob = new Blob([data], {type: 'text/json'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  };

  // Methods
  private exportData() {
    this.saveAs('data.json', JSON.stringify(this.value, null, 2));
  }

  private onInput() {
    console.log(this.data);
    this.$emit('input', this.data);
  }

  private updateData() {
    this.data = cloneDeep(this.value);
  }

  private addRow() {
    console.log(this.newItem);
    this.data.push(this.newItem);
    this.newItem = {};
    this.onInput();
  }

  private created() {
    this.updateData();
  }
}
</script>

<style lang="scss" scoped>
>>> .theme--light.v-datatable {
  background-color: transparent !important;
}

.c-datatable {
  position: relative;
  margin-top: 6px;
  margin-bottom: 4px;
  th, td {
    white-space: nowrap;
  }
  .title {
    border-bottom: 1px solid #bbb;
    height: 30px;
  }
  .body-1 {
    text-align: justify
  }
  .col-actions {
    padding: 0px !important;
    margin: 0px !important;
    width: 2em !important;
  }
  .col-actions > .v-btn {
    padding: 0px !important;
    margin: 0px !important;
    width: 2em !important;
    height: 2em !important;
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
