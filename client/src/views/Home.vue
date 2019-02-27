<template lang="pug">
  v-container.content()
    v-layout(align-center justify-start column)
      v-flex
        v-img(:src="require('../assets/logo.png')" width="400")
      v-flex.display-3.text-xs-center Library Access System
    v-layout.mt-5(align-center justify-start column)
      v-flex
        v-btn(@click="showSystemDialog = true") System Information


    DialogSystemInfo(v-model="showSystemDialog")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DialogSystemInfo from '@/components/Dialogs/DialogSystemInfo.vue';

@Component({
  components: {
    DialogSystemInfo,
  },
})
export default class Home extends Vue {
  private showSystemDialog: boolean = false;
}
</script>
