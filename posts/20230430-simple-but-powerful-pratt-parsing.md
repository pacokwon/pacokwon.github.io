---
title: 'Simple but Powerful Pratt Parsing'
tags:
  - parsing
---

아래 글은 [matklad](https://github.com/matklad)의 [Simple but Powerful Pratt Parsing](https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html)의 번역 포스팅입니다. 제 스스로의 이해를 돕기 위함이 목적이지만, 유익한 글인 것 같아 블로그에 소개하고도 싶었습니다.

## Simple but Powerful Pratt Parsing

프랫 파싱 글에 온 것을 환영합니다! 프랫 파싱은 구문 분석계의 모나드 튜토리얼과 같다고도 할 수 있습니다. 이 주제에 관한 소개글은 너무 많아서 [이런 튜토리얼 모음](https://www.oilshell.org/blog/2017/03/31.html)까지 있을 정도입니다.

이 글의 목표는 아래와 같습니다.

- 이른바 left-recursion 문제가 과장되었음을 제기하기 위해
- BNF 표기법이 중위표현식을 표현하기에 부적합함을 지적하기 위해
- 프랫 파싱 알고리즘의 구현을 과한 추상화 없이, 있는 그대로 보여주기 위해
- 이 알고리즘을 제가 제대로 이해하기 위해 (제가 실사용 용도로 프랫 파서를 [구현](https://github.com/rust-lang/rust-analyzer/blob/c388130f5ffbcbe7d3131213a24d12d02f769b87/crates/ra_parser/src/grammar/expressions.rs#L280-L281)한 적이 있는데, 이제는 코드를 봐도 바로 이해되지가 않더라고요)

## Introduction

파싱이라는 것은, 일련의 토큰들이 컴파일러에 의해 트리 구조로 변환되는 과정을 이야기합니다.

```plaintext
                            Add
                 Parser     / \
 "1 + 2 * 3"    ------->   1  Mul
                              / \
                             2   3
```

파싱을 접근하는 방식은 다양한데, 크게 두 부류로 나눠볼 수 있습니다.

- 파싱하려는 언어의 문법을 DSL을 사용하여 표현하고, 그 문법을 이용하여 파서를 생성해내는 방법
- 직접 손으로 파서를 작성하는 방법

두 번째 방식 안에서 가장 널리 사용되는 기법이 바로 프랫 파싱입니다.

## BNF

문맥 자유(Context-Free) 문법 표기법(주로 BNF concrete syntax를 사용)은 구문분석 이론에 중요한 발견이었습니다. BNF를 사용하면 다음과 같이 본래 선형적인 문장 구조를 트리 형태로 나타낼 수 있습니다.

```plaintext
Item ::=
    StructItem
  | EnumItem
  | ...

StructItem ::=
    'struct' Name '{' FieldList '}'

...
```

처음 이 기법을 보며 감탄했던 기억이 납니다.

표현식을 나타내는 방식을 보고 갑자기 좀 서운해졌지만요.

표현식을 나타내는 직관적인 형태의 문법을 살펴보겠습니다.

```plaintext
Expr ::=
    Expr '+' Expr
  | Expr '*' Expr
  | '(' Expr ')'
  | 'number'
```

꽤 직관적이죠. 근데 사실 위 문법은 **모호**해서 자동 파서 생성기(위에서 언급된 1번 방식)에 사용되기 위해서는 고쳐서 작성되어야 합니다. 더 구체적으로 얘기하자면, 연산자의 우선순위와 결합방향을 잘 고려한 문법을 작성해야 하는데요, 아래와 같이 수정하면 앞서 언급된 문제들을 해결할 수 있습니다.

```plaintext
Expr ::=
    Factor
  | Expr '+' Factor

Factor ::=
    Atom
  | Factor '*' Atom

Atom ::=
    'number'
  | '(' Expr ')'
```

어떤가요? 솔직히 이 새로운 문법은 제가 처음 생각했던 표현식의 모양과는 전혀 달라 보입니다. 가장 먼저 나온 모호한 문법이 더 직관적이고, 더군다나 제가 스스로 문법을 이렇게 고칠 수 있을때까지 언어론에 대해 전공수업만 세네개 들었어야 했던 것 같습니다.

이것이 제가 프랫 파싱을 좋아하는 이유입니다. 문법을 부자연스럽게 고쳐야 하는 재귀하향식 파싱 기법에서 발전해서, 연산자와 결합방향을 자연스럽게 표현할 수 있기 때문입니다.

## 재귀하향과 Left-Recursion

재귀하향은 직접 파서를 짤 때 사용할 수 있는 가장 기본적인 기법입니다. 이 기법은 서로 재귀적인 함수들을 사용하여 파싱을 하는데, 예를 들어 위에 있는 문법은 재귀하향을 썼을 때 다음과 같이 코드로 표현할 수 있습니다.

```rust
fn item(p: &mut Parser) {
    match p.peek() {
        STRUCT_KEYWORD => struct_item(p),
        ENUM_KEYWORD   => enum_item(p),
        ...
    }
}

fn struct_item(p: &mut Parser) {
    p.expect(STRUCT_KEYWORD);
    name(p);
    p.expect(L_CURLY);
    field_list(p);
    p.expect(R_CURLY);
}
```

보통 교과서들은 Left Recursive 문법을 이 접근 방식의 단점이라고 지적하면서, 더 심화된 LR 파싱 기법으로 넘어가는 동기로 삼습니다. Left Recursion은 분명히 문제가 되는 시점들이 있는데, 아래 문법을 한 번 보겠습니다.

```plaintext
Sum ::=
    Sum '+' Int
  | Int
```

재귀하향 방식으로 위 문법에 대한 파서를 작성해보겠습니다.

```rust
fn sum(p: &mut Parser) {
    // Sum '+' Int가 되는지 먼저 시도해본다
    sum(p); // ①
    p.expect(PLUS);
    int(p);
    // 위에서 실패했으면, 그 다음 후보지를 시도해본다.
    ...
}
```

1. 이 코드를 실행하면 코드가 무한 재귀에 빠져버려서 스택 오버플로우가 발생해버립니다.

이런 문제를 고치기 위한 이론적인 방법은 역시 문법을 수정해서, **같은 언어를 표현하되 위와 같은 문제가 발생하지 않도록 Left Recursion을 없앤 문법**을 작성하는 것입니다.

하지만 직접 작성하는 파서의 경우에는 실용적인 해결방법도 있는데, 그냥 재귀를 버리고 반복문을 사용하는 것입니다.

```rust
fn sum(p: &mut Parser) {
    int(p);
    while p.eat(PLUS) {
        int(p);
    }
}
```

## 프랫 파싱의 뼈대

위와 같이 반복문을 이용해서 Left Recursion을 실용적으로 대처하는 방법을 보았는데, 프랫 파싱은 반복문과 재귀를 동시에 사용합니다.

```rust
fn parse_expr() {
    ...
    loop {
        ...
        parse_expr()
        ...
    }
}
```

위에 있는 코드는 연산자 우선순위와 결합방향을 잘 처리해줍니다. 머리가 띵해지긴 하지만요.

## 우선순위에서 결합 세기로

솔직히 말하면 저는 "높은 우선순위"와 "낮은 우선순위"라는 용어를 보며 항상 헷갈리는 것 같습니다. `a + b * c` 라는 표현식 안에서 덧셈은 우선순위가 **낮은데**, 파싱 트리에서는 **맨 위에** 있습니다.

그래서 저는 **결합 세기**라는 표현이 더 직관적이라고 생각합니다.

```plaintext
expr:   A       +       B       *       C
power:      3       3       5       5
```

`*`이 더 세니까 B와 C를 끌어당기는 힘이 더 세고, 위 표현식은 `A + (B * C)`와 같이 파싱이 되는 것입니다.

결합 방향은 어떻게 표현할 수 있을까요? `A + B + C`를 보면 모든 연산자들이 같은 세기를 가지고 있어서 어떻게 파싱이 되어야 할지 불명확합니다. 하지만 이것도 아래와 같이 결합 세기로 표현할 수가 있습니다.

```plaintext
expr:      A       +       B       +       C
power:  0      3      3.1      3      3.1     0
```

오른쪽 피연산자를 당기는 힘이 더 강해지도록 `+`의 오른쪽 결합 세기를 조금 올린 것을 볼 수 있습니다. 양옆 끝에 `0`이 있는 것도 볼 수 있는데, 이건 맨 끝에서는 당기는 힘이 없다는 것을 표현한 것입니다. B의 입장에서 봤을 때, 왼쪽에서 더 강하게 결합하려고 하기 때문에 우선 첫 단계로는 아래와 같이 파싱이 될 것입니다.

```plaintext
expr:     (A + B)     +     C
power:  0          3    3.1    0
```

그 다음 단계를 거치면 결국 `(A + B) + C` 가 됩니다.

프랫 파싱이 하는 일은 스트링을 왼쪽에서 오른쪽으로 읽으며 우리가 위에서 본 과정을 전부 처리하는 것입니다.

오른쪽으로 결합하는 연산자는 어떻게 처리하면 좋을까요? 예시로, 하스켈에 있는 함수 합성 연산자 `.`는 다음과 같이 모델링할 수 있습니다

```plaintext
  f     .    g     .    h
0   8.5    8   8.5    8   0
```

그러면 위 표현식은 `f . (g . h)` 와 같이 파싱이 되는 것입니다.

## 미니멀한 프랫 파서

이제부터 프랫 파서를 이용해서 캐릭터 하나짜리 숫자와 변수(묶어서 아톰), 그리고 특수문자를 사용한 연산자가 있는 표현식을 파싱해보겠습니다.

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Token {
    Atom(char),
    Op(char),
    Eof,
}

struct Lexer {
    tokens: Vec<Token>,
}

impl Lexer {
    fn new(input: &str) -> Lexer {
        let mut tokens = input
            .chars()
            .filter(|it| !it.is_ascii_whitespace())
            .map(|c| match c {
                '0'..='9' |
                'a'..='z' | 'A'..='Z' => Token::Atom(c),
                _ => Token::Op(c),
            })
            .collect::<Vec<_>>();
        tokens.reverse();
        Lexer { tokens }
    }

    fn next(&mut self) -> Token {
        self.tokens.pop().unwrap_or(Token::Eof)
    }

    fn peek(&mut self) -> Token {
        self.tokens.last().copied().unwrap_or(Token::Eof)
    }
}
```

결합 세기가 잘 반영되어 파싱됐는지 확인해보기 위해, 파싱된 표현식을 중위표현식에서 널리 사용되는 표현 방식으로 변환해보겠습니다. 이 방식은 (아마도 폴란드에서는 별로 인기가 없겠지만) 바로 S-표현식입니다. Lisp 계열 언어에서 지겹도록 볼 수있는 표현 방식이죠.

```plaintext
1 + 2 * 3 == (+ 1 (* 2 3))
```

```rust
use std::fmt;

enum S {
    Atom(char),
    Cons(char, Vec<S>),
}

impl fmt::Display for S {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            S::Atom(i) => write!(f, "{}", i),
            S::Cons(head, rest) => {
                write!(f, "({}", head)?;
                for s in rest {
                    write!(f, " {}", s)?
                }
                write!(f, ")")
            }
        }
    }
}
```

단순하게 시작하죠. 먼저 아톰과 `+`, `*` 연산자만으로 이루어진 표현식을 파싱해봅시다.

```rust
fn expr(input: &str) -> S {
    let mut lexer = Lexer::new(input);
    expr_bp(&mut lexer)
}

fn expr_bp(lexer: &mut Lexer) -> S {
    todo!()
}

#[test]
fn tests() {
    let s = expr("1 + 2 * 3");
    assert_eq!(s.to_string(), "(+ 1 (* 2 3))")
}
```

위에서 본 left recursion에 대한 **실용적인 대처방식**과 유사하게 접근해보겠습니다. 먼저 숫자를 파싱하고, 반복문을 돌고, 연산자를 파싱하고 나서는, 음.. 아직은 모르겠네요.

```rust
fn expr_bp(lexer: &mut Lexer) -> S {
    let lhs = match lexer.next() {
        Token::Atom(it) => S::Atom(it),
        t => panic!("bad token: {:?}", t),
    };

    loop {
        let op = match lexer.next() {
            Token::Eof => break,
            Token::Op(op) => op,
            t => panic!("bad token: {:?}", t),
        };
        todo!()
    }
    lhs
}

#[test]
fn tests() {
    let s = expr("1");
    assert_eq!(s.to_string(), "1");
}
```

그래도 첫 번째 테스트는 벌써 통과합니다!

앞서 언급한 **결합 세기**의 개념을 코드에 도입해봅시다. 각 연산자마다 양옆을 당기는 힘을 `u8`로 각각 나타내고, 결합 방향을 표현하기 위해 한쪽의 결합 세기가 `1` 더 크도록 설정하겠습니다. `0`을 입력의 마지막 부분을 나타내는 결합 세기로 나타내고, 연산자 중 가장 낮은 결합 세기를 `1`이라고 미리 약속해두겠습니다.

```rust
fn expr_bp(lexer: &mut Lexer) -> S {
    let lhs = match lexer.next() {
        Token::Atom(it) => S::Atom(it),
        t => panic!("bad token: {:?}", t),
    };
    loop {
        let op = match lexer.peek() {
            Token::Eof => break,
            Token::Op(op) => op,
            t => panic!("bad token: {:?}", t),
        };
        let (l_bp, r_bp) = infix_binding_power(op);
        todo!()
    }
    lhs
}

fn infix_binding_power(op: char) -> (u8, u8) {
    match op {
        '+' | '-' => (1, 2),
        '*' | '/' => (3, 4),
        _ => panic!("bad op: {:?}")
    }
}
```

이제부터 조금 복잡해질텐데, 재귀호출을 사용해보겠습니다. 아래 예시를 보겠습니다.

```plaintext
a   +   b   *   c   *   d   +   e
  1   2   3   4   3   4   1   2
```

파싱은 토큰을 왼쪽에서 오른쪽으로 스캔하며 진행이 될텐데, 현재 토큰을 가리키는 커서가 있다고 생각해보죠.

커서가 처음 `+`를 만나게 되면, `l_bp`는 `1`, `r_bp`는 `2`일 것이고, `lhs`는 `a`를 담고 있을 것입니다. 다음에 보이는 연산자인 `*`는 `+`보다 우선순위가 높으니, `a`와 `b`는 더하면 안되겠죠? 하지만 우리는 왼쪽에서 오른쪽으로 커서를 움직이고 있으니, `+`를 바라보고 있는 시점에는 `*`의 존재 유무를 모를 것입니다. lookahead(전방탐색)를 추가하면 해결할 수 있을까요? 안될건 없지만 그 범위가 얼마나 될지 가늠이 안됩니다. 지금 예시만 봐도 `b`, `c`, `d` 토큰을 전부 스캔해야만 우선순위 처리를 제대로 할 수 있을 테니까요.

첫 번째 `+`이후에 나오는 표현식 `b * c * d`까지는 높은 우선순위로 파싱을 해야 합니다. 이는 꽤 직관적으로 판단할 수 있죠. 근데 `d`까지만 파싱해야 하는 이유는 무엇일까요? 그 다음에 나오는 `+`의 우선순위가 처음에 본 `+`의 우선순위보다 높지 않기 때문입니다. 그 전까지 본 연산자들(`*`)은 모두 `+`보다 우선순위가 높았다는 것을 볼 수 있습니다.

이를 처리하기 위해 재귀를 사용하겠습니다. `b`에서 다시 `expr_bp`를 호출하면서, `+`보다 우선순위가 낮아지는 즉시, 즉 `bp`가 `2`보다 낮아지는 순간에 파싱을 멈추는 것입니다.

자, 아래에 미니멀한 프랫 파서가 완성되었습니다.

```rust
fn expr(input: &str) -> S {
    let mut lexer = Lexer::new(input);
    expr_bp(&mut lexer, 0) // 5
}

fn expr_bp(lexer: &mut Lexer, min_bp: u8) -> S { // 1
    let mut lhs = match lexer.next() {
        Token::Atom(it) => S::Atom(it),
        t => panic!("bad token: {:?}", t),
    };

    loop {
        let op = match lexer.peek() {
            Token::Eof => break,
            Token::Op(op) => op,
            t => panic!("bad token: {:?}", t),
        };

        let (l_bp, r_bp) = infix_binding_power(op);
        if l_bp < min_bp { // 2
            break;
        }

        lexer.next(); // 3
        let rhs = expr_bp(lexer, r_bp);
        lhs = S::Cons(op, vec![lhs, rhs]); // 4
    }

    lhs
}

fn infix_binding_power(op: char) -> (u8, u8) {
    match op {
        '+' | '-' => (1, 2),
        '*' | '/' => (3, 4),
        _ => panic!("bad op: {:?}"),
    }
}

#[test]
fn tests() {
    let s = expr("1");
    assert_eq!(s.to_string(), "1");

    let s = expr("1 + 2 * 3");
    assert_eq!(s.to_string(), "(+ 1 (* 2 3))");

    let s = expr("a + b * c * d + e");
    assert_eq!(s.to_string(), "(+ (+ a (* (* b c) d)) e)");
}
```

1. `min_bp` 인자는 아주 중요한 변경사항입니다. `expr_bp`는 이제 특정 결합 세기 이상의 표현식만 파싱할 수도 있습니다. `min_bp`보다 결합 강도가 낮은 연산자를 만났을 경우, 즉시 파싱을 중단합니다.
2. 이곳이 바로 파싱을 중단하는 시점입니다.
3. `next` 호출로 인해 연산자 위에 있던 커서를 한 칸 움직이고, 재귀호출을 합니다. `min_bp`를 연산자의 `l_bp`와 비교하는 모습을 확인할 수 있습니다. 어떻게 보면 `min_bp`는 현재 파싱하고 있는 커다란 표현식의 왼쪽에 위치한 연산자의 결합 세기라고 생각할 수 있습니다.
4. `rhs`를 잘 파싱하고 난 이후에는, 이미 파싱한 `lhs`와 결합하여 새로운 `lhs`를 만들어냅니다.
5. 재귀호출의 시작 인자는 `0`입니다. 표현식의 양끝은 연산자가 없으므로 결합 세기가 `0`이라고 위에서 언급한 바 있습니다.

위에 있는 약 40줄의 코드가 프랫 파싱 알고리즘이라고 할 수 있겠습니다. 조금 까다롭긴 하지만, 열심히 이해하고 나면, 이후에 추가하는 기능들은 꽤 단순합니다.

## 연산자 추가해보기

기본적인 뼈대는 완성되었으니, 이 알고리즘의 진가를 보여드리기 위해 다양한 표현식을 추가해보겠습니다.

먼저, 높은 우선순위를 가지고, 오른쪽으로 결합하는 함수 합성 연산자인 `.`을 추가해보겠습니다.

```rust
fn infix_binding_power(op: char) -> (u8, u8) {
    match op {
        '+' | '-' => (1, 2),
        '*' | '/' => (3, 4),
        '.' => (6, 5), // NEW
        _ => panic!("bad op: {:?}"),
    }
}
```

맞습니다. 위와 같이 한 줄만 추가하면 충분합니다. 기존에 추가된 다른 연산자들과는 다르게 왼쪽 결합 세기가 더 강한 것을 확인할 수 있습니다. 결합 방향이 오른쪽이기를 원하기 때문이죠.

```rust
let s = expr("f . g . h");
assert_eq!(s.to_string(), "(. f (. g h))");

let s = expr(" 1 + 2 + f . g . h * 3 * 4");
assert_eq!(s.to_string(), "(+ (+ 1 2) (* (* (. f (. g h)) 3) 4))");
```

### 전위 단항연산자 `-`

이제 단항연산자 `-`를 추가해보겠습니다. 이 연산자는 이항 산술연산자들보다는 더 강하게 결합하고, 함수 합성 연산자(`.`)보다는 약하게 결합합니다.

단항연산자가 추가되면 수정해야 하는 부분이 있습니다. 루프가 시작하는 시점에 첫 번째 토큰은 아톰만 가능하다고 가정했으나, `-5`와 같이 연산자로 시작하는 표현식이 생기기 때문에 이 또한 처리해주어야 합니다.

`-`는 전위 단항연산자이므로 오른쪽 결합 세기만 있습니다. 이를 타입을 통해 나타내보겠습니다.

```rust
fn prefix_binding_power(op: char) -> ((), u8) { // 1
    match op {
        '+' | '-' => ((), 5),
        _ => panic!("bad op: {:?}", op),
    }
}

fn infix_binding_power(op: char) -> (u8, u8) {
    match op {
        '+' | '-' => (1, 2),
        '*' | '/' => (3, 4),
        '.' => (8, 7), // 2
        _ => panic!("bad op: {:?}"),
    }
}
```

1. 전위 연산자임을 명확하게 하기 위해 타입을 이와 같이 지정하겠습니다. 이 연산자들은 오른쪽에 있는 표현식들과만 결합할 수 있습니다.
2. 단항연산자 `-`가 `.`보다는 약하게, 이항 `-`, `+` 보다는 강하게 결합하는 이전에 연산자임을 언급하였습니다. 이를 반영하기 위해 우선순위 값들의 조정이 필요합니다. 일반적으로는 홀수를 기본 결합세기로 맞춰놓은 다음, 결합 방향을 반영하기 위해 한쪽의 세기를 `1` 늘려주는 접근 방식을 사용합니다. 단항 `-`는 `5`, `6` 둘 다 상관없지만 일관성을 위해 홀수로 지정하였습니다.

`expr_bp`에 이를 반영해보겠습니다.

```rust
fn expr_bp(lexer: &mut Lexer, min_bp: u8) -> S {
    let mut lhs = match lexer.next() {
        Token::Atom(it) => S::Atom(it),
        Token::Op(op) => {
            let ((), r_bp) = prefix_binding_power(op);
            todo!()
        }
        t => panic!("bad token: {:?}", t),
    };
    ...
}
```

이제 반복문 안에 있는 `r_bp` 관련 로직들을 가져와 `todo!()`를 채워봅시다. 일부 코드는 `l_bp`와 관련있으니 제외하고 가져올 수 있습니다.

```rust
fn expr_bp(lexer: &mut Lexer, min_bp: u8) -> S {
    let mut lhs = match lexer.next() {
        Token::Atom(it) => S::Atom(it),
        Token::Op(op) => {
            let ((), r_bp) = prefix_binding_power(op);
            let rhs = expr_bp(lexer, r_bp);
            S::Cons(op, vec![rhs])
        }
        t => panic!("bad token: {:?}", t),
    };

    loop {
        let op = match lexer.peek() {
            Token::Eof => break,
            Token::Op(op) => op,
            t => panic!("bad token: {:?}", t),
        };

        let (l_bp, r_bp) = infix_binding_power(op);
        if l_bp < min_bp {
            break;
        }

        lexer.next();
        let rhs = expr_bp(lexer, r_bp);

        lhs = S::Cons(op, vec![lhs, rhs]);
    }
    lhs
}

#[test]
fn tests() {
    ...

    let s = expr("--1 * 2");
    assert_eq!(s.to_string(), "(* (- (- 1)) 2)");

    let s = expr("--f . g");
    assert_eq!(s.to_string(), "(- (- (. f g)))");
}
```

이미 적어둔 로직을 거의 기계적으로 가져와 사용해봤는데, 꽤 잘 작동하는 것을 볼 수 있습니다. 먼저 단항연산자를 파싱하고 (있는 경우에), 그 연산자보다 강하게 결합하는 피연산자를 재귀호출을 통해 파싱하는 것입니다.

### 후위연산자도 처리할 수 있을까?

전위연산자 처리 로직을 넣어보았습니다. 이를 위해 `((), u8)` 타입을 사용했는데, 그럼 `(u8, ())`을 사용하면 후위연산자를 처리할 수 있을까요? 한번 해봅시다. 팩토리얼(`!`) 연산자가 적합한 것 같네요. `-`보다는 더 강하게 결합해야 할 것 같습니다. `-(92!)`가 `(-92)!`보다는 더 유용할 테니까요. 전위연산자를 추가할 때와 동일한 방법으로 진행해보겠습니다.

```rust
let (l_bp, ()) = postfix_binding_power(op);
if l_bp < min_bp {
    break;
}

let (l_bp, r_bp) = infix_binding_power(op);
if l_bp < min_bp {
    break;
}
```

근데 뭔가 이상합니다. 전위 표현식을 파싱한 이후에는, 중위 연산자 **혹은** 후위 연산자를 만날 수 있습니다. 하지만 우리는 이미 등록되어있지 않은 연산자에 대해서는 그냥 `panic!`을 해버립니다. 후위연산자가 없는 경우에는 중위연산자를 찾아보도록 코드를 바꿔봅시다. 그러기 위해 `postfix_binding_power`이 option 타입을 돌려주도록 하겠습니다.

```rust
fn expr_bp(lexer: &mut Lexer, min_bp: u8) -> S {
    let mut lhs = match lexer.next() {
        Token::Atom(it) => S::Atom(it),
        Token::Op(op) => {
            let ((), r_bp) = prefix_binding_power(op);
            let rhs = expr_bp(lexer, r_bp);
            S::Cons(op, vec![rhs])
        }
        t => panic!("bad token: {:?}", t),
    };

    loop {
        let op = match lexer.peek() {
            Token::Eof => break,
            Token::Op(op) => op,
            t => panic!("bad token: {:?}", t),
        };

        // CHANGE START
        if let Some((l_bp, ())) = postfix_binding_power(op) {
            if l_bp < min_bp {
                break;
            }

            lexer.next();
            lhs = S::Cons(op, vec![lhs]);

            continue;
        }
        // CHANGE END

        let (l_bp, r_bp) = infix_binding_power(op);
        if l_bp < min_bp {
            break;
        }

        lexer.next();
        let rhs = expr_bp(lexer, r_bp);

        lhs = S::Cons(op, vec![lhs, rhs]);
    }

    lhs
}

fn prefix_binding_power(op: char) -> ((), u8) {
    match op {
        '+' | '-' => ((), 5),
        _ => panic!("bad op: {:?}", op),
    }
}

fn postfix_binding_power(op: char) -> Option<(u8, ())> {
    let res = match op {
        '!' => (7, ()),
        _ => return None,
    };
    Some(res)
}

fn infix_binding_power(op: char) -> (u8, u8) {
    match op {
        '+' | '-' => (1, 2),
        '*' | '/' => (3, 4),
        '.' => (10, 9),
        _ => panic!("bad op: {:?}"),
    }
}

#[test]
fn tests() {
    let s = expr("-9!");
    assert_eq!(s.to_string(), "(- (! 9))");

    let s = expr("f . g !");
    assert_eq!(s.to_string(), "(! (. f g))");
}
```

신기하게도 기존 테스트와 신규 테스트 모두 통과합니다.

### 괄호 표현식

새로운 표현식을 처리해봅시다. 바로 괄호 표현식인데요, 생각보다 어렵지 않습니다. 괄호 표현식은 꽤 기초적인 표현식으로 아톰과 비슷한 방식으로 처리할 수 있습니다.

```rust
let mut lhs = match lexer.next() {
    Token::Atom(it) => S::Atom(it),
    Token::Op('(') => {
        let lhs = expr_bp(lexer, 0);
        assert_eq!(lexer.next(), Token::Op(')'));
        lhs
    }
    Token::Op(op) => {
        let ((), r_bp) = prefix_binding_power(op);
        let rhs = expr_bp(lexer, r_bp);
        S::Cons(op, vec![rhs])
    }
    t => panic!("bad token: {:?}", t),
};
```

하지만 이 테스트는 아직 통과하지 않습니다.

```rust
let s = expr("(((0)))");
assert_eq!(s.to_string(), "0");
```

에러는 `loop` 블록에서 발생합니다. 현재 코드에서, 반복문에서 빠져나오는 유일한 조건은 `Eof`를 만났을 때입니다. 근데 이 지점에서 `)`를 만나면서, 이 `)` "연산자"가 밑에 있는 `infix_binding_power`에 넘겨지며 `panic!`을 하는 것이지요. 이를 해결하기 위한 가장 쉬운 방법은 `infix_binding_power`도 `postfix_binding_power`와 마찬가지로 식별하지 못한 연산자에 대해서는 option을 돌려주게 하는 것입니다.

이제는 테스트가 잘 통과하네요!

### 배열 접근 연산자 `[]`

이제 배열 접근 연산자인 `a[i]`를 구현해봅시다. 지금까지 본 연산자들은 전위, 중위, 후위와 같이 분류할 수가 있었습니다. 이건 뭘까요? 그냥 `a[]`와 같이 생겼었다면 후위연산자였을 것이고, `[i]`였다면 괄호 표현식과 동일하게 동작했을 것입니다. 하지만 괄호 표현식과 비슷한 점이 있다면 괄호 안에 있는 표현식은 우선순위에 얽매이지 않는다는 겁니다. 한번 코드를 보겠습니다.

```rust
fn expr_bp(lexer: &mut Lexer, min_bp: u8) -> S {
    let mut lhs = match lexer.next() {
        Token::Atom(it) => S::Atom(it),
        Token::Op('(') => {
            let lhs = expr_bp(lexer, 0);
            assert_eq!(lexer.next(), Token::Op(')'));
            lhs
        }
        Token::Op(op) => {
            let ((), r_bp) = prefix_binding_power(op);
            let rhs = expr_bp(lexer, r_bp);
            S::Cons(op, vec![rhs])
        }
        t => panic!("bad token: {:?}", t),
    };

    loop {
        let op = match lexer.peek() {
            Token::Eof => break,
            Token::Op(op) => op,
            t => panic!("bad token: {:?}", t),
        };

        if let Some((l_bp, ())) = postfix_binding_power(op) {
            if l_bp < min_bp {
                break;
            }
            lexer.next();

			// CHANGE START
            lhs = if op == '[' {
                let rhs = expr_bp(lexer, 0);
                assert_eq!(lexer.next(), Token::Op(']'));
                S::Cons(op, vec![lhs, rhs])
            } else {
                S::Cons(op, vec![lhs])
            };
			// CHANGE END
            continue;
        }

        if let Some((l_bp, r_bp)) = infix_binding_power(op) {
            if l_bp < min_bp {
                break;
            }

            lexer.next();
            let rhs = expr_bp(lexer, r_bp);

            lhs = S::Cons(op, vec![lhs, rhs]);
            continue;
        }

        break;
    }

    lhs
}

fn prefix_binding_power(op: char) -> ((), u8) {
    match op {
        '+' | '-' => ((), 5),
        _ => panic!("bad op: {:?}", op),
    }
}

fn postfix_binding_power(op: char) -> Option<(u8, ())> {
    let res = match op {
        '!' | '[' => (7, ()), // 1
        _ => return None,
    };
    Some(res)
}

fn infix_binding_power(op: char) -> Option<(u8, u8)> {
    let res = match op {
        '+' | '-' => (1, 2),
        '*' | '/' => (3, 4),
        '.' => (10, 9),
        _ => return None,
    };
    Some(res)
}

#[test]
fn tests() {
    ...
    let s = expr("x[0][1]");
    assert_eq!(s.to_string(), "([ ([ x 0) 1)");
}
```

1. `!`과 `[`에 동일한 우선순위를 부여한 것이 보이나요? 일반적으로는 이 알고리즘의 correctness를 위해서 우선순위가 겹치지 않게 하는 것이 꽤 중요합니다. 하지만 우리가 결합 세기를 비교하는 경우에는, **오른쪽 결합 세기**와 **왼쪽 결합 세기**만 비교하기 때문에, 두 후위연산자의 결합 세기가 겹쳐도 문제가 생기지 않습니다.

### 삼항연산자 `? :`

최종 보스를 만나보겠습니다. 바로 삼항연산자입니다.

```plaintext
c ? e1 : e2
```

이건 어떻게 분류해야 할까요?? 한번 기호만 살짝 바꿔보겠습니다.

```plaintext
c [ e1 ] e2
```

감이 잡히나요? 앞부분에서 `a[i]`는 후위연산자 + 괄호표현식인 것을 보았습니다. 그러니 어떻게 보면 삼항연산자는 `a[i]`의 변형된 형태라고 생각할 수 있습니다. 이제 결합 세기와 방향을 생각해보겠습니다. 이런 경우에는 결합 방향이 어떻게 될까요?

```plaintext
a ? b : c ? d : e
```

더 단순하게 보기 위해 좀 생략된 표현을 보겠습니다.

```plaintext
a ?: c ?: e
```

위 표현식은 이렇게 파싱하거나:

```plaintext
(a ?: c) ?: e
```

이렇게 파싱할 수도 있습니다.

```plaintext
a ?: (c ?: e)
```

무엇이 더 유용할까요? 이렇게 연속으로 사용하는 경우에는:

```plaintext
a ? b :
c ? d :
e
```

오른쪽으로 결합하는 쪽이 더 유용할 것 같네요. 결합 세기의 경우에는, 꽤 낮은 우선순위를 가지고 있습니다. [C언어에서는](https://en.cppreference.com/w/c/language/operator_precedence) `=`와 `,`만이 더 낮은 우선순위를 가지고 있습니다.

아래 코드를 통해 저희의 완성된 프랫 파서를 볼 수 있습니다.

```rust
use std::{fmt, io::BufRead};

enum S {
    Atom(char),
    Cons(char, Vec<S>),
}

impl fmt::Display for S {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            S::Atom(i) => write!(f, "{}", i),
            S::Cons(head, rest) => {
                write!(f, "({}", head)?;
                for s in rest {
                    write!(f, " {}", s)?
                }
                write!(f, ")")
            }
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Token {
    Atom(char),
    Op(char),
    Eof,
}

struct Lexer {
    tokens: Vec<Token>,
}

impl Lexer {
    fn new(input: &str) -> Lexer {
        let mut tokens = input
            .chars()
            .filter(|it| !it.is_ascii_whitespace())
            .map(|c| match c {
                '0'..='9'
                | 'a'..='z' | 'A'..='Z' => Token::Atom(c),
                _ => Token::Op(c),
            })
            .collect::<Vec<_>>();
        tokens.reverse();
        Lexer { tokens }
    }

    fn next(&mut self) -> Token {
        self.tokens.pop().unwrap_or(Token::Eof)
    }

    fn peek(&mut self) -> Token {
        self.tokens.last().copied().unwrap_or(Token::Eof)
    }
}

fn expr(input: &str) -> S {
    let mut lexer = Lexer::new(input);
    expr_bp(&mut lexer, 0)
}

fn expr_bp(lexer: &mut Lexer, min_bp: u8) -> S {
    let mut lhs = match lexer.next() {
        Token::Atom(it) => S::Atom(it),
        Token::Op('(') => {
            let lhs = expr_bp(lexer, 0);
            assert_eq!(lexer.next(), Token::Op(')'));
            lhs
        }
        Token::Op(op) => {
            let ((), r_bp) = prefix_binding_power(op);
            let rhs = expr_bp(lexer, r_bp);
            S::Cons(op, vec![rhs])
        }
        t => panic!("bad token: {:?}", t),
    };

    loop {
        let op = match lexer.peek() {
            Token::Eof => break,
            Token::Op(op) => op,
            t => panic!("bad token: {:?}", t),
        };

        if let Some((l_bp, ())) = postfix_binding_power(op) {
            if l_bp < min_bp {
                break;
            }
            lexer.next();

            lhs = if op == '[' {
                let rhs = expr_bp(lexer, 0);
                assert_eq!(lexer.next(), Token::Op(']'));
                S::Cons(op, vec![lhs, rhs])
            } else {
                S::Cons(op, vec![lhs])
            };
            continue;
        }

        if let Some((l_bp, r_bp)) = infix_binding_power(op) {
            if l_bp < min_bp {
                break;
            }
            lexer.next();

            lhs = if op == '?' {
                let mhs = expr_bp(lexer, 0);
                assert_eq!(lexer.next(), Token::Op(':'));
                let rhs = expr_bp(lexer, r_bp);
                S::Cons(op, vec![lhs, mhs, rhs])
            } else {
                let rhs = expr_bp(lexer, r_bp);
                S::Cons(op, vec![lhs, rhs])
            };
            continue;
        }

        break;
    }

    lhs
}

fn prefix_binding_power(op: char) -> ((), u8) {
    match op {
        '+' | '-' => ((), 9),
        _ => panic!("bad op: {:?}", op),
    }
}

fn postfix_binding_power(op: char) -> Option<(u8, ())> {
    let res = match op {
        '!' => (11, ()),
        '[' => (11, ()),
        _ => return None,
    };
    Some(res)
}

fn infix_binding_power(op: char) -> Option<(u8, u8)> {
    let res = match op {
        '=' => (2, 1),
        '?' => (4, 3),
        '+' | '-' => (5, 6),
        '*' | '/' => (7, 8),
        '.' => (14, 13),
        _ => return None,
    };
    Some(res)
}

#[test]
fn tests() {
    let s = expr("1");
    assert_eq!(s.to_string(), "1");

    let s = expr("1 + 2 * 3");
    assert_eq!(s.to_string(), "(+ 1 (* 2 3))");

    let s = expr("a + b * c * d + e");
    assert_eq!(s.to_string(), "(+ (+ a (* (* b c) d)) e)");

    let s = expr("f . g . h");
    assert_eq!(s.to_string(), "(. f (. g h))");

    let s = expr(" 1 + 2 + f . g . h * 3 * 4");
    assert_eq!(
        s.to_string(),
        "(+ (+ 1 2) (* (* (. f (. g h)) 3) 4))",
    );

    let s = expr("--1 * 2");
    assert_eq!(s.to_string(), "(* (- (- 1)) 2)");

    let s = expr("--f . g");
    assert_eq!(s.to_string(), "(- (- (. f g)))");

    let s = expr("-9!");
    assert_eq!(s.to_string(), "(- (! 9))");

    let s = expr("f . g !");
    assert_eq!(s.to_string(), "(! (. f g))");

    let s = expr("(((0)))");
    assert_eq!(s.to_string(), "0");

    let s = expr("x[0][1]");
    assert_eq!(s.to_string(), "([ ([ x 0) 1)");

    let s = expr(
        "a ? b :
         c ? d
         : e",
    );
    assert_eq!(s.to_string(), "(? a b (? c d e))");

    let s = expr("a = 0 ? b : c = d");
    assert_eq!(s.to_string(), "(= a (= (? 0 b c) d))")
}

fn main() {
    for line in std::io::stdin().lock().lines() {
        let line = line.unwrap();
        let s = expr(&line);
        println!("{}", s)
    }
}
```

코드는 [이 레포](https://github.com/matklad/minipratt)에서도 확인해볼 수 있습니다. Eof.
