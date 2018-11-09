export function debounce (func, delay) {
    let tmr;
    return (...args) => {
        clearTimeout(tmr);
        tmr = setTimeout(() => func(...args), delay);
    }
}

export function throttle (func, threshold) {
    let last = 0, tmr;
    return (...args) => {
        let now = new Date;
        clearTimeout(tmr);
        if (now - last < threshold) {
            tmr = setTimeout(() => func(...args), threshold);
        } else {
            last = now;
            func(...args);
        }
    }
}