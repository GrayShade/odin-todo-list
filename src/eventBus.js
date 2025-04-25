// eventBus.js
export class EventBus {
  constructor() {
    this.listeners = {}; // { eventName: [callback1, callback2, ...] }
  }

  // Subscribe to an event
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Emit an event (notify all listeners)
  // Also, Using spread operator to able to emit multiple arguments
  emit(event, ...args) { 
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(...args));
    }
  }

  // Unsubscribe from an event (optional)
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        listener => listener !== callback
      );
    }
  }
}
