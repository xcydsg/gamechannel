<template>
  <div class="game-item-trade">
    <h3>交易游戏道具</h3>
    <form @submit.prevent="tradeItem">
      <div class="form-group">
        <label for="channelId">通道 ID:</label>
        <input type="number" id="channelId" v-model.number="channelId" min="1" required />
      </div>
      <div class="form-group">
        <label for="itemId">道具 ID:</label>
        <input type="number" id="itemId" v-model.number="itemId" min="1" required />
      </div>
      <div class="form-group">
        <label for="approvalAmount">授权金额 (GAME):</label>
        <input type="number" id="approvalAmount" v-model.number="approvalAmount" step="any" min="0" required />
      </div>
      <button type="submit">交易道具</button>
    </form>
  </div>
</template>

<script>
import Web3 from 'web3';

export default {
  data() {
    return {
      channelId: null,
      itemId: null,
      approvalAmount: 0
    };
  },
  methods: {
    async tradeItem() {
      if (!this.$parent.account) {
        alert("请先连接钱包");
        return;
      }

      try {
        // 获取智能合约实例
        const contract = this.$parent.contract;

        // 首先需要授权代币给合约
        if (this.$parent.gameTokenContract) {
          await this.$parent.gameTokenContract.methods.approve(
            contract._address,
            this.approvalAmount * 1e18
          ).send({ from: this.$parent.account });
        }

        // 调用智能合约的 tradeItemInChannel 方法 (更新后的版本)
        await contract.methods.tradeItemInChannel(
          this.channelId,
          this.itemId
        ).send({
          from: this.$parent.account
        });

        alert("道具交易成功");
        this.channelId = null;
        this.itemId = null;
        this.approvalAmount = 0;
      } catch (error) {
        console.error("交易道具失败", error);
        if (error.message.includes('CN')) {
          alert("交易失败：通道未开启");
        } else if (error.message.includes('BN')) {
          alert("交易失败：买家不在通道中");
        } else if (error.message.includes('SN')) {
          alert("交易失败：卖家不在通道中");
        } else if (error.message.includes('BS')) {
          alert("交易失败：买家和卖家不能相同");
        } else if (error.message.includes('NS')) {
          alert("交易失败：物品未上架");
        } else if (error.message.includes('NA')) {
          alert("交易失败：代币授权不足");
        } else if (error.message.includes('IB')) {
          alert("交易失败：代币余额不足");
        } else if (error.message.includes('TF')) {
          alert("交易失败：代币转账失败");
        } else {
          alert("交易道具失败：" + error.message);
        }
      }
    }
  }
};
</script>
<style scoped>
.game-item-trade {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

label {
  color: #555;
  font-weight: 600;
  margin-bottom: 10px;
  display: block;
}

button {
  margin-top: 20px;
  width: 100%;
  font-size: 16px;
  padding: 14px;
  border-radius: 30px;
}

@media (max-width: 576px) {
  form {
    max-width: 100%;
  }
}
</style>