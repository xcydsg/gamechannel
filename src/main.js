import { createApp } from 'vue'
import App from './App.vue'
import Web3 from 'web3'

// 导入CSS样式文件
import './assets/main.css'

// 初始化 Web3，连接到本地私链
let web3;

try {
  // 优先使用 MetaMask
  if (window.ethereum) {
    console.log('检测到 MetaMask，使用 MetaMask 提供者');
    web3 = new Web3(window.ethereum);
  } else {
    console.log('使用 HTTP 提供者连接到本地节点');
    web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
  }

  // 检查连接状态
  if (!web3.currentProvider) {
    console.error('Failed to connect to the blockchain node');
  } else {
    console.log('Successfully connected to the blockchain node');
    
    // 测试连接
    web3.eth.net.isListening()
      .then(isListening => {
        if (isListening) {
          console.log('区块链节点正在运行');
        } else {
          console.error('区块链节点未响应');
        }
      })
      .catch(error => {
        console.error('连接测试失败:', error);
      });
  }
} catch (error) {
  console.error('Web3 初始化失败:', error);
  web3 = null;
}

createApp(App).mount('#app')

// 将 Web3 实例挂载到全局，方便在组件中使用
window.web3 = web3;