function left(str, size) {
    const index = str.indexOf('X');
    if (index % size === 0) {
        return null;
    }

    return str.substring(0, index - 1) + 'X' + str.charAt(index - 1) + str.substring(index + 1);
}

function right(str, size) {
    const index = str.indexOf('X');
    if (index % size === size - 1) {
        return null;
    }

    return str.substring(0, index) + str.charAt(index + 1) + 'X' + str.substring(index + 2);
}

function up(str, size) {
    const index = str.indexOf('X');
    if (Math.floor(index / size) === 0) {
        return null;
    }

    return str.substring(0, index - size) + 'X' + str.substring(index - size + 1, index) + str.charAt(index - size) + str.substring(index + 1);
}

function down(str, size) {
    const index = str.indexOf('X');
    if (Math.floor(index / size) === size - 1) {
        return null;
    }

    return str.substring(0, index) + str.charAt(index + size) + str.substring(index + 1, index + size) + 'X' + str.substring(index + size + 1);
}

let results = [];
let stack = [];
let maxDepth = 30;

function traverse(current, goal, size) {
    if (stack.includes(current)) {
        return false;
    }

    if (stack.length >= maxDepth - 1) {
        return false;
    }

    stack.push(current);

    if (current === goal) {
        results.push(stack.slice());
        maxDepth = stack.length;
        stack.pop();

        return true;
    }

    // left
    let result = false;
    let next = left(current, size);
    if (next) {
        result = traverse(next, goal, size);
    }

    next = right(current, size);
    if (next) {
        result = traverse(next, goal, size);
    }

    next = up(current, size);
    if (next) {
        result = traverse(next, goal, size);
    }

    next = down(current, size);
    if (next) {
        result = traverse(next, goal, size);
    }

    stack.pop();

    return result;
}

function solve(input, goal, maxTrial = 30) {
    const size = Math.floor(Math.sqrt(input.length));

    results = [];
    stack = [];
    maxDepth = maxTrial;

    traverse(input.replace(/|/g, ''), goal.replace(/|/g, ''), size);

    if (!results.length) {
        return null;
    }

    const out = results.sort((a, b) => a.length - b.length);
    return out[0];
}

self.onmessage = e  => {
    const { quiz, goal, maxTrial } = e.data;

    const result = solve(quiz, goal, maxTrial);

    self.postMessage(result);
};
