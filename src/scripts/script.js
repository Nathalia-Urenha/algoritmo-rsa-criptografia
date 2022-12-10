"use strict";

let n, l, e, d;

function calculate() {
    var p = document.getElementById("p").value;
    var q = randomPrime();

    if (!(validatePrime(p))) {
        return;
    }

    document.getElementById("q").value = q;

    n = p * q;
    document.getElementById("n").value = n;
    l = (p - 1) * (q - 1);
    document.getElementById("l").value = l;
    var ek = findEncryptionKeys(n, l);
    document.getElementById("e").value = ek[0];
    document.getElementById("encryption-keys").innerHTML = "<span class='color-black'>Possíveis chaves de criptografia são: </span>" + ek.join(', ');
    encryptionKeyChanged();

}

function findEncryptionKeys(n, l) {
    var ek = [];
    for (var i = 2; i < l; i++) {
        if (isCoPrime(i, n) && isCoPrime(i, l)) {
            ek.push(i);
            if (ek.length > 5) {
                break;
            }
        }
    }
    return ek;
}

function encryptionKeyChanged() {
    e = document.getElementById("e").value;
    var dk = findDecryptionKeys(l, e);
    dk.splice(dk.indexOf(e), 1);
    d = dk[0];
    document.getElementById("d").value = d;
    document.getElementById("decryption-keys").innerHTML = "<span class='color-black'>As possíveis chaves de descriptografia são: </span>" + dk.join(', ');
    document.getElementById("public-key").innerHTML = "(" + e + ", " + n + ")";
    document.getElementById("private-key").innerHTML = "(" + d + ", " + n + ")";
}

function findDecryptionKeys(l, e) {
    var dk = [];
    for (var d = l + 1; d < l + 100000; d++) {
        if ((d * e) % l === 1) {
            dk.push(d);
            if (dk.length > 5) {
                return dk;
            }
        }
    }
    return dk;
}

function decryptionKeyChanged() {
    d = document.getElementById("d").value;
    document.getElementById("private-key").innerHTML = "(" + d + ", " + n + ")";
}

function encryptMessage() {
    var message = document.getElementById("message").value;
    if (validateMessage(message)) {
        var m = Array.from(Array(message.length).keys()).map(i => message.charCodeAt(i));
        var c = m.map(i => modularExponentiation(i, e, n));
        document.getElementById("encrypted-message").innerHTML = c.join(", ");
        document.getElementById("encrypted-message-textbox").value = c.join(", ");
    } else {
        document.getElementById("not-prime").innerHTML = "<span class='color-black'>Digite um número entre 1 e 100.</span> O número, " + prime + " não é um número válido!<br><span class='color-dark-silver'><em>Recarregue a página e insira um número válido novamente</em></span>";
        return false;
    }
}

// validate if the message have length > 0 and < 20
function validateMessage(message) {
    if (message.length > 20) {
        document.getElementById("message").style.border = "1px solid red";
        alert("Digite uma mensagem de até 20 letras!");
        return false;
    }
    if (message.length == 0) {
        document.getElementById("message").style.border = "1px solid red";
        alert("Digite uma mensagem de até 20 letras!");
        return false;
    } else {
        document.getElementById("message").style.border = "1px solid #ccc";
        return true;
    }
}



function decryptMessage() {
    var c = stringToNumberArray(document.getElementById("encrypted-message-textbox").value);
    var m = c.map(i => modularExponentiation(i, d, n));
    var message = "";
    m.map(x => message += String.fromCharCode(x));
    document.getElementById("decrypted-message").innerHTML = message;
}

function validatePrime(prime) {
    if (prime > 100 || prime < 1) {
        document.getElementById("not-prime").innerHTML = "<span class='color-black'>Digite um número entre 1 e 100.</span> O número, " + prime + " não é um número válido!<br><span class='color-dark-silver'><em>Recarregue a página e insira um número válido novamente</em></span>";
        return false;
    }
    if (!isPrime(prime)) {
        document.getElementById("not-prime").innerHTML = "<span class='color-black'>Digite somente números primos.</span> O número, " + prime + " não é um número primo!<br><span class='color-dark-silver'><em>Recarregue a página e insira um número primo novamente</em></span>";
        return false;
    }
    return true;
};

function isPrime(num) {
    let sqrtNum = Math.sqrt(num);
    for (let i = 2; i <= sqrtNum; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return num !== 1;
}

function randomPrime() {
    var prime = Math.floor(Math.random() * 100) + 1;
    while (!isPrime(prime)) {
        prime = Math.floor(Math.random() * 100) + 1;
    }
    return prime;
}

function isCoPrime(a, b) {
    var aFac = findFactors(a);
    var bFac = findFactors(b);
    var result = aFac.every(x => bFac.indexOf(x) < 0);
    return result;
}

function findFactors(num) {
    var half = Math.floor(num / 2),
        result = [],
        i, j;
    num % 2 === 0 ? (i = 2, j = 1) : (i = 3, j = 2);
    for (i; i <= half; i += j) {
        num % i === 0 ? result.push(i) : false;
    }
    result.push(num);
    return result;
}

function modularExponentiation(base, exponent, modulus) {
    if (modulus === 1) {
        return 0;
    }
    var result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    return result;
}
function stringToNumberArray(str) {
    return str.split(",").map(i => parseInt(i));
}