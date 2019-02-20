<template lang="pug">
  v-container.content(fill-height)
    v-layout(v-if="document != null && template != null" wrap)
      v-flex.sidebar(xs12 md3)
        section(v-for="attribute in template.attributes")
          //- | {{ attribute }} '{{ attribueValue(attribute.id) }}'
          Attribute(v-if="attribute.data || !attribute.deprecated" :type="attribute.type" :label="attribute.name" :data="attribute.data" :readonly="!isEditMode" :value="attribueValue(attribute.id)" @input="setAttribute(attribute.id, $event)")

      v-flex.content.pl-3(xs12 md9)
        div(v-if="!isEditMode")
          .display-1 {{ document.title || 'Untitled' }}
          .synopsis.body-1.mb-3 {{ document.synopsis }}
        div(v-if="isEditMode")
          v-text-field.display-1(:value="document.title" @input="setTitle" label="Page Title" :counter="50")
          Content.subheading.mb-3(type="text" label="Synopsis" :value="document.synopsis" @input="setSynopsis")
        section.mb-3(v-for="section in template.sections")
          Content(v-if="section.data || !section.deprecated" :type="section.type" :header="section.header" :label="section.name" :data="section.data" :readonly="!isEditMode" :value="sectionValue(section.id)" @input="setSection(section.id, $event)")

    v-layout(v-if="!document || !template" wrap)
      v-flex.text-xs-center(align-center justify-center row)
        v-progress-circular(:width="2" :size="90" indeterminate)
          v-progress-circular(:width="2" :size="75" indeterminate) Loading
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Attribute from '@/components/Attribute.vue';
import Content from '@/components/Content.vue';

@Component({
  components: {
    Attribute,
    Content,
  },
})
export default class Document extends Vue {
  // Computed Properties
  private get document() {
    return this.$store.state.session.document;
  }

  private get isEditMode() {
    return this.$store.getters['session/isEditMode'];
  }

  private get template() {
    return this.$store.state.session.template;
  }
  
  @Watch('$route', { immediate: true, deep: true })
  private searchDocuments() {
    this.$store.dispatch('session/loadDocument', this.$route.params.title);
  }

  private attribueValue(id: string) {
    if (this.document.attributes) {
      return this.document.attributes[id];
    }
  }

  private sectionValue(id: string) {
    if (this.document.sections) {
      return this.document.sections[id];
    }
  }

  private setAttribute(id: string, value: any) {
    this.$store.commit('session/setDocumentAttribute', { id, value });
  }

  private setSection(id: string, value: any) {
    this.$store.commit('session/setDocumentSection', { id, value });
  }

  private setSynopsis(value: string) {
    this.$store.commit('session/setDocumentSynopsis', value);
  }

  private setTitle(value: string) {
    this.$store.commit('session/setDocumentTitle', value);
  }

}
</script>
