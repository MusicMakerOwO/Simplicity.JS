class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

module.exports = class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    at(index) {
        if (index < 0 || index >= this.length) return null;
        let node = this.head;
        for (let i = 0; i < index; i++) {
            node = node.next;
        }
        return node.data;
    }

    insertAfter(index, data) {
        if (index < 0 || index >= this.length) return null;
        let node = this.head;
        for (let i = 0; i < index; i++) {
            node = node.next;
        }
        const newNode = new Node(data);
        newNode.next = node.next;
        node.next = newNode;
        this.length++;
    }

    insertBefore(index, data) {
        if (index < 0 || index >= this.length) return null;
        let node = this.head;
        for (let i = 0; i < index - 1; i++) {
            node = node.next;
        }
        const newNode = new Node(data);
        newNode.next = node.next;
        node.next = newNode;
        this.length++;
    }

    push(data) {
        this.insertEnd(data);
    }

    insertEnd(data) {
        let newNode = new Node(data);
        if (this.tail) {
            this.tail.next = newNode;
            this.tail = newNode;
        } else {
            this.head = newNode;
            this.tail = newNode;
        }
        this.length++;
    }

    insertStart(data) {
        let newNode = new Node(data);
        if (this.head) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            this.head = newNode;
            this.tail = newNode;
        }
        this.length++;
    }

    remove(index) {
        if (index < 0 || index >= this.length) return null;
        let node = this.head;
        for (let i = 0; i < index - 1; i++) {
            node = node.next;
        }
        const removedNode = node.next;
        node.next = removedNode.next;
        this.length--;
        return removedNode.data;
    }

    shift() {
        const removedNode = this.head;
        this.head = this.head.next;
        this.length--;
        return removedNode.data;
    }

    pop() {
        let node = this.head;
        for (let i = 0; i < this.length - 2; i++) {
            node = node.next;
        }
        const removedNode = node.next;
        node.next = null;
        this.tail = node;
        this.length--;
        return removedNode.data;
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    toArray() {
        const arr = [];
        let node = this.head;
        while (node) {
            arr.push(node.data);
            node = node.next;
        }
        return arr;
    }

    [Symbol.iterator]() {
        let node = this.head;
        return {
            next: () => {
                if (!node) return { done: true };
                const value = node.data;
                node = node.next;
                return { value, done: false };
            }
        }
    }

    get [Symbol.toStringTag]() {
        return 'LinkedList';
    }

}