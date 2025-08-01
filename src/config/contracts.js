const CONTRACT_CONFIG = {
  // 主合约地址 (GameItemStateChannel)
  MAIN_CONTRACT_ADDRESS: '0xABfd67554a1a6bB2D51aBC717458377d38c2B821',
  
  // GameToken合约地址 (如果直接部署，可以在这里设置)
  // 注意：如果使用getTokenAddress()方法获取，这个地址会在运行时自动获取
  GAME_TOKEN_ADDRESS: '0x66926037eA4991E1f4E635521ae87F7f1e9a3799',
  
  // 网络配置
  NETWORK: {
    RPC_URL: 'http://127.0.0.1:8545',
    CHAIN_ID: 1337, // 本地网络
    NETWORK_NAME: 'Local Development'
  }
};

export default CONTRACT_CONFIG; 