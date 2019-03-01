<template lang="pug">
  v-container
    v-layout(v-if="!template && !notFound" wrap)
      v-flex.text-xs-center(align-center justify-center row)
        v-progress-circular(:width="2" :size="90" indeterminate)
          v-progress-circular(:width="2" :size="75" indeterminate) Loading

    v-layout(v-if="!template && notFound" wrap)
      v-flex.text-xs-center(align-center justify-center row)
        | 404

    v-layout(v-if="template != null" wrap)
      v-flex.px-2.mb-3(lg5)
        v-card.elevation-5
          v-toolbar.elevation-0(dense :color="themeColor + ' accent-1'")
            v-toolbar-title.headline Attributes
            v-spacer
            v-btn(v-if="isEditMode" @click.stop="showNewAttribute = true" fab text small)
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
            v-btn(v-if="isEditMode" @click.stop="showNewSection = true" fab text small)
              v-icon mdi-plus-circle
          v-card-text(v-if="!isEditMode")
            v-list
              template(v-for="(item, index) in sections")
                v-list-tile(:key="item.id" :disabled="item.deprecated" avatar)
                  v-list-tile-avatar.min-1.pr-2
                    v-icon(:title="sectionName(item.type)") {{ sectionIcon(item.type) }}
                  //- span.text-xs-center.min-1 {{ item.header == 1 ? 'I' : 'II' }}
                  v-list-tile-content {{ item.name }}
                  span.ml-2.text-xs-center.min-4 {{ sectionSize(item.size) }}
          v-card-text(v-if="isEditMode")
            v-list(v-sortable:handle @reorder="dragReorderSection")
              template(v-for="(item, index) in sections")
                v-list-tile(:key="item.id" avatar)
                  v-list-tile-avatar.min-1.pr-2
                    v-icon.handle(:title="sectionName(item.type)") {{ sectionIcon(item.type) }}
                  //- v-btn.min-1.mr-2(icon @click="toggleHeader(item)" :disabled="item.deprecated")
                  //-   span(v-if="item.header == 1") I
                  //-   span(v-if="item.header == 2") II
                  v-text-field.pa-0.mx-2(:value="item.name" @input="setSection(item, 'name', $event)" :disabled="item.deprecated" :counter="sectionCount(item.type)")
                  v-select.pa-0.max-5(:value="item.size" @input="setSection(item, 'size', $event)" :items="sectionSizes" :disabled="item.deprecated" dense)
                  v-list-tile-avatar.min-1
                    v-icon(v-if="sectionHasOptions(item.type)" @click="doShowSectionOptions(item)") mdi-tune
                  v-list-tile-avatar.min-1
                    v-icon(v-if="item.deprecated" @click.stop="deprecateSectionToggle(item)") mdi-checkbox-blank-outline
                    v-icon(v-if="!item.deprecated" @click.stop="deprecateSectionToggle(item)") mdi-checkbox-marked-outline

    DialogNewAttribute(v-model="showNewAttribute" @add="doAddAttribute")
    DialogNewSection(v-model="showNewSection" @add="doAddSection")
    DailogAttributeOptions(v-model="showAttributeOptions" :item="currentAttribute" @change="closeAttributeOptions")
    DailogSectionOptions(v-model="showSectionOptions" :item="currentSection" @change="closeSectionOptions")

</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { cloneDeep, find, maxBy } from 'lodash';
import DailogAttributeOptions from '@/components/Dialogs/DailogAttributeOptions.vue';
import DialogNewAttribute from '@/components/Dialogs/DialogNewAttribute.vue';
import DialogNewSection from '@/components/Dialogs/DialogNewSection.vue';
import DailogSectionOptions from '@/components/Dialogs/DailogSectionOptions.vue';
import attributeTypes from '@/assets/attributeTypes.json';
import sectionTypes from '@/assets/sectionTypes.json';
import sectionSizes from '@/assets/sectionSizes.json';
import { AttributeTypeData, ListData, SectionTypeData, TemplateAttributeData, TemplateSectionData } from '@/types/data';

@Component({
  components: {
    DailogAttributeOptions,
    DialogNewAttribute,
    DialogNewSection,
    DailogSectionOptions,
  },
})
export default class Template extends Vue {
  attributeTypes: Array<AttributeTypeData> = attributeTypes;
  sectionTypes: Array<SectionTypeData> = sectionTypes;
  sectionSizes: Array<ListData> = sectionSizes;

  notFound = false;
  showNewAttribute = false;
  showNewSection = false;
  showAttributeOptions = false;
  currentAttribute: TemplateAttributeData | null = null;
  showSectionOptions = false;
  currentSection: TemplateSectionData | null = null;

  // Computed Properties
  get themeColor() {
    return this.$store.getters['session/themeColor'];
  }

  get attributes() {
    return this.template.attributes;
  }

  get attributeHeaders() {
    if (this.isEditMode) {
      return [
        { text: '', value: 'reorder', align: 'center', sortable: false },
        { text: 'Title', value: 'title', align: 'left', sortable: false },
        { text: 'Type', value: 'type', align: 'left', sortable: false },
        { text: '', value: 'options', align: 'center', sortable: false },
        { text: 'Active', value: 'delete', align: 'center', sortable: false },
      ];
    }

    return [
      { text: 'Title', value: 'title', align: 'left', sortable: false },
      { text: 'Type', value: 'type', align: 'left', sortable: false },
      { text: 'Active', value: 'delete', align: 'center', sortable: false },
    ];
  }

  get isEditMode() {
    return this.$store.getters['session/isEditMode'];
  }

  get sections() {
    return this.template.sections;
  }

  get sectionHeaders() {
    if (this.isEditMode) {
      return [
        { text: '', value: 'reorder', align: 'center', sortable: false },
        { text: 'Hdr', value: 'header', align: 'center', sortable: false },
        { text: 'Title', value: 'title', align: 'left', sortable: false },
        { text: 'Type', value: 'type', align: 'left', sortable: false },
        { text: 'Size', value: 'size', align: 'left', sortable: false },
        { text: '', value: 'options', align: 'center', sortable: false },
        { text: 'Active', value: 'delete', align: 'center', sortable: false },
      ];
    }

    return [
      { text: 'Hdr', value: 'header', align: 'center', sortable: false },
      { text: 'Title', value: 'title', align: 'left', sortable: false },
      { text: 'Type', value: 'type', align: 'left', sortable: false },
      { text: 'Size', value: 'size', align: 'left', sortable: false },
      { text: 'Active', value: 'delete', align: 'center', sortable: false },
    ];
  }

  get template() {
    return this.$store.state.session.template;
  }

  @Watch('$route', { immediate: true, deep: true })
  fetchTemplate() {
    this.$store.dispatch('session/loadTemplate', this.$route.params.name).then((ok) => {
      this.notFound = false;
      if (!ok) {
        this.notFound = true;
      }
    });
  }

  attributeCount(type: string) {
    if (type === 'spacer') {
      return null;
    }
    return 25;
  }

  attributeName(type: string) {
    const attr = find(this.attributeTypes, { value: type });
    if (attr) {
      return attr.text;
    }
    return type;
  }

  attributeIcon(type: string) {
    const attr = find(this.attributeTypes, { value: type });
    if (attr) {
      return attr.icon;
    }
    return type;
  }

  attributeHasOptions(type: string) {
    const attr = find(this.attributeTypes, { value: type });
    if (attr) {
      return attr.options || false;
    }
    return type;
  }

  closeAttributeOptions() {
    this.$store.commit('session/setTemplateAttribute', this.currentAttribute);
    this.currentAttribute = null;
  }

  closeSectionOptions() {
    this.$store.commit('session/setTemplateSection', this.currentSection);
    this.currentSection = null;
  }

  deprecateAttributeToggle(item: AttributeTypeData) {
    item.deprecated = item.deprecated ? false : true;
    this.$store.commit('session/setTemplateAttribute', item);
  }

  deprecateSectionToggle(item: SectionTypeData) {
    item.deprecated = item.deprecated ? false : true;
    this.$store.commit('session/setTemplateSection', item);
  }

  doAddAttribute(options: TemplateAttributeData) {
    let max: number = 0;
    if (this.attributes.length) {
      max = (<TemplateAttributeData>maxBy(this.attributes, (o) => o.id)).id;
    }

    this.$store.commit('session/setTemplateAttribute', {
      new: true,
      id: max + 1,
      type: options.type,
      name: options.name,
    });

    this.showNewAttribute = false;
  }

  doAddSection(options: TemplateSectionData) {
    let max: number = 0;
    if (this.sections.length) {
      max = (<TemplateSectionData>maxBy(this.sections, (o) => o.id)).id;
    }

    this.$store.commit('session/setTemplateSection', {
      new: true,
      id: max + 1,
      header: options.header,
      type: options.type,
      size: options.size,
      name: options.name,
    });
  }

  dragReorderAttribute(data: object) {
    this.$store.commit('session/moveTemplateAttribute', data);
  }

  dragReorderSection(data: object) {
    this.$store.commit('session/moveTemplateSection', data);
  }

  sectionCount(type: string) {
    return 35;
  }

  sectionHasOptions(type: string) {
    const section = find(this.sectionTypes, { value: type });
    if (section) {
      return !!section.options;
    }
    return false;
  }

  sectionName(type: string) {
    const section = find(this.sectionTypes, { value: type });
    if (section) {
      return section.text;
    }
    return type;
  }

  sectionIcon(type: string) {
    const section = find(this.sectionTypes, { value: type });
    if (section) {
      return section.icon;
    }
    return type;
  }

  sectionSize(size: string) {
    const section = find(this.sectionSizes, { value: size });
    if (section) {
      return section.text;
    }
    return size || 'Full';
  }

  setAttribute(item: TemplateAttributeData, prop: string, value: string | number) {
    item[prop] = value;
    this.$store.commit('session/setTemplateAttribute', item);
  }

  setSection(item: TemplateSectionData, prop: string, value: string | number) {
    item[prop] = value;
    this.$store.commit('session/setTemplateSection', item);
  }

  doShowAttributeOptions(item: TemplateAttributeData) {
    this.currentAttribute = cloneDeep(item);
    if (this.currentAttribute.type === 'options' && !this.currentAttribute.data) {
      this.currentAttribute.data = {
        mulit: false,
        options: [],
      };
    }
    this.showAttributeOptions = true;
  }

  doShowSectionOptions(item: TemplateSectionData) {
    this.currentSection = cloneDeep(item);
    if (this.currentSection.type === 'datatable' && !this.currentSection.data) {
      this.currentSection.data = {
        cols: [],
      };
    }
    this.showSectionOptions = true;
  }

  toggleHeader(item: TemplateSectionData) {
    if (item.header === 1) {
      item.header = 2;
    } else {
      item.header = 1;
    }
    this.$store.commit('session/setTemplateSection', item);
  }
}
</script>

<style lang="scss">
</style>
