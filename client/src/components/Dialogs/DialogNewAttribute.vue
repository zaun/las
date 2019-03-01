<template lang="pug">
  v-dialog(v-model="value", persistent, width=450)
    v-form(ref="form")
      v-card
        v-toolbar(dense card text :color="themeColor + ' accent-2'")
          v-toolbar-title Add New Attribute
        v-divider
        v-card-text.body-1
          v-select(label="Type", :items="items", v-model="type" @input="onTypeChange" required)
          v-text-field(label="Name", v-model="name" :counter="getCount(type)" :disabled="type == 'spacer'" :rules="getRules(type)" required)
        v-divider
        v-card-actions
          v-spacer
          v-btn(@click="doCancel") Cancel
          v-btn(@click="doAdd") Add
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import attributeTypes from '@/assets/attributeTypes.json';
import { AttributeTypeData } from '@/types/data';

@Component
export default class DialogNewAttribute extends Vue {
  @Prop({ default: '' })
  public value!: boolean;

  private items: AttributeTypeData[] = attributeTypes;
  private type: string = 'string';
  private name: string = '';

  @Watch('value')
  private watchValue(): void {
    this.type = 'string';
    this.name = '';
    (this.$refs.form as HTMLFormElement).resetValidation();
  }

  // Computed Properties
  private get themeColor(): string {
    return this.$store.getters['session/themeColor'];
  }

  // Methods
  private getCount(type: string): number | null {
    if (type === 'spacer') {
      return null;
    }
    return 25;
  }

  private getRules(type: string) {
    if (type === 'spacer') {
      return [];
    }

    const rules = [
      (v: string) => !!v || 'Name is required',
    ];

    const count: number | null = this.getCount(type);
    if (count != null) {
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
        name: this.name,
      });
      this.$emit('input', false);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
