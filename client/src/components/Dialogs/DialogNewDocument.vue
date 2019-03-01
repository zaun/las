<template lang="pug">
  v-dialog(v-model="value", persistent, width=550)
    v-card
      v-toolbar(dense card text :color="themeColor + ' accent-2'")
        v-toolbar-title Create New Template
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
import { ListData, TemplateData } from '@/types/data';

@Component
export default class DialogNewDocument extends Vue {
  @Prop({ default: '' })
  public value!: boolean;

  private title: string = '';
  private synopsis: string = '';
  private template: string = '';

  private loading: boolean = false;
  private templates: ListData[] = [];
  private search: string = '';

  // Computed Properties
  private get themeColor() {
    return this.$store.getters['session/themeColor'];
  }

  @Watch('search')
  private watchSearch(a: string, b: string): void {
    if (a != b) {
      this.querySelections(a);
    }
  }

  // Methods
  private doCancel(): void {
    this.$emit('input', false);
  }

  private async doCreate(): Promise<void> {
    if (!this.template || !this.title || !this.synopsis)  {
      return;
    }

    try {
      const document = await this.$store.dispatch('session/newDocument', {
        title: this.title,
        template: this.template,
        synopsis: this.synopsis,
      });
      this.$router.push({ name: 'document', params: { title: document.title }});
    } catch (_) {
    }

    this.$emit('input', false);
    this.template = '';
    this.title = '';
    this.synopsis = '';
  }

  private querySelections(val: String): void {
    this.loading = true;
    this.$store.dispatch('template/list', val).then((data: TemplateData[]) => {
      this.templates = map(data, (i: TemplateData) => {
        return {
          text: i.name,
          value: i.$href.split('/').pop(),
        };
      }) as ListData[];
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }
}
</script>

<style lang="scss" scoped>
</style>
