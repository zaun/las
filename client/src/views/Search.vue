<template lang="pug">
  v-container
    v-layout(row)
      v-flex(xs12 md10 offset-md1 lg8 offset-lg2 xl6 offset-xl3)
        v-text-field(append-icon="fa-search" v-model="search" @keyup.enter="doSearch")

    v-layout.pb-4(row v-for="(item, index) in results.d")
      v-flex(xs12 md10 offset-md1 lg8 offset-lg2 xl6 offset-xl3)
        .title
          v-icon.mr-1(title="Document") mdi-file-document-box-outline
          router-link(:to="{ name: 'document', params: { title: item.title} }") {{ item.title }}
        .caption(v-if="item.updatedAt") Last updated on {{ item.updatedAt }}
        .body-1 {{ item.synopsis }}

    v-layout.pb-4(row v-for="(item, index) in results.t")
      v-flex(xs12 md10 offset-md1 lg8 offset-lg2 xl6 offset-xl3)
        .title
          v-icon.mr-1(title="Template") mdi-file-document-box-multiple-outline
          router-link(:to="{ name: 'template', params: { name: item.$href.split('/').pop() } }") {{ item.name }}
        .caption(v-if="item.updatedAt") Last updated on {{ item.updatedAt }}
        .body-1 {{ item.description }}

    v-layout(v-if="results.d.length + results.t.length === 0")
      v-flex(xs12 md10 offset-md1 lg8 offset-lg2 xl6 offset-xl3)
        .title No results found
        .body-1 Sorry, search is really not optimal at the moment and there are not
          | a lot of documents in the system to begin with. I recomment searching for
          | "Test" as I know there is a Test documnet.
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Search extends Vue {
  private search: string = '';

  // Computed Properties
  get results() {
    return this.$store.state.session.searchResults;
  }

  @Watch('$route', { immediate: true, deep: true })
  private searchDocuments() {
    this.search = this.$route.params.search;
    this.$store.dispatch('session/search', this.search);
  }

  private doSearch() {
    this.$router.push({ name: 'search', params: { search: this.search } });
  }
}
</script>
