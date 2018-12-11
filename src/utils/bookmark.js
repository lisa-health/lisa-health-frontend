export class BookmarkManager {
    constructor(key, s = localStorage) {
        this.storage = s
        this.key = key
    }

    get payload() {
        return JSON.parse(this.storage.getItem(this.key) || '{}')
    }

    set payload(val) {
        this.storage.setItem(this.key, JSON.stringify(val))
    }

    hasKey(key) {
        return !!this.payload[key]
    }

    setItem(key, value) {
        this.payload = {
            ...this.payload,
            [key]: value
        }
    }

    getItem(key) {
        return this.payload[key]
    }

    deleteItem(key) {
        this.payload = {
            ...this.payload,
            [key]: undefined
        }
    }

    keys() {
        return Object.keys(this.payload)
    }

    items() {
        return this.keys().map(this.getItem.bind(this))
    }

    forEach(fn) {
        this.keys().forEach((k, i) => fn(this.getItem(k), k, i))
    }
}
