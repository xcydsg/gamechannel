<template>
  <div class="item-card">
    <div class="item-image">
      <img :src="itemImage" alt="道具图标" />
      <span :class="['rarity-badge', `rarity-${rarity}`]">{{ rarity }}</span>
    </div>
    <div class="item-info">
      <h3 class="item-name">{{ itemName }}</h3>
      <p class="item-description">{{ itemDescription }}</p>
      <div class="item-meta">
        <span class="item-category">{{ category }}</span>
        <span class="item-level">需求等级: {{ level }}</span>
      </div>
      <div class="item-price">
        <span class="price-value">{{ price }} Game</span>
      </div>
      <div class="item-actions">
        <button class="view-btn" @click="$emit('view-item')">查看详情</button>
        <button class="trade-btn" @click="$emit('trade-item')">立即购买</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemName: {
      type: String,
      required: true
    },
    itemDescription: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    rarity: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    itemImage: {
      type: String,
      default: () => 'https://example.com/default-item.png'
    }
  }
};
</script>


<style scoped>
.item-card {
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.item-image {
  position: relative;
  padding-top: 100%;
  /* 1:1 Aspect Ratio */
}

.item-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rarity-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.rarity-common {
  background: #e0e0e0;
  color: #555;
}

.rarity-rare {
  background: #b3d1ff;
  color: #1976d2;
}

.rarity-epic {
  background: #d5b8ff;
  color: #673ab7;
}

.rarity-legendary {
  background: #ffa726;
  color: #fff;
}

.item-info {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  margin: 0 0 8px;
  font-size: 16px;
}

.item-description {
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
  flex-grow: 1;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  font-size: 13px;
  color: #888;
}

.item-price {
  margin: 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.item-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.view-btn,
.trade-btn {
  flex: 1;
  padding: 6px 0;
  font-size: 14px;
  border-radius: 5px;
}

.trade-btn {
  background: linear-gradient(90deg, #f44336, #e57373);
}
</style>