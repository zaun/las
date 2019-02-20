<template lang="pug">
  v-toolbar.no-print(dense app)
    v-toolbar-title L.A.S.
    v-spacer
    v-text-field(v-if="!isSearchPage && !isEditMode" v-model="searchTerm" append-icon="mdi-magnify" @change="doSearch")
    v-spacer
    v-btn(v-if="!isAuthed" @click="showLogin" text) Sign In / Register
    v-menu(v-if="isAuthed" offset-y bottom left)
      v-toolbar-title(slot="activator")
        v-icon mdi-face
      v-list
        v-list-tile
          v-list-tile-title Username
        v-divider
        div(v-if="!isEditMode")
          v-list-tile(@click="showNewDocument")
            v-list-tile-avatar
              v-icon mdi-file-plus
            v-list-tile-title New Document
          v-list-tile(@click="showNewTemplate")
            v-list-tile-avatar
              v-icon mdi-book-plus
            v-list-tile-title New Template
          v-list-tile(disabled @click="showUploadMedia")
            v-list-tile-avatar
              v-icon mdi-cloud-upload-outline
            v-list-tile-title Upload Media
          v-divider
          div(v-if="isDocumentPage")
            v-list-tile(@click="setEditMode")
              v-list-tile-avatar
                v-icon mdi-pencil
              v-list-tile-title Edit Document
            v-list-tile(disabled)
              v-list-tile-avatar
                v-icon mdi-history
              v-list-tile-title History
            v-list-tile(@click="gotoTemplate")
              v-list-tile-avatar
                v-icon mdi-book
              v-list-tile-title Goto Template
          div(v-if="isTemplatePage")
            v-list-tile(@click="setEditMode")
              v-list-tile-avatar
                v-icon mdi-pencil
              v-list-tile-title Edit Template
            v-list-tile(disabled)
              v-list-tile-avatar
                v-icon mdi-history
              v-list-tile-title History
            v-list-tile(disabled)
              v-list-tile-avatar
                v-icon mdi-book
              v-list-tile-title List Documents
        div(v-if="isEditMode")
          v-list-tile(@click="doSave")
            v-list-tile-avatar
              v-icon mdi-cloud-upload
            v-list-tile-title Save
          v-list-tile(@click="doCancel")
            v-list-tile-avatar
              v-icon mdi-close-circle
            v-list-tile-title Cancel
        div(v-if="!isEditMode")
          v-divider
          v-list-tile(@click="doLogout")
            v-list-tile-avatar
              v-icon mdi-logout
            v-list-tile-title Logout

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  private searchTerm: string = '';

  // Computed Properties
  private get isAuthed() {
    return this.$store.getters['cognito/isLoggedIn'];
  }

  private get isDocumentPage() {
    return this.$store.state.route.name === 'document';
  }

  private get isDocumentDirty() {
    return this.$store.getters['session/isDocumentDirty'];
  }

  private get isEditMode() {
    return this.$store.getters['session/isEditMode'];
  }

  private get isSearchPage() {
    return this.$store.state.route.name === 'search';
  }

  private get isTemplateDirty() {
    return this.$store.getters['session/isTemplateDirty'];
  }

  private get isTemplatePage() {
    return this.$store.state.route.name === 'template';
  }

  private get documentTemplateID () {
    if (this.$store.state.session.document) {
      return this.$store.state.session.document.template;
    }
    return '';
  }

  // Methods
  private doCancel() {
    if ((this.isDocumentPage && this.isDocumentDirty) ||
        (this.isTemplatePage && this.isTemplateDirty)) {
    this.$emit('show-dirty', this.searchTerm);
    } else {
      this.$store.dispatch('session/cancelEdit');
    }
  }

  private doLogout() {
    this.$store.dispatch('cognito/signOut');
  }

  private doSave() {
    if (this.isDocumentPage) {
      this.$store.dispatch('session/saveDocument');
    } else if (this.isTemplatePage) {
      this.$store.dispatch('session/saveTemplate');
    }
  }

  private doSearch() {
    this.$emit('do-search', this.searchTerm);
    this.searchTerm = '';
  }

  private showUploadMedia() {
    this.$emit('show-upload-media');
    this.$store.dispatch('media/post', {
      title: 'test',
      mimeType: 'image/jpeg'
    });
  }

  private gotoTemplate() {
    this.$router.push({ name: 'template', params: { name: this.documentTemplateID }});
  }

  private showLogin() {
    this.$emit('show-login');
  }

  private showNewTemplate() {
    this.$emit('show-template');
  }

  private showNewDocument() {
    this.$emit('show-document');
  }

  private setEditMode() {
    this.$store.dispatch('session/setEditMode', true);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
