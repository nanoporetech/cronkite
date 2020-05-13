import { r as registerInstance, h, H as Host } from './index-c35d3352.js';
import './commonjsHelpers-cc66c86a.js';
import { m as mapAttributesToProps } from './index-566c5fd3.js';
import { u as uuidv4 } from './index-a7b13f2e.js';

function isFunction(x) {
    return typeof x === 'function';
}

let _enable_super_gross_mode_that_will_cause_bad_things = false;
const config = {
    Promise: undefined,
    set useDeprecatedSynchronousErrorHandling(value) {
        if (value) {
            const error = new Error();
            console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
        }
        else if (_enable_super_gross_mode_that_will_cause_bad_things) {
            console.log('RxJS: Back to a better error behavior. Thank you. <3');
        }
        _enable_super_gross_mode_that_will_cause_bad_things = value;
    },
    get useDeprecatedSynchronousErrorHandling() {
        return _enable_super_gross_mode_that_will_cause_bad_things;
    },
};

function hostReportError(err) {
    setTimeout(() => { throw err; }, 0);
}

const empty = {
    closed: true,
    next(value) { },
    error(err) {
        if (config.useDeprecatedSynchronousErrorHandling) {
            throw err;
        }
        else {
            hostReportError(err);
        }
    },
    complete() { }
};

const isArray = (() => Array.isArray || ((x) => x && typeof x.length === 'number'))();

function isObject(x) {
    return x !== null && typeof x === 'object';
}

const UnsubscriptionErrorImpl = (() => {
    function UnsubscriptionErrorImpl(errors) {
        Error.call(this);
        this.message = errors ?
            `${errors.length} errors occurred during unsubscription:
${errors.map((err, i) => `${i + 1}) ${err.toString()}`).join('\n  ')}` : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
        return this;
    }
    UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
    return UnsubscriptionErrorImpl;
})();
const UnsubscriptionError = UnsubscriptionErrorImpl;

class Subscription {
    constructor(unsubscribe) {
        this.closed = false;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    unsubscribe() {
        let errors;
        if (this.closed) {
            return;
        }
        let { _parentOrParents, _unsubscribe, _subscriptions } = this;
        this.closed = true;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (_parentOrParents instanceof Subscription) {
            _parentOrParents.remove(this);
        }
        else if (_parentOrParents !== null) {
            for (let index = 0; index < _parentOrParents.length; ++index) {
                const parent = _parentOrParents[index];
                parent.remove(this);
            }
        }
        if (isFunction(_unsubscribe)) {
            try {
                _unsubscribe.call(this);
            }
            catch (e) {
                errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
            }
        }
        if (isArray(_subscriptions)) {
            let index = -1;
            let len = _subscriptions.length;
            while (++index < len) {
                const sub = _subscriptions[index];
                if (isObject(sub)) {
                    try {
                        sub.unsubscribe();
                    }
                    catch (e) {
                        errors = errors || [];
                        if (e instanceof UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                        }
                        else {
                            errors.push(e);
                        }
                    }
                }
            }
        }
        if (errors) {
            throw new UnsubscriptionError(errors);
        }
    }
    add(teardown) {
        let subscription = teardown;
        if (!teardown) {
            return Subscription.EMPTY;
        }
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (!(subscription instanceof Subscription)) {
                    const tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default: {
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
            }
        }
        let { _parentOrParents } = subscription;
        if (_parentOrParents === null) {
            subscription._parentOrParents = this;
        }
        else if (_parentOrParents instanceof Subscription) {
            if (_parentOrParents === this) {
                return subscription;
            }
            subscription._parentOrParents = [_parentOrParents, this];
        }
        else if (_parentOrParents.indexOf(this) === -1) {
            _parentOrParents.push(this);
        }
        else {
            return subscription;
        }
        const subscriptions = this._subscriptions;
        if (subscriptions === null) {
            this._subscriptions = [subscription];
        }
        else {
            subscriptions.push(subscription);
        }
        return subscription;
    }
    remove(subscription) {
        const subscriptions = this._subscriptions;
        if (subscriptions) {
            const subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    }
}
Subscription.EMPTY = (function (empty) {
    empty.closed = true;
    return empty;
}(new Subscription()));
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce((errs, err) => errs.concat((err instanceof UnsubscriptionError) ? err.errors : err), []);
}

const rxSubscriber = (() => typeof Symbol === 'function'
    ? Symbol('rxSubscriber')
    : '@@rxSubscriber_' + Math.random())();
const $$rxSubscriber = rxSubscriber;

class Subscriber extends Subscription {
    constructor(destinationOrNext, error, complete) {
        super();
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                        this.destination = destinationOrNext;
                        destinationOrNext.add(this);
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    [rxSubscriber]() { return this; }
    static create(next, error, complete) {
        const subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    }
    next(value) {
        if (!this.isStopped) {
            this._next(value);
        }
    }
    error(err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    }
    complete() {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    }
    unsubscribe() {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        super.unsubscribe();
    }
    _next(value) {
        this.destination.next(value);
    }
    _error(err) {
        this.destination.error(err);
        this.unsubscribe();
    }
    _complete() {
        this.destination.complete();
        this.unsubscribe();
    }
    _unsubscribeAndRecycle() {
        const { _parentOrParents } = this;
        this._parentOrParents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parentOrParents = _parentOrParents;
        return this;
    }
}
class SafeSubscriber extends Subscriber {
    constructor(_parentSubscriber, observerOrNext, error, complete) {
        super();
        this._parentSubscriber = _parentSubscriber;
        let next;
        let context = this;
        if (isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== empty) {
                context = Object.create(observerOrNext);
                if (isFunction(context.unsubscribe)) {
                    this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = this.unsubscribe.bind(this);
            }
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    next(value) {
        if (!this.isStopped && this._next) {
            const { _parentSubscriber } = this;
            if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    }
    error(err) {
        if (!this.isStopped) {
            const { _parentSubscriber } = this;
            const { useDeprecatedSynchronousErrorHandling } = config;
            if (this._error) {
                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                if (useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                hostReportError(err);
            }
            else {
                if (useDeprecatedSynchronousErrorHandling) {
                    _parentSubscriber.syncErrorValue = err;
                    _parentSubscriber.syncErrorThrown = true;
                }
                else {
                    hostReportError(err);
                }
                this.unsubscribe();
            }
        }
    }
    complete() {
        if (!this.isStopped) {
            const { _parentSubscriber } = this;
            if (this._complete) {
                const wrappedComplete = () => this._complete.call(this._context);
                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    }
    __tryOrUnsub(fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            if (config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError(err);
            }
        }
    }
    __tryOrSetError(parent, fn, value) {
        if (!config.useDeprecatedSynchronousErrorHandling) {
            throw new Error('bad call');
        }
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                parent.syncErrorValue = err;
                parent.syncErrorThrown = true;
                return true;
            }
            else {
                hostReportError(err);
                return true;
            }
        }
        return false;
    }
    _unsubscribe() {
        const { _parentSubscriber } = this;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    }
}

function canReportError(observer) {
    while (observer) {
        const { closed, destination, isStopped } = observer;
        if (closed || isStopped) {
            return false;
        }
        else if (destination && destination instanceof Subscriber) {
            observer = destination;
        }
        else {
            observer = null;
        }
    }
    return true;
}

function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber]) {
            return nextOrObserver[rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber(empty);
    }
    return new Subscriber(nextOrObserver, error, complete);
}

const observable = (() => typeof Symbol === 'function' && Symbol.observable || '@@observable')();

function identity(x) {
    return x;
}

function pipe(...fns) {
    return pipeFromArray(fns);
}
function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce((prev, fn) => fn(prev), input);
    };
}

class Observable {
    constructor(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    lift(operator) {
        const observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
    subscribe(observerOrNext, error, complete) {
        const { operator } = this;
        const sink = toSubscriber(observerOrNext, error, complete);
        if (operator) {
            sink.add(operator.call(sink, this.source));
        }
        else {
            sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                this._subscribe(sink) :
                this._trySubscribe(sink));
        }
        if (config.useDeprecatedSynchronousErrorHandling) {
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
        }
        return sink;
    }
    _trySubscribe(sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                sink.syncErrorThrown = true;
                sink.syncErrorValue = err;
            }
            if (canReportError(sink)) {
                sink.error(err);
            }
            else {
                console.warn(err);
            }
        }
    }
    forEach(next, promiseCtor) {
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor((resolve, reject) => {
            let subscription;
            subscription = this.subscribe((value) => {
                try {
                    next(value);
                }
                catch (err) {
                    reject(err);
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            }, reject, resolve);
        });
    }
    _subscribe(subscriber) {
        const { source } = this;
        return source && source.subscribe(subscriber);
    }
    [observable]() {
        return this;
    }
    pipe(...operations) {
        if (operations.length === 0) {
            return this;
        }
        return pipeFromArray(operations)(this);
    }
    toPromise(promiseCtor) {
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor((resolve, reject) => {
            let value;
            this.subscribe((x) => value = x, (err) => reject(err), () => resolve(value));
        });
    }
}
Observable.create = (subscribe) => {
    return new Observable(subscribe);
};
function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
        promiseCtor = config.Promise || Promise;
    }
    if (!promiseCtor) {
        throw new Error('no Promise impl found');
    }
    return promiseCtor;
}

const ObjectUnsubscribedErrorImpl = (() => {
    function ObjectUnsubscribedErrorImpl() {
        Error.call(this);
        this.message = 'object unsubscribed';
        this.name = 'ObjectUnsubscribedError';
        return this;
    }
    ObjectUnsubscribedErrorImpl.prototype = Object.create(Error.prototype);
    return ObjectUnsubscribedErrorImpl;
})();
const ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

class SubjectSubscription extends Subscription {
    constructor(subject, subscriber) {
        super();
        this.subject = subject;
        this.subscriber = subscriber;
        this.closed = false;
    }
    unsubscribe() {
        if (this.closed) {
            return;
        }
        this.closed = true;
        const subject = this.subject;
        const observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        const subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    }
}

class SubjectSubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
        this.destination = destination;
    }
}
class Subject extends Observable {
    constructor() {
        super();
        this.observers = [];
        this.closed = false;
        this.isStopped = false;
        this.hasError = false;
        this.thrownError = null;
    }
    [rxSubscriber]() {
        return new SubjectSubscriber(this);
    }
    lift(operator) {
        const subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    }
    next(value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            const { observers } = this;
            const len = observers.length;
            const copy = observers.slice();
            for (let i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    }
    error(err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        const { observers } = this;
        const len = observers.length;
        const copy = observers.slice();
        for (let i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    }
    complete() {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.isStopped = true;
        const { observers } = this;
        const len = observers.length;
        const copy = observers.slice();
        for (let i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    }
    unsubscribe() {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    }
    _trySubscribe(subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else {
            return super._trySubscribe(subscriber);
        }
    }
    _subscribe(subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription.EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new SubjectSubscription(this, subscriber);
        }
    }
    asObservable() {
        const observable = new Observable();
        observable.source = this;
        return observable;
    }
}
Subject.create = (destination, source) => {
    return new AnonymousSubject(destination, source);
};
class AnonymousSubject extends Subject {
    constructor(destination, source) {
        super();
        this.destination = destination;
        this.source = source;
    }
    next(value) {
        const { destination } = this;
        if (destination && destination.next) {
            destination.next(value);
        }
    }
    error(err) {
        const { destination } = this;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    }
    complete() {
        const { destination } = this;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    }
    _subscribe(subscriber) {
        const { source } = this;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return Subscription.EMPTY;
        }
    }
}

function refCount() {
    return function refCountOperatorFunction(source) {
        return source.lift(new RefCountOperator(source));
    };
}
class RefCountOperator {
    constructor(connectable) {
        this.connectable = connectable;
    }
    call(subscriber, source) {
        const { connectable } = this;
        connectable._refCount++;
        const refCounter = new RefCountSubscriber(subscriber, connectable);
        const subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    }
}
class RefCountSubscriber extends Subscriber {
    constructor(destination, connectable) {
        super(destination);
        this.connectable = connectable;
    }
    _unsubscribe() {
        const { connectable } = this;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        const refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        const { connection } = this;
        const sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    }
}

class ConnectableObservable extends Observable {
    constructor(source, subjectFactory) {
        super();
        this.source = source;
        this.subjectFactory = subjectFactory;
        this._refCount = 0;
        this._isComplete = false;
    }
    _subscribe(subscriber) {
        return this.getSubject().subscribe(subscriber);
    }
    getSubject() {
        const subject = this._subject;
        if (!subject || subject.isStopped) {
            this._subject = this.subjectFactory();
        }
        return this._subject;
    }
    connect() {
        let connection = this._connection;
        if (!connection) {
            this._isComplete = false;
            connection = this._connection = new Subscription();
            connection.add(this.source
                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
            if (connection.closed) {
                this._connection = null;
                connection = Subscription.EMPTY;
            }
        }
        return connection;
    }
    refCount() {
        return refCount()(this);
    }
}
const connectableObservableDescriptor = (() => {
    const connectableProto = ConnectableObservable.prototype;
    return {
        operator: { value: null },
        _refCount: { value: 0, writable: true },
        _subject: { value: null, writable: true },
        _connection: { value: null, writable: true },
        _subscribe: { value: connectableProto._subscribe },
        _isComplete: { value: connectableProto._isComplete, writable: true },
        getSubject: { value: connectableProto.getSubject },
        connect: { value: connectableProto.connect },
        refCount: { value: connectableProto.refCount }
    };
})();
class ConnectableSubscriber extends SubjectSubscriber {
    constructor(destination, connectable) {
        super(destination);
        this.connectable = connectable;
    }
    _error(err) {
        this._unsubscribe();
        super._error(err);
    }
    _complete() {
        this.connectable._isComplete = true;
        this._unsubscribe();
        super._complete();
    }
    _unsubscribe() {
        const connectable = this.connectable;
        if (connectable) {
            this.connectable = null;
            const connection = connectable._connection;
            connectable._refCount = 0;
            connectable._subject = null;
            connectable._connection = null;
            if (connection) {
                connection.unsubscribe();
            }
        }
    }
}
class RefCountOperator$1 {
    constructor(connectable) {
        this.connectable = connectable;
    }
    call(subscriber, source) {
        const { connectable } = this;
        connectable._refCount++;
        const refCounter = new RefCountSubscriber$1(subscriber, connectable);
        const subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    }
}
class RefCountSubscriber$1 extends Subscriber {
    constructor(destination, connectable) {
        super(destination);
        this.connectable = connectable;
    }
    _unsubscribe() {
        const { connectable } = this;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        const refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        const { connection } = this;
        const sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    }
}

function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
    return (source) => source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
}
class GroupByOperator {
    constructor(keySelector, elementSelector, durationSelector, subjectSelector) {
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.subjectSelector = subjectSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
    }
}
class GroupBySubscriber extends Subscriber {
    constructor(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
        super(destination);
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.subjectSelector = subjectSelector;
        this.groups = null;
        this.attemptedToUnsubscribe = false;
        this.count = 0;
    }
    _next(value) {
        let key;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            this.error(err);
            return;
        }
        this._group(value, key);
    }
    _group(value, key) {
        let groups = this.groups;
        if (!groups) {
            groups = this.groups = new Map();
        }
        let group = groups.get(key);
        let element;
        if (this.elementSelector) {
            try {
                element = this.elementSelector(value);
            }
            catch (err) {
                this.error(err);
            }
        }
        else {
            element = value;
        }
        if (!group) {
            group = (this.subjectSelector ? this.subjectSelector() : new Subject());
            groups.set(key, group);
            const groupedObservable = new GroupedObservable(key, group, this);
            this.destination.next(groupedObservable);
            if (this.durationSelector) {
                let duration;
                try {
                    duration = this.durationSelector(new GroupedObservable(key, group));
                }
                catch (err) {
                    this.error(err);
                    return;
                }
                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
            }
        }
        if (!group.closed) {
            group.next(element);
        }
    }
    _error(err) {
        const groups = this.groups;
        if (groups) {
            groups.forEach((group, key) => {
                group.error(err);
            });
            groups.clear();
        }
        this.destination.error(err);
    }
    _complete() {
        const groups = this.groups;
        if (groups) {
            groups.forEach((group, key) => {
                group.complete();
            });
            groups.clear();
        }
        this.destination.complete();
    }
    removeGroup(key) {
        this.groups.delete(key);
    }
    unsubscribe() {
        if (!this.closed) {
            this.attemptedToUnsubscribe = true;
            if (this.count === 0) {
                super.unsubscribe();
            }
        }
    }
}
class GroupDurationSubscriber extends Subscriber {
    constructor(key, group, parent) {
        super(group);
        this.key = key;
        this.group = group;
        this.parent = parent;
    }
    _next(value) {
        this.complete();
    }
    _unsubscribe() {
        const { parent, key } = this;
        this.key = this.parent = null;
        if (parent) {
            parent.removeGroup(key);
        }
    }
}
class GroupedObservable extends Observable {
    constructor(key, groupSubject, refCountSubscription) {
        super();
        this.key = key;
        this.groupSubject = groupSubject;
        this.refCountSubscription = refCountSubscription;
    }
    _subscribe(subscriber) {
        const subscription = new Subscription();
        const { refCountSubscription, groupSubject } = this;
        if (refCountSubscription && !refCountSubscription.closed) {
            subscription.add(new InnerRefCountSubscription(refCountSubscription));
        }
        subscription.add(groupSubject.subscribe(subscriber));
        return subscription;
    }
}
class InnerRefCountSubscription extends Subscription {
    constructor(parent) {
        super();
        this.parent = parent;
        parent.count++;
    }
    unsubscribe() {
        const parent = this.parent;
        if (!parent.closed && !this.closed) {
            super.unsubscribe();
            parent.count -= 1;
            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                parent.unsubscribe();
            }
        }
    }
}

class BehaviorSubject extends Subject {
    constructor(_value) {
        super();
        this._value = _value;
    }
    get value() {
        return this.getValue();
    }
    _subscribe(subscriber) {
        const subscription = super._subscribe(subscriber);
        if (subscription && !subscription.closed) {
            subscriber.next(this._value);
        }
        return subscription;
    }
    getValue() {
        if (this.hasError) {
            throw this.thrownError;
        }
        else if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else {
            return this._value;
        }
    }
    next(value) {
        super.next(this._value = value);
    }
}

class Action extends Subscription {
    constructor(scheduler, work) {
        super();
    }
    schedule(state, delay = 0) {
        return this;
    }
}

class AsyncAction extends Action {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
        this.pending = false;
    }
    schedule(state, delay = 0) {
        if (this.closed) {
            return this;
        }
        this.state = state;
        const id = this.id;
        const scheduler = this.scheduler;
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.pending = true;
        this.delay = delay;
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    }
    requestAsyncId(scheduler, id, delay = 0) {
        return setInterval(scheduler.flush.bind(scheduler, this), delay);
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
        }
        clearInterval(id);
        return undefined;
    }
    execute(state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        const error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    }
    _execute(state, delay) {
        let errored = false;
        let errorValue = undefined;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    }
    _unsubscribe() {
        const id = this.id;
        const scheduler = this.scheduler;
        const actions = scheduler.actions;
        const index = actions.indexOf(this);
        this.work = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
    }
}

class QueueAction extends AsyncAction {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    schedule(state, delay = 0) {
        if (delay > 0) {
            return super.schedule(state, delay);
        }
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
    }
    execute(state, delay) {
        return (delay > 0 || this.closed) ?
            super.execute(state, delay) :
            this._execute(state, delay);
    }
    requestAsyncId(scheduler, id, delay = 0) {
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return super.requestAsyncId(scheduler, id, delay);
        }
        return scheduler.flush(this);
    }
}

class Scheduler {
    constructor(SchedulerAction, now = Scheduler.now) {
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    schedule(work, delay = 0, state) {
        return new this.SchedulerAction(this, work).schedule(state, delay);
    }
}
Scheduler.now = () => Date.now();

class AsyncScheduler extends Scheduler {
    constructor(SchedulerAction, now = Scheduler.now) {
        super(SchedulerAction, () => {
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
                return AsyncScheduler.delegate.now();
            }
            else {
                return now();
            }
        });
        this.actions = [];
        this.active = false;
        this.scheduled = undefined;
    }
    schedule(work, delay = 0, state) {
        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
            return AsyncScheduler.delegate.schedule(work, delay, state);
        }
        else {
            return super.schedule(work, delay, state);
        }
    }
    flush(action) {
        const { actions } = this;
        if (this.active) {
            actions.push(action);
            return;
        }
        let error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift());
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    }
}

class QueueScheduler extends AsyncScheduler {
}

const queue = new QueueScheduler(QueueAction);

const EMPTY = new Observable(subscriber => subscriber.complete());
function empty$1(scheduler) {
    return scheduler ? emptyScheduled(scheduler) : EMPTY;
}
function emptyScheduled(scheduler) {
    return new Observable(subscriber => scheduler.schedule(() => subscriber.complete()));
}

function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}

const subscribeToArray = (array) => (subscriber) => {
    for (let i = 0, len = array.length; i < len && !subscriber.closed; i++) {
        subscriber.next(array[i]);
    }
    subscriber.complete();
};

function scheduleArray(input, scheduler) {
    return new Observable(subscriber => {
        const sub = new Subscription();
        let i = 0;
        sub.add(scheduler.schedule(function () {
            if (i === input.length) {
                subscriber.complete();
                return;
            }
            subscriber.next(input[i++]);
            if (!subscriber.closed) {
                sub.add(this.schedule());
            }
        }));
        return sub;
    });
}

function fromArray(input, scheduler) {
    if (!scheduler) {
        return new Observable(subscribeToArray(input));
    }
    else {
        return scheduleArray(input, scheduler);
    }
}

function of(...args) {
    let scheduler = args[args.length - 1];
    if (isScheduler(scheduler)) {
        args.pop();
        return scheduleArray(args, scheduler);
    }
    else {
        return fromArray(args);
    }
}

function throwError(error, scheduler) {
    if (!scheduler) {
        return new Observable(subscriber => subscriber.error(error));
    }
    else {
        return new Observable(subscriber => scheduler.schedule(dispatch, 0, { error, subscriber }));
    }
}
function dispatch({ error, subscriber }) {
    subscriber.error(error);
}

var NotificationKind;
(function (NotificationKind) {
    NotificationKind["NEXT"] = "N";
    NotificationKind["ERROR"] = "E";
    NotificationKind["COMPLETE"] = "C";
})(NotificationKind || (NotificationKind = {}));
class Notification {
    constructor(kind, value, error) {
        this.kind = kind;
        this.value = value;
        this.error = error;
        this.hasValue = kind === 'N';
    }
    observe(observer) {
        switch (this.kind) {
            case 'N':
                return observer.next && observer.next(this.value);
            case 'E':
                return observer.error && observer.error(this.error);
            case 'C':
                return observer.complete && observer.complete();
        }
    }
    do(next, error, complete) {
        const kind = this.kind;
        switch (kind) {
            case 'N':
                return next && next(this.value);
            case 'E':
                return error && error(this.error);
            case 'C':
                return complete && complete();
        }
    }
    accept(nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
            return this.observe(nextOrObserver);
        }
        else {
            return this.do(nextOrObserver, error, complete);
        }
    }
    toObservable() {
        const kind = this.kind;
        switch (kind) {
            case 'N':
                return of(this.value);
            case 'E':
                return throwError(this.error);
            case 'C':
                return empty$1();
        }
        throw new Error('unexpected notification kind value');
    }
    static createNext(value) {
        if (typeof value !== 'undefined') {
            return new Notification('N', value);
        }
        return Notification.undefinedValueNotification;
    }
    static createError(err) {
        return new Notification('E', undefined, err);
    }
    static createComplete() {
        return Notification.completeNotification;
    }
}
Notification.completeNotification = new Notification('C');
Notification.undefinedValueNotification = new Notification('N', undefined);

function observeOn(scheduler, delay = 0) {
    return function observeOnOperatorFunction(source) {
        return source.lift(new ObserveOnOperator(scheduler, delay));
    };
}
class ObserveOnOperator {
    constructor(scheduler, delay = 0) {
        this.scheduler = scheduler;
        this.delay = delay;
    }
    call(subscriber, source) {
        return source.subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
    }
}
class ObserveOnSubscriber extends Subscriber {
    constructor(destination, scheduler, delay = 0) {
        super(destination);
        this.scheduler = scheduler;
        this.delay = delay;
    }
    static dispatch(arg) {
        const { notification, destination } = arg;
        notification.observe(destination);
        this.unsubscribe();
    }
    scheduleMessage(notification) {
        const destination = this.destination;
        destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    }
    _next(value) {
        this.scheduleMessage(Notification.createNext(value));
    }
    _error(err) {
        this.scheduleMessage(Notification.createError(err));
        this.unsubscribe();
    }
    _complete() {
        this.scheduleMessage(Notification.createComplete());
        this.unsubscribe();
    }
}
class ObserveOnMessage {
    constructor(notification, destination) {
        this.notification = notification;
        this.destination = destination;
    }
}

class ReplaySubject extends Subject {
    constructor(bufferSize = Number.POSITIVE_INFINITY, windowTime = Number.POSITIVE_INFINITY, scheduler) {
        super();
        this.scheduler = scheduler;
        this._events = [];
        this._infiniteTimeWindow = false;
        this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        this._windowTime = windowTime < 1 ? 1 : windowTime;
        if (windowTime === Number.POSITIVE_INFINITY) {
            this._infiniteTimeWindow = true;
            this.next = this.nextInfiniteTimeWindow;
        }
        else {
            this.next = this.nextTimeWindow;
        }
    }
    nextInfiniteTimeWindow(value) {
        const _events = this._events;
        _events.push(value);
        if (_events.length > this._bufferSize) {
            _events.shift();
        }
        super.next(value);
    }
    nextTimeWindow(value) {
        this._events.push(new ReplayEvent(this._getNow(), value));
        this._trimBufferThenGetEvents();
        super.next(value);
    }
    _subscribe(subscriber) {
        const _infiniteTimeWindow = this._infiniteTimeWindow;
        const _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
        const scheduler = this.scheduler;
        const len = _events.length;
        let subscription;
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else if (this.isStopped || this.hasError) {
            subscription = Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            subscription = new SubjectSubscription(this, subscriber);
        }
        if (scheduler) {
            subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
        }
        if (_infiniteTimeWindow) {
            for (let i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i]);
            }
        }
        else {
            for (let i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i].value);
            }
        }
        if (this.hasError) {
            subscriber.error(this.thrownError);
        }
        else if (this.isStopped) {
            subscriber.complete();
        }
        return subscription;
    }
    _getNow() {
        return (this.scheduler || queue).now();
    }
    _trimBufferThenGetEvents() {
        const now = this._getNow();
        const _bufferSize = this._bufferSize;
        const _windowTime = this._windowTime;
        const _events = this._events;
        const eventsCount = _events.length;
        let spliceCount = 0;
        while (spliceCount < eventsCount) {
            if ((now - _events[spliceCount].time) < _windowTime) {
                break;
            }
            spliceCount++;
        }
        if (eventsCount > _bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
        }
        if (spliceCount > 0) {
            _events.splice(0, spliceCount);
        }
        return _events;
    }
}
class ReplayEvent {
    constructor(time, value) {
        this.time = time;
        this.value = value;
    }
}

class AsyncSubject extends Subject {
    constructor() {
        super(...arguments);
        this.value = null;
        this.hasNext = false;
        this.hasCompleted = false;
    }
    _subscribe(subscriber) {
        if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription.EMPTY;
        }
        else if (this.hasCompleted && this.hasNext) {
            subscriber.next(this.value);
            subscriber.complete();
            return Subscription.EMPTY;
        }
        return super._subscribe(subscriber);
    }
    next(value) {
        if (!this.hasCompleted) {
            this.value = value;
            this.hasNext = true;
        }
    }
    error(error) {
        if (!this.hasCompleted) {
            super.error(error);
        }
    }
    complete() {
        this.hasCompleted = true;
        if (this.hasNext) {
            super.next(this.value);
        }
        super.complete();
    }
}

let nextHandle = 1;
const RESOLVED = (() => Promise.resolve())();
const activeHandles = {};
function findAndClearHandle(handle) {
    if (handle in activeHandles) {
        delete activeHandles[handle];
        return true;
    }
    return false;
}
const Immediate = {
    setImmediate(cb) {
        const handle = nextHandle++;
        activeHandles[handle] = true;
        RESOLVED.then(() => findAndClearHandle(handle) && cb());
        return handle;
    },
    clearImmediate(handle) {
        findAndClearHandle(handle);
    },
};
const TestTools = {
    pending() {
        return Object.keys(activeHandles).length;
    }
};

class AsapAction extends AsyncAction {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    requestAsyncId(scheduler, id, delay = 0) {
        if (delay !== null && delay > 0) {
            return super.requestAsyncId(scheduler, id, delay);
        }
        scheduler.actions.push(this);
        return scheduler.scheduled || (scheduler.scheduled = Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return super.recycleAsyncId(scheduler, id, delay);
        }
        if (scheduler.actions.length === 0) {
            Immediate.clearImmediate(id);
            scheduler.scheduled = undefined;
        }
        return undefined;
    }
}

class AsapScheduler extends AsyncScheduler {
    flush(action) {
        this.active = true;
        this.scheduled = undefined;
        const { actions } = this;
        let error;
        let index = -1;
        let count = actions.length;
        action = action || actions.shift();
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    }
}

const asap = new AsapScheduler(AsapAction);

const async = new AsyncScheduler(AsyncAction);

class AnimationFrameAction extends AsyncAction {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    requestAsyncId(scheduler, id, delay = 0) {
        if (delay !== null && delay > 0) {
            return super.requestAsyncId(scheduler, id, delay);
        }
        scheduler.actions.push(this);
        return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(() => scheduler.flush(null)));
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return super.recycleAsyncId(scheduler, id, delay);
        }
        if (scheduler.actions.length === 0) {
            cancelAnimationFrame(id);
            scheduler.scheduled = undefined;
        }
        return undefined;
    }
}

class AnimationFrameScheduler extends AsyncScheduler {
    flush(action) {
        this.active = true;
        this.scheduled = undefined;
        const { actions } = this;
        let error;
        let index = -1;
        let count = actions.length;
        action = action || actions.shift();
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    }
}

const animationFrame = new AnimationFrameScheduler(AnimationFrameAction);

class VirtualTimeScheduler extends AsyncScheduler {
    constructor(SchedulerAction = VirtualAction, maxFrames = Number.POSITIVE_INFINITY) {
        super(SchedulerAction, () => this.frame);
        this.maxFrames = maxFrames;
        this.frame = 0;
        this.index = -1;
    }
    flush() {
        const { actions, maxFrames } = this;
        let error, action;
        while ((action = actions[0]) && action.delay <= maxFrames) {
            actions.shift();
            this.frame = action.delay;
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        }
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    }
}
VirtualTimeScheduler.frameTimeFactor = 10;
class VirtualAction extends AsyncAction {
    constructor(scheduler, work, index = scheduler.index += 1) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
        this.index = index;
        this.active = true;
        this.index = scheduler.index = index;
    }
    schedule(state, delay = 0) {
        if (!this.id) {
            return super.schedule(state, delay);
        }
        this.active = false;
        const action = new VirtualAction(this.scheduler, this.work);
        this.add(action);
        return action.schedule(state, delay);
    }
    requestAsyncId(scheduler, id, delay = 0) {
        this.delay = scheduler.frame + delay;
        const { actions } = scheduler;
        actions.push(this);
        actions.sort(VirtualAction.sortActions);
        return true;
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        return undefined;
    }
    _execute(state, delay) {
        if (this.active === true) {
            return super._execute(state, delay);
        }
    }
    static sortActions(a, b) {
        if (a.delay === b.delay) {
            if (a.index === b.index) {
                return 0;
            }
            else if (a.index > b.index) {
                return 1;
            }
            else {
                return -1;
            }
        }
        else if (a.delay > b.delay) {
            return 1;
        }
        else {
            return -1;
        }
    }
}

function noop() { }

function isObservable(obj) {
    return !!obj && (obj instanceof Observable || (typeof obj.lift === 'function' && typeof obj.subscribe === 'function'));
}

const ArgumentOutOfRangeErrorImpl = (() => {
    function ArgumentOutOfRangeErrorImpl() {
        Error.call(this);
        this.message = 'argument out of range';
        this.name = 'ArgumentOutOfRangeError';
        return this;
    }
    ArgumentOutOfRangeErrorImpl.prototype = Object.create(Error.prototype);
    return ArgumentOutOfRangeErrorImpl;
})();
const ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;

const EmptyErrorImpl = (() => {
    function EmptyErrorImpl() {
        Error.call(this);
        this.message = 'no elements in sequence';
        this.name = 'EmptyError';
        return this;
    }
    EmptyErrorImpl.prototype = Object.create(Error.prototype);
    return EmptyErrorImpl;
})();
const EmptyError = EmptyErrorImpl;

const TimeoutErrorImpl = (() => {
    function TimeoutErrorImpl() {
        Error.call(this);
        this.message = 'Timeout has occurred';
        this.name = 'TimeoutError';
        return this;
    }
    TimeoutErrorImpl.prototype = Object.create(Error.prototype);
    return TimeoutErrorImpl;
})();
const TimeoutError = TimeoutErrorImpl;

function map(project, thisArg) {
    return function mapOperation(source) {
        if (typeof project !== 'function') {
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
        }
        return source.lift(new MapOperator(project, thisArg));
    };
}
class MapOperator {
    constructor(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    call(subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    }
}
class MapSubscriber extends Subscriber {
    constructor(destination, project, thisArg) {
        super(destination);
        this.project = project;
        this.count = 0;
        this.thisArg = thisArg || this;
    }
    _next(value) {
        let result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    }
}

function bindCallback(callbackFunc, resultSelector, scheduler) {
    if (resultSelector) {
        if (isScheduler(resultSelector)) {
            scheduler = resultSelector;
        }
        else {
            return (...args) => bindCallback(callbackFunc, scheduler)(...args).pipe(map((args) => isArray(args) ? resultSelector(...args) : resultSelector(args)));
        }
    }
    return function (...args) {
        const context = this;
        let subject;
        const params = {
            context,
            subject,
            callbackFunc,
            scheduler,
        };
        return new Observable(subscriber => {
            if (!scheduler) {
                if (!subject) {
                    subject = new AsyncSubject();
                    const handler = (...innerArgs) => {
                        subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
                        subject.complete();
                    };
                    try {
                        callbackFunc.apply(context, [...args, handler]);
                    }
                    catch (err) {
                        if (canReportError(subject)) {
                            subject.error(err);
                        }
                        else {
                            console.warn(err);
                        }
                    }
                }
                return subject.subscribe(subscriber);
            }
            else {
                const state = {
                    args, subscriber, params,
                };
                return scheduler.schedule(dispatch$1, 0, state);
            }
        });
    };
}
function dispatch$1(state) {
    const self = this;
    const { args, subscriber, params } = state;
    const { callbackFunc, context, scheduler } = params;
    let { subject } = params;
    if (!subject) {
        subject = params.subject = new AsyncSubject();
        const handler = (...innerArgs) => {
            const value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
            this.add(scheduler.schedule(dispatchNext, 0, { value, subject }));
        };
        try {
            callbackFunc.apply(context, [...args, handler]);
        }
        catch (err) {
            subject.error(err);
        }
    }
    this.add(subject.subscribe(subscriber));
}
function dispatchNext(state) {
    const { value, subject } = state;
    subject.next(value);
    subject.complete();
}
function dispatchError(state) {
    const { err, subject } = state;
    subject.error(err);
}

function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
    if (resultSelector) {
        if (isScheduler(resultSelector)) {
            scheduler = resultSelector;
        }
        else {
            return (...args) => bindNodeCallback(callbackFunc, scheduler)(...args).pipe(map(args => isArray(args) ? resultSelector(...args) : resultSelector(args)));
        }
    }
    return function (...args) {
        const params = {
            subject: undefined,
            args,
            callbackFunc,
            scheduler,
            context: this,
        };
        return new Observable(subscriber => {
            const { context } = params;
            let { subject } = params;
            if (!scheduler) {
                if (!subject) {
                    subject = params.subject = new AsyncSubject();
                    const handler = (...innerArgs) => {
                        const err = innerArgs.shift();
                        if (err) {
                            subject.error(err);
                            return;
                        }
                        subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
                        subject.complete();
                    };
                    try {
                        callbackFunc.apply(context, [...args, handler]);
                    }
                    catch (err) {
                        if (canReportError(subject)) {
                            subject.error(err);
                        }
                        else {
                            console.warn(err);
                        }
                    }
                }
                return subject.subscribe(subscriber);
            }
            else {
                return scheduler.schedule(dispatch$2, 0, { params, subscriber, context });
            }
        });
    };
}
function dispatch$2(state) {
    const { params, subscriber, context } = state;
    const { callbackFunc, args, scheduler } = params;
    let subject = params.subject;
    if (!subject) {
        subject = params.subject = new AsyncSubject();
        const handler = (...innerArgs) => {
            const err = innerArgs.shift();
            if (err) {
                this.add(scheduler.schedule(dispatchError$1, 0, { err, subject }));
            }
            else {
                const value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
                this.add(scheduler.schedule(dispatchNext$1, 0, { value, subject }));
            }
        };
        try {
            callbackFunc.apply(context, [...args, handler]);
        }
        catch (err) {
            this.add(scheduler.schedule(dispatchError$1, 0, { err, subject }));
        }
    }
    this.add(subject.subscribe(subscriber));
}
function dispatchNext$1(arg) {
    const { value, subject } = arg;
    subject.next(value);
    subject.complete();
}
function dispatchError$1(arg) {
    const { err, subject } = arg;
    subject.error(err);
}

class OuterSubscriber extends Subscriber {
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    }
    notifyError(error, innerSub) {
        this.destination.error(error);
    }
    notifyComplete(innerSub) {
        this.destination.complete();
    }
}

class InnerSubscriber extends Subscriber {
    constructor(parent, outerValue, outerIndex) {
        super();
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    _next(value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    }
    _error(error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    }
    _complete() {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    }
}

const subscribeToPromise = (promise) => (subscriber) => {
    promise.then((value) => {
        if (!subscriber.closed) {
            subscriber.next(value);
            subscriber.complete();
        }
    }, (err) => subscriber.error(err))
        .then(null, hostReportError);
    return subscriber;
};

function getSymbolIterator() {
    if (typeof Symbol !== 'function' || !Symbol.iterator) {
        return '@@iterator';
    }
    return Symbol.iterator;
}
const iterator = getSymbolIterator();
const $$iterator = iterator;

const subscribeToIterable = (iterable) => (subscriber) => {
    const iterator$1 = iterable[iterator]();
    do {
        const item = iterator$1.next();
        if (item.done) {
            subscriber.complete();
            break;
        }
        subscriber.next(item.value);
        if (subscriber.closed) {
            break;
        }
    } while (true);
    if (typeof iterator$1.return === 'function') {
        subscriber.add(() => {
            if (iterator$1.return) {
                iterator$1.return();
            }
        });
    }
    return subscriber;
};

const subscribeToObservable = (obj) => (subscriber) => {
    const obs = obj[observable]();
    if (typeof obs.subscribe !== 'function') {
        throw new TypeError('Provided object does not correctly implement Symbol.observable');
    }
    else {
        return obs.subscribe(subscriber);
    }
};

const isArrayLike = ((x) => x && typeof x.length === 'number' && typeof x !== 'function');

function isPromise(value) {
    return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}

const subscribeTo = (result) => {
    if (!!result && typeof result[observable] === 'function') {
        return subscribeToObservable(result);
    }
    else if (isArrayLike(result)) {
        return subscribeToArray(result);
    }
    else if (isPromise(result)) {
        return subscribeToPromise(result);
    }
    else if (!!result && typeof result[iterator] === 'function') {
        return subscribeToIterable(result);
    }
    else {
        const value = isObject(result) ? 'an invalid object' : `'${result}'`;
        const msg = `You provided ${value} where a stream was expected.`
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        throw new TypeError(msg);
    }
};

function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, innerSubscriber = new InnerSubscriber(outerSubscriber, outerValue, outerIndex)) {
    if (innerSubscriber.closed) {
        return undefined;
    }
    if (result instanceof Observable) {
        return result.subscribe(innerSubscriber);
    }
    return subscribeTo(result)(innerSubscriber);
}

const NONE = {};
function combineLatest(...observables) {
    let resultSelector = null;
    let scheduler = null;
    if (isScheduler(observables[observables.length - 1])) {
        scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
        resultSelector = observables.pop();
    }
    if (observables.length === 1 && isArray(observables[0])) {
        observables = observables[0];
    }
    return fromArray(observables, scheduler).lift(new CombineLatestOperator(resultSelector));
}
class CombineLatestOperator {
    constructor(resultSelector) {
        this.resultSelector = resultSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new CombineLatestSubscriber(subscriber, this.resultSelector));
    }
}
class CombineLatestSubscriber extends OuterSubscriber {
    constructor(destination, resultSelector) {
        super(destination);
        this.resultSelector = resultSelector;
        this.active = 0;
        this.values = [];
        this.observables = [];
    }
    _next(observable) {
        this.values.push(NONE);
        this.observables.push(observable);
    }
    _complete() {
        const observables = this.observables;
        const len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            this.active = len;
            this.toRespond = len;
            for (let i = 0; i < len; i++) {
                const observable = observables[i];
                this.add(subscribeToResult(this, observable, observable, i));
            }
        }
    }
    notifyComplete(unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const values = this.values;
        const oldVal = values[outerIndex];
        const toRespond = !this.toRespond
            ? 0
            : oldVal === NONE ? --this.toRespond : this.toRespond;
        values[outerIndex] = innerValue;
        if (toRespond === 0) {
            if (this.resultSelector) {
                this._tryResultSelector(values);
            }
            else {
                this.destination.next(values.slice());
            }
        }
    }
    _tryResultSelector(values) {
        let result;
        try {
            result = this.resultSelector.apply(this, values);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    }
}

function scheduleObservable(input, scheduler) {
    return new Observable(subscriber => {
        const sub = new Subscription();
        sub.add(scheduler.schedule(() => {
            const observable$1 = input[observable]();
            sub.add(observable$1.subscribe({
                next(value) { sub.add(scheduler.schedule(() => subscriber.next(value))); },
                error(err) { sub.add(scheduler.schedule(() => subscriber.error(err))); },
                complete() { sub.add(scheduler.schedule(() => subscriber.complete())); },
            }));
        }));
        return sub;
    });
}

function schedulePromise(input, scheduler) {
    return new Observable(subscriber => {
        const sub = new Subscription();
        sub.add(scheduler.schedule(() => input.then(value => {
            sub.add(scheduler.schedule(() => {
                subscriber.next(value);
                sub.add(scheduler.schedule(() => subscriber.complete()));
            }));
        }, err => {
            sub.add(scheduler.schedule(() => subscriber.error(err)));
        })));
        return sub;
    });
}

function scheduleIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    return new Observable(subscriber => {
        const sub = new Subscription();
        let iterator$1;
        sub.add(() => {
            if (iterator$1 && typeof iterator$1.return === 'function') {
                iterator$1.return();
            }
        });
        sub.add(scheduler.schedule(() => {
            iterator$1 = input[iterator]();
            sub.add(scheduler.schedule(function () {
                if (subscriber.closed) {
                    return;
                }
                let value;
                let done;
                try {
                    const result = iterator$1.next();
                    value = result.value;
                    done = result.done;
                }
                catch (err) {
                    subscriber.error(err);
                    return;
                }
                if (done) {
                    subscriber.complete();
                }
                else {
                    subscriber.next(value);
                    this.schedule();
                }
            }));
        }));
        return sub;
    });
}

function isInteropObservable(input) {
    return input && typeof input[observable] === 'function';
}

function isIterable(input) {
    return input && typeof input[iterator] === 'function';
}

function scheduled(input, scheduler) {
    if (input != null) {
        if (isInteropObservable(input)) {
            return scheduleObservable(input, scheduler);
        }
        else if (isPromise(input)) {
            return schedulePromise(input, scheduler);
        }
        else if (isArrayLike(input)) {
            return scheduleArray(input, scheduler);
        }
        else if (isIterable(input) || typeof input === 'string') {
            return scheduleIterable(input, scheduler);
        }
    }
    throw new TypeError((input !== null && typeof input || input) + ' is not observable');
}

function from(input, scheduler) {
    if (!scheduler) {
        if (input instanceof Observable) {
            return input;
        }
        return new Observable(subscribeTo(input));
    }
    else {
        return scheduled(input, scheduler);
    }
}

function mergeMap(project, resultSelector, concurrent = Number.POSITIVE_INFINITY) {
    if (typeof resultSelector === 'function') {
        return (source) => source.pipe(mergeMap((a, i) => from(project(a, i)).pipe(map((b, ii) => resultSelector(a, b, i, ii))), concurrent));
    }
    else if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
    }
    return (source) => source.lift(new MergeMapOperator(project, concurrent));
}
class MergeMapOperator {
    constructor(project, concurrent = Number.POSITIVE_INFINITY) {
        this.project = project;
        this.concurrent = concurrent;
    }
    call(observer, source) {
        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.concurrent));
    }
}
class MergeMapSubscriber extends OuterSubscriber {
    constructor(destination, project, concurrent = Number.POSITIVE_INFINITY) {
        super(destination);
        this.project = project;
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    _next(value) {
        if (this.active < this.concurrent) {
            this._tryNext(value);
        }
        else {
            this.buffer.push(value);
        }
    }
    _tryNext(value) {
        let result;
        const index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.active++;
        this._innerSub(result, value, index);
    }
    _innerSub(ish, value, index) {
        const innerSubscriber = new InnerSubscriber(this, value, index);
        const destination = this.destination;
        destination.add(innerSubscriber);
        const innerSubscription = subscribeToResult(this, ish, undefined, undefined, innerSubscriber);
        if (innerSubscription !== innerSubscriber) {
            destination.add(innerSubscription);
        }
    }
    _complete() {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
        this.unsubscribe();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    }
}

function mergeAll(concurrent = Number.POSITIVE_INFINITY) {
    return mergeMap(identity, concurrent);
}

function concatAll() {
    return mergeAll(1);
}

function concat(...observables) {
    return concatAll()(of(...observables));
}

function defer(observableFactory) {
    return new Observable(subscriber => {
        let input;
        try {
            input = observableFactory();
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        const source = input ? from(input) : empty$1();
        return source.subscribe(subscriber);
    });
}

function forkJoin(...sources) {
    if (sources.length === 1) {
        const first = sources[0];
        if (isArray(first)) {
            return forkJoinInternal(first, null);
        }
        if (isObject(first) && Object.getPrototypeOf(first) === Object.prototype) {
            const keys = Object.keys(first);
            return forkJoinInternal(keys.map(key => first[key]), keys);
        }
    }
    if (typeof sources[sources.length - 1] === 'function') {
        const resultSelector = sources.pop();
        sources = (sources.length === 1 && isArray(sources[0])) ? sources[0] : sources;
        return forkJoinInternal(sources, null).pipe(map((args) => resultSelector(...args)));
    }
    return forkJoinInternal(sources, null);
}
function forkJoinInternal(sources, keys) {
    return new Observable(subscriber => {
        const len = sources.length;
        if (len === 0) {
            subscriber.complete();
            return;
        }
        const values = new Array(len);
        let completed = 0;
        let emitted = 0;
        for (let i = 0; i < len; i++) {
            const source = from(sources[i]);
            let hasValue = false;
            subscriber.add(source.subscribe({
                next: value => {
                    if (!hasValue) {
                        hasValue = true;
                        emitted++;
                    }
                    values[i] = value;
                },
                error: err => subscriber.error(err),
                complete: () => {
                    completed++;
                    if (completed === len || !hasValue) {
                        if (emitted === len) {
                            subscriber.next(keys ?
                                keys.reduce((result, key, i) => (result[key] = values[i], result), {}) :
                                values);
                        }
                        subscriber.complete();
                    }
                }
            }));
        }
    });
}

const toString = (() => Object.prototype.toString)();
function fromEvent(target, eventName, options, resultSelector) {
    if (isFunction(options)) {
        resultSelector = options;
        options = undefined;
    }
    if (resultSelector) {
        return fromEvent(target, eventName, options).pipe(map(args => isArray(args) ? resultSelector(...args) : resultSelector(args)));
    }
    return new Observable(subscriber => {
        function handler(e) {
            if (arguments.length > 1) {
                subscriber.next(Array.prototype.slice.call(arguments));
            }
            else {
                subscriber.next(e);
            }
        }
        setupSubscription(target, eventName, handler, subscriber, options);
    });
}
function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
    let unsubscribe;
    if (isEventTarget(sourceObj)) {
        const source = sourceObj;
        sourceObj.addEventListener(eventName, handler, options);
        unsubscribe = () => source.removeEventListener(eventName, handler, options);
    }
    else if (isJQueryStyleEventEmitter(sourceObj)) {
        const source = sourceObj;
        sourceObj.on(eventName, handler);
        unsubscribe = () => source.off(eventName, handler);
    }
    else if (isNodeStyleEventEmitter(sourceObj)) {
        const source = sourceObj;
        sourceObj.addListener(eventName, handler);
        unsubscribe = () => source.removeListener(eventName, handler);
    }
    else if (sourceObj && sourceObj.length) {
        for (let i = 0, len = sourceObj.length; i < len; i++) {
            setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
        }
    }
    else {
        throw new TypeError('Invalid event target');
    }
    subscriber.add(unsubscribe);
}
function isNodeStyleEventEmitter(sourceObj) {
    return sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
}
function isJQueryStyleEventEmitter(sourceObj) {
    return sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
}
function isEventTarget(sourceObj) {
    return sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
}

function fromEventPattern(addHandler, removeHandler, resultSelector) {
    if (resultSelector) {
        return fromEventPattern(addHandler, removeHandler).pipe(map(args => isArray(args) ? resultSelector(...args) : resultSelector(args)));
    }
    return new Observable(subscriber => {
        const handler = (...e) => subscriber.next(e.length === 1 ? e[0] : e);
        let retValue;
        try {
            retValue = addHandler(handler);
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        if (!isFunction(removeHandler)) {
            return undefined;
        }
        return () => removeHandler(handler, retValue);
    });
}

function generate(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
    let resultSelector;
    let initialState;
    if (arguments.length == 1) {
        const options = initialStateOrOptions;
        initialState = options.initialState;
        condition = options.condition;
        iterate = options.iterate;
        resultSelector = options.resultSelector || identity;
        scheduler = options.scheduler;
    }
    else if (resultSelectorOrObservable === undefined || isScheduler(resultSelectorOrObservable)) {
        initialState = initialStateOrOptions;
        resultSelector = identity;
        scheduler = resultSelectorOrObservable;
    }
    else {
        initialState = initialStateOrOptions;
        resultSelector = resultSelectorOrObservable;
    }
    return new Observable(subscriber => {
        let state = initialState;
        if (scheduler) {
            return scheduler.schedule(dispatch$3, 0, {
                subscriber,
                iterate,
                condition,
                resultSelector,
                state
            });
        }
        do {
            if (condition) {
                let conditionResult;
                try {
                    conditionResult = condition(state);
                }
                catch (err) {
                    subscriber.error(err);
                    return undefined;
                }
                if (!conditionResult) {
                    subscriber.complete();
                    break;
                }
            }
            let value;
            try {
                value = resultSelector(state);
            }
            catch (err) {
                subscriber.error(err);
                return undefined;
            }
            subscriber.next(value);
            if (subscriber.closed) {
                break;
            }
            try {
                state = iterate(state);
            }
            catch (err) {
                subscriber.error(err);
                return undefined;
            }
        } while (true);
        return undefined;
    });
}
function dispatch$3(state) {
    const { subscriber, condition } = state;
    if (subscriber.closed) {
        return undefined;
    }
    if (state.needIterate) {
        try {
            state.state = state.iterate(state.state);
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
    }
    else {
        state.needIterate = true;
    }
    if (condition) {
        let conditionResult;
        try {
            conditionResult = condition(state.state);
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        if (!conditionResult) {
            subscriber.complete();
            return undefined;
        }
        if (subscriber.closed) {
            return undefined;
        }
    }
    let value;
    try {
        value = state.resultSelector(state.state);
    }
    catch (err) {
        subscriber.error(err);
        return undefined;
    }
    if (subscriber.closed) {
        return undefined;
    }
    subscriber.next(value);
    if (subscriber.closed) {
        return undefined;
    }
    return this.schedule(state);
}

function iif(condition, trueResult = EMPTY, falseResult = EMPTY) {
    return defer(() => condition() ? trueResult : falseResult);
}

function isNumeric(val) {
    return !isArray(val) && (val - parseFloat(val) + 1) >= 0;
}

function interval(period = 0, scheduler = async) {
    if (!isNumeric(period) || period < 0) {
        period = 0;
    }
    if (!scheduler || typeof scheduler.schedule !== 'function') {
        scheduler = async;
    }
    return new Observable(subscriber => {
        subscriber.add(scheduler.schedule(dispatch$4, period, { subscriber, counter: 0, period }));
        return subscriber;
    });
}
function dispatch$4(state) {
    const { subscriber, counter, period } = state;
    subscriber.next(counter);
    this.schedule({ subscriber, counter: counter + 1, period }, period);
}

function merge(...observables) {
    let concurrent = Number.POSITIVE_INFINITY;
    let scheduler = null;
    let last = observables[observables.length - 1];
    if (isScheduler(last)) {
        scheduler = observables.pop();
        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
            concurrent = observables.pop();
        }
    }
    else if (typeof last === 'number') {
        concurrent = observables.pop();
    }
    if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable) {
        return observables[0];
    }
    return mergeAll(concurrent)(fromArray(observables, scheduler));
}

const NEVER = new Observable(noop);
function never() {
    return NEVER;
}

function onErrorResumeNext(...sources) {
    if (sources.length === 0) {
        return EMPTY;
    }
    const [first, ...remainder] = sources;
    if (sources.length === 1 && isArray(first)) {
        return onErrorResumeNext(...first);
    }
    return new Observable(subscriber => {
        const subNext = () => subscriber.add(onErrorResumeNext(...remainder).subscribe(subscriber));
        return from(first).subscribe({
            next(value) { subscriber.next(value); },
            error: subNext,
            complete: subNext,
        });
    });
}

function pairs(obj, scheduler) {
    if (!scheduler) {
        return new Observable(subscriber => {
            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length && !subscriber.closed; i++) {
                const key = keys[i];
                if (obj.hasOwnProperty(key)) {
                    subscriber.next([key, obj[key]]);
                }
            }
            subscriber.complete();
        });
    }
    else {
        return new Observable(subscriber => {
            const keys = Object.keys(obj);
            const subscription = new Subscription();
            subscription.add(scheduler.schedule(dispatch$5, 0, { keys, index: 0, subscriber, subscription, obj }));
            return subscription;
        });
    }
}
function dispatch$5(state) {
    const { keys, index, subscriber, subscription, obj } = state;
    if (!subscriber.closed) {
        if (index < keys.length) {
            const key = keys[index];
            subscriber.next([key, obj[key]]);
            subscription.add(this.schedule({ keys, index: index + 1, subscriber, subscription, obj }));
        }
        else {
            subscriber.complete();
        }
    }
}

function not(pred, thisArg) {
    function notPred() {
        return !(notPred.pred.apply(notPred.thisArg, arguments));
    }
    notPred.pred = pred;
    notPred.thisArg = thisArg;
    return notPred;
}

function filter(predicate, thisArg) {
    return function filterOperatorFunction(source) {
        return source.lift(new FilterOperator(predicate, thisArg));
    };
}
class FilterOperator {
    constructor(predicate, thisArg) {
        this.predicate = predicate;
        this.thisArg = thisArg;
    }
    call(subscriber, source) {
        return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
    }
}
class FilterSubscriber extends Subscriber {
    constructor(destination, predicate, thisArg) {
        super(destination);
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.count = 0;
    }
    _next(value) {
        let result;
        try {
            result = this.predicate.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.destination.next(value);
        }
    }
}

function partition(source, predicate, thisArg) {
    return [
        filter(predicate, thisArg)(new Observable(subscribeTo(source))),
        filter(not(predicate, thisArg))(new Observable(subscribeTo(source)))
    ];
}

function race(...observables) {
    if (observables.length === 1) {
        if (isArray(observables[0])) {
            observables = observables[0];
        }
        else {
            return observables[0];
        }
    }
    return fromArray(observables, undefined).lift(new RaceOperator());
}
class RaceOperator {
    call(subscriber, source) {
        return source.subscribe(new RaceSubscriber(subscriber));
    }
}
class RaceSubscriber extends OuterSubscriber {
    constructor(destination) {
        super(destination);
        this.hasFirst = false;
        this.observables = [];
        this.subscriptions = [];
    }
    _next(observable) {
        this.observables.push(observable);
    }
    _complete() {
        const observables = this.observables;
        const len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            for (let i = 0; i < len && !this.hasFirst; i++) {
                let observable = observables[i];
                let subscription = subscribeToResult(this, observable, observable, i);
                if (this.subscriptions) {
                    this.subscriptions.push(subscription);
                }
                this.add(subscription);
            }
            this.observables = null;
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (!this.hasFirst) {
            this.hasFirst = true;
            for (let i = 0; i < this.subscriptions.length; i++) {
                if (i !== outerIndex) {
                    let subscription = this.subscriptions[i];
                    subscription.unsubscribe();
                    this.remove(subscription);
                }
            }
            this.subscriptions = null;
        }
        this.destination.next(innerValue);
    }
}

function range(start = 0, count, scheduler) {
    return new Observable(subscriber => {
        if (count === undefined) {
            count = start;
            start = 0;
        }
        let index = 0;
        let current = start;
        if (scheduler) {
            return scheduler.schedule(dispatch$6, 0, {
                index, count, start, subscriber
            });
        }
        else {
            do {
                if (index++ >= count) {
                    subscriber.complete();
                    break;
                }
                subscriber.next(current++);
                if (subscriber.closed) {
                    break;
                }
            } while (true);
        }
        return undefined;
    });
}
function dispatch$6(state) {
    const { start, index, count, subscriber } = state;
    if (index >= count) {
        subscriber.complete();
        return;
    }
    subscriber.next(start);
    if (subscriber.closed) {
        return;
    }
    state.index = index + 1;
    state.start = start + 1;
    this.schedule(state);
}

function timer(dueTime = 0, periodOrScheduler, scheduler) {
    let period = -1;
    if (isNumeric(periodOrScheduler)) {
        period = Number(periodOrScheduler) < 1 && 1 || Number(periodOrScheduler);
    }
    else if (isScheduler(periodOrScheduler)) {
        scheduler = periodOrScheduler;
    }
    if (!isScheduler(scheduler)) {
        scheduler = async;
    }
    return new Observable(subscriber => {
        const due = isNumeric(dueTime)
            ? dueTime
            : (+dueTime - scheduler.now());
        return scheduler.schedule(dispatch$7, due, {
            index: 0, period, subscriber
        });
    });
}
function dispatch$7(state) {
    const { index, period, subscriber } = state;
    subscriber.next(index);
    if (subscriber.closed) {
        return;
    }
    else if (period === -1) {
        return subscriber.complete();
    }
    state.index = index + 1;
    this.schedule(state, period);
}

function using(resourceFactory, observableFactory) {
    return new Observable(subscriber => {
        let resource;
        try {
            resource = resourceFactory();
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        let result;
        try {
            result = observableFactory(resource);
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        const source = result ? from(result) : EMPTY;
        const subscription = source.subscribe(subscriber);
        return () => {
            subscription.unsubscribe();
            if (resource) {
                resource.unsubscribe();
            }
        };
    });
}

function zip(...observables) {
    const resultSelector = observables[observables.length - 1];
    if (typeof resultSelector === 'function') {
        observables.pop();
    }
    return fromArray(observables, undefined).lift(new ZipOperator(resultSelector));
}
class ZipOperator {
    constructor(resultSelector) {
        this.resultSelector = resultSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new ZipSubscriber(subscriber, this.resultSelector));
    }
}
class ZipSubscriber extends Subscriber {
    constructor(destination, resultSelector, values = Object.create(null)) {
        super(destination);
        this.iterators = [];
        this.active = 0;
        this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : null;
        this.values = values;
    }
    _next(value) {
        const iterators = this.iterators;
        if (isArray(value)) {
            iterators.push(new StaticArrayIterator(value));
        }
        else if (typeof value[iterator] === 'function') {
            iterators.push(new StaticIterator(value[iterator]()));
        }
        else {
            iterators.push(new ZipBufferIterator(this.destination, this, value));
        }
    }
    _complete() {
        const iterators = this.iterators;
        const len = iterators.length;
        this.unsubscribe();
        if (len === 0) {
            this.destination.complete();
            return;
        }
        this.active = len;
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            if (iterator.stillUnsubscribed) {
                const destination = this.destination;
                destination.add(iterator.subscribe(iterator, i));
            }
            else {
                this.active--;
            }
        }
    }
    notifyInactive() {
        this.active--;
        if (this.active === 0) {
            this.destination.complete();
        }
    }
    checkIterators() {
        const iterators = this.iterators;
        const len = iterators.length;
        const destination = this.destination;
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
                return;
            }
        }
        let shouldComplete = false;
        const args = [];
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            let result = iterator.next();
            if (iterator.hasCompleted()) {
                shouldComplete = true;
            }
            if (result.done) {
                destination.complete();
                return;
            }
            args.push(result.value);
        }
        if (this.resultSelector) {
            this._tryresultSelector(args);
        }
        else {
            destination.next(args);
        }
        if (shouldComplete) {
            destination.complete();
        }
    }
    _tryresultSelector(args) {
        let result;
        try {
            result = this.resultSelector.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    }
}
class StaticIterator {
    constructor(iterator) {
        this.iterator = iterator;
        this.nextResult = iterator.next();
    }
    hasValue() {
        return true;
    }
    next() {
        const result = this.nextResult;
        this.nextResult = this.iterator.next();
        return result;
    }
    hasCompleted() {
        const nextResult = this.nextResult;
        return nextResult && nextResult.done;
    }
}
class StaticArrayIterator {
    constructor(array) {
        this.array = array;
        this.index = 0;
        this.length = 0;
        this.length = array.length;
    }
    [iterator]() {
        return this;
    }
    next(value) {
        const i = this.index++;
        const array = this.array;
        return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
    }
    hasValue() {
        return this.array.length > this.index;
    }
    hasCompleted() {
        return this.array.length === this.index;
    }
}
class ZipBufferIterator extends OuterSubscriber {
    constructor(destination, parent, observable) {
        super(destination);
        this.parent = parent;
        this.observable = observable;
        this.stillUnsubscribed = true;
        this.buffer = [];
        this.isComplete = false;
    }
    [iterator]() {
        return this;
    }
    next() {
        const buffer = this.buffer;
        if (buffer.length === 0 && this.isComplete) {
            return { value: null, done: true };
        }
        else {
            return { value: buffer.shift(), done: false };
        }
    }
    hasValue() {
        return this.buffer.length > 0;
    }
    hasCompleted() {
        return this.buffer.length === 0 && this.isComplete;
    }
    notifyComplete() {
        if (this.buffer.length > 0) {
            this.isComplete = true;
            this.parent.notifyInactive();
        }
        else {
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.buffer.push(innerValue);
        this.parent.checkIterators();
    }
    subscribe(value, index) {
        return subscribeToResult(this, this.observable, this, index);
    }
}

function audit(durationSelector) {
    return function auditOperatorFunction(source) {
        return source.lift(new AuditOperator(durationSelector));
    };
}
class AuditOperator {
    constructor(durationSelector) {
        this.durationSelector = durationSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new AuditSubscriber(subscriber, this.durationSelector));
    }
}
class AuditSubscriber extends OuterSubscriber {
    constructor(destination, durationSelector) {
        super(destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
    }
    _next(value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
            let duration;
            try {
                const { durationSelector } = this;
                duration = durationSelector(value);
            }
            catch (err) {
                return this.destination.error(err);
            }
            const innerSubscription = subscribeToResult(this, duration);
            if (!innerSubscription || innerSubscription.closed) {
                this.clearThrottle();
            }
            else {
                this.add(this.throttled = innerSubscription);
            }
        }
    }
    clearThrottle() {
        const { value, hasValue, throttled } = this;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
        if (hasValue) {
            this.value = null;
            this.hasValue = false;
            this.destination.next(value);
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex) {
        this.clearThrottle();
    }
    notifyComplete() {
        this.clearThrottle();
    }
}

function auditTime(duration, scheduler = async) {
    return audit(() => timer(duration, scheduler));
}

function buffer(closingNotifier) {
    return function bufferOperatorFunction(source) {
        return source.lift(new BufferOperator(closingNotifier));
    };
}
class BufferOperator {
    constructor(closingNotifier) {
        this.closingNotifier = closingNotifier;
    }
    call(subscriber, source) {
        return source.subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
    }
}
class BufferSubscriber extends OuterSubscriber {
    constructor(destination, closingNotifier) {
        super(destination);
        this.buffer = [];
        this.add(subscribeToResult(this, closingNotifier));
    }
    _next(value) {
        this.buffer.push(value);
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const buffer = this.buffer;
        this.buffer = [];
        this.destination.next(buffer);
    }
}

function bufferCount(bufferSize, startBufferEvery = null) {
    return function bufferCountOperatorFunction(source) {
        return source.lift(new BufferCountOperator(bufferSize, startBufferEvery));
    };
}
class BufferCountOperator {
    constructor(bufferSize, startBufferEvery) {
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        if (!startBufferEvery || bufferSize === startBufferEvery) {
            this.subscriberClass = BufferCountSubscriber;
        }
        else {
            this.subscriberClass = BufferSkipCountSubscriber;
        }
    }
    call(subscriber, source) {
        return source.subscribe(new this.subscriberClass(subscriber, this.bufferSize, this.startBufferEvery));
    }
}
class BufferCountSubscriber extends Subscriber {
    constructor(destination, bufferSize) {
        super(destination);
        this.bufferSize = bufferSize;
        this.buffer = [];
    }
    _next(value) {
        const buffer = this.buffer;
        buffer.push(value);
        if (buffer.length == this.bufferSize) {
            this.destination.next(buffer);
            this.buffer = [];
        }
    }
    _complete() {
        const buffer = this.buffer;
        if (buffer.length > 0) {
            this.destination.next(buffer);
        }
        super._complete();
    }
}
class BufferSkipCountSubscriber extends Subscriber {
    constructor(destination, bufferSize, startBufferEvery) {
        super(destination);
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        this.buffers = [];
        this.count = 0;
    }
    _next(value) {
        const { bufferSize, startBufferEvery, buffers, count } = this;
        this.count++;
        if (count % startBufferEvery === 0) {
            buffers.push([]);
        }
        for (let i = buffers.length; i--;) {
            const buffer = buffers[i];
            buffer.push(value);
            if (buffer.length === bufferSize) {
                buffers.splice(i, 1);
                this.destination.next(buffer);
            }
        }
    }
    _complete() {
        const { buffers, destination } = this;
        while (buffers.length > 0) {
            let buffer = buffers.shift();
            if (buffer.length > 0) {
                destination.next(buffer);
            }
        }
        super._complete();
    }
}

function bufferTime(bufferTimeSpan) {
    let length = arguments.length;
    let scheduler = async;
    if (isScheduler(arguments[arguments.length - 1])) {
        scheduler = arguments[arguments.length - 1];
        length--;
    }
    let bufferCreationInterval = null;
    if (length >= 2) {
        bufferCreationInterval = arguments[1];
    }
    let maxBufferSize = Number.POSITIVE_INFINITY;
    if (length >= 3) {
        maxBufferSize = arguments[2];
    }
    return function bufferTimeOperatorFunction(source) {
        return source.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
    };
}
class BufferTimeOperator {
    constructor(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.maxBufferSize = maxBufferSize;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
    }
}
class Context {
    constructor() {
        this.buffer = [];
    }
}
class BufferTimeSubscriber extends Subscriber {
    constructor(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        super(destination);
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.maxBufferSize = maxBufferSize;
        this.scheduler = scheduler;
        this.contexts = [];
        const context = this.openContext();
        this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
        if (this.timespanOnly) {
            const timeSpanOnlyState = { subscriber: this, context, bufferTimeSpan };
            this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
        else {
            const closeState = { subscriber: this, context };
            const creationState = { bufferTimeSpan, bufferCreationInterval, subscriber: this, scheduler };
            this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
            this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
        }
    }
    _next(value) {
        const contexts = this.contexts;
        const len = contexts.length;
        let filledBufferContext;
        for (let i = 0; i < len; i++) {
            const context = contexts[i];
            const buffer = context.buffer;
            buffer.push(value);
            if (buffer.length == this.maxBufferSize) {
                filledBufferContext = context;
            }
        }
        if (filledBufferContext) {
            this.onBufferFull(filledBufferContext);
        }
    }
    _error(err) {
        this.contexts.length = 0;
        super._error(err);
    }
    _complete() {
        const { contexts, destination } = this;
        while (contexts.length > 0) {
            const context = contexts.shift();
            destination.next(context.buffer);
        }
        super._complete();
    }
    _unsubscribe() {
        this.contexts = null;
    }
    onBufferFull(context) {
        this.closeContext(context);
        const closeAction = context.closeAction;
        closeAction.unsubscribe();
        this.remove(closeAction);
        if (!this.closed && this.timespanOnly) {
            context = this.openContext();
            const bufferTimeSpan = this.bufferTimeSpan;
            const timeSpanOnlyState = { subscriber: this, context, bufferTimeSpan };
            this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
    }
    openContext() {
        const context = new Context();
        this.contexts.push(context);
        return context;
    }
    closeContext(context) {
        this.destination.next(context.buffer);
        const contexts = this.contexts;
        const spliceIndex = contexts ? contexts.indexOf(context) : -1;
        if (spliceIndex >= 0) {
            contexts.splice(contexts.indexOf(context), 1);
        }
    }
}
function dispatchBufferTimeSpanOnly(state) {
    const subscriber = state.subscriber;
    const prevContext = state.context;
    if (prevContext) {
        subscriber.closeContext(prevContext);
    }
    if (!subscriber.closed) {
        state.context = subscriber.openContext();
        state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
    }
}
function dispatchBufferCreation(state) {
    const { bufferCreationInterval, bufferTimeSpan, subscriber, scheduler } = state;
    const context = subscriber.openContext();
    const action = this;
    if (!subscriber.closed) {
        subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber, context }));
        action.schedule(state, bufferCreationInterval);
    }
}
function dispatchBufferClose(arg) {
    const { subscriber, context } = arg;
    subscriber.closeContext(context);
}

function bufferToggle(openings, closingSelector) {
    return function bufferToggleOperatorFunction(source) {
        return source.lift(new BufferToggleOperator(openings, closingSelector));
    };
}
class BufferToggleOperator {
    constructor(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
    }
}
class BufferToggleSubscriber extends OuterSubscriber {
    constructor(destination, openings, closingSelector) {
        super(destination);
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(subscribeToResult(this, openings));
    }
    _next(value) {
        const contexts = this.contexts;
        const len = contexts.length;
        for (let i = 0; i < len; i++) {
            contexts[i].buffer.push(value);
        }
    }
    _error(err) {
        const contexts = this.contexts;
        while (contexts.length > 0) {
            const context = contexts.shift();
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        super._error(err);
    }
    _complete() {
        const contexts = this.contexts;
        while (contexts.length > 0) {
            const context = contexts.shift();
            this.destination.next(context.buffer);
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        super._complete();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
    }
    notifyComplete(innerSub) {
        this.closeBuffer(innerSub.context);
    }
    openBuffer(value) {
        try {
            const closingSelector = this.closingSelector;
            const closingNotifier = closingSelector.call(this, value);
            if (closingNotifier) {
                this.trySubscribe(closingNotifier);
            }
        }
        catch (err) {
            this._error(err);
        }
    }
    closeBuffer(context) {
        const contexts = this.contexts;
        if (contexts && context) {
            const { buffer, subscription } = context;
            this.destination.next(buffer);
            contexts.splice(contexts.indexOf(context), 1);
            this.remove(subscription);
            subscription.unsubscribe();
        }
    }
    trySubscribe(closingNotifier) {
        const contexts = this.contexts;
        const buffer = [];
        const subscription = new Subscription();
        const context = { buffer, subscription };
        contexts.push(context);
        const innerSubscription = subscribeToResult(this, closingNotifier, context);
        if (!innerSubscription || innerSubscription.closed) {
            this.closeBuffer(context);
        }
        else {
            innerSubscription.context = context;
            this.add(innerSubscription);
            subscription.add(innerSubscription);
        }
    }
}

function bufferWhen(closingSelector) {
    return function (source) {
        return source.lift(new BufferWhenOperator(closingSelector));
    };
}
class BufferWhenOperator {
    constructor(closingSelector) {
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
    }
}
class BufferWhenSubscriber extends OuterSubscriber {
    constructor(destination, closingSelector) {
        super(destination);
        this.closingSelector = closingSelector;
        this.subscribing = false;
        this.openBuffer();
    }
    _next(value) {
        this.buffer.push(value);
    }
    _complete() {
        const buffer = this.buffer;
        if (buffer) {
            this.destination.next(buffer);
        }
        super._complete();
    }
    _unsubscribe() {
        this.buffer = null;
        this.subscribing = false;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openBuffer();
    }
    notifyComplete() {
        if (this.subscribing) {
            this.complete();
        }
        else {
            this.openBuffer();
        }
    }
    openBuffer() {
        let { closingSubscription } = this;
        if (closingSubscription) {
            this.remove(closingSubscription);
            closingSubscription.unsubscribe();
        }
        const buffer = this.buffer;
        if (this.buffer) {
            this.destination.next(buffer);
        }
        this.buffer = [];
        let closingNotifier;
        try {
            const { closingSelector } = this;
            closingNotifier = closingSelector();
        }
        catch (err) {
            return this.error(err);
        }
        closingSubscription = new Subscription();
        this.closingSubscription = closingSubscription;
        this.add(closingSubscription);
        this.subscribing = true;
        closingSubscription.add(subscribeToResult(this, closingNotifier));
        this.subscribing = false;
    }
}

function catchError(selector) {
    return function catchErrorOperatorFunction(source) {
        const operator = new CatchOperator(selector);
        const caught = source.lift(operator);
        return (operator.caught = caught);
    };
}
class CatchOperator {
    constructor(selector) {
        this.selector = selector;
    }
    call(subscriber, source) {
        return source.subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
    }
}
class CatchSubscriber extends OuterSubscriber {
    constructor(destination, selector, caught) {
        super(destination);
        this.selector = selector;
        this.caught = caught;
    }
    error(err) {
        if (!this.isStopped) {
            let result;
            try {
                result = this.selector(err, this.caught);
            }
            catch (err2) {
                super.error(err2);
                return;
            }
            this._unsubscribeAndRecycle();
            const innerSubscriber = new InnerSubscriber(this, undefined, undefined);
            this.add(innerSubscriber);
            const innerSubscription = subscribeToResult(this, result, undefined, undefined, innerSubscriber);
            if (innerSubscription !== innerSubscriber) {
                this.add(innerSubscription);
            }
        }
    }
}

function combineAll(project) {
    return (source) => source.lift(new CombineLatestOperator(project));
}

const none = {};
function combineLatest$1(...observables) {
    let project = null;
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    if (observables.length === 1 && isArray(observables[0])) {
        observables = observables[0].slice();
    }
    return (source) => source.lift.call(from([source, ...observables]), new CombineLatestOperator(project));
}

function concat$1(...observables) {
    return (source) => source.lift.call(concat(source, ...observables));
}

function concatMap(project, resultSelector) {
    return mergeMap(project, resultSelector, 1);
}

function concatMapTo(innerObservable, resultSelector) {
    return concatMap(() => innerObservable, resultSelector);
}

function count(predicate) {
    return (source) => source.lift(new CountOperator(predicate, source));
}
class CountOperator {
    constructor(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    call(subscriber, source) {
        return source.subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
    }
}
class CountSubscriber extends Subscriber {
    constructor(destination, predicate, source) {
        super(destination);
        this.predicate = predicate;
        this.source = source;
        this.count = 0;
        this.index = 0;
    }
    _next(value) {
        if (this.predicate) {
            this._tryPredicate(value);
        }
        else {
            this.count++;
        }
    }
    _tryPredicate(value) {
        let result;
        try {
            result = this.predicate(value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.count++;
        }
    }
    _complete() {
        this.destination.next(this.count);
        this.destination.complete();
    }
}

function debounce(durationSelector) {
    return (source) => source.lift(new DebounceOperator(durationSelector));
}
class DebounceOperator {
    constructor(durationSelector) {
        this.durationSelector = durationSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
    }
}
class DebounceSubscriber extends OuterSubscriber {
    constructor(destination, durationSelector) {
        super(destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
        this.durationSubscription = null;
    }
    _next(value) {
        try {
            const result = this.durationSelector.call(this, value);
            if (result) {
                this._tryNext(value, result);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    }
    _complete() {
        this.emitValue();
        this.destination.complete();
    }
    _tryNext(value, duration) {
        let subscription = this.durationSubscription;
        this.value = value;
        this.hasValue = true;
        if (subscription) {
            subscription.unsubscribe();
            this.remove(subscription);
        }
        subscription = subscribeToResult(this, duration);
        if (subscription && !subscription.closed) {
            this.add(this.durationSubscription = subscription);
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    }
    notifyComplete() {
        this.emitValue();
    }
    emitValue() {
        if (this.hasValue) {
            const value = this.value;
            const subscription = this.durationSubscription;
            if (subscription) {
                this.durationSubscription = null;
                subscription.unsubscribe();
                this.remove(subscription);
            }
            this.value = null;
            this.hasValue = false;
            super._next(value);
        }
    }
}

function debounceTime(dueTime, scheduler = async) {
    return (source) => source.lift(new DebounceTimeOperator(dueTime, scheduler));
}
class DebounceTimeOperator {
    constructor(dueTime, scheduler) {
        this.dueTime = dueTime;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
    }
}
class DebounceTimeSubscriber extends Subscriber {
    constructor(destination, dueTime, scheduler) {
        super(destination);
        this.dueTime = dueTime;
        this.scheduler = scheduler;
        this.debouncedSubscription = null;
        this.lastValue = null;
        this.hasValue = false;
    }
    _next(value) {
        this.clearDebounce();
        this.lastValue = value;
        this.hasValue = true;
        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext$2, this.dueTime, this));
    }
    _complete() {
        this.debouncedNext();
        this.destination.complete();
    }
    debouncedNext() {
        this.clearDebounce();
        if (this.hasValue) {
            const { lastValue } = this;
            this.lastValue = null;
            this.hasValue = false;
            this.destination.next(lastValue);
        }
    }
    clearDebounce() {
        const debouncedSubscription = this.debouncedSubscription;
        if (debouncedSubscription !== null) {
            this.remove(debouncedSubscription);
            debouncedSubscription.unsubscribe();
            this.debouncedSubscription = null;
        }
    }
}
function dispatchNext$2(subscriber) {
    subscriber.debouncedNext();
}

function defaultIfEmpty(defaultValue = null) {
    return (source) => source.lift(new DefaultIfEmptyOperator(defaultValue));
}
class DefaultIfEmptyOperator {
    constructor(defaultValue) {
        this.defaultValue = defaultValue;
    }
    call(subscriber, source) {
        return source.subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
    }
}
class DefaultIfEmptySubscriber extends Subscriber {
    constructor(destination, defaultValue) {
        super(destination);
        this.defaultValue = defaultValue;
        this.isEmpty = true;
    }
    _next(value) {
        this.isEmpty = false;
        this.destination.next(value);
    }
    _complete() {
        if (this.isEmpty) {
            this.destination.next(this.defaultValue);
        }
        this.destination.complete();
    }
}

function isDate(value) {
    return value instanceof Date && !isNaN(+value);
}

function delay(delay, scheduler = async) {
    const absoluteDelay = isDate(delay);
    const delayFor = absoluteDelay ? (+delay - scheduler.now()) : Math.abs(delay);
    return (source) => source.lift(new DelayOperator(delayFor, scheduler));
}
class DelayOperator {
    constructor(delay, scheduler) {
        this.delay = delay;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
    }
}
class DelaySubscriber extends Subscriber {
    constructor(destination, delay, scheduler) {
        super(destination);
        this.delay = delay;
        this.scheduler = scheduler;
        this.queue = [];
        this.active = false;
        this.errored = false;
    }
    static dispatch(state) {
        const source = state.source;
        const queue = source.queue;
        const scheduler = state.scheduler;
        const destination = state.destination;
        while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
            queue.shift().notification.observe(destination);
        }
        if (queue.length > 0) {
            const delay = Math.max(0, queue[0].time - scheduler.now());
            this.schedule(state, delay);
        }
        else {
            this.unsubscribe();
            source.active = false;
        }
    }
    _schedule(scheduler) {
        this.active = true;
        const destination = this.destination;
        destination.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
            source: this, destination: this.destination, scheduler: scheduler
        }));
    }
    scheduleNotification(notification) {
        if (this.errored === true) {
            return;
        }
        const scheduler = this.scheduler;
        const message = new DelayMessage(scheduler.now() + this.delay, notification);
        this.queue.push(message);
        if (this.active === false) {
            this._schedule(scheduler);
        }
    }
    _next(value) {
        this.scheduleNotification(Notification.createNext(value));
    }
    _error(err) {
        this.errored = true;
        this.queue = [];
        this.destination.error(err);
        this.unsubscribe();
    }
    _complete() {
        this.scheduleNotification(Notification.createComplete());
        this.unsubscribe();
    }
}
class DelayMessage {
    constructor(time, notification) {
        this.time = time;
        this.notification = notification;
    }
}

function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
        return (source) => new SubscriptionDelayObservable(source, subscriptionDelay)
            .lift(new DelayWhenOperator(delayDurationSelector));
    }
    return (source) => source.lift(new DelayWhenOperator(delayDurationSelector));
}
class DelayWhenOperator {
    constructor(delayDurationSelector) {
        this.delayDurationSelector = delayDurationSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
    }
}
class DelayWhenSubscriber extends OuterSubscriber {
    constructor(destination, delayDurationSelector) {
        super(destination);
        this.delayDurationSelector = delayDurationSelector;
        this.completed = false;
        this.delayNotifierSubscriptions = [];
        this.index = 0;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(outerValue);
        this.removeSubscription(innerSub);
        this.tryComplete();
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    notifyComplete(innerSub) {
        const value = this.removeSubscription(innerSub);
        if (value) {
            this.destination.next(value);
        }
        this.tryComplete();
    }
    _next(value) {
        const index = this.index++;
        try {
            const delayNotifier = this.delayDurationSelector(value, index);
            if (delayNotifier) {
                this.tryDelay(delayNotifier, value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    }
    _complete() {
        this.completed = true;
        this.tryComplete();
        this.unsubscribe();
    }
    removeSubscription(subscription) {
        subscription.unsubscribe();
        const subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
        if (subscriptionIdx !== -1) {
            this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
        }
        return subscription.outerValue;
    }
    tryDelay(delayNotifier, value) {
        const notifierSubscription = subscribeToResult(this, delayNotifier, value);
        if (notifierSubscription && !notifierSubscription.closed) {
            const destination = this.destination;
            destination.add(notifierSubscription);
            this.delayNotifierSubscriptions.push(notifierSubscription);
        }
    }
    tryComplete() {
        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
            this.destination.complete();
        }
    }
}
class SubscriptionDelayObservable extends Observable {
    constructor(source, subscriptionDelay) {
        super();
        this.source = source;
        this.subscriptionDelay = subscriptionDelay;
    }
    _subscribe(subscriber) {
        this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
    }
}
class SubscriptionDelaySubscriber extends Subscriber {
    constructor(parent, source) {
        super();
        this.parent = parent;
        this.source = source;
        this.sourceSubscribed = false;
    }
    _next(unused) {
        this.subscribeToSource();
    }
    _error(err) {
        this.unsubscribe();
        this.parent.error(err);
    }
    _complete() {
        this.unsubscribe();
        this.subscribeToSource();
    }
    subscribeToSource() {
        if (!this.sourceSubscribed) {
            this.sourceSubscribed = true;
            this.unsubscribe();
            this.source.subscribe(this.parent);
        }
    }
}

function dematerialize() {
    return function dematerializeOperatorFunction(source) {
        return source.lift(new DeMaterializeOperator());
    };
}
class DeMaterializeOperator {
    call(subscriber, source) {
        return source.subscribe(new DeMaterializeSubscriber(subscriber));
    }
}
class DeMaterializeSubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
    }
    _next(value) {
        value.observe(this.destination);
    }
}

function distinct(keySelector, flushes) {
    return (source) => source.lift(new DistinctOperator(keySelector, flushes));
}
class DistinctOperator {
    constructor(keySelector, flushes) {
        this.keySelector = keySelector;
        this.flushes = flushes;
    }
    call(subscriber, source) {
        return source.subscribe(new DistinctSubscriber(subscriber, this.keySelector, this.flushes));
    }
}
class DistinctSubscriber extends OuterSubscriber {
    constructor(destination, keySelector, flushes) {
        super(destination);
        this.keySelector = keySelector;
        this.values = new Set();
        if (flushes) {
            this.add(subscribeToResult(this, flushes));
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values.clear();
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    _next(value) {
        if (this.keySelector) {
            this._useKeySelector(value);
        }
        else {
            this._finalizeNext(value, value);
        }
    }
    _useKeySelector(value) {
        let key;
        const { destination } = this;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this._finalizeNext(key, value);
    }
    _finalizeNext(key, value) {
        const { values } = this;
        if (!values.has(key)) {
            values.add(key);
            this.destination.next(value);
        }
    }
}

function distinctUntilChanged(compare, keySelector) {
    return (source) => source.lift(new DistinctUntilChangedOperator(compare, keySelector));
}
class DistinctUntilChangedOperator {
    constructor(compare, keySelector) {
        this.compare = compare;
        this.keySelector = keySelector;
    }
    call(subscriber, source) {
        return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
    }
}
class DistinctUntilChangedSubscriber extends Subscriber {
    constructor(destination, compare, keySelector) {
        super(destination);
        this.keySelector = keySelector;
        this.hasKey = false;
        if (typeof compare === 'function') {
            this.compare = compare;
        }
    }
    compare(x, y) {
        return x === y;
    }
    _next(value) {
        let key;
        try {
            const { keySelector } = this;
            key = keySelector ? keySelector(value) : value;
        }
        catch (err) {
            return this.destination.error(err);
        }
        let result = false;
        if (this.hasKey) {
            try {
                const { compare } = this;
                result = compare(this.key, key);
            }
            catch (err) {
                return this.destination.error(err);
            }
        }
        else {
            this.hasKey = true;
        }
        if (!result) {
            this.key = key;
            this.destination.next(value);
        }
    }
}

function distinctUntilKeyChanged(key, compare) {
    return distinctUntilChanged((x, y) => compare ? compare(x[key], y[key]) : x[key] === y[key]);
}

function throwIfEmpty(errorFactory = defaultErrorFactory) {
    return (source) => {
        return source.lift(new ThrowIfEmptyOperator(errorFactory));
    };
}
class ThrowIfEmptyOperator {
    constructor(errorFactory) {
        this.errorFactory = errorFactory;
    }
    call(subscriber, source) {
        return source.subscribe(new ThrowIfEmptySubscriber(subscriber, this.errorFactory));
    }
}
class ThrowIfEmptySubscriber extends Subscriber {
    constructor(destination, errorFactory) {
        super(destination);
        this.errorFactory = errorFactory;
        this.hasValue = false;
    }
    _next(value) {
        this.hasValue = true;
        this.destination.next(value);
    }
    _complete() {
        if (!this.hasValue) {
            let err;
            try {
                err = this.errorFactory();
            }
            catch (e) {
                err = e;
            }
            this.destination.error(err);
        }
        else {
            return this.destination.complete();
        }
    }
}
function defaultErrorFactory() {
    return new EmptyError();
}

function take(count) {
    return (source) => {
        if (count === 0) {
            return empty$1();
        }
        else {
            return source.lift(new TakeOperator(count));
        }
    };
}
class TakeOperator {
    constructor(total) {
        this.total = total;
        if (this.total < 0) {
            throw new ArgumentOutOfRangeError;
        }
    }
    call(subscriber, source) {
        return source.subscribe(new TakeSubscriber(subscriber, this.total));
    }
}
class TakeSubscriber extends Subscriber {
    constructor(destination, total) {
        super(destination);
        this.total = total;
        this.count = 0;
    }
    _next(value) {
        const total = this.total;
        const count = ++this.count;
        if (count <= total) {
            this.destination.next(value);
            if (count === total) {
                this.destination.complete();
                this.unsubscribe();
            }
        }
    }
}

function elementAt(index, defaultValue) {
    if (index < 0) {
        throw new ArgumentOutOfRangeError();
    }
    const hasDefaultValue = arguments.length >= 2;
    return (source) => source.pipe(filter((v, i) => i === index), take(1), hasDefaultValue
        ? defaultIfEmpty(defaultValue)
        : throwIfEmpty(() => new ArgumentOutOfRangeError()));
}

function endWith(...array) {
    return (source) => concat(source, of(...array));
}

function every(predicate, thisArg) {
    return (source) => source.lift(new EveryOperator(predicate, thisArg, source));
}
class EveryOperator {
    constructor(predicate, thisArg, source) {
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
    }
    call(observer, source) {
        return source.subscribe(new EverySubscriber(observer, this.predicate, this.thisArg, this.source));
    }
}
class EverySubscriber extends Subscriber {
    constructor(destination, predicate, thisArg, source) {
        super(destination);
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
        this.index = 0;
        this.thisArg = thisArg || this;
    }
    notifyComplete(everyValueMatch) {
        this.destination.next(everyValueMatch);
        this.destination.complete();
    }
    _next(value) {
        let result = false;
        try {
            result = this.predicate.call(this.thisArg, value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (!result) {
            this.notifyComplete(false);
        }
    }
    _complete() {
        this.notifyComplete(true);
    }
}

function exhaust() {
    return (source) => source.lift(new SwitchFirstOperator());
}
class SwitchFirstOperator {
    call(subscriber, source) {
        return source.subscribe(new SwitchFirstSubscriber(subscriber));
    }
}
class SwitchFirstSubscriber extends OuterSubscriber {
    constructor(destination) {
        super(destination);
        this.hasCompleted = false;
        this.hasSubscription = false;
    }
    _next(value) {
        if (!this.hasSubscription) {
            this.hasSubscription = true;
            this.add(subscribeToResult(this, value));
        }
    }
    _complete() {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
    }
    notifyComplete(innerSub) {
        this.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    }
}

function exhaustMap(project, resultSelector) {
    if (resultSelector) {
        return (source) => source.pipe(exhaustMap((a, i) => from(project(a, i)).pipe(map((b, ii) => resultSelector(a, b, i, ii)))));
    }
    return (source) => source.lift(new ExhaustMapOperator(project));
}
class ExhaustMapOperator {
    constructor(project) {
        this.project = project;
    }
    call(subscriber, source) {
        return source.subscribe(new ExhaustMapSubscriber(subscriber, this.project));
    }
}
class ExhaustMapSubscriber extends OuterSubscriber {
    constructor(destination, project) {
        super(destination);
        this.project = project;
        this.hasSubscription = false;
        this.hasCompleted = false;
        this.index = 0;
    }
    _next(value) {
        if (!this.hasSubscription) {
            this.tryNext(value);
        }
    }
    tryNext(value) {
        let result;
        const index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.hasSubscription = true;
        this._innerSub(result, value, index);
    }
    _innerSub(result, value, index) {
        const innerSubscriber = new InnerSubscriber(this, value, index);
        const destination = this.destination;
        destination.add(innerSubscriber);
        const innerSubscription = subscribeToResult(this, result, undefined, undefined, innerSubscriber);
        if (innerSubscription !== innerSubscriber) {
            destination.add(innerSubscription);
        }
    }
    _complete() {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
        this.unsubscribe();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    }
    notifyError(err) {
        this.destination.error(err);
    }
    notifyComplete(innerSub) {
        const destination = this.destination;
        destination.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    }
}

function expand(project, concurrent = Number.POSITIVE_INFINITY, scheduler = undefined) {
    concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
    return (source) => source.lift(new ExpandOperator(project, concurrent, scheduler));
}
class ExpandOperator {
    constructor(project, concurrent, scheduler) {
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
    }
}
class ExpandSubscriber extends OuterSubscriber {
    constructor(destination, project, concurrent, scheduler) {
        super(destination);
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
        this.index = 0;
        this.active = 0;
        this.hasCompleted = false;
        if (concurrent < Number.POSITIVE_INFINITY) {
            this.buffer = [];
        }
    }
    static dispatch(arg) {
        const { subscriber, result, value, index } = arg;
        subscriber.subscribeToProjection(result, value, index);
    }
    _next(value) {
        const destination = this.destination;
        if (destination.closed) {
            this._complete();
            return;
        }
        const index = this.index++;
        if (this.active < this.concurrent) {
            destination.next(value);
            try {
                const { project } = this;
                const result = project(value, index);
                if (!this.scheduler) {
                    this.subscribeToProjection(result, value, index);
                }
                else {
                    const state = { subscriber: this, result, value, index };
                    const destination = this.destination;
                    destination.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
                }
            }
            catch (e) {
                destination.error(e);
            }
        }
        else {
            this.buffer.push(value);
        }
    }
    subscribeToProjection(result, value, index) {
        this.active++;
        const destination = this.destination;
        destination.add(subscribeToResult(this, result, value, index));
    }
    _complete() {
        this.hasCompleted = true;
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
        this.unsubscribe();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this._next(innerValue);
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        const destination = this.destination;
        destination.remove(innerSub);
        this.active--;
        if (buffer && buffer.length > 0) {
            this._next(buffer.shift());
        }
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    }
}

function finalize(callback) {
    return (source) => source.lift(new FinallyOperator(callback));
}
class FinallyOperator {
    constructor(callback) {
        this.callback = callback;
    }
    call(subscriber, source) {
        return source.subscribe(new FinallySubscriber(subscriber, this.callback));
    }
}
class FinallySubscriber extends Subscriber {
    constructor(destination, callback) {
        super(destination);
        this.add(new Subscription(callback));
    }
}

function find(predicate, thisArg) {
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate is not a function');
    }
    return (source) => source.lift(new FindValueOperator(predicate, source, false, thisArg));
}
class FindValueOperator {
    constructor(predicate, source, yieldIndex, thisArg) {
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
    }
    call(observer, source) {
        return source.subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
    }
}
class FindValueSubscriber extends Subscriber {
    constructor(destination, predicate, source, yieldIndex, thisArg) {
        super(destination);
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
        this.index = 0;
    }
    notifyComplete(value) {
        const destination = this.destination;
        destination.next(value);
        destination.complete();
        this.unsubscribe();
    }
    _next(value) {
        const { predicate, thisArg } = this;
        const index = this.index++;
        try {
            const result = predicate.call(thisArg || this, value, index, this.source);
            if (result) {
                this.notifyComplete(this.yieldIndex ? index : value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    }
    _complete() {
        this.notifyComplete(this.yieldIndex ? -1 : undefined);
    }
}

function findIndex(predicate, thisArg) {
    return (source) => source.lift(new FindValueOperator(predicate, source, true, thisArg));
}

function first(predicate, defaultValue) {
    const hasDefaultValue = arguments.length >= 2;
    return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
}

function ignoreElements() {
    return function ignoreElementsOperatorFunction(source) {
        return source.lift(new IgnoreElementsOperator());
    };
}
class IgnoreElementsOperator {
    call(subscriber, source) {
        return source.subscribe(new IgnoreElementsSubscriber(subscriber));
    }
}
class IgnoreElementsSubscriber extends Subscriber {
    _next(unused) {
    }
}

function isEmpty() {
    return (source) => source.lift(new IsEmptyOperator());
}
class IsEmptyOperator {
    call(observer, source) {
        return source.subscribe(new IsEmptySubscriber(observer));
    }
}
class IsEmptySubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
    }
    notifyComplete(isEmpty) {
        const destination = this.destination;
        destination.next(isEmpty);
        destination.complete();
    }
    _next(value) {
        this.notifyComplete(false);
    }
    _complete() {
        this.notifyComplete(true);
    }
}

function takeLast(count) {
    return function takeLastOperatorFunction(source) {
        if (count === 0) {
            return empty$1();
        }
        else {
            return source.lift(new TakeLastOperator(count));
        }
    };
}
class TakeLastOperator {
    constructor(total) {
        this.total = total;
        if (this.total < 0) {
            throw new ArgumentOutOfRangeError;
        }
    }
    call(subscriber, source) {
        return source.subscribe(new TakeLastSubscriber(subscriber, this.total));
    }
}
class TakeLastSubscriber extends Subscriber {
    constructor(destination, total) {
        super(destination);
        this.total = total;
        this.ring = new Array();
        this.count = 0;
    }
    _next(value) {
        const ring = this.ring;
        const total = this.total;
        const count = this.count++;
        if (ring.length < total) {
            ring.push(value);
        }
        else {
            const index = count % total;
            ring[index] = value;
        }
    }
    _complete() {
        const destination = this.destination;
        let count = this.count;
        if (count > 0) {
            const total = this.count >= this.total ? this.total : this.count;
            const ring = this.ring;
            for (let i = 0; i < total; i++) {
                const idx = (count++) % total;
                destination.next(ring[idx]);
            }
        }
        destination.complete();
    }
}

function last(predicate, defaultValue) {
    const hasDefaultValue = arguments.length >= 2;
    return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, takeLast(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
}

function mapTo(value) {
    return (source) => source.lift(new MapToOperator(value));
}
class MapToOperator {
    constructor(value) {
        this.value = value;
    }
    call(subscriber, source) {
        return source.subscribe(new MapToSubscriber(subscriber, this.value));
    }
}
class MapToSubscriber extends Subscriber {
    constructor(destination, value) {
        super(destination);
        this.value = value;
    }
    _next(x) {
        this.destination.next(this.value);
    }
}

function materialize() {
    return function materializeOperatorFunction(source) {
        return source.lift(new MaterializeOperator());
    };
}
class MaterializeOperator {
    call(subscriber, source) {
        return source.subscribe(new MaterializeSubscriber(subscriber));
    }
}
class MaterializeSubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
    }
    _next(value) {
        this.destination.next(Notification.createNext(value));
    }
    _error(err) {
        const destination = this.destination;
        destination.next(Notification.createError(err));
        destination.complete();
    }
    _complete() {
        const destination = this.destination;
        destination.next(Notification.createComplete());
        destination.complete();
    }
}

function scan(accumulator, seed) {
    let hasSeed = false;
    if (arguments.length >= 2) {
        hasSeed = true;
    }
    return function scanOperatorFunction(source) {
        return source.lift(new ScanOperator(accumulator, seed, hasSeed));
    };
}
class ScanOperator {
    constructor(accumulator, seed, hasSeed = false) {
        this.accumulator = accumulator;
        this.seed = seed;
        this.hasSeed = hasSeed;
    }
    call(subscriber, source) {
        return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
    }
}
class ScanSubscriber extends Subscriber {
    constructor(destination, accumulator, _seed, hasSeed) {
        super(destination);
        this.accumulator = accumulator;
        this._seed = _seed;
        this.hasSeed = hasSeed;
        this.index = 0;
    }
    get seed() {
        return this._seed;
    }
    set seed(value) {
        this.hasSeed = true;
        this._seed = value;
    }
    _next(value) {
        if (!this.hasSeed) {
            this.seed = value;
            this.destination.next(value);
        }
        else {
            return this._tryNext(value);
        }
    }
    _tryNext(value) {
        const index = this.index++;
        let result;
        try {
            result = this.accumulator(this.seed, value, index);
        }
        catch (err) {
            this.destination.error(err);
        }
        this.seed = result;
        this.destination.next(result);
    }
}

function reduce(accumulator, seed) {
    if (arguments.length >= 2) {
        return function reduceOperatorFunctionWithSeed(source) {
            return pipe(scan(accumulator, seed), takeLast(1), defaultIfEmpty(seed))(source);
        };
    }
    return function reduceOperatorFunction(source) {
        return pipe(scan((acc, value, index) => accumulator(acc, value, index + 1)), takeLast(1))(source);
    };
}

function max(comparer) {
    const max = (typeof comparer === 'function')
        ? (x, y) => comparer(x, y) > 0 ? x : y
        : (x, y) => x > y ? x : y;
    return reduce(max);
}

function merge$1(...observables) {
    return (source) => source.lift.call(merge(source, ...observables));
}

function mergeMapTo(innerObservable, resultSelector, concurrent = Number.POSITIVE_INFINITY) {
    if (typeof resultSelector === 'function') {
        return mergeMap(() => innerObservable, resultSelector, concurrent);
    }
    if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
    }
    return mergeMap(() => innerObservable, concurrent);
}

function mergeScan(accumulator, seed, concurrent = Number.POSITIVE_INFINITY) {
    return (source) => source.lift(new MergeScanOperator(accumulator, seed, concurrent));
}
class MergeScanOperator {
    constructor(accumulator, seed, concurrent) {
        this.accumulator = accumulator;
        this.seed = seed;
        this.concurrent = concurrent;
    }
    call(subscriber, source) {
        return source.subscribe(new MergeScanSubscriber(subscriber, this.accumulator, this.seed, this.concurrent));
    }
}
class MergeScanSubscriber extends OuterSubscriber {
    constructor(destination, accumulator, acc, concurrent) {
        super(destination);
        this.accumulator = accumulator;
        this.acc = acc;
        this.concurrent = concurrent;
        this.hasValue = false;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    _next(value) {
        if (this.active < this.concurrent) {
            const index = this.index++;
            const destination = this.destination;
            let ish;
            try {
                const { accumulator } = this;
                ish = accumulator(this.acc, value, index);
            }
            catch (e) {
                return destination.error(e);
            }
            this.active++;
            this._innerSub(ish, value, index);
        }
        else {
            this.buffer.push(value);
        }
    }
    _innerSub(ish, value, index) {
        const innerSubscriber = new InnerSubscriber(this, value, index);
        const destination = this.destination;
        destination.add(innerSubscriber);
        const innerSubscription = subscribeToResult(this, ish, undefined, undefined, innerSubscriber);
        if (innerSubscription !== innerSubscriber) {
            destination.add(innerSubscription);
        }
    }
    _complete() {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
        this.unsubscribe();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { destination } = this;
        this.acc = innerValue;
        this.hasValue = true;
        destination.next(innerValue);
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        const destination = this.destination;
        destination.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    }
}

function min(comparer) {
    const min = (typeof comparer === 'function')
        ? (x, y) => comparer(x, y) < 0 ? x : y
        : (x, y) => x < y ? x : y;
    return reduce(min);
}

function multicast(subjectOrSubjectFactory, selector) {
    return function multicastOperatorFunction(source) {
        let subjectFactory;
        if (typeof subjectOrSubjectFactory === 'function') {
            subjectFactory = subjectOrSubjectFactory;
        }
        else {
            subjectFactory = function subjectFactory() {
                return subjectOrSubjectFactory;
            };
        }
        if (typeof selector === 'function') {
            return source.lift(new MulticastOperator(subjectFactory, selector));
        }
        const connectable = Object.create(source, connectableObservableDescriptor);
        connectable.source = source;
        connectable.subjectFactory = subjectFactory;
        return connectable;
    };
}
class MulticastOperator {
    constructor(subjectFactory, selector) {
        this.subjectFactory = subjectFactory;
        this.selector = selector;
    }
    call(subscriber, source) {
        const { selector } = this;
        const subject = this.subjectFactory();
        const subscription = selector(subject).subscribe(subscriber);
        subscription.add(source.subscribe(subject));
        return subscription;
    }
}

function onErrorResumeNext$1(...nextSources) {
    if (nextSources.length === 1 && isArray(nextSources[0])) {
        nextSources = nextSources[0];
    }
    return (source) => source.lift(new OnErrorResumeNextOperator(nextSources));
}
function onErrorResumeNextStatic(...nextSources) {
    let source = null;
    if (nextSources.length === 1 && isArray(nextSources[0])) {
        nextSources = nextSources[0];
    }
    source = nextSources.shift();
    return from(source, null).lift(new OnErrorResumeNextOperator(nextSources));
}
class OnErrorResumeNextOperator {
    constructor(nextSources) {
        this.nextSources = nextSources;
    }
    call(subscriber, source) {
        return source.subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
    }
}
class OnErrorResumeNextSubscriber extends OuterSubscriber {
    constructor(destination, nextSources) {
        super(destination);
        this.destination = destination;
        this.nextSources = nextSources;
    }
    notifyError(error, innerSub) {
        this.subscribeToNextSource();
    }
    notifyComplete(innerSub) {
        this.subscribeToNextSource();
    }
    _error(err) {
        this.subscribeToNextSource();
        this.unsubscribe();
    }
    _complete() {
        this.subscribeToNextSource();
        this.unsubscribe();
    }
    subscribeToNextSource() {
        const next = this.nextSources.shift();
        if (!!next) {
            const innerSubscriber = new InnerSubscriber(this, undefined, undefined);
            const destination = this.destination;
            destination.add(innerSubscriber);
            const innerSubscription = subscribeToResult(this, next, undefined, undefined, innerSubscriber);
            if (innerSubscription !== innerSubscriber) {
                destination.add(innerSubscription);
            }
        }
        else {
            this.destination.complete();
        }
    }
}

function pairwise() {
    return (source) => source.lift(new PairwiseOperator());
}
class PairwiseOperator {
    call(subscriber, source) {
        return source.subscribe(new PairwiseSubscriber(subscriber));
    }
}
class PairwiseSubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
        this.hasPrev = false;
    }
    _next(value) {
        let pair;
        if (this.hasPrev) {
            pair = [this.prev, value];
        }
        else {
            this.hasPrev = true;
        }
        this.prev = value;
        if (pair) {
            this.destination.next(pair);
        }
    }
}

function partition$1(predicate, thisArg) {
    return (source) => [
        filter(predicate, thisArg)(source),
        filter(not(predicate, thisArg))(source)
    ];
}

function pluck(...properties) {
    const length = properties.length;
    if (length === 0) {
        throw new Error('list of properties cannot be empty.');
    }
    return (source) => map(plucker(properties, length))(source);
}
function plucker(props, length) {
    const mapper = (x) => {
        let currentProp = x;
        for (let i = 0; i < length; i++) {
            const p = currentProp[props[i]];
            if (typeof p !== 'undefined') {
                currentProp = p;
            }
            else {
                return undefined;
            }
        }
        return currentProp;
    };
    return mapper;
}

function publish(selector) {
    return selector ?
        multicast(() => new Subject(), selector) :
        multicast(new Subject());
}

function publishBehavior(value) {
    return (source) => multicast(new BehaviorSubject(value))(source);
}

function publishLast() {
    return (source) => multicast(new AsyncSubject())(source);
}

function publishReplay(bufferSize, windowTime, selectorOrScheduler, scheduler) {
    if (selectorOrScheduler && typeof selectorOrScheduler !== 'function') {
        scheduler = selectorOrScheduler;
    }
    const selector = typeof selectorOrScheduler === 'function' ? selectorOrScheduler : undefined;
    const subject = new ReplaySubject(bufferSize, windowTime, scheduler);
    return (source) => multicast(() => subject, selector)(source);
}

function race$1(...observables) {
    return function raceOperatorFunction(source) {
        if (observables.length === 1 && isArray(observables[0])) {
            observables = observables[0];
        }
        return source.lift.call(race(source, ...observables));
    };
}

function repeat(count = -1) {
    return (source) => {
        if (count === 0) {
            return empty$1();
        }
        else if (count < 0) {
            return source.lift(new RepeatOperator(-1, source));
        }
        else {
            return source.lift(new RepeatOperator(count - 1, source));
        }
    };
}
class RepeatOperator {
    constructor(count, source) {
        this.count = count;
        this.source = source;
    }
    call(subscriber, source) {
        return source.subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
    }
}
class RepeatSubscriber extends Subscriber {
    constructor(destination, count, source) {
        super(destination);
        this.count = count;
        this.source = source;
    }
    complete() {
        if (!this.isStopped) {
            const { source, count } = this;
            if (count === 0) {
                return super.complete();
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    }
}

function repeatWhen(notifier) {
    return (source) => source.lift(new RepeatWhenOperator(notifier));
}
class RepeatWhenOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber, source) {
        return source.subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, source));
    }
}
class RepeatWhenSubscriber extends OuterSubscriber {
    constructor(destination, notifier, source) {
        super(destination);
        this.notifier = notifier;
        this.source = source;
        this.sourceIsBeingSubscribedTo = true;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.sourceIsBeingSubscribedTo = true;
        this.source.subscribe(this);
    }
    notifyComplete(innerSub) {
        if (this.sourceIsBeingSubscribedTo === false) {
            return super.complete();
        }
    }
    complete() {
        this.sourceIsBeingSubscribedTo = false;
        if (!this.isStopped) {
            if (!this.retries) {
                this.subscribeToRetries();
            }
            if (!this.retriesSubscription || this.retriesSubscription.closed) {
                return super.complete();
            }
            this._unsubscribeAndRecycle();
            this.notifications.next();
        }
    }
    _unsubscribe() {
        const { notifications, retriesSubscription } = this;
        if (notifications) {
            notifications.unsubscribe();
            this.notifications = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    }
    _unsubscribeAndRecycle() {
        const { _unsubscribe } = this;
        this._unsubscribe = null;
        super._unsubscribeAndRecycle();
        this._unsubscribe = _unsubscribe;
        return this;
    }
    subscribeToRetries() {
        this.notifications = new Subject();
        let retries;
        try {
            const { notifier } = this;
            retries = notifier(this.notifications);
        }
        catch (e) {
            return super.complete();
        }
        this.retries = retries;
        this.retriesSubscription = subscribeToResult(this, retries);
    }
}

function retry(count = -1) {
    return (source) => source.lift(new RetryOperator(count, source));
}
class RetryOperator {
    constructor(count, source) {
        this.count = count;
        this.source = source;
    }
    call(subscriber, source) {
        return source.subscribe(new RetrySubscriber(subscriber, this.count, this.source));
    }
}
class RetrySubscriber extends Subscriber {
    constructor(destination, count, source) {
        super(destination);
        this.count = count;
        this.source = source;
    }
    error(err) {
        if (!this.isStopped) {
            const { source, count } = this;
            if (count === 0) {
                return super.error(err);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    }
}

function retryWhen(notifier) {
    return (source) => source.lift(new RetryWhenOperator(notifier, source));
}
class RetryWhenOperator {
    constructor(notifier, source) {
        this.notifier = notifier;
        this.source = source;
    }
    call(subscriber, source) {
        return source.subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
    }
}
class RetryWhenSubscriber extends OuterSubscriber {
    constructor(destination, notifier, source) {
        super(destination);
        this.notifier = notifier;
        this.source = source;
    }
    error(err) {
        if (!this.isStopped) {
            let errors = this.errors;
            let retries = this.retries;
            let retriesSubscription = this.retriesSubscription;
            if (!retries) {
                errors = new Subject();
                try {
                    const { notifier } = this;
                    retries = notifier(errors);
                }
                catch (e) {
                    return super.error(e);
                }
                retriesSubscription = subscribeToResult(this, retries);
            }
            else {
                this.errors = null;
                this.retriesSubscription = null;
            }
            this._unsubscribeAndRecycle();
            this.errors = errors;
            this.retries = retries;
            this.retriesSubscription = retriesSubscription;
            errors.next(err);
        }
    }
    _unsubscribe() {
        const { errors, retriesSubscription } = this;
        if (errors) {
            errors.unsubscribe();
            this.errors = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { _unsubscribe } = this;
        this._unsubscribe = null;
        this._unsubscribeAndRecycle();
        this._unsubscribe = _unsubscribe;
        this.source.subscribe(this);
    }
}

function sample(notifier) {
    return (source) => source.lift(new SampleOperator(notifier));
}
class SampleOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber, source) {
        const sampleSubscriber = new SampleSubscriber(subscriber);
        const subscription = source.subscribe(sampleSubscriber);
        subscription.add(subscribeToResult(sampleSubscriber, this.notifier));
        return subscription;
    }
}
class SampleSubscriber extends OuterSubscriber {
    constructor() {
        super(...arguments);
        this.hasValue = false;
    }
    _next(value) {
        this.value = value;
        this.hasValue = true;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    }
    notifyComplete() {
        this.emitValue();
    }
    emitValue() {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.value);
        }
    }
}

function sampleTime(period, scheduler = async) {
    return (source) => source.lift(new SampleTimeOperator(period, scheduler));
}
class SampleTimeOperator {
    constructor(period, scheduler) {
        this.period = period;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
    }
}
class SampleTimeSubscriber extends Subscriber {
    constructor(destination, period, scheduler) {
        super(destination);
        this.period = period;
        this.scheduler = scheduler;
        this.hasValue = false;
        this.add(scheduler.schedule(dispatchNotification, period, { subscriber: this, period }));
    }
    _next(value) {
        this.lastValue = value;
        this.hasValue = true;
    }
    notifyNext() {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.lastValue);
        }
    }
}
function dispatchNotification(state) {
    let { subscriber, period } = state;
    subscriber.notifyNext();
    this.schedule(state, period);
}

function sequenceEqual(compareTo, comparator) {
    return (source) => source.lift(new SequenceEqualOperator(compareTo, comparator));
}
class SequenceEqualOperator {
    constructor(compareTo, comparator) {
        this.compareTo = compareTo;
        this.comparator = comparator;
    }
    call(subscriber, source) {
        return source.subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparator));
    }
}
class SequenceEqualSubscriber extends Subscriber {
    constructor(destination, compareTo, comparator) {
        super(destination);
        this.compareTo = compareTo;
        this.comparator = comparator;
        this._a = [];
        this._b = [];
        this._oneComplete = false;
        this.destination.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, this)));
    }
    _next(value) {
        if (this._oneComplete && this._b.length === 0) {
            this.emit(false);
        }
        else {
            this._a.push(value);
            this.checkValues();
        }
    }
    _complete() {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
        this.unsubscribe();
    }
    checkValues() {
        const { _a, _b, comparator } = this;
        while (_a.length > 0 && _b.length > 0) {
            let a = _a.shift();
            let b = _b.shift();
            let areEqual = false;
            try {
                areEqual = comparator ? comparator(a, b) : a === b;
            }
            catch (e) {
                this.destination.error(e);
            }
            if (!areEqual) {
                this.emit(false);
            }
        }
    }
    emit(value) {
        const { destination } = this;
        destination.next(value);
        destination.complete();
    }
    nextB(value) {
        if (this._oneComplete && this._a.length === 0) {
            this.emit(false);
        }
        else {
            this._b.push(value);
            this.checkValues();
        }
    }
    completeB() {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
    }
}
class SequenceEqualCompareToSubscriber extends Subscriber {
    constructor(destination, parent) {
        super(destination);
        this.parent = parent;
    }
    _next(value) {
        this.parent.nextB(value);
    }
    _error(err) {
        this.parent.error(err);
        this.unsubscribe();
    }
    _complete() {
        this.parent.completeB();
        this.unsubscribe();
    }
}

function shareSubjectFactory() {
    return new Subject();
}
function share() {
    return (source) => refCount()(multicast(shareSubjectFactory)(source));
}

function shareReplay(configOrBufferSize, windowTime, scheduler) {
    let config;
    if (configOrBufferSize && typeof configOrBufferSize === 'object') {
        config = configOrBufferSize;
    }
    else {
        config = {
            bufferSize: configOrBufferSize,
            windowTime,
            refCount: false,
            scheduler
        };
    }
    return (source) => source.lift(shareReplayOperator(config));
}
function shareReplayOperator({ bufferSize = Number.POSITIVE_INFINITY, windowTime = Number.POSITIVE_INFINITY, refCount: useRefCount, scheduler }) {
    let subject;
    let refCount = 0;
    let subscription;
    let hasError = false;
    let isComplete = false;
    return function shareReplayOperation(source) {
        refCount++;
        if (!subject || hasError) {
            hasError = false;
            subject = new ReplaySubject(bufferSize, windowTime, scheduler);
            subscription = source.subscribe({
                next(value) { subject.next(value); },
                error(err) {
                    hasError = true;
                    subject.error(err);
                },
                complete() {
                    isComplete = true;
                    subscription = undefined;
                    subject.complete();
                },
            });
        }
        const innerSub = subject.subscribe(this);
        this.add(() => {
            refCount--;
            innerSub.unsubscribe();
            if (subscription && !isComplete && useRefCount && refCount === 0) {
                subscription.unsubscribe();
                subscription = undefined;
                subject = undefined;
            }
        });
    };
}

function single(predicate) {
    return (source) => source.lift(new SingleOperator(predicate, source));
}
class SingleOperator {
    constructor(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    call(subscriber, source) {
        return source.subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
    }
}
class SingleSubscriber extends Subscriber {
    constructor(destination, predicate, source) {
        super(destination);
        this.predicate = predicate;
        this.source = source;
        this.seenValue = false;
        this.index = 0;
    }
    applySingleValue(value) {
        if (this.seenValue) {
            this.destination.error('Sequence contains more than one element');
        }
        else {
            this.seenValue = true;
            this.singleValue = value;
        }
    }
    _next(value) {
        const index = this.index++;
        if (this.predicate) {
            this.tryNext(value, index);
        }
        else {
            this.applySingleValue(value);
        }
    }
    tryNext(value, index) {
        try {
            if (this.predicate(value, index, this.source)) {
                this.applySingleValue(value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    }
    _complete() {
        const destination = this.destination;
        if (this.index > 0) {
            destination.next(this.seenValue ? this.singleValue : undefined);
            destination.complete();
        }
        else {
            destination.error(new EmptyError);
        }
    }
}

function skip(count) {
    return (source) => source.lift(new SkipOperator(count));
}
class SkipOperator {
    constructor(total) {
        this.total = total;
    }
    call(subscriber, source) {
        return source.subscribe(new SkipSubscriber(subscriber, this.total));
    }
}
class SkipSubscriber extends Subscriber {
    constructor(destination, total) {
        super(destination);
        this.total = total;
        this.count = 0;
    }
    _next(x) {
        if (++this.count > this.total) {
            this.destination.next(x);
        }
    }
}

function skipLast(count) {
    return (source) => source.lift(new SkipLastOperator(count));
}
class SkipLastOperator {
    constructor(_skipCount) {
        this._skipCount = _skipCount;
        if (this._skipCount < 0) {
            throw new ArgumentOutOfRangeError;
        }
    }
    call(subscriber, source) {
        if (this._skipCount === 0) {
            return source.subscribe(new Subscriber(subscriber));
        }
        else {
            return source.subscribe(new SkipLastSubscriber(subscriber, this._skipCount));
        }
    }
}
class SkipLastSubscriber extends Subscriber {
    constructor(destination, _skipCount) {
        super(destination);
        this._skipCount = _skipCount;
        this._count = 0;
        this._ring = new Array(_skipCount);
    }
    _next(value) {
        const skipCount = this._skipCount;
        const count = this._count++;
        if (count < skipCount) {
            this._ring[count] = value;
        }
        else {
            const currentIndex = count % skipCount;
            const ring = this._ring;
            const oldValue = ring[currentIndex];
            ring[currentIndex] = value;
            this.destination.next(oldValue);
        }
    }
}

function skipUntil(notifier) {
    return (source) => source.lift(new SkipUntilOperator(notifier));
}
class SkipUntilOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(destination, source) {
        return source.subscribe(new SkipUntilSubscriber(destination, this.notifier));
    }
}
class SkipUntilSubscriber extends OuterSubscriber {
    constructor(destination, notifier) {
        super(destination);
        this.hasValue = false;
        const innerSubscriber = new InnerSubscriber(this, undefined, undefined);
        this.add(innerSubscriber);
        this.innerSubscription = innerSubscriber;
        const innerSubscription = subscribeToResult(this, notifier, undefined, undefined, innerSubscriber);
        if (innerSubscription !== innerSubscriber) {
            this.add(innerSubscription);
            this.innerSubscription = innerSubscription;
        }
    }
    _next(value) {
        if (this.hasValue) {
            super._next(value);
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.hasValue = true;
        if (this.innerSubscription) {
            this.innerSubscription.unsubscribe();
        }
    }
    notifyComplete() {
    }
}

function skipWhile(predicate) {
    return (source) => source.lift(new SkipWhileOperator(predicate));
}
class SkipWhileOperator {
    constructor(predicate) {
        this.predicate = predicate;
    }
    call(subscriber, source) {
        return source.subscribe(new SkipWhileSubscriber(subscriber, this.predicate));
    }
}
class SkipWhileSubscriber extends Subscriber {
    constructor(destination, predicate) {
        super(destination);
        this.predicate = predicate;
        this.skipping = true;
        this.index = 0;
    }
    _next(value) {
        const destination = this.destination;
        if (this.skipping) {
            this.tryCallPredicate(value);
        }
        if (!this.skipping) {
            destination.next(value);
        }
    }
    tryCallPredicate(value) {
        try {
            const result = this.predicate(value, this.index++);
            this.skipping = Boolean(result);
        }
        catch (err) {
            this.destination.error(err);
        }
    }
}

function startWith(...array) {
    const scheduler = array[array.length - 1];
    if (isScheduler(scheduler)) {
        array.pop();
        return (source) => concat(array, source, scheduler);
    }
    else {
        return (source) => concat(array, source);
    }
}

class SubscribeOnObservable extends Observable {
    constructor(source, delayTime = 0, scheduler = asap) {
        super();
        this.source = source;
        this.delayTime = delayTime;
        this.scheduler = scheduler;
        if (!isNumeric(delayTime) || delayTime < 0) {
            this.delayTime = 0;
        }
        if (!scheduler || typeof scheduler.schedule !== 'function') {
            this.scheduler = asap;
        }
    }
    static create(source, delay = 0, scheduler = asap) {
        return new SubscribeOnObservable(source, delay, scheduler);
    }
    static dispatch(arg) {
        const { source, subscriber } = arg;
        return this.add(source.subscribe(subscriber));
    }
    _subscribe(subscriber) {
        const delay = this.delayTime;
        const source = this.source;
        const scheduler = this.scheduler;
        return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
            source, subscriber
        });
    }
}

function subscribeOn(scheduler, delay = 0) {
    return function subscribeOnOperatorFunction(source) {
        return source.lift(new SubscribeOnOperator(scheduler, delay));
    };
}
class SubscribeOnOperator {
    constructor(scheduler, delay) {
        this.scheduler = scheduler;
        this.delay = delay;
    }
    call(subscriber, source) {
        return new SubscribeOnObservable(source, this.delay, this.scheduler).subscribe(subscriber);
    }
}

function switchMap(project, resultSelector) {
    if (typeof resultSelector === 'function') {
        return (source) => source.pipe(switchMap((a, i) => from(project(a, i)).pipe(map((b, ii) => resultSelector(a, b, i, ii)))));
    }
    return (source) => source.lift(new SwitchMapOperator(project));
}
class SwitchMapOperator {
    constructor(project) {
        this.project = project;
    }
    call(subscriber, source) {
        return source.subscribe(new SwitchMapSubscriber(subscriber, this.project));
    }
}
class SwitchMapSubscriber extends OuterSubscriber {
    constructor(destination, project) {
        super(destination);
        this.project = project;
        this.index = 0;
    }
    _next(value) {
        let result;
        const index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (error) {
            this.destination.error(error);
            return;
        }
        this._innerSub(result, value, index);
    }
    _innerSub(result, value, index) {
        const innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        const innerSubscriber = new InnerSubscriber(this, value, index);
        const destination = this.destination;
        destination.add(innerSubscriber);
        this.innerSubscription = subscribeToResult(this, result, undefined, undefined, innerSubscriber);
        if (this.innerSubscription !== innerSubscriber) {
            destination.add(this.innerSubscription);
        }
    }
    _complete() {
        const { innerSubscription } = this;
        if (!innerSubscription || innerSubscription.closed) {
            super._complete();
        }
        this.unsubscribe();
    }
    _unsubscribe() {
        this.innerSubscription = null;
    }
    notifyComplete(innerSub) {
        const destination = this.destination;
        destination.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped) {
            super._complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    }
}

function switchAll() {
    return switchMap(identity);
}

function switchMapTo(innerObservable, resultSelector) {
    return resultSelector ? switchMap(() => innerObservable, resultSelector) : switchMap(() => innerObservable);
}

function takeUntil(notifier) {
    return (source) => source.lift(new TakeUntilOperator(notifier));
}
class TakeUntilOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber, source) {
        const takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
        const notifierSubscription = subscribeToResult(takeUntilSubscriber, this.notifier);
        if (notifierSubscription && !takeUntilSubscriber.seenValue) {
            takeUntilSubscriber.add(notifierSubscription);
            return source.subscribe(takeUntilSubscriber);
        }
        return takeUntilSubscriber;
    }
}
class TakeUntilSubscriber extends OuterSubscriber {
    constructor(destination) {
        super(destination);
        this.seenValue = false;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.seenValue = true;
        this.complete();
    }
    notifyComplete() {
    }
}

function takeWhile(predicate, inclusive = false) {
    return (source) => source.lift(new TakeWhileOperator(predicate, inclusive));
}
class TakeWhileOperator {
    constructor(predicate, inclusive) {
        this.predicate = predicate;
        this.inclusive = inclusive;
    }
    call(subscriber, source) {
        return source.subscribe(new TakeWhileSubscriber(subscriber, this.predicate, this.inclusive));
    }
}
class TakeWhileSubscriber extends Subscriber {
    constructor(destination, predicate, inclusive) {
        super(destination);
        this.predicate = predicate;
        this.inclusive = inclusive;
        this.index = 0;
    }
    _next(value) {
        const destination = this.destination;
        let result;
        try {
            result = this.predicate(value, this.index++);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this.nextOrComplete(value, result);
    }
    nextOrComplete(value, predicateResult) {
        const destination = this.destination;
        if (Boolean(predicateResult)) {
            destination.next(value);
        }
        else {
            if (this.inclusive) {
                destination.next(value);
            }
            destination.complete();
        }
    }
}

function tap(nextOrObserver, error, complete) {
    return function tapOperatorFunction(source) {
        return source.lift(new DoOperator(nextOrObserver, error, complete));
    };
}
class DoOperator {
    constructor(nextOrObserver, error, complete) {
        this.nextOrObserver = nextOrObserver;
        this.error = error;
        this.complete = complete;
    }
    call(subscriber, source) {
        return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    }
}
class TapSubscriber extends Subscriber {
    constructor(destination, observerOrNext, error, complete) {
        super(destination);
        this._tapNext = noop;
        this._tapError = noop;
        this._tapComplete = noop;
        this._tapError = error || noop;
        this._tapComplete = complete || noop;
        if (isFunction(observerOrNext)) {
            this._context = this;
            this._tapNext = observerOrNext;
        }
        else if (observerOrNext) {
            this._context = observerOrNext;
            this._tapNext = observerOrNext.next || noop;
            this._tapError = observerOrNext.error || noop;
            this._tapComplete = observerOrNext.complete || noop;
        }
    }
    _next(value) {
        try {
            this._tapNext.call(this._context, value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(value);
    }
    _error(err) {
        try {
            this._tapError.call(this._context, err);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.error(err);
    }
    _complete() {
        try {
            this._tapComplete.call(this._context);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        return this.destination.complete();
    }
}

const defaultThrottleConfig = {
    leading: true,
    trailing: false
};
function throttle(durationSelector, config = defaultThrottleConfig) {
    return (source) => source.lift(new ThrottleOperator(durationSelector, config.leading, config.trailing));
}
class ThrottleOperator {
    constructor(durationSelector, leading, trailing) {
        this.durationSelector = durationSelector;
        this.leading = leading;
        this.trailing = trailing;
    }
    call(subscriber, source) {
        return source.subscribe(new ThrottleSubscriber(subscriber, this.durationSelector, this.leading, this.trailing));
    }
}
class ThrottleSubscriber extends OuterSubscriber {
    constructor(destination, durationSelector, _leading, _trailing) {
        super(destination);
        this.destination = destination;
        this.durationSelector = durationSelector;
        this._leading = _leading;
        this._trailing = _trailing;
        this._hasValue = false;
    }
    _next(value) {
        this._hasValue = true;
        this._sendValue = value;
        if (!this._throttled) {
            if (this._leading) {
                this.send();
            }
            else {
                this.throttle(value);
            }
        }
    }
    send() {
        const { _hasValue, _sendValue } = this;
        if (_hasValue) {
            this.destination.next(_sendValue);
            this.throttle(_sendValue);
        }
        this._hasValue = false;
        this._sendValue = null;
    }
    throttle(value) {
        const duration = this.tryDurationSelector(value);
        if (!!duration) {
            this.add(this._throttled = subscribeToResult(this, duration));
        }
    }
    tryDurationSelector(value) {
        try {
            return this.durationSelector(value);
        }
        catch (err) {
            this.destination.error(err);
            return null;
        }
    }
    throttlingDone() {
        const { _throttled, _trailing } = this;
        if (_throttled) {
            _throttled.unsubscribe();
        }
        this._throttled = null;
        if (_trailing) {
            this.send();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.throttlingDone();
    }
    notifyComplete() {
        this.throttlingDone();
    }
}

function throttleTime(duration, scheduler = async, config = defaultThrottleConfig) {
    return (source) => source.lift(new ThrottleTimeOperator(duration, scheduler, config.leading, config.trailing));
}
class ThrottleTimeOperator {
    constructor(duration, scheduler, leading, trailing) {
        this.duration = duration;
        this.scheduler = scheduler;
        this.leading = leading;
        this.trailing = trailing;
    }
    call(subscriber, source) {
        return source.subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler, this.leading, this.trailing));
    }
}
class ThrottleTimeSubscriber extends Subscriber {
    constructor(destination, duration, scheduler, leading, trailing) {
        super(destination);
        this.duration = duration;
        this.scheduler = scheduler;
        this.leading = leading;
        this.trailing = trailing;
        this._hasTrailingValue = false;
        this._trailingValue = null;
    }
    _next(value) {
        if (this.throttled) {
            if (this.trailing) {
                this._trailingValue = value;
                this._hasTrailingValue = true;
            }
        }
        else {
            this.add(this.throttled = this.scheduler.schedule(dispatchNext$3, this.duration, { subscriber: this }));
            if (this.leading) {
                this.destination.next(value);
            }
            else if (this.trailing) {
                this._trailingValue = value;
                this._hasTrailingValue = true;
            }
        }
    }
    _complete() {
        if (this._hasTrailingValue) {
            this.destination.next(this._trailingValue);
            this.destination.complete();
        }
        else {
            this.destination.complete();
        }
    }
    clearThrottle() {
        const throttled = this.throttled;
        if (throttled) {
            if (this.trailing && this._hasTrailingValue) {
                this.destination.next(this._trailingValue);
                this._trailingValue = null;
                this._hasTrailingValue = false;
            }
            throttled.unsubscribe();
            this.remove(throttled);
            this.throttled = null;
        }
    }
}
function dispatchNext$3(arg) {
    const { subscriber } = arg;
    subscriber.clearThrottle();
}

function timeInterval(scheduler = async) {
    return (source) => defer(() => {
        return source.pipe(scan(({ current }, value) => ({ value, current: scheduler.now(), last: current }), { current: scheduler.now(), value: undefined, last: undefined }), map(({ current, last, value }) => new TimeInterval(value, current - last)));
    });
}
class TimeInterval {
    constructor(value, interval) {
        this.value = value;
        this.interval = interval;
    }
}

function timeoutWith(due, withObservable, scheduler = async) {
    return (source) => {
        let absoluteTimeout = isDate(due);
        let waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
        return source.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
    };
}
class TimeoutWithOperator {
    constructor(waitFor, absoluteTimeout, withObservable, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
    }
}
class TimeoutWithSubscriber extends OuterSubscriber {
    constructor(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        super(destination);
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
        this.action = null;
        this.scheduleTimeout();
    }
    static dispatchTimeout(subscriber) {
        const { withObservable } = subscriber;
        subscriber._unsubscribeAndRecycle();
        subscriber.add(subscribeToResult(subscriber, withObservable));
    }
    scheduleTimeout() {
        const { action } = this;
        if (action) {
            this.action = action.schedule(this, this.waitFor);
        }
        else {
            this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
        }
    }
    _next(value) {
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
        super._next(value);
    }
    _unsubscribe() {
        this.action = null;
        this.scheduler = null;
        this.withObservable = null;
    }
}

function timeout(due, scheduler = async) {
    return timeoutWith(due, throwError(new TimeoutError()), scheduler);
}

function timestamp(scheduler = async) {
    return map((value) => new Timestamp(value, scheduler.now()));
}
class Timestamp {
    constructor(value, timestamp) {
        this.value = value;
        this.timestamp = timestamp;
    }
}

function toArrayReducer(arr, item, index) {
    if (index === 0) {
        return [item];
    }
    arr.push(item);
    return arr;
}
function toArray() {
    return reduce(toArrayReducer, []);
}

function window$1(windowBoundaries) {
    return function windowOperatorFunction(source) {
        return source.lift(new WindowOperator(windowBoundaries));
    };
}
class WindowOperator {
    constructor(windowBoundaries) {
        this.windowBoundaries = windowBoundaries;
    }
    call(subscriber, source) {
        const windowSubscriber = new WindowSubscriber(subscriber);
        const sourceSubscription = source.subscribe(windowSubscriber);
        if (!sourceSubscription.closed) {
            windowSubscriber.add(subscribeToResult(windowSubscriber, this.windowBoundaries));
        }
        return sourceSubscription;
    }
}
class WindowSubscriber extends OuterSubscriber {
    constructor(destination) {
        super(destination);
        this.window = new Subject();
        destination.next(this.window);
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow();
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    notifyComplete(innerSub) {
        this._complete();
    }
    _next(value) {
        this.window.next(value);
    }
    _error(err) {
        this.window.error(err);
        this.destination.error(err);
    }
    _complete() {
        this.window.complete();
        this.destination.complete();
    }
    _unsubscribe() {
        this.window = null;
    }
    openWindow() {
        const prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        const destination = this.destination;
        const newWindow = this.window = new Subject();
        destination.next(newWindow);
    }
}

function windowCount(windowSize, startWindowEvery = 0) {
    return function windowCountOperatorFunction(source) {
        return source.lift(new WindowCountOperator(windowSize, startWindowEvery));
    };
}
class WindowCountOperator {
    constructor(windowSize, startWindowEvery) {
        this.windowSize = windowSize;
        this.startWindowEvery = startWindowEvery;
    }
    call(subscriber, source) {
        return source.subscribe(new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery));
    }
}
class WindowCountSubscriber extends Subscriber {
    constructor(destination, windowSize, startWindowEvery) {
        super(destination);
        this.destination = destination;
        this.windowSize = windowSize;
        this.startWindowEvery = startWindowEvery;
        this.windows = [new Subject()];
        this.count = 0;
        destination.next(this.windows[0]);
    }
    _next(value) {
        const startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
        const destination = this.destination;
        const windowSize = this.windowSize;
        const windows = this.windows;
        const len = windows.length;
        for (let i = 0; i < len && !this.closed; i++) {
            windows[i].next(value);
        }
        const c = this.count - windowSize + 1;
        if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
            windows.shift().complete();
        }
        if (++this.count % startWindowEvery === 0 && !this.closed) {
            const window = new Subject();
            windows.push(window);
            destination.next(window);
        }
    }
    _error(err) {
        const windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().error(err);
            }
        }
        this.destination.error(err);
    }
    _complete() {
        const windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().complete();
            }
        }
        this.destination.complete();
    }
    _unsubscribe() {
        this.count = 0;
        this.windows = null;
    }
}

function windowTime(windowTimeSpan) {
    let scheduler = async;
    let windowCreationInterval = null;
    let maxWindowSize = Number.POSITIVE_INFINITY;
    if (isScheduler(arguments[3])) {
        scheduler = arguments[3];
    }
    if (isScheduler(arguments[2])) {
        scheduler = arguments[2];
    }
    else if (isNumeric(arguments[2])) {
        maxWindowSize = arguments[2];
    }
    if (isScheduler(arguments[1])) {
        scheduler = arguments[1];
    }
    else if (isNumeric(arguments[1])) {
        windowCreationInterval = arguments[1];
    }
    return function windowTimeOperatorFunction(source) {
        return source.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler));
    };
}
class WindowTimeOperator {
    constructor(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
        this.windowTimeSpan = windowTimeSpan;
        this.windowCreationInterval = windowCreationInterval;
        this.maxWindowSize = maxWindowSize;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.maxWindowSize, this.scheduler));
    }
}
class CountedSubject extends Subject {
    constructor() {
        super(...arguments);
        this._numberOfNextedValues = 0;
    }
    next(value) {
        this._numberOfNextedValues++;
        super.next(value);
    }
    get numberOfNextedValues() {
        return this._numberOfNextedValues;
    }
}
class WindowTimeSubscriber extends Subscriber {
    constructor(destination, windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
        super(destination);
        this.destination = destination;
        this.windowTimeSpan = windowTimeSpan;
        this.windowCreationInterval = windowCreationInterval;
        this.maxWindowSize = maxWindowSize;
        this.scheduler = scheduler;
        this.windows = [];
        const window = this.openWindow();
        if (windowCreationInterval !== null && windowCreationInterval >= 0) {
            const closeState = { subscriber: this, window, context: null };
            const creationState = { windowTimeSpan, windowCreationInterval, subscriber: this, scheduler };
            this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
            this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
        }
        else {
            const timeSpanOnlyState = { subscriber: this, window, windowTimeSpan };
            this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
        }
    }
    _next(value) {
        const windows = this.windows;
        const len = windows.length;
        for (let i = 0; i < len; i++) {
            const window = windows[i];
            if (!window.closed) {
                window.next(value);
                if (window.numberOfNextedValues >= this.maxWindowSize) {
                    this.closeWindow(window);
                }
            }
        }
    }
    _error(err) {
        const windows = this.windows;
        while (windows.length > 0) {
            windows.shift().error(err);
        }
        this.destination.error(err);
    }
    _complete() {
        const windows = this.windows;
        while (windows.length > 0) {
            const window = windows.shift();
            if (!window.closed) {
                window.complete();
            }
        }
        this.destination.complete();
    }
    openWindow() {
        const window = new CountedSubject();
        this.windows.push(window);
        const destination = this.destination;
        destination.next(window);
        return window;
    }
    closeWindow(window) {
        window.complete();
        const windows = this.windows;
        windows.splice(windows.indexOf(window), 1);
    }
}
function dispatchWindowTimeSpanOnly(state) {
    const { subscriber, windowTimeSpan, window } = state;
    if (window) {
        subscriber.closeWindow(window);
    }
    state.window = subscriber.openWindow();
    this.schedule(state, windowTimeSpan);
}
function dispatchWindowCreation(state) {
    const { windowTimeSpan, subscriber, scheduler, windowCreationInterval } = state;
    const window = subscriber.openWindow();
    const action = this;
    let context = { action, subscription: null };
    const timeSpanState = { subscriber, window, context };
    context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
    action.add(context.subscription);
    action.schedule(state, windowCreationInterval);
}
function dispatchWindowClose(state) {
    const { subscriber, window, context } = state;
    if (context && context.action && context.subscription) {
        context.action.remove(context.subscription);
    }
    subscriber.closeWindow(window);
}

function windowToggle(openings, closingSelector) {
    return (source) => source.lift(new WindowToggleOperator(openings, closingSelector));
}
class WindowToggleOperator {
    constructor(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
    }
}
class WindowToggleSubscriber extends OuterSubscriber {
    constructor(destination, openings, closingSelector) {
        super(destination);
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(this.openSubscription = subscribeToResult(this, openings, openings));
    }
    _next(value) {
        const { contexts } = this;
        if (contexts) {
            const len = contexts.length;
            for (let i = 0; i < len; i++) {
                contexts[i].window.next(value);
            }
        }
    }
    _error(err) {
        const { contexts } = this;
        this.contexts = null;
        if (contexts) {
            const len = contexts.length;
            let index = -1;
            while (++index < len) {
                const context = contexts[index];
                context.window.error(err);
                context.subscription.unsubscribe();
            }
        }
        super._error(err);
    }
    _complete() {
        const { contexts } = this;
        this.contexts = null;
        if (contexts) {
            const len = contexts.length;
            let index = -1;
            while (++index < len) {
                const context = contexts[index];
                context.window.complete();
                context.subscription.unsubscribe();
            }
        }
        super._complete();
    }
    _unsubscribe() {
        const { contexts } = this;
        this.contexts = null;
        if (contexts) {
            const len = contexts.length;
            let index = -1;
            while (++index < len) {
                const context = contexts[index];
                context.window.unsubscribe();
                context.subscription.unsubscribe();
            }
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (outerValue === this.openings) {
            let closingNotifier;
            try {
                const { closingSelector } = this;
                closingNotifier = closingSelector(innerValue);
            }
            catch (e) {
                return this.error(e);
            }
            const window = new Subject();
            const subscription = new Subscription();
            const context = { window, subscription };
            this.contexts.push(context);
            const innerSubscription = subscribeToResult(this, closingNotifier, context);
            if (innerSubscription.closed) {
                this.closeWindow(this.contexts.length - 1);
            }
            else {
                innerSubscription.context = context;
                subscription.add(innerSubscription);
            }
            this.destination.next(window);
        }
        else {
            this.closeWindow(this.contexts.indexOf(outerValue));
        }
    }
    notifyError(err) {
        this.error(err);
    }
    notifyComplete(inner) {
        if (inner !== this.openSubscription) {
            this.closeWindow(this.contexts.indexOf(inner.context));
        }
    }
    closeWindow(index) {
        if (index === -1) {
            return;
        }
        const { contexts } = this;
        const context = contexts[index];
        const { window, subscription } = context;
        contexts.splice(index, 1);
        window.complete();
        subscription.unsubscribe();
    }
}

function windowWhen(closingSelector) {
    return function windowWhenOperatorFunction(source) {
        return source.lift(new WindowOperator$1(closingSelector));
    };
}
class WindowOperator$1 {
    constructor(closingSelector) {
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new WindowSubscriber$1(subscriber, this.closingSelector));
    }
}
class WindowSubscriber$1 extends OuterSubscriber {
    constructor(destination, closingSelector) {
        super(destination);
        this.destination = destination;
        this.closingSelector = closingSelector;
        this.openWindow();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow(innerSub);
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    notifyComplete(innerSub) {
        this.openWindow(innerSub);
    }
    _next(value) {
        this.window.next(value);
    }
    _error(err) {
        this.window.error(err);
        this.destination.error(err);
        this.unsubscribeClosingNotification();
    }
    _complete() {
        this.window.complete();
        this.destination.complete();
        this.unsubscribeClosingNotification();
    }
    unsubscribeClosingNotification() {
        if (this.closingNotification) {
            this.closingNotification.unsubscribe();
        }
    }
    openWindow(innerSub = null) {
        if (innerSub) {
            this.remove(innerSub);
            innerSub.unsubscribe();
        }
        const prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        const window = this.window = new Subject();
        this.destination.next(window);
        let closingNotifier;
        try {
            const { closingSelector } = this;
            closingNotifier = closingSelector();
        }
        catch (e) {
            this.destination.error(e);
            this.window.error(e);
            return;
        }
        this.add(this.closingNotification = subscribeToResult(this, closingNotifier));
    }
}

function withLatestFrom(...args) {
    return (source) => {
        let project;
        if (typeof args[args.length - 1] === 'function') {
            project = args.pop();
        }
        const observables = args;
        return source.lift(new WithLatestFromOperator(observables, project));
    };
}
class WithLatestFromOperator {
    constructor(observables, project) {
        this.observables = observables;
        this.project = project;
    }
    call(subscriber, source) {
        return source.subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
    }
}
class WithLatestFromSubscriber extends OuterSubscriber {
    constructor(destination, observables, project) {
        super(destination);
        this.observables = observables;
        this.project = project;
        this.toRespond = [];
        const len = observables.length;
        this.values = new Array(len);
        for (let i = 0; i < len; i++) {
            this.toRespond.push(i);
        }
        for (let i = 0; i < len; i++) {
            let observable = observables[i];
            this.add(subscribeToResult(this, observable, observable, i));
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        const toRespond = this.toRespond;
        if (toRespond.length > 0) {
            const found = toRespond.indexOf(outerIndex);
            if (found !== -1) {
                toRespond.splice(found, 1);
            }
        }
    }
    notifyComplete() {
    }
    _next(value) {
        if (this.toRespond.length === 0) {
            const args = [value, ...this.values];
            if (this.project) {
                this._tryProject(args);
            }
            else {
                this.destination.next(args);
            }
        }
    }
    _tryProject(args) {
        let result;
        try {
            result = this.project.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    }
}

function zip$1(...observables) {
    return function zipOperatorFunction(source) {
        return source.lift.call(zip(source, ...observables));
    };
}

function zipAll(project) {
    return (source) => source.lift(new ZipOperator(project));
}

const cronkPagePanelCss = "cronk-page-panel{display:inline-block}cronk-page-panel.panel-hidden{display:none}";

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const DEFAULT_LAYOUT = {};
function eventAsJSON(event) {
    const obj = {};
    for (const key in event) {
        if (typeof event[key] === 'string' || typeof event[key] === 'number' || typeof event[key] === 'boolean') {
            obj[key] = event[key];
        }
    }
    return obj;
}
const CronkPagePanel = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.payloadHandler = async (payload) => {
            await this.updateCustomElProps(this.customElAttrs, payload);
        };
    }
    async updateCustomElProps(attributes, dataIn) {
        try {
            const newProps = await mapAttributesToProps(attributes, dataIn);
            console.debug(`updateCustomElProps::<${this.panelConfig.element}>`, newProps);
            this.customElProps = newProps;
        }
        catch (error) {
            console.debug(`updateCustomElProps::<${this.panelConfig.element}>::error`, error);
            this.errorMessage = error;
        }
    }
    async componentWillLoad() {
        if (!this.panelConfig)
            return;
        const _a = this.panelConfig, { element, listen, hidden } = _a, attributes = __rest(_a, ["element", "listen", "hidden"]);
        this.panelEl = element;
        this.customElAttrs = attributes;
        this.streamCache = new ReplaySubject();
        let payloadCache = [];
        if (listen) {
            const { stream, debounce, cache: cacheSize } = typeof listen !== 'string' ? listen : { stream: listen, debounce: 0, cache: 1 };
            const eventObservable$ = fromEvent(window, stream);
            this.listeners$ = eventObservable$
                .pipe(debounceTime(debounce), tap((event) => console.debug(`Got event for <${this.panelConfig.element}>`, event)), map((event) => {
                    const { detail } = event;
                    return detail || eventAsJSON(event);
                }))
                .subscribe(payload => {
                    var _a;
                    payloadCache = [payload, ...payloadCache.slice(0, cacheSize - 1)];
                    (_a = this.streamCache) === null || _a === void 0 ? void 0 : _a.next(cacheSize === 1 ? payloadCache[0] : payloadCache);
                });
            this.listeners$.add(this.streamCache.subscribe(this.payloadHandler));
        }
        else {
            await this.updateCustomElProps(attributes, {}); // For components not attached to event streams
        }
    }
    async componentDidUnload() {
        var _a;
        (_a = this.listeners$) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    render() {
        if (!this.panelConfig || !this.panelEl)
            return;
        const ReportPanel = this.panelEl;
        const colSpan = (this.panelConfig.layout && this.panelConfig.layout.width) || 4;
        const hasComponents = this.panelConfig.components && this.panelConfig.components.length;
        return (h(Host, { class: `component-panel ${this.panelConfig.hidden ? 'panel-hidden' : ''}`, "data-grid": this.panelConfig.layout, style: Object.assign({ gridColumnStart: `span ${colSpan}` }, (this.panelConfig.style || {})) }, this.errorMessage ? (h("cronk-errormessage", { message: this.errorMessage })) : (h(ReportPanel, Object.assign({}, this.customElProps), (this.panelConfig.heading && h("h5", null, this.panelConfig.heading)) || null, hasComponents ? (h("cronk-page-components", null, (this.panelConfig.components || []).map((compDef) => {
            const componentDefinition = compDef.layout ? compDef : Object.assign(Object.assign({}, compDef), { layout: DEFAULT_LAYOUT });
            const uuid = componentDefinition.layout.i || uuidv4();
            return (h("cronk-page-panel", { slot: componentDefinition.layout.position, key: uuid, id: uuid, panelConfig: componentDefinition }));
        }))) : null))));
    }
};
CronkPagePanel.style = cronkPagePanelCss;

export { CronkPagePanel as cronk_page_panel };
