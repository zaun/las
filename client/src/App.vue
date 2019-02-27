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
    
    DialogAuth(v-model="showAuthDialog")
    DialogDirty(v-model="showDirtyDialog")
    DialogNewDocument(v-model="showNewDocument")
    DialogNewTemplate(v-model="showNewTemplate")
    DialogUploadMedia(v-model="showUploadMediaDialog")

    v-container.my-3
      router-view
    
    Footer
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DialogAuth from '@/components/Dialogs/DialogAuth.vue';
import DialogDirty from '@/components/Dialogs/DialogDirty.vue';
import DialogNewDocument from '@/components/Dialogs/DialogNewDocument.vue';
import DialogNewTemplate from '@/components/Dialogs/DialogNewTemplate.vue';
import DialogUploadMedia from '@/components/Dialogs/DialogUploadMedia.vue';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';

@Component({
  components: {
    DialogAuth,
    DialogDirty,
    DialogNewDocument,
    DialogNewTemplate,
    DialogUploadMedia,
    Footer,
    Header,
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

.float-right {
  float: right;
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
