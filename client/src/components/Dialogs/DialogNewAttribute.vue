<template lang="pug">
  v-dialog(v-model="value", persistent, width=450)
    v-form(ref="form")
      v-card
        v-toolbar(dense card flat :color="themeColor + ' accent-2'")
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

@Component
export default class DialogNewAttribute extends Vue {
  @Prop({ default: '' })
  public value!: bool;

  private items = attributeTypes;

  private type = 'string';
  private name = '';

  @Watch('value')
  private watchValue(val) {
    this.type = 'string';
    this.name = '';
    this.$refs.form.resetValidation();
  }

  // Computed Properties
  private get themeColor() {
    return this.$store.getters['session/themeColor'];
  }

  // Methods
  private getCount(type: string) {
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
      v => !!v || 'Name is required'
    ];

    const count = this.getCount(type);
    if (count) {
      rules.push(v => (v && v.length <= count) || `Name must be less than ${count} characters`);
    }
    return rules
  }

  private onTypeChange() {
    if (this.type === 'spacer') {
      this.name = '';
    }
  }

  private doCancel() {
    this.$emit('input', false);
  }
  
  private doAdd() {
    if (this.$refs.form.validate()) {
      this.$emit('add', {
        type: this.type,
        name: this.name,
      });
      this.$emit('input', false);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
