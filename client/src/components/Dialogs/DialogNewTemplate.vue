<template lang="pug">
  v-dialog(v-model="value", persistent, width=550)
    v-card
      v-toolbar(dense card text :color="themeColor + ' accent-2'")
        v-toolbar-title Create New Template
      v-divider
      v-card-text
        .body-1 Templates are used to define what information a type a document should hold.
          | Templates should be designed for a specific topic, not a specific document. For example a
          | template "Astronaut" for documents about Joseph Acaba, Loren Acton, Mike Adams, etc.
        v-text-field(v-model="name" label="Template Name")
        v-textarea(v-model="description" label="Description" no-resize)
      v-divider
      v-card-actions
        v-spacer
        v-btn(@click="doCancel") Cancel
        v-btn(@click="doCreate") Create
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DialogNewTemplate extends Vue {
  @Prop({ default: '' })
  public value!: boolean;

  private name: string = '';
  private description: string = '';

  // Computed Properties
  private get themeColor(): string {
    return this.$store.getters['session/themeColor'];
  }

  // Methods
  private doCancel(): void {
    this.$emit('input', false);
  }

  private async doCreate(): Promise<void> {
    if (!this.name || !this.description)  {
      return;
    }

    try {
      const template = await this.$store.dispatch('session/newTemplate', {
        name: this.name,
        description: this.description,
      });
      this.$router.push({ name: 'template', params: { name: template.$href.split('/').pop() }});
    } catch (_) {
    }

    this.$emit('input', false);
  }
}
</script>

<style lang="scss" scoped>
</style>
