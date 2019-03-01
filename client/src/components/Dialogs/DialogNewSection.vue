<template lang="pug">
  v-dialog(v-model="value", persistent, width=450)
    v-form(ref="form")
      v-card
        v-toolbar(dense card text :color="themeColor + ' accent-2'")
          v-toolbar-title Add New Section
        v-divider
        v-card-text.body-1
          v-layout
            v-flex.pr-1(xs10)
              v-select(label="Type", :items="types", v-model="type" @input="onTypeChange" required)
            v-flex.pl-1(xs2)
              v-select(label="Size", :items="sizes", v-model="size" @input="onTypeChange" required)
          v-text-field(label="Name", v-model="name" :counter="getCount(type)" :disabled="type == 'spacer'" :rules="getRules(type)" required)
        v-divider
        v-card-actions
          v-spacer
          v-btn(@click="doCancel") Cancel
          v-btn(@click="doAdd") Add
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import sectionTypes from '@/assets/sectionTypes.json';
import sectionSizes from '@/assets/sectionSizes.json';
import { ListData, SectionTypeData } from '@/types/data';

@Component
export default class DialogNewSection extends Vue {
  @Prop({ default: '' })
  public value!: boolean;

  private types: SectionTypeData[] = sectionTypes;
  private sizes: ListData[] = sectionSizes;

  private size = 'full';
  private type = 'text';
  private header = 1;
  private name = '';

  @Watch('value')
  private watchValue() {
    this.type = 'text';
    this.size = 'full';
    this.header = 1;
    this.name = '';
    (this.$refs.form as HTMLFormElement).resetValidation();
  }

  // Computed Properties
  private get themeColor(): string {
    return this.$store.getters['session/themeColor'];
  }

  // Methods
  private getCount(type: string): number {
    return 35;
  }

  private getRules(type: string) {
    if (type === 'spacer') {
      return [];
    }

    const rules = [
      (v: string) => !!v || 'Name is required',
    ];

    const count: number = this.getCount(type);
    if (count) {
      rules.push((v: string) => (v && v.length <= count) || `Name must be less than ${count} characters`);
    }
    return rules;
  }

  private onTypeChange(): void {
    if (this.type === 'spacer') {
      this.name = '';
    }
  }

  private doCancel(): void {
    this.$emit('input', false);
  }

  private doAdd(): void {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.$emit('add', {
        type: this.type,
        size: this.size,
        header: this.header,
        name: this.name,
      });
      this.$emit('input', false);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
