<template>
    <div class="chatbox">
      <h3>Chat</h3>
      <div class="messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="{'my-message': message.senderId === userId, 'other-message': message.senderId !== userId}"
        >
          <p><strong>{{ message.senderId === userId ? 'You' : message.senderId }}:</strong> {{ message.message }}</p>
          <small>{{ formatDate(message.timestamp) }}</small>
        </div>
      </div>
      <form @submit.prevent="sendMessage">
        <input
          type="text"
          v-model="newMessage"
          placeholder="Type your message..."
          class="form-control"
          required
        />
        <button type="submit" class="btn btn-primary mt-2">Send</button>
      </form>
    </div>
  </template>
  
  <script>
  import { io } from 'socket.io-client';
  
  export default {
    props: {
      userId: {
        type: String,
        required: true,
      },
      recipientId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        socket: null,
        messages: [],
        newMessage: '',
        roomId: null, // Store the generated room ID
      };
    },
    methods: {
      // Format timestamp for display
      formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
      },
      // Send a message to the server
      sendMessage() {
        if (this.newMessage.trim() === '') return;
  
        const messageData = {
          room: this.roomId,
          senderId: this.userId,
          message: this.newMessage,
        };
  
        // Emit the message to the server
        this.socket.emit('sendMessage', messageData);
  
        // Add the message to the local messages array
        this.messages.push({
          senderId: this.userId,
          message: this.newMessage,
          timestamp: new Date(),
        });
  
        // Clear the input field
        this.newMessage = '';
      },
    },
    mounted() {
      // Generate a unique room ID by sorting the user IDs
      this.roomId = [this.userId, this.recipientId].sort().join('-');
  
      // Initialize the socket connection
      this.socket = io('http://localhost:3000'); // Replace with your backend URL
  
      // Join the room for the specific users
      this.socket.emit('joinRoom', this.roomId);
  
      // Listen for incoming messages
      this.socket.on('message', (message) => {
        this.messages.push(message);
      });
    },
    beforeUnmount() {
      // Disconnect the socket when the component is destroyed
      if (this.socket) {
        this.socket.disconnect();
      }
    },
  };
  </script>
  
  <style scoped>
  .chatbox {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    max-width: 400px;
    margin: 0 auto;
  }
  .messages {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 16px;
  }
  .my-message {
    text-align: right;
    background-color: #d1e7dd;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  .other-message {
    text-align: left;
    background-color: #f8d7da;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  </style>