<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="nav">
      <div class="nav-container">
        <div class="nav-brand" @click="goToMarket">
          🎮 游戏道具交易市场
        </div>

        <div class="nav-links">
          <button @click="connectWallet" class="btn btn-primary">
            {{ account ? `已连接: ${shortenAddress(account)}` : '连接钱包' }}
          </button>
          <div v-if="account" class="user-balance">
            <span class="balance-label">ETH:</span>
            <span class="balance-value">{{ formatBalance(balance) }}</span>
            <span class="balance-label">GAME:</span>
            <span class="balance-value">{{ formatBalance(tokenBalance) }}</span>

          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">市场导航</h3>
          <nav class="sidebar-nav">
            <button @click="goToMarket" class="nav-btn" :class="{ active: currentView === 'market' }">
              🏠 市场首页
            </button>
            <button @click="goToInventory" class="nav-btn" :class="{ active: currentView === 'inventory' }">
              📦 我的库存
            </button>
            <button @click="goToChannels" class="nav-btn" :class="{ active: currentView === 'channels' }">
              🔗 交易通道
            </button>
            <button @click="goToAddItem" class="nav-btn" :class="{ active: currentView === 'add-item' }">
              ➕ 添加道具
            </button>
            <button @click="goToMyOrders" class="nav-btn" :class="{ active: currentView === 'my-orders' }">
              📋 我的订单
            </button>
            <button @click="goToLeaderboard" class="nav-btn" :class="{ active: currentView === 'leaderboard' }">
              🏆 排行榜
            </button>
          </nav>
        </div>
      </aside>

      <!-- 主内容 -->
      <main class="content">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1 class="page-title">{{ getPageTitle() }}</h1>
          <p class="page-description">{{ getPageDescription() }}</p>
        </div>

        <!-- 市场首页 -->
        <div v-if="currentView === 'market'" class="page-container">
          <div class="market-stats">
            <div class="stat-card">
              <span class="stat-icon">🎮</span>
              <span class="stat-value">{{ listedItemsCount || 0 }}</span>
              <span class="stat-label">在售道具</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">🪙</span>
              <span class="stat-value">GAME</span>
              <span class="stat-label">交易代币</span>
            </div>
          </div>

          <div class="market-actions">
            <button @click="openCreateChannelModal" class="btn btn-primary">
              🔗 创建交易通道
            </button>
            <!-- <button @click="testButtonClick" class="btn btn-secondary" style="margin-left: 10px;">
              测试按钮
            </button>
            <button @click="forceShowModal" class="btn btn-danger" style="margin-left: 10px;">
              强制显示模态框
            </button> -->
          </div>

          <div class="search-bar">
            <input type="text" v-model="searchQuery" placeholder="搜索道具名称..." class="form-input" />
          </div>

          <div v-if="marketItems.length === 0" class="empty-state">
            <div class="empty-state-icon">🛍️</div>
            <p>暂无商品</p>
            <p class="empty-state-description">市场暂时没有可购买的道具</p>
          </div>

          <div v-else class="item-grid">
            <div class="item-card" v-for="item in paginatedItems" :key="item.itemId">
              <div class="item-image">
                <img :src="item.imageURL" :alt="item.itemName" />
              </div>
              <div class="item-info">
                <h3 class="item-name">{{ item.itemName }}</h3>
                <p class="seller-address">卖家：{{ shortenAddress(item.owner) }}</p>
                <p class="item-description">{{ item.itemDescription }}</p>
                <div class="item-price">
                  <span class="price-value">{{ item.price }} GAME</span>
                </div>
                <div class="item-actions">
                  <button class="btn btn-secondary" @click="viewItemDetails(item)">查看详情</button>
                  <button v-if="item.status === 1" class="btn btn-primary" @click="tradeItem(item)">
                    立即购买
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="pagination">
            <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">
              上一页
            </button>
            <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
            <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="nextPage">
              下一页
            </button>
          </div>
        </div>

        <!-- 我的库存 -->
        <div v-if="currentView === 'inventory'" class="page-container">
          <div class="inventory-stats">
            <div class="stat-card">
              <span class="stat-icon">📦</span>
              <span class="stat-value">{{ totalItems }}</span>
              <span class="stat-label">总道具数</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">💰</span>
              <span class="stat-value">{{ listedItems }}</span>
              <span class="stat-label">在售道具</span>
            </div>
          </div>

          <div class="search-bar">
            <input type="text" v-model="searchQuery" placeholder="搜索道具名称..." class="form-input" />
          </div>

          <div class="item-grid">
            <div class="item-card" v-for="item in paginatedItems" :key="item.itemId">
              <div class="item-image">
                <img :src="item.imageURL" :alt="item.itemName" />
              </div>
              <div class="item-info">
                <h3 class="item-name">{{ item.itemName }}</h3>
                <p class="item-description">{{ item.itemDescription }}</p>
                <div class="item-price">
                  <span class="price-value">{{ item.price }} GAME</span>
                </div>
                <div class="item-actions">
                  <button class="btn btn-secondary" @click="viewItemDetails(item)">查看详情</button>
                  <button class="btn btn-primary" @click="manageItem(item)">管理道具</button>
                </div>
              </div>
            </div>
          </div>

          <div class="pagination">
            <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">
              上一页
            </button>
            <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
            <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="nextPage">
              下一页
            </button>
          </div>
        </div>

        <!-- 交易通道 -->
        <div v-if="currentView === 'channels'" class="page-container">
          <div class="page-header">
            <h2>我的交易通道</h2>
            <div class="header-actions">
              <!-- <button class="btn btn-secondary" @click="fetchMyChannels">
                刷新通道
              </button> -->
              <!-- <button class="btn btn-primary" @click="testChannelData">
                测试数据
              </button>
              <button class="btn btn-primary" @click="testChannelSummary(1)">
                测试通道详情
              </button> -->
            </div>
          </div>

          <div v-if="myChannels.length === 0" class="empty-state">
            <div class="empty-state-icon">🔗</div>
            <p>暂无交易通道</p>
          </div>

          <div v-else>
            <div class="channel-grid">
              <div class="channel-card" v-for="channel in paginatedChannels" :key="channel.id">
                <div class="channel-header">
                  <h3>通道 #{{ channel.id }}</h3>
                  <span class="status" :class="{
                    'status-success': channel.isOpen,
                    'status-danger': !channel.isOpen
                  }">
                    {{ channel.isOpen ? '开启' : '关闭' }}
                  </span>
                </div>

                <div class="channel-details">
                  <div class="detail-row">
                    <span class="label">玩家1:</span>
                    <span class="value">{{ shortenAddress(channel.player1) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">玩家2:</span>
                    <span class="value">{{ shortenAddress(channel.player2) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">余额:</span>
                    <span class="value">{{ channel.balance ? (channel.balance / 1e18).toFixed(4) : '0.0000' }}
                      Game</span>
                  </div>
                </div>

                <div class="channel-actions" v-if="channel.isOpen">
                  <button class="btn btn-primary" @click="settleChannel(channel.id)">
                    结算通道
                  </button>
                </div>
              </div>
            </div>

            <div class="pagination">
              <button class="btn btn-secondary" :disabled="currentChannelPage === 1" @click="prevChannelPage">
                上一页
              </button>
              <span class="page-info">第 {{ currentChannelPage }} 页 / 共 {{ totalChannelPages }} 页</span>
              <button class="btn btn-secondary" :disabled="currentChannelPage === totalChannelPages"
                @click="nextChannelPage">
                下一页
              </button>
            </div>
          </div>
        </div>

        <!-- 我的订单 -->
        <div v-if="currentView === 'my-orders'" class="page-container">
          <div class="page-header">
            <h2>我的订单</h2>
            <div class="header-actions">
              <!-- <button class="btn btn-secondary" @click="fetchMyOrders">
                刷新订单
              </button>
              <button class="btn btn-primary" @click="testOrderData" style="margin-left: 10px;">
                测试订单数据
              </button>
              <button class="btn btn-secondary" @click="debugOrderData" style="margin-left: 10px;">
                调试数据
              </button> -->
              <!-- <button class="btn btn-warning" @click="toggleEventData" style="margin-left: 10px;">
                {{ showEventData ? '隐藏事件数据' : '显示事件数据' }}
              </button> -->
            </div>
          </div>

          <div v-if="myOrders.length === 0" class="empty-state">
            <div class="empty-state-icon">📋</div>
            <p>暂无订单记录</p>
            <p class="empty-state-description">订单数量: {{ myOrders.length }} | 总订单数: {{ allOrders.length }}</p>
            <p class="empty-state-description">调试信息: 当前账户 = {{ account }}</p>
          </div>

          <div v-else>
            <div class="order-table">
              <div class="order-row header">
                <div>订单ID</div>
                <div>道具ID</div>
                <div>交易金额</div>
                <div>交易身份</div>
                <div>区块高度</div>
                <div>时间</div>
              </div>

              <div v-for="order in paginatedOrders" :key="order.orderId" class="order-row">
                <div>#{{ order.orderId }}</div>
                <div>{{ order.itemId }}</div>
                <div>{{ (order.amount || 0).toFixed(4) }} Game</div>
                <div>
                  <span v-if="(order.seller || '').toLowerCase() === (account || '').toLowerCase()"
                    class="status status-success">卖家</span>
                  <span v-else class="status status-info">买家</span>
                </div>
                <div>{{ order.blockNumber > 0 ? order.blockNumber.toLocaleString() : '未知' }}</div>
                <div>{{ order.timestamp }}</div>
              </div>
            </div>

            <div class="pagination">
              <button class="btn btn-secondary" :disabled="currentOrderPage === 1" @click="currentOrderPage--">
                上一页
              </button>
              <span class="page-info">第 {{ currentOrderPage }} 页 / 共 {{ totalOrderPages }} 页</span>
              <button class="btn btn-secondary" :disabled="currentOrderPage === totalOrderPages"
                @click="currentOrderPage++">
                下一页
              </button>
            </div>
          </div>
        </div>

        <!-- 排行榜 -->
        <div v-if="currentView === 'leaderboard'" class="page-container">
          <div class="leaderboard-header">
            <div class="btn-group">
              <button @click="leaderboardType = 'buyer'" :class="{ active: leaderboardType === 'buyer' }"
                class="btn btn-secondary">
                买家榜
              </button>
              <button @click="leaderboardType = 'seller'" :class="{ active: leaderboardType === 'seller' }"
                class="btn btn-secondary">
                卖家榜
              </button>
            </div>
          </div>

          <div class="leaderboard-list" v-if="processedLeaderboard[leaderboardType + 's'].length > 0">
            <div v-for="(item, index) in processedLeaderboard[leaderboardType + 's']" :key="item.address"
              class="leaderboard-item" :class="{ 'first-place': index === 0 }">
              <div class="rank">#{{ index + 1 }}</div>
              <div class="address">{{ shortenAddress(item.address) }}</div>
              <div class="stats">
                <span>总金额：{{ (item.total / 1e18).toFixed(2) }} Game</span>
                <span>交易次数：{{ item.count }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <div class="empty-state-icon">🏆</div>
            <p>暂无排行榜数据</p>
          </div>
        </div>

        <!-- 添加道具 -->
        <div v-if="currentView === 'add-item'" class="page-container">
          <div class="add-item-form">
            <form @submit.prevent="addNewGameItem">
              <div class="form-group">
                <label for="recipientAddress" class="form-label">目标地址:</label>
                <input type="text" id="recipientAddress" v-model="newItem.recipientAddress" placeholder="请输入目标地址"
                  class="form-input" required />
              </div>
              <div class="form-group">
                <label for="itemName" class="form-label">道具名称:</label>
                <input type="text" id="itemName" v-model="newItem.name" placeholder="请输入道具名称" class="form-input"
                  required />
              </div>
              <div class="form-group">
                <label for="itemDescription" class="form-label">道具描述:</label>
                <textarea id="itemDescription" v-model="newItem.description" placeholder="请输入道具描述"
                  class="form-input form-textarea" required></textarea>
              </div>
              <div class="form-group">
                <label for="itemPrice" class="form-label">道具价格 (GAME):</label>
                <input type="number" id="itemPrice" v-model.number="newItem.price" step="any" min="0"
                  placeholder="请输入道具价格" class="form-input" required />
              </div>
              <div class="form-group">
                <label for="itemImage" class="form-label">道具图片:</label>
                <input type="file" id="itemImage" accept="image/*" @change="handleImageUpload" class="form-input" />
                <div v-if="imagePreview" class="image-preview">
                  <img :src="imagePreview" alt="预览图" />
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-full">添加道具</button>
            </form>
          </div>
        </div>
      </main>
    </div>

    <!-- 模态框 -->
    <div class="modal-overlay" v-if="showCreateChannelModal" @click="closeCreateChannel">
      <!-- 调试信息 -->
      <div style="position: fixed; top: 10px; left: 10px; background: red; color: white; padding: 10px; z-index: 2000;">
        模态框显示状态: {{ showCreateChannelModal }}
      </div>
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">创建交易通道</h2>
          <button class="modal-close" @click="closeCreateChannel">&times;</button>
        </div>
        <div class="modal-body">
          <ChannelCreate @channel-created="handleChannelCreated" />
        </div>
      </div>
    </div>

    <!-- 道具详情模态框 -->
    <div class="modal-overlay" v-if="selectedItem" @click="closeItemDetails">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedItem.itemName }}</h2>
          <button class="modal-close" @click="closeItemDetails">&times;</button>
        </div>
        <div class="modal-body">
          <div class="item-detail-container">
            <div class="item-detail-info">
              <p class="detail-row"><span>描述:</span> {{ selectedItem.itemDescription }}</p>
              <p class="detail-row"><span>卖家:</span> {{ selectedItem.owner }}</p>
              <p class="detail-row"><span>价格:</span> {{ selectedItem.price }} GAME</p>
              <p class="detail-row"><span>状态:</span> {{ selectedItem.status === 1 ? '上架' : '下架' }}</p>
              <div class="item-detail-actions">
                <button v-if="selectedItem.status === 1 && currentView === 'market'" class="btn btn-primary"
                  @click="tradeItem(selectedItem)">购买</button>
                <button v-if="selectedItem.owner === account" class="btn btn-secondary"
                  @click="manageItem(selectedItem)">管理道具</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- 道具管理模态框 -->
    <div class="modal-overlay" v-if="showManageItemModal" @click="closeManageItem">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">管理道具</h2>
          <button class="modal-close" @click="closeManageItem">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="managingItem">
            <p>道具名称: {{ managingItem.itemName }}</p>
            <p>当前状态: {{ managingItem.status === 1 ? '上架' : '下架' }}</p>
            <div class="item-actions">
              <button v-if="managingItem.status === 0" @click="listItem(managingItem.itemId)" class="btn btn-primary">
                上架道具
              </button>
              <button v-if="managingItem.status === 1" @click="delistItem(managingItem.itemId)"
                class="btn btn-secondary">
                下架道具
              </button>
              <button v-if="isContractOwner" @click="deleteItem(managingItem.itemId)" class="btn btn-danger">
                删除道具
              </button>
            </div>
            <p>当前价格: {{ formatBalance(managingItem.price) }} GAME</p>
            <div class="price-update-form">
              <input type="number" v-model.number="newPrice" placeholder="输入新价格（GAME）" step="0.0001" min="0"
                class="form-input">
              <button @click="updateItemPrice" :disabled="!isPriceValid" class="btn btn-primary">
                更新价格
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 新增IPFS上传函数
import axios from 'axios';

const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'pinata_api_key': 'd186388372fa52d94f7c',
        'pinata_secret_api_key': '45f74da91bf4b1f762ce0c348ea5b9e1fd400e609ddc6668adb88e348844f709'
      }
    }
  );

  return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
};
import ChannelCreate from './components/ChannelCreate.vue';
import Web3 from 'web3';
import CONTRACT_CONFIG from './config/contracts.js';

// GameToken合约ABI (标准ERC20代币)
const gameTokenABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// 智能合约ABI (更新后的版本)
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "channelId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "player1",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "player2",
        "type": "address"
      }
    ],
    "name": "ChannelCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "channelId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "player1",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "player2",
        "type": "address"
      }
    ],
    "name": "ChannelSettled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "itemName",
        "type": "string"
      }
    ],
    "name": "GameItemAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      }
    ],
    "name": "GameItemDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      }
    ],
    "name": "GameItemPriceUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      }
    ],
    "name": "GameItemStatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "channelId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      }
    ],
    "name": "ItemTraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      }
    ],
    "name": "OrderCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TransferDetails",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_player",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_imageURL",
        "type": "string"
      }
    ],
    "name": "addGameItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "channelCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_player2",
        "type": "address"
      }
    ],
    "name": "createChannel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      }
    ],
    "name": "deleteGameItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      }
    ],
    "name": "delistGameItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_channelId",
        "type": "uint256"
      }
    ],
    "name": "emergencyCloseChannel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameItemCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "gameItems",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "itemName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "itemDescription",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "status",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "imageURL",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameToken",
    "outputs": [
      {
        "internalType": "contract GameToken",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_channelId",
        "type": "uint256"
      }
    ],
    "name": "getChannelSummary",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getListedItemsCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_orderId",
        "type": "uint256"
      }
    ],
    "name": "getOrder",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSellerCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      }
    ],
    "name": "listGameItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "listedItemsCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "listedItemsPerSeller",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "orderCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "orders",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sellerCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_channelId",
        "type": "uint256"
      }
    ],
    "name": "settleChannel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_channelId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      }
    ],
    "name": "tradeItemInChannel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_newPrice",
        "type": "uint256"
      }
    ],
    "name": "updateItemPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "viewAllGameItems",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "prices",
        "type": "uint256[]"
      },
      {
        "internalType": "address[]",
        "name": "owners",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "statuses",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "viewMyChannels",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "ids",
        "type": "uint256[]"
      },
      {
        "internalType": "address[]",
        "name": "player1s",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "player2s",
        "type": "address[]"
      },
      {
        "internalType": "bool[]",
        "name": "statuses",
        "type": "bool[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "viewPlayerInventory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "itemName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "status",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "itemDescription",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "imageURL",
            "type": "string"
          }
        ],
        "internalType": "struct GameItemStateChannel.InventoryItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "withdrawTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default {
  components: {
    ChannelCreate
  },
  data() {
    return {
      account: null,
      balance: 0,
      contract: null,
      contractAddress: CONTRACT_CONFIG.MAIN_CONTRACT_ADDRESS, // 从配置文件读取合约地址
      marketItems: [],
      myInventory: [],
      newPrice: null,
      managingItem: null,
      myChannels: [],
      currentPage: 1,
      imageFile: null,
      imagePreview: null,
      myOrders: [],
      allOrders: [],
      currentOrderPage: 1,
      ordersPerPage: 5,
      web3: null,
      itemsPerPage: 6,

      listedItemsCount: null,
      currentChannelPage: 1,
      sortField: 'price', // 默认排序字段
      sortDirection: 'asc', // 默认排序方向
      channelsPerPage: 4,
      showCreateChannelModal: false,
      selectedItem: null,
      currentView: 'market',
      newItem: {
        recipientAddress: '',
        name: '',
        description: '',
        price: 0
      },
      filterPriceMin: null,
      filterPriceMax: null,
      showManageItemModal: false,
      managingItem: null,
      isContractOwner: false,
      searchQuery: '',
      leaderboardType: 'buyer',
      gameToken: null,
      gameTokenAddress: null,
      tokenBalance: 0,
      showEventData: false, // 控制是否显示事件数据
    };
  },
  async mounted() {
    await this.connectToWeb3();
    await this.fetchMarketItems();
    this.setupAccountChangeListener();
    await this.fetchMarketStats();
    await this.fetchTokenBalance();
    this.checkContractOwner();
  },
  // 修改管理道具方法
  manageItem(item) {
    this.managingItem = item;
    this.showManageItemModal = true;
    this.newPrice = item.price / 1e18; // 初始化价格为当前价格
  },
  computed: {
    isPriceValid() {
      return this.newPrice > 0 &&
        this.newPrice !== (this.managingItem.price / 1e18);
    },
    totalItems() {
      return this.myInventory.length;
    },
    listedItems() {
      return this.myInventory.filter(item => item.status === 1).length;
    },
    processedLeaderboard() {
      // 使用reduce初始化统计对象
      const stats = this.allOrders.reduce((acc, order) => {
        // 确保 buyer 和 seller 存在
        const buyer = order.buyer || '';
        const seller = order.seller || '';

        // 买家统计
        const buyerKey = buyer.toLowerCase();
        if (buyerKey) {
          acc.buyers[buyerKey] = acc.buyers[buyerKey] || {
            address: buyer,
            total: 0,
            count: 0
          };
          acc.buyers[buyerKey].total += order.rawAmount || 0;
          acc.buyers[buyerKey].count++;
        }

        // 卖家统计
        const sellerKey = seller.toLowerCase();
        if (sellerKey) {
          acc.sellers[sellerKey] = acc.sellers[sellerKey] || {
            address: seller,
            total: 0,
            count: 0
          };
          acc.sellers[sellerKey].total += order.rawAmount || 0;
          acc.sellers[sellerKey].count++;
        }

        return acc;
      }, { buyers: {}, sellers: {} });

      // 转换为数组并排序
      return {
        buyers: Object.values(stats.buyers)
          .sort((a, b) => b.total - a.total)
          .slice(0, 5),
        sellers: Object.values(stats.sellers)
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
      };
    },
    paginatedOrders() {
      if (!this.myOrders || this.myOrders.length === 0) {
        return [];
      }
      const start = (this.currentOrderPage - 1) * this.ordersPerPage;
      const end = start + this.ordersPerPage;
      return this.myOrders.slice(start, end);
    },
    totalOrderPages() {
      if (!this.myOrders || this.myOrders.length === 0) {
        return 1;
      }
      return Math.ceil(this.myOrders.length / this.ordersPerPage);
    },
    paginatedChannels() {
      const start = (this.currentChannelPage - 1) * this.channelsPerPage;
      const end = start + this.channelsPerPage;
      return this.myChannels.slice(start, end);
    },
    totalChannelPages() {
      return Math.ceil(this.myChannels.length / this.channelsPerPage);
    }
    ,
    filteredItems() {
      let items = [...this.currentView === 'market' ? this.marketItems : this.myInventory];
      console.log('filteredItems - 当前视图:', this.currentView);
      console.log('filteredItems - marketItems数量:', this.marketItems.length);
      console.log('filteredItems - myInventory数量:', this.myInventory.length);
      console.log('filteredItems - 初始items数量:', items.length);

      // 搜索筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        items = items.filter(item => {
          return (
            item.itemId.toString().includes(query) ||
            item.itemName.toLowerCase().includes(query)
          );
        });
      }

      // 价格筛选
      if (this.filterPriceMin !== null || this.filterPriceMax !== null) {
        items = items.filter(item => {
          const price = item.price / 1e18;
          if (this.filterPriceMin !== null && price < this.filterPriceMin) return false;
          if (this.filterPriceMax !== null && price > this.filterPriceMax) return false;
          return true;
        });
      }

      // 市场首页只显示上架状态的道具 (已经在fetchMarketItems中过滤过了)
      // if (this.currentView === 'market') {
      //   items = items.filter(item => item.status === 1);
      // }
      // 添加排序逻辑
      return items.sort((a, b) => {
        let modifier = this.sortDirection === 'asc' ? 1 : -1;
        if (this.sortField === 'price') {
          return (a.price - b.price) * modifier;
        } else {
          return a.itemName.localeCompare(b.itemName) * modifier;
        }
      });
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    }
  },

  methods: {
    // 新增方法
    getPageTitle() {
      const titles = {
        'market': '市场首页',
        'inventory': '我的库存',
        'channels': '交易通道',
        'add-item': '添加道具',
        'my-orders': '我的订单',
        'leaderboard': '排行榜'
      };
      return titles[this.currentView] || '游戏道具交易市场';
    },

    getPageDescription() {
      const descriptions = {
        'market': '浏览和购买游戏道具',
        'inventory': '管理您的游戏道具',
        'channels': '查看和管理交易通道',
        'add-item': '添加新的游戏道具到市场',
        'my-orders': '查看您的交易历史',
        'leaderboard': '查看交易排行榜'
      };
      return descriptions[this.currentView] || '';
    },

    async initContract() {
      try {
        console.log('开始初始化合约...');
        console.log('合约地址:', this.contractAddress);

        // 优先使用 MetaMask 或其他 Web3 提供者
        if (window.ethereum) {
          console.log('使用 MetaMask 提供者');
          this.web3 = new Web3(window.ethereum);
        } else if (window.web3 && window.web3.currentProvider) {
          console.log('使用现有的 Web3 提供者');
          this.web3 = new Web3(window.web3.currentProvider);
        } else {
          console.log('使用 HTTP 提供者');
          this.web3 = new Web3(new Web3.providers.HttpProvider(CONTRACT_CONFIG.NETWORK.RPC_URL));
        }

        this.contract = new this.web3.eth.Contract(
          contractABI,
          this.contractAddress
        );
        console.log('主合约初始化成功');

        // 优先使用配置文件中的GameToken地址，如果没有则从合约获取
        if (CONTRACT_CONFIG.GAME_TOKEN_ADDRESS) {
          this.gameTokenAddress = CONTRACT_CONFIG.GAME_TOKEN_ADDRESS;
          console.log('使用配置文件中的GameToken地址:', this.gameTokenAddress);
        } else {
          // 从主合约获取GameToken地址
          this.gameTokenAddress = await this.contract.methods.gameToken().call();
          console.log('从合约获取的GameToken地址:', this.gameTokenAddress);
        }

        // 初始化GameToken合约
        this.gameToken = new this.web3.eth.Contract(
          gameTokenABI,
          this.gameTokenAddress
        );
        console.log('GameToken合约初始化成功');

        // 获取代币信息
        await this.getTokenInfo();
        console.log('合约初始化完成');
      } catch (error) {
        console.error('合约初始化失败:', error);
      }
    },

    // 修改后的价格更新方法
    async updateItemPrice() {
      try {
        if (!this.isPriceValid) return;

        // 确保已连接钱包
        if (!this.account) {
          throw new Error("请先连接钱包");
        }

        // 初始化 Web3 实例（重要！）
        const web3 = new Web3(window.ethereum);

        const contract = this.contract
        const itemId = this.managingItem.itemId;

        // 使用 web3.utils 而不是 Web3.utils
        const priceInWei = web3.utils.toWei(this.newPrice.toString(), 'ether');

        await contract.methods.updateItemPrice(
          itemId,
          priceInWei
        ).send({ from: this.account });

        alert('价格更新成功！');
        this.fetchMyInventory();
        this.fetchMarketItems();
        this.newPrice = null;
      } catch (error) {
        console.error('价格更新失败:', error);
        alert(`价格更新失败: ${error.message}`);
      }
    },
    // 处理图片上传
    async handleImageUpload(e) {
      const file = e.target.files[0];
      if (file) {
        this.imageFile = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    toNumber(value) {
      // 处理 null 或 undefined
      if (value === null || value === undefined) {
        return 0;
      }

      // 处理空字符串
      if (value === '') {
        return 0;
      }

      // 处理 BigInt 类型
      if (typeof value === 'bigint') {
        return Number(value);
      }

      // 处理十六进制字符串
      if (typeof value === 'string' && value.startsWith('0x')) {
        const parsed = parseInt(value, 16);
        return isNaN(parsed) ? 0 : parsed;
      }

      // 处理普通数字或字符串
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    },
    async fetchMyOrders() {
      try {
        console.log('=== 开始获取订单数据 ===');

        if (!this.account) {
          console.warn('当前账户未设置，无法获取订单');
          this.myOrders = [];
          this.allOrders = [];
          return;
        }

        if (!this.contract) {
          console.warn('合约未初始化，无法获取订单');
          this.myOrders = [];
          this.allOrders = [];
          return;
        }

        console.log('当前账户:', this.account);
        console.log('合约地址:', this.contractAddress);

        // 尝试获取 ItemTraded 事件（这是实际交易事件）
        let tradeEvents = [];
        let orderEvents = [];

        // 只在需要显示事件数据时获取事件
        if (this.showEventData) {
          try {
            console.log('尝试获取 ItemTraded 事件...');

            // 使用更小的区块范围来避免 RPC 错误
            const latestBlock = await this.web3.eth.getBlockNumber();
            // 转换为数字类型以避免 BigInt 混合错误
            const latestBlockNum = Number(latestBlock);
            // 根据网络类型调整区块范围
            const blockRange = latestBlockNum > 100000 ? 10000 : latestBlockNum; // 如果区块数很多，只获取最近10000个
            const fromBlock = Math.max(0, latestBlockNum - blockRange);

            console.log(`获取 ItemTraded 事件区块范围: ${fromBlock} 到 ${latestBlockNum} (范围: ${blockRange})`);

            tradeEvents = await this.contract.getPastEvents('ItemTraded', {
              fromBlock: fromBlock,
              toBlock: 'latest'
            });
            console.log('ItemTraded 事件数量:', tradeEvents.length);
          } catch (error) {
            console.error('获取 ItemTraded 事件失败:', error);

            // 如果获取事件失败，尝试使用备用方案
            try {
              console.log('尝试使用备用方案获取 ItemTraded 事件...');
              tradeEvents = await this.contract.getPastEvents('ItemTraded', {
                fromBlock: 'latest',
                toBlock: 'latest'
              });
              console.log('备用方案获取的 ItemTraded 事件数量:', tradeEvents.length);
            } catch (backupError) {
              console.error('ItemTraded 备用方案也失败了:', backupError);
              tradeEvents = [];
            }
          }

          // 尝试获取 OrderCreated 事件
          try {
            console.log('尝试获取 OrderCreated 事件...');

            // 使用更小的区块范围来避免 RPC 错误
            const latestBlock = await this.web3.eth.getBlockNumber();
            // 转换为数字类型以避免 BigInt 混合错误
            const latestBlockNum = Number(latestBlock);
            // 根据网络类型调整区块范围
            const blockRange = latestBlockNum > 100000 ? 10000 : latestBlockNum; // 如果区块数很多，只获取最近10000个
            const fromBlock = Math.max(0, latestBlockNum - blockRange);

            console.log(`获取区块范围: ${fromBlock} 到 ${latestBlockNum} (范围: ${blockRange})`);

            orderEvents = await this.contract.getPastEvents('OrderCreated', {
              fromBlock: fromBlock,
              toBlock: 'latest'
            });
            console.log('OrderCreated 事件数量:', orderEvents.length);
          } catch (error) {
            console.error('获取 OrderCreated 事件失败:', error);
            console.log('这可能是 MetaMask RPC 错误，但订单数据仍然可用');
            console.log('提示: 如果经常出现此错误，可以尝试切换到本地网络或减少区块范围');

            // 如果获取事件失败，尝试使用备用方案
            try {
              console.log('尝试使用备用方案获取事件...');
              orderEvents = await this.contract.getPastEvents('OrderCreated', {
                fromBlock: 'latest',
                toBlock: 'latest'
              });
              console.log('备用方案获取的事件数量:', orderEvents.length);
            } catch (backupError) {
              console.error('备用方案也失败了:', backupError);
              orderEvents = [];
            }
          }
        } else {
          console.log('跳过事件数据获取（showEventData = false）');
        }

        const orders = [];

        // 处理 ItemTraded 事件（主要交易记录）
        for (let i = 0; i < tradeEvents.length; i++) {
          const event = tradeEvents[i];
          try {
            console.log(`处理 ItemTraded 事件 ${i + 1}:`, event.returnValues);

            // 验证事件数据是否有效
            const itemId = this.toNumber(event.returnValues.itemId || 0);
            const seller = event.returnValues.seller || '0x0000000000000000000000000000000000000000';
            const buyer = event.returnValues.buyer || '0x0000000000000000000000000000000000000000';

            // 只添加有效的事件数据（itemId > 0 且买卖双方地址不同）
            if (itemId > 0 && seller !== buyer &&
              seller !== '0x0000000000000000000000000000000000000000' &&
              buyer !== '0x0000000000000000000000000000000000000000') {

              const orderObject = {
                orderId: `trade_${i + 1}`,
                itemId: itemId,
                seller: seller,
                buyer: buyer,
                blockNumber: event.blockNumber,
                timestamp: new Date().toLocaleString(), // 使用当前时间作为备用
                amount: 0, // ItemTraded 事件可能不包含金额信息
                rawAmount: 0,
                eventType: 'ItemTraded'
              };

              orders.push(orderObject);
              console.log(`添加有效的 ItemTraded 事件: itemId=${itemId}, seller=${seller}, buyer=${buyer}`);
            } else {
              console.log(`跳过无效的 ItemTraded 事件: itemId=${itemId}, seller=${seller}, buyer=${buyer}`);
            }
          } catch (error) {
            console.error(`处理 ItemTraded 事件 ${i + 1} 失败:`, error);
          }
        }

        // 处理 OrderCreated 事件
        for (let i = 0; i < orderEvents.length; i++) {
          const event = orderEvents[i];
          try {
            console.log(`处理 OrderCreated 事件 ${i + 1}:`, event.returnValues);

            // 验证 OrderCreated 事件是否有效
            const orderId = Number(event.returnValues.orderId || 0);

            // 只添加有效的订单事件（orderId > 0）
            if (orderId > 0) {
              const orderObject = {
                orderId: `order_${orderId}`,
                itemId: 0, // OrderCreated 事件可能不包含道具ID
                seller: '0x0000000000000000000000000000000000000000',
                buyer: '0x0000000000000000000000000000000000000000',
                blockNumber: event.blockNumber,
                timestamp: new Date().toLocaleString(),
                amount: 0,
                rawAmount: 0,
                eventType: 'OrderCreated'
              };

              orders.push(orderObject);
              console.log(`添加有效的 OrderCreated 事件: orderId=${orderId}`);
            } else {
              console.log(`跳过无效的 OrderCreated 事件: orderId=${orderId}`);
            }
          } catch (error) {
            console.error(`处理 OrderCreated 事件 ${i + 1} 失败:`, error);
          }
        }

        // 尝试获取订单总数和详细信息
        try {
          console.log('尝试获取订单计数器...');
          const orderCount = Number(await this.contract.methods.orderCounter().call());
          console.log('订单总数:', orderCount);

          console.log('开始获取订单详细信息...');

          for (let i = 1; i <= orderCount; i++) {
            try {
              console.log(`尝试获取订单 ${i} 的详细信息...`);
              const orderData = await this.contract.methods.getOrder(i).call();
              console.log(`订单 ${i} 数据:`, orderData);

              if (orderData && orderData[0]) {
                const parsedData = {
                  itemId: this.toNumber(orderData[0]),
                  seller: orderData[1] || '0x0000000000000000000000000000000000000000',
                  buyer: orderData[2] || '0x0000000000000000000000000000000000000000',
                  blockNumber: this.toNumber(orderData[3]),
                  timestamp: this.toNumber(orderData[4]),
                  amount: this.toNumber(orderData[5]),
                  rawAmount: this.toNumber(orderData[5]),
                  eventType: 'getOrder'
                };

                let timestampStr;
                if (!isNaN(parsedData.timestamp) && parsedData.timestamp > 0) {
                  timestampStr = new Date(parsedData.timestamp * 1000).toLocaleString();
                } else {
                  timestampStr = '未知时间';
                }

                const orderObject = {
                  orderId: i,
                  ...parsedData,
                  amount: parsedData.amount / 1e18,
                  timestamp: timestampStr
                };

                orders.push(orderObject);
              }
            } catch (orderError) {
              console.error(`获取订单 ${i} 失败:`, orderError);
            }
          }
        } catch (error) {
          console.error('获取订单计数器失败:', error);
        }

        console.log('所有订单数据:', orders);

        // 过滤当前用户相关订单
        this.myOrders = orders.filter(order => {
          const seller = order.seller || '';
          const buyer = order.buyer || '';

          if (!this.account) {
            console.warn('当前账户未设置，跳过订单过滤');
            return false;
          }

          const currentAccount = this.account.toLowerCase();
          const isRelevant = seller.toLowerCase() === currentAccount ||
            buyer.toLowerCase() === currentAccount;

          console.log(`订单 ${order.orderId}: seller=${seller}, buyer=${buyer}, isRelevant=${isRelevant}`);
          return isRelevant;
        });

        this.allOrders = orders;

        console.log('过滤后的我的订单:', this.myOrders);
        console.log('所有订单:', this.allOrders);

        // 如果没有订单数据，添加一些测试数据
        if (this.myOrders.length === 0 && this.allOrders.length === 0) {
          console.log('没有找到订单数据，添加测试数据');
          const testOrders = [
            {
              orderId: 'test_1',
              itemId: 1,
              seller: this.account,
              buyer: '0x1234567890123456789012345678901234567890',
              blockNumber: 12345,
              timestamp: new Date().toLocaleString(),
              amount: 0.1,
              rawAmount: 100000000000000000,
              eventType: 'Test'
            },
            {
              orderId: 'test_2',
              itemId: 2,
              seller: '0x1234567890123456789012345678901234567890',
              buyer: this.account,
              blockNumber: 12346,
              timestamp: new Date().toLocaleString(),
              amount: 0.05,
              rawAmount: 50000000000000000,
              eventType: 'Test'
            }
          ];

          this.myOrders = testOrders;
          this.allOrders = testOrders;
          console.log('已添加测试订单数据');
        } else {
          console.log('找到真实订单数据，无需添加测试数据');
        }

      } catch (error) {
        console.error('获取订单失败:', error);
        this.myOrders = [];
        this.allOrders = [];
      }
    },

    // 缩短哈希显示
    shortenHash(hash) {
      if (!hash || hash === '未知') {
        return '未知';
      }

      // 检查是否是有效的哈希格式
      if (hash.startsWith('0x') && hash.length >= 10) {
        return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
      }

      // 如果不是标准哈希格式，返回原值
      return hash;
    },

    // 时间戳格式化
    // formatTimestamp(timestamp) {
    //   if (!timestamp) return '未知时间';
    //   const date = new Date(timestamp * 1000);
    //   return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    // },
    async fetchMarketStats() {
      try {
        const listedItemsCount = await this.contract.methods.getListedItemsCount().call();

        // 转换为数字类型
        this.listedItemsCount = Number(listedItemsCount);

        // 如果使用vuex需要commit mutation
      } catch (error) {
        console.error('获取统计失败:', error);
      }
    },
    async goToMyOrders() {
      this.currentView = 'my-orders';
      console.log('切换到订单页面，开始获取订单数据...');
      await this.fetchMyOrders();
      console.log('订单数据获取完成，当前订单数量:', this.myOrders.length);
      // TODO: 实现订单获取逻辑
    },
    async goToLeaderboard() {
      this.currentView = 'leaderboard';
      await this.fetchMyOrders(); // 主动调用获取数据
      // TODO: 实现排行榜逻辑
    },

    async testOrderData() {
      try {
        console.log('=== 测试订单数据 ===');
        console.log('当前账户:', this.account);
        console.log('合约实例:', this.contract);

        if (!this.contract) {
          alert('合约未初始化');
          return;
        }

        // 测试获取事件
        console.log('测试获取 ItemTraded 事件...');
        try {
          const latestBlock = await this.web3.eth.getBlockNumber();
          const latestBlockNum = Number(latestBlock);
          const blockRange = latestBlockNum > 100000 ? 10000 : latestBlockNum;
          const fromBlock = Math.max(0, latestBlockNum - blockRange);

          console.log(`测试区块范围: ${fromBlock} 到 ${latestBlockNum} (范围: ${blockRange})`);

          const tradeEvents = await this.contract.getPastEvents('ItemTraded', {
            fromBlock: fromBlock,
            toBlock: 'latest'
          });
          console.log('ItemTraded 事件:', tradeEvents);
        } catch (error) {
          console.error('获取 ItemTraded 事件失败:', error);
        }

        console.log('测试获取 OrderCreated 事件...');
        try {
          const latestBlock = await this.web3.eth.getBlockNumber();
          const latestBlockNum = Number(latestBlock);
          const blockRange = latestBlockNum > 100000 ? 10000 : latestBlockNum;
          const fromBlock = Math.max(0, latestBlockNum - blockRange);

          const orderEvents = await this.contract.getPastEvents('OrderCreated', {
            fromBlock: fromBlock,
            toBlock: 'latest'
          });
          console.log('OrderCreated 事件:', orderEvents);
        } catch (error) {
          console.error('获取 OrderCreated 事件失败:', error);
        }

        // 测试获取订单计数器
        try {
          const orderCount = await this.contract.methods.orderCounter().call();
          console.log('订单计数器:', orderCount);
        } catch (error) {
          console.error('获取订单计数器失败:', error);
        }

        alert('测试完成，请查看控制台输出');
      } catch (error) {
        console.error('测试订单数据失败:', error);
        alert('测试失败: ' + error.message);
      }
    },

    debugOrderData() {
      console.log('=== 调试订单数据 ===');
      console.log('当前账户:', this.account);
      console.log('myOrders 长度:', this.myOrders.length);
      console.log('allOrders 长度:', this.allOrders.length);
      console.log('myOrders 数据:', this.myOrders);
      console.log('allOrders 数据:', this.allOrders);
      console.log('paginatedOrders 长度:', this.paginatedOrders.length);
      console.log('paginatedOrders 数据:', this.paginatedOrders);
      console.log('currentOrderPage:', this.currentOrderPage);
      console.log('totalOrderPages:', this.totalOrderPages);

      // 专门调试订单数据
      console.log('=== 订单数据调试 ===');
      this.myOrders.forEach((order, index) => {
        console.log(`订单 ${index + 1}:`, {
          orderId: order.orderId,
          itemId: order.itemId,
          amount: order.amount,
          seller: order.seller,
          buyer: order.buyer,
          eventType: order.eventType
        });
      });

      alert(`调试信息已输出到控制台\n\n订单数量: ${this.myOrders.length}\n分页订单数量: ${this.paginatedOrders.length}\n当前页: ${this.currentOrderPage}\n总页数: ${this.totalOrderPages}`);
    },

    toggleEventData() {
      this.showEventData = !this.showEventData;
      console.log('事件数据显示状态:', this.showEventData);
      if (this.showEventData) {
        this.fetchMyOrders(); // 重新获取数据以包含事件数据
      } else {
        // 过滤掉事件数据，只保留 getOrder 数据
        this.myOrders = this.myOrders.filter(order => order.eventType === 'getOrder');
        this.allOrders = this.allOrders.filter(order => order.eventType === 'getOrder');
        console.log('已过滤事件数据，当前订单数量:', this.myOrders.length);
      }
    },

    // 处理品牌点击，回到市场首页
    goToMarket() {
      this.currentView = 'market';
    },
    formatBalance(value) {
      const num = parseFloat(value);
      return isNaN(num) ? '0.00' : num.toFixed(2);
    },
    prevChannelPage() {
      if (this.currentChannelPage > 1) {
        this.currentChannelPage--;
      }
    },
    nextChannelPage() {
      if (this.currentChannelPage < this.totalChannelPages) {
        this.currentChannelPage++;
      }
    },

    async connectToWeb3() {
      try {
        // 优先使用 MetaMask
        if (window.ethereum) {
          console.log('尝试连接 MetaMask...');
          this.web3 = new Web3(window.ethereum);

          // 请求账户访问
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

          if (accounts.length > 0) {
            this.account = accounts[0];
            console.log('MetaMask 账户连接成功:', this.account);

            const balanceWei = await this.web3.eth.getBalance(this.account);
            this.balance = this.web3.utils.fromWei(balanceWei, 'ether');
          } else {
            alert("MetaMask 中没有找到账户。请确保 MetaMask 已解锁并选择了账户。");
          }
        } else {
          // 回退到 HTTP 提供者
          console.log('使用 HTTP 提供者...');
          this.web3 = new Web3(new Web3.providers.HttpProvider(CONTRACT_CONFIG.NETWORK.RPC_URL));
          window.web3 = this.web3;

          const accounts = await this.web3.eth.getAccounts();

          if (accounts.length > 0) {
            this.account = accounts[0];
            const balanceWei = await this.web3.eth.getBalance(this.account);
            this.balance = this.web3.utils.fromWei(balanceWei, 'ether');
          } else {
            alert("未找到账户。请确保你的区块链节点正在运行并且已创建账户。");
          }
        }
      } catch (error) {
        console.error("连接到 Web3 时出错:", error);
        alert("连接到区块链时出错。请检查节点是否运行正常。");
      }

      // 初始化合约
      await this.initContract();
      await this.fetchMarketStats();
    },

    async fetchTokenBalance() {
      try {
        console.log('开始获取GAME余额...');
        console.log('账户:', this.account);
        console.log('GameToken合约:', this.gameToken);
        console.log('GameToken地址:', this.gameTokenAddress);

        if (!this.account) {
          console.log('账户未连接');
          return;
        }

        if (!this.gameToken) {
          console.log('GameToken合约未初始化，尝试重新初始化...');
          // 尝试重新初始化GameToken合约
          if (CONTRACT_CONFIG.GAME_TOKEN_ADDRESS) {
            this.gameTokenAddress = CONTRACT_CONFIG.GAME_TOKEN_ADDRESS;
            this.gameToken = new this.web3.eth.Contract(
              gameTokenABI,
              this.gameTokenAddress
            );
            console.log('GameToken合约重新初始化成功');
          } else {
            console.log('配置文件中没有GameToken地址');
            return;
          }
        }

        const balance = await this.gameToken.methods.balanceOf(this.account).call();
        console.log('原始余额:', balance);
        this.tokenBalance = Number(Web3.utils.fromWei(balance, 'ether'));
        console.log('转换后余额:', this.tokenBalance);
      } catch (error) {
        console.error('获取代币余额失败:', error);
      }
    },



    async getTokenInfo() {
      try {
        if (!this.gameToken) {
          return;
        }

        const name = await this.gameToken.methods.name().call();
        const symbol = await this.gameToken.methods.symbol().call();
        const decimals = await this.gameToken.methods.decimals().call();
        const totalSupply = await this.gameToken.methods.totalSupply().call();

        console.log('代币信息:', {
          name,
          symbol,
          decimals: Number(decimals),
          totalSupply: Web3.utils.fromWei(totalSupply, 'ether')
        });
      } catch (error) {
        console.error('获取代币信息失败:', error);
      }
    },

    shortenAddress(address) {
      return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
    },
    async testFetchMarketItems() {
      console.log('=== 开始测试获取市场数据 ===');
      console.log('合约实例:', this.contract);
      console.log('合约地址:', this.contractAddress);

      try {
        const result = await this.contract.methods.viewAllGameItems().call();
        console.log('viewAllGameItems 原始结果:', result);

        const itemIds = result[0] || [];
        const prices = result[1] || [];
        const owners = result[2] || [];
        const statuses = result[3] || [];

        console.log('解析的数据:');
        console.log('- itemIds:', itemIds);
        console.log('- prices:', prices);
        console.log('- owners:', owners);
        console.log('- statuses:', statuses);

        // 测试获取单个道具详情
        if (itemIds.length > 0) {
          const firstItemId = itemIds[0];
          console.log('测试获取道具详情，ID:', firstItemId);
          const itemDetails = await this.contract.methods.gameItems(firstItemId).call();
          console.log('道具详情:', itemDetails);
        }

        alert('测试完成，请查看控制台输出');
      } catch (error) {
        console.error('测试失败:', error);
        alert('测试失败: ' + error.message);
      }
    },
    // 修改前端的fetchMarketItems方法
    async fetchMarketItems() {
      try {
        console.log('开始获取市场数据...');
        console.log('合约实例:', this.contract);
        console.log('合约地址:', this.contractAddress);

        if (!this.contract) {
          console.error('合约未初始化');
          return;
        }

        // 调用合约获取原始数据
        const result = await this.contract.methods.viewAllGameItems().call();
        console.log('原始合约响应:', result);

        // 正确解析类数组对象 (更新后的合约结构)
        const itemIds = result[0] || [];       // 商品ID数组
        const prices = result[1] || [];        // 价格数组
        const owners = result[2] || [];       // 所有者数组
        const statuses = result[3] || [];      // 状态数组

        console.log('解析的数据:', {
          itemIds: itemIds.length,
          prices: prices.length,
          owners: owners.length,
          statuses: statuses.length
        });

        // 数据转换处理 (更新后的合约结构)
        this.marketItems = [];

        // 遍历所有道具ID，获取详细信息
        for (let i = 0; i < itemIds.length; i++) {
          const itemId = itemIds[i];
          const status = Number(statuses[i]);

          // 只显示已上架的道具 (status = 1)
          if (status === 1) {
            try {
              // 获取道具详细信息
              const itemDetails = await this.contract.methods.gameItems(itemId).call();

              this.marketItems.push({
                itemId: itemId.toString(),
                itemName: itemDetails.itemName || `道具 ${itemId}`,
                itemDescription: itemDetails.itemDescription || '暂无描述',
                price: Number(Web3.utils.fromWei(itemDetails.price.toString(), 'ether')),
                owner: itemDetails.owner,
                status: Number(itemDetails.status),
                imageURL: itemDetails.imageURL || '/default-image.png'
              });
            } catch (error) {
              console.error(`获取道具 ${itemId} 详细信息失败:`, error);
              // 如果获取详细信息失败，使用基本信息
              this.marketItems.push({
                itemId: itemId.toString(),
                itemName: `道具 ${itemId}`,
                itemDescription: '暂无描述',
                price: Number(Web3.utils.fromWei(prices[i].toString(), 'ether')),
                owner: owners[i],
                status: status,
                imageURL: '/default-image.png'
              });
            }
          }
        }

        console.log('处理后的商品数据:', this.marketItems);
        console.log('商品数量:', this.marketItems.length);

        // 如果没有数据，添加一些测试数据
        if (this.marketItems.length === 0) {
          console.log('没有找到商品数据，添加测试数据');
          this.marketItems = [
            {
              itemId: '1',
              itemName: '魔法剑',
              itemDescription: '一把强大的魔法剑，具有强大的攻击力',
              price: 0.1,
              owner: '0x1234567890123456789012345678901234567890',
              status: 1,
              imageURL: '/default-image.png'
            },
            {
              itemId: '2',
              itemName: '治疗药水',
              itemDescription: '可以恢复生命值的药水',
              price: 0.05,
              owner: '0x1234567890123456789012345678901234567890',
              status: 1,
              imageURL: '/default-image.png'
            },
            {
              itemId: '3',
              itemName: '护甲',
              itemDescription: '提供防御力的护甲',
              price: 0.15,
              owner: '0x1234567890123456789012345678901234567890',
              status: 1,
              imageURL: '/default-image.png'
            }
          ];
        }
      } catch (error) {
        console.error('数据加载失败:', error);
        console.error('错误详情:', error.message);
        console.error('错误堆栈:', error.stack);

        // 如果出错，也添加测试数据
        this.marketItems = [
          {
            itemId: '1',
            itemName: '魔法剑',
            itemDescription: '一把强大的魔法剑，具有强大的攻击力',
            price: 0.1,
            owner: '0x1234567890123456789012345678901234567890',
            status: 1,
            imageURL: '/default-image.png'
          },
          {
            itemId: '2',
            itemName: '治疗药水',
            itemDescription: '可以恢复生命值的药水',
            price: 0.05,
            owner: '0x1234567890123456789012345678901234567890',
            status: 1,
            imageURL: '/default-image.png'
          },
          {
            itemId: '3',
            itemName: '护甲',
            itemDescription: '提供防御力的护甲',
            price: 0.15,
            owner: '0x1234567890123456789012345678901234567890',
            status: 1,
            imageURL: '/default-image.png'
          }
        ];
      }
    },
    async fetchMyInventory() {
      try {
        const result = await this.contract.methods.viewPlayerInventory().call({ from: this.account });

        this.myInventory = result.map(item => ({
          itemId: Number(item.itemId),
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          imageURL: item.imageURL,
          price: Number(item.price) / 1e18,
          owner: this.account,
          status: Number(item.status)
        }));
      } catch (error) {
        console.error("获取个人道具失败", error);
      }
    },
    async connectWallet() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        window.web3 = web3;

        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts.length > 0) {

            alert(`钱包连接成功，账户: ${this.account}`);
          } else {
            alert("未找到账户。请确保已创建 MetaMask 账户。");
          }
        } catch (error) {
          console.error("用户拒绝连接 MetaMask:", error);
          alert("用户拒绝连接 Meta Mask");
        }
      } else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
        window.web3 = web3;

        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {

          alert(`钱包连接成功，账户: ${this.account}`);
        } else {
          alert("未找到账户。请确保已创建账户。");
        }
      } else {
        alert("未检测到 Meta Mask 或其他 Web3 提供者。请安装 Meta Mask 扩展。");
      }
    },

    openCreateChannelModal() {
      console.log('=== openCreateChannelModal 被调用 ===');
      console.log('当前 showCreateChannelModal 状态:', this.showCreateChannelModal);

      // Vue 3 中直接赋值即可，不需要 $set
      this.showCreateChannelModal = true;
      console.log('设置后 showCreateChannelModal 状态:', this.showCreateChannelModal);
    },
    testButtonClick() {
      console.log('测试按钮被点击');
      alert('测试按钮正常工作！');
    },
    forceShowModal() {
      console.log('强制显示模态框');
      console.log('当前状态:', this.showCreateChannelModal);

      // Vue 3 中直接赋值即可
      this.showCreateChannelModal = true;
      console.log('设置后状态:', this.showCreateChannelModal);
      alert('模态框状态已设置为 true');
    },
    closeCreateChannel() {
      this.showCreateChannelModal = false;
    },
    handleChannelCreated(channelId) {
      this.closeCreateChannel();
      alert(`交易通道创建成功，ID: ${channelId}`);
    },
    viewItemDetails(item) {
      this.selectedItem = item;
    },
    closeItemDetails() {
      this.selectedItem = null;
    },

    async tradeItem(item) {
      if (!this.account) {
        alert("请先连接钱包");
        return;
      }

      // 确保通道数据是最新的
      console.log('开始获取最新通道数据...');
      await this.fetchMyChannels();

      // 显示可用的通道信息
      console.log('当前通道列表:', this.myChannels);

      if (this.myChannels.length === 0) {
        alert("您没有可用的交易通道，请先创建通道");
        return;
      }

      const openChannels = this.myChannels.filter(channel => channel.isOpen);
      console.log('开启的通道:', openChannels);

      if (openChannels.length === 0) {
        alert("您没有开启的交易通道，请先创建通道或等待通道开启");
        return;
      }

      const availableChannels = openChannels
        .map(channel => `ID: ${channel.id}, 参与者: ${channel.player1} <-> ${channel.player2}`)
        .join('\n');

      const channelId = prompt(`请输入交易通道ID：\n\n可用通道：\n${availableChannels}\n\n提示：如果看不到通道，请点击"刷新通道"按钮`);
      if (!channelId) {
        alert("交易通道ID不能为空");
        return;
      }

      // 验证通道ID是否有效
      console.log('验证通道ID:', channelId);
      console.log('可用通道:', this.myChannels.map(c => ({ id: c.id, isOpen: c.isOpen })));

      const validChannel = this.myChannels.find(channel =>
        channel.id.toString() === channelId.toString() && channel.isOpen
      );

      console.log('找到的通道:', validChannel);

      if (!validChannel) {
        alert(`无效的通道ID或通道已关闭\n\n输入的通道ID: ${channelId}\n\n可用通道:\n${this.myChannels.map(c => `ID: ${c.id}, 状态: ${c.isOpen ? '开启' : '关闭'}`).join('\n')}`);
        return;
      }

      // 注意：不要在这里刷新通道状态，因为可能会覆盖当前验证过的通道数据
      // await this.fetchMyChannels();

      try {
        // 添加调试信息
        console.log('=== 交易调试信息 ===');
        console.log('道具信息:', item);
        console.log('通道ID:', channelId);
        console.log('当前用户:', this.account);

        // 获取通道详情
        let channelSummary;
        try {
          const result = await this.contract.methods.getChannelSummary(channelId).call();
          console.log('原始通道详情结果:', result);

          // 根据合约ABI，getChannelSummary返回3个值：player1, player2, isOpen
          channelSummary = {
            player1: result[0] || result.player1,
            player2: result[1] || result.player2,
            isOpen: result[2] || result.isOpen
          };

          console.log('解析后的通道详情:', channelSummary);

          // 验证通道状态
          console.log('通道是否开启:', channelSummary.isOpen);
          console.log('通道状态类型:', typeof channelSummary.isOpen);
          console.log('通道状态值:', channelSummary.isOpen);

          if (!channelSummary.isOpen) {
            alert(`交易通道 ${channelId} 已关闭，无法进行交易\n\n通道详情：\n- 参与者1: ${channelSummary.player1}\n- 参与者2: ${channelSummary.player2}\n- 状态: ${channelSummary.isOpen ? '开启' : '关闭'}\n\n调试信息：\n- 状态类型: ${typeof channelSummary.isOpen}\n- 状态值: ${channelSummary.isOpen}`);
            return;
          }
        } catch (error) {
          console.error('获取通道详情失败:', error);
          alert(`获取通道详情失败: ${error.message}\n\n请确认通道ID是否正确`);
          return;
        }

        // 验证买家是否是通道参与者
        const isParticipant = [channelSummary.player1, channelSummary.player2]
          .some(a => (a || '').toLowerCase() === (this.account || '').toLowerCase());

        console.log('通道参与者:', [channelSummary.player1, channelSummary.player2]);
        console.log('当前用户是否参与:', isParticipant);

        if (!isParticipant) {
          alert("您不是该交易通道的参与者");
          return;
        }

        // 验证卖家是否在通道中
        const isSellerInChannel = [channelSummary.player1, channelSummary.player2]
          .map(a => (a || '').toLowerCase())
          .includes((item.owner || '').toLowerCase());

        console.log('道具所有者:', item.owner);
        console.log('卖家是否在通道中:', isSellerInChannel);

        if (!isSellerInChannel) {
          alert("卖家不在该交易通道中");
          return;
        }

        // 获取最新道具状态
        const latestItem = await this.contract.methods.gameItems(item.itemId).call();
        if (latestItem.status != 1) {
          alert("道具已下架");
          return;
        }

        // 检查代币余额
        const tokenBalance = await this.gameToken.methods.balanceOf(this.account).call();
        const priceInTokens = Web3.utils.toWei(item.price.toString(), 'ether');

        if (Number(tokenBalance) < Number(priceInTokens)) {
          alert("代币余额不足");
          return;
        }

        // 先授权合约使用代币
        console.log("开始授权代币...");
        await this.gameToken.methods.approve(this.contractAddress, priceInTokens).send({
          from: this.account,
          gas: 100000
        });

        console.log("代币授权成功，开始交易...");
        // 发送交易（不再需要value参数）
        await this.contract.methods.tradeItemInChannel(channelId, item.itemId).send({
          from: this.account,
          gas: 300000
        });

        alert("购买成功！已使用GAME代币支付");
        await Promise.all([
          this.fetchMarketItems(),
          this.fetchMyInventory(),
          this.fetchMyChannels(),
          this.fetchTokenBalance()
        ]);
        await this.fetchMarketStats();
      } catch (error) {
        console.error("购买失败:", error);

        // 增强错误提示
        if (error.message.includes("authentication needed")) {
          alert("钱包需要解锁！\n\n解决方法：\n1. 如果您使用的是 MetaMask，请确保 MetaMask 已解锁并选择了正确的账户\n2. 如果您使用的是本地节点，请在控制台使用 'personal.unlockAccount' 解锁账户\n3. 或者重新连接钱包");
        } else if (error.message.includes("revert")) {
          alert("交易失败：请确认通道状态、代币余额和道具状态");
        } else if (error.message.includes("underpriced")) {
          alert("Gas价格过低，请尝试调高Gas费");
        } else if (error.message.includes("Token transfer failed")) {
          alert("代币转账失败：请确认代币余额充足");
        } else if (error.message.includes("insufficient funds")) {
          alert("账户余额不足，请确保有足够的ETH支付Gas费");
        } else {
          alert("交易失败：" + error.message);
        }
      }

    },
    setupAccountChangeListener() {
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            this.account = accounts[0];
            this.updateBalance();
          } else {
            this.account = null;
            this.balance = 0;
            alert("钱包已断开连接");
          }
        });
      }
    },
    async updateBalance() {
      if (this.account && window.web3) {
        const balanceWei = await window.web3.eth.getBalance(this.account);
        this.balance = window.web3.utils.fromWei(balanceWei, 'ether');

        // 同时更新代币余额
        await this.fetchTokenBalance();
      }
    },
    goToMarket() {
      this.currentView = 'market';
    },
    goToInventory() {
      this.currentView = 'inventory';
      this.fetchMyInventory();

    },
    goToChannels() {
      this.currentView = 'channels';
      this.currentChannelPage = 1;  // 添加这行
      this.fetchMyChannels();
    },
    goToAddItem() {
      this.currentView = 'add-item';
    },
    initContract() {
      if (window.web3 && this.contractAddress) {
        this.contract = new window.web3.eth.Contract(contractABI, this.contractAddress);
      }
    },
    getItemImage(item) {
      return `https://example.com/images/items/${item.itemId}.png`;
    },
    async addNewGameItem() {
      if (!this.account) {
        alert("请先连接钱包");
        return;
      }

      try {
        // 先进行输入验证
        const { recipientAddress, name, description, price } = this.newItem;
        if (!recipientAddress || !name || !description || price <= 0) {
          alert("请输入有效的道具信息");
          return;
        }

        // 上传图片到IPFS
        const imageURL = await uploadToIPFS(this.imageFile);

        console.log("开始添加道具...");
        // 单次合约调用
        await this.contract.methods.addGameItem(
          recipientAddress,
          name,
          description,
          Web3.utils.toWei(price.toString(), 'ether'),
          imageURL
        ).send({ from: this.account });

        alert("道具添加成功");
        this.newItem = { recipientAddress: '', name: '', description: '', price: 0 };
        await this.fetchMarketItems();
      } catch (error) {
        console.error("添加道具失败", error);

        // 增强错误提示
        if (error.message.includes("authentication needed")) {
          alert("钱包需要解锁！请确保您的本地区块链节点中的账户已解锁。\n\n解决方法：\n1. 如果您使用的是本地节点，请使用 'personal.unlockAccount' 解锁账户\n2. 或者切换到使用 MetaMask 钱包");
        } else if (error.message.includes("revert")) {
          alert("添加道具失败：请确认合约权限和输入参数");
        } else if (error.message.includes("underpriced")) {
          alert("Gas价格过低，请尝试调高Gas费");
        } else if (error.message.includes("insufficient funds")) {
          alert("账户余额不足，请确保有足够的ETH支付Gas费");
        } else {
          alert("添加道具失败：" + error.message);
        }
      }
      await this.fetchMarketStats();
    },
    async testChannelData() {
      try {
        if (!this.contract) {
          alert("智能合约未初始化");
          return;
        }

        console.log('=== 测试通道数据 ===');
        console.log('当前账户:', this.account);
        console.log('合约地址:', this.contractAddress);

        const result = await this.contract.methods.viewMyChannels().call({ from: this.account });
        console.log('原始结果:', result);
        console.log('结果类型:', typeof result);
        console.log('结果键名:', Object.keys(result));
        console.log('结果是否为数组:', Array.isArray(result));

        if (result && typeof result === 'object') {
          // 尝试不同的访问方式
          console.log('result.ids:', result.ids);
          console.log('result[0]:', result[0]);
          console.log('result.player1s:', result.player1s);
          console.log('result[1]:', result[1]);
          console.log('result.player2s:', result.player2s);
          console.log('result[2]:', result[2]);
          console.log('result.statuses:', result.statuses);
          console.log('result[3]:', result[3]);
        }

        alert('测试完成，请查看控制台输出');
      } catch (error) {
        console.error('测试失败:', error);
        alert('测试失败: ' + error.message);
      }
    },

    async testChannelSummary(channelId) {
      try {
        if (!this.contract) {
          alert("智能合约未初始化");
          return;
        }

        console.log('=== 测试通道详情 ===');
        console.log('通道ID:', channelId);
        console.log('当前账户:', this.account);

        const result = await this.contract.methods.getChannelSummary(channelId).call();
        console.log('原始结果:', result);
        console.log('结果类型:', typeof result);
        console.log('结果是否为数组:', Array.isArray(result));
        console.log('结果键名:', Object.keys(result));

        if (Array.isArray(result)) {
          console.log('数组格式 - result[0]:', result[0]);
          console.log('数组格式 - result[1]:', result[1]);
          console.log('数组格式 - result[2]:', result[2]);
        } else if (typeof result === 'object') {
          console.log('对象格式 - result.player1:', result.player1);
          console.log('对象格式 - result.player2:', result.player2);
          console.log('对象格式 - result.isOpen:', result.isOpen);
        }

        alert('通道详情测试完成，请查看控制台输出');
      } catch (error) {
        console.error('通道详情测试失败:', error);
        alert('通道详情测试失败: ' + error.message);
      }
    },

    async fetchMyChannels() {
      try {
        if (!this.contract) {
          alert("智能合约未初始化");
          return;
        }

        console.log('开始获取通道数据...');
        const result = await this.contract.methods.viewMyChannels().call({ from: this.account });
        console.log('通道数据结果:', result);
        console.log('结果类型:', typeof result);
        console.log('结果键名:', Object.keys(result));
        console.log('结果是否为数组:', Array.isArray(result));

        if (!result || typeof result !== 'object') {
          alert("获取交易通道失败：返回的数据格式不正确");
          return;
        }

        // 根据合约ABI，viewMyChannels返回4个数组：ids, player1s, player2s, statuses
        const channelIds = result.ids || result[0];
        const player1s = result.player1s || result[1];
        const player2s = result.player2s || result[2];
        const isOpen = result.statuses || result[3];

        console.log('解析的通道数据:', {
          channelIds,
          player1s,
          player2s,
          isOpen
        });

        if (!Array.isArray(channelIds) || !Array.isArray(player1s) || !Array.isArray(player2s) || !Array.isArray(isOpen)) {
          console.error('数据格式不正确:', {
            channelIds: typeof channelIds,
            player1s: typeof player1s,
            player2s: typeof player2s,
            isOpen: typeof isOpen
          });
          alert("获取交易通道失败：返回的数据格式不正确");
          return;
        }

        this.myChannels = channelIds.map((channelId, index) => {
          const channel = {
            id: Number(channelId),
            player1: player1s[index],
            player2: player2s[index],
            isOpen: isOpen[index],
            balance: 0 // 暂时设置为0，后续可以添加余额获取逻辑
          };
          console.log(`通道 ${channel.id}:`, channel);
          return channel;
        });

        console.log('最终通道列表:', this.myChannels);

        if (this.myChannels.length === 0) {
          console.log('没有找到通道数据');
          alert("您目前没有参与任何交易通道");
        } else {
          console.log(`找到 ${this.myChannels.length} 个通道`);
        }

      } catch (error) {
        console.error("获取交易通道失败", error);
        alert("获取交易通道失败");
      }
    },

    // 初始化 Web3


    async settleChannel(channelId) {
      try {
        // 确保 channelId 是 BigInt 类型
        const bigIntChannelId = BigInt(channelId);

        await this.contract.methods.settleChannel(bigIntChannelId).send({ from: this.account });
        alert(`通道 ${channelId} 结算成功`);
        await this.fetchMyChannels();
      } catch (error) {
        console.error("结算通道失败", error);
        alert("结算通道失败");
      }
    },
    applyFilters() {
      this.currentPage = 1;
    },
    manageItem(item) {
      this.managingItem = item;
      this.showManageItemModal = true;
    },
    closeManageItem() {
      this.showManageItemModal = false;
      this.managingItem = null;
    },
    async listItem(itemId) {
      try {
        await this.contract.methods.listGameItem(itemId).send({ from: this.account });
        alert("道具已上架");
        await this.fetchMarketItems();
        await this.fetchMyInventory();
      } catch (error) {
        console.error("上架道具失败", error);
        alert("上架道具失败");
      }
      await this.fetchMarketStats();
    },
    async delistItem(itemId) {
      try {
        await this.contract.methods.delistGameItem(itemId).send({ from: this.account });
        alert("道具已下架");
        await this.fetchMarketItems();
        await this.fetchMyInventory();
      } catch (error) {
        console.error("下架道具失败", error);
        alert("下架道具失败");
      }
      await this.fetchMarketStats();
    },
    async deleteItem(itemId) {
      try {
        await this.contract.methods.deleteGameItem(itemId).send({ from: this.account });
        alert("道具已删除");
        await this.fetchMarketItems();
        await this.fetchMyInventory();
      } catch (error) {
        console.error("删除道具失败", error);
        alert("删除道具失败");
      }
    },
    async checkContractOwner() {
      if (!this.contract) {
        return;
      }

      try {
        const owner = await this.contract.methods.owner().call();
        this.isContractOwner = (owner || '').toLowerCase() === (this.account || '').toLowerCase();
      } catch (error) {
        console.error("获取合约所有者失败", error);
      }
    },


    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  watch: {
    account: {
      handler: function (newVal) {
        if (newVal) {
          this.initContract();
          this.checkContractOwner();
        }
      },
      immediate: true
    }
  }
};
</script>

<style>
/* 样式已移至 main.css 和 base.css */
</style>