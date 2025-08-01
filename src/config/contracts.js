const CONTRACT_CONFIG = {
  // 主合约地址 (GameItemStateChannel)
  MAIN_CONTRACT_ADDRESS: '0x72C26B2DE3790Cea6Ce6BC5e04a06d6782666fC9',
  
  // GameToken合约地址 (如果直接部署，可以在这里设置)
  // 注意：如果使用getTokenAddress()方法获取，这个地址会在运行时自动获取
  GAME_TOKEN_ADDRESS: '0xE938749Fa0881637516ED1b0340b454E35d8eD4F',
  
  // 网络配置
  NETWORK: {
    RPC_URL: 'http://127.0.0.1:8545',
    CHAIN_ID: 1337, // 本地网络
    NETWORK_NAME: 'Local Development'
  }
};

export default CONTRACT_CONFIG; 