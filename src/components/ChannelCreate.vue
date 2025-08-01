<template>
  <div class="channel-create-component">
    <h3>创建交易通道</h3>
    <form @submit.prevent="createChannel">
      <div class="form-group">
        <label for="player2">交易对手地址:</label>
        <input type="text" id="player2" v-model="player2" placeholder="请输入交易对手的以太坊地址" required />
      </div>

      <div class="channel-info">
        <h4>通道信息</h4>
        <div class="info-item">
          <label>当前用户:</label>
          <span class="info-value">{{ $parent.account || '未连接钱包' }}</span>
        </div>
        <div class="info-item">
          <label>交易对手:</label>
          <span class="info-value">{{ player2 || '请输入地址' }}</span>
        </div>
      </div>

      <button type="submit" class="submit-btn" :disabled="!canCreateChannel">创建通道</button>
    </form>
    <p class="help-text">
      创建交易通道后，您可以与指定的交易对手进行快速、低成本的交易。
      <br><strong>说明：</strong> 只需要输入交易对手的地址即可创建通道，无需签名验证。
      <br>• 确保输入有效的以太坊地址
      <br>• 交易对手地址不能与当前用户地址相同
      <br>• 交易对手地址不能为零地址
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      player2: ''
    };
  },
  computed: {
    canCreateChannel() {
      return this.player2 && this.isValidAddress(this.player2) && this.$parent.account;
    }
  },
  methods: {
    isValidAddress(address) {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    },

    async createChannel() {
      if (!this.$parent.account) {
        alert("请先连接钱包");
        return;
      }

      if (!this.canCreateChannel) {
        alert("请检查输入参数");
        return;
      }

      try {
        // 获取智能合约实例
        const contract = this.$parent.contract;

        if (!contract) {
          alert("智能合约未初始化");
          return;
        }

        // 添加调试信息
        console.log('创建通道参数:', {
          player2: this.player2
        });

        // 调用智能合约的 createChannel 方法（只需要 player2 参数）
        const tx = await contract.methods.createChannel(this.player2).send({
          from: this.$parent.account,
          gas: 500000
        });

        alert("交易通道创建成功");
        this.player2 = '';
      } catch (error) {
        console.error("创建通道失败", error);

        if (error.message.includes('authentication needed')) {
          alert("创建通道失败：需要对账户进行身份验证。请确保您的账户已解锁或提供了正确的密码。");
        } else if (error.message.includes('invalid address')) {
          alert("创建通道失败：对等方地址无效。请检查地址是否正确。");
        } else if (error.message.includes('PD')) {
          alert("创建通道失败：玩家地址不能相同。");
        } else if (error.message.includes('ZA')) {
          alert("创建通道失败：不能使用零地址。");
        } else if (error.message.includes('revert')) {
          alert("创建通道失败：交易被回滚。请检查参数是否正确。");
        } else {
          alert("创建通道失败：请检查智能合约状态和参数是否正确。错误信息：" + error.message);
        }
      }
    }
  }
};
</script>

<style scoped>
.channel-create-component {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.channel-info {
  background-color: #f9fafb;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.channel-info h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #374151;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.info-item label {
  font-weight: bold;
  color: #6b7280;
}

.info-value {
  font-family: monospace;
  color: #1f2937;
  word-break: break-all;
}

.submit-btn {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
}

.submit-btn:hover:not(:disabled) {
  background-color: #059669;
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.help-text {
  margin-top: 20px;
  padding: 15px;
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 4px;
  color: #1e40af;
  font-size: 14px;
  line-height: 1.5;
}
</style>