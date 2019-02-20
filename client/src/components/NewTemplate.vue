<template lang="pug">
  v-dialog(v-model="value", persistent, width=550)
    v-card
      v-card-title.title Create New Template
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
export default class NewTemplate extends Vue {
  @Prop({ default: '' })
  public value!: string;

  private name = '';
  private description = '';

  // Methods
  private doCancel() {
    this.$emit('input', false);
  }
  
  private doCreate() {
    if (!this.name || !this.description)  {
      return;
    }

    this.$store.dispatch('session/newTemplate', {
      name: this.name,
      description: this.description
    }).then((template) => {
      this.$router.push({ name: 'template', params: { name: template['$href'].split('/').pop() }});
      this.$emit('input', false);
    }).catch(() => {
      this.$emit('input', false);
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
