---
title: "Melhorando a Qualidade do Código com Poucos Passos"
excerpt: "Escrever código limpo e eficiente não precisa ser complicado. Descubra práticas simples que vão elevar a qualidade do seu código e torná-lo mais legível, escalável e manutenível."
coverImage: "/assets/blog/code-practices/hero.jpeg"
date: "2025-02-01T12:00:00.000Z"
author:
  name: Enzo Spagnolli Direito
  picture: "https://avatars.githubusercontent.com/u/66880567?s=400&u=3028074e2a160c0ceb5b6d162b22c7d264f97a73&v=4"
ogImage:
  url: "/assets/blog/code-practices/hero.jpeg"
---

Escrever código de qualidade não precisa ser difícil. Pequenos ajustes na sua abordagem podem melhorar significativamente a legibilidade, escalabilidade e manutenção do seu código. Vamos explorar algumas práticas simples que fazem uma grande diferença.

## 1. Use Nomes Significativos

Evite nomes genéricos como a, x ou data. Prefira nomes que explicam a intenção da variável, função ou classe.

```typescript
// Evite
function p(d) {
return d \* 0.9;
}

// Melhor
function calcularDesconto(preco: number): number {
return preco \* 0.9;
}
```

## 2. Escreva Funções Pequenas e Objetivas

Funções devem fazer apenas uma coisa e fazê-la bem. Se sua função está muito grande, provavelmente pode ser dividida em partes menores.

```javascript
// Evite
function processarPedido(pedido) {
  validarPedido(pedido);
  calcularTotal(pedido);
  aplicarDescontos(pedido);
  processarPagamento(pedido);
}

// Melhor
function processarPedido(pedido) {
  validarPedido(pedido);
  const total = calcularTotalComDescontos(pedido);
  processarPagamento(total);
}
```

## 3. Evite Código Duplicado

Código duplicado gera inconsistência e dificulta a manutenção. Utilize funções reutilizáveis para evitar repetição.

```javascript
// Evite duplicação
function calcularDesconto10(preco) {
  return preco * 0.9;
}
function calcularDesconto20(preco) {
  return preco * 0.8;
}

// Melhor
function calcularDesconto(preco, percentual) {
  return preco * (1 - percentual / 100);
}
```

4. Utilize Linters e Formatação Automática

Ferramentas como ESLint e Prettier ajudam a manter um código consistente e livre de erros desnecessários.

# Instale e configure o ESLint e o Prettier no seu projeto

```bash
npm install --save-dev eslint prettier
```

5. Escreva Testes Automatizados

Testes garantem que seu código funciona conforme esperado e evitam problemas ao modificar funcionalidades.

```javascript
import { expect } from "vitest";

describe("calcularDesconto", () => {
  it("deve aplicar corretamente um desconto de 10%", () => {
    expect(calcularDesconto(100, 10)).to.equal(90);
  });
});
```

Melhorar a qualidade do código não exige grandes mudanças, apenas pequenos hábitos diários. Ao adotar essas práticas, você tornará seu código mais confiável e sustentável a longo prazo!
