<template lang="pug">
  v-app
    Header(
      @do-search="doSearch"
      @show-login="showAuthDialog = true"
      @show-dirty="showDirtyDialog = true"
      @show-document="showNewDocument = true"
      @show-template="showNewTemplate = true"
      @show-upload-media="showUploadMediaDialog = true"
    )
    
    AuthDialog(v-model="showAuthDialog")
    DirtyDialog(v-model="showDirtyDialog")
    NewDocument(v-model="showNewDocument")
    NewTemplate(v-model="showNewTemplate")
    UploadMedia(v-model="showUploadMediaDialog")

    v-container.my-3
      router-view
    
    Footer
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AuthDialog from '@/components/AuthDialog.vue';
import DirtyDialog from '@/components/DirtyDialog.vue';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import NewDocument from '@/components/NewDocument.vue';
import NewTemplate from '@/components/NewTemplate.vue';
import UploadMedia from '@/components/UploadMedia.vue';

@Component({
  components: {
    AuthDialog,
    DirtyDialog,
    Footer,
    Header,
    NewDocument,
    NewTemplate,
    UploadMedia,
  },
})
export default class App extends Vue {
  private showAuthDialog: boolean = false;
  private showDirtyDialog: boolean = false;
  private showNewTemplate = false;
  private showNewDocument = false;
  private showUploadMediaDialog = false;

  private doSearch(searchTerm: string) {
    this.$router.push({ name: 'search', params: { search: searchTerm }});
  }
}
</script>

<style lang="scss">
@media print {
   .no-print {
     display: none;
   }
   .avoid-break{
    page-break-inside: avoid
  }
}
.min-1 {
  min-width: 1em;
}
.min-2 {
  min-width: 2em;
}
.min-3 {
  min-width: 3em;
}
.min-4 {
  min-width: 4em;
}
.min-5 {
  min-width: 5em;
}
.max-1 {
  max-width: 1em;
}
.max-2 {
  max-width: 2em;
}
.max-3 {
  max-width: 3em;
}
.max-4 {
  max-width: 4em;
}
.max-5 {
  max-width: 5em;
}
</style>
