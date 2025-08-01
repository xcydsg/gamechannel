<template>
  <div class="channel-settle">
    <h3>Settle Channel</h3>
    <form @submit.prevent="settle">
      <div class="form-group">
        <label for="channelId">Channel ID:</label>
        <input 
          type="number" 
          id="channelId" 
          v-model.number="channelId" 
          min="1" 
          required
        />
      </div>
      <button type="submit">Settle Channel</button>
    </form>
  </div>
</template>

<script>
import Web3 from 'web3';

export default {
  data() {
    return {
      channelId: null
    };
  },
  methods: {
    async settle() {
      if (!this.$parent.account) {
        alert("Please connect your wallet first");
        return;
      }
      
      try {
        // 获取智能合约实例
        const contract = this.$parent.contract;
        
        // 调用智能合约的 settleChannel 方法
        await contract.methods.settleChannel(this.channelId).send({ from: this.$parent.account });
        alert("Channel settled successfully");
        this.channelId = null;
        this.$emit('channel-settled', this.channelId);
      } catch (error) {
        console.error("Settle channel failed", error);
        alert("Failed to settle channel");
      }
    }
  }
};
</script>