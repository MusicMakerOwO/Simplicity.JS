module.exports = class Queue {
    constructor() {
        this.queue = [];
    }
  
    enqueue(element) {
      this.queue.push(element);
    }

    push(element) {
        this.enqueue(element);
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.queue.shift();
    }

    pull() {
        return this.dequeue();
    }

    priority(element) {
        this.queue.unshift(element);
    }
  
    peek() {
        if (this.isEmpty()) return null;
        return this.queue[0];
    }
  
    isEmpty() {
        return this.queue.length === 0;
    }
  
    size() {
        return this.queue.length;
    }
  
    clear() {
        this.queue = [];
    }

    at(index) {
        if (index < 0 || index >= this.size()) return null;
        return this.queue[index];
    }
}