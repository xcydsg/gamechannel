# 合约地址配置说明

## 📍 合约地址配置位置

### 1. 主配置文件
文件路径：`src/config/contracts.js`

```javascript
export const CONTRACT_CONFIG = {
  // 主合约地址 (GameItemStateChannel)
  MAIN_CONTRACT_ADDRESS: '0x9a554Ae04f65943907BB0A8f7b4b96123862F4AE',
  
  // GameToken合约地址 (如果直接部署，可以在这里设置)
  // 注意：如果使用getTokenAddress()方法获取，这个地址会在运行时自动获取
  GAME_TOKEN_ADDRESS: null,
  
  // 网络配置
  NETWORK: {
    RPC_URL: 'http://127.0.0.1:8545',
    CHAIN_ID: 1337, // 本地网络
    NETWORK_NAME: 'Local Development'
  }
};
```

### 2. 如何修改合约地址

#### 方法一：修改配置文件（推荐）
1. 打开 `src/config/contracts.js`
2. 修改 `MAIN_CONTRACT_ADDRESS` 为您的 GameItemStateChannel 合约地址
3. 如果需要直接设置 GameToken 地址，修改 `GAME_TOKEN_ADDRESS`

#### 方法二：直接修改 App.vue
1. 打开 `src/App.vue`
2. 找到第 1573 行左右的 `contractAddress` 配置
3. 修改为您的合约地址

## 🔧 部署步骤

### 1. 部署 GameToken 合约
```bash
# 使用 Truffle 或 Hardhat 部署 GameToken 合约
# 记录部署后的合约地址
```

### 2. 部署 GameItemStateChannel 合约
```bash
# 部署主合约，确保在构造函数中传入 GameToken 地址
# 记录部署后的合约地址
```

### 3. 更新前端配置
1. 修改 `src/config/contracts.js` 中的 `MAIN_CONTRACT_ADDRESS`
2. 如果需要，也可以设置 `GAME_TOKEN_ADDRESS`

## 📋 配置检查清单

- [ ] GameToken 合约已部署
- [ ] GameItemStateChannel 合约已部署
- [ ] 主合约地址已更新到配置文件
- [ ] 网络配置正确（RPC URL、Chain ID）
- [ ] 前端应用已重新启动

## 🚨 注意事项

1. **合约地址格式**：确保地址是有效的以太坊地址格式（0x开头的42位字符串）
2. **网络一致性**：确保前端连接的网络与合约部署的网络一致
3. **权限检查**：确保部署合约的账户有足够的权限执行相关操作
4. **Gas费用**：确保账户有足够的ETH支付Gas费用

## 🔍 调试技巧

1. **检查控制台**：打开浏览器开发者工具查看合约初始化日志
2. **验证连接**：确认Web3连接状态和账户连接状态
3. **测试功能**：尝试执行简单的合约调用验证配置是否正确

## 📞 常见问题

**Q: 合约地址更新后页面没有变化？**
A: 请刷新页面或重启开发服务器

**Q: 如何确认合约地址是否正确？**
A: 可以在区块链浏览器中查看合约地址，或使用Web3.js验证合约ABI

**Q: GameToken地址是自动获取的吗？**
A: 是的，通过调用主合约的 `getTokenAddress()` 方法自动获取 