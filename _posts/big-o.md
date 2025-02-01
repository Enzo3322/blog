---
title: "Entendendo a Complexidade de Algoritmos com Notação Big-O"
excerpt: "A notação Big-O é essencial para avaliar o desempenho de algoritmos. Neste artigo, vamos explorar os principais conceitos e exemplos para entender como medir a eficiência do seu código."
coverImage: "/assets/blog/big-o/hero.png"
date: "2025-01-31T12:00:00.000Z"
author:
  name: Enzo Spagnolli Direito
  picture: "https://avatars.githubusercontent.com/u/66880567?s=400&u=3028074e2a160c0ceb5b6d162b22c7d264f97a73&v=4"
ogImage:
  url: "/assets/blog/big-o/hero.png"
---

A complexidade de algoritmos é um dos fundamentos essenciais para qualquer desenvolvedor que deseja escrever código eficiente. A notação Big-O ajuda a entender o comportamento do tempo de execução de um algoritmo à medida que a entrada cresce.

# O que é a Notação Big-O?

Big-O é uma forma de descrever a taxa de crescimento do tempo de execução ou uso de memória de um algoritmo. Ela nos ajuda a classificar algoritmos de acordo com sua eficiência no pior caso.

Em termos simples, Big-O expressa a relação entre o número de operações que um algoritmo executa e o tamanho da entrada. Algumas das complexidades mais comuns incluem:

- O(1) - Tempo constante

- O(log n) - Tempo logarítmico

- O(n) - Tempo linear

- O(n log n) - Tempo quase linear

- O(n^2) - Tempo quadrático

- O(2^n) - Tempo exponencial

- O(n!) - Tempo fatorial

#### Exemplos Práticos

### O(1) - Tempo Constante

```js
function acessarPrimeiroElemento(array: number[]): number {
  return array[0];
}
```

Não importa o tamanho do array, a função sempre acessa um único elemento, mantendo um tempo de execução constante.

### O(n) - Tempo Linear

```js
function somarElementos(array: number[]): number {
  let soma = 0;
  for (const num of array) {
    soma += num;
  }
  return soma;
}
```

Aqui, o número de operações cresce proporcionalmente ao tamanho da entrada.

### O(n^2) - Tempo Quadrático

```js
function paresPossiveis(array: number[]): void {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      console.log(array[i], array[j]);
    }
  }
}
```

Com dois loops aninhados, a quantidade de operações cresce exponencialmente conforme o tamanho da entrada aumenta.

Como Otimizar Algoritmos?

Evite loops aninhados desnecessários

Prefira estruturas de dados eficientes (ex: Set em vez de Array para buscas)

Utilize técnicas como memoização e programação dinâmica

Entender Big-O é essencial para tomar decisões informadas ao projetar sistemas escaláveis. Sempre que possível, revise e otimize seus algoritmos para garantir que sua aplicação funcione de forma eficiente, mesmo em cenários de alto volume de dados.
