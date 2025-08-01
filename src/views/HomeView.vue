<script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="home">
    <h1>Web3 连接测试</h1>

    <div class="test-section">
      <h2>连接状态</h2>
      <div class="status-item">
        <span class="label">Web3 提供者:</span>
        <span class="value">{{ web3Provider }}</span>
      </div>
      <div class="status-item">
        <span class="label">连接状态:</span>
        <span class="value" :class="{ 'success': isConnected, 'error': !isConnected }">
          {{ isConnected ? '已连接' : '未连接' }}
        </span>
      </div>
      <div class="status-item" v-if="account">
        <span class="label">当前账户:</span>
        <span class="value">{{ account }}</span>
      </div>
      <div class="status-item" v-if="balance">
        <span class="label">ETH 余额:</span>
        <span class="value">{{ balance }} ETH</span>
      </div>
    </div>

    <div class="test-section">
      <h2>连接测试</h2>
      <button @click="testMetaMask" class="btn btn-primary">测试 MetaMask</button>
      <button @click="testLocalNode" class="btn btn-secondary">测试本地节点</button>
      <button @click="testAccounts" class="btn btn-info">测试账户</button>
      <button @click="unlockAccount" class="btn btn-warning">解锁账户</button>

    </div>

    <div class="test-section">
      <h2>测试结果</h2>
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" class="log-item" :class="log.type">
          <span class="timestamp">{{ log.timestamp }}</span>
          <span class="message">{{ log.message }}</span>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>解决方案</h2>
      <div class="solution-list">
        <div class="solution-item">
          <h3>MetaMask 问题</h3>
          <ul>
            <li>确保 MetaMask 已安装并解锁</li>
            <li>确保选择了正确的网络</li>
            <li>确保账户已解锁</li>
          </ul>
        </div>
        <div class="solution-item">
          <h3>本地节点问题</h3>
          <ul>
            <li>确保本地区块链节点正在运行</li>
            <li>确保节点地址为 http://127.0.0.1:8545</li>
            <li>确保账户已创建并解锁</li>
            <li>使用 --allow-insecure-unlock 参数启动节点</li>
          </ul>
        </div>
        <div class="solution-item">
          <h3>认证问题</h3>
          <ul>
            <li>点击"解锁账户"按钮</li>
            <li>输入正确的账户密码</li>
            <li>如果使用本地节点，确保账户已解锁</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3';

export default {
  name: 'HomeView',
  data() {
    return {
      web3Provider: '未知',
      isConnected: false,
      account: null,
      balance: null,
      logs: []
    };
  },
  async mounted() {
    this.addLog('info', '页面加载完成，开始检测 Web3 环境');
    await this.detectWeb3();
  },
  methods: {
    addLog(type, message) {
      const timestamp = new Date().toLocaleTimeString();
      this.logs.unshift({
        type,
        message,
        timestamp
      });

      // 限制日志数量
      if (this.logs.length > 50) {
        this.logs = this.logs.slice(0, 50);
      }
    },

    async detectWeb3() {
      try {
        if (window.ethereum) {
          this.web3Provider = 'MetaMask';
          this.addLog('info', '检测到 MetaMask');

          // 测试 MetaMask 连接
          const web3 = new Web3(window.ethereum);
          const isListening = await web3.eth.net.isListening();

          if (isListening) {
            this.isConnected = true;
            this.addLog('success', 'MetaMask 连接成功');
          } else {
            this.addLog('error', 'MetaMask 连接失败');
          }
        } else if (window.web3 && window.web3.currentProvider) {
          this.web3Provider = 'Legacy Web3';
          this.addLog('info', '检测到 Legacy Web3');

          const web3 = new Web3(window.web3.currentProvider);
          const isListening = await web3.eth.net.isListening();

          if (isListening) {
            this.isConnected = true;
            this.addLog('success', 'Legacy Web3 连接成功');
          } else {
            this.addLog('error', 'Legacy Web3 连接失败');
          }
        } else {
          this.web3Provider = 'HTTP Provider';
          this.addLog('info', '使用 HTTP Provider');

          try {
            const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
            const isListening = await web3.eth.net.isListening();

            if (isListening) {
              this.isConnected = true;
              this.addLog('success', '本地节点连接成功');
            } else {
              this.addLog('error', '本地节点连接失败');
            }
          } catch (error) {
            this.addLog('error', `本地节点连接错误: ${error.message}`);
          }
        }
      } catch (error) {
        this.addLog('error', `Web3 检测失败: ${error.message}`);
      }
    },

    async testMetaMask() {
      this.addLog('info', '开始测试 MetaMask...');

      try {
        if (!window.ethereum) {
          this.addLog('error', 'MetaMask 未安装');
          return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts.length > 0) {
          this.account = accounts[0];
          this.addLog('success', `MetaMask 账户连接成功: ${this.account}`);

          // 获取余额
          const web3 = new Web3(window.ethereum);
          const balanceWei = await web3.eth.getBalance(this.account);
          this.balance = web3.utils.fromWei(balanceWei, 'ether');
          this.addLog('info', `账户余额: ${this.balance} ETH`);
        } else {
          this.addLog('error', 'MetaMask 中没有找到账户');
        }
      } catch (error) {
        this.addLog('error', `MetaMask 测试失败: ${error.message}`);
      }
    },

    async testLocalNode() {
      this.addLog('info', '开始测试本地节点...');

      try {
        const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

        // 测试连接
        const isListening = await web3.eth.net.isListening();
        if (!isListening) {
          this.addLog('error', '本地节点未运行');
          return;
        }

        this.addLog('success', '本地节点连接成功');

        // 获取账户
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          this.account = accounts[0];
          this.addLog('success', `找到账户: ${this.account}`);

          // 获取余额
          const balanceWei = await web3.eth.getBalance(this.account);
          this.balance = web3.utils.fromWei(balanceWei, 'ether');
          this.addLog('info', `账户余额: ${this.balance} ETH`);
        } else {
          this.addLog('error', '本地节点中没有找到账户');
        }
      } catch (error) {
        this.addLog('error', `本地节点测试失败: ${error.message}`);
      }
    },

    async testAccounts() {
      this.addLog('info', '开始测试账户...');

      try {
        let web3;

        if (window.ethereum) {
          web3 = new Web3(window.ethereum);
        } else {
          web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
        }

        const accounts = await web3.eth.getAccounts();
        this.addLog('info', `找到 ${accounts.length} 个账户`);

        for (let i = 0; i < accounts.length; i++) {
          const account = accounts[i];
          const balanceWei = await web3.eth.getBalance(account);
          const balance = web3.utils.fromWei(balanceWei, 'ether');
          this.addLog('info', `账户 ${i + 1}: ${account} (${balance} ETH)`);
        }
      } catch (error) {
        this.addLog('error', `账户测试失败: ${error.message}`);
      }
    },

    async unlockAccount() {
      this.addLog('info', '开始解锁账户...');

      try {
        if (!this.account) {
          this.addLog('error', '请先连接账户');
          return;
        }

        const password = prompt('请输入账户密码:');
        if (!password) {
          this.addLog('error', '密码不能为空');
          return;
        }

        let web3;
        if (window.ethereum) {
          web3 = new Web3(window.ethereum);
        } else {
          web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
        }

        const result = await web3.eth.personal.unlockAccount(this.account, password, 0);

        if (result) {
          this.addLog('success', '账户解锁成功');
        } else {
          this.addLog('error', '账户解锁失败，请检查密码');
        }
      } catch (error) {
        this.addLog('error', `解锁账户失败: ${error.message}`);

        if (error.message.includes("Method personal_unlockAccount not supported")) {
          this.addLog('warning', '当前环境不支持账户解锁，建议使用 MetaMask');
        }
      }
    },


  }
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.test-section h2 {
  margin-top: 0;
  color: #333;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.status-item .label {
  font-weight: bold;
  color: #666;
}

.status-item .value {
  font-family: monospace;
}

.status-item .value.success {
  color: #28a745;
}

.status-item .value.error {
  color: #dc3545;
}

.btn {
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-success {
  background: #28a745;
  color: white;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
}

.log-item {
  display: flex;
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 12px;
}

.log-item.info {
  background: #d1ecf1;
  color: #0c5460;
}

.log-item.success {
  background: #d4edda;
  color: #155724;
}

.log-item.error {
  background: #f8d7da;
  color: #721c24;
}

.log-item.warning {
  background: #fff3cd;
  color: #856404;
}

.log-item .timestamp {
  margin-right: 10px;
  color: #666;
}

.solution-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.solution-item {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.solution-item h3 {
  margin-top: 0;
  color: #333;
}

.solution-item ul {
  margin: 10px 0;
  padding-left: 20px;
}

.solution-item li {
  margin-bottom: 5px;
  color: #666;
}
</style>
