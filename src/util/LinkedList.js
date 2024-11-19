class Node{
    constructor(object){
        this.thrust = object.thrust;
        this.chamberPressure = object.chamberPressure;
        this.next = null;
    }
}

class LinkedList{
    constructor(maxSize){
        this.length = 0;
        this.maxLength = maxSize;
        this.head = null;
        this.tail = null;
    }

    push(object){
        const node  = new Node(object);
        if(this.head==null){
            this.head = node;
            this.tail = this.head;
        }
        else{
            this.tail.next = node;
            this.tail = this.tail.next;
        }
        this.length += 1;
    }

    pop(){
        if(this.head==this.tail){
            this.head = this.tail = null;
        }
        else{
            this.head = this.head.next;
        }
        this.length -= 1;
    }

    shift(object){
        this.push(object);
        if(this.length >= this.maxLength)
            this.pop();
    }

    map(callback){
        let array = [];
        let temp = this.head;
        while(temp!=null){
            let node = callback(temp);
            array.push(node);
            temp = temp.next;
        }

        return array;
    }
}

// eslint-disable-next-line no-undef
export {LinkedList, Node}