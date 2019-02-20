<template lang="pug">
  v-container.content()
    v-layout(align-center justify-start column)
      v-flex
        v-img(:src="require('../assets/logo.png')" width="400")
      v-flex.display-3.text-xs-center Library Access System
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
})
export default class Home extends Vue {}
</script>
