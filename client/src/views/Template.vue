<template lang="pug">
  v-container
    v-layout(v-if="!template" wrap)
      v-flex.text-xs-center(align-center justify-center row)
        v-progress-circular(:width="2" :size="90" indeterminate)
          v-progress-circular(:width="2" :size="75" indeterminate) Loading

    v-layout(v-if="template != null" wrap)
      v-flex.px-2.mb-3(lg5)
        v-card.elevation-5
          v-toolbar.elevation-0(dense :color="themeColor + ' accent-1'")
            v-toolbar-title.headline Attributes
            v-spacer
            v-btn(v-if="isEditMode" @click.stop="addAttribute" fab text small)
              v-icon mdi-plus-circle
          v-card-text(v-if="!isEditMode")
            v-list
              template(v-for="(item, index) in attributes")
                v-list-tile(:key="item.id" :disabled="item.deprecated" avatar)
                  v-list-tile-avatar.min-1.pr-2
                    v-icon(:title="attributeName(item.type)") {{ attributeIcon(item.type) }}
                  v-list-tile-content(v-if="item.type !== 'spacer'") {{ item.name }}
                  v-divider(v-if="item.type === 'spacer'")
          v-card-text(v-if="isEditMode")
            v-list(v-sortable:handle @reorder="dragReorderAttribute")
              template(v-for="(item, index) in attributes")
                v-list-tile(:key="item.id" avatar)
                  v-list-tile-avatar.min-1.pr-2
                    v-icon.handle(:title="attributeName(item.type)") {{ attributeIcon(item.type) }}
                  v-text-field.pa-0.mr-1(v-if="item.type !== 'spacer'" :value="item.name" @input="setAttribute(item, 'name', $event)" :disabled="item.deprecated" :counter="attributeCount(item.type)")
                  v-divider(v-if="item.type === 'spacer'")
                  v-list-tile-avatar.min-1(v-if="item.type !== 'spacer'")
                    v-icon(v-if="attributeHasOptions(item.type)" @click="doShowAttributeOptions(item)") mdi-tune
                  v-list-tile-avatar.min-1(v-if="item.type !== 'spacer'")
                    v-icon(v-if="item.deprecated" @click.stop="deprecateAttributeToggle(item)") mdi-checkbox-blank-outline
                    v-icon(v-if="!item.deprecated" @click.stop="deprecateAttributeToggle(item)") mdi-checkbox-marked-outline

      v-flex.px-2(lg7)
        v-card.elevation-5
          v-toolbar.elevation-0(dense :color="themeColor + ' accent-1'")
            v-toolbar-title.headline Sections
            v-spacer
            v-btn(v-if="isEditMode" @click.stop="addSection" fab text small)
              v-icon mdi-plus-circle
          v-card-text(v-if="!isEditMode")
            v-list
              template(v-for="(item, index) in sections")
                v-list-tile(:key="item.id" :disabled="item.deprecated" avatar)
                  v-list-tile-avatar.min-1.pr-2
                    v-icon(:title="sectionName(item.type)") {{ sectionIcon(item.type) }}
                  span.text-xs-center.min-1 {{ item.header == 1 ? 'I' : 'II' }}
                  v-list-tile-content {{ item.name }}
                  span.ml-2.text-xs-center.min-4 {{ sectionSize(item.size) }}
          v-card-text(v-if="isEditMode")
            v-list(v-sortable:handle @reorder="dragReorderSection")
              template(v-for="(item, index) in sections")
                v-list-tile(:key="item.id" avatar)
                  v-list-tile-avatar.min-1.pr-2
                    v-icon.handle(:title="sectionName(item.type)") {{ sectionIcon(item.type) }}
                  v-btn.min-1.mr-2(icon @click="toggleHeader(item)" :disabled="item.deprecated")
                    span(v-if="item.header == 1") I
                    span(v-if="item.header == 2") II
                  v-text-field.pa-0.mx-2(:value="item.name" @input="setSection(item, 'name', $event)" :disabled="item.deprecated" :counter="sectionCount(item.type)")
                  v-select.pa-0.max-5(:value="item.size" @input="setSection(item, 'size', $event)" :items="sectionSizes" :disabled="item.deprecated" dense)
                  v-list-tile-avatar.min-1
                    v-icon(v-if="sectionHasOptions(item.type)" @click="doShowSectionOptions(item)") mdi-tune
                  v-list-tile-avatar.min-1
                    v-icon(v-if="item.deprecated" @click.stop="deprecateSectionToggle(item)") mdi-checkbox-blank-outline
                    v-icon(v-if="!item.deprecated" @click.stop="deprecateSectionToggle(item)") mdi-checkbox-marked-outline

    v-dialog(v-model="showAttributeOptions" v-if="currentAttribute != null", persistent, width=450)
      v-card
        v-card-title.title {{ currentAttribute.name || attributeName(currentAttribute.type) }} Settigns
        v-card-text.body-1(v-if="currentAttribute.type === 'options'")
          .body-1 These are the options the user can shoose from:
          v-layout(v-for="(item, index) in currentAttribute.data.items")
            v-flex(xs10)
              v-text-field(:value="item" disabled)
            v-flex.text-xs-center(xs2)
              v-btn(fab small @click="currentAttribute.data.items.splice(index, 1)")
                v-icon mdi-delete
          v-layout
            v-flex(xs10)
              v-text-field(v-model="temp.input")
            v-flex.text-xs-center(xs2)
              v-btn(fab small @click="currentAttribute.data.items.push(temp.input); temp.input = ''")
                v-icon mdi-plus
          v-layout
            v-flex(xs11)
              v-checkbox(:input-value="currentAttribute.data.multi" @click.stop="currentAttribute.data.multi = !currentAttribute.data.multi" label="Can select multiple items" hide-details)
        v-divider
        v-card-actions
          v-spacer
          v-btn(@click="closeAttributeOptions") Close

    v-dialog(v-model="showSectionOptions" v-if="currentSection != null", persistent, width=450)
      v-card
        v-card-title.title {{ currentSection.name || sectionName(currentSection.type) }} Settigns
        v-card-text.body-1(v-if="currentSection.type === 'datatable'")
          .body-1 These are the data columns:
          v-layout(v-for="(item, index) in currentSection.data.cols")
            v-flex(xs4)
              v-text-field(:value="item.title")
            v-flex.pl-2(xs3)
              v-text-field(:value="item.name" disabled)
            v-flex.pl-2(xs3)
              v-text-field(:value="item.type" disabled)
            v-flex.text-xs-center(xs2)
              v-btn(fab small @click="currentSection.data.cols.splice(index, 1)")
                v-icon mdi-delete
          v-layout
            v-flex(xs4)
              v-text-field(v-model="temp.title" label="Title")
            v-flex.pl-2(xs3)
              v-text-field(v-model="temp.name" label="Data Name")
            v-flex.pl-2(xs3)
              v-select(v-model="temp.type" :items="['String', 'Number', 'Date']" label="Type")
            v-flex.text-xs-center(xs2)
              v-btn(fab small @click="currentSection.data.cols.push({ title: temp.title, name: temp.name, type: temp.type }); temp.title = ''; temp.type = ''; temp.name = ''")
                v-icon mdi-plus
        v-divider
        v-card-actions
          v-spacer
          v-btn(@click="closeSectionOptions") Close
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { cloneDeep, find, maxBy } from 'lodash';

@Component
export default class Template extends Vue {
  attributeTypes: Array<object> = [
    { text: 'Date', value: 'date', icon: 'mdi-calendar' },
    { text: 'Duration', value: 'duration', icon: 'mdi-timer-10' },
    { text: 'Image', value: 'image', icon: 'mdi-image' },
    { text: 'Name', value: 'name', icon: 'mdi-account-card-details' },
    { text: 'Number', value: 'number', icon: 'mdi-numeric' },
    { text: 'Options', value: 'options', icon: 'mdi-check-box-multiple-outline', options: true },
    { text: 'Spacer', value: 'spacer', icon: 'mdi-minus' },
    { text: 'Text', value: 'string', icon: 'mdi-format-text' },
    { text: 'Armed Forces', value: 'aremedforces', icon: 'mdi-tank' }
  ];

  sectionTypes: Array<object> = [
    { text: 'Data Table', value: 'datatable', icon: 'mdi-table-large', options: true  },
    { text: 'Text', value: 'text', icon: 'mdi-format-text' },
  ];

  sectionSizes: Array<object> = [
    { text: 'Full', value: 'full' },
    { text: 'Half', value: 'half' },
  ];

  private showAttributeOptions = false;
  private currentAttribute = null;
  private showSectionOptions = false;
  private currentSection = null;
  private temp = {};

  // Computed Properties
  private get themeColor() {
    return this.$store.getters['session/themeColor'];
  }

  private get attributes() {
    return this.template.attributes;
  }

  private get attributeHeaders () {
    if (this.isEditMode) {
      return [
        { text: '', value: 'reorder', align: 'center', sortable: false },
        { text: 'Title', value: 'title', align: 'left', sortable: false },
        { text: 'Type', value: 'type', align: 'left', sortable: false },
        { text: '', value: 'options', align: 'center', sortable: false },
        { text: 'Active', value: 'delete', align: 'center', sortable: false }
      ];
    }

    return [
      { text: 'Title', value: 'title', align: 'left', sortable: false },
      { text: 'Type', value: 'type', align: 'left', sortable: false },
      { text: 'Active', value: 'delete', align: 'center', sortable: false }
    ];
  }

  private get isEditMode() {
    return this.$store.getters['session/isEditMode'];
  }

  private get sections() {
    return this.template.sections
  }  

  private get sectionHeaders () {
    if (this.isEditMode) {
      return [
        { text: '', value: 'reorder', align: 'center', sortable: false },
        { text: 'Hdr', value: 'header', align: 'center', sortable: false },
        { text: 'Title', value: 'title', align: 'left', sortable: false },
        { text: 'Type', value: 'type', align: 'left', sortable: false },
        { text: 'Size', value: 'size', align: 'left', sortable: false },
        { text: '', value: 'options', align: 'center', sortable: false },
        { text: 'Active', value: 'delete', align: 'center', sortable: false }
      ];
    }

    return [
      { text: 'Hdr', value: 'header', align: 'center', sortable: false },
      { text: 'Title', value: 'title', align: 'left', sortable: false },
      { text: 'Type', value: 'type', align: 'left', sortable: false },
      { text: 'Size', value: 'size', align: 'left', sortable: false },
      { text: 'Active', value: 'delete', align: 'center', sortable: false }
    ];
  }

  private get template() {
    return this.$store.state.session.template;
  }

  @Watch('$route', { immediate: true, deep: true })
  private fetchTemplate() {
    this.$store.dispatch('session/loadTemplate', this.$route.params.name);
  }

  private addAttribute() {
    let max = {
      id: 0
    };
    if (this.attributes.length) {
      max = maxBy(this.attributes, (o) => o.id);
    }

    this.$store.commit('session/setTemplateAttribute', {
      new: true,
      id: max.id + 1,
      type: 'string'
    });
  }

  private addSection() {
    let max = {
      id: 0
    };
    if (this.sections.length) {
      max = maxBy(this.sections, (o) => o.id);
    }

    this.$store.commit('session/setTemplateSection', {
      new: true,
      header: 1,
      id: max.id + 1,
      type: 'text',
      size: 'full'
    });
  }

  private attributeCount(type: string) {
    if (type === 'spacer') {
      return null;
    }
    return 25;
  }

  private attributeName(type: string) {
    const attr = find(this.attributeTypes, { value: type });
    if (attr) {
      return attr.text;
    }
    return type;
  }

  private attributeIcon(type: string) {
    const attr = find(this.attributeTypes, { value: type });
    if (attr) {
      return attr.icon;
    }
    return type;
  }

  private attributeHasOptions(type: string) {
    const attr = find(this.attributeTypes, { value: type });
    if (attr) {
      return attr.options || false;
    }
    return type;
  }

  private closeAttributeOptions() {
    this.$store.commit('session/setTemplateAttribute', this.currentAttribute);
    this.currentAttribute = null;
    this.showAttributeOptions = false;
  }

  private closeSectionOptions() {
    this.$store.commit('session/setTemplateSection', this.currentSection);
    this.currentSection = null;
    this.showSectionOptions = false;
  }

  private deprecateAttributeToggle(item) {
    item.deprecated = item.deprecated ? false : true;
    this.$store.commit('session/setTemplateAttribute', item);
  }

  deprecateSectionToggle(item) {
    item.deprecated = item.deprecated ? false : true;
    this.$store.commit('session/setTemplateSection', item);
  }

  private dragReorderAttribute(data: object) {
    this.$store.commit('session/moveTemplateAttribute', data)
  }

  private dragReorderSection(data: object) {
    this.$store.commit('session/moveTemplateSection', data)
  }

  private sectionCount(type: string) {
    return 35;
  }

  private sectionHasOptions(type: string) {
    const section = find(this.sectionTypes, { value: type });
    if (section) {
      return !!section.options;
    }
    return false;
  }

  private sectionName(type: string) {
    const section = find(this.sectionTypes, { value: type });
    if (section) {
      return section.text;
    }
    return type;
  }

  private sectionIcon(type: string) {
    const section = find(this.sectionTypes, { value: type });
    if (section) {
      return section.icon;
    }
    return type;
  }

  private sectionSize(size: string) {
    const section = find(this.sectionSizes, { value: size });
    if (section) {
      return section.text;
    }
    return size || 'Full';
  }

  private setAttribute(item, prop, value) {
    item[prop] = value;
    this.$store.commit('session/setTemplateAttribute', item);
  }

  private setSection(item, prop, value) {
    item[prop] = value;
    this.$store.commit('session/setTemplateSection', item);
  }

  private doShowAttributeOptions(item) {
    this.currentAttribute = cloneDeep(item);
    if (this.currentAttribute.type === 'options' && !this.currentAttribute.data) {
      this.$set(this.currentAttribute, 'data', {
        mulit: false,
        items: []
      });
    }

    this.temp = {};
    this.showAttributeOptions = true;
  }

  private doShowSectionOptions(item) {
    this.currentSection = cloneDeep(item);
    if (this.currentSection.type === 'datatable' && !this.currentSection.data) {
      this.$set(this.currentSection, 'data', {
        cols: []
      });
    }

    this.temp = {};
    this.showSectionOptions = true;
  }

  private toggleHeader(item) {
    if (item.header === 1) {
      item.header = 2
    } else {
      item.header = 1
    }
    this.$store.commit('session/setTemplateSection', item);
  }
}
</script>

<style lang="scss">
// .td-icon {
//   width: 1em;
//   text-align: center;
// }
// .td-checkbox {
//   width: 1em;
//   .v-input {
//     justify-content: center;
//   }
// }
// .td-size {
//   width: 5em;
//   text-align: center;
// }
// .td-header {
//   width: 3em;
//   text-align: center;
// }
// .typeHeader {
//   width: 13em;
// }
// table.v-table thead td:not(:nth-child(1)), table.v-table tbody td:not(:nth-child(1)), table.v-table thead th:not(:nth-child(1)), table.v-table tbody th:not(:nth-child(1)), table.v-table thead td:first-child, table.v-table tbody td:first-child, table.v-table thead th:first-child, table.v-table tbody th:first-child {
//   padding: 0px;
// }
// .v-btn--small {
//   padding: 0;
//   margin: 0;
//   width: 20px !important;
//   height: 20px !important;
// }
// .v-input {
//   font-size: 14px !important;
//   input {
//     padding: 4px 0 4px
//   }
//   .v-input--selection-controls__input {
//     margin: 0px
//   }
// }
// .handle {
//   cursor: move;
// }
// .v-select {
//   font-size: 14px !important;
//   input {
//     padding: 4px 0 4px
//   }
//   .v-select__selection {
//     margin: 4px 0 4px
//   }
// }
</style>
