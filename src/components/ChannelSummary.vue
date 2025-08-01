<template>
  <div class="channel-summary">
    <div class="channel-header">
      <h3>通道 #{{ channel.id }}</h3>
      <span :class="['status', channel.isOpen ? 'open' : 'closed']">
        {{ channel.isOpen ? '开启' : '关闭' }}
      </span>
    </div>
    <p>玩家: {{ channel.player1 }} & {{ channel.player2 }}</p>
    <div class="actions">
      <button 
        v-if="channel.isOpen" 
        @click="$emit('settle-channel', channel.id)"
        :disabled="!$parent.account"
      >
        结算通道
      </button>
      <button 
        @click="$emit('view-channel', channel.id)"
        :disabled="!$parent.account"
      >
        查看详情
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    channel: {
      type: Object,
      required: true
    }
  }
};
</script>
  
  <style scoped>
  .channel-summary {
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }
  
  .channel-summary:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-3px);
  }
  
  .channel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .status {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
  }
  
  .open {
    background: linear-gradient(90deg, #4caf50, #8bc34a);
    color: white;
  }
  
  .closed {
    background: linear-gradient(90deg, #f44336, #e57373);
    color: white;
  }
  
  .actions {
    display: flex;
    gap: 10px;
  }
  
  button {
    padding: 10px 18px;
    font-size: 14px;
  }
  
  button:first-child {
    background: linear-gradient(90deg, #f44336, #e57373);
  }
  
  button:first-child:hover {
    background: linear-gradient(90deg, #d32f2f, #ef5350);
  }
  </style>