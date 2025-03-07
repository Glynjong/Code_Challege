// Iteration loop
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};
// Sum of natural numbers
var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};
// Recursive 
var sum_to_n_c = function(n) {
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
};

console.log("Iterative:", sum_to_n_a(5));
console.log("Formula:", sum_to_n_b(5));
console.log("Recursive:", sum_to_n_c(5));