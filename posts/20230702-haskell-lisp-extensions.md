---
title: '하스켈로 간단한 Lisp 만들기 - 확장판'
tags:
  - ko
  - haskell
---

하스켈로 LISP 만들기의 [첫 번째](20230616-haskell-lisp-parsing)와 [두 번째](20230618-lisp-eval) 포스트에서는 Lisp S-Expression의 파싱, 평가 방식을 간단하게 알아보았다. 너무도 간단해서 사실상 할 수 있는 것은 표현식 평가가 전부였다.

그 이후로 다양한 기능들을 추가해 토이 인터프리터를 확장해보았다. 아래 코드는 확장한 Lisp의 기능을 활용하여 작성할 수 있는 프로그램이다.

```lisp
(define (is-prime-helper n x)
  (if (< n (* x x))
      true
      (if (= 0 (% n x))
          false
          (is-prime-helper n (+ 1 x)))))

(define (is-prime n)
  (if (< n 2)
      false
      (is-prime-helper n 2)))

(is-prime 479001599)
```

이 포스트에서는 이전 포스트들처럼 언어를 확장하는 과정을 처음부터 끝까지 소개하기보다는, 어떤 기능들이 추가되었는지, 구현하며 내부적으로 어떤 부분이 흥미로웠는지 소개하겠다.

## 파일 단위 실행

[2부 - 평가](20230618-lisp-eval) 포스트에서 코드를 직접 실행할 수 있는 REPL을 만들어 인터프리터의 엔트리포인트로 만들었었다. 확장한 이후에는 `python`처럼 REPL을 실행할수도, 파일을 실행할수도 있다.

이와 같은 `test.lisp` 파일이 있다고 가정했을 때:

```lisp
(+ 1 2 3)
(* 2 4 6)
```

이 파일을 인자로 인터프리터에 넘기면 각각의 평가된 값이 출력된다.

```bash
$ stack run whisper-exe test.lisp
6
48
```

파일명 이전에 `-i` 플래그를 넘기면, 파일을 실행한 이후의 상태를 그대로 물려받은 REPL을 실행할 수 있다.

이번에는 이와 같은 `test.lisp`가 있을 때:

```lisp
(define (add-two a b) (+ a b))
```

`-i` 플래그를 넘겨 실행해보면, `add-two` 함수가 그대로 접근 가능하다.

```bash
$ stack run whisper-exe -- -i examples/def.lisp

>> (add-two 1 2)
3
>> add-two
<function>
```

이 기능은 Lisp 코드를 수정하지 않고 여러 값을 넣어 함수 호출을 해보고 싶을 때 유용하다.

## `Boolean`과 조건 표현식

`if` 함수를 이용해 조건 분기를 할 수 있다. 이를 위해 `boolean`타입의 값과 표현식을 추가했다.

```bash
>> true
true
>> false
false
>> (if true 3 5)
3
>> (if false 3 5)
5
```

## 다양한 네이티브 함수

기존에 있던 산술연산자 외에 비교연산자와 논리연산자를 구현했다.

```bash
>> (< 3 5)
True
>> (= 3 5)
False
>> (~ true)
False
>> (|| true true false)
True
>> (&& false false true)
False
>> (% 5 3)
2
>> (/ 5 3)
1
>> (if (< 3 5) 3 5)
3
```

## `define`을 이용한 전역변수 및 사용자 정의 함수 선언

`define` 함수를 이용하면 다음과 같이 변수를 사용할 수 있다.

```lisp
(define global 3)

global            ; 3
(+ global global) ; 6
```

첫번째 인자가 괄호에 감싸져 있다면 함수가 된다.

```lisp
(define (add-two a b) (+ a b))

(add-two 42 3)    ; 45
```

## 재귀함수 지원

이 언어에는 반복문이 없다.

하지만 괜찮다. 진정한 상남자 프로그래머는 반복문을 사용하지 않는다. 재귀를 사용한다!

```lisp
(define (add-range-helper start end acc)
        (if (< end start)
            acc
            (add-range-helper (+ 1 start) end (+ start acc))))

(define (add-range start end)
  (add-range-helper start end 0))

(add-range 1 10) ; 55
```

## Functions as Values

네이티브 함수와 사용자 정의 함수는 값으로 취급되어 다음과 같이 다른 함수의 인자에 전달할 수도 있다.

```lisp
(define (apply-f-to-x f x) (f x))

(define (times-two x) (* x 2))
(define (add-two x) (+ x 2))

(apply-f-to-x times-two 3) ; 6
(apply-f-to-x add-two 3)   ; 5
```

## `StateT`와 `Either` 타입을 이용한 환경 조작 및 에러 처리

이번 프로젝트를 하며 가장 큰 의의는 모나드 트랜스포머(monad transformer)를 실제로 사용해봤다는 것이다. 기존에는 환경(Environment)를 `State` 모나드로 처리하고 있었다. 표현식을 평가하는 함수라면 항상 환경을 필요로 할 것이었고, 새로운 바인딩이 추가되면 환경을 수정해야 했기 때문이었다.

이를 `StateT`로 바꿔야겠다고 생각했던 이유는 에러처리 때문이었다. 기존에는 에러처리를 하스켈의 `error` 함수로 했었다. 이 때문에 `error` 함수가 있는 경로로 코드가 실행되면 그냥 프로그램이 죽어버렸다. 이를 처리하기 위해 평가 결과 타입을 단순히 `Value`를 사용하기보다 `Either String Value`를 사용하면 되겠다고 생각을 했다. 그러려면 `State` 모나드의 타입이 대략 이렇게 생겨야 한다:

```haskell
newtype State s a = State { runState :: s -> Either String (a, s) }
```

참고로 원래 `State` 타입은 이렇게 생겼다.

```haskell
newtype State s a = State { runState :: s -> (a, s) }
```

근데 `s`, `a`를 적당히 조작하는 것으로는 위쪽에 있는 타입은 만들 수 없다. 여기서 [`StateT`](https://hackage.haskell.org/package/mtl-2.3.1/docs/Control-Monad-State-Lazy.html#t:StateT)가 등장한다.

```haskell
newtype StateT s (m :: Type -> Type) a = State { runState :: s -> m (a, s) }
```

이를 `StateT Env (Either String) a`와 같이 사용하면 필요했던 타입을 만들 수 있고, 모나드 조작도 간편하게 할 수 있다. 아래는 scope-local 변수를 제공하는 `let` 함수의 코어 부분을 구현하는 `applyLet` 함수의 모습이다.

```haskell
type ExecState = StateT Env (Either String)

applyLet :: [Sexpr] -> ExecState Value
applyLet [decls, expr] = do
  ogEnv <- get
  extendWithDecls decls
  val <- evalSexpr expr
  put ogEnv
  return val
applyLet _ = lift . Left $ "Let construct must include two elements. A declaration and an expression!"

extendWithDecls :: Sexpr -> ExecState ()
-- ...
```

구현부를 보면 일반 `State` 모나드처럼 `get`을 통해 상태를 접근하는 것을 확인할 수 있다. `Either String` 타입으로 감싸져 있지만 말이다. `ogEnv`와 `val`은 원래와 같이 각각 `Env`, `Value` 타입이다. 마지막에 `return`을 하면 `Right`에 감싸져서 돌려준다.

반면 유효하지 않은 인자들의 경우 에러를 발생시키고 싶을 것이다. `applyLet _`의 구현부는, `Left`를 이용해 만든 `Either String Value` 타입을 `StateT` 타입의 값으로 변환시켜준다. `lift`만 사용하면 자동으로 `StateT`의 값으로 승격되며, 이 개념은 어떤 transformer를 사용해도 동일하게 적용할 수 있다.

이걸 처음 도입하려고 하면서 꽤나 머릿속이 복잡했었는데, 그래도 조금씩 이해하며 그 가치를 느낄 수 있었다. 사실 아직은 조금 마법같다. 아래는 이에 대한 [하스켈 위키](https://wiki.haskell.org/Monad_Transformers_Explained)의 설명 중 하나다:

> Monad transformers are like onions. At first, they make you cry but then you learn to appreciate them. Like onions, they're also made of layers. Each layer is the functionality of a new monad, you lift monadic functions to get into the inner monads and you have transformerised functions to unwrap each layer.

모나드 트랜스포머를 처음 봐도 눈물을 터뜨리지 않도록 조심하자.

## 마무리

비교적 간단한 프로젝트였지만 꽤 의미있는 경험이었다. 하스켈 코드를 작성하면서 느낀 것이지만 컴파일러를 잘 달래주면 많은 양의 버그가 사라지는 것 같다. 기억에 남는 버그는 함수 호출 시 환경을 병합할 때 `Map.union t1 t2`의 암묵적인 우선순위를 인지하지 못하고 그냥 사용해버려서 인자가 제대로 안 넘어가는 경우였는데, 하스켈에서 `trace`, `traceM` 등 순수 함수 안에서도 로그를 찍을 수 있는 짱짱한 도구들이 있어 잘 해결할 수 있었다.

또 하스켈이 이론적인 기반이 탄탄하다 보니 다양한 패턴들에 대한 내장 함수들이 많은 듯했다. 나름 내 아이디어로 내가 알고 있는 함수들을 이렇게 저렇게 조합하고 나니, hls(haskell language server)가 처음 들어보는 내장함수를 내밀며 "이 함수 하나를 써서 네가 방금 쓴 엉망 코드를 리팩토링하지 않겠니?"라는 제안을 받아본 것이 꽤 여러번이다.

마지막으로, 나는 이 포스트에 있는 기능을 추가하는 모든 과정을 영상에 담았다. 편집을 안한 정말 날것이라 다시 돌려볼 가치는 크게 없겠으나 녹화를 하며 코딩을 하니 감회가 달랐다. 어디 내놓기 부끄럽지만 유튜브에 [플레이리스트](https://www.youtube.com/playlist?list=PLZlApiQaKgfRrWRgC7Vaqck1VW5x6zHWS)를 만들어 두었다. 지금은 부끄럽기 짝이 없지만 나중에 돌려보며 웃을 수 있는 영상이 되었으면 좋겠다.
