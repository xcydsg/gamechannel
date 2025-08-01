<template>
  <div class="inventory-view">
    <h3>你的道具库存</h3>
    <div v-if="loading">正在加载道具...</div>
    <div v-else-if="inventory.length === 0">你的道具库存为空</div>
    <ul v-else>
      <li v-for="item in inventory" :key="item.itemId">
        <div class="item-details">
          <h4>{{ item.itemName }}</h4>
          <p>{{ item.itemDescription }}</p>
          <p>价格: {{ item.price / 1e18 }} GAME</p>
        </div>
        <div class="item-actions">
          <button @click="tradeItem(item.itemId)">交易</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Web3 from 'web3';

export default {
  data() {
    return {
      inventory: [],
      loading: true
    };
  },
  async mounted() {
    if (this.$parent.account) {
      await this.fetchInventory();
    }
  },
  watch: {
    '$parent.account': {
      handler: async function (newVal) {
        if (newVal) {
          await this.fetchInventory();
        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchInventory() {
      this.loading = true;
      try {
        // 获取智能合约实例
        const contract = this.$parent.contract;

        // 调用智能合约的 viewPlayerInventory 方法
        const inventoryData = await contract.methods.viewPlayerInventory().call({ from: this.$parent.account });

        // 处理返回的数据
        this.inventory = inventoryData[0].map((itemId, index) => {
          return {
            itemId: itemId,
            itemName: inventoryData[1][index],
            itemDescription: inventoryData[2][index],
            price: inventoryData[3][index]
          };
        });
      } catch (error) {
        console.error("获取道具库存失败", error);
      } finally {
        this.loading = false;
      }
    },
    tradeItem(itemId) {
      this.$emit('trade-item', itemId);
    }
  }
};
</script>

<style scoped>
.inventory-view {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

ul {
  margin-top: 20px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  margin-bottom: 15px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
  transition: all 0.3s ease;
}

li:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transform: translateX(5px);
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin-bottom: 8px;
  color: #2c3e50;
}

.item-details p {
  color: #666;
  font-size: 14px;
}

.item-actions button {
  background: linear-gradient(90deg, #2196f3, #42a5f5);
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 20px;
}

.item-actions button:hover {
  background: linear-gradient(90deg, #1976d2, #42a5f5);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #777;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 15px;
  color: #ddd;
}
</style>