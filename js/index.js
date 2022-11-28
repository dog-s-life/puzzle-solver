const param = new URLSearchParams(window.location.search);

const quiz = param.get('quiz') || '1232431X4';
const goal = param.get('goal') || '4124213X3';
const trial = param.get('max') || '30';

const quizDom = document.getElementById('quiz');
const goalDom = document.getElementById('goal');

document.getElementById('trial').value = trial;
quizDom.value = quiz;
goalDom.value = goal;

function isQuizValid(str) {
    if (str.length !== 9 && str.length !== 16) {
        return false;
    }
    
    str = str.toLowerCase();
    
    if (/[^1-4x]/g.exec(str)) {
        return false;
    }

    if (str.split('x').length !== 2) {
        return false;
    }

    return true;
}

function isGoalValid(qz, str) {
    if (!isQuizValid(str)) {
        return false;
    }

    const src = [...(qz.toLowerCase())].sort();
    const dst = [...(str.toLowerCase())].sort();

    return src.every((ch, index) => ch === dst[index]);
}

function removeQuizPuzzle() {
    const table = document.getElementById('quiz-container').lastChild;
    if (table.tagName === 'TABLE') {
        table.remove();
    }
}

function removeGoalPuzzle() {
    const table = document.getElementById('goal-container').lastChild;
    if (table.tagName === 'TABLE') {
        table.remove();
    }
}

const updateQuizPuzzle = () => {
    // clear
    removeQuizPuzzle();

    document.getElementById('quiz-container').appendChild(createPuzzleDom(quizDom.value));

    document.getElementById('solve').disabled = !isGoalValid(quizDom.value, goalDom.value);
}

const updateGoalPuzzle = () => {
    // clear
    removeGoalPuzzle();

    document.getElementById('goal-container').appendChild(createPuzzleDom(goalDom.value));

    document.getElementById('solve').disabled = !isGoalValid(quizDom.value, goalDom.value);
}

quizDom.addEventListener('input', ev => {
    ev.target.value = ev.target.value.replace(/[^1-4xX]/g, '');

    updateQuizPuzzle();
});

goalDom.addEventListener('input', ev => {
    ev.target.value = ev.target.value.replace(/[^1-4xX]/g, '');

    updateGoalPuzzle();
});

updateQuizPuzzle();
updateGoalPuzzle();

const solveButton = document.getElementById('solve');
solveButton.addEventListener('click', ev => {
    ev.preventDefault();

    const resultDom = document.getElementById('result');
    resultDom.innerHTML = '';

    solveButton.disabled = true;
    solveButton.value = 'Solving...';

    const worker = new Worker('./js/solve.js');
    worker.onmessage = ev => {
        const steps = ev.data;

        solveButton.value = 'Solve';
        solveButton.disabled = false;
    
        if (!steps) {
            alert('solution not found OTL');
    
            return;
        }
    
        resultDom.appendChild(document.createElement('hr'))
    
        steps.forEach((step, index) => {
            if (!index) {
                return;
            }
    
            const stepDom = document.createElement('div');
    
            stepDom.innerHTML = `Step #${index}`;
            stepDom.appendChild(createPuzzleDom(step));
    
            resultDom.appendChild(stepDom);
        });    
    };

    worker.postMessage({
        quiz: document.getElementById('quiz').value,
        goal: document.getElementById('goal').value,
        maxTrial: document.getElementById('trial').valueAsNumber
    });
});