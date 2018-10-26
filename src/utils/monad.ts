import _ from 'lodash'
abstract class Monad<T> {
    abstract map<U> (fn: (T) => U): Monad<U>;
    abstract flatMap<U> (fn: (T) => Monad<U>): Monad<U>;
    map2<A, B> (op: Monad<A>, f: (T, A) => B): Monad<B> {
        return this.flatMap(x => op.map(y => f(x, y)));
    }
    abstract flatten (): T;

}
interface MaybeMatchCondition<T, U> {
    just (t: T): U;
    nothing (): U;
}
abstract class Maybe<T> extends Monad<T> {
    static of<A>(val: A | undefined, checker: (A) => Boolean = v => !_.isUndefined(v)): Maybe<A> {
        if (checker(val)) return new Just(val);
        return Nothing.getInstance();
    }
    static fromCall<U>(fn: (...args: any) => U, ...args: any): Maybe<U> {
        try {
            return Maybe.of(fn(...args))
        } catch {
            return Nothing.getInstance()
        }
    }
    match<U> (mmc: MaybeMatchCondition<T, U>): Maybe<U> {
        return this.isDefined ? this.map(mmc.just) : Maybe.of(mmc.nothing());
    }
    abstract map<U> (fn: (T) => U): Maybe<U>;
    abstract flatMap<U> (fn: (T) => Maybe<U>): Maybe<U>;
    map2<A, B> (op: Maybe<A>, f: (T, A) => B): Maybe<B> {
        return this.flatMap(x => op.map(y => f(x, y)));
    }
    abstract getOrElse (els: T): T;
    abstract orCall<U extends T>(fn: (...args: any) => U, ...args: any): Maybe<T|U>;
    abstract filter (fn: (T) => Boolean): Maybe<T>;
    abstract isDefined (): Boolean;
    flatten() {
        return this.getOrElse(undefined);
    }
}

class Just<T> extends Maybe<T> {
    val: T
    constructor (val: T|undefined) {
        super()
        this.val = val
    }
    map<U>(fn: (t: T) => U): Maybe<U> {
        return Maybe.of(fn(this.val))
    }
    flatMap<U> (fn: (T) => Maybe<U>): Maybe<U> {
        return fn(this.val)
    }
    getOrElse (els: T): T {
        return this.val;
    }
    orCall<U extends T>(fn: (...args: any) => U, ...args: any): Maybe<T|U> {
        return this
    }
    filter (fn: (T) => Boolean): Maybe<T> {
        return fn(this.val) ? this : Nothing.getInstance();
    }
    isDefined () {
        return true
    }
}

class Nothing<T> extends Maybe<any> {
    private static instance: Nothing<any>
    
    constructor () {
        super()
        return Nothing.getInstance()
    }

    map<U>(fn: (T) => U): Maybe<U> {
        return Nothing.getInstance();
    }
    flatMap<U> (fn: (T) => Maybe<U>): Maybe<U> {
        return Nothing.getInstance()
    }
    getOrElse (els: T): T {
        return els
    }
    static getInstance(): Nothing<any> {
        if (this.instance) return this.instance;
        return this.instance = new Nothing();
    }
    orCall<U>(fn: (...args: any) => U, ...args: any): Maybe<U> {
        return Maybe.of(fn(...args))
    }
    filter () {
        return Nothing.getInstance();
    }
    isDefined () {
        return false
    }
}

export default {
    Maybe: Maybe.of,
    maybeFromCall: Maybe.fromCall,
    MaybeWrapped<T> (fn: (...any) => T): (...any) => Maybe<T> {
        return (...args) => Maybe.of(fn(...args));
    }
}