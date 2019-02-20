<template lang="pug">
  v-footer.no-print(v-if="isDocumentPage" app)
    v-layout.caption.px-3.py-1
      v-flex.hidden-xs-only(sm3)
        span Library Access System
      v-flex.text-xs-center(xs12 sm6)
        span.hidden-md-and-down This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
        span.hidden-lg-and-up Creative Commons Attribution-ShareAlike 4.0
      v-flex.hidden-xs-only.text-xs-right(xs3 sm3)
        span.hidden-xs-only {{ documentCreatedAt }} ~ {{ documentUpdatedAt }}
        span.hidden-sm-and-up {{ documentUpdatedAt }}

  v-footer.no-print(v-else-if="isTemplatePage" app)
    v-layout.caption.px-3.py-1
      v-flex.hidden-xs-only(sm3)
        span Library Access System
      v-flex.text-xs-center(xs12 sm6)
        span.hidden-md-and-down This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
        span.hidden-lg-and-up Creative Commons Attribution-ShareAlike 4.0
      v-flex.hidden-xs-only.text-xs-right(xs3 sm3)
        span.hidden-xs-only {{ templateCreatedAt }} ~ {{ templateUpdatedAt }}
        span.hidden-sm-and-up {{ templateUpdatedAt }}
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {
  // Computed Properties
  get isDocumentPage () {
    return this.$store.state.route.name === 'document';
  }

  get isTemplatePage () {
    return this.$store.state.route.name === 'template';
  }

  get  documentCreatedAt () {
    if (this.$store.state.session.document) {
      return moment(this.$store.state.session.document.createdAt).format('YYYY-MM-DD');
    }
    return '';
  }

  get  documentUpdatedAt () {
    if (this.$store.state.session.document) {
      return moment(this.$store.state.session.document.updatedAt).format('YYYY-MM-DD');
    }
    return '';
  }

  get  templateCreatedAt () {
    if (this.$store.state.session.template) {
      return moment(this.$store.state.session.template.createdAt).format('YYYY-MM-DD');
    }
    return '';
  }

  get  templateUpdatedAt () {
    if (this.$store.state.session.template) {
      return moment(this.$store.state.session.template.updatedAt).format('YYYY-MM-DD');
    }
    return '';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-footer {
  min-height: 16px;
  height: auto !important;
}
</style>
