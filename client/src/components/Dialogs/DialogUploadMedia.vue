<template lang="pug">
  v-dialog(v-model="value", persistent, width=450)
    v-card
      v-toolbar(dense card text :color="themeColor + ' accent-2'")
        v-toolbar-title Upload Media
      v-divider
      v-card-text
        v-text-field(v-model="title", label="Title")
        UploadButton(:fileChangedCallback="onFileChanged")
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
export default class DialogUploadMedia extends Vue {
  @Prop({ default: '' })
  public value!: boolean;

  private title: string = '';
  private file: File | null = null;
  private selected: string = '';
  private options: string[] = [
    'I am the owner of this image and release it under the CC',
    'I am not the owner of this image but it is covered under the CC',
  ];

  // Computed Properties
  private get themeColor(): string {
    return this.$store.getters['session/themeColor'];
  }

  // Methods
  private doCancel(): void {
    this.$emit('input', false);
  }

  private async doUpload(): Promise<void> {
    if (!this.file) {
      return;
    }

    try {
      const secureUrl: string = await this.$store.dispatch('media/getUrl', {
        title: this.title,
        mimeType: this.file.type,
      });

      const form = new FormData();
      form.append(this.file.name, this.file);

      await this.$store.dispatch('media/post', {
        url: secureUrl,
        content: form,
      });
    } catch (_) {
    }

    this.$emit('input', false);
  }

  private onFileChanged(file: File): void {
    this.file = file;
  }
}
</script>

<style lang="scss" scoped>
</style>
