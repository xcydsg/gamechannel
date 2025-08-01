<template>
  <div class="game-item-add">
    <h3>添加新游戏道具</h3>
    <form @submit.prevent="addGameItem">
      <div class="form-group">
        <label for="itemName">道具名称:</label>
        <input type="text" id="itemName" v-model="itemName" placeholder="请输入道具名称" required />
      </div>
      <div class="form-group">
        <label for="itemDescription">道具描述:</label>
        <textarea id="itemDescription" v-model="itemDescription" placeholder="请输入道具描述" required></textarea>
      </div>
      <div class="form-group">
        <label for="itemPrice">道具价格 (GAME):</label>
        <input type="number" id="itemPrice" v-model.number="itemPrice" step="any" min="0" placeholder="请输入道具价格"
          required />
      </div>
      <div class="form-group">
        <label for="imageURL">图片URL:</label>
        <input type="text" id="imageURL" v-model="imageURL" placeholder="请输入图片URL (可选)" />
      </div>
      <button type="submit">添加道具</button>
    </form>
  </div>
</template>

<script>
import Web3 from 'web3';

export default {
  data() {
    return {
      itemName: '',
      itemDescription: '',
      itemPrice: 0,
      imageURL: ''
    };
  },
  methods: {
    async addGameItem() {
      if (!this.$parent.account) {
        alert("请先连接钱包");
        return;
      }

      try {
        // 获取智能合约实例
        const contract = this.$parent.contract;

        // 调用智能合约的 addGameItem 方法 (更新后的签名)
        await contract.methods.addGameItem(
          this.$parent.account,
          this.itemName,
          this.itemDescription,
          this.itemPrice * 1e18, // 转换为 wei
          this.imageURL || '/default-image.png' // 添加图片URL参数
        ).send({ from: this.$parent.account });

        alert("道具添加成功");
        this.itemName = '';
        this.itemDescription = '';
        this.itemPrice = 0;
        this.imageURL = '';
      } catch (error) {
        console.error("添加道具失败", error);
        if (error.message.includes('OW1')) {
          alert("添加道具失败：只有合约所有者可以添加道具");
        } else {
          alert("添加道具失败：" + error.message);
        }
      }
    }
  }
};
</script>

<style scoped>
.game-item-add {
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

textarea {
  min-height: 120px;
  resize: vertical;
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