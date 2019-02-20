<template lang="pug">
  v-dialog(v-model="value", persistent, width=450)
    v-card
      v-card-title.title Upload Media
      v-card-text
        v-text-field(v-model="title", label="Title")
        UploadButton(:fileChangedCallback="fileChanged")
      v-divider
      v-card-actions
        v-spacer
        v-btn(@click="doCancel") Cancel
        v-btn(@click="doUpload") Upload
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import UploadButton from 'vuetify-upload-button';

@Component({
  components: {
    UploadButton,
  },
})
export default class UploadMedia extends Vue {
  @Prop({ default: '' })
  public value!: string;

  private title: string = '';
  private file = null;
  private selected = '';
  private options = [
    'I am the owner of this image and release it under the CC',
    'I am not the owner of this image but it is covered under the CC',
  ];

  // Methods
  private doCancel() {
    this.$emit('input', false);
  }

  private doUpload() {
    this.$store.dispatch('media/getUrl', {
      title: this.title,
      mimeType: this.file.type
    }).then((secureUrl) => {
      const form = new FormData();
      form.append(this.file.name, this.file);
      return this.$store.dispatch('media/post', {
        url: secureUrl,
        content: form
      });
    }).then(() => {
      this.$emit('input', false);
    }).catch((err) => {
      console.log(err);
      this.$emit('input', false);
    });
  }

  fileChanged(file) {
    this.file = file;
  }
};
</script>

<style lang="scss" scoped>
</style>
