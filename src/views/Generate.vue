<template>
  <div id="genwallet" class="page active">
    <router-link class="close" :to="$store.getters['app/nodeLink']"><i class="fal fa-times"></i></router-link>
    <!--<div class="inner">-->
      <div class="block">
        <div class="details smaller">
          <label for="seed">Seed <a class="refreshwallet" @click.prevent="refreshWallet" href=""><i class="fal fa-sync"></i></a></label>
          <a href="#" @click="copyToClipboard(seed)" class="copy"><i class="fad fa-clone"></i></a>
          <div class="login">
            <input class="copytext" type="text" v-model="seed" name="seed" />
            <span @click="clearWallet" class="max">CLEAR</span>
          </div>
        </div>
        <div class="details smaller">
          <label for="address">Address</label>
          <a href="#" @click="copyToClipboard(address)" class="copy"><i class="fad fa-clone"></i></a>
          <input class="copytext" type="text" v-model="address" name="address" />
        </div>
        <button style="margin-top: 30px;" class="btn" @click="copyToClipboard('Seed: ' + seed + '\nPrivate Key: ' + privatekey + '\nPublic Key: ' + publickey + '\nAddress: ' + address)">Copy To Clipboard</button>
        <button class="btn outline" @click="save('Seed: ' + seed + '\nPrivate Key: ' + privatekey + '\nPublic Key: ' + publickey + '\nAddress: ' + address)">Download</button>
        <wallet :private="seed" :public="address"></wallet>
     </div>
      <!--<div class="block">
        <div class="canvas-bag">
          <qr-block :address="'nanoseed:' + seed"></qr-block>
        </div>
      </div>-->
    <!--</div>-->
  </div>
</template>

<script>
import { serverMixin } from '../mixins/serverMixin.js'
// import QrBlock from '../components/QrBlock'
import Wallet from '../components/Wallet'

export default {
  name: 'Generate',
  mixins: [ serverMixin ],
  components: {
    // QrBlock,
    Wallet
  },
  data() {
    return {
      newrep: '',
      seed: '',
      privatekey: '',
      publickey: '',
      address: '',
      walletdata: {}
    }
  },
  watch: {
    seed: function (newseed, oldseed) {
      if(newseed !== oldseed && newseed.length === 64) {
        this.$store.dispatch('app/seedData', newseed).then(data => {
          this.seed = data.seed,
          this.privatekey = data.privatekey,
          this.publickey = data.publickey,
          this.address = data.address
        }) 
      }
    }
  },
  methods: {
    save (data) {
      const filename = this.abbreviateAddress(this.address, false) + '.txt'
      var blob = new Blob([data], {type: 'text/csv'});
      if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
      }
      else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
      }
    },
    clearWallet () {
      this.seed = ''
      this.address = ''
    },
    refreshWallet () {
      this.$store.dispatch('app/getSeed').then(data => {
        this.seed = data.seed,
        this.privatekey = data.privatekey,
        this.publickey = data.publickey,
        this.address = data.address
      }) 

    }
  },
  computed: {
    genWalletLink () {
      if('node' in this.$route.params) {
        return this.$route.params.node
      }
      return ''
    }

  },
  mounted () {
    this.$store.dispatch('app/getSeed').then(data => {
      this.seed = data.seed,
      this.privatekey = data.privatekey,
      this.publickey = data.publickey,
      this.address = data.address
    }) 
  }
}
</script>

<style lang="scss">
</style>
<style lang="scss" scoped>
.btn {
  width: 100%;
  margin-bottom: 15px;
}
.canvas-bag {
  text-align: center;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.refreshwallet {
  color: #59c7f1;
  margin-left: 15px;
}
#genwallet {
  .login {
    .max {
      height: 37px;
    }
  }
}
.details .copy {
    right: -21px;
    top: 40px;
}
</style>
