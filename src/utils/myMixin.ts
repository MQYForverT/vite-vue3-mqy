import { Vue } from 'vue-property-decorator'

export class myMixin extends Vue {
  mounted() {
    console.log(12)
  }

  public test = '123'

  getMixinTitle(): void {
    console.log(this.test)
  }
}
