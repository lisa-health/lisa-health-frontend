export class BookmarkManager {
    key: string
    storage: Storage
    constructor(key: string, s: Storage = localStorage) {
        this.storage = s
        this.key = key
    }

    get payload() {
        return JSON.parse(this.storage.getItem(this.key) || '{}')
    }

    set payload(val) {
        this.storage.setItem(this.key, JSON.stringify(val))
    }

    hasKey(key: string) {
        return !!this.payload[key]
    }

    setItem(key: string, value: object) {
        this.payload = {
            ...this.payload,
            [key]: value
        }
    }

    getItem(key: string) {
        return this.payload[key]
    }

    deleteItem(key: string) {
        this.payload = {
            ...this.payload,
            [key]: undefined
        }
    }

    keys() {
        return Object.keys(this.payload)
    }

    forEach<T>(fn: (v: object, key?: string, index?: number) => T) {
        this.keys().forEach((k, i) => fn(this.getItem(k), k, i))
    }
}
