var numbro = require('numbro')
var NanoCurrency = require('nanocurrency')
import Vue from 'vue'

export const serverMixin = {
  data() {
    return {
      rawconv: {from:'raw',to:'Nano'},
      nanoconv: {from:'Nano',to:'raw'}
    }
  },

  computed: {
  },
  mounted() {
  },

  methods: {
       
    abbreviateNumber (number, precision = 2) {
      console.log(number)
      if (precision === 2) {
        if (number < 0.005) {
          return number
        }
        return numbro(number).format({
          trimMantissa: true,
          mantissa: 2,
          average: true
      })
      }
      return numbro(number).format({
        trimMantissa: true,
        mantissa: 10,
        average: true
    })

      //return scaled.toFixed(precision) + '<span class="suffix">' + suffix + '</span>';
    },
    
    copyToClipboard(text) {

      let input = document.createElement('textarea');
      input.innerHTML = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      Vue.notify({
        title: 'Success!',
        text: 'Copied to clipboard',
        type: 'success'
      })
    },
    
    link(type,data) {
      const baseurl = window.location.origin;
      if (type == 'address') {
	window.open(baseurl + '/#' + this.$store.getters['app/nodeLink'] + 'address/' + data);
      }
      if (type == 'block') {
        window.open(baseurl + '/#' + this.$store.getters['app/nodeLink'] + 'block/' + data);
      }
    },

    /*async keyFromClipboard() {
      try {
        const text = await navigator.clipboard.readText()
        this.key = text
      } catch(e) {
        alert('This bowser does not support pasting from clipboard')
      }
    },*/
    
    abbreviateAddress (address, formatting = true) {
      let output = ''
      if (formatting === true) output += '<span class="abbreviate">'
      output += address.substring(0, 11) + '...' + address.slice(address.length - 6)
      if (formatting === true) output += '</span>'
      return output
    },

    highlightAddress (address) {
      if (address !== null && address !== undefined) {
        const end = address.length - 6;
        return '<span class="abbreviate"><span class="highlight">' + address.substring(0, 11) + '</span>' + address.substring(11, end) + '<span class="highlight">' + address.slice(address.length - 6) + '</span></span>'
      }
      return null
    },
    
    transactionStatus (value) {
      if (value === 'send') return 'Sent'
      if (value === 'receive') return 'Received'
    },

    checkamount (amount) {
      if (!NanoCurrency.checkAmount(amount)) {
        this.$notify({
          title: 'Invalid amount',
          text: 'Please ensure the amount selected is a valid',
          type: 'error'
        })
	return false
      } else {
        return true
      }
    }
    
  }
}
