<template lang="pug">
  v-dialog(v-model="value", persistent, width=550)
    v-card
      v-card-title.title Create New Template
      v-divider
      v-card-text
        v-autocomplete(v-model="template" label="Tempalte"
                      :loading="loading"
                      :items="templates"
                      :search-input.sync="search"
                      cache-items hide-details)
        v-text-field(v-model="title" label="Document Title" hide-details)
        v-textarea(v-model="synopsis" label="Synopsis" hide-details no-resize)
      v-divider
      v-card-actions
        v-spacer
        v-btn(@click="doCancel") Cancel
        v-btn(@click="doCreate") Create
</template>

<script lang="ts">
import { map } from 'lodash';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class NewDocument extends Vue {
  @Prop({ default: '' })
  public value!: string;

  private title = '';
  private synopsis = '';
  private template = '';

  private loading = false;
  private templates = [];
  private search = null;

  // Computed Properties
  private get isDocumentPage() {
    return this.$store.state.route.name === 'document';
  }

  @Watch('search')
  private watchSearch(val) {
    val && val !== this.select && this.querySelections(val)
  }

  // Methods
  private doCancel() {
    this.$emit('input', false);
  }
  
  private doCreate() {
    console.log(this.template);
    if (!this.template || !this.title || !this.synopsis)  {
      return;
    }

    this.$store.dispatch('session/newDocument', {
      title: this.title,
      template: this.template,
      synopsis: this.synopsis
    }).then((doc) => {
      console.log(doc);
      this.$emit('input', false);
      this.$router.push({ name: 'document', params: { title: doc.title }});
      this.template = '';
      this.title = '';
      this.synopsis = '';
    }).catch(() => {
    });
  }

  private querySelections(val) {
    this.loading = true;
    this.$store.dispatch('template/list', val).then((data) => {
      this.templates = map(data, (i) => {
        return {
          text: i.name,
          value: i.$href.split('/').pop()
        };
      });
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    })
  }
};
</script>

<style lang="scss" scoped>
</style>
